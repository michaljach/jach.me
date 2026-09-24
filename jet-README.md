# Jet website

The website for [Jet](https://github.com/michaljach/jet), a small typed, calibrated decision model:
a home page, a Demos directory, an editable request playground, dinosaur and chess games,
and API docs.

Plain static files, no build step. All model demos connect to a Jet inference server
(default `http://127.0.0.1:8000`, or `?server=http://host:port`). `api.js` manages
server settings, health checks and requests. Manual dinosaur play needs no server.

## Running the model for the pages

In the [jet](https://github.com/michaljach/jet) repo:

```sh
uv run jet-serve --base-model models/jet --cors-origin https://jach.me
```

`--cors-origin` must match the origin the pages are served from (scheme and host, no path).

## Local development

```sh
python -m http.server 8080 --directory src
uv run jet-serve --base-model models/jet --cors-origin http://localhost:8080   # in the jet repo
```

Then open http://localhost:8080/jet/.

## Deploying

GitHub Pages deploys `src` from the `michaljach/jach.me` repository. Jet lives in `src/jet` and is served at https://jach.me/jet/.

`vendor/chess.js` is [chess.js](https://github.com/jhlywa/chess.js) 1.4.0, BSD-2-Clause
(`vendor/chess.js.LICENSE`).

`runner.js` powers the dinosaur demo. Selecting Jet uses the configured inference server;
selecting You enables manual play.
