// Compiled using marko@4.23.10 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/stock-tracker$1.0.0/views/includes/lasso-head.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    marko_loadTag = require("marko/src/runtime/helpers/load-tag"),
    lasso_head_tag = marko_loadTag(require("@lasso/marko-taglib/taglib/head-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  lasso_head_tag({}, out, __component, "0");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/stock-tracker$1.0.0/views/includes/lasso-head.marko",
    tags: [
      "@lasso/marko-taglib/taglib/head-tag"
    ]
  };
