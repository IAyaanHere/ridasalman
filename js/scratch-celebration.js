/* Aesthetic Wedding Floral & Gold Scratch Celebration
   Matches luxury floral theme with champagne gold sparks and drifting blush rose petals. */
(function () {
  'use strict';
  let celebrated = false;

  // Aesthetic color palette matching frame roses and antique gold
  const goldSparks = ['218,165,32', '245,217,149', '255,235,175', '184,134,11', '255,248,220'];
  const petalColours = [
    'rgba(244, 194, 201, 0.92)', // Blush pink
    'rgba(235, 164, 175, 0.88)', // Rose pink
    'rgba(252, 224, 218, 0.92)', // Peach cream
    'rgba(255, 238, 235, 0.95)', // Ivory white petal
    'rgba(245, 217, 149, 0.90)'  // Gold leaf petal
  ];

  window.NaqshCelebrateDate = function celebrateDate() {
    if (celebrated || document.hidden || !document.body) return;
    celebrated = true;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.className = 'scratch-celebration';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);

    const duration = 4400;
    const sparks = [], petals = [], stars = [];
    let width = 0, height = 0, frame = 0, nextBurst = 0, stopped = false;
    const start = performance.now();
    let lastDraw = start;

    // Determine burst points relative to the scratch frame position
    function getBurstCues() {
      const frameEl = document.querySelector('.scratch-frame-container');
      let cx = 0.5, cy = 0.45, lx = 0.35, ly = 0.5, rx = 0.65, ry = 0.5, tx = 0.5, ty = 0.35;
      if (frameEl) {
        const rect = frameEl.getBoundingClientRect();
        const sw = window.innerWidth, sh = window.innerHeight;
        cx = (rect.left + rect.width * 0.5) / sw;
        cy = (rect.top + rect.height * 0.5) / sh;
        lx = (rect.left + rect.width * 0.18) / sw;
        ly = (rect.top + rect.height * 0.65) / sh;
        rx = (rect.left + rect.width * 0.82) / sw;
        ry = (rect.top + rect.height * 0.65) / sh;
        tx = cx;
        ty = (rect.top + rect.height * 0.22) / sh;
      }
      return [
        { at: 50, x: cx, y: cy, power: 1.1 },
        { at: 350, x: lx, y: ly, power: 0.85 },
        { at: 650, x: rx, y: ry, power: 0.85 },
        { at: 1050, x: tx, y: ty, power: 0.9 },
        { at: 1550, x: cx, y: cy, power: 1.0 }
      ];
    }
    const cues = getBurstCues();

    function resize() {
      const nextWidth = Math.max(1, window.innerWidth);
      const nextHeight = Math.max(1, window.innerHeight);
      if (width && height) {
        for (const p of [...sparks, ...petals, ...stars]) {
          p.x *= nextWidth / width;
          p.y *= nextHeight / height;
          if (p.previousX !== undefined) p.previousX *= nextWidth / width;
          if (p.previousY !== undefined) p.previousY *= nextHeight / height;
        }
      }
      width = nextWidth;
      height = nextHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function cleanup() {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      canvas.remove();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pagehide', cleanup);
      document.removeEventListener('visibilitychange', onVisibility);
      sparks.length = 0;
      petals.length = 0;
      stars.length = 0;
    }

    function onVisibility() { if (document.hidden) cleanup(); }

    function burst(cue) {
      const radius = Math.min(width * 0.2, height * 0.15) * (cue.power || 1);
      const count = Math.floor(48 * (cue.power || 1));

      // Golden Sparks
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
        const speed = radius * (1.1 + Math.random() * 0.5);
        sparks.push({
          x: cue.x * width,
          y: cue.y * height,
          previousX: cue.x * width,
          previousY: cue.y * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 1.25 + Math.random() * 0.45,
          size: 0.9 + Math.random() * 0.9,
          colour: goldSparks[i % goldSparks.length],
        });
      }

      // Twinkling Diamond Stars
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius * 0.85;
        stars.push({
          x: cue.x * width + Math.cos(angle) * dist,
          y: cue.y * height + Math.sin(angle) * dist,
          age: 0,
          life: 1.1 + Math.random() * 0.6,
          size: 4 + Math.random() * 5,
          twinkleSpeed: 4 + Math.random() * 4
        });
      }
    }

    function drawPetal(ctx, x, y, size, angle, colour, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.75, -size * 0.7, size * 0.75, size * 0.7, 0, size * 1.1);
      ctx.bezierCurveTo(-size * 0.75, size * 0.7, -size * 0.75, -size * 0.7, 0, -size);
      ctx.fill();
      ctx.restore();
    }

    function drawDiamondStar(ctx, x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fffdf5';
      ctx.shadowColor = '#f5d995';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(0, 0, size, 0);
      ctx.quadraticCurveTo(0, 0, 0, size);
      ctx.quadraticCurveTo(0, 0, -size, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size);
      ctx.fill();
      ctx.restore();
    }

    function draw(now) {
      if (stopped) return;
      const elapsed = now - start;
      if (elapsed >= duration || document.hidden || !canvas.isConnected) {
        cleanup();
        return;
      }
      if (now - lastDraw < 1000 / 45) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const delta = Math.min((now - lastDraw) / 1000, 0.05);
      lastDraw = now;
      const fade = Math.min(1, (duration - elapsed) / 800);

      context.clearRect(0, 0, width, height);

      // Trigger burst cues
      while (nextBurst < cues.length && elapsed >= cues[nextBurst].at) {
        burst(cues[nextBurst++]);
      }

      // Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += delta;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.previousX = s.x;
        s.previousY = s.y;
        s.vx *= Math.pow(0.52, delta);
        s.vy = s.vy * Math.pow(0.52, delta) + 38 * delta;
        s.x += s.vx * delta;
        s.y += s.vy * delta;

        const sparkAlpha = Math.min(1, (s.life - s.age) / 0.55) * fade;
        context.globalAlpha = sparkAlpha;
        context.strokeStyle = `rgb(${s.colour})`;
        context.lineWidth = s.size;
        context.beginPath();
        context.moveTo(s.previousX - s.vx * 0.06, s.previousY - s.vy * 0.06);
        context.lineTo(s.x, s.y);
        context.stroke();

        context.fillStyle = '#fff4d6';
        context.beginPath();
        context.arc(s.x, s.y, s.size * 0.9, 0, Math.PI * 2);
        context.fill();
      }

      // Draw Twinkling Diamond Stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const st = stars[i];
        st.age += delta;
        if (st.age >= st.life) {
          stars.splice(i, 1);
          continue;
        }
        const twinkle = Math.max(0, Math.sin(st.age * st.twinkleSpeed));
        const starAlpha = twinkle * Math.min(1, (st.life - st.age) / 0.4) * fade;
        drawDiamondStar(context, st.x, st.y, st.size, starAlpha);
      }

      // Draw Drifting Rose Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += delta * p.spin;
        p.x += (p.vx + Math.sin(p.phase) * 22) * delta;
        p.y += p.vy * delta;
        p.rotation += p.spin * 0.5 * delta;

        // Wrap around top if falls off screen early
        if (p.y > height + 20 && elapsed < duration - 1200) {
          p.y = -15;
          p.x = Math.random() * width;
        }

        const petalAlpha = fade * 0.88;
        drawPetal(context, p.x, p.y, p.size, p.rotation, p.colour, petalAlpha);
      }

      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }

    resize();

    // Spawn initial graceful rose & gold petals fluttering down
    for (let i = 0; i < 60; i++) {
      petals.push({
        x: Math.random() * width,
        y: -Math.random() * height * 0.5 - 10,
        vx: (Math.random() - 0.5) * 50,
        vy: 75 + Math.random() * 95,
        size: 5.5 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        spin: 1.5 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI * 2,
        colour: petalColours[i % petalColours.length],
      });
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', cleanup);
    document.addEventListener('visibilitychange', onVisibility);
    frame = requestAnimationFrame(draw);
  };
})();
