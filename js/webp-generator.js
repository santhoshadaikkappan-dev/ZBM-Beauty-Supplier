/**
 * ZBM WebP Engine & Interactive Image Refresher
 * Enables dynamic canvas generation, custom photo uploading, and instant WebP downloads.
 */

const ZBM_WebP = (function() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  function renderToCanvas(product, customLogo = null, theme = 'default') {
    const W = 600, H = 600;
    ctx.clearRect(0, 0, W, H);

    // 1. Background
    let bgGrad = ctx.createRadialGradient(W/2, H/2 - 20, 50, W/2, H/2, 400);
    if (theme === 'gold' || product.category === 'Celebrity Range') {
      bgGrad.addColorStop(0, '#2b2214');
      bgGrad.addColorStop(0.6, '#17130c');
      bgGrad.addColorStop(1, '#0b0805');
    } else if (theme === 'green' || product.category.includes('Soap') || product.category.includes('Herbal')) {
      bgGrad.addColorStop(0, '#1c2820');
      bgGrad.addColorStop(0.6, '#101913');
      bgGrad.addColorStop(1, '#070c09');
    } else if (theme === 'blue' || product.category.includes('Serum')) {
      bgGrad.addColorStop(0, '#172533');
      bgGrad.addColorStop(0.6, '#0d1620');
      bgGrad.addColorStop(1, '#05090f');
    } else if (theme === 'rose' || product.category.includes('Rose') || product.category.includes('Lip')) {
      bgGrad.addColorStop(0, '#2d1b22');
      bgGrad.addColorStop(0.6, '#1a0e13');
      bgGrad.addColorStop(1, '#0b0508');
    } else {
      bgGrad.addColorStop(0, '#1e242b');
      bgGrad.addColorStop(0.6, '#11151a');
      bgGrad.addColorStop(1, '#080a0d');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Radial studio lighting
    const glow = ctx.createRadialGradient(W/2, H/2 - 20, 20, W/2, H/2 - 20, 220);
    glow.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Studio ground reflection shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(W/2, 490, 165, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Packaging Mockup
    const pkg = product.packaging || 'bottle';
    if (pkg === 'jar') {
      // Jar Body
      const jarGrad = ctx.createLinearGradient(W/2 - 120, 0, W/2 + 120, 0);
      jarGrad.addColorStop(0, '#423d33');
      jarGrad.addColorStop(0.3, '#d4c29a');
      jarGrad.addColorStop(0.5, '#f7eed7');
      jarGrad.addColorStop(0.7, '#c2af85');
      jarGrad.addColorStop(1, '#332d24');
      ctx.fillStyle = jarGrad;
      ctx.beginPath();
      ctx.roundRect(W/2 - 120, 275, 240, 185, [12, 12, 32, 32]);
      ctx.fill();

      // Jar Lid
      const lidGrad = ctx.createLinearGradient(W/2 - 130, 0, W/2 + 130, 0);
      lidGrad.addColorStop(0, '#9c7a2d');
      lidGrad.addColorStop(0.5, '#ffd97d');
      lidGrad.addColorStop(1, '#7a5e1e');
      ctx.fillStyle = lidGrad;
      ctx.beginPath();
      ctx.roundRect(W/2 - 130, 222, 260, 56, [14, 14, 4, 4]);
      ctx.fill();
    } else if (pkg === 'dropper') {
      // Dropper Body
      const botGrad = ctx.createLinearGradient(W/2 - 80, 0, W/2 + 80, 0);
      botGrad.addColorStop(0, '#2d2216');
      botGrad.addColorStop(0.3, '#856338');
      botGrad.addColorStop(0.5, '#dfbc7a');
      botGrad.addColorStop(0.7, '#74532a');
      botGrad.addColorStop(1, '#21180d');
      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.roundRect(W/2 - 80, 260, 160, 210, [24, 24, 28, 28]);
      ctx.fill();

      // Collar
      ctx.fillStyle = '#ffd97d';
      ctx.fillRect(W/2 - 40, 220, 80, 42);
      // Pipette rubber bulb
      ctx.fillStyle = '#1e1e1e';
      ctx.beginPath();
      ctx.roundRect(W/2 - 32, 165, 64, 58, [20, 20, 4, 4]);
      ctx.fill();
    } else if (pkg === 'soap') {
      // Soap Bar
      const barGrad = ctx.createLinearGradient(W/2 - 140, 250, W/2 + 140, 450);
      barGrad.addColorStop(0, '#d6cbba');
      barGrad.addColorStop(0.5, '#eee0cf');
      barGrad.addColorStop(1, '#baa58b');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(W/2 - 140, 255, 280, 185, 24);
      ctx.fill();

      // Band
      ctx.fillStyle = '#1b221d';
      ctx.fillRect(W/2 - 140, 312, 280, 75);
    } else if (pkg === 'tin') {
      // Tin
      const tinGrad = ctx.createRadialGradient(W/2, 355, 20, W/2, 355, 150);
      tinGrad.addColorStop(0, '#faebd7');
      tinGrad.addColorStop(0.7, '#c2a677');
      tinGrad.addColorStop(1, '#614e30');
      ctx.fillStyle = tinGrad;
      ctx.beginPath();
      ctx.ellipse(W/2, 355, 140, 100, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bottle / Pump / Spray
      const botGrad = ctx.createLinearGradient(W/2 - 85, 0, W/2 + 85, 0);
      botGrad.addColorStop(0, '#223028');
      botGrad.addColorStop(0.3, '#3d594b');
      botGrad.addColorStop(0.5, '#7fa391');
      botGrad.addColorStop(0.7, '#354d41');
      botGrad.addColorStop(1, '#1b2620');
      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.roundRect(W/2 - 85, 205, 170, 270, [32, 32, 24, 24]);
      ctx.fill();

      // Cap / Pump Head
      ctx.fillStyle = '#ffd97d';
      ctx.beginPath();
      ctx.roundRect(W/2 - 45, 155, 90, 52, [12, 12, 4, 4]);
      ctx.fill();
    }

    // 3. Logo Here Container Emblem
    const plateY = pkg === 'soap' ? 335 : (pkg === 'tin' ? 340 : 330);
    ctx.fillStyle = 'rgba(15, 17, 21, 0.9)';
    ctx.beginPath();
    ctx.roundRect(W/2 - 75, plateY - 26, 150, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#e2b755';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (customLogo) {
      try {
        ctx.drawImage(customLogo, W/2 - 60, plateY - 20, 120, 36);
      } catch (e) {
        drawDefaultLogoText(W, plateY);
      }
    } else {
      drawDefaultLogoText(W, plateY);
    }

    // 4. Header Badges
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = '600 13px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.textAlign = 'center';
    ctx.fillText(product.category.toUpperCase(), W/2, 60);

    // 5. Product Name & Spec
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 17px sans-serif';
    let title = product.name;
    if (title.length > 42) title = title.substring(0, 40) + '...';
    ctx.fillText(title, W/2, 545);

    ctx.fillStyle = '#e2b755';
    ctx.font = '600 14px sans-serif';
    ctx.fillText(`${product.weight}  •  ₹${product.price}`, W/2, 575);
  }

  function drawDefaultLogoText(W, plateY) {
    ctx.fillStyle = '#f8e3a1';
    ctx.font = 'bold 16px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Logo here', W/2, plateY + 4);

    ctx.fillStyle = '#e2b755';
    ctx.font = '11px sans-serif';
    ctx.fillText('★ ★ ★', W/2, plateY - 12);
  }

  function getWebPDataUrl(product, customLogo = null, theme = 'default') {
    renderToCanvas(product, customLogo, theme);
    return canvas.toDataURL('image/webp', 0.92);
  }

  function downloadWebP(product, customLogo = null, theme = 'default') {
    renderToCanvas(product, customLogo, theme);
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `product_${product.id}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 'image/webp', 0.92);
  }

  return {
    renderToCanvas,
    getWebPDataUrl,
    downloadWebP,
    canvas
  };
})();
