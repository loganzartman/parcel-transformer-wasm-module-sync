use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/concat.js")]
extern "C" {
    fn concat(a: &str, b: &str) -> String;
}

#[wasm_bindgen]
pub fn greet(name: &str, callback: &js_sys::Function) {
    let message = concat("Hello, ", name);
    let this = JsValue::null();
    let _ = callback.call1(&this, &message.into());
}
