---
title: "深入 Promises/A+：从原理到实现"
date: 2025-10-30
tags:
  - JavaScript
  - Promise
  - Promises/A+
  - Async
  - Frontend
source: https://juejin.cn/post/7566809515284774963
---

# 深入 Promises/A+：从原理到实现

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
> 从 **Promise 的三种状态、then 方法与 thenable** 出发，梳理 Promises/A+ 的解析过程和异步回调机制。文章给出自定义 Promise 的实现，并介绍如何使用 promises-aplus-tests 验证规范兼容性。
>
<!-- DESC SEP -->

> 想了很久，还是打算将这个东西拿出来讲一讲，每当准备奋笔疾书的时候，又不知从何开始。就说解释一下吧，其实东西就那么点儿，很容易被人说水文章，又说具体用法呢，其实 MDN 上已经阐述的非常清楚了。在我当初刚接触这个知识点的时候，我也是在里面入的门，回想起那段废寝忘食的日子里，还真是怀念那种白纸的状态，对学习任何东西都是一腔热血，好似有用不完的精力……好像有点扯远了，点击进入正文 >>

**注意⚠️**：这篇文章适合已经具备一定 JavaScript 基础的同学阅读，主要讲解 `Promise` 的核心概念与原理实现。对于初学者而言，能够熟练使用 `Promise` 已经足够了，待后续深入理解异步机制时，再回过头来研究其实现原理会更有收获。

## 核心概念

### Promise 状态

`Promise` 具有三种内部状态：`pending`、`fulfilled` 和 `rejected`。这三种状态贯穿了 `Promise` 的整个生命周期，用于约束其行为和结果的最终走向。

1. `pending` **（待定）** ：表示初始状态，意味着当前异步操作尚未完成，正在等待被解决（`fulfilled`）或被拒绝（`rejected`）。

2. `fulfilled` **（已完成）** ：表示操作成功完成，此时必须有一个确定的值作为结果，该状态一旦确定便不可更改。

3. `rejected` **（已拒绝）** ：表示操作失败，此时必须有一个确定的失败原因（reason），同样一旦确定便不可更改。

需要注意的是，这个确定的值可以是空值（undefined）。 当值是引用类型时，“不可更改”指的是引用本身（即内存地址）不可再被替换，而非对象的内部属性不可更改。

### `then` 方法

`Promise` 提供的 `then` 方法用于访问异步操作的最终结果。  
 它接受两个参数：`onFulfilled` 和 `onRejected`，并根据当前状态决定执行哪个回调函数。  
 该方法始终返回一个新的 `Promise`，从而实现链式调用。

1. **`onFulfilled`**：当状态为 `fulfilled` 时执行。  
    如果该参数是函数，则以当前的 `value` 作为入参执行；  
    如果不是函数，则发生“状态穿透”，当前的 `value` 会被直接传递给下一个 `then`。

2. **`onRejected`**：当状态为 `rejected` 时执行。  
    如果该参数是函数，则以当前的 `reason` 作为入参执行；  
    如果不是函数，则同样发生“状态穿透”，错误会被直接传递给下一个链式调用。

需要注意的是，`onFulfilled` 的返回值可能是普通值、`thenable` 对象，甚至是一个 `Promise`。  
 为了确保链式调用能够正确解析最终结果，内部会对返回值进行统一处理，这部分逻辑会在后文展开。

此外，根据 Promises/A+ 规范的要求，`onFulfilled` 和 `onRejected` 都必须在异步环境中执行，也就是说，它们不会在当前事件循环立即触发，而会被放入微任务队列中，等待本轮代码执行完毕后再运行。 这一点同样会在后文中详细分析其实现机制。

### 什么是 `thenable`？

`Promise` 的 A+ 规范中，最核心的思想之一是 **互操作性（Interoperability）** 。  
 该规范并不关心 `Promise` 的具体实现方式，而是聚焦于一个统一的接口——`then` 方法。  
 换句话说，只要一个对象或函数具备符合规范的 `then` 方法，它就可以被视为一个 **thenable**，并能与其他遵循 A+ 规范的 Promise 实现互相协作。

可以用以下代码来直观地判断一个值是否为 thenable：

```javascript
const isObject = (x) => x !== null && typeof x === "object";
const isFunction = (x) => typeof x === "function";

const value = {then() { // do something }};
if(isObject(value) || isFunction(value) && isFunction(value.then)) {
    console.log("这家伙是一个thenable!!!");
}
```

从这段代码可以看到，只要 `value` 满足这些条件，就被认为是一个 thenable。  
 这意味着无论它来自哪种 Promise 实现（甚至是第三方库），都可以被安全地“接入”并解析，从而实现真正的跨实现兼容性。

### 解析过程 🌟

`Promise`为了正确得到最终完成的值，对传入 `then` 方法的 `onFulfilled`回调函数（这里我们肯定它就是一个函数）返回值做了进一步处理，它需要考虑到是否有循环引用，回调函数的返回值是否是一个 `Promise`或者是`thenable`，以及嵌套的情况。

