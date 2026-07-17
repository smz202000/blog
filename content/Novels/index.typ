#import "../../config.typ": template, tufted
#show: template.with(
  title: "小说",
  description: "原创小说 — 长篇连载与短篇故事",
)

= 📖 小说

#html.elem("p", attrs: (class: "section-intro"), [写故事是我对抗平庸的方式。这里有长篇连载，也有短篇故事。])

== 作品列表

#tufted.blog-entry(
  date: [连载中 · 33章],
  path: "雾钟/",
  title: "《雾钟》— 悬疑 · 九龙城",
)

#html.elem("p", attrs: (style: "color:#888; font-size:0.9rem;"), [
  一桩发生在九龙城的失踪案，牵扯出一段被掩埋的往事。钟声不响，雾不散。
])

---

更多故事正在路上。
