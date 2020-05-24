/**
 * @packageDocumentation
 * @module tilly
 */

export type ResolveFunction<T> = (value?: T) => void;
export type RejectFunction = (reason?: any) => void;
export type ThenFunction<T=any, R=any> = (value?: T) => R;
export type ExecutorFunction<T> = (resolve: ResolveFunction<T>, reject: RejectFunction) => void;
export type PromiseCreationArgument<T> = Promise<T> | ExecutorFunction<T> | T;
export interface PromiseToResult<T> {
  success: boolean;
  payload?: T;
  error?: Error;
}


/**
 * Shortcut for Promise initialization.
 *
 * ```typescript
 * import { from } from "tilly";
 *
 * const result = await from((ok, ko) => {
 *   ok("Resolved!");
 * });
 *
 * console.log(result);
 * // "Resolved!"
 * ```
 *
 * @param data The Promise, or the executor function, or the value of resolved promise
 */
export function from<T=any> (data: PromiseCreationArgument<T>): Promise<T> {
  if(data instanceof Promise) {
    return data;
  }
  if(typeof data === "function") {
    return new Promise<T>(data as ExecutorFunction<T>);
  }
  return Promise.resolve(data);
}

/**
 * @ignore
 */
function arrayFromArgs<T> (args: T[] | [T[]]): T[] {
  if(args.length === 1 && Array.isArray(args[0])) {
    return args[0] as T[];
  }
  return args as T[];
}

/**
 * @ignore
 */
const promisesFromArgs = <T=any>(args: PromiseCreationArgument<T>[] | [PromiseCreationArgument<T>[]]): Promise<T>[] => {
  return arrayFromArgs<PromiseCreationArgument<T>>(args).map((value: T) => from<T>(value));
};


/**
 * Shortcut for *Promise.resolve*.
 *
 * ```typescript
 * import { ok } from "tilly";
 *
 * const result = await ok("Resolved!");
 *
 * console.log(result);
 * // "Resolved!"
 * ```
 *
 * @param value The resolved result of the Promise
 * @return Resolved promise
 */

export function ok<T=any> (value: T): Promise<T> {
  return Promise.resolve(value);
}


/**
 * Shortcut for *Promise.reject*.
 *
 * ```typescript
 * import { ko } from "tilly";
 *
 * const result = await ko("Something went wrong");
 * // Error("Something went wrong")
 * ```
 *
 * @param value The Error instance or error description string for the rejected Promise
 * @return Rejected promise
 */

export function ko (reason: Error | string): Promise<never> {
  if(typeof reason === "string") {
    reason = new Error(reason);
  }
  return Promise.reject(reason);
}


/**
 * Shortcut for *Promise.all*, with the ability to pass the promises as single arguments.
 *
 * ```typescript
 * import { all, ok } from "tilly";
 *
 * const result = await all(
 *   ok("Result #1"),
 *   ok("Result #2"),
 *   ok("Result #3")
 * );
 *
 * console.log(result);
 * // ["Result #1", "Result #2", "Result #3"]
 * ```
 *
 * @param args The first executor function or Promise to resolve.<br/>The list of executors or Promises to be solved can be passed as individual arguments or as an Array in the first argument.
 */
export function all<T=any> (...args: PromiseCreationArgument<T>[]): Promise<T[]> {
  return Promise.all(promisesFromArgs(args));
}


/**
 * Shortcut for *Promise.race*, with the ability to pass the promises as single arguments.
 *
 * ```typescript
 * import { race, ok } from "tilly";
 *
 * const result = await race(
 *   (resolve) => { setTimeout(() => { resolve("One"); }, 600); },
 *   (resolve) => { setTimeout(() => { resolve("Two"); }, 200); },
 *   (resolve) => { setTimeout(() => { resolve("Three"); }, 400); },
 * );
 *
 * console.log(result);
 * // "Two"
 * ```
 *
 * @param args The first executor function or Promise to resolve.<br/>The list of executors or Promises to be solved can be passed as individual arguments or as an Array in the first argument.
 * @return The first resolved Promise
 */
export function race<T=any> (...args: PromiseCreationArgument<T>[]): Promise<T> {
  return Promise.race(promisesFromArgs(args));
}


/**
 * Function that allows the safe use of await without the need for a try / catch. In case of rejection the error is captured and returned.<br/>
 * The structure of the result of the function is an object with two properties: "success" true / false and depending on the case "payload" or "error" evaluated.
 *
 * ```typescript
 * import { to, ok, ko } from "tilly";
 *
 * const result1 = await to(
 *   ok("Resolved!")
 * );
 *
 * console.log(result1);
 * // {"success": true, "payload": "Resolved!"}
 *
 * const result2 = await to(
 *   ko("Something went wrong")
 * );
 *
 * console.log(result2);
 * // {"success": false, "error": Error("Something went wrong")}
 * ```
 *
 * @param data The Promise to manage
 * @return Promise with managed result object
 */
export async function to<T=any> (data: PromiseCreationArgument<T>): Promise<PromiseToResult<T>> {
  return from<T>(data)
    .then(
      (payload: T): PromiseToResult<T> => ({ success: true, payload }),
      (error: Error): PromiseToResult<T> => ({ success: false, error })
    );
}


