---
title: "Promises/A+: From Concepts to Implementation"
date: 2025-10-30
tags:
  - JavaScript
  - Promise
  - Promises/A+
  - Async
  - Frontend
source: https://juejin.cn/post/7566809515284774963
---

# Promises/A+: From Concepts to Implementation

> ✨Article Summary (AI Generated)
>
<!-- DESC SEP -->
>
> Explore **Promise states, then, and thenables**, followed by the resolution procedure and asynchronous callback scheduling. The article walks through a custom Promise implementation and shows how to test it with promises-aplus-tests.
>
<!-- DESC SEP -->

> I have been thinking about writing this for a long time, yet whenever I sit down to do it, I am not sure where to begin. A simple explanation risks feeling too shallow; practical usage is already covered very clearly on MDN, which is where I first learned about it myself. Looking back, I miss those days of being a blank slate, full of enthusiasm and seemingly endless energy for learning something new. But I am getting sidetracked. On to the article >>

**Note ⚠️:** This article assumes some JavaScript knowledge and focuses on the core concepts behind `Promise` and how to implement them. If you are just starting out, being comfortable using promises is enough. You can revisit their implementation once you have a deeper understanding of asynchronous execution.

## Core concepts

### Promise states

A `Promise` has three internal states: `pending`, `fulfilled`, and `rejected`. These states define its behavior throughout its lifetime and determine its final outcome.

1. **`pending`**: The initial state. The asynchronous operation has not finished and is waiting to be fulfilled or rejected.
2. **`fulfilled`**: The operation has succeeded and has a definite resulting value. Once this state is reached, it cannot change.
3. **`rejected`**: The operation has failed and has a definite reason for failure. This state cannot change either.

The resulting value can be `undefined`. For a reference value, “cannot change” means that the reference itself—the memory address—cannot be replaced, rather than that the object's internal properties are immutable.

### The `then` method

The `then` method provides access to the eventual result of an asynchronous operation. It accepts two arguments, `onFulfilled` and `onRejected`, and chooses which callback to execute according to the current state. It always returns a new `Promise`, enabling chaining.

1. **`onFulfilled`** runs when the state is `fulfilled`. If it is a function, it receives the current `value`. Otherwise, the value passes through directly to the next `then`.
2. **`onRejected`** runs when the state is `rejected`. If it is a function, it receives the current `reason`. Otherwise, the error passes through to the next link in the chain.

The value returned by `onFulfilled` may be an ordinary value, a `thenable`, or another `Promise`. The implementation handles these return values through a common resolution procedure so that a chain can correctly determine its final result. We will explore that procedure below.

Promises/A+ also requires `onFulfilled` and `onRejected` to run asynchronously. They do not execute immediately in the current event loop; they are placed in the microtask queue and run after the current code finishes. The implementation of this mechanism is discussed later as well.

### What is a `thenable`?

One of the central ideas in Promises/A+ is **interoperability**. The specification is not concerned with a particular Promise implementation. Instead, it focuses on a common interface: the `then` method.

An object or function with a conforming `then` method can be treated as a **thenable** and work with other implementations that follow Promises/A+.

Here is a simple way to illustrate whether a value is a thenable:

```javascript
const isObject = (x) => x !== null && typeof x === "object";
const isFunction = (x) => typeof x === "function";

const value = {then() { // do something }};
if(isObject(value) || isFunction(value) && isFunction(value.then)) {
    console.log("这家伙是一个thenable!!!");
}
```

As this example shows, a `value` that meets these conditions is considered a thenable. Regardless of the Promise implementation it comes from—even a third-party library—it can be incorporated and resolved, making interoperability possible.

### The resolution procedure 🌟

To determine the final fulfillment value, a `Promise` further processes the value returned by the `onFulfilled` callback passed to `then`—assuming here that the callback is a function. It must account for circular references, returned promises or thenables, and nested values.

1. **Circular references.** A promise's eventual state depends on the returned value, which we will call `x`. If `x` is a thenable object or function, the promise depends on it: fulfillment of `x` fulfills the promise, and rejection of `x` rejects it. But if `x` is the promise itself, it ends up waiting for itself. It has to finish before it can finish, yet it can never finish because it is still waiting. Confusing? Think of trying to lift yourself into the air by stepping on your own feet. These examples show the problem:

```javascript
// case 1
const promise = new Promise((resolve) => {
 setTimeout(() => {
   resolve(promise)
 });
});
// case 2
let outer;
const promise = new Promise((resolve) => resolve());
const promise2 = promise.then(() => outer);
outer = promise2;

/**
* Both examples create circular references, which promises do not allow.
* The resolution procedure throws immediately in these cases. Do not underestimate Promise robustness 😱
*/
```

2. **Handling the return value.** The implementation checks whether the value is a thenable object or function. Interoperability requires it to find the final fulfillment value and wait for the nested values to settle. An error encountered along the way rejects the promise with that reason. To deal with nonconforming thenables, referred to below as `x`, the resolution procedure takes two precautions.

   - **Access `x.then` only once.** A getter can have side effects, change its return value between accesses, or throw an exception. Reading the property once prevents repeated accesses from producing inconsistent behavior. For example:

