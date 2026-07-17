#import "../../../../config.typ": template
#import "@preview/cmarker:0.1.8"
#import "@preview/mitex:0.2.7": *

#show: template.with(
  title: "第18章：苏锦洪现身",
  description: "《雾钟》第18章 — 苏锦洪现身",
)

#let scope = (
  image: (source, alt: none, format: auto) => figure(image(source, alt: alt, format: format)),
)
#let md-content = read("第18章-苏锦洪现身.md")
#cmarker.render(md-content, math: mitex, scope: scope)

#html.hr()
#align(center)[
  #link("/Novels/雾钟/")[← 返回《雾钟》目录]
]
