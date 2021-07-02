// Compiled using marko@4.23.10 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/stock-tracker$1.0.0/views/includes/head.marko",
    marko_renderer = require("marko/src/runtime/components/renderer"),
    helpers_escape_xml = require("marko/src/runtime/html/helpers/escape-xml"),
    marko_escapeXml = helpers_escape_xml.x;

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<head><title>");

  if (data.title) {
    out.w(marko_escapeXml(data.title) +
      " | ");
  }

  out.w("Stock Tracker</title><script src=https://unpkg.com/@babel/standalone/babel.min.js></script>");

  out.___renderAssets && out.___renderAssets()

  out.w("</head>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    id: "/stock-tracker$1.0.0/views/includes/head.marko"
  };
