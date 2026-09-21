/* Original AI ribbon artwork; no official logos or external assets. */
(() => {
  "use strict";

  const TAU = Math.PI * 2;

  function ribbon(ctx, mirrored, colors) {
    ctx.save();
    if (mirrored) ctx.scale(-1, 1);

    const gradient = ctx.createLinearGradient(-0.75, -0.65, 0.4, 0.7);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);

    ctx.beginPath();
    ctx.moveTo(-0.1, -0.66);
    ctx.bezierCurveTo(-0.38, -0.88, -0.68, -0.64, -0.72, -0.32);
    ctx.bezierCurveTo(-0.76, -0.02, -0.58, 0.25, -0.36, 0.5);
    ctx.bezierCurveTo(-0.13, 0.77, 0.19, 0.72, 0.31, 0.44);
    ctx.bezierCurveTo(0.43, 0.17, 0.13, -0.11, -0.1, -0.66);
    ctx.strokeStyle = "#080f20";
    ctx.lineWidth = 0.29;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.21;
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw an AI target centered at (x, y) in canvas coordinates.
   * radius is its positive collision radius; rotation is in radians.
   * Artwork stays inside that radius. No game state or DOM is modified.
   * Canvas drawing styles and transforms are restored after rendering.
   */
  function draw(ctx, x, y, radius, rotation = 0) {
    if (![x, y, radius, rotation].every(Number.isFinite) || radius <= 0) {
      return;
    }

    ctx.save();
    try {
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(radius, radius);

      // The subtle rim makes the circular collision boundary readable.
      ctx.beginPath();
      ctx.arc(0, 0, 0.97, 0, TAU);
      ctx.fillStyle = "rgba(18, 30, 58, 0.88)";
      ctx.fill();
      ctx.lineWidth = 0.035;
      ctx.strokeStyle = "rgba(185, 222, 255, 0.65)";
      ctx.stroke();

      ribbon(ctx, false, ["#7df5e0", "#40baff", "#7063ef"]);
      ribbon(ctx, true, ["#ffcf79", "#ff82b1", "#a883ff"]);

      // A compact face remains legible on the smallest split targets.
      ctx.beginPath();
      ctx.ellipse(0, 0.02, 0.37, 0.29, 0, 0, TAU);
      ctx.fillStyle = "#101b35";
      ctx.fill();
      ctx.lineWidth = 0.035;
      ctx.strokeStyle = "#b4e9ff";
      ctx.stroke();

      ctx.fillStyle = "#e5ffff";
      for (const eyeX of [-0.14, 0.14]) {
        ctx.beginPath();
        ctx.ellipse(eyeX, -0.025, 0.052, 0.072, 0, 0, TAU);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(-0.1, 0.12);
      ctx.quadraticCurveTo(0, 0.2, 0.1, 0.12);
      ctx.lineWidth = 0.035;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#79f1df";
      ctx.stroke();
    } finally {
      ctx.restore();
    }
  }

  window.BubbleBlastIcons = Object.freeze({ draw });
})();
