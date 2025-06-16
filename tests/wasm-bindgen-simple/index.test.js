import { describe, it } from "node:test";

import { buildWasmBindgen, bundle } from "../harness.js";

describe("wasm-bindgen-simple", () => {
  it("should build output that can invoke log()", async (t) => {
    buildWasmBindgen({
      dir: import.meta.dirname,
    });

    await bundle({
      dir: import.meta.dirname,
      source: "index.js",
      configPath: ".parcelrc",
    });

    const bundledModule = await import("./dist/index.js");

    const mockCallback = t.mock.fn((s) => {
      console.log(s);
    });
    bundledModule.doGreet(mockCallback);

    t.assert.equal(mockCallback.mock.calls.length, 1);
    t.assert.deepStrictEqual(mockCallback.mock.calls[0].arguments, [
      "Hello, World",
    ]);
  });
});
