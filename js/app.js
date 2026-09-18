/**
 * ZANDRA BEAUTY MATRIX (ZBM) | High-End Anti-Gravity B2B Platform
 * 202 Master Formulations • 8 Structured Departments • WhatsApp Direct Ordering
 * Direct WhatsApp / Trade Desk: +91 9344087944 (https://wa.me/919344087944)
 */

(function() {
  'use strict';

  // Core Trade Configuration
  const WHATSAPP_PHONE = '919344087944';
  const MIN_SHIPPING_CART_VALUE = 150.00;

  // State Management
  const allProducts = typeof ZBM_PRODUCTS !== 'undefined' ? ZBM_PRODUCTS : [];
  let filteredProducts = [...allProducts];
  let currentCategory = 'all';
  let currentMoqTier = '1'; // '1', '50', '250', '500', '1000'
  let currentViewMode = 'categorized'; // 'categorized', 'list'
  let inquiryCart = JSON.parse(localStorage.getItem('aura_inquiry_cart') || '[]');
  let currentModalProduct = null;

  // Visualizer Studio State
  let visualizerPkg = 'dropper';
  let visualizerEffect = 'petals';
  let currentBrandPreset = 'zbm'; // 'zbm', 'zandra', 'custom'
  let customLogoImg = null;
  let visualizerAnimFrame = null;
  let animTime = 0;

  // Pre-load ZBM Brand Logos
  const zbmLogoImg = new Image();
  zbmLogoImg.src = 'assets/images/brand/zbm_emblem_logo.png';

  const zandraLogoImg = new Image();
  zandraLogoImg.src = 'assets/images/brand/zandra_full_logo.png';

  // Department Categories Mapping (8 Structured Departments)
  const DEPARTMENTS = [
    {
      id: 'celebrity',
      name: 'Celebrity Luxury Range',
      icon: 'fa-crown',
      desc: 'Pharma-grade L-Glutathione, 24K gold flakes, and high-potency celebrity secrets.',
      filter: p => p.category === 'Celebrity Range'
    },
    {
      id: 'serums',
      name: 'Facial Serums & Elixirs',
      icon: 'fa-droplet',
      desc: 'Micro-molecular active serums in frosted glass dropper packaging with targeted cellular repair.',
      filter: p => p.category.includes('Serum') && !p.category.includes('Hair')
    },
    {
      id: 'creams',
      name: 'Face Creams & Restorative Gels',
      icon: 'fa-spa',
      desc: 'Dermal barrier restorative creams and soothing aloe gels in heavy-wall frosted jars.',
      filter: p => (p.category === 'Face Cream' || p.category === 'Face Gel')
    },
    {
      id: 'cleansers',
      name: 'Face Cleansers, Scrubs & Packs',
      icon: 'fa-pump-soap',
      desc: 'pH-balanced purifying cleansers and exfoliating polishes in matte PCR squeeze tubes.',
      filter: p => (p.category === 'Face Wash' || p.category.includes('Scrub') || p.category.includes('Cleanser') || p.category.includes('Pack'))
    },
    {
      id: 'soaps',
      name: 'Artisanal Botanical Soaps',
      icon: 'fa-soap',
      desc: 'Cold-processed 45-day cured botanical bathing bars wrapped in zero-waste linen paper bands.',
      filter: p => p.category === 'Soaps' || p.name.toLowerCase().includes('bathing bar')
    },
    {
      id: 'haircare',
      name: 'Hair Oils, Shampoos & Conditioners',
      icon: 'fa-wind',
      desc: 'Sulfate-free clarified shampoos, follicle root oils, and hair conditioning emulsions.',
      filter: p => (p.category.includes('Hair') || p.category === 'Shampoo' || p.category === 'Hair Conditioner')
    },
    {
      id: 'bodycare',
      name: 'Body Lotions, Shimmers & Bath Salts',
      icon: 'fa-bottle-droplet',
      desc: 'Nourishing body moisturizers, shimmer lotions, and therapeutic mineral bath salts.',
      filter: p => (p.category === 'Body Lotion' || p.category.includes('Bath Salt') || p.category.includes('Body Scrub'))
    },
    {
      id: 'specialized',
      name: 'Specialized Clinical Formulations',
      icon: 'fa-wand-magic-sparkles',
      desc: 'Specialized dermal balms, dark circle serums, lip treatments, kajal, and sunscreens.',
      filter: p => (p.category.includes('Special') || p.category.includes('Eye') || p.category.includes('Lip') || p.category.includes('Sunscreen') || p.category.includes('Foot') || p.category.includes('Inti') || p.category.includes('Wax') || p.category.includes('Kajal'))
    }
  ];

  // DOM Elements Cache
  const productsGrid = document.getElementById('productsGrid');
  const categoryBar = document.getElementById('categoryBar');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const visibleCountEl = document.getElementById('visibleCount');
  const concernFilter = document.getElementById('concernFilter');
  const skinTypeFilter = document.getElementById('skinTypeFilter');
  const sortFilter = document.getElementById('sortFilter');
  const emptyState = document.getElementById('emptyState');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  const moqPills = document.querySelectorAll('.moq-pill-btn');

  // Modal Elements
  const productModal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalContent = document.getElementById('modalContent');

  // Drawer Elements
  const inquiryDrawer = document.getElementById('inquiryDrawer');
  const openDrawerBtn = document.getElementById('openDrawerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerBody = document.getElementById('drawerBody');
  const inquiryCountBadge = document.getElementById('inquiryCount');
  const drawerTotalCount = document.getElementById('drawerTotalCount');
  const drawerSubtotal = document.getElementById('drawerSubtotal');
  const drawerDiscountRow = document.getElementById('drawerDiscountRow');
  const drawerDiscountRate = document.getElementById('drawerDiscountRate');
  const drawerDiscountVal = document.getElementById('drawerDiscountVal');
  const drawerTotalValue = document.getElementById('drawerTotalValue');
  const drawerShippingAlert = document.getElementById('drawerShippingAlert');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
  const clearInquiryBtn = document.getElementById('clearInquiryBtn');

  // Visualizer Elements
  const visualizerModal = document.getElementById('visualizerModal');
  const openVisualizerBtn = document.getElementById('openVisualizerBtn');
  const closeVisualizerBtn = document.getElementById('closeVisualizerBtn');
  const brandCanvas = document.getElementById('brandCanvas');
  const brandLogoInput = document.getElementById('brandLogoInput');
  const customUploadContainer = document.getElementById('customUploadContainer');
  const downloadMockupBtn = document.getElementById('downloadMockupBtn');
  const resetVisualizerBtn = document.getElementById('resetVisualizerBtn');

  // Cert Modal Elements
  const certModal = document.getElementById('certModal');
  const closeCertModalBtn = document.getElementById('closeCertModalBtn');
  const certModalContent = document.getElementById('certModalContent');

  // ========================================================================
  // 1. DYNAMIC WHOLESALE MOQ UNIT PRICING ENGINE
  // ========================================================================
  window.calculateItemUnitPrice = function(product, qty) {
    if (!product) return { price: 0, discount: 'Base', tier: 1 };
    qty = parseInt(qty, 10) || 1;
    const basePrice = product.pricing ? product.pricing.sample : (product.usdPrice || 24);

    if (qty >= 1000) {
      const p = (product.pricing && product.pricing.tier5_price) || (basePrice * 0.35);
      return { price: Math.round(p * 100) / 100, discount: '65% OFF (1000+ pcs)', tier: 5 };
    } else if (qty >= 500) {
      const p = (product.pricing && product.pricing.tier4_price) || (basePrice * 0.50);
      return { price: Math.round(p * 100) / 100, discount: '50% OFF (500 pcs)', tier: 4 };
    } else if (qty >= 250) {
      const p = (product.pricing && product.pricing.tier3_price) || (basePrice * 0.65);
      return { price: Math.round(p * 100) / 100, discount: '35% OFF (250 pcs)', tier: 3 };
    } else if (qty >= 50) {
      const p = (product.pricing && product.pricing.tier2_price) || (basePrice * 0.80);
      return { price: Math.round(p * 100) / 100, discount: '20% OFF (50 pcs)', tier: 2 };
    } else {
      return { price: basePrice, discount: 'Sample (No MOQ)', tier: 1 };
    }
  };

  // ========================================================================
  // 2. CART TIERED DISCOUNT ENGINE & FREE SHIPPING
  // ========================================================================
  window.calculateCartTotals = function() {
    let rawSubtotal = 0;
    let totalItems = 0;

    inquiryCart.forEach(item => {
      const prod = allProducts.find(x => x.id === item.id);
      const tierInfo = calculateItemUnitPrice(prod, item.qty);
      rawSubtotal += (tierInfo.price * item.qty);
      totalItems += item.qty;
    });

    rawSubtotal = Math.round(rawSubtotal * 100) / 100;
    let discountRate = 0;
    let discountLabel = '';
    let isBulkCapped = false;

    // Cart Tiered Discounts
    if (rawSubtotal > 1000) {
      isBulkCapped = true;
      discountRate = 0.35;
      discountLabel = '35% Enterprise Wholesale Quote';
    } else if (rawSubtotal === 1000) {
      discountRate = 0.35;
      discountLabel = '35% Bulk Discount';
    } else if (rawSubtotal > 500) {
      discountRate = 0.28;
      discountLabel = '28% Wholesale Tier Discount';
    } else if (rawSubtotal > 100) {
      discountRate = 0.20;
      discountLabel = '20% Volume Tier Discount';
    }

    const discountAmount = Math.round((rawSubtotal * discountRate) * 100) / 100;
    const finalTotal = Math.round((rawSubtotal - discountAmount) * 100) / 100;

    const meetsMinShipping = rawSubtotal >= MIN_SHIPPING_CART_VALUE;
    const amountNeededForShipping = meetsMinShipping ? 0 : Math.round((MIN_SHIPPING_CART_VALUE - rawSubtotal) * 100) / 100;

    return {
      rawSubtotal,
      totalQty: totalItems,
      discountRate,
      discountAmount,
      discountLabel,
      finalTotal,
      isBulkCapped,
      meetsMinShipping,
      amountNeededForShipping,
      shippingFee: 0.00
    };
  };

  // ========================================================================
  // 3. AMBIENT PARTICLES (ANTI-GRAVITY BACKGROUND)
  // ========================================================================
  function initAmbientLayer() {
    const layer = document.getElementById('ambientLayer');
    if (!layer) return;

    for (let i = 0; i < 24; i++) {
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

  // ========================================================================
  // 4. CATEGORY PILLS (8 STRUCTURED DEPARTMENTS)
  // ========================================================================
  function renderCategoryPills() {
    if (!categoryBar) return;

    let html = `
      <button class="cat-pill ${currentCategory === 'all' ? 'active' : ''}" data-cat="all">
        <i class="fa-solid fa-layer-group"></i>
        <span>All Master Formulations</span>
        <span class="cat-count">${allProducts.length}</span>
      </button>
    `;

    DEPARTMENTS.forEach(dept => {
      const count = allProducts.filter(dept.filter).length;
      const isActive = currentCategory === dept.id ? 'active' : '';
      html += `
        <button class="cat-pill ${isActive}" data-cat="${dept.id}">
          <i class="fa-solid ${dept.icon}"></i>
          <span>${dept.name}</span>
          <span class="cat-count">${count}</span>
        </button>
      `;
    });

    categoryBar.innerHTML = html;

    categoryBar.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-cat');
        categoryBar.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  window.filterByCategory = function(categoryOrDeptId) {
    currentCategory = categoryOrDeptId;
    if (categoryBar) {
      categoryBar.querySelectorAll('.cat-pill').forEach(b => {
        if (b.getAttribute('data-cat') === categoryOrDeptId) {
          b.classList.add('active');
          b.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else {
          b.classList.remove('active');
        }
      });
    }
    applyFilters();
    const targetEl = document.getElementById(`dept-${categoryOrDeptId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ========================================================================
  // 5. PRODUCT CARD RENDERING (UNIQUE WEBP IMAGES & REALISTIC SHADERS)
  // ========================================================================
  function renderProductCardHtml(p) {
    let activePrice = p.pricing ? p.pricing.sample : (p.usdPrice || 24);

    if (currentMoqTier === '50') {
      activePrice = p.pricing ? p.pricing.tier2_price : (activePrice * 0.8);
    } else if (currentMoqTier === '250') {
      activePrice = p.pricing ? p.pricing.tier3_price : (activePrice * 0.65);
    } else if (currentMoqTier === '500') {
      activePrice = p.pricing ? p.pricing.tier4_price : (activePrice * 0.50);
    } else if (currentMoqTier === '1000') {
      activePrice = p.pricing ? p.pricing.tier5_price : (activePrice * 0.35);
    }

    const starTags = (p.starFeatures || []).slice(0, 2).map(feat => 
      `<span class="star-tag">✦ ${feat}</span>`
    ).join('');

    const imgPath = p.image || `assets/images/mockups/${p.packaging || 'jar'}.jpg`;

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="card-image-wrapper">
          <div class="card-floating-badges">
            <span class="badge-item-id">#${p.id}</span>
            <span class="badge-free-shipping"><i class="fa-solid fa-truck-fast"></i> Free Shipping</span>
          </div>

          <div class="card-podium-shadow"></div>

          <img 
            src="${imgPath}" 
            alt="${p.name}" 
            class="card-product-image"
            loading="lazy"
            onclick="openProductModal(${p.id})"
            onerror="this.src='assets/images/mockups/${p.packaging || 'jar'}.jpg'"
          >
        </div>

        <div class="card-body">
          <div class="card-header-row">
            <h3 class="card-title" title="${p.name}" onclick="openProductModal(${p.id})">
              ${p.name}
            </h3>
            <span class="card-weight">${p.weight}</span>
          </div>

          <div class="card-meta-row">
            <span class="meta-pill" title="Target Concern">
              <i class="fa-solid fa-bullseye"></i>
              ${p.concern || 'Cellular Revitalization'}
            </span>
          </div>

          <div class="card-star-features">
            ${starTags}
          </div>

          <div class="card-aroma">
            <i class="fa-solid fa-wind"></i>
            <span>${p.aroma || 'Natural Clean Botanical Essential Oils'}</span>
          </div>

          <div class="card-trust-row">
            <span class="card-trust-item"><i class="fa-solid fa-check"></i> US FDA</span>
            <span class="card-trust-item"><i class="fa-solid fa-check"></i> ISO 9001</span>
            <span class="card-trust-item"><i class="fa-solid fa-check"></i> WHO-GMP</span>
            <span class="card-trust-item"><i class="fa-solid fa-check"></i> $0 Freight</span>
          </div>

          <div class="card-pricing-box">
            <div class="card-price-headline">
              <div class="price-unit-block">
                <span class="price-currency">$</span>
                <span class="price-amount" id="price-${p.id}">${activePrice.toFixed(2)}</span>
                <span class="price-moq-label">/ unit</span>
              </div>
              <div class="price-msrp-tag">
                <span>MSRP $${p.pricing ? p.pricing.msrp : 65}</span>
                <span class="margin-badge">${p.pricing ? p.pricing.margin : '70%'} Margin</span>
              </div>
            </div>

            <div class="card-tier-selector">
              <button class="tier-btn ${currentMoqTier === '1' ? 'active' : ''}" onclick="selectCardTier(${p.id}, '1')">
                <span class="tier-btn-qty">1 pc</span>
                <span class="tier-btn-rate">$${p.pricing ? p.pricing.sample.toFixed(2) : activePrice.toFixed(2)}</span>
              </button>
              <button class="tier-btn ${currentMoqTier === '50' ? 'active' : ''}" onclick="selectCardTier(${p.id}, '50')">
                <span class="tier-btn-qty">50 pcs</span>
                <span class="tier-btn-rate">$${p.pricing ? p.pricing.tier2_price.toFixed(2) : (activePrice * 0.8).toFixed(2)}</span>
              </button>
              <button class="tier-btn ${currentMoqTier === '500' ? 'active' : ''}" onclick="selectCardTier(${p.id}, '500')">
                <span class="tier-btn-qty">500+ pcs</span>
                <span class="tier-btn-rate">$${p.pricing ? p.pricing.tier4_price.toFixed(2) : (activePrice * 0.5).toFixed(2)}</span>
              </button>
            </div>

            <div class="card-actions-row">
              <button class="btn-card-sample" onclick="addToSampleCart(${p.id})">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Add to Basket</span>
              </button>
              <button class="btn-card-specs" onclick="openProductModal(${p.id})" title="View Specs & INCI">
                <i class="fa-solid fa-flask"></i>
              </button>
              <button class="btn-card-specs" onclick="sendProductWhatsApp(${p.id})" title="Direct WhatsApp DM (+91 9344087944)">
                <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderProductCards() {
    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (visibleCountEl) visibleCountEl.innerText = '0';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (visibleCountEl) visibleCountEl.innerText = filteredProducts.length;

    const hasActiveFilters = (searchInput && searchInput.value.trim()) || 
                             (concernFilter && concernFilter.value) || 
                             (skinTypeFilter && skinTypeFilter.value) ||
                             (currentCategory !== 'all');

    if (!hasActiveFilters && currentViewMode === 'categorized') {
      let categorizedHtml = '';

      DEPARTMENTS.forEach(dept => {
        const deptProducts = filteredProducts.filter(dept.filter);
        if (deptProducts.length === 0) return;

        categorizedHtml += `
          <section class="department-section" id="dept-${dept.id}">
            <div class="department-header">
              <div class="department-header-left">
                <div class="department-badge">
                  <i class="fa-solid ${dept.icon}"></i>
                  <span>${dept.name}</span>
                </div>
                <h3 class="department-title">${dept.name}</h3>
                <p class="department-desc">${dept.desc}</p>
              </div>
              <div class="department-header-right">
                <span class="department-count-badge">${deptProducts.length} Formulations</span>
                <span class="badge-free-shipping-tag"><i class="fa-solid fa-truck-fast"></i> Free Shipping on $150+</span>
              </div>
            </div>

            <div class="products-grid department-grid">
              ${deptProducts.map(renderProductCardHtml).join('')}
            </div>
          </section>
        `;
      });

      productsGrid.innerHTML = categorizedHtml;
    } else {
      productsGrid.innerHTML = filteredProducts.map(renderProductCardHtml).join('');
    }

    attach3DCardTilt();
  }

  window.selectCardTier = function(productId, tier) {
    currentMoqTier = tier;
    const prod = allProducts.find(x => x.id === productId);
    if (!prod) return;

    let price = prod.pricing ? prod.pricing.sample : 24;
    if (tier === '50') price = prod.pricing ? prod.pricing.tier2_price : (price * 0.8);
    else if (tier === '250') price = prod.pricing ? prod.pricing.tier3_price : (price * 0.65);
    else if (tier === '500') price = prod.pricing ? prod.pricing.tier4_price : (price * 0.50);
    else if (tier === '1000') price = prod.pricing ? prod.pricing.tier5_price : (price * 0.35);

    const priceEl = document.getElementById(`price-${productId}`);
    if (priceEl) priceEl.innerText = price.toFixed(2);

    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (card) {
      card.querySelectorAll('.tier-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = Array.from(card.querySelectorAll('.tier-btn')).find(b => b.innerText.includes(tier));
      if (activeBtn) activeBtn.classList.add('active');
    }
  };

  // 3D Card Interactive Tilt Effect
  function attach3DCardTilt() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ========================================================================
  // 6. FILTERING, SEARCH & SORTING
  // ========================================================================
  function applyFilters() {
    let list = [...allProducts];

    // Department Filter
    if (currentCategory !== 'all') {
      const dept = DEPARTMENTS.find(d => d.id === currentCategory);
      if (dept) {
        list = list.filter(dept.filter);
      }
    }

    // Search Query
    if (searchInput && searchInput.value.trim() !== '') {
      const q = searchInput.value.trim().toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.concern && p.concern.toLowerCase().includes(q)) ||
        (p.keyActive && p.keyActive.toLowerCase().includes(q)) ||
        (p.aroma && p.aroma.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.packaging && p.packaging.toLowerCase().includes(q)) ||
        p.id.toString() === q
      );
    }

    // Concern Filter
    if (concernFilter && concernFilter.value !== '') {
      const cVal = concernFilter.value.toLowerCase();
      list = list.filter(p => p.concern && p.concern.toLowerCase().includes(cVal));
    }

    // Skin/Hair Type Filter
    if (skinTypeFilter && skinTypeFilter.value !== '') {
      const sVal = skinTypeFilter.value.toLowerCase();
      list = list.filter(p => p.skinType && p.skinType.toLowerCase().includes(sVal));
    }

    // Sort
    if (sortFilter) {
      const sortVal = sortFilter.value;
      if (sortVal === 'price-asc') {
        list.sort((a, b) => (a.pricing ? a.pricing.sample : a.usdPrice) - (b.pricing ? b.pricing.sample : b.usdPrice));
      } else if (sortVal === 'price-desc') {
        list.sort((a, b) => (b.pricing ? b.pricing.sample : b.usdPrice) - (a.pricing ? a.pricing.sample : a.usdPrice));
      } else if (sortVal === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortVal === 'margin-desc') {
        list.sort((a, b) => {
          const mA = parseInt(a.pricing ? a.pricing.margin : 70, 10);
          const mB = parseInt(b.pricing ? b.pricing.margin : 70, 10);
          return mB - mA;
        });
      } else {
        list.sort((a, b) => a.id - b.id);
      }
    }

    filteredProducts = list;
    renderProductCards();
  }

  window.resetFilters = function() {
    currentCategory = 'all';
    if (searchInput) searchInput.value = '';
    if (concernFilter) concernFilter.value = '';
    if (skinTypeFilter) skinTypeFilter.value = '';
    if (sortFilter) sortFilter.value = 'id-asc';
    renderCategoryPills();
    applyFilters();
  };

  // ========================================================================
  // 7. SAMPLE BASKET / CART DRAWER LOGIC
  // ========================================================================
  window.addToSampleCart = function(productId, initialQty = null) {
    const prod = allProducts.find(x => x.id === productId);
    if (!prod) return;

    let qtyToAdd = initialQty ? parseInt(initialQty, 10) : parseInt(currentMoqTier, 10);
    if (!qtyToAdd || qtyToAdd < 1) qtyToAdd = 1;

    const existing = inquiryCart.find(x => x.id === productId);
    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      inquiryCart.push({
        id: prod.id,
        name: prod.name,
        price: prod.pricing ? prod.pricing.sample : (prod.usdPrice || 24),
        weight: prod.weight,
        image: prod.image || `assets/images/products/product_${prod.id}.webp`,
        qty: qtyToAdd
      });
    }

    localStorage.setItem('aura_inquiry_cart', JSON.stringify(inquiryCart));
    updateInquiryUI();
    openInquiryDrawer();
  };

  window.changeCartQty = function(idx, delta) {
    if (!inquiryCart[idx]) return;
    inquiryCart[idx].qty += delta;
    if (inquiryCart[idx].qty <= 0) {
      inquiryCart.splice(idx, 1);
    }
    localStorage.setItem('aura_inquiry_cart', JSON.stringify(inquiryCart));
    updateInquiryUI();
  };

  window.setCartItemQuantity = function(idx, newQty) {
    if (!inquiryCart[idx]) return;
    const q = parseInt(newQty, 10);
    if (isNaN(q) || q <= 0) {
      inquiryCart.splice(idx, 1);
    } else {
      inquiryCart[idx].qty = q;
    }
    localStorage.setItem('aura_inquiry_cart', JSON.stringify(inquiryCart));
    updateInquiryUI();
  };

  window.removeCartItem = function(idx) {
    inquiryCart.splice(idx, 1);
    localStorage.setItem('aura_inquiry_cart', JSON.stringify(inquiryCart));
    updateInquiryUI();
  };

  window.clearAllCart = function() {
    if (confirm('Are you sure you want to clear your sample basket?')) {
      inquiryCart = [];
      localStorage.removeItem('aura_inquiry_cart');
      updateInquiryUI();
    }
  };

  function updateInquiryUI() {
    const totalCount = inquiryCart.reduce((sum, item) => sum + item.qty, 0);
    
    if (inquiryCountBadge) {
      inquiryCountBadge.innerText = totalCount;
      inquiryCountBadge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    }
    if (drawerTotalCount) {
      drawerTotalCount.innerText = `${totalCount} unit(s)`;
    }

    if (!drawerBody) return;

    if (inquiryCart.length === 0) {
      drawerBody.innerHTML = `
        <div class="empty-drawer">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.2rem; color: var(--accent-gold); margin-bottom: 12px;"></i>
          <h4>Your Sample Basket is Empty</h4>
          <p>Browse our 202 master formulations and add items to request evaluation samples or tiered bulk manufacturing.</p>
        </div>
      `;
      if (drawerSubtotal) drawerSubtotal.innerText = '$0.00';
      if (drawerTotalValue) drawerTotalValue.innerText = '$0.00';
      if (drawerDiscountRow) drawerDiscountRow.style.display = 'none';
      if (drawerShippingAlert) drawerShippingAlert.style.display = 'none';
      if (whatsappOrderBtn) whatsappOrderBtn.classList.add('disabled-btn');
      return;
    }

    const totals = calculateCartTotals();

    // Populate drawer line items
    drawerBody.innerHTML = inquiryCart.map((item, idx) => {
      const prod = allProducts.find(x => x.id === item.id);
      const tierInfo = calculateItemUnitPrice(prod, item.qty);
      const lineTotal = tierInfo.price * item.qty;

      return `
        <div class="drawer-item">
          <img src="${item.image}" alt="${item.name}" class="drawer-item-img" onerror="this.src='assets/images/mockups/jar.jpg'">
          <div class="drawer-item-info">
            <div class="drawer-item-title">${item.name}</div>
            <div class="drawer-item-sub">${item.weight} • ${prod ? prod.category : ''}</div>
            
            <div class="drawer-item-pricing-row">
              <span class="drawer-unit-price">$${tierInfo.price.toFixed(2)} / unit</span>
              <span class="drawer-tier-badge">${tierInfo.discount}</span>
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
            <button onclick="removeCartItem(${idx})" class="btn-remove-item" title="Remove Item">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Update Drawer Price Fields
    if (drawerSubtotal) {
      drawerSubtotal.innerText = `$${totals.rawSubtotal.toFixed(2)}`;
    }

    // Tiered Discount Display
    if (drawerDiscountRow) {
      if (totals.discountAmount > 0) {
        drawerDiscountRow.style.display = 'flex';
        if (drawerDiscountRate) drawerDiscountRate.innerText = `(${Math.round(totals.discountRate * 100)}% OFF)`;
        if (drawerDiscountVal) drawerDiscountVal.innerText = `-$${totals.discountAmount.toFixed(2)}`;
      } else {
        drawerDiscountRow.style.display = 'none';
      }
    }

    if (drawerTotalValue) {
      if (totals.isBulkCapped) {
        drawerTotalValue.innerHTML = `<span style="font-size: 0.92rem; color: #166534; font-weight: 800;">Enterprise Quote Required (> $1,000)</span>`;
      } else {
        drawerTotalValue.innerText = `$${totals.finalTotal.toFixed(2)}`;
      }
    }

    // Shipping Alert ($150 minimum threshold)
    if (drawerShippingAlert) {
      if (!totals.meetsMinShipping) {
        drawerShippingAlert.style.display = 'flex';
        drawerShippingAlert.innerHTML = `
          <i class="fa-solid fa-circle-exclamation"></i>
          <div>
            <strong>Minimum cart value for sample shipping is $150.</strong>
            <span>Add $${totals.amountNeededForShipping.toFixed(2)} more to qualify for Free Freight.</span>
          </div>
        `;
      } else {
        drawerShippingAlert.style.display = 'none';
      }
    }

    // Enable WhatsApp Order Button
    if (whatsappOrderBtn) {
      whatsappOrderBtn.classList.remove('disabled-btn');
    }
  }

  function openInquiryDrawer() {
    if (inquiryDrawer) {
      inquiryDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (typeof window.populateDrawerBuyer === 'function') {
        window.populateDrawerBuyer();
      }
    }
  }

  function closeInquiryDrawer() {
    if (inquiryDrawer) {
      inquiryDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ========================================================================
  // 8. DIRECT WHATSAPP ORDER ENGINE (+91 9344087944)
  // ========================================================================
  window.submitOrderViaWhatsApp = function() {
    if (!inquiryCart || inquiryCart.length === 0) {
      alert('Your sample basket is empty. Please select formulations before submitting.');
      return;
    }

    const totals = calculateCartTotals();
    const buyerBrand = (document.getElementById('buyerBrandInput')?.value || '').trim();
    const buyerName = (document.getElementById('buyerNameInput')?.value || '').trim();
    const buyerLocation = (document.getElementById('buyerLocationInput')?.value || '').trim();
    const buyerNotes = (document.getElementById('buyerNotesInput')?.value || '').trim();

    let msg = `🌟 *NEW PRIVATE LABEL ORDER / RFQ — ZANDRA BEAUTY MATRIX (ZBM)* 🌟\n`;
    msg += `----------------------------------------\n`;
    msg += `👤 *BUYER & BRAND PROFILE:*\n`;
    const authUser = window.ZBM_AUTH ? window.ZBM_AUTH.getUser() : null;
    if (authUser && authUser.email) {
      msg += `• Verified B2B Account: ${authUser.name} (${authUser.email})\n`;
    }
    if (buyerBrand) msg += `• Brand / Company: *${buyerBrand}*\n`;
    if (buyerName) msg += `• Contact Person: ${buyerName}\n`;
    if (buyerLocation) msg += `• Delivery Destination: ${buyerLocation}\n`;
    if (buyerNotes) msg += `• Custom Notes / Requests: ${buyerNotes}\n`;
    if (!buyerBrand && !buyerName && !buyerLocation && !authUser) {
      msg += `• Inquiry Type: USA Private Label Turnkey Order\n`;
    }
    msg += `----------------------------------------\n\n`;

    msg += `📦 *SELECTED FORMULATIONS (${totals.totalQty} Units):*\n`;
    inquiryCart.forEach((item, idx) => {
      const prod = allProducts.find(x => x.id === item.id);
      const tier = calculateItemUnitPrice(prod, item.qty);
      const packaging = prod?.packaging ? prod.packaging.toUpperCase() : 'BOTTLE';
      const active = prod?.keyActive || 'Clinical Bio-Actives';
      
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   • Packaging: ${packaging} (${item.weight})\n`;
      msg += `   • Key Active: ${active}\n`;
      msg += `   • Quantity: *${item.qty} pcs* [Tier: ${tier.discount}]\n`;
      msg += `   • Unit Price: $${tier.price.toFixed(2)} USD\n`;
      msg += `   • Line Total: $${(tier.price * item.qty).toFixed(2)} USD\n\n`;
    });

    msg += `----------------------------------------\n`;
    msg += `📊 *ORDER COMMERCIAL SUMMARY:*\n`;
    msg += `• Total Formulations: ${inquiryCart.length} product(s)\n`;
    msg += `• Total Units: ${totals.totalQty} pcs\n`;
    msg += `• Raw Subtotal: $${totals.rawSubtotal.toFixed(2)} USD\n`;
    if (totals.discountAmount > 0) {
      msg += `• Volume Discount: -$${totals.discountAmount.toFixed(2)} USD (${totals.discountLabel})\n`;
    }
    msg += `• Insured Freight: *FREE SHIPPING ($0.00)*\n`;
    if (totals.isBulkCapped) {
      msg += `• Order Status: *ENTERPRISE BULK QUOTE (> $1,000)*\n`;
    } else {
      msg += `• Estimated Total: *$${totals.finalTotal.toFixed(2)} USD*\n`;
    }
    msg += `----------------------------------------\n\n`;
    msg += `💬 *NEXT STEPS:*\n`;
    msg += `Please confirm formulation batch availability, physical unbranded sample dispatch, label artwork customization with my logo, and manufacturing turnaround.`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  // Direct WhatsApp DM for a single product
  window.sendProductWhatsApp = function(productId) {
    const prod = allProducts.find(x => x.id === productId);
    if (!prod) return;

    const tier = calculateItemUnitPrice(prod, parseInt(currentMoqTier, 10));
    let text = `Hello ZANDRA BEAUTY MATRIX (ZBM) Team,\n\n`;
    text += `I am interested in private label manufacturing for formulation #${prod.id}:\n`;
    text += `• Product: *${prod.name}*\n`;
    text += `• Category: ${prod.category} (${prod.weight})\n`;
    text += `• Packaging Archetype: ${prod.packaging || 'Frosted Container'} with unbranded "Logo Here" label\n`;
    text += `• Active Ingredients: ${prod.keyActive || 'Clinical Bio-Actives'}\n`;
    text += `• Target Concern: ${prod.concern || 'Dermal Renewal'}\n`;
    text += `• Sample Unit Price: $${prod.pricing ? prod.pricing.sample.toFixed(2) : 24.00} USD\n`;
    text += `• Selected Volume Tier: ${currentMoqTier} pcs ($${tier.price.toFixed(2)}/unit)\n\n`;
    text += `Please share standard lead times, private label branding options, and COA/batch test documentation.`;

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ========================================================================
  // 9. PRODUCT DETAIL MODAL (SPECS, INCI, REGULATORY)
  // ========================================================================
  window.openProductModal = function(productId) {
    const prod = allProducts.find(x => x.id === productId);
    if (!prod) return;
    currentModalProduct = prod;

    const ingList = (prod.ingredients || []).map(ing => `<li>${ing}</li>`).join('');
    const starList = (prod.starFeatures || []).map(f => `<li><i class="fa-solid fa-sparkles"></i> ${f}</li>`).join('');
    const certList = (prod.certificates || []).map(c => `<span class="modal-cert-tag"><i class="fa-solid fa-shield-check"></i> ${c}</span>`).join('');

    const imgPath = prod.image || `assets/images/mockups/${prod.packaging || 'jar'}.jpg`;

    modalContent.innerHTML = `
      <div class="modal-image-col">
        <div class="modal-image-stage">
          <div class="card-podium-shadow"></div>
          <img src="${imgPath}" alt="${prod.name}" class="modal-img" onerror="this.src='assets/images/mockups/${prod.packaging || 'jar'}.jpg'">
        </div>
        <div class="modal-trust-tags">
          ${certList}
        </div>
      </div>

      <div class="modal-info-col">
        <div class="modal-tag-row">
          <span class="modal-category-tag">${prod.category}</span>
          <span class="modal-item-id">Item #${prod.id}</span>
          <span class="badge-free-shipping"><i class="fa-solid fa-truck-fast"></i> Free Shipping</span>
        </div>

        <h2 class="modal-title">${prod.name}</h2>
        <div class="modal-weight-row">
          <strong>Volume / Net Weight:</strong> ${prod.weight}
        </div>

        <p class="modal-overview">${prod.overview || 'Turnkey white-label formulation certified for USA and global retail markets.'}</p>

        <!-- Star Features -->
        <div class="modal-features-box">
          <h4><i class="fa-solid fa-star"></i> Clinical Star Bio-Actives</h4>
          <ul class="modal-star-list">${starList}</ul>
        </div>

        <!-- Tiered Wholesale Pricing Matrix -->
        <div class="modal-pricing-matrix">
          <h4>Tiered Turnkey Wholesale Pricing (USD)</h4>
          <div class="modal-tiers-grid">
            <div class="m-tier">
              <span class="m-tier-name">Sample</span>
              <span class="m-tier-qty">1 pc</span>
              <span class="m-tier-price">$${prod.pricing ? prod.pricing.sample.toFixed(2) : '24.00'}</span>
            </div>
            <div class="m-tier">
              <span class="m-tier-name">Startup</span>
              <span class="m-tier-qty">50 pcs</span>
              <span class="m-tier-price">$${prod.pricing ? prod.pricing.tier2_price.toFixed(2) : '19.20'}</span>
            </div>
            <div class="m-tier">
              <span class="m-tier-name">Growth</span>
              <span class="m-tier-qty">250 pcs</span>
              <span class="m-tier-price">$${prod.pricing ? prod.pricing.tier3_price.toFixed(2) : '15.60'}</span>
            </div>
            <div class="m-tier">
              <span class="m-tier-name">Wholesale</span>
              <span class="m-tier-qty">500+ pcs</span>
              <span class="m-tier-price">$${prod.pricing ? prod.pricing.tier4_price.toFixed(2) : '12.00'}</span>
            </div>
            <div class="m-tier">
              <span class="m-tier-name">Enterprise</span>
              <span class="m-tier-qty">1,000+ pcs</span>
              <span class="m-tier-price">$${prod.pricing ? prod.pricing.tier5_price.toFixed(2) : '8.40'}</span>
            </div>
          </div>
        </div>

        <!-- Packaging Specifications -->
        <div class="modal-packaging-box">
          <h4><i class="fa-solid fa-box"></i> Packaging Specifications</h4>
          <p><strong>Container:</strong> ${prod.packagingSpecs ? prod.packagingSpecs.material : 'Unbranded Sterile Packaging'}</p>
          <p><strong>Closure:</strong> ${prod.packagingSpecs ? prod.packagingSpecs.closure : 'Airtight Protective Seal'}</p>
          <p><strong>Labeling:</strong> Unbranded physical product with centered "Logo Here" ready for client logo imprint.</p>
        </div>

        <!-- Full INCI Ingredients -->
        <div class="modal-inci-box">
          <h4><i class="fa-solid fa-dna"></i> Full INCI Ingredient Disclosure</h4>
          <ul class="inci-list">${ingList}</ul>
        </div>

        <!-- Modal Action Buttons -->
        <div class="modal-actions-bar">
          <div class="modal-qty-selector">
            <label>Order Qty:</label>
            <input type="number" id="modalQtyInput" value="1" min="1" style="width: 60px; padding: 8px; font-weight: 700; text-align: center; border-radius: 6px; border: 1px solid var(--border-medium);">
          </div>
          <button class="btn-primary-large" onclick="addModalItemToCart()">
            <i class="fa-solid fa-cart-plus"></i> Add to Sample Basket
          </button>
          <button class="btn-secondary-large" onclick="sendProductWhatsApp(${prod.id})">
            <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i> Inquire on WhatsApp
          </button>
        </div>
      </div>
    `;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.addModalItemToCart = function() {
    if (!currentModalProduct) return;
    const input = document.getElementById('modalQtyInput');
    const qty = input ? parseInt(input.value, 10) : 1;
    addToSampleCart(currentModalProduct.id, qty);
    closeProductModal();
  };

  function closeProductModal() {
    if (productModal) {
      productModal.classList.remove('active');
      document.body.style.overflow = '';
      currentModalProduct = null;
    }
  }

  // ========================================================================
  // 10. 3D ANTI-GRAVITY BRAND VISUALIZER STUDIO
  // ========================================================================
  function initVisualizerStudio() {
    if (!brandCanvas) return;
    const ctx = brandCanvas.getContext('2d');

    function renderStudioScene() {
      const W = brandCanvas.width;
      const H = brandCanvas.height;
      ctx.clearRect(0, 0, W, H);

      animTime += 0.025;
      const floatOffsetY = Math.sin(animTime) * 12;

      // Dark Luxury Studio Radial Void
      const bg = ctx.createRadialGradient(W/2, H/2 - 40, 50, W/2, H/2, 450);
      bg.addColorStop(0, '#1c1b19');
      bg.addColorStop(0.6, '#0f0e0d');
      bg.addColorStop(1, '#050505');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Ambient Floating Particles
      for (let i = 0; i < 16; i++) {
        const pAngle = (i / 16) * Math.PI * 2 + animTime * 0.2;
        const pDist = 180 + Math.sin(animTime + i) * 30;
        const px = W/2 + Math.cos(pAngle) * pDist;
        const py = H/2 + Math.sin(pAngle) * (pDist * 0.7) + floatOffsetY * 0.5;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(223, 192, 144, 0.65)' : 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft Depth Shadow
      const shadowScale = 1 + (floatOffsetY / 50);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(W/2, 570, 160 * shadowScale, 24 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating Marble Base
      ctx.fillStyle = '#2b2926';
      ctx.beginPath();
      ctx.ellipse(W/2, 540, 150, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(223, 192, 144, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Selected 3D Packaging
      const pkgY = 280 + floatOffsetY;
      drawPackagingInStudio(ctx, W/2, pkgY, visualizerPkg);

      // Draw Client Brand Logo on Product
      drawBrandLogoOnProduct(ctx, W/2, pkgY + 50);

      visualizerAnimFrame = requestAnimationFrame(renderStudioScene);
    }

    function drawPackagingInStudio(c, cx, cy, pkg) {
      if (pkg === 'dropper') {
        const w = 170, h = 230;
        const x = cx - w/2, y = cy - h/2;

        const g = c.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, '#784315');
        g.addColorStop(0.3, '#d97706');
        g.addColorStop(0.5, '#fef3c7');
        g.addColorStop(0.8, '#b45309');
        g.addColorStop(1, '#572b0c');
        c.fillStyle = g;
        c.beginPath();
        c.roundRect(x, y, w, h, [20, 20, 24, 24]);
        c.fill();

        c.fillStyle = '#dfc090';
        c.fillRect(cx - 38, y - 44, 76, 44);
        c.fillStyle = '#1c1c1e';
        c.beginPath();
        c.roundRect(cx - 30, y - 96, 60, 56, [18, 18, 2, 2]);
        c.fill();

        c.fillStyle = 'rgba(255, 255, 255, 0.5)';
        c.fillRect(x + 12, y + 10, 4, h - 20);

      } else if (pkg === 'jar') {
        const w = 240, h = 165;
        const x = cx - w/2, y = cy - h/2 + 20;

        const g = c.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, '#573d1c');
        g.addColorStop(0.4, '#e2c08d');
        g.addColorStop(0.6, '#fff7ed');
        g.addColorStop(1, '#573d1c');
        c.fillStyle = g;
        c.beginPath();
        c.roundRect(x, y, w, h, [12, 12, 26, 26]);
        c.fill();

        c.fillStyle = '#dfc090';
        c.beginPath();
        c.roundRect(cx - w/2 - 10, y - 46, w + 20, 48, [10, 10, 2, 2]);
        c.fill();

      } else if (pkg === 'soap') {
        const w = 260, h = 170;
        const x = cx - w/2, y = cy - h/2;
        c.fillStyle = '#c89552';
        c.beginPath();
        c.roundRect(x, y, w, h, 18);
        c.fill();

        c.fillStyle = '#181716';
        c.fillRect(x, y + 42, w, 75);
      } else {
        const w = 175, h = 260;
        const x = cx - w/2, y = cy - h/2;
        const g = c.createLinearGradient(x, 0, x + w, 0);
        g.addColorStop(0, '#1c2421');
        g.addColorStop(0.5, '#40534c');
        g.addColorStop(1, '#1c2421');
        c.fillStyle = g;
        c.beginPath();
        c.roundRect(x, y, w, h, [26, 26, 20, 20]);
        c.fill();

        c.fillStyle = '#dfc090';
        c.fillRect(cx - 36, y - 36, 72, 36);
      }
    }

    function drawBrandLogoOnProduct(c, cx, cy) {
      c.save();
      c.fillStyle = 'rgba(15, 14, 13, 0.9)';
      c.beginPath();
      c.roundRect(cx - 65, cy - 30, 130, 58, 6);
      c.fill();
      c.strokeStyle = '#dfc090';
      c.lineWidth = 1;
      c.stroke();

      if (currentBrandPreset === 'custom' && customLogoImg) {
        try {
          c.drawImage(customLogoImg, cx - 45, cy - 22, 90, 42);
        } catch (e) {
          c.fillStyle = '#dfc090';
          c.font = 'bold 12px sans-serif';
          c.textAlign = 'center';
          c.fillText('YOUR LOGO', cx, cy + 4);
        }
      } else if (currentBrandPreset === 'zandra') {
        if (zandraLogoImg.complete) {
          c.drawImage(zandraLogoImg, cx - 50, cy - 18, 100, 36);
        }
      } else {
        if (zbmLogoImg.complete) {
          c.drawImage(zbmLogoImg, cx - 28, cy - 25, 56, 36);
          c.fillStyle = '#dfc090';
          c.font = '700 9px system-ui, sans-serif';
          c.textAlign = 'center';
          c.fillText('ZANDRA MATRIX', cx, cy + 20);
        }
      }
      c.restore();
    }

    function startStudio() {
      if (!visualizerAnimFrame) {
        renderStudioScene();
      }
    }

    function stopStudio() {
      if (visualizerAnimFrame) {
        cancelAnimationFrame(visualizerAnimFrame);
        visualizerAnimFrame = null;
      }
    }

    // Modal Triggers
    if (openVisualizerBtn) {
      openVisualizerBtn.addEventListener('click', () => {
        visualizerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        startStudio();
      });
    }

    if (closeVisualizerBtn) {
      closeVisualizerBtn.addEventListener('click', () => {
        visualizerModal.classList.remove('active');
        document.body.style.overflow = '';
        stopStudio();
      });
    }

    // Controls
    document.querySelectorAll('.pkg-type-btn[data-pkg]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pkg-type-btn[data-pkg]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        visualizerPkg = btn.getAttribute('data-pkg');
      });
    });

    document.querySelectorAll('.brand-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.brand-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrandPreset = btn.getAttribute('data-brand');
        if (customUploadContainer) {
          customUploadContainer.style.display = currentBrandPreset === 'custom' ? 'block' : 'none';
        }
      });
    });

    if (brandLogoInput) {
      brandLogoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            const img = new Image();
            img.onload = () => {
              customLogoImg = img;
              currentBrandPreset = 'custom';
            };
            img.src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (downloadMockupBtn) {
      downloadMockupBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `zbm-branded-${visualizerPkg}-mockup.png`;
        link.href = brandCanvas.toDataURL('image/png');
        link.click();
      });
    }

    if (resetVisualizerBtn) {
      resetVisualizerBtn.addEventListener('click', () => {
        visualizerPkg = 'dropper';
        currentBrandPreset = 'zbm';
        customLogoImg = null;
        document.querySelectorAll('.brand-preset-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-brand') === 'zbm'));
        document.querySelectorAll('.pkg-type-btn[data-pkg]').forEach(b => b.classList.toggle('active', b.getAttribute('data-pkg') === 'dropper'));
        if (customUploadContainer) customUploadContainer.style.display = 'none';
      });
    }
  }

  // ========================================================================
  // 11. CERTIFICATIONS TRUST MODAL
  // ========================================================================
  window.openCertModal = function(type) {
    if (!certModalContent || !certModal) return;

    let title = 'Certifications & Compliance';
    let desc = '';
    let certBadge = '';

    if (type === 'fda') {
      title = 'US FDA Registered Facility';
      desc = 'Our manufacturing laboratories are registered under the US FDA Voluntary Cosmetic Registration Program (VCRP) and fully compliant with cGMP 21 CFR Part 700 & 701 regulations. Every formulation includes verified INCI listings, heavy-metal laboratory analysis, stability verification, and full documentation for seamless USA import and distribution.';
      certBadge = '<img src="assets/certificates/fda.svg" style="height: 60px; margin-bottom: 16px;">';
    } else if (type === 'iso') {
      title = 'ISO 9001:2015 Certified';
      desc = 'Certified international Quality Management System (QMS) ensuring strict batch-to-batch consistency, raw ingredient quarantine testing, cleanroom climate stability, and traceability from active botanical harvest to final container closure.';
      certBadge = '<img src="assets/certificates/iso.svg" style="height: 60px; margin-bottom: 16px;">';
    } else if (type === 'gmp') {
      title = 'WHO-GMP Certified Sterile Manufacturing';
      desc = 'Certified by the World Health Organization for Good Manufacturing Practices. Class 10,000 sterile filling suites, automated HEPA filtration, deionized purified aqua loops, and validated aseptic hygiene protocols.';
      certBadge = '<img src="assets/certificates/gmp.svg" style="height: 60px; margin-bottom: 16px;">';
    } else {
      title = 'Clean Standards & Botanical Safety';
      desc = 'FSSAI certified food-grade and Ayurvedic safety compliance. Formulated with zero parabens, zero phthalates, zero formaldehydes, and cruelty-free non-animal testing standards.';
      certBadge = '<img src="assets/certificates/fssai.svg" style="height: 60px; margin-bottom: 16px;">';
    }

    certModalContent.innerHTML = `
      ${certBadge}
      <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; color: var(--text-primary);">${title}</h3>
      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">${desc}</p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn-primary-large" onclick="closeCertModal()">
          Acknowledge & Close
        </button>
        <a href="https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello ZBM Compliance Team, please share COA and certification sheets.')}" target="_blank" class="btn-secondary-large">
          <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i> Request Full COA Dossier
        </a>
      </div>
    `;

    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeCertModal = function() {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // ========================================================================
  // 12. INITIALIZATION & EVENT BINDINGS
  // ========================================================================
  function init() {
    initAmbientLayer();
    updateInquiryUI();

    renderCategoryPills();
    renderProductCards();

    // Search & Filters
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        if (clearSearchBtn) clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
        applyFilters();
      });
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        applyFilters();
      });
    }
    if (concernFilter) concernFilter.addEventListener('change', applyFilters);
    if (skinTypeFilter) skinTypeFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);

    // MOQ Pills
    moqPills.forEach(pill => {
      pill.addEventListener('click', () => {
        moqPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentMoqTier = pill.getAttribute('data-tier');
        renderProductCards();
      });
    });

    // View Toggles
    if (viewGridBtn) {
      viewGridBtn.addEventListener('click', () => {
        viewGridBtn.classList.add('active');
        if (viewListBtn) viewListBtn.classList.remove('active');
        currentViewMode = 'categorized';
        renderProductCards();
      });
    }

    if (viewListBtn) {
      viewListBtn.addEventListener('click', () => {
        viewListBtn.classList.add('active');
        if (viewGridBtn) viewGridBtn.classList.remove('active');
        currentViewMode = 'list';
        renderProductCards();
      });
    }

    // Drawer Listeners
    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openInquiryDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeInquiryDrawer);
    if (clearInquiryBtn) clearInquiryBtn.addEventListener('click', clearAllCart);

    // Close Modals on click outside or Esc
    if (productModal) {
      productModal.addEventListener('click', e => {
        if (e.target === productModal) closeProductModal();
      });
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeProductModal);

    if (certModal) {
      certModal.addEventListener('click', e => {
        if (e.target === certModal) closeCertModal();
      });
    }
    if (closeCertModalBtn) closeCertModalBtn.addEventListener('click', closeCertModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeProductModal();
        closeInquiryDrawer();
        closeCertModal();
      }
    });

    initVisualizerStudio();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
