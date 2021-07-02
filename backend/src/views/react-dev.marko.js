// Compiled using marko@4.23.10 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/stock-tracker$1.0.0/views/react-dev.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    marko_loadTag = require("marko/src/runtime/helpers/load-tag"),
    init_components_tag = marko_loadTag(require("marko/src/core-tags/components/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/core-tags/core/await/reorderer-renderer")),
    _preferred_script_location_tag = marko_loadTag(require("marko/src/core-tags/components/preferred-script-location-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!DOCTYPE html><html lang=en><head><meta charset=utf-8><link rel=icon href=/favicon.ico><meta name=viewport content=\"width=device-width, initial-scale=1\"><meta name=theme-color content=#000000><meta name=description content=\"Web site created using create-react-app\"><link rel=apple-touch-icon href=/logo192.png><link rel=manifest href=/manifest.json><title>React Redux App</title>");

  out.___renderAssets && out.___renderAssets()

  out.w("</head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id=root></div><script src=/react/main.js></script>");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "13");

  _preferred_script_location_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/stock-tracker$1.0.0/views/react-dev.marko",
    tags: [
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer",
      "marko/src/core-tags/components/preferred-script-location-tag"
    ]
  };
