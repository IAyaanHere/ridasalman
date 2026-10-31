/* Aesthetic Single Frame Scratch Interaction
   Matched to the frame's soft ivory silk, blush cream and floral aesthetic palette. */
window.NaqshScratch = function initializeScratch(canvas, settings) {
  const container = canvas.closest('.scratch-frame-container') || canvas.parentElement;
  const sparksContainer = container ? container.querySelector('.scratch-live-sparks') : null;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let width = 0;
  let height = 0;
  let ratio = 1;
  let drawing = false;
  let last = null;
  let revealed = false;
  let touched = false;
  let lastCheck = 0;

  function paintCover() {
    if (!width || !height) return;
    context.globalCompositeOperation = 'source-over';

    // Frame-matched aesthetic gradient: ivory silk with soft blush peach cream
    const coverGrad = context.createLinearGradient(0, 0, width, height);
    coverGrad.addColorStop(0, '#fdfaf5');    // Warm ivory silk
    coverGrad.addColorStop(0.22, '#f8eee3'); // Soft champagne cream
    coverGrad.addColorStop(0.52, '#f5e4dd'); // Delicate blush rose cream
    coverGrad.addColorStop(0.78, '#faece3'); // Peach silk
    coverGrad.addColorStop(1, '#eee0d2');    // Antique pearl
    context.fillStyle = coverGrad;
    context.fillRect(0, 0, width, height);

    // Seeded soft pearl & blush floral flecks
    let seed = 431;
    function random() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    // White pearl highlights
    for (let i = 0; i < 70; i++) {
      const x = random() * width, y = random() * height;
      context.fillStyle = `rgba(255, 255, 255, ${0.45 + random() * 0.45})`;
      context.beginPath();
      context.arc(x, y, 0.5 + random() * 1.4, 0, Math.PI * 2);
      context.fill();
    }
    // Delicate blush peach shimmer
    for (let i = 0; i < 50; i++) {
      const x = random() * width, y = random() * height;
      context.fillStyle = `rgba(235, 175, 165, ${0.2 + random() * 0.25})`;
      context.beginPath();
      context.arc(x, y, 0.6 + random() * 1.5, 0, Math.PI * 2);
      context.fill();
    }
    // Muted antique champagne & gold stardust
    for (let i = 0; i < 40; i++) {
      const x = random() * width, y = random() * height;
      context.fillStyle = `rgba(180, 145, 90, ${0.18 + random() * 0.22})`;
      context.beginPath();
      context.arc(x, y, 0.5 + random() * 1.3, 0, Math.PI * 2);
      context.fill();
    }

    // Calligraphic & embossed text matching the frame's warm mocha palette
    context.save();
    const midY = height / 2;
    const fontSize = Math.max(11, Math.min(20, height * 0.115));

    // Top decorative motif
    context.font = `${Math.max(7, fontSize * 0.65)}px "Marcellus", serif`;
    context.fillStyle = 'rgba(150, 115, 85, 0.85)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('✦   ❦   ✦', width / 2, midY - fontSize * 1.35);

    // Main label text in Cormorant SC
    const labelText = (settings.coverLabel || 'REVEAL').toUpperCase();
    context.font = `600 ${fontSize}px "Cormorant SC", serif`;

    // Embossed soft light highlight underneath
    context.fillStyle = 'rgba(255, 255, 255, 0.85)';
    context.fillText(labelText, width / 2, midY + 1);

    // Main text color (rich warm mocha matching invitation theme)
    context.fillStyle = '#705236';
    context.fillText(labelText, width / 2, midY);

    // Subtitle in cursive script (rose mocha)
    context.font = `400 ${Math.max(11, fontSize * 0.95)}px "Parisienne", "Monsieur La Doulaise", cursive`;
    context.fillStyle = '#9c6f55';
    context.fillText('Our Wedding Date', width / 2, midY + fontSize * 1.35);

    context.restore();
  }

  function resize() {
    if (revealed) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const nextWidth = rect.width;
    const nextHeight = rect.height;
    if (!nextWidth || !nextHeight || (Math.abs(nextWidth - width) < 0.5 && Math.abs(nextHeight - height) < 0.5)) return;

    const previous = document.createElement('canvas');
    previous.width = canvas.width;
    previous.height = canvas.height;
    if (touched) previous.getContext('2d').drawImage(canvas, 0, 0);

    width = nextWidth;
    height = nextHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    if (touched) {
      context.drawImage(previous, 0, 0, previous.width, previous.height, 0, 0, width, height);
    } else {
      paintCover();
    }
  }

  function emitLiveSparkles(x, y) {
    if (!sparksContainer) return;
    const count = 2 + Math.floor(Math.random() * 2);
    const rect = canvas.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const baseX = (rect.left - containerRect.left) + x;
    const baseY = (rect.top - containerRect.top) + y;

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = 'scratch-spark-particle';
      spark.style.left = `${baseX}px`;
      spark.style.top = `${baseY}px`;
      const angle = Math.random() * Math.PI * 2;
      const dist = 10 + Math.random() * 20;
      spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      spark.style.setProperty('--dy', `${Math.sin(angle) * dist - 6}px`);
      sparksContainer.append(spark);
      setTimeout(() => spark.remove(), 650);
    }
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    drawing = false;
    container.classList.add('is-revealed');
    canvas.setAttribute('aria-disabled', 'true');
    canvas.style.transition = 'opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.75s ease-out';
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';

    // Spawn sparkles around frame
    if (sparksContainer) {
      const rect = canvas.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const spark = document.createElement('span');
          spark.className = 'scratch-spark-particle';
          const rx = width * (0.12 + Math.random() * 0.76);
          const ry = height * (0.12 + Math.random() * 0.76);
          spark.style.left = `${(rect.left - containerRect.left) + rx}px`;
          spark.style.top = `${(rect.top - containerRect.top) + ry}px`;
          const angle = Math.random() * Math.PI * 2;
          const dist = 14 + Math.random() * 28;
          spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
          spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
          sparksContainer.append(spark);
          setTimeout(() => spark.remove(), 750);
        }, i * 32);
      }
    }

    settings.onReveal?.();
  }

  function clearedFraction() {
    const { data, width: w, height: h } = context.getImageData(0, 0, canvas.width, canvas.height);
    let count = 0;
    let cleared = 0;
    const step = Math.max(4, Math.floor(w / 45));
    for (let y = step; y < h - step; y += step) {
      for (let x = step; x < w - step; x += step) {
        count++;
        if (data[(y * w + x) * 4 + 3] < 64) {
          cleared++;
        }
      }
    }
    return count ? cleared / count : 0;
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function erase(event) {
    const next = point(event);
    context.globalCompositeOperation = 'destination-out';
    const strokeWidth = Math.max(24, Math.min(width, height) * 0.24);
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    context.moveTo((last || next).x, (last || next).y);
    context.lineTo(next.x, next.y);
    context.stroke();

    context.beginPath();
    context.arc(next.x, next.y, strokeWidth / 2, 0, Math.PI * 2);
    context.fill();

    emitLiveSparkles(next.x, next.y);

    last = next;
    touched = true;

    if (performance.now() - lastCheck > 85) {
      lastCheck = performance.now();
      if (clearedFraction() >= (settings.threshold || 0.35)) {
        reveal();
      }
    }
  }

  canvas.addEventListener('pointerdown', event => {
    if (revealed) return;
    drawing = true;
    last = point(event);
    canvas.setPointerCapture(event.pointerId);
    erase(event);
  });

  canvas.addEventListener('pointermove', event => {
    if (drawing && !revealed) erase(event);
  });

  function finish() {
    if (!drawing) return;
    drawing = false;
    last = null;
    if (clearedFraction() >= (settings.threshold || 0.35)) {
      reveal();
    }
  }

  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);
  canvas.addEventListener('lostpointercapture', finish);

  canvas.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      reveal();
    }
  });

  resize();
  if (canvas.parentElement) {
    new ResizeObserver(resize).observe(canvas.parentElement);
  }
  document.fonts.ready.then(() => {
    if (!touched && !revealed) paintCover();
  });
};
