#import "../config.typ": template, tufted
#show: template

#tufted.margin-note[
  *写故事的人*
  用文字记录那些
  值得被记住的瞬间
]

= 欢迎

嘿，欢迎来到我的小角落。这里有几样东西：

- *小说* — 我写的故事，有长有短，有好有烂
- *技术 & 学科* — 写代码的心得、学东西的笔记
- *碎碎念* — 日常的碎片想法，没什么大道理
- *转载* — 别人写的好东西，值得存下来反复看
- *标签* — 按标签查找感兴趣的内容

慢慢逛，不着急。

---

== #link("/Novels/")[📖 小说]

写故事是我对抗平庸的方式。每个故事都是一次冒险，每个角色都是另一个自己。

#html.elem("div", attrs: (class: "home-card-list"), [
  #html.elem("div", attrs: (class: "home-card"), [
    #html.elem("span", attrs: (class: "home-card-icon"), [📚])
    #html.elem("span", attrs: (class: "home-card-text"), [长篇连载，不定期更新])
    #html.elem("a", attrs: (class: "home-card-link", href: "/Novels/"), [浏览全部小说 →])
  ])
])

== #link("/Tech/")[🛠️ 技术 & 学科]

编程、工具、学习笔记。把搞懂的东西写下来，下次忘了能翻翻。

#html.elem("div", attrs: (class: "home-card-list"), [
  #html.elem("div", attrs: (class: "home-card"), [
    #html.elem("span", attrs: (class: "home-card-icon"), [💻])
    #html.elem("span", attrs: (class: "home-card-text"), [技术笔记、踩坑记录、学科整理])
    #html.elem("a", attrs: (class: "home-card-link", href: "/Tech/"), [浏览技术文章 →])
  ])
])

== #link("/Musings/")[💭 碎碎念]

一些忽然冒出来的想法，读过的书，看过的电影，走过的路。

#html.elem("div", attrs: (class: "home-card-list"), [
  #html.elem("div", attrs: (class: "home-card"), [
    #html.elem("span", attrs: (class: "home-card-icon"), [✍️])
    #html.elem("span", attrs: (class: "home-card-text"), [日常记录，想到什么写什么])
    #html.elem("a", attrs: (class: "home-card-link", href: "/Musings/"), [浏览全部碎碎念 →])
  ])
])

== #link("/Reposts/")[🔗 转载]

好文章值得被更多人看到。这里收藏我喜欢的内容，每篇都会注明出处。

#html.elem("div", attrs: (class: "home-card-list"), [
  #html.elem("div", attrs: (class: "home-card"), [
    #html.elem("span", attrs: (class: "home-card-icon"), [📋])
    #html.elem("span", attrs: (class: "home-card-text"), [精心挑选，注明来源])
    #html.elem("a", attrs: (class: "home-card-link", href: "/Reposts/"), [浏览全部转载 →])
  ])
])

---

== 最近更新

#tufted.blog-entry(
  date: [已完结],
  path: "/Novels/雾钟/",
  title: "📖 《雾钟》— 33章悬疑小说",
)

#tufted.blog-entry(
  date: [第33章],
  path: "/Novels/雾钟/33/",
  title: "《雾钟》最终章 — 无名书",
)

#tufted.blog-entry(
  date: [第32章],
  path: "/Novels/雾钟/32/",
  title: "《雾钟》— 1997",
)

#tufted.blog-entry(
  date: [第01章],
  path: "/Novels/雾钟/01/",
  title: "《雾钟》开篇 — 雾钟",
)

#link("/Novels/雾钟/")[浏览全部 33 章 →]

