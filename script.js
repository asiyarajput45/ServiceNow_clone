const hsTrack    = document.getElementById("hsTrack");
const hsDots     = document.querySelectorAll(".hsdot");
const hsContents = document.querySelectorAll(".hs-slide-content");
const hsCtrlIcon = document.getElementById("hsCtrlIcon");
const TOTAL      = hsDots.length;   // 3
let   hsCurrent  = 0;
let   hsPlaying  = true;

function hsGoTo(idx) {
  hsDots[hsCurrent].classList.remove("active");
  hsContents[hsCurrent].classList.remove("active");

  hsCurrent = (idx + TOTAL) % TOTAL;
  hsDots[hsCurrent].classList.add("active");
  hsContents[hsCurrent].classList.add("active");

  hsTrack.style.transform = `translateX(-${hsCurrent * 100}%)`;
}

function hsPausePlay() {
  if (hsPlaying) {
    clearInterval(hsTimer);
    hsCtrlIcon.classList.replace("fa-pause", "fa-play");
    hsPlaying = false;
  } else {
    hsTimer = setInterval(() => hsGoTo(hsCurrent + 1), 3500);
    hsCtrlIcon.classList.replace("fa-play", "fa-pause");
    hsPlaying = true;
  }
}

let hsTimer = setInterval(() => hsGoTo(hsCurrent + 1), 3500);

let tsX = 0, tsDiffX = 0, tsY = 0, tsIsH = null;

hsTrack.addEventListener("touchstart", e => {
  tsX = e.touches[0].clientX;
  tsY = e.touches[0].clientY;
  tsDiffX = 0; tsIsH = null;
  hsTrack.classList.add("dragging");
}, { passive: true });

hsTrack.addEventListener("touchmove", e => {
  tsDiffX = e.touches[0].clientX - tsX;
  const dy = e.touches[0].clientY - tsY;
  if (tsIsH === null) tsIsH = Math.abs(tsDiffX) > Math.abs(dy);
  if (tsIsH) {
    e.preventDefault();
    const base   = -hsCurrent * 100;
    const offset = (tsDiffX / hsTrack.parentElement.offsetWidth) * 100;
    hsTrack.style.transform = `translateX(${base + offset}%)`;
  }
}, { passive: false });

hsTrack.addEventListener("touchend", () => {
  hsTrack.classList.remove("dragging");
  if (tsIsH) {
    clearInterval(hsTimer);
    if      (tsDiffX < -60) hsGoTo(hsCurrent + 1);
    else if (tsDiffX >  60) hsGoTo(hsCurrent - 1);
    else                    hsGoTo(hsCurrent);
    if (hsPlaying) hsTimer = setInterval(() => hsGoTo(hsCurrent + 1), 3500);
  }
});

let msDown = false, msStartX = 0, msDiffX = 0;

hsTrack.addEventListener("mousedown", e => {
  msDown = true; msStartX = e.clientX; msDiffX = 0;
  hsTrack.classList.add("dragging");
});
window.addEventListener("mousemove", e => {
  if (!msDown) return;
  msDiffX = e.clientX - msStartX;
  const base   = -hsCurrent * 100;
  const offset = (msDiffX / hsTrack.parentElement.offsetWidth) * 100;
  hsTrack.style.transform = `translateX(${base + offset}%)`;
});
window.addEventListener("mouseup", () => {
  if (!msDown) return;
  msDown = false;
  hsTrack.classList.remove("dragging");
  clearInterval(hsTimer);
  if      (msDiffX < -60) hsGoTo(hsCurrent + 1);
  else if (msDiffX >  60) hsGoTo(hsCurrent - 1);
  else                    hsGoTo(hsCurrent);
  if (hsPlaying) hsTimer = setInterval(() => hsGoTo(hsCurrent + 1), 3500);
});