import { describe, it } from "node:test";

import { buildWasmBindgen, bundle } from "../harness.js";

describe("wasm-bindgen-simple", () => {
  it("should build output that can invoke log()", async () => {
    buildWasmBindgen({
      dir: import.meta.dirname,
    });

    await bundle({
      dir: import.meta.dirname,
      source: "index.js",
      configPath: ".parcelrc",
    });

    const bundledModule = await import("./dist/index.js");
    bundledModule.run();
  });
});
