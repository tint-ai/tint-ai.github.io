---
layout: post
title: "Setting Up Remote Development Environments on Qovery"
date: 2026-04-23
author: jonathan@tint.ai
hero_image: "/assets/images/remote-development-environments-on-qovery/hero.png"
---

Supporting engineers across macOS, WSL2, and Linux is painful. Docker is supposed to make it transparent; in practice it never fully is. Platform-specific quirks, subtle tooling differences, and one-off environment fixes were eating into our platform team's time. Remote Development Environments (RDEs) were the answer.

We evaluated a few platforms and quickly noticed that what they offered (several containers running together as a single environment) is exactly what Kubernetes already does. Since we use Qovery to manage our Kubernetes cluster, we asked them directly. RDEs weren't supported out of the box, but Romaric Philogène, Qovery's CEO, was up for a shared experiment. They brought platform expertise; we brought business context and internal knowledge. The result is a POC we're actually happy with.

This post covers the full journey: why we needed RDEs, why we landed on Qovery, and the technical setup in detail. We'll also look at where this is heading: Agentic Development Environments where anyone on the team, **including non-technical people**, can spawn a fully configured stack on demand and let autonomous agents work inside it, unattended and in a secured way. Think Lovable, but for your entire engineering stack.

<!--more-->

## Why Remote Dev Environments

Local development works fine, until it doesn't. As our stack grew, we kept running into the same categories of friction, especially painful when the team is scattered across different operating systems. Here are three examples among others that finally pushed us to act.

### Cross-platform friction

Our engineers run macOS, Windows (WSL2), and Linux. Docker is supposed to abstract that away. It doesn't. Not fully.

**Native modules.** pnpm installs architecture-specific binaries (`esbuild`, `swc`, `sharp`, etc.). For performance reasons, we run tests natively on the host, but some services require Docker containers. That means two binary flavors of `node_modules` at the same time. This dual installation is a constant source of confusion, slow to set up, and breaks in subtle ways with every tooling upgrade.

**File watching on WSL2.** Docker Compose uses named volumes to persist `node_modules` inside containers. On WSL2, those volumes end up mounted on top of the bind-mounted workspace, so the container's filesystem shows the volume, not your actual source files. File watchers inside the container watch the wrong layer, `inotify` events never fire, and hot reload silently breaks. WSL2 compatibility is a recurring effort, not a solved problem.

**Docker bind mount performance on macOS.** Docker on macOS runs inside a Linux VM. Every file I/O call crosses the VM boundary, adding latency that compounds fast: a `pnpm install` that takes 30 seconds on Linux can take several minutes on macOS. Builds, test runs, TypeScript compilation: all slower. The gap between local and CI timings creates a persistent blind spot that's hard to debug.

**Time-consuming testing.** Every core platform change required validation on both Mac and Windows. In addition to being slow, it requires cross-individual testing: either an engineer owns a couple of machines, or they need to coordinate with a colleague. For a fully remote, async team, neither is practical. Our platform team was spending more time on environment maintenance than on features.

### Resource limits

A laptop is not infinitely scalable. Between Slack, a browser (crazy how much RAM a simple website can consume in 2026, right?), VS Code, a music player, and a full local dev stack, engineers regularly run out of memory. When multiple projects need to run simultaneously, it's not a question of optimizing. The machine simply hits its ceiling.

RDEs decouple compute from the local machine entirely. Your laptop becomes your AI development client, a window into an environment that runs elsewhere, on dedicated resources, without competing with anything on your desk.

### Parallel isolated environments

When working on multiple features simultaneously (or running several autonomous agents in parallel), we need multiple copies of the full stack running at the same time. The natural move is to clone the repository several times and spin each one up. But Docker Compose assigns fixed ports by default, so two instances immediately conflict. The workaround is to introduce port-offset environment variables, but that overcomplicates the configuration and makes the stack harder to reason about. Any change to service ports now requires updating multiple files across multiple clones.

Options like git worktrees exist, but they share the same local services and run into the same collision problems. Like Boris Cherny, an engineer at Anthropic, we prefer cloning the repository multiple times: one full, isolated environment per task. It's simpler, prevents any configuration clash, and scales to as many parallel workloads as needed.

