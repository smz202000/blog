#import "../../config.typ": template, tufted
#import "../../tufted-lib/live-photo.typ": live-photo
#show: template.with(
  title: "实况照片",
  description: "上传和管理实况照片 - 悬停即可播放的动态照片",
)

= 实况照片

这是你的实况照片管理页面。选择一张静态图片和一段短视频，即可创建 Apple Live Photo 风格的动态照片。

== 上传新照片

#html.elem("div", attrs: (class: "drop-zone", id: "drop-zone"), [
  #html.elem("div", attrs: (class: "drop-zone-icon"), [📸])
  #html.elem("p", attrs: (:), [拖拽图片和视频到此处])
  #html.elem("p", attrs: (style: "font-size:12px;color:#aaa;"), [或点击选择文件])
])

#html.elem("div", attrs: (class: "upload-file-row"), [
  #html.elem("label", attrs: (class: "upload-file-btn"), [
    🖼️ 选择图片
    #html.elem("input", attrs: (type: "file", id: "image-input", accept: "image/*", style: "display:none;"))
    #html.elem("span", attrs: (class: "file-label-image"))
  ])
  #html.elem("label", attrs: (class: "upload-file-btn"), [
    🎬 选择视频
    #html.elem("input", attrs: (type: "file", id: "video-input", accept: "video/mp4,video/quicktime", style: "display:none;"))
    #html.elem("span", attrs: (class: "file-label-video"))
  ])
])

#html.elem("div", attrs: (class: "preview-area", id: "preview-area"), [
  #html.elem("p", attrs: (class: "upload-hint"), [选择一张静态图片和一段短视频即可预览效果])
])

#html.elem("div", attrs: (class: "code-output-section"), [
  #html.elem("h3", attrs: (:), [📋 Typst 嵌入代码])
  #html.elem("pre", attrs: (id: "code-output"))
])

#html.elem("button", attrs: (id: "save-btn"), [💾 保存到本地])

== 我的实况照片库

#html.elem("div", attrs: (class: "gallery", id: "gallery"))

== 如何在文章中使用

将实况照片文件放到 `uploads/live-photos/` 目录下，然后在你的 `.typ` 文章中使用：

```typst
#import "../tufted-lib/live-photo.typ": live-photo

#live-photo(
  "uploads/live-photos/photo.jpg",
  video: "uploads/live-photos/photo.mp4",
  caption: [在公园散步的午后],
)
```

参数说明：
- 第一个参数：静态封面图路径
- `video:` 短视频文件路径（MP4 格式，建议 3-5 秒）
- `caption:` 可选描述文字
- `full-width: true` 让照片占满整宽
