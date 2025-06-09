import { describe, it } from 'node:test';
import path from 'node:path';

import { buildWasmBindgen, bundle } from "../harness.js";

describe('wasm-bindgen-simple', () => {
  it('should build output that can invoke log()', async () => {
    console.log('dir ', import.meta.dirname);
    buildWasmBindgen({
      dir: import.meta.dirname,
    });
    await bundle({
      entry: path.join(import.meta.dirname, 'index.js'),
      configPath: path.join(import.meta.dirname, '.parcelrc'),
    });
  });
});
