# Jet website

The website for [Jet](https://github.com/michaljach/jet), a small typed, calibrated decision model:
a home page with a playable dinosaur game, a Demos directory, an editable request playground,
a chess game against the model, and API docs.

Plain static files, no build step. Choose Browser GPU in any model demo and click Load Jet
for on-device inference using ONNX Runtime WebGPU. The pinned 627 MB quantized model is
cached when possible; no download starts automatically. Cancel/Unload terminates the worker
and releases the session. Switching to Server also unloads it. Unsupported devices can use
`jet-serve` (default `http://127.0.0.1:8000`, or `?server=http://host:port`).

`jet.js` implements prompt formatting, calibration, and GPU inference. KV tensors stay on
the GPU between 128-token chunks and are disposed after each request. `jet-worker.js` keeps
model work off the UI thread. State text is limited to 2048 tokens; full prompts to 4096.
Runtime dependencies are pinned to ONNX Runtime Web 1.30.0 and Hugging Face Tokenizers 0.2.0.
Weights/tokenizer/calibration use Hugging Face revision `dc0dc4a1882118f5dcdc9347dddddabeea6456da`.

Open `test.html` and explicitly start the reference tests to validate prompts, token IDs,
and selected labels against the model's golden vectors. GPU speed depends on hardware;
quantization changes probabilities slightly. Test parameters `?model=<base URL>&file=<path>`
allow a local copy of the same weights to avoid another network download.

## Running the model for the pages

In the [jet](https://github.com/michaljach/jet) repo:

```sh
uv run jet-serve --base-model models/jet --cors-origin https://jach.me
```

`--cors-origin` must match the origin the pages are served from (scheme and host, no path).

## Local development

```sh
python -m http.server 8080
uv run jet-serve --base-model models/jet --cors-origin http://localhost:8080   # in the jet repo
```

Then open http://localhost:8080.

## Deploying

GitHub Pages deploys `src` from the `michaljach/jach.me` repository. Jet lives in `src/jet` and is served at https://jach.me/jet/.

`vendor/chess.js` is [chess.js](https://github.com/jhlywa/chess.js) 1.4.0, BSD-2-Clause
(`vendor/chess.js.LICENSE`).

`runner.js` is shared by the homepage and dinosaur demo. The homepage defaults to
manual play. Selecting Jet reveals the inference controls; loading the browser model requires a separate click.

The default `onnx/model_q8_compact.onnx` retains all 267 supported Jet label
weights and removes unused output rows. Its non-label logits are placeholders:
use this export only for typed decisions, not vocabulary scoring. The 530 MB
int4 candidate is available on Hugging Face but is not the default because
the full evaluation showed an accuracy regression.
