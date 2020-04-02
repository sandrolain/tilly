import {
  promise,
  ok,
  ko,
  all,
  race,
  to,
  chain,
  every,
  sleep,
  retry,
  ResolveFunction
} from "./index";


type ResolveF = ResolveFunction<any>;

describe("tilly", () => {

  test("promise", async () => {
    const val = await promise((resolve: ResolveF): void => {
      resolve("test01");
    });
    expect(val).toEqual("test01");
  });

  test("ok", async () => {
    const val = await ok("OK!");
    expect(val).toEqual("OK!");
  });

  test("ko", async () => {
    try {
      const res = await ko("ERR");
      res;
    } catch(error) {
      expect(error).toEqual(new Error("ERR"));
    }
  });

  test("all", async () => {
    const res = await all([
      Promise.resolve("test05-A"),
      Promise.resolve("test05-B"),
      Promise.resolve("test05-C")
    ]);
    expect(res).toEqual(["test05-A", "test05-B", "test05-C"]);
  });

  test("race", async () => {
    const res = await race([
      (resolve: ResolveF): void => {
        setTimeout(() => resolve("One"), 600);
      },
      (resolve: ResolveF): void => {
        setTimeout(() => resolve("Two"), 400);
      },
      (resolve: ResolveF): void => {
        setTimeout(() => resolve("Three"), 200);
      }
    ]);
    expect(res).toEqual("Three");
  });

  test("to race", async () => {
    const res = await to(
      race([
        (resolve: ResolveF): void => {
          setTimeout(() => resolve("One"), 600);
        },
        (resolve: ResolveF): void => {
          setTimeout(() => resolve("Two"), 400);
        },
        (resolve: ResolveF): void => {
          setTimeout(() => {
            resolve("Three");
          }, 200);
        }
      ])
    );
    expect(res).toEqual({ success: true, payload: "Three" });
  });

  test("to", async () => {
    const res = await to(Promise.resolve("test02"));
    expect(res).toEqual({ success: true, payload: "test02" });
  });

  test("to all", async () => {
    const res = await to(
      all([
        Promise.resolve("test06-A"),
        Promise.resolve("test06-B"),
        Promise.resolve("test06-C")
      ])
    );
    expect(res).toEqual({
      success: true,
      payload: ["test06-A", "test06-B", "test06-C"]
    });
  });

  test("chain", async () => {
    const res = await chain(
      (resolve: ResolveF): void => resolve(2),
      value => value + 1,
      value => value * 5,
      value => value + 6
    );
    expect(res).toEqual(16);
  });

  test("to chain", async () => {
    const res = await to(
      chain(
        (resolve: ResolveF): void => resolve(2),
        value => value + 1,
        value => value * 5,
        value => value + 6
      )
    );
    expect(res).toEqual({ success: true, payload: 16 });
  });

  test("every", async () => {
    const res = await every([
      Promise.resolve("everyOK"),
      Promise.reject("everyBad"),
      Promise.resolve("everyOK"),
      Promise.reject("everyBad")
    ]);
    expect(res).toEqual([
      { success: true, payload: "everyOK" },
      { success: false, error: "everyBad" },
      { success: true, payload: "everyOK" },
      { success: false, error: "everyBad" }
    ]);
  });

  test("sleep", async () => {
    const val = await sleep(2000, "wake up!");
    expect(val).toEqual("wake up!");
  });

  test("retry", async () => {
    const val = await retry(3, (resolve, reject, i, n) => {
      if(i === n) {
        resolve("At the last attempt");
      } else {
        reject(new Error("Failed attempt"));
      }
    });
    expect(val).toEqual("At the last attempt");
  });

});
