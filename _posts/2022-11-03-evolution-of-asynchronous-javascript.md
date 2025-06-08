---
layout: post
title: "The Evolution of Asynchronous in JavaScript"
date: 2022-11-03
read_time: "12 min read"
---

# Evolution of asynchronous in JS

Today asynchronous operations are very similar to synchronous ones, the only difference in appearance is the `async` and `await` keywords.

In reality, they only seem similar, a lot is going on under the hood. To really understand how asynchronous operations work in JavaScript, we will travel back in time to the language origin, and follow the evolution of asynchronous code in Javascript.

But first what are asynchronous operations anyway?

## What is an Asynchronous Operation? And Why do we Need Them?

An asynchronous operation is a long-running, non-blocking task, like:

* waiting 10 seconds
* asking something to a distant server and waiting for the answer
* waiting for a button click before executing a function.

In most programming languages, you create a new thread (a subprogram) to run the task in parallel on a separate processor thread. And then it's a (complicated) matter of communicating between the two threads.

JavaScript is different: it is single-threaded, so no sub-program runs in parallel. A single-threaded program can only do one single thing at a time. So if you tell it to wait, he will wait and do nothing else in the meantime.

Javascript is a single-threaded language, yet it does not have this shortcoming. It is able to wait for an event to happen while doing other work in the meantime.

Because it uses an event loop.

The event loop is central to Javascript functioning. JavaScript treats every code instruction as an event in a queue. When waiting for a given amount of time before executing a task it will:

1. Add a `wait` event at the end of the event queue,
2. Continue unstacking events from the queue,
3. When the `wait` event turn comes up, JavaScript will then either execute the scheduled task if the time has come or put the event back at the end of the queue. (this is why setTimeout, is not precise btw.)

In the beginning, this was mostly used to handle user events.

## 1995: at the Beginning Everything was Synchronous (or not)

At the start, JavaScript was only a browser language. No one anticipated that it would become the full-stack language it became today. At the start, the JavaScript job was to make the page interactive, like showing a modal when clicking a button. And there was no data fetching.

The first example of asynchronous code that comes to mind is setTimeout.

```typescript
setTimeout(() => {
  console.log("1 second later");
}, 1000);
```

`setTimeout` is a function that takes another function and a delay in milliseconds. When called, it returns immediately. Then once the delay has passed the function gets called.

This was useful for coding animation. (`requestAnimationFrame` did not exist at the time).

But `setTimeout` was not the most used method used to register a function to get called later.

One far more common asynchronous operation on the browser was handling user interaction. When you want to react to a user clicking on a button, you do not know when the user will click, or if he will click at all.

On DOM elements, you can listen to events (click, focus, blur, mouseover,....). You register a function to an event, and that function will get called every time that event occurs.

To handle user interaction asynchronously the DOM elements use a pattern called event emitter.

For example, you can register a function on a `click` event like this:

```typescript
var button = document.getElementById("button");
button.addEventListener("click", function () {
  console.log("The button was clicked");
});
```

And every time someone clicks the button, it calls the registered function.

This event emitter pattern works wonders for that. After all, 27 years later, it is still the one we use. But if it works wonders for user interaction, what about other asynchronous operations?

Enter `XMLHTTPRequest` .

## 1999-2006: Ajax and XMLHTTPRequest

AJAX (short for *Asynchronous Javascript and XML*) was first introduced in 1999. AJAX is a set of development techniques to create asynchronous applications.

AJAX allows to send and retrieve data from a server asynchronously. Nowadays, being able to do that is a given. But at the time this was a game changer. Before the introduction of AJAX, to display new content you had to reload the whole page. And to send data we needed to post forms.

AJAX was only the concept though. The implementation came from the `XMLHTTPRequest` , first introduced in Internet Explorer 5.0. The year was 1999.

It wasn't until 2006 that the `XMLHTTPRequest` became widely used. (And it was only fully standardized by the W3C in 2016.). And XMLHttpRequest used the event emitter pattern, using the following events:

* abort
* error
* load
* loadend
* loadstart
* progress
* readystatechange
* timeout

We used it like this:

```typescript
const request = new XMLHttpRequest();
request.addEventListener("load", function () {
  console.log(this.responseText);
});
request.addEventListener("error", function (event) {
  // handle the error event
});
// add other event listener...

request.open("GET", "http://www.example.org/example.txt");
request.send();
```

And it seemed OK. Because on the browser, there were not a lot of other asynchronous operations to do.

Until JavaScript became usable on the server.

## 2009: Node, In the beginning, there were callbacks

And then came Node: JavaScript on the server. And on the server, there is a lot of asynchronous operation to do:

* reading a file
* querying a database
* calling another server
* ...

