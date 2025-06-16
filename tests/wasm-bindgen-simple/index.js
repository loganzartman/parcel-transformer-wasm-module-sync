import { greet } from "./pkg/test_wasm_bindgen_simple.js";

export function doGreet(callback) {
  greet("World", callback);
}
