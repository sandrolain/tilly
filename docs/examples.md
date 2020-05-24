# EXAMPLES


## from(data)

Shortcut for Promise initialization.

```javascript
import { from } from "tilly";

const result = await from((ok, ko) => {
  ok("Resolved!");
});

console.log(result);
// "Resolved!"
```

---

## ok(data)

Shortcut for *Promise.resolve*.

```javascript
import { ok } from "tilly";

const result = await ok("Resolved!");

console.log(result);
// "Resolved!"
```

---

## ko(error)

Shortcut for *Promise.reject*.

```javascript
import { ko } from "tilly";

const result = await ko("Something went wrong");
// Error("Something went wrong")
```

---

## all(promise, promise, ...)

Shortcut for *Promise.all*, with the ability to pass the promises as single arguments.

```javascript
import { all, ok } from "tilly";

const result = await all(
  ok("Result #1"),
  ok("Result #2"),
  ok("Result #3")
);

console.log(result);
// ["Result #1", "Result #2", "Result #3"]
```

---

## race(promise, promise, ...)

Shortcut for *Promise.race*, with the ability to pass the promises as single arguments.

```javascript
import { race, ok } from "tilly";

const result = await race(
  (resolve) => { setTimeout(() => { resolve("One"); }, 600); },
  (resolve) => { setTimeout(() => { resolve("Two"); }, 200); },
  (resolve) => { setTimeout(() => { resolve("Three"); }, 400); },
);

console.log(result);
// "Two"
```

---

## to(promise)

Function that allows the safe use of await without the need for a try / catch. In case of rejection the error is captured and returned.<br/>
The structure of the result of the function is an object with two properties: "success" true / false and depending on the case "payload" or "error" evaluated.

```javascript
import { to, ok, ko } from "tilly";

const result1 = await to(
  ok("Resolved!")
);

console.log(result1);
// {"success": true, "payload": "Resolved!"}

const result2 = await to(
  ko("Something went wrong")
);

console.log(result2);
// {"success": false, "error": Error("Something went wrong")}
```

---

## chain(promise, then, then, ...)

Function that allows you to execute a promise followed by a sequence of transformations of the returned value through a chain of calls to the then() method.

```javascript
import { chain } from "tilly";

const result = await chain(
  (ok, ko) => {
    ok(2);
  },
  (value) => {
    return value * 2;
  },
  (value) => {
    return value + 3;
  }
);

console.log(result);
// 7
```

---

## every(promise, promise, ...)

Similar to the "all" function but with the "to" function applied to each element.<br/>
This allows to obtain the result of each Promise, both in case of resolution and rejection.

```javascript
import { every, ok, ko } from "tilly";

const result = await every(
  ok("Result #1"),
  ko("Error #2"),
  ok("Result #3")
);

console.log(result);
// [{"success": true, "payload": "Result #1"},
//  {"success": false, "error": Error("Error #2")},
//  {"success": true, "payload": "Result #3"}]

```

---

## sleep(time, promise)

This function in conjunction with the use of await allows pausing the execution of the current context.<br/>
Without the use of await it allows you to perform a Promise with delay.

```javascript
import { sleep } from "tilly";

const result = await sleep(3000, "wake up!");

console.log(result);
// "wake up!"
```

---

## delay(promise, time)

This function delay the resolution of a promise.<br/>
De facto is an alias of sleep() function with inverse not-optional arguments

```javascript
import { delay } from "tilly";

const result = delay("wake up!", 3000);

console.log(result);
// "wake up!"
```

---

## retry(times, executor)

This function allows you to execute the call to Promise several times in the case of re-rejection, until there is a resolution or the attempts are exhausted.

```javascript
import { retry } from "tilly";

const result = await retry(3, (resolve, reject, i, n) => {
  if(i == n) {
    resolve("At the last attempt");
  } else {
    reject(new Error("Failed attempt"));
  }
});

console.log(result);
// "At the last attempt"
```

---

## cache(promiseGenerator [, cacheTime])

Generate a function that invoke a generator parameter and return the same Promise until this reject or if is elapsed a specified time

```javascript
import { cache, ok, ko } from "tilly";

const getResolved = cache(() => ok("Result!"));
const prom1 = getResolved();
// wait Promise resolves/rejects…
const prom2 = getResolved();

console.log(prom1 === prom2);
// true

const getRejected = cache(() => ko("Error!"));
const prom3 = getRejected();
// wait Promise resolves/rejects…
const prom4 = getRejected();

console.log(prom3 === prom4);
// false
```