```javascript
// case 1: the second access to then throws
const thenable = {
get then() {
  if (!this.called) {
    this.called = true;
    return (resolve) => resolve('ok');
  }
  throw new Error('第二次访问 then 出错');
},
};
new Promise((resolve) => resolve(thenable)).then(console.log, console.error);

// case 2: delete then after the first access
const thenable2 = {
get then() {
  delete this.then;
  return (resolve) => resolve('ok');
},
};
new Promise((resolve) => resolve(thenable2)).then(console.log);
```

   - **Handle the callbacks of `x.then` only once.** When executing `then.call(x, onFulfilled, onRejected)`, a nonconforming implementation may invoke the callbacks multiple times, invoke both, or throw an exception. An internal flag such as `called` ensures that only the first invocation is processed, while `try...catch` captures potential errors. If `onFulfilled` returns another value, that value is recursively resolved until the final result is obtained.

### Asynchronous execution

Section **3.1** of the specification requires `onFulfilled` and `onRejected` to execute asynchronously, after the event-loop turn in which `then` was called and on a new call stack. In an ECMAScript implementation, this typically means **Promise callbacks run after the current macrotask finishes and before the next macrotask starts**. They therefore go into a queue with priority over macrotasks: the **microtask queue**.

The specification also mentions mechanisms such as `process.nextTick` and `MutationObserver` for asynchronous scheduling. Where these microtask mechanisms are unavailable, an implementation can fall back to `setTimeout` or `setImmediate` to preserve asynchronous execution.

```javascript
var runMicroTask = (() => {
  if (typeof process === "object" && typeof process.nextTick === "function") {
    runMicroTask = process.nextTick;
  } else if (typeof MutationObserver === "function") {
    const queue = [];
    const ob = new MutationObserver(() => {
      const arr = queue.slice();
      queue.length = 0;
      for (const cb of arr) cb();
    });
    const textNode = document.createTextNode("0");
    ob.observe(textNode, { characterData: true });

    let toggle = 0;
    runMicroTask = (fn) => {
      queue.push(fn);
      toggle = (toggle + 1) % 2;
      textNode.data = String(toggle);
    };
  } else {
    runMicroTask = (fn) => setTimeout(fn, 0);
  }

  return runMicroTask;
})();
```

## Implementation

```javascript
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * Recursively resolve x, handling thenables and ordinary values
 * Reject circular references and handle onFulfilled/onRejected only once
 */
const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected"));
  }

  if (isObject(x) || isFunction(x)) {
    let called = false; // Handle callbacks only once
    try {
      let then = x.then; // Read the then method
      if (isFunction(then)) {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (!called) {
        called = true;
        reject(e);
      }
    }
  } else {
    resolve(x);
  }
};

class MyPromise {
  #state = PENDING;  // Internal state
  #result = undefined; // Stored result
  #handlers = [];      // then/catch callback queue

  /**
   * Constructor
   * @param {function} executor Executor accepting resolve and reject
   */
  constructor(executor) {
    const resolve = (value) => {
      resolvePromise(
        this,
        value,
        (v) => this.#changeState(FULFILLED, v),
        (r) => this.#changeState(REJECTED, r)
      );
    };

    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  /**
   * then method
   * @param {function} onFulfilled Fulfillment callback
   * @param {function} onRejected Rejection callback
   * @returns {MyPromise} Return a new promise
   */
  then(onFulfilled, onRejected) {
    const resolver = MyPromise.withResolver();
    this.#handlers.push({
      onFulfilled,
      onRejected,
      ...resolver,
    });
    this.#run();
    return resolver.promise;
  }

  /**
   * catch method, equivalent to then(null, onRejected)
   * @param {function} onRejected Rejection callback
   * @returns {MyPromise} Return a new promise
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * Factory returning a promise and its resolve/reject functions
   * @returns {{promise: MyPromise, resolve: function, reject: function}}
   */
  static withResolver() {
    let resolve, reject;
    const promise = new MyPromise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }

  /**
   * Internal method: execute queued callbacks
   * Schedule asynchronously (microtasks) and process return values
   */
  #run() {
    if (this.#state === PENDING) return;
    while (this.#handlers.length) {
      let { promise, resolve, reject, onFulfilled, onRejected } =
        this.#handlers.shift();
      onFulfilled = isFunction(onFulfilled) ? onFulfilled : (v) => v;
      onRejected = isFunction(onRejected) ? onRejected : (e) => { throw e; };
      const callback = this.#state === FULFILLED ? onFulfilled : onRejected;
      runMicroTask(() => {
        try {
          const x = callback(this.#result);
          resolvePromise(promise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  /**
   * Internal method: change state and trigger callbacks
   * @param {string} state New state
   * @param {*} result Result value
   */
  #changeState(state, result) {
    if (this.#state !== PENDING) return; // State transitions are irreversible
    this.#state = state;
    this.#result = result;
    this.#run();
  }
}
```

## Testing against the specification

1. Initialize a project and install `promises-aplus-tests`.

```bash
npm init -y
npm i promises-aplus-tests -D
```

2. Import the test dependency and `MyPromise`, then add an adapter for the tests.

```javascript
const promisesAplusTests = require("promises-aplus-tests");
const MyPromise = require("./promise.js");

MyPromise.deferred = MyPromise.withResolver;

promisesAplusTests(MyPromise, (err) => {
 console.log("测试完成，结果：", err ? "有错误" : "全部通过 ✅");
});
```

## References

[Promises/A+](https://promisesaplus.com/)

[Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

---

Written by Galen. Originally published in Chinese on [Juejin](https://juejin.cn/post/7566809515284774963).
