(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const canvas = $("game-canvas"), ctx = canvas.getContext("2d");
  const status = $("game-status"), start = $("start-button");
  if (!ctx || !window.BubbleBlastIcons) {
    status.textContent = "Unable to load Canvas or AI artwork. Reload in a modern browser.";
    return;
  }
  const W = canvas.width, H = canvas.height, floor = H - 30;
  const radii = [18, 30, 48], keys = new Set(), pointers = new Map();
  const bindings = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", Space: "fire" };
  let targets = [], shots = [], x = W / 2, lives = 3, score = 0;
  let time = 90, shield = 0, cooldown = 0, playing = false, last = 0;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const held = action => [...keys].some(k => bindings[k] === action) || [...pointers.values()].includes(action);
  const clearInput = () => { keys.clear(); pointers.clear(); };
  function hud() {
    $("score").textContent = score;
    $("lives").textContent = lives;
    $("time").textContent = Math.ceil(time);
  }
  function target(px, py, size, direction) {
    const r = radii[size];
    return { x: clamp(px, r, W - r), y: clamp(py, r, floor - r), size, r,
      vx: direction * (180 - size * 35), vy: -(290 + size * 85) };
  }
  function finish(message) {
    playing = false;
    clearInput();
    status.textContent = message;
  }
  start.disabled = false;
  start.addEventListener("click", () => {
    clearInput();
    x = W / 2; lives = 3; score = 0; time = 90; shield = 2; cooldown = 0;
    shots = [];
    targets = [target(200, 160, 2, 1), target(760, 180, 2, -1)];
    playing = true;
    last = performance.now();
    start.textContent = "Restart game";
    status.textContent = "Clear every AI icon!";
    hud();
    canvas.focus({ preventScroll: true });
  });
  window.addEventListener("keydown", e => {
    if (!playing || !bindings[e.code] || document.activeElement !== canvas) return;
    e.preventDefault();
    keys.add(e.code);
  });
  window.addEventListener("keyup", e => keys.delete(e.code));
  canvas.addEventListener("blur", () => keys.clear());
  window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", () => { clearInput(); last = 0; });
  for (const [id, action] of [["move-left", "left"], ["move-right", "right"], ["fire-button", "fire"]]) {
    const button = $(id);
    button.disabled = false;
    button.addEventListener("pointerdown", e => {
      if (!playing || e.button !== 0) return;
      e.preventDefault();
      button.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, action);
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
      button.addEventListener(event, e => pointers.delete(e.pointerId));
    }
    button.addEventListener("contextmenu", e => e.preventDefault());
    button.addEventListener("click", e => {
      if (!playing || e.detail !== 0) return;
      if (action === "fire") fire();
      else x = clamp(x + (action === "left" ? -24 : 24), 16, W - 16);
    });
  }
  function fire() {
    if (cooldown > 0 || shots.length >= 2) return;
    shots.push({ x, y: floor - 38 });
    cooldown = 0.28;
  }
  function update(dt) {
    time = Math.max(0, time - dt);
    shield = Math.max(0, shield - dt);
    cooldown = Math.max(0, cooldown - dt);
    x = clamp(x + (Number(held("right")) - Number(held("left"))) * 310 * dt, 16, W - 16);
    if (held("fire")) fire();
    for (const b of targets) {
      b.vy += 720 * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < b.r || b.x > W - b.r) {
        b.x = clamp(b.x, b.r, W - b.r); b.vx *= -1;
      }
      if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy); }
      if (b.y > floor - b.r) {
        b.y = floor - b.r; b.vy = -(290 + b.size * 85);
      }
    }
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.y = Math.max(0, s.y - 700 * dt);
      const hit = targets.findIndex(b => Math.hypot(b.x - s.x, b.y - clamp(b.y, s.y, floor - 38)) <= b.r + 2);
      if (hit >= 0) {
        const b = targets.splice(hit, 1)[0];
        shots.splice(i, 1); score += (3 - b.size) * 100;
        if (b.size > 0) {
          for (const direction of [-1, 1]) targets.push(target(b.x + direction * radii[b.size - 1], b.y, b.size - 1, direction));
        }
      } else if (s.y === 0) shots.splice(i, 1);
    }
    if (!targets.length) finish("Level cleared! Restart to play again.");
    else {
      if (!shield && targets.some(b => Math.hypot(b.x - clamp(b.x, x - 14, x + 14), b.y - clamp(b.y, floor - 38, floor)) < b.r)) {
        lives--; shield = 2;
        status.textContent = lives ? "Hit! Two seconds of protection." : "No lives left. Restart to try again.";
      }
      if (!lives) finish("No lives left. Restart to try again.");
      else if (!time) finish("Time expired. Restart to try again.");
    }
  }
  function drawBackground() {
    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, W, floor);
    sky.addColorStop(0, "#08233e");
    sky.addColorStop(0.55, "#103f68");
    sky.addColorStop(1, "#07182d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Subdued Microsoft-inspired tiles stay behind the moving targets.
    const colors = ["#f25022", "#7fba00", "#00a4ef", "#ffb900"];
    const tile = 78, gap = 8, left = W / 2 - tile - gap / 2;
    ctx.globalAlpha = 0.24;
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(left + (i % 2) * (tile + gap), 80 + Math.floor(i / 2) * (tile + gap), tile, tile);
    });
    ctx.globalAlpha = 1;

    // Perspective lines suggest a blue desktop stage without adding obstacles.
    const horizon = floor - 110;
    ctx.strokeStyle = "#ffffff12";
    ctx.lineWidth = 1;
    for (let i = -W; i <= W * 2; i += 120) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + (i - W / 2) * 0.2, horizon);
      ctx.lineTo(i, floor);
      ctx.stroke();
    }
    for (const offset of [0, 18, 44, 78]) {
      ctx.beginPath();
      ctx.moveTo(0, horizon + offset);
      ctx.lineTo(W, horizon + offset);
      ctx.stroke();
    }
    ctx.fillStyle = "#10283f";
    ctx.fillRect(0, floor, W, H - floor);
    colors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(i * W / 4, floor, W / 4, 3);
    });
    ctx.restore();
  }
  function drawPlayer() {
    ctx.save();
    ctx.translate(x, floor);
    // Keep the artwork within the existing 28-by-38 collision rectangle.
    // Fade the whole outfit during protection, preserving its colors.
    ctx.globalAlpha = shield && Math.floor(shield * 12) % 2 ? 0.45 : 1;

    // Jeans, two trouser legs, seams, and white-soled sneakers.
    ctx.fillStyle = "#245caa";
    ctx.fillRect(-8, -14, 16, 5);
    ctx.fillRect(-8, -9, 7, 7);
    ctx.fillRect(1, -9, 7, 7);
    ctx.fillStyle = "#79afe6";
    ctx.fillRect(-6, -11, 2, 7);
    ctx.fillRect(3, -11, 2, 7);
    ctx.fillStyle = "#13243a";
    ctx.fillRect(-10, -4, 9, 3);
    ctx.fillRect(1, -4, 10, 3);
    ctx.fillStyle = "#eef5ff";
    ctx.fillRect(-10, -1, 9, 1);
    ctx.fillRect(1, -1, 10, 1);

    // Short-sleeved green T-shirt and bare forearms.
    ctx.fillStyle = "#86c928";
    ctx.fillRect(-8, -23, 16, 10);
    ctx.fillRect(-12, -22, 4, 6);
    ctx.fillRect(8, -22, 4, 6);
    ctx.fillStyle = "#f0b78d";
    ctx.fillRect(-12, -16, 4, 5);
    ctx.fillRect(8, -16, 4, 5);
    ctx.fillRect(-3, -25, 6, 4);
    ctx.fillStyle = "#d9f5ad";
    ctx.fillRect(-5, -20, 2, 5);

    // Face, ears, hair, eyes, and a small smile.
    ctx.fillStyle = "#f0b78d";
    ctx.fillRect(-7, -32, 14, 9);
    ctx.fillRect(-9, -30, 2, 4);
    ctx.fillRect(7, -30, 2, 4);
    ctx.fillStyle = "#482b23";
    ctx.fillRect(-7, -33, 14, 2);
    ctx.fillRect(-7, -31, 2, 3);
    ctx.fillRect(5, -31, 2, 3);
    ctx.fillStyle = "#182338";
    ctx.fillRect(-4, -29, 2, 2);
    ctx.fillRect(3, -29, 2, 2);
    ctx.fillStyle = "#a85b48";
    ctx.fillRect(-1, -25, 3, 1);

    // Red baseball cap with a right-facing brim and highlight.
    ctx.fillStyle = "#f25022";
    ctx.fillRect(-6, -38, 12, 2);
    ctx.fillRect(-8, -36, 16, 4);
    ctx.fillStyle = "#c83419";
    ctx.fillRect(-8, -33, 22, 2);
    ctx.fillStyle = "#ffad84";
    ctx.fillRect(-4, -37, 3, 3);
    ctx.restore();
  }
  function draw() {
    drawBackground();
    ctx.strokeStyle = "#79f1df"; ctx.lineWidth = 4;
    for (const s of shots) {
      ctx.beginPath(); ctx.moveTo(s.x, floor - 38); ctx.lineTo(s.x, s.y); ctx.stroke();
    }
    for (const b of targets) BubbleBlastIcons.draw(ctx, b.x, b.y, b.r);
    drawPlayer();
    if (!playing) {
      ctx.fillStyle = "#080f20cc"; ctx.fillRect(0, 180, W, 150);
      ctx.fillStyle = "#eef3ff"; ctx.textAlign = "center"; ctx.font = "bold 26px system-ui";
      ctx.fillText(start.textContent === "Start game" ? "Bubble Blast — ready?" : "Round finished", W / 2, 235);
      ctx.font = "20px system-ui";
      ctx.fillText("Use the button below to start a fresh round", W / 2, 285);
    }
  }
  function frame(now) {
    let dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    if (!document.hidden) {
      while (playing && dt > 0) {
        const step = Math.min(dt, 1 / 120); update(step); dt -= step;
      }
      hud(); draw();
    }
    requestAnimationFrame(frame);
  }
  status.textContent = "Ready. Press Start game.";
  hud(); requestAnimationFrame(frame);
})();
