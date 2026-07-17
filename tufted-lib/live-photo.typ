// Live Photo helper — Apple-style hover-to-play images for your blog.
//
// Usage in any .typ file:
//   #import "../tufted-lib/live-photo.typ": live-photo
//   #live-photo("imgs/photo.jpg", video: "imgs/photo.mp4", caption: [A moment in time])
//
// Or without a caption:
//   #live-photo("imgs/photo.jpg", video: "imgs/photo.mp4")
//
// Or full-width:
//   #live-photo("imgs/photo.jpg", video: "imgs/photo.mp4", full-width: true)
//
// The video will play on hover (desktop) or tap/long-press (mobile).

/// Embed an Apple-style Live Photo that plays on hover.
///
/// - `image-path` (str, positional): Path to the still image (e.g. "imgs/photo.jpg").
/// - `video` (str, named): Path to the short MP4 video (e.g. "imgs/photo.mp4").
/// - `caption` (content, named): Optional caption displayed below the live photo.
/// - `full-width` (bool, named): If true, the live photo spans the full content width.
/// - `alt` (str, named): Alt text for the image (used for accessibility and SEO).
#let live-photo(
  image-path,
  video: none,
  caption: none,
  full-width: false,
  alt: "",
) = {
  if target() == "html" {
    // Build the live photo container as raw HTML
    let width-class = if full-width { " full-width" } else { "" }
    let html-str = "<div class=\"live-photo" + width-class + "\" data-video-src=\"" + video + "\">"
    html-str += "<img src=\"" + image-path + "\" alt=\"" + alt + "\" loading=\"lazy\" decoding=\"async\" />"
    html-str += "<span class=\"live-photo-badge\">LIVE</span>"
    html-str += "</div>"

    html.raw(html-str)

    // Caption rendered as Typst content inside a styled span
    if caption != none {
      html.elem("span", attrs: (class: "live-photo-caption"), caption)
    }
  } else {
    // Fallback for non-HTML targets (PDF etc.): just show the image
    image(image-path, alt: alt)
    if caption != none {
      v(0.5em)
      caption
    }
  }
}
