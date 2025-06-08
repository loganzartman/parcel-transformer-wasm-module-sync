import { Transformer } from "@parcel/plugin";
import dedent from "dedent";

export default new Transformer({
  async transform({ asset }) {
    const wasmBinary = await asset.getBuffer();
    const wasmModule = new WebAssembly.Module(wasmBinary);

    const importedModules = [
      ...new Set(WebAssembly.Module.imports(wasmModule).map((i) => i.module)),
    ];
    const imports = [
      "{",
      ...importedModules.map((m) => `${JSON.stringify(m)}: require('${m}'), `),
      "}",
    ].join("");

    const wasmEncoded = wasmBinary.toString("base64");
    const wasmShim = dedent`
      const wasmBase64 = "${wasmEncoded}";
      const wasmBinary = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
      const wasmModule = new WebAssembly.Module(wasmBinary);
      const wasmInstance = new WebAssembly.Instance(wasmModule, ${imports}); 
      module.exports = wasmInstance.exports;
    `;

    asset.type = "js";
    asset.bundleBehavior = "isolated";
    asset.setCode(wasmShim);
    return [asset];
  },
});
