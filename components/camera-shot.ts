const atlasUrl = "/assets/brand/rangefinder-turn.webp";
const duration = 960;
let atlas: HTMLImageElement | undefined;

export function prepareCamera() {
  if (!atlas || (atlas.complete && !atlas.naturalWidth)) {
    atlas = new Image();
    atlas.src = atlasUrl;
  }
  return atlas;
}

/** Play one photographed turn of the 3D model. Return a cancellation hook for back or Escape. */
export function playCameraShot(
  parent: HTMLElement,
  point?: { x: number; y: number },
  onFinish?: () => void,
) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches) {
    onFinish?.();
    return () => {};
  }
  const stage = document.createElement("div");
  stage.className = "cta-exposure";
  stage.setAttribute("aria-hidden", "true");
  stage.style.setProperty("--shot-duration", duration + "ms");
  const x = point?.x ?? innerWidth / 2;
  const y = point?.y ?? innerHeight / 2;
  stage.style.setProperty(
    "--enter-x",
    Math.round((x - innerWidth / 2) * 0.16) + "px",
  );
  stage.style.setProperty(
    "--enter-y",
    Math.round((y - innerHeight / 2) * 0.16) + "px",
  );
  const rig = document.createElement("div");
  rig.className = "cta-camera-rig";
  const camera = document.createElement("div");
  camera.className = "cta-camera-body";
  camera.style.backgroundImage = 'url("' + atlasUrl + '")';
  const bulb = document.createElement("div");
  bulb.className = "cta-camera-flash";
  rig.append(camera, bulb);
  stage.append(rig);

  let cancelled = false;
  let timer: number;
  function cancel() {
    cancelled = true;
    clearTimeout(timer);
    motion.removeEventListener("change", finish);
    stage.remove();
  }
  function finish() {
    if (cancelled) return;
    cancel();
    onFinish?.();
  }
  function start() {
    if (cancelled) return;
    clearTimeout(timer);
    // Keep the transition visible above an open menu without moving keyboard focus.
    if (typeof stage.showPopover === "function") stage.popover = "manual";
    parent.append(stage);
    stage.showPopover?.();
    stage.addEventListener("animationend", (event) => {
      if (event.target === stage && event.animationName === "cta-shot")
        finish();
    });
    timer = window.setTimeout(finish, duration + 160);
  }
  motion.addEventListener("change", finish);
  const image = prepareCamera();
  if (image.complete && image.naturalWidth) start();
  else {
    // A missing or slow optional asset must never strand the visitor on the current page.
    timer = window.setTimeout(finish, 800);
    void image.decode().then(start, finish);
  }
  return cancel;
}
