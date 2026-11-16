(function () {
  "use strict";

  var audio = document.getElementById("song-audio");
  var btn = document.getElementById("mute-btn");

  // --- Mute button ---
  function renderButton() {
    btn.textContent = audio.muted ? "Unmute" : "Mute";
    btn.setAttribute("aria-pressed", audio.muted ? "true" : "false");
  }
  btn.addEventListener("click", function () {
    audio.muted = !audio.muted;
    renderButton();
  });
  renderButton();

  // --- Autoplay, with fallback to the first click, tap or keypress ---
  var started = false;
  var events = ["click", "touchend", "keydown"];

  function removeFallback() {
    events.forEach(function (e) { document.removeEventListener(e, onFirstInteraction, true); });
  }

  function tryPlay() {
    var p;
    try { p = audio.play(); } catch (err) { return; }
    if (p && typeof p.then === "function") {
      p.then(function () { started = true; removeFallback(); })
       .catch(function () { /* blocked or file missing: wait for interaction */ });
    }
  }

  function onFirstInteraction() {
    if (started) { removeFallback(); return; }
    tryPlay();
  }

  events.forEach(function (e) { document.addEventListener(e, onFirstInteraction, true); });
  tryPlay();

  // --- Missing audio: stop listening quietly ---
  audio.addEventListener("error", function () { removeFallback(); });

  // --- Missing photos: show the placeholder frame instead of a broken image ---
  document.querySelectorAll(".photo-frame img").forEach(function (img) {
    function miss() { img.parentNode.classList.add("is-missing"); }
    img.addEventListener("error", miss);
    if (img.complete && img.naturalWidth === 0) { miss(); }
  });
})();
