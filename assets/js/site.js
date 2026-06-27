/* Minimal interactivity for the static replica:
   - site menu (hamburger) open/close
   - simple click-to-zoom lightbox for gallery images
   No external dependencies. */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // --- Site menu toggle ---
    var btn = document.getElementById("site_menu_button");
    var panel = document.getElementById("site_menu_panel");
    if (btn && panel) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        panel.classList.toggle("open");
      });
      var close = panel.querySelector(".close");
      if (close) close.addEventListener("click", function () { panel.classList.remove("open"); });
      panel.addEventListener("click", function (e) {
        if (e.target === panel) panel.classList.remove("open");
      });
    }

    // --- Simple lightbox ---
    var overlay = document.createElement("div");
    overlay.id = "local-lightbox";
    overlay.style.cssText =
      "display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.85);" +
      "align-items:center;justify-content:center;cursor:zoom-out;";
    var big = document.createElement("img");
    big.style.cssText = "max-width:92%;max-height:92%;object-fit:contain;box-shadow:0 0 40px rgba(0,0,0,.5);";
    overlay.appendChild(big);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function () { overlay.style.display = "none"; big.src = ""; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { overlay.style.display = "none"; big.src = ""; }
    });

    // attach to gallery/content images (skip tiny UI icons and logos in menu)
    var imgs = document.querySelectorAll(".page_content img, .gallery_card img, .thumb_image img");
    imgs.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function (e) {
        // if the image is inside a link, let the link work instead
        if (img.closest("a")) return;
        e.preventDefault();
        big.src = img.currentSrc || img.src;
        overlay.style.display = "flex";
      });
    });

    // --- Rebuilt slideshow carousels ---
    document.querySelectorAll(".local-carousel").forEach(function (car) {
      var track = car.querySelector(".lc-track");
      var slides = car.querySelectorAll(".lc-slide");
      var count = car.querySelector(".lc-count");
      if (!track || !slides.length) return;
      var cur = 0;
      function update() {
        cur = Math.round(track.scrollLeft / track.clientWidth);
        if (count) count.textContent = (cur + 1) + " / " + slides.length;
      }
      function go(n) {
        cur = Math.max(0, Math.min(slides.length - 1, n));
        track.scrollTo({ left: cur * track.clientWidth, behavior: "smooth" });
        if (count) count.textContent = (cur + 1) + " / " + slides.length;
      }
      var prev = car.querySelector(".lc-prev");
      var next = car.querySelector(".lc-next");
      if (prev) prev.addEventListener("click", function () { go(cur - 1); });
      if (next) next.addEventListener("click", function () { go(cur + 1); });
      track.addEventListener("scroll", function () {
        window.clearTimeout(track._t);
        track._t = window.setTimeout(update, 80);
      });
      if (count) count.textContent = "1 / " + slides.length;
      // zoom on carousel image click
      slides.forEach(function (sl) {
        var im = sl.querySelector("img");
        if (im) im.addEventListener("click", function (e) {
          e.preventDefault();
          big.src = im.currentSrc || im.src;
          overlay.style.display = "flex";
        });
      });
    });

    // --- Marquee (scrolling / bouncing ticker) animation ---
    // Cargo animates .marquee_contents via transform; we stripped that JS, so
    // reproduce it here. Supports behavior "scroll" (seamless loop) and
    // "bounce" (back-and-forth). Direction/speed come from attributes.
    document.querySelectorAll(".marquee").forEach(function (mq) {
      var behavior = mq.getAttribute("behavior") || "scroll";
      var contents = mq.querySelector(".marquee_contents");
      if (!contents) return;
      var inners = contents.querySelectorAll(".marquee_inner");
      if (!inners.length) return;
      var vertical = (mq.getAttribute("direction") || "horizontal") === "vertical";
      var speed = parseFloat(mq.getAttribute("speed") || "-27");
      var sign = speed < 0 ? -1 : 1;
      var pxPerSec = Math.max(15, Math.abs(speed) * 11); // ~matches original cadence

      // Reset frozen inline transforms and normalise layout so inners flow
      contents.style.setProperty("transform", "none", "important");
      contents.style.setProperty("display", "flex", "important");
      contents.style.setProperty("flex-direction", vertical ? "column" : "row", "important");
      contents.style.setProperty("will-change", "transform", "important");

      if (behavior === "scroll") {
        // ensure a clone exists for seamless looping
        if (inners.length < 2) {
          var clone = inners[0].cloneNode(true);
          clone.classList.add("cloned_marquee_inner");
          contents.appendChild(clone);
          inners = contents.querySelectorAll(".marquee_inner");
        }
      }
      inners.forEach(function (inner) {
        inner.style.setProperty("transform", "none", "important");
        inner.style.setProperty("position", "relative", "important");
        inner.style.setProperty("flex", "0 0 auto", "important");
        if (!vertical) {
          inner.style.setProperty("width", "auto", "important");
          inner.style.setProperty("min-width", "auto", "important");
          inner.style.setProperty("white-space", "nowrap", "important");
        }
      });

      var first = inners[0];
      var pos = 0, last = null, dir = sign;
      function frame(ts) {
        if (last === null) last = ts;
        var dt = (ts - last) / 1000; last = ts;
        var size = vertical ? first.offsetHeight : first.offsetWidth;
        if (size > 0) {
          if (behavior === "scroll") {
            pos += sign * pxPerSec * dt;
            if (pos <= -size) pos += size;
            else if (pos >= size) pos -= size;
          } else { // bounce
            var box = vertical ? mq.clientHeight : mq.clientWidth;
            var range = box - size;            // negative if content larger than box
            var lo = Math.min(0, range), hi = Math.max(0, range);
            pos += dir * pxPerSec * dt;
            if (pos <= lo) { pos = lo; dir = 1; }
            else if (pos >= hi) { pos = hi; dir = -1; }
          }
          contents.style.transform = vertical
            ? "translateY(" + pos + "px)"
            : "translateX(" + pos + "px)";
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  });
})();