1. 对于循环引用问题，一个`Promise`的状态走向取决于它返回的值，如果说这个值（这里命名为`x`）是`thenable`对象或函数，那么该`Promise`就会依赖它，当`x`满足时，`Promise`完成；当`x`被拒绝时，`Promise` 拒绝。假如这个`x`是`Promise`实例本身，那么就会造成自己等自己的现象，也就是说我要等待我自己完成，但我还没完成，所以我必须等我自己完成，可是我又永远不会完成，因为我在等我自己，是不是很绕？其实道理很简单，听过左脚踩右脚螺旋升天的人应该秒懂了，我们用代码来描述下：

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
   * 上面两个就是典型的造成循环引用问题，在Promise中是不允许的！！！
   * 当出现这种代码时，在RP过程开始就直接抛出错误了，不要小强Promise的健壮性😱
   */
   ```

2. 对于返回值的处理，就是进一步的判断该值是否为`thenable`对象或函数。因为`Promise`具有互操作性，它要查找最终完成的值，等待内部节点统一完成后，才能算完成。如果在这个查找过程中发生了错误，那么就直接拒绝，将这个失败原因抛出。在这个过程中，`Promise`做了两件规避不合规的`thenable`（下文我们统一用`x`来表示）对象或函数的事情。

   1. **确保 `x.then` 只被访问一次**，这样做是为了防止访问器属性（getter）带来的副作用，避免多次访问导致行为不一致。 在 JavaScript 中，访问器属性的值可能会在多次访问之间发生变化，甚至直接抛出异常。例如：

      ```javascript
      // case 1: 第二次访问 then 抛错
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

      // case 2: 第一次访问后删除 then
      const thenable2 = {
      get then() {
        delete this.then;
        return (resolve) => resolve('ok');
      },
      };
      new Promise((resolve) => resolve(thenable2)).then(console.log);
      ```

   2. **确保 `x.then` 的两个回调只会触发一次**，当执行 `then.call(x, onFulfilled, onRejected)` 时，可能存在不规范实现导致两个回调被多次调用，甚至抛错。 因此规范要求使用一个内部标志（如 `called`）来保证只会处理第一次调用，并在 `try...catch` 中捕获潜在错误。 如果 `onFulfilled` 返回一个值，则会对该值递归解析，直到获取最终结果。

### 异步环境执行

在规范 **3.1** 中指出，应当确保 `onFulfilled` 和 `onRejected` 的执行是异步的，也就是说，它们必须在调用 `then` 的那一轮事件循环结束后，并在一个新的调用栈中执行。在 `ECMAScript` 的实现中，这通常意味着 **Promise 的回调会在当前宏任务执行结束后、下一轮宏任务开始前执行**，因此这些任务被放入一个 **优先于宏任务执行的任务队列**，也就是 **微任务队列（microtask queue）** 。 规范同时也提到可以使用 `process.nextTick` 或 `MutationObserver` 等机制来实现这种异步调度；若宿主环境不支持这些微任务机制，则可以降级为使用 `setTimeout` 或 `setImmediate` 来保证异步性。

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

## 代码实现

```javascript
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

/**
 * 递归解析x，用于处理 thenable 或普通值
 * 确保循环引用被拒绝，保证 onFulfilled/onRejected 回调只执行一次
 */
const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected"));
  }

  if (isObject(x) || isFunction(x)) {
    let called = false; // 确保回调只执行一次
    try {
      let then = x.then; // 获取 then 方法
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
  #state = PENDING;  // 内部状态
  #result = undefined; // 内部存储的结果值
  #handlers = [];      // then/catch 回调队列

  /**
   * 构造函数
   * @param {function} executor 执行器函数，接收 resolve 和 reject
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
   * then 方法
   * @param {function} onFulfilled 成功回调
   * @param {function} onRejected 失败回调
   * @returns {MyPromise} 返回新的 promise
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
   * catch 方法，等价于 then(null, onRejected)
   * @param {function} onRejected 失败回调
   * @returns {MyPromise} 返回新的 promise
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * 工厂方法，返回一个 promise + resolve/reject 对象
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
   * 内部方法：执行队列中的回调
   * 保证异步执行（微任务）并处理返回值
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
   * 内部方法：改变状态并触发回调
   * @param {string} state 新状态
   * @param {*} result 状态值
   */
  #changeState(state, result) {
    if (this.#state !== PENDING) return; // 状态不可逆
    this.#state = state;
    this.#result = result;
    this.#run();
  }
}
```

## 规范测试

1. 初始化项目，并安装`promises-aplus-tests`依赖。

   ```bash
   npm init -y
   npm i promises-aplus-tests -D
   ```

2. 引入依赖和`MyPromise`，并添加一个适配器接口用于测试。

   ```javascript
   const promisesAplusTests = require("promises-aplus-tests");
   const MyPromise = require("./promise.js");

   MyPromise.deferred = MyPromise.withResolver;

   promisesAplusTests(MyPromise, (err) => {
    console.log("测试完成，结果：", err ? "有错误" : "全部通过 ✅");
   });
   ```

## 参考链接

[Promises/A+](https://promisesaplus.com/)

[Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

---

本文由 Galen 创作，原文发布于[掘金](https://juejin.cn/post/7566809515284774963)。
