import { Parcel } from "@parcel/core";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { $ } from "zx";

export function buildWasmBindgen({ dir }) {
  if (!process.env.IN_CONTAINER) {
    console.error("Test is not running in test Docker container!");
  }

  const buildDir = "target/wasm32-unknown-unknown/release";
  const outDir = "pkg";

  const $$ = $.sync({
    verbose: true,
    cwd: dir,
  });

  $$`cargo build --lib --release --target wasm32-unknown-unknown`;

  const wasmFilename = readdirSync(path.join(dir, buildDir)).find((file) =>
    file.endsWith(".wasm")
  );

  if (!wasmFilename) {
    throw new Error(`No .wasm file found in ${buildDir}`);
  }

  $$`wasm-bindgen ${path.join(
    dir,
    buildDir,
    wasmFilename
  )} --out-dir=${outDir} --target bundler`;

  if (!existsSync(path.join(dir, outDir))) {
    throw new Error(`Expected ${outDir} to exist after wasm-bindgen build`);
  }

  console.log("✨ wasm-bindgen build success!");
}

export async function bundle({ entry, configPath }) {
  const bundler = new Parcel({
    entries: entry,
    config: configPath,
  });

  const { bundleGraph, buildTime } = await bundler.run();
  const bundles = bundleGraph.getBundles();
}
