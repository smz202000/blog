#import "../../../../config.typ": template
#import "@preview/cmarker:0.1.8"
#import "@preview/mitex:0.2.7": *

#show: template.with(
  title: "第28章：风筝",
  description: "《雾钟》第28章 — 风筝",
)

#let scope = (
  image: (source, alt: none, format: auto) => figure(image(source, alt: alt, format: format)),
)
#let md-content = read("第28章-风筝.md")
#cmarker.render(md-content, math: mitex, scope: scope)

#html.hr()

#html.elem("div", attrs: (class: "tag-list"), [
  #html.elem("a", attrs: (href: "/Tags/#悬疑", class: "tag-badge"), [悬疑])
  #html.elem("a", attrs: (href: "/Tags/#九龙城", class: "tag-badge"), [九龙城])
  #html.elem("a", attrs: (href: "/Tags/#雾钟", class: "tag-badge"), [雾钟])
  #html.elem("a", attrs: (href: "/Tags/#完结", class: "tag-badge tag-completed"), [已完结])
])

#align(center)[
  #link("/Novels/雾钟/")[← 返回《雾钟》目录]
]
