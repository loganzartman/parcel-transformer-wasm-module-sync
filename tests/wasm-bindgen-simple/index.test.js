import { describe, it } from 'node:test';
import path from 'node:path';
import { createRequire } from 'node:module';

import { buildWasmBindgen, bundle } from "../harness.js";

describe('wasm-bindgen-simple', () => {
  it('should build output that can invoke log()', async () => {
    buildWasmBindgen({
      dir: import.meta.dirname,
    });
    
    await bundle({
      dir: import.meta.dirname,
      source: 'index.js',
      configPath: '.parcelrc',
    });
    
    // Import the bundled module directly - this is the goal!
    const require = createRequire(import.meta.url);
    const bundlePath = path.join(import.meta.dirname, 'dist', 'index.js');
    const bundledModule = require(bundlePath);
    
    // Call the exported function
    if (typeof bundledModule.run === 'function') {
      bundledModule.run();
    } else if (typeof bundledModule.default?.run === 'function') {
      bundledModule.default.run();
    } else {
      throw new Error(`No run function found. Available: ${Object.keys(bundledModule)}`);
    }
  });
});