From the start, Node decided to abstract the event listener away whenever possible.

The asynchronous operations would be simple functions, not complex objects like `XMLHTTPRequest` .

This function would take one more argument: the callback. The callback is a function that the asynchronous operation will call once complete.

This callback would work as a single event listener. For simple asynchronous operations like waiting 5 seconds, the callback would be really simple:

```typescript
wait5Seconds(() => {
  console.log("5 seconds later");
});
```

But more complex asynchronous operations have two possible outcomes, either they fail or they succeed. So this callback accepts 2 arguments, an error, and a result:

```typescript
doSomethingRisky((error, result) => {...});
```

If the operation succeeds it calls the callback with the result and no error. And if it failed it calls the callback with the error and no result.

For example when reading a file:

```typescript
const fs = require("node:fs");

const getFileCharSize = (path, callback) => {
  fs.readFile(path, (error, content) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, content.length);
  });
};
```

The first issue with callback is error handling. You cannot catch errors thrown in a callback outside of it.

```typescript
try {
  fs.readFile(
    path,
    (error, result) => {
      throw new Error("BOOM!");
    },
    1000
  );
} catch (error) {
  // Nothing caught here
}
// Uncaught exception BOOM!
```

So when using a callback you must make sure to handle every possible error. Or failing that pass them to the next callback. This is why Node chooses to pass the eventual error as the first argument of the callback as a convention.

Another issue arises when you need to chain several operations. The code could become a sorry mess, giving birth to the callback hell. AKA the pyramid of doom.

### The Dreaded Pyramid of Doom

So what does it looks like if you need to chain several asynchronous operations?

```typescript
// note: request has been deprecated since 2020
const request = require("request");
const fs = require("node:fs");

// source is a path toward a file that contains an url
const fetchAndSave = (callback) => {
  fs.readFile(source, function (error, url) {
    if (err) {
      callback(error);
      return;
    }
    request(source, (error, response, body) => {
      if (error) {
        callback(error);
        return;
      }
      fs.writeFile(`${source}-result`, body, (error) => {
        if (error) {
          callback(error);
          return;
        }
        callback(undefined, "done");
      });
    });
  });
};
```

The more you chain operation the more you move to the right adding more and more indentation. Indentation forms a pyramid.: the pyramid of doom. And with each indentation a new context.

Look at all the code duplication to handle the errors. And if at any one point in the chain you forget to pass an error, or do an operation that can fail without wrapping it inside a try-catch, you get an uncaught exception.

## 2012 - 2015: The Promise of a Solution

That's why libraries like [bluebird](https://github.com/petkaantonov/bluebird/) introduced Promise to JavaScript. The main issue with callback is that the function using them returns nothing. The program flow disappears into the callback never to return.

What about, instead, returning an object representing the state of the asynchronous operation? A Promise is a placeholder for a future result. The promise of a result. And how does Promise do this? They use callbacks.

A promise takes two callback as arguments:

* `resolve` that we call with the result
* `reject` that we call with the error if any

Of course, we should only call one of those two callbacks.

For example, if we want to convert an asynchronous function to return a Promise instead, we can do:

```typescript
const fs = require("request");

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    });
  });
};
```

When you get a Promise you can call `.then` to pass it two callbacks. The first one listens to the `resolved` event. It gets called with the value passed to the resolve callback.

```typescript
new Promise((resolve) => resolve("result")).then(
  (result) => {
    // result is 'result';
  },
  (error) => {
    // never called
  }
);
```

And the second one listens to the `rejected` event. And receive value passed to the reject callback.

```typescript
new Promise((resolve, reject) => reject("error")).then(
  (result) => {
    // never called
  },
  (error) => {
    // error is 'error'
  }
);
```

There is also a `catch` method to add a listener to the rejected event.

Note that the `Promise` constructor will catch errors thrown in its function argument. This will trigger the rejected event.

```typescript
const p = new Promise(() => {
  throw new Error("BOOM");
}).catch((error) => {
  // error is Error('BOOM')
});
```

But if you never specify a rejected event handler, then the error will become an `Uncaught` error

```typescript
const p = new Promise((resolve, reject) => {
  reject(new Error("Boom"));
});
// Uncaught (in promise) Error: Boom
```

The `then` and `catch` methods accept function returning `Promise` and return a `Promise`. This means it is possible to chain promises:

```typescript
// Note: node possess a `node:fs/promises` packages that already have Promise version of all fs methods.
const fs = require("node:fs/promise");

const fetchAndSave = (source) => {
  return fs
    .readFile(source)
    .then((url) => {
      return requestPromise(url);
    })
    .then((body) => {
      return fs.writeFile(source, body);
    });
};
```

