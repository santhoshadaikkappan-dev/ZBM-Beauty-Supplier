/**
 * ZANDRA BEAUTY MATRIX (ZBM) | Turnkey USA Private Label & Custom Rebranding Platform
 * Curated Target Audience Sample Discovery Kits ($99.00 USD + $29.00 Insured Freight)
 * Direct WhatsApp / Trade Desk: +91 9344087944 (https://wa.me/919344087944)
 */

(function() {
  'use strict';

  // Core Trade Configuration
  const WHATSAPP_PHONE = '919344087944';
  const KIT_PRICE = 99.00;
  const BASE_SHIPPING_FEE = 29.00;
  const ADDITIONAL_SHIPPING_FEE = 12.00;

  // State Management
  const allKits = typeof ZBM_SAMPLE_KITS !== 'undefined' ? ZBM_SAMPLE_KITS : [];
  let filteredKits = [...allKits];
  let currentAudienceFilter = 'all';
  let inquiryCart = JSON.parse(localStorage.getItem('zbm_sample_kit_cart') || '[]');

  // DOM Elements Cache
  const kitsGrid = document.getElementById('kitsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const mobileSearchInput = document.getElementById('mobileSearchInput');
  const mobileClearSearchBtn = document.getElementById('mobileClearSearchBtn');
  const audienceFilterBar = document.getElementById('audienceFilterBar');
  const visibleCountEl = document.getElementById('visibleCount');

  // Modals & Drawers
  const kitSpecsModal = document.getElementById('kitSpecsModal');
  const closeKitSpecsModalBtn = document.getElementById('closeKitSpecsModalBtn');
  const kitSpecsContent = document.getElementById('kitSpecsContent');

  const inquiryDrawer = document.getElementById('inquiryDrawer');
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBody = document.getElementById('drawerBody');
  const inquiryCountBadge = document.getElementById('inquiryCount');
  const drawerTotalCount = document.getElementById('drawerTotalCount');
  const drawerSubtotal = document.getElementById('drawerSubtotal');
  const drawerShippingVal = document.getElementById('drawerShippingVal');
  const drawerTotalValue = document.getElementById('drawerTotalValue');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
  const clearInquiryBtn = document.getElementById('clearInquiryBtn');

  // Cert Modal
  const certModal = document.getElementById('certModal');
  const closeCertModalBtn = document.getElementById('closeCertModalBtn');
  const certModalContent = document.getElementById('certModalContent');

  // ========================================================================
  // 1. CART ENGINE (Progressive Freight: $29 first kit + $12 per add'l kit)
  // ========================================================================
  window.calculateCartTotals = function() {
    let totalKits = 0;
    inquiryCart.forEach(item => {
      totalKits += (parseInt(item.qty, 10) || 1);
    });

    const rawSubtotal = Math.round(totalKits * KIT_PRICE * 100) / 100;
    // Progressive shipping: $29 for first kit, +$12 for each additional kit (e.g. 4 kits = $29 + $12*3 = $65)
    const shippingFee = totalKits > 0 
      ? Math.round((BASE_SHIPPING_FEE + (totalKits - 1) * ADDITIONAL_SHIPPING_FEE) * 100) / 100 
      : 0.00;
    const finalTotal = Math.round((rawSubtotal + shippingFee) * 100) / 100;

    return {
      rawSubtotal,
      shippingFee,
      finalTotal,
      totalQty: totalKits
    };
  };

  window.addKitToCart = function(kitId) {
    const kit = allKits.find(k => k.id === kitId);
    if (!kit) return;

    const existingIdx = inquiryCart.findIndex(item => item.id === kitId);
    if (existingIdx > -1) {
      inquiryCart[existingIdx].qty += 1;
    } else {
      inquiryCart.push({
        id: kit.id,
        name: kit.title,
        price: KIT_PRICE,
        image: kit.image,
        itemCount: kit.itemCount,
        audience: kit.audience,
        qty: 1
      });
    }

    saveCart();
    updateInquiryUI();
    openInquiryDrawer();
  };

  window.changeCartQty = function(idx, delta) {
    if (!inquiryCart[idx]) return;
    inquiryCart[idx].qty += delta;
    if (inquiryCart[idx].qty <= 0) {
      inquiryCart.splice(idx, 1);
    }
    saveCart();
    updateInquiryUI();
  };

  window.setCartItemQuantity = function(idx, val) {
    const q = parseInt(val, 10);
    if (!inquiryCart[idx]) return;
    if (isNaN(q) || q <= 0) {
      inquiryCart.splice(idx, 1);
    } else {
      inquiryCart[idx].qty = q;
    }
    saveCart();
    updateInquiryUI();
  };

  window.removeCartItem = function(idx) {
    inquiryCart.splice(idx, 1);
    saveCart();
    updateInquiryUI();
  };

  window.clearAllCart = function() {
    inquiryCart = [];
    saveCart();
    updateInquiryUI();
  };

  function saveCart() {
    localStorage.setItem('zbm_sample_kit_cart', JSON.stringify(inquiryCart));
  }

  // ========================================================================
  // 2. DRAWER & UI UPDATES
  // ========================================================================
  function updateInquiryUI() {
    const totals = calculateCartTotals();

    // Badge
    if (inquiryCountBadge) {
      inquiryCountBadge.innerText = totals.totalQty;
      inquiryCountBadge.style.display = totals.totalQty > 0 ? 'inline-flex' : 'none';
    }

    if (drawerTotalCount) {
      drawerTotalCount.innerText = `${totals.totalQty} Discovery Kit(s)`;
    }

    // Drawer Body
    if (!drawerBody) return;

    if (inquiryCart.length === 0) {
      drawerBody.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
          <h4>Your Sample Discovery Basket is Empty</h4>
          <p>Select any of the 8 curated target audience discovery kits ($99.00 each) to test unbranded laboratory formulations before scaling your private label.</p>
          <button class="btn-primary" onclick="closeInquiryDrawer()">Browse 8 Discovery Kits</button>
        </div>
      `;
      if (drawerSubtotal) drawerSubtotal.innerText = '$0.00';
      if (drawerShippingVal) drawerShippingVal.innerText = '$0.00';
      if (drawerTotalValue) drawerTotalValue.innerText = '$0.00';
      renderPayPalButtons();
      return;
    }

    drawerBody.innerHTML = inquiryCart.map((item, idx) => {
      const lineTotal = item.qty * KIT_PRICE;
      return `
        <div class="drawer-item">
          <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
          <div class="drawer-item-info">
            <div class="drawer-item-title">${item.name}</div>
            <div class="drawer-item-sub"><i class="fa-solid fa-users-viewfinder"></i> ${item.audience}</div>
            <div class="drawer-item-badge"><i class="fa-solid fa-flask"></i> ${item.itemCount} Physical Formulations Included</div>
            <div class="drawer-item-pricing-row">
              <span class="drawer-unit-price">$${KIT_PRICE.toFixed(2)} USD</span>
              <span class="drawer-tier-badge">Sample Discovery Box</span>
            </div>
            <div class="drawer-item-subtotal">Line Total: <strong>$${lineTotal.toFixed(2)} USD</strong></div>
          </div>

          <div class="drawer-item-actions">
            <div class="qty-stepper">
              <button onclick="changeCartQty(${idx}, -1)" title="Decrease">-</button>
              <input 
                type="number" 
                value="${item.qty}" 
                min="1" 
                class="qty-input" 
                onchange="setCartItemQuantity(${idx}, this.value)"
              >
              <button onclick="changeCartQty(${idx}, 1)" title="Increase">+</button>
            </div>
            <button onclick="removeCartItem(${idx})" class="btn-remove-item" title="Remove Kit">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Totals
    if (drawerSubtotal) drawerSubtotal.innerText = `$${totals.rawSubtotal.toFixed(2)}`;
    if (drawerShippingVal) drawerShippingVal.innerText = `$${totals.shippingFee.toFixed(2)}`;
    if (drawerTotalValue) drawerTotalValue.innerText = `$${totals.finalTotal.toFixed(2)}`;

    const drawerShippingBreakdown = document.getElementById('drawerShippingBreakdown');
    if (drawerShippingBreakdown) {
      if (totals.totalQty > 1) {
        const extraFee = (totals.totalQty - 1) * ADDITIONAL_SHIPPING_FEE;
        const extraCount = totals.totalQty - 1;
        drawerShippingBreakdown.innerText = `($29 first kit + $${extraFee} for ${extraCount} add'l kit${extraCount > 1 ? 's' : ''})`;
      } else if (totals.totalQty === 1) {
        drawerShippingBreakdown.innerText = `($29 base express freight)`;
      } else {
        drawerShippingBreakdown.innerText = '';
      }
    }

    renderPayPalButtons();
  }

  // ========================================================================
  // 3. PAYPAL & DIRECT CARD CHECKOUT ENGINE ($99 + $29 = $128)
  // ========================================================================
  let currentPayPalAmount = null;
  window.renderPayPalButtons = function() {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    if (!window.paypal) {
      container.innerHTML = `
        <div style="background: rgba(0, 121, 193, 0.08); border: 1px solid rgba(0, 121, 193, 0.25); border-radius: 6px; padding: 10px; font-size: 0.78rem; color: #0079C1; text-align: center;">
          <i class="fa-brands fa-paypal"></i> PayPal & Card Checkout Ready.<br>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Ad-blocker detected? Use the WhatsApp Trade Desk below to complete order.</span>
        </div>
      `;
      return;
    }

    if (!inquiryCart || inquiryCart.length === 0) {
      container.innerHTML = `
        <div style="background: rgba(223, 192, 144, 0.1); border: 1px dashed rgba(223, 192, 144, 0.4); border-radius: 6px; padding: 12px; font-size: 0.76rem; color: var(--text-secondary); text-align: center;">
          <i class="fa-solid fa-box-open" style="color: var(--accent-gold); margin-bottom: 4px; display: block; font-size: 1.1rem;"></i>
          Add a Discovery Sample Kit ($99.00) to activate instant checkout.
        </div>
      `;
      currentPayPalAmount = null;
      return;
    }

    const totals = calculateCartTotals();
    if (currentPayPalAmount === totals.finalTotal && container.children.length > 0) {
      return;
    }

    container.innerHTML = '';
    currentPayPalAmount = totals.finalTotal;

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 44
        },
        createOrder: function(data, actions) {
          const liveTotals = calculateCartTotals();
          const itemsPayload = inquiryCart.map(item => ({
            name: `${item.name} (${item.itemCount} Formulations)`,
            unit_amount: {
              currency_code: 'USD',
              value: KIT_PRICE.toFixed(2)
            },
            quantity: item.qty.toString(),
            category: 'PHYSICAL_GOODS'
          }));

          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{
              description: `ZANDRA BEAUTY MATRIX (ZBM) USA Private Label Sample Discovery Kit Order`,
              amount: {
                currency_code: 'USD',
                value: liveTotals.finalTotal.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: liveTotals.rawSubtotal.toFixed(2)
                  },
                  shipping: {
                    currency_code: 'USD',
                    value: liveTotals.shippingFee.toFixed(2)
                  }
                }
              },
              items: itemsPayload
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            const payerName = details.payer && details.payer.name ? details.payer.name.given_name : 'Valued Partner';
            alert(`Payment Successful! Thank you, ${payerName}.\n\nTransaction ID: ${details.id}\nYour unbranded Discovery Sample Box with Certificate of Analysis (COA) is being prepared for express dispatch.`);
            
            // Forward confirmation to WhatsApp
            submitOrderViaWhatsApp(`PAYPAL_PAID (Transaction: ${details.id})`);
            clearAllCart();
            closeInquiryDrawer();
          });
        },
        onError: function(err) {
          console.error('PayPal Checkout Notice:', err);
          alert('PayPal popup closed or authorization in progress. You can also finalize order immediately via WhatsApp Trade Desk with Citi Bank ACH / Wire.');
        }
      }).render('#paypal-button-container');
    } catch (e) {
      console.error('PayPal Render Error:', e);
    }
  };

  // WhatsApp B2B Dispatch
  window.submitOrderViaWhatsApp = function(paymentStatus) {
    const totals = calculateCartTotals();
    if (inquiryCart.length === 0) {
      alert('Your Sample Basket is empty. Please add at least one Discovery Kit.');
      return;
    }

    const buyerName = (document.getElementById('buyerName') && document.getElementById('buyerName').value.trim()) || 'Prospective Brand Partner';
    const buyerBrand = (document.getElementById('buyerBrand') && document.getElementById('buyerBrand').value.trim()) || 'Private Label Beauty LLC';

    let msg = `*NEW SAMPLE DISCOVERY KIT ORDER — ZANDRA BEAUTY MATRIX (ZBM)*\n`;
    msg += `--------------------------------------------------\n`;
    msg += `*Buyer Name:* ${buyerName}\n`;
    msg += `*Brand / LLC:* ${buyerBrand}\n`;
    msg += `*Status:* ${paymentStatus || 'INVOICE_REQUEST (Unpaid)'}\n`;
    msg += `--------------------------------------------------\n`;
    msg += `*SELECTED SAMPLE KITS ($99 USD Each):*\n\n`;

    inquiryCart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   • Audience: ${item.audience}\n`;
      msg += `   • Contents: ${item.itemCount} Physical Formulations\n`;
      msg += `   • Quantity: ${item.qty} kit(s) x $${KIT_PRICE} = $${(item.qty * KIT_PRICE).toFixed(2)} USD\n\n`;
    });

    msg += `--------------------------------------------------\n`;
    msg += `*Kits Subtotal:* $${totals.rawSubtotal.toFixed(2)} USD\n`;
    msg += `*Insured Express Worldwide Freight:* $${totals.shippingFee.toFixed(2)} USD${totals.totalQty > 1 ? ` ($29 base + $12/additional kit)` : ''}\n`;
    msg += `*TOTAL PAYABLE:* $${totals.finalTotal.toFixed(2)} USD\n`;
    msg += `--------------------------------------------------\n`;
    msg += `*Included in Every Discovery Box:*\n`;
    msg += `✓ Unbranded pre-filled physical formulations ready for custom label testing\n`;
    msg += `✓ Quad-Certified Facility Dossier (US FDA Registered & WHO-GMP)\n`;
    msg += `✓ Full INCI Ingredient Disclosure & Certificate of Analysis (COA)\n`;
    msg += `✓ Official B2B Commercial Proforma Quotation for Bulk Scale-Up (50 to 1,000+ units)\n\n`;
    msg += `Please confirm shipping dispatch and provide Citi Bank ACH routing or tracking.`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Payment Preference Switcher
  window.handlePaymentPrefChange = function() {
    const isPayPal = document.getElementById('payMethodPayPal') && document.getElementById('payMethodPayPal').checked;
    const paypalSection = document.getElementById('paypalButtonsSection');
    const cardOptionLabel = document.getElementById('cardOptionLabel');
    const achOptionLabel = document.getElementById('achOptionLabel');

    if (cardOptionLabel && achOptionLabel) {
      cardOptionLabel.classList.toggle('active', isPayPal);
      achOptionLabel.classList.toggle('active', !isPayPal);
    }

    if (paypalSection) {
      paypalSection.style.display = isPayPal ? 'block' : 'none';
      if (isPayPal) renderPayPalButtons();
    }
  };

  // Drawer Controls
  window.openInquiryDrawer = function() {
    if (inquiryDrawer) {
      inquiryDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      renderPayPalButtons();
    }
  };

  window.closeInquiryDrawer = function() {
    if (inquiryDrawer) {
      inquiryDrawer.classList.remove('open');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
  };

  // ========================================================================
  // 4. DISCOVERY KITS RENDERING & MODAL SPECS
  // ========================================================================
  function renderKitCards() {
    if (!kitsGrid) return;

    if (filteredKits.length === 0) {
      kitsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2.2rem; color: var(--accent-gold); margin-bottom: 12px;"></i>
          <h3>No matching Discovery Kits found</h3>
          <p>Try clearing your search query or selecting 'All Target Audiences'.</p>
          <button class="btn-primary" onclick="resetKitFilters()">View All 8 Discovery Kits</button>
        </div>
      `;
      if (visibleCountEl) visibleCountEl.innerText = '0';
      return;
    }

    if (visibleCountEl) visibleCountEl.innerText = filteredKits.length;

    kitsGrid.innerHTML = filteredKits.map(kit => {
      const isBeam = kit.id === 'celebrity-vault' || kit.id === 'brand-founder';
      return `
        <article class="kit-card bento-card spotlight-card ${isBeam ? 'border-beam-card' : ''}" data-id="${kit.id}">
          <div class="kit-image-wrapper">
            <img src="${kit.image}" alt="${kit.title}" class="kit-card-img" loading="lazy">
            <div class="kit-badge-top-left">${kit.badge}</div>
            <div class="kit-badge-bottom-right"><i class="fa-solid fa-certificate"></i> US FDA & GMP Certified</div>
          </div>

          <div class="kit-card-body">
            <div class="kit-audience-tag">
              <i class="fa-solid ${kit.icon}"></i>
              <span>${kit.audience}</span>
            </div>

            <h3 class="kit-card-title">${kit.title}</h3>
            <p class="kit-card-tagline">${kit.tagline}</p>
            <p class="kit-card-desc">${kit.overview}</p>

            <div class="kit-highlights-box">
              <div class="kit-highlights-title"><i class="fa-solid fa-sparkles" style="color: var(--accent-gold);"></i> What's In The Box (${kit.itemCount} Formulations):</div>
              <ul class="kit-highlights-list">
                ${kit.highlights.map(h => `<li><i class="fa-solid fa-check"></i> <span>${h}</span></li>`).join('')}
              </ul>
            </div>

            <div class="kit-formulations-preview">
              ${kit.formulations.slice(0, 5).map(f => `<span class="kit-form-tag">#${f.num} ${f.name}</span>`).join('')}
              ${kit.formulations.length > 5 ? `<span class="kit-form-tag more">+${kit.formulations.length - 5} more formulations</span>` : ''}
            </div>

            <div class="kit-card-footer">
              <div class="kit-pricing-block">
                <div class="kit-price-row">
                  <span class="kit-price-val">$${kit.price.toFixed(2)}</span>
                  <span class="kit-price-curr">USD / Kit</span>
                </div>
                <div class="kit-shipping-note">
                  <i class="fa-solid fa-plane-departure" style="color: #25D366;"></i> +$29.00 Insured Freight (+$12/add'l kit)
                </div>
              </div>

              <div class="kit-card-actions">
                <button class="btn-primary-large btn-add-kit btn-magnetic" onclick="addKitToCart('${kit.id}')">
                  <i class="fa-solid fa-cart-plus"></i>
                  <span>Order Sample Kit ($99)</span>
                </button>
                <button class="btn-secondary-large btn-specs-kit btn-magnetic" onclick="openKitSpecsModal('${kit.id}')">
                  <i class="fa-solid fa-list-check"></i>
                  <span>View All ${kit.itemCount} Specs</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attach3DKitTilt();
  }

  // Interactive 3D Card Tilt
  function attach3DKitTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cards = document.querySelectorAll('.kit-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // Open Detailed Specs Modal
  window.openKitSpecsModal = function(kitId) {
    const kit = allKits.find(k => k.id === kitId);
    if (!kit || !kitSpecsModal || !kitSpecsContent) return;

    kitSpecsContent.innerHTML = `
      <div class="specs-modal-header">
        <div class="specs-modal-image-col">
          <img src="${kit.image}" alt="${kit.title}" class="specs-modal-img">
          <div class="specs-modal-pricing-card">
            <div class="price-big">$${kit.price.toFixed(2)} USD</div>
            <div class="price-ship"><i class="fa-solid fa-truck-fast"></i> +$29.00 Insured Freight (+$12/additional kit)</div>
            <button class="btn-primary-large" style="width: 100%; margin-top: 10px;" onclick="addKitToCart('${kit.id}'); closeKitSpecsModal();">
              <i class="fa-solid fa-cart-plus"></i> Order This Discovery Kit ($99)
            </button>
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello ZBM, I have questions about ' + kit.title)}" target="_blank" class="btn-whatsapp-outline" style="width: 100%; margin-top: 8px;">
              <i class="fa-brands fa-whatsapp"></i> Inquire via WhatsApp
            </a>
          </div>
        </div>

        <div class="specs-modal-info-col">
          <div class="specs-badge"><i class="fa-solid ${kit.icon}"></i> ${kit.audience}</div>
          <h2 class="specs-title">${kit.title}</h2>
          <p class="specs-tagline">${kit.tagline}</p>
          <p class="specs-desc">${kit.overview}</p>

          <div class="specs-inclusions-banner">
            <h4><i class="fa-solid fa-shield-halved" style="color: var(--accent-gold);"></i> Standard Turnkey Discovery Inclusions:</h4>
            <ul>
              <li><strong>${kit.itemCount} Physical Laboratory Formulations:</strong> Arrives pre-filled in unbranded luxury packaging ready for your brand's label application.</li>
              <li><strong>Quality & Safety Dossier:</strong> Full INCI ingredient disclosure, Certificate of Analysis (COA), and batch test records.</li>
              <li><strong>Scale-Up Commercial Proforma:</strong> Official B2B quotation for scaling from 50 units (Startup Launch) to 1,000+ units (Enterprise).</li>
              <li><strong>US FDA Registered:</strong> Sterile cGMP 21 CFR Part 700/701 compliant production facilities.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="specs-modal-table-section">
        <h3 class="specs-table-title">Complete Formulations Manifest (${kit.itemCount} Formulations Included)</h3>
        <div class="specs-table-wrapper">
          <table class="specs-manifest-table">
            <thead>
              <tr>
                <th>Item #</th>
                <th>Formulation Name</th>
                <th>Volume</th>
                <th>Key Bio-Actives</th>
                <th>Packaging Format</th>
                <th>Clinical / Service Application</th>
              </tr>
            </thead>
            <tbody>
              ${kit.formulations.map(f => `
                <tr>
                  <td><span class="manifest-num">#${f.num}</span></td>
                  <td><strong>${f.name}</strong><div class="manifest-cat">${f.category}</div></td>
                  <td><span class="manifest-weight">${f.weight}</span></td>
                  <td><div class="manifest-actives">${f.actives}</div></td>
                  <td><span class="manifest-pkg"><i class="fa-solid fa-box"></i> ${f.pkg}</span></td>
                  <td><div class="manifest-note">${f.note}</div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    kitSpecsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  };

  window.closeKitSpecsModal = function() {
    if (kitSpecsModal) {
      kitSpecsModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
  };

  // ========================================================================
  // 5. FILTERING & SEARCH ENGINE
  // ========================================================================
  function applyKitFilters() {
    let list = [...allKits];

    // Audience Filter
    if (currentAudienceFilter !== 'all') {
      list = list.filter(k => k.id === currentAudienceFilter);
    }

    // Search Query (Desktop + Mobile Sync)
    const qDesktop = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const qMobile = mobileSearchInput ? mobileSearchInput.value.trim().toLowerCase() : '';
    const q = qDesktop || qMobile;

    if (q) {
      list = list.filter(k => {
        return (
          k.title.toLowerCase().includes(q) ||
          k.audience.toLowerCase().includes(q) ||
          k.tagline.toLowerCase().includes(q) ||
          k.overview.toLowerCase().includes(q) ||
          k.formulations.some(f => 
            f.name.toLowerCase().includes(q) ||
            f.actives.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q) ||
            f.num.toString() === q
          )
        );
      });
    }

    filteredKits = list;
    renderKitCards();
  }

  function updatePillIndicator(activePill) {
    const indicator = document.getElementById('pillSliderIndicator');
    if (!indicator || !activePill) return;
    indicator.style.left = `${activePill.offsetLeft}px`;
    indicator.style.width = `${activePill.offsetWidth}px`;
    indicator.style.opacity = '1';
  }

  window.resetKitFilters = function() {
    currentAudienceFilter = 'all';
    if (searchInput) searchInput.value = '';
    if (mobileSearchInput) mobileSearchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (mobileClearSearchBtn) mobileClearSearchBtn.style.display = 'none';
    
    let allBtn = null;
    document.querySelectorAll('.audience-pill').forEach(btn => {
      const isAll = btn.getAttribute('data-audience') === 'all';
      btn.classList.toggle('active', isAll);
      if (isAll) allBtn = btn;
    });

    if (allBtn) updatePillIndicator(allBtn);
    applyKitFilters();
  };

  function setupAudienceFilterPills() {
    const pills = document.querySelectorAll('.audience-pill');
    const initialActive = document.querySelector('.audience-pill.active');
    if (initialActive) {
      setTimeout(() => updatePillIndicator(initialActive), 120);
    }

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentAudienceFilter = pill.getAttribute('data-audience');
        updatePillIndicator(pill);
        applyKitFilters();
      });
    });

    window.addEventListener('resize', () => {
      const active = document.querySelector('.audience-pill.active');
      if (active) updatePillIndicator(active);
    });
  }

  // ========================================================================
  // 6. AMBIENT DRIFT & PARTICLES
  // ========================================================================
  function initAmbientLayer() {
    const layer = document.getElementById('ambientLayer');
    if (!layer) return;

    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-particle';
      const size = Math.random() * 8 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 16 + 12}s`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      if (Math.random() > 0.5) {
        p.style.borderRadius = '50%';
        p.style.background = 'radial-gradient(circle, rgba(223,192,144,0.45) 0%, rgba(223,192,144,0) 70%)';
      } else {
        p.style.borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';
        p.style.background = 'rgba(251, 113, 133, 0.28)';
      }
      layer.appendChild(p);
    }
  }

  // Regulatory Cert Modal
  window.openCertModal = function(type) {
    if (!certModal || !certModalContent) return;
    let title = 'US FDA Compliance';
    let desc = 'cGMP 21 CFR Part 700/701 compliant facility batch records, INCI safety documentation, and stability test protocols.';

    if (type === 'iso') {
      title = 'ISO 9001:2015 International Certification';
      desc = 'Certified international quality management standard guaranteeing zero microbial contamination and standardized batch repeatability.';
    } else if (type === 'gmp') {
      title = 'WHO-GMP Cleanroom Certification';
      desc = 'World Health Organization standard Good Manufacturing Practice operating under Grade-D sterile cleanroom standards.';
    } else if (type === 'fssai') {
      title = 'Clean, Vegan & Cruelty-Free Compliance';
      desc = '100% cruelty-free, zero animal testing, paraben-free, sulfate-free options with pure cold-pressed organic botanicals.';
    }

    certModalContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <i class="fa-solid fa-certificate" style="font-size: 3.2rem; color: #DFC090; margin-bottom: 16px; display: inline-block;"></i>
        <h3 style="font-size: 1.55rem; font-family: var(--font-display, 'Syne', sans-serif); font-weight: 800; color: #F7F5F0; margin-bottom: 12px; line-height: 1.3;">${title}</h3>
        <p style="font-size: 0.92rem; color: #D5D0C7; line-height: 1.65; max-width: 500px; margin: 0 auto;">${desc}</p>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 10px;">
        <button class="btn-primary-large" onclick="closeCertModal()" style="min-width: 170px;">Acknowledge & Close</button>
        <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello ZBM, please share official ' + title + ' verification sheets')}" target="_blank" class="btn-secondary-large" style="min-width: 200px; text-decoration: none;">
          <i class="fa-brands fa-whatsapp" style="color: #25D366; font-size: 1.1rem;"></i>
          <span>Request Full PDF Dossier</span>
        </a>
      </div>
    `;
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  };

  window.closeCertModal = function() {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
  };

  // ========================================================================
  // 8. MOTION & KINETIC INTERACTION ENGINES (Lenis, GSAP, Spotlight, Magnet)
  // ========================================================================
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false
      });
      window.lenis = lenis;

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn('Lenis init warning:', e);
    }
  }

  function initSpotlightCards() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const spotlights = document.querySelectorAll('.spotlight-card');
      spotlights.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });
    }, { passive: true });
  }

  function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const buttons = document.querySelectorAll('.btn-magnetic');
      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
        
        if (dist < 60) {
          const deltaX = (e.clientX - btnCenterX) * 0.28;
          const deltaY = (e.clientY - btnCenterY) * 0.28;
          btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        } else {
          if (btn.style.transform && btn.style.transform !== 'translate(0px, 0px)') {
            btn.style.transform = 'translate(0px, 0px)';
          }
        }
      });
    }, { passive: true });
  }

  function initHeroBottle3D() {
    const bottleContainer = document.querySelector('.hero-floating-container');
    if (!bottleContainer || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 16;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 16;
      bottleContainer.style.transform = `perspective(1200px) rotateY(${xPercent}deg) rotateX(${-yPercent}deg)`;
    }, { passive: true });
  }

  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    // Kinetic title line reveal
    gsap.from('.kinetic-line', {
      duration: 1.1,
      y: 40,
      opacity: 0,
      stagger: 0.16,
      ease: 'power3.out',
      clearProps: 'all'
    });

    gsap.from('.hero-subtitle', {
      duration: 0.9,
      y: 25,
      opacity: 0,
      delay: 0.35,
      ease: 'power2.out',
      clearProps: 'all'
    });

    gsap.from('.hero-cta-group', {
      duration: 0.9,
      y: 20,
      opacity: 0,
      delay: 0.5,
      ease: 'power2.out',
      clearProps: 'all'
    });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.step-card, .trust-badge-card').forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          clearProps: 'transform'
        });
      });
    }
  }

  // ========================================================================
  // 9. INITIALIZATION & BINDINGS
  // ========================================================================
  function init() {
    initLenis();
    initSpotlightCards();
    initMagneticButtons();
    initHeroBottle3D();
    initGSAPAnimations();
    initAmbientLayer();
    updateInquiryUI();
    renderKitCards();
    setupAudienceFilterPills();

    // Search Synchronizer
    function syncSearch(val) {
      if (searchInput && searchInput.value !== val) searchInput.value = val;
      if (mobileSearchInput && mobileSearchInput.value !== val) mobileSearchInput.value = val;
      if (clearSearchBtn) clearSearchBtn.style.display = val ? 'block' : 'none';
      if (mobileClearSearchBtn) mobileClearSearchBtn.style.display = val ? 'block' : 'none';
      applyKitFilters();
    }

    if (searchInput) {
      searchInput.addEventListener('input', e => syncSearch(e.target.value));
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        syncSearch('');
        searchInput.focus();
      });
    }

    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('input', e => syncSearch(e.target.value));
    }
    if (mobileClearSearchBtn) {
      mobileClearSearchBtn.addEventListener('click', () => {
        syncSearch('');
        mobileSearchInput.focus();
      });
    }

    // Drawer Listeners
    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openInquiryDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeInquiryDrawer);
    if (clearInquiryBtn) clearInquiryBtn.addEventListener('click', clearAllCart);

    // Modal Closers
    if (closeKitSpecsModalBtn) closeKitSpecsModalBtn.addEventListener('click', closeKitSpecsModal);
    if (kitSpecsModal) {
      kitSpecsModal.addEventListener('click', e => {
        if (e.target === kitSpecsModal) closeKitSpecsModal();
      });
    }

    if (closeCertModalBtn) closeCertModalBtn.addEventListener('click', closeCertModal);
    if (certModal) {
      certModal.addEventListener('click', e => {
        if (e.target === certModal) closeCertModal();
      });
    }

    // Mobile Navigation Drawer Controls
    window.openMobileNav = function() {
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('mobileNavBackdrop');
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    };

    window.closeMobileNav = function() {
      const drawer = document.getElementById('mobileNavDrawer');
      const backdrop = document.getElementById('mobileNavBackdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };

    const openMobileNavBtn = document.getElementById('openMobileNavBtn');
    const closeMobileNavBtn = document.getElementById('closeMobileNavBtn');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

    if (openMobileNavBtn) openMobileNavBtn.addEventListener('click', window.openMobileNav);
    if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', window.closeMobileNav);
    if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', window.closeMobileNav);

    // Escape Key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeInquiryDrawer();
        closeKitSpecsModal();
        closeCertModal();
        window.closeMobileNav();
      }
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
