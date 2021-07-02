// Compiled using marko@4.23.10 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/stock-tracker$1.0.0/views/home.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    Head = require("./includes/head"),
    Header = require("./includes/header"),
    Nav = require("./includes/nav"),
    Footer = require("./includes/footer"),
    AddStock = require("./add-stock"),
    marko_dynamicTag = require("marko/src/runtime/helpers/dynamic-tag"),
    marko_loadTag = require("marko/src/runtime/helpers/load-tag"),
    init_components_tag = marko_loadTag(require("marko/src/core-tags/components/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/core-tags/core/await/reorderer-renderer")),
    _preferred_script_location_tag = marko_loadTag(require("marko/src/core-tags/components/preferred-script-location-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<html>");

  marko_dynamicTag(out, Head, null, null, null, null, __component, "1");

  out.w("<body>");

  marko_dynamicTag(out, Header, null, null, null, null, __component, "3");

  marko_dynamicTag(out, Nav, null, null, null, null, __component, "4");

  out.w("<div class=middle><div>Home</div>");

  marko_dynamicTag(out, AddStock, null, null, null, null, __component, "7");

  out.w("</div>");

  marko_dynamicTag(out, Footer, null, null, null, null, __component, "8");

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "9");

  _preferred_script_location_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/stock-tracker$1.0.0/views/home.marko",
    tags: [
      "./includes/head",
      "./includes/header",
      "./includes/nav",
      "./includes/footer",
      "./add-stock",
      "marko/src/core-tags/components/init-components-tag",
      "marko/src/core-tags/core/await/reorderer-renderer",
      "marko/src/core-tags/components/preferred-script-location-tag"
    ]
  };