Note that I did not specify any rejected handler in that example. When adding no reject handler to a promise the error will go up to the chained promise until someone catches it. If no one catches it, it will burst into an uncaught exception.

This is great because no need to specify the same error-handling logic again and again.

Promises are so much better than callback: no more callback hell and error handling is a breeze. But at the beginning there was one main issue: promises were not widely used. Most libraries, even Node core, used callbacks.

To use Promise you needed:

* a library (like bluebird)
* to add code to convert from promise to node callback style and back.

Another lesser issue is that code with Promise was still different from the synchronous code. Enter the generator function and the [co](https://github.com/tj/co) package: the ancestor to `async/await` .

## 2015 Now that we have Promise let's hide them

ECMAScript 2015 introduced generators at the same time as `Promise`.

Now, finally, promises were officially part of the language. Generators are functions able to pause their execution by yielding a value, and then resume with another one. To do that they return an iterator.

A simple example:

```typescript
function* greeting() {
  const name = yield `What's your name?`;
  return `Hello ${name}`;
}

// Retrieving the iterator, nothing is executed yet
const iterator = greeting();

// Executing the generator up to the first yield
const { value, done } = iterator.next();
// value: the yielded value here `What's your name?`
// done: boolean indicating wether the generator is at the end.

// Resuming the generator by passing the "Tint" value
// "Tint" become the result of the yield operation
const { value, done } = iterator.next("Tint");
// value: `Hello Tint`
// done: true
```

You can also resume the generator with an error:

```typescript
function giveMeAnError*() {
    try {
        yield 'An error please'
    } catch (error) {
        yield `I caught "${error.message}"`;
    }
}

const iterator = giveMeAnError();
const { value } = iterator.next();
// value: 'An error please'
const { value } = iterator.throw(new Error('Take that'));
// value: 'I caught "Take that"'
```

What is interesting here is the ability to yield a value and get back another one. This means we can abstract away operations done on a yielded value, and get the result. Like, let's say yield a Promise and gets back its result.

The library `co` did that for asynchronous operation. It's the ancestor of `async/await` . It allowed generators to yield a Promise and gets back the Promise's result. Co takes a generator as its argument and returns a Promise.

Here is a simple implementation:

```typescript
const co = (generator) => {
    const iterator = generator();
    let firstYieldedResult = iterator.next();

    return new Promise((resolve, reject) => {
        // we create a recursive loop function
        function loop(yieldedResult) {
            // if at the end we resolve with the value
            if (yieldedResult.done) {
                resolve(yieldedResult.value);
                return;
            }
            // handle the promise
            yieldedResult.value
                // on rejected throw the error back into the generator
                .catch(error => iterator.throw(error))
                // on resolved resume the generator with the result
                .then(result iterator.yieldedResult(result))
                // catch uncaught regenerator error
                .catch(reject)
                // loop on the new iterator result
                .then(loop);
        }

        loop(firstYieldedResult);
    });
};
```

It was used like this:

```typescript
const fetchAndSave = (source) =>
  co(function* () {
    const url = yield fs.readFile(source);
    const body = yield requestPromise(url);

    yield fs.writeFile(source, body);
  });
```

Since at the time, promises were not used, `co` also supported `thunk` . A thunk was a simple modification of the normal callback pattern. Instead of having a function that would take a callback as its last argument. We modified the function to return a new function taking this callback. Like so:

```typescript
const thunkReadFile = (source) => {
  return (callback) => fs.readFile(source, callback);
};
```

There was even a [thunkify](https://github.com/tj/node-thunkify) library to convert node-style callback functions to thunks.

## 2017: async/await

Two years later ECMAScript 2017 added `async/await` , rendering `co` obsolete.

With `async/await` you can write asynchronous code like synchronous one. With the `async` keyword, you can declare a function as being async. An async function will always return a promise:

```typescript
const fn = async () => 5; // Promise(5)
```

An async function can use the `await` keyword in its body. `Await` works like yield with `co` . It means it:

* takes a Promise
* pauses the function
* resolves the promise
* resumes the function with the promise's result.

## 2020: Top-level await

Finally, ECMAScript 2020 introduced top-level await. Top-level `await` allows using the `await` keyword at the top level of a module.

```typescript
// config.js
const config = await getConfig();
export default config;
```

It can then be imported normally.

```typescript
// index.js
import config from "./config";
// do something with the config
```

In this case, the index module will wait for the config module to resolve before executing its body.

## Conclusion

And this is how we got from event listener to async/await. At every step building upon what came before correcting the issues along the way:

* The callback used the event listener,
* The promise used the callback and the event listener,
* Async/await uses Promise

Asynchronicity has come a long way in Javascript but is it the end? I for one hope not, after all, we should always strive to do better.

          