<div>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I should have clarified above, I use 5 separate git checkouts of the same repo</p>&mdash; Boris Cherny (@bcherny) <a href="https://twitter.com/bcherny/status/2007200880081436864?ref_src=twsrc%5Etfw">January 2, 2026</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

Remote environments solve this cleanly: each clone runs in its own Kubernetes environment, with its own network, its own databases, and no awareness of any other running instance.

### Agentic development

Running Claude Code autonomously on a developer's laptop means the agent has access to SSH keys, API tokens, browser sessions, and local credentials. That's a significant blast radius for a prompt injection or a runaway task. We want agents isolated inside a dedicated container with strict network controls: only the external services they legitimately need, nothing else.

We've written about this in detail in our [YOLOing Responsibly post](https://tech.tint.ai/yoloing-responsibly-with-claude-code/). The short version: you want iptables-level egress rules, blocked access to local credential stores, and no way for an agent to exfiltrate data through an unexpected channel. An RDE is the natural execution boundary for all of this.

### Agent lifecycle

There's something qualitatively different about a development environment that keeps running when you close your laptop. Start an agent on a task, step away, and pick it back up later: from your phone on the train, from a tablet at the gym, or from a different machine entirely. The process is still running: VS Code tunnel, SSH session, background agent, whatever. Nothing was lost.

That's not just a convenience. It changes how you think about longer tasks. Instead of blocking a session to a single sitting, you can kick off a multi-hour agent run, live your life, and check in when it makes sense. Productivity without the tether.

## Our First Attempt with Ona

