# parcel-transformer-wasm-module-sync

Support synchronous **WASM module** imports in **Parcel 2**.

## quickstart

Install as a dev dependency:

```bash
npm i -D parcel-transformer-wasm-module-sync
pnpm add -D parcel-transformer-wasm-module-sync
yarn add -D parcel-transformer-wasm-module-sync
```

Add transformer to your `.parcelrc`, installing `@parcel/config-default` if necessary:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.wasm": ["parcel-transformer-wasm-module-sync"]
  }
}
```

Now you're ready to build wasm-pack libraries.

## background

Tools like wasm-pack emit JavaScript that contains synchronous imports to `.wasm` modules, like this:

```js
import * as wasm from './my_module.wasm';
```

Typically, these tools are used in combination with Webpack, which has support for this.

Parcel doesn't support this out of the box, and in general this requires top-level await or other complicated async transforms.

This Parcel transformer adds support for imports like this by doing the following:

1. Read the WASM module and inline it as a base64 string
2. Parse the module using `WebAssembly` to find all imports
3. Use synchronous `WebAssembly.Module` and `WebAssembly.Instance` APIs to instantiate, passing in required imports

The base64 encoding adds some storage overhead (~33%), and the synchronous instantiation is less efficient than modern streaming `WebAssembly` APIs, but the tradeoff is that it works. Dynamic imports can be used to load the modules asynchronously.