/**
 * Function that allows you to execute a promise followed by a sequence of transformations of the returned value through a chain of calls to the then() method.
 *
 * ```typescript
 * import { chain } from "tilly";
 *
 * const result = await chain(
 *   (ok, ko) => {
 *     ok(2);
 *   },
 *   (value) => {
 *     return value * 2;
 *   },
 *   (value) => {
 *     return value + 3;
 *   }
 * );
 *
 * console.log(result);
 * // 7
 * ```
 *
 * @param start Function/Promise/mixed The Promise, or the executor function for the Promise, or value for the resolved promise
 * @param args Function Sequence of functions to pass as chain of then() method calls
 * @return Result Promise of the chain calls
 */
export function chain<T=any, R=any> (start: PromiseCreationArgument<T>, ...chain: ThenFunction[]): Promise<R> {
  let p = from(start);
  for(const fn of chain) {
    p = p.then(fn);
  }
  return p as unknown as Promise<R>;
}


/**
 * Similar to the "all" function but with the "to" function applied to each element.<br/>
 * This allows to obtain the result of each Promise, both in case of resolution and rejection.
 *
 * ```typescript
 * import { every, ok, ko } from "tilly";
 *
 * const result = await every(
 *   ok("Result #1"),
 *   ko("Error #2"),
 *   ok("Result #3")
 * );
 *
 * console.log(result);
 * // [{"success": true, "payload": "Result #1"},
 * //  {"success": false, "error": Error("Error #2")},
 * //  {"success": true, "payload": "Result #3"}]
 *
 * ```
 *
 * @param proms List of executors or Promises to be solved can be passed as individual arguments or as an Array in the first argument.
 * @return Result of all Promises
 */
export function every<T=any> (...proms: PromiseCreationArgument<T>[]): Promise<PromiseToResult<T>[]> {
  return all(...promisesFromArgs(proms).map(p => to<T>(p)));
}


/**
 * This function in conjunction with the use of await allows pausing the execution of the current context.<br/>
 * Without the use of await it allows you to perform a Promise with delay.
 *
 * ```typescript
 * import { sleep } from "tilly";
 *
 * const result = await sleep(3000, "wake up!");
 *
 * console.log(result);
 * // "wake up!"
 * ```
 *
 * @param time The time to wait before Promise resolution, in milliseconds
 * @param data Optional. Promise, or executor function, or data value to pass to sleep() resolution after waiting time expires
 */
export function sleep<T=any> (time: number, data?: PromiseCreationArgument<T>): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(from(data));
    }, time);
  });
}

/**
 * This function delay the resolution of a promise.<br/>
 * De facto is an alias of sleep() function with inverse not-optional arguments
 *
 * ```typescript
 * import { delay } from "tilly";
 *
 * const result = delay("wake up!", 3000);
 *
 * console.log(result);
 * // "wake up!"
 * ```
 *
 * @param data Promise, or executor function, or data value to pass to sleep() resolution after waiting time expires
 * @param time The time to wait before Promise resolution, in milliseconds
 */
export function delay<T> (data: PromiseCreationArgument<T>, time: number): Promise<T> {
  return sleep(time, data);
}


export type RetryExecutorFunction<T> = (resolve: ResolveFunction<T>, reject: RejectFunction, index: number, maxRetry: number) => void;

/**
 * This function allows you to execute the call to Promise several times in the case of re-rejection, until there is a resolution or the attempts are exhausted.
 *
 * ```typescript
 * import { retry } from "tilly";
 *
 * const result = await retry(3, (resolve, reject, i, n) => {
 *   if(i == n) {
 *     resolve("At the last attempt");
 *   } else {
 *     reject(new Error("Failed attempt"));
 *   }
 * });
 *
 * console.log(result);
 * // "At the last attempt"
 * ```
 *
 * @param maxRetry The maximum number of attempts to retry to execute the Promise
 * @param executor The executor function with the addition of two arguments, the attempt index and the total number of attempts
 * @return Result Promise
 */
export async function retry<T=any> (maxRetry: number, executor: RetryExecutorFunction<T>): Promise<T> {
  let res: T;
  let ok = false;
  const errors = [];
  let index = 0;

  do {
    try {
      res = await new Promise(function (resolve, reject) {
        return executor.call(this, resolve, reject, index, maxRetry);
      });
      ok  = true;
    } catch(e) {
      errors.push(e);
    }
  }
  while(!ok && index++ < maxRetry);

  if(!ok) {
    throw errors.shift();
  }

  return res;
}

/**
 * Generate a function that invoke a generator parameter and return the same Promise until this reject or if is elapsed a specified time
 *
 * ```typescript
 * import { cache, ok, ko } from "tilly";
 *
 * const getResolved = cache(() => ok("Result!"));
 * const prom1 = getResolved();
 * // wait Promise resolves/rejects…
 * const prom2 = getResolved();
 *
 * console.log(prom1 === prom2);
 * // true
 *
 * const getRejected = cache(() => ko("Error!"));
 * const prom3 = getRejected();
 * // wait Promise resolves/rejects…
 * const prom4 = getRejected();
 *
 * console.log(prom3 === prom4);
 * // false
 * ```
 *
 * @param generator The function that generate the promise to cache
 * @param timeout Optional, the expiration time of the promise in milliseconds
 */
export function cache<T=any> (generator: () => Promise<T>, cacheTime: number = 0): (() => Promise<T>) {
  let prom: Promise<T>;
  let resetTO: any;

  return function (): Promise<T> {
    if(!prom) {
      prom = generator();
      prom.catch(() => {
        prom = null;
      });
    }

    if(cacheTime > 0) {
      if(resetTO) {
        clearTimeout(resetTO);
      }
      resetTO = setTimeout(() => {
        prom = null;
      }, cacheTime);
    }

    return prom;
  };
}