We scanned a few solutions ([GitHub Codespaces](https://github.com/features/codespaces), [Daytona](https://www.daytona.io/), [Ona](https://www.ona.com/) (the rebranded Gitpod)) and decided to go with Ona to give it a try.

We set it up against our stack: one devcontainer running all our application services, one Postgres container, one Elasticsearch container. It worked. The devcontainer integration was clean, each environment got its own URL, and the multi-service model felt natural.

But as we got deeper into the setup, something became obvious: what Ona was offering was remarkably close to what Qovery already does for us. Multiple services running together, configurable like a Kubernetes cluster, with one environment per developer as an easy next step.

On top of that, running RDEs on our own AWS infrastructure (rather than Ona's hosted offering) required upgrading to a higher plan, adding significant cost on top of what we were already paying Qovery to manage our Kubernetes cluster. The economics didn't add up.

This raised an interesting question: could we just do this on Qovery? Following up on our already exciting relationship with them, we reached out to explore how RDEs could fit into their product. Romaric was immediately interested: he could see the value, and it aligned with where Qovery was heading. [That first conversation](https://www.linkedin.com/feed/update/urn:li:activity:7435338469784313856/) set the whole experiment in motion.

## Setting Up RDEs on Qovery

Here's what we actually built: infrastructure-as-code all the way down, and we're genuinely excited about how far this POC got. The setup is technical, but it proves the concept works. And the best part: the Qovery team is already working on making this experience much smoother, so future adopters won't have to go through all of this manually.

### Architecture Overview

Each developer gets their own Qovery environment, cloned from a blueprint. The three services reflect our specific stack; yours would differ based on your dependencies:

- **devcontainer**: the actual development machine (4 CPU, 16GB RAM)
- **Postgres**: our relational database
- **Elasticsearch**: our search engine

The devcontainer runs VS Code Server via `code tunnel`, which lets us connect our local VS Code directly to the remote environment.

<div style="position: relative; left: 50%; transform: translateX(-50%); width: min(95vw, 1100px); margin-bottom: 1.5rem;">
  <iframe src="/assets/images/remote-development-environments-on-qovery/architecture-diagram.html" frameborder="0" scrolling="no" title="Per-developer Qovery environment — architecture diagram" style="display: block; width: 100%; background: white;" onload="this.style.height = this.contentDocument.body.scrollHeight + 'px'"></iframe>
</div>

The experience feels identical to local development. The only noticeable difference is the very first time you open a folder: VS Code needs to download the remote file index, which takes around 500ms. After that, everything is snappy, with no latency we could attribute to the remote connection.

### Dockerfile and Entrypoint

The devcontainer image is based on [Chainguard's Wolfi-based Node image](https://images.chainguard.dev/directory/image/node/overview). Nothing exotic; just a standard Node image, but with CVEs patched automatically. The free tier lets you use the `latest` tag, which always pulls the most recently patched version. That's ideal for dev environments: if an update breaks something, you fix it: it's not production.

The interesting part is how we start the dev servers alongside VS Code tunnel.

The naive approach is to run both as background processes in the entrypoint. The problem is that Docker containers need a foreground process; if everything is backgrounded, the container exits immediately. And if you use `exec` to put one process in the foreground, it doesn't receive signals from the other.

The pattern we landed on is `trap + wait`:

```bash
# Start dev servers in background
pnpm dev &
DEV_PID=$!

# On SIGTERM/SIGINT (container stop), kill both processes
trap 'kill $DEV_PID $TUNNEL_PID 2>/dev/null; wait $DEV_PID $TUNNEL_PID' SIGTERM SIGINT

# Start VS Code tunnel in foreground
code tunnel --accept-server-license-terms --cli-data-dir /tmp/vscode-cli &
TUNNEL_PID=$!

# Wait keeps the container alive and forwards signals
wait $TUNNEL_PID
```

This means both processes receive signals on container stop, and neither can crash silently without taking down the other. No PM2, no supervisor. Just bash.

### Terraform Infrastructure

The whole setup is defined with the [Qovery Terraform provider](https://registry.terraform.io/providers/Qovery/qovery/latest/docs).

In Qovery, a **blueprint environment** is a template: a fully configured environment you define once and clone on demand. Each clone becomes an independent, isolated environment with its own services, network, and storage. For RDEs, this means one blueprint definition and one Terraform command to spin up a new environment for any developer.

Start with the blueprint environment:

```hcl
resource "qovery_environment" "rde_blueprint" {
  project_id = var.qovery_project_id
  name       = "rde-blueprint"
  mode       = "DEVELOPMENT"
  cluster_id = var.qovery_cluster_id
}
```

Then the devcontainer:

```hcl
resource "qovery_container" "devcontainer" {
  environment_id = qovery_environment.rde_blueprint.id
  name           = "devcontainer"
  registry_id    = var.registry_id
  image_name     = "cgr.dev/chainguard/node"
  tag            = "latest"
  cpu            = 4000
  memory         = 16384

  storage = [
    {
      id          = "home"
      name        = "home"
      mount_point = "/home/node"
      size        = 20
      type        = "FAST_SSD"
    }
  ]

  env_vars = [
    { key = "DATABASE_URL",         value = "postgresql://user:pass@${qovery_database.postgres.internal_host}:5432/mydb" },
    { key = "ELASTICSEARCH_HOST",   value = qovery_container.elasticsearch.internal_host },
    { key = "ELASTICSEARCH_PORT",   value = "9200" },
    { key = "IDLE_TIMEOUT_MINUTES", value = "30" },
  ]

  secrets = [
    { key = "GITHUB_TOKEN",         value = var.github_token },
    { key = "RDE_QOVERY_API_TOKEN", value = var.qovery_api_token },
  ]
}
```

**Persistent volume.** We mount a single 20 GB `FAST_SSD` volume at `/home/node`. The project lives there too, so a container restart loses nothing: source code, `node_modules`, Claude Code config, shell history, and plugins all survive.

**Internal hostnames.** Services in the same Qovery environment can reach each other via their internal hostname, exposed as `.internal_host` on each Terraform resource. That's how `DATABASE_URL` and `ELASTICSEARCH_HOST` are constructed; Qovery handles the service discovery, no hardcoded IPs needed.

**Secrets.** `GITHUB_TOKEN` and `QOVERY_API_TOKEN` are declared as secrets rather than plain env vars; Qovery encrypts them at rest and never exposes them in logs. `GITHUB_TOKEN` feeds the git credential helper so `git push` works without any extra setup. `RDE_QOVERY_API_TOKEN` lets the idle monitor call the Qovery REST API to stop the environment automatically when nobody is connected (more on that below).

**Fresh environment database state.** When a new RDE is created, the Postgres database starts empty. Migrations and seeding run automatically as part of the RDE initialization script.

### No Docker-in-Docker

This one surprised us. The integration tests for our database and search packages used to call `docker compose up` inside `globalSetup.ts` to spin up Postgres and Elasticsearch before the test run. In an RDE, there's no Docker binary, and Qovery discourages Docker-in-Docker for security reasons.

The fix was to replace the shell-outs with **environment-driven readiness checks**. Instead of starting services ourselves, we wait for them to be ready:

```typescript
// Before: shell out to docker compose
execSync('docker compose -p zeus-test up -d --wait postgres');

// After: retry loop against DATABASE_URL
async function waitForPostgres(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const client = new Client(process.env.DATABASE_URL);
      await client.connect();
      await client.end();
      return;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('Postgres did not become ready in time');
}
```

The same pattern works for Elasticsearch via `GET /_cluster/health`. This makes the test harness work identically in three contexts: local dev (bring up Compose yourself), CI (Compose in the pipeline), and RDE (Qovery-managed services, always running).

### Auto-Shutdown Idle RDEs

Unlike Postgres or Elasticsearch, the devcontainer itself is the expensive part. Even on our relatively light POC, it needed 4 CPU and 16 GB of RAM to run the full dev stack comfortably. Leaving that running overnight when nobody is using it adds up fast. We added an idle monitor that stops the entire Qovery environment when nobody's connected.

Detection counts `sh` and `bash` processes via `ps`, calibrated against a baseline measured on the first poll (after entrypoint startup subshells have settled). Any count above the baseline means someone is connected. Here is the simplified script:

```bash
#!/usr/bin/env bash
set -euo pipefail

POLL_INTERVAL="${POLL_INTERVAL:-60}"
IDLE_TIMEOUT_SECONDS=$((IDLE_TIMEOUT_MINUTES * 60))
SHELL_BASELINE=""
idle_seconds=0

is_active() {
  [[ "$1" -gt "$SHELL_BASELINE" ]]
}

stop_environment() {
  curl -s -X POST "https://api.qovery.com/environment/${QOVERY_ENVIRONMENT_ID}/stop" \
    -H "Authorization: Token ${RDE_QOVERY_API_TOKEN}"
}

while true; do
  sleep "$POLL_INTERVAL"

  # Calibrate on first iteration — entrypoint subshells have exited by now
  if [[ -z "$SHELL_BASELINE" ]]; then
    SHELL_BASELINE=$(ps -eo comm= | grep -c -x -E 'sh|bash' || true)
  fi

  shell_count=$(ps -eo comm= | grep -c -x -E 'sh|bash' || true)

  if is_active "$shell_count"; then
    idle_seconds=0
  else
    idle_seconds=$((idle_seconds + POLL_INTERVAL))

    if [[ "$idle_seconds" -ge "$IDLE_TIMEOUT_SECONDS" ]]; then
      stop_environment && exit 0
    fi
  fi
done
```

`QOVERY_ENVIRONMENT_ID` is a [built-in variable automatically injected by Qovery](https://hub.qovery.com/docs/using-qovery/configuration/environment-variable/) into every container at runtime, with no manual wiring needed.

Stopping the environment brings down all services. Persistent volumes are retained, so nothing is lost. When a developer comes back, they click "Deploy" in the Qovery console and the environment resumes in a couple of minutes with everything intact.

Because our cluster runs Karpenter, the savings go further: once the pods are gone, Karpenter detects the now-empty node and terminates the underlying EC2 instance automatically. No idle compute sitting around; the AWS resources are released until the environment is deployed again.

### Network Auditing

This was the piece we felt most strongly about. When Claude Code runs autonomously in an RDE, you want to control what it can reach. We've covered the full rationale in our [YOLOing Responsibly post](https://tech.tint.ai/yoloing-responsibly-with-claude-code/). The short version: an unsupervised agent that can reach arbitrary external services is a footgun.

The constraint on Qovery is that containers don't have `CAP_NET_ADMIN`, so no `iptables`, no kernel-level network policies. We worked around this with two layers running inside the container: `squid` for HTTP/S filtering, and `dnsmasq` for DNS filtering.

#### Squid

`squid` runs as a forward proxy on `127.0.0.1:3128`. The configuration is minimal: no caching, just a hostname ACL loaded from a separate allowlist file:

```conf
# squid.conf
http_port 127.0.0.1:3128
cache deny all
cache_dir null /tmp

acl allowed_domains dstdomain "/etc/squid/allowlist.conf"
http_access allow allowed_domains
http_access deny all
```

The allowlist uses **exact hostnames only**: no leading dots, no parent suffixes. A broad entry like `.github.com` would silently allow arbitrary GitHub subdomains including raw file downloads and third-party package repos. Add only the specific host your stack needs, and extend it as `TCP_DENIED` entries appear in the `squid` access log:

```
# squid.allowlist.conf

# Anthropic — Claude API
api.anthropic.com

# GitHub — git HTTPS, gh CLI, GitHub Packages
github.com
api.github.com
npm.pkg.github.com

# Node package registry
registry.npmjs.org

# AWS — SSM + STS
ssm.us-east-1.amazonaws.com
sts.amazonaws.com

# Linear MCP
api.linear.app

# Context7 MCP
mcp.context7.com

# Qovery (idle-monitor)
api.qovery.com

# VS Code tunnel
update.code.visualstudio.com
vscode.download.prss.microsoft.com

# Playwright MCP browser binaries
playwright.download.prss.microsoft.com
cdn.playwright.dev
```

Copy both files in your Dockerfile:

```dockerfile
COPY squid.conf           /etc/squid/squid.conf
COPY squid.allowlist.conf /etc/squid/allowlist.conf
```

For processes to route through `squid` automatically, set all six proxy env var variants. `curl` (via `libcurl`) [only recognizes lowercase](https://curl.se/libcurl/c/libcurl-env.html) `http_proxy` and `https_proxy`, while most other tools check uppercase first, so both are needed:

```dockerfile
ENV HTTPS_PROXY=http://127.0.0.1:3128 \
    HTTP_PROXY=http://127.0.0.1:3128 \
    https_proxy=http://127.0.0.1:3128 \
    http_proxy=http://127.0.0.1:3128 \
    NO_PROXY=localhost,127.0.0.1,::1 \
    no_proxy=localhost,127.0.0.1,::1
```

#### dnsmasq

`squid` only catches processes that honor the proxy env vars. A tool that ignores them still has to resolve DNS, and that's where `dnsmasq` comes in. It acts as the container's DNS resolver and returns `0.0.0.0` for any hostname outside the allowlist, making it unreachable even if the proxy is bypassed.

The allowlist mirrors `squid`'s exactly: one `server=` entry per exact hostname. The `address=/#/0.0.0.0` catch-all at the bottom silently blocks everything not listed:

```conf
# dnsmasq.conf
no-resolv
no-hosts
listen-address=127.0.0.1

server=/api.anthropic.com/1.1.1.1
server=/github.com/1.1.1.1
server=/api.github.com/1.1.1.1
server=/npm.pkg.github.com/1.1.1.1
server=/registry.npmjs.org/1.1.1.1
server=/ssm.us-east-1.amazonaws.com/1.1.1.1
server=/sts.amazonaws.com/1.1.1.1
server=/api.linear.app/1.1.1.1
server=/mcp.context7.com/1.1.1.1
server=/api.qovery.com/1.1.1.1
server=/update.code.visualstudio.com/1.1.1.1
server=/vscode.download.prss.microsoft.com/1.1.1.1
server=/playwright.download.prss.microsoft.com/1.1.1.1
server=/cdn.playwright.dev/1.1.1.1

address=/#/0.0.0.0
```

Copy the config in your Dockerfile and point `resolv.conf` at `dnsmasq` from the entrypoint; it must be done at runtime as root, before dropping to the app user, so the app user cannot redirect DNS:

```dockerfile
COPY dnsmasq.conf /etc/dnsmasq.conf
```

```bash
# entrypoint.sh (root section)
echo "nameserver 127.0.0.1" > /etc/resolv.conf
chmod 0444 /etc/resolv.conf
```

Start `dnsmasq` before `squid`; `squid` needs to resolve its ACL domains on startup:

```bash
dnsmasq -k &
squid -N -f /etc/squid/squid.conf &
```

#### What this doesn't cover

**DNS-over-HTTPS (DoH).** Tools like `chromium` bypass the system DNS resolver and send queries over HTTPS to a hardcoded endpoint; `dnsmasq` never sees them. If you run `playwright` tests inside the RDE, disable DoH explicitly, otherwise the browser quietly bypasses the allowlist:

```typescript
// playwright.config.ts
use: {
  launchOptions: {
    args: ['--disable-features=DnsOverHttps'],
  },
},
```

**Direct IP access.** A process connecting to a hardcoded IP skips DNS entirely. Neither `dnsmasq` nor `squid` can intercept it.

Both gaps require enforcement at the kernel level to close properly. [Cilium](https://cilium.io/), which Qovery has on their roadmap, operates at the lowest possible layer, independently of what processes do with DNS or proxy settings. Once it lands, we'll be able to replace all the current mitigations with a single network policy and achieve true isolation.

## The Tint CLI

We already had a `tint` CLI, and we enriched it to support remote dev environments. `tint init` handles first-time setup: it prompts for your full name, GitHub token, and Qovery API token, and stores them in `~/.tint/tint-cli.json`. After that, everything flows from a single subcommand:

```
$ tint rde --help

Manage Remote Dev Environments (tint rde v0.1.0)

USAGE tint rde create|start|stop|status|delete

COMMANDS

  create    Clone blueprint, deploy, and create a new RDE        
   start    Resume a stopped RDE                                 
    stop    Stop/pause the RDE (preserves workspace and database)
  status    Show current RDE status                              
  delete    Destroy the RDE (with confirmation prompt)           

Use tint rde <command> --help for more information about a command.
```

`tint rde create` asks which project to build for, then handles everything automatically:

```
$ tint rde create

✔  Select the project to build the RDE for  › Zeus

Cloning blueprint into Zeus...
Setting GITHUB_TOKEN secret...
Deploying Zeus...
Waiting for deployment (polling every 10s, timeout 10min)...

┌─── How to connect ─────────────────────────────────────────────
│  VS Code Remote Tunnels:
│    1. Run: qovery log (select "Dev Container (ECR)")
│    2. Copy the GitHub device code from the logs
│    3. Authenticate at https://github.com/login/device
│    4. Install the "Remote - Tunnels" extension in VS Code
│    5. Connect to tunnel: Zeus
│
│  Qovery shell:
│    qovery shell
└────────────────────────────────────────────────────────────────

◆  RDE created successfully! Environment: Zeus
```

The implementation enforces a few conventions to keep things predictable. Source projects are any project not prefixed `RDE -`. Each developer gets a dedicated destination project named `RDE - {fullName}`, and the blueprint is always found by the fixed name `"RDE Blueprint"`:

```typescript
async function selectProjects(client: QoveryClient, orgId: string, fullName: string) {
  const projects = await client.listProjects(orgId);

  // exclude personal RDE projects from the source list
  const sourceOptions = projects
    .filter((p) => !p.name.startsWith("RDE - "))
    .map((p) => ({ value: p.id, label: p.name }));

  const sourceId = await select({ message: "Select the project to build the RDE for", options: sourceOptions });
  const sourceProject = projects.find((p) => p.id === sourceId)!;

  // each developer owns exactly one RDE project
  const destProjectName = `RDE - ${fullName}`;
  const dest = projects.find((p) => p.name === destProjectName)!;

  return { sourceProject, destProject: dest };
}

async function findBlueprint(client: QoveryClient, projectId: string): Promise<string> {
  const environments = await client.listEnvironments(projectId);
  const blueprint = environments.find((e) => e.name === "RDE Blueprint");
  return blueprint!.id;
}
```

Once cloned, the environment is deployed and `GITHUB_TOKEN` is injected as a secret, so `git push`, npm packages, and the VS Code tunnel all work immediately, with no manual credential wiring.

## What the Qovery Skills Would Have Changed

While setting all this up, Qovery released a [Claude Code plugin](https://github.com/Qovery/qovery-skills) with four skills:

- **`/qovery-deploy`**: deploys apps, databases, Helm charts, or Terraform modules; auto-generates Dockerfiles from your codebase
- **`/qovery-troubleshoot`**: diagnoses deployment failures, application crashes, connectivity problems
- **`/qovery-speedup`**: analyzes deployment timelines using the Qovery API, finds bottlenecks in build/startup/health check phases
- **`/qovery-optimize`**: right-sizes resource allocation based on historical consumption data

We set up the RDE infrastructure manually over several weeks. Looking at these skills now, `/qovery-deploy` alone would have bootstrapped the entire blueprint environment from a single prompt. Something like:

> Create a Qovery environment with a Postgres database, an Elasticsearch container, and a devcontainer built from this Dockerfile. The devcontainer should have access to both Postgres and Elasticsearch via their internal hostnames.

That would have generated the Terraform resources, wired up the internal hostnames, and set the right environment variables, covering the bulk of the setup work.

`/qovery-optimize` would have saved us real time too. We started with 2 CPU / 8GB RAM, found it noticeably sluggish for Claude Code sessions, and bumped to 4 CPU / 16GB after trial and error. A skill that analyzes historical consumption and tells you "your p95 CPU is consistently at 85% — double the allocation" would have gotten us there in one shot.

`/qovery-troubleshoot` would have been useful during the early "502 on first boot" phase, when we were debugging entrypoint ordering issues (`dnsmasq` needs to be up before `squid`'s first DNS lookup; `squid` needs to be up before the dev server starts; sequencing matters).

The plugin is installable today. If you're building on Qovery, it's worth adding to your Claude Code setup before you start, not after.

## Agentic Development Environments

Think of an ADE as Lovable for your full stack. The idea is that anyone (engineers, but also marketing, finance, or product) can spin up a fully configured environment running the real application on the real infrastructure, make a change, and test it live. No local setup, no "works on my machine", no asking a developer to deploy something. Just create a remote dev environment in the cloud and go.

For engineers running Claude Code autonomously, it goes further: an agent works on a task unattended for hours inside an isolated sandbox, then surfaces a PR when it's done.

That requires a few things. Here's where we stand:

| Requirement | Status |
|---|---|
| Isolated environment per developer / task | ✅ Qovery blueprint + clone |
| Persistent storage across restarts | ✅ `/home/node` volume |
| Auto-shutdown when idle | ✅ `idle-monitor.sh` |
| Soft network allowlist | ✅ `squid` + `dnsmasq` |
| Hard network enforcement | ⏳ Waiting for Cilium on Qovery |
| One-command environment creation | ✅ Tint CLI |
| Zero-config credential setup | ⏳ Working on it with Qovery |

The main remaining gap is credential setup. Spinning up an RDE today requires a GitHub token, a Qovery API token, and the right access permissions across both services. For engineers, that's already a non-trivial first-time setup. For non-technical people (a marketer who wants to test a landing page variant on the real stack, or a finance analyst who needs to reproduce a data issue), it's a blocker.

The democratization angle we described at the start only works if the setup is truly frictionless. Right now it isn't. We're working with Qovery to streamline this: the goal is for a new team member to run a single command and have a working environment, without ever having to know what a Qovery API token is or where to find it.

## Key Takeaways

1. **RDEs solve more than "cloud laptop" problems.** The real win for us wasn't resource isolation; it was enabling longer autonomous Claude Code sessions and opening up real-stack access to non-developers.

2. **Pick the platform you're already on.** We tried Ona seriously and it has genuine strengths. But the switching costs were real, and we were already deep in Qovery. Don't underestimate the value of reusing existing vendor relationships and tooling.

3. **No Docker-in-Docker is a feature, not a bug.** Being forced to replace `docker compose` shell-outs in tests with proper readiness probes made our test infrastructure better. It now works in three environments without modification.

4. **Idle-shutdown is mandatory.** A 4 CPU / 16 GB environment running 24/7 for five developers adds up quickly. Thirty minutes of inactivity → environment stops → persistent volumes retained → two-minute resume. This should be in every RDE setup from day one.

5. **Soft network allowlists are better than nothing, but plan for hard enforcement.** `HTTPS_PROXY` + `dnsmasq` keeps cooperative tools honest. For truly autonomous agents, you need kernel-level enforcement. Know what you're getting and plan to upgrade.

6. **Install the Qovery skills before you start.** [github.com/Qovery/qovery-skills](https://github.com/Qovery/qovery-skills) would have saved us meaningful setup time. Add it to your Claude Code environment before you need it.

---

*We're still iterating on the ADE setup; the automatic provisioning and pre-configured Claude Code pieces are actively in progress. If you're building something similar or have thoughts on the Cilium timeline, we'd love to hear from you.*
