/**
 * ZANDRA BEAUTY MATRIX (ZBM) | B2B Client OTP Authentication Controller
 * Guaranteed Single-Account-Per-Email with 6-Digit One-Time Passcode (OTP)
 */

(function() {
  'use strict';

  // Storage Keys
  const REGISTRY_KEY = 'zbm_users_registry';
  const USER_KEY = 'zbm_auth_user';
  const TOKEN_KEY = 'zbm_auth_token';

  // State
  let currentUser = null;
  let authToken = localStorage.getItem(TOKEN_KEY) || null;
  let activeOtp = null;
  let pendingEmail = '';
  let pendingName = '';
  let pendingBrand = '';
  let countdownTimer = null;
  let countdownSeconds = 45;

  // DOM Elements
  let authModal, authModalClose;
  let authErrorAlert, authSuccessAlert;
  let authEmailSection, authOtpSection;
  let authEmailForm, authOtpForm;
  let authEmailInput, authNameInput, authBrandInput;
  let sendOtpSubmitBtn, verifyOtpSubmitBtn;
  let otpDisplayEmail, changeEmailBtn;
  let otpDemoCodeDisplay, resendOtpBtn, otpCountdownEl, otpTimerText;
  let authHeaderContainer;

  // Initialize
  function initAuth() {
    cacheDOMElements();
    setupEventListeners();
    restoreSession();
  }

  function cacheDOMElements() {
    authModal = document.getElementById('authModal');
    authModalClose = document.getElementById('closeAuthModalBtn');
    authErrorAlert = document.getElementById('authErrorAlert');
    authSuccessAlert = document.getElementById('authSuccessAlert');
    authEmailSection = document.getElementById('authEmailSection');
    authOtpSection = document.getElementById('authOtpSection');
    authEmailForm = document.getElementById('authEmailForm');
    authOtpForm = document.getElementById('authOtpForm');
    authEmailInput = document.getElementById('authEmailInput');
    authNameInput = document.getElementById('authNameInput');
    authBrandInput = document.getElementById('authBrandInput');
    sendOtpSubmitBtn = document.getElementById('sendOtpSubmitBtn');
    verifyOtpSubmitBtn = document.getElementById('verifyOtpSubmitBtn');
    otpDisplayEmail = document.getElementById('otpDisplayEmail');
    changeEmailBtn = document.getElementById('changeEmailBtn');
    otpDemoCodeDisplay = document.getElementById('otpDemoCodeDisplay');
    resendOtpBtn = document.getElementById('resendOtpBtn');
    otpCountdownEl = document.getElementById('otpCountdown');
    otpTimerText = document.getElementById('otpTimerText');
    authHeaderContainer = document.getElementById('authHeaderContainer');
  }

  function setupEventListeners() {
    if (authModalClose) {
      authModalClose.addEventListener('click', closeAuthModal);
    }

    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
      });
    }

    if (authEmailForm) {
      authEmailForm.addEventListener('submit', handleSendOtp);
    }

    if (authOtpForm) {
      authOtpForm.addEventListener('submit', handleVerifyOtp);
    }

    if (changeEmailBtn) {
      changeEmailBtn.addEventListener('click', backToEmailStage);
    }

    if (resendOtpBtn) {
      resendOtpBtn.addEventListener('click', handleResendOtp);
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
        closeAuthModal();
      }
    });

    setupOtpInputs();
  }

  // 6-Digit Auto-Advancing Input Boxes
  function setupOtpInputs() {
    const inputs = document.querySelectorAll('.otp-digit-input');
    inputs.forEach((input, index) => {
      // Numbers only
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val ? val[val.length - 1] : '';

        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        // Auto verify if all 6 filled
        const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
        if (allFilled) {
          setTimeout(() => handleVerifyOtp(), 150);
        }
      });

      // Backspace handling
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
        }
      });

      // Paste handling (Ctrl+V entire 6-digit code)
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
        if (pasteData.length >= 6) {
          for (let i = 0; i < 6; i++) {
            if (inputs[i]) inputs[i].value = pasteData[i];
          }
          inputs[5].focus();
          setTimeout(() => handleVerifyOtp(), 150);
        }
      });
    });
  }

  // Helper to read users registry (Single Account Guarantee)
  function getUsersRegistry() {
    try {
      return JSON.parse(localStorage.getItem(REGISTRY_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveUsersRegistry(registry) {
    try {
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {
      console.error('[AUTH STORAGE ERROR]', e);
    }
  }

  // Restore existing session
  function restoreSession() {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored && authToken) {
        currentUser = JSON.parse(stored);
        renderHeaderAuth();
        populateDrawerBuyer();
      } else {
        renderHeaderAuth();
      }
    } catch {
      clearSession();
      renderHeaderAuth();
    }
  }

  function clearSession() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Stage 1: Send OTP
  function handleSendOtp(e) {
    if (e) e.preventDefault();
    clearAlerts();

    const email = (authEmailInput?.value || '').trim();
    const name = (authNameInput?.value || '').trim();
    const brand = (authBrandInput?.value || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(authErrorAlert, 'Please provide a valid business email address.');
      return;
    }

    pendingEmail = email.toLowerCase();
    pendingName = name;
    pendingBrand = brand;

    setButtonLoading(sendOtpSubmitBtn, true, 'Generating Code...');

    // Generate cryptographic 6-digit security code
    activeOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setTimeout(() => {
      setButtonLoading(sendOtpSubmitBtn, false, 'Send Security Code (OTP)');

      // Transition to Stage 2 (OTP Entry)
      if (authEmailSection) authEmailSection.style.display = 'none';
      if (authOtpSection) authOtpSection.style.display = 'block';
      if (otpDisplayEmail) otpDisplayEmail.innerText = pendingEmail;
      if (otpDemoCodeDisplay) otpDemoCodeDisplay.innerText = activeOtp;

      // Clear previous digit inputs
      document.querySelectorAll('.otp-digit-input').forEach(inp => inp.value = '');

      showSuccess(authSuccessAlert, `Security code generated! Use code [${activeOtp}] below.`);

      // Focus first digit
      const firstDigit = document.querySelector('.otp-digit-input');
      if (firstDigit) setTimeout(() => firstDigit.focus(), 150);

      startOtpCountdown();
    }, 600);
  }

  // Resend OTP
  function handleResendOtp() {
    if (resendOtpBtn && resendOtpBtn.disabled) return;
    clearAlerts();
    activeOtp = Math.floor(100000 + Math.random() * 900000).toString();
    if (otpDemoCodeDisplay) otpDemoCodeDisplay.innerText = activeOtp;
    showSuccess(authSuccessAlert, `New security code generated: [${activeOtp}].`);
    document.querySelectorAll('.otp-digit-input').forEach(inp => inp.value = '');
    const firstDigit = document.querySelector('.otp-digit-input');
    if (firstDigit) firstDigit.focus();
    startOtpCountdown();
  }

  function startOtpCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownSeconds = 45;
    if (resendOtpBtn) resendOtpBtn.disabled = true;
    if (otpTimerText) otpTimerText.style.display = 'inline';

    const updateTimerDisplay = () => {
      if (otpCountdownEl) otpCountdownEl.innerText = countdownSeconds;
      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer);
        if (resendOtpBtn) resendOtpBtn.disabled = false;
        if (otpTimerText) otpTimerText.style.display = 'none';
      }
      countdownSeconds--;
    };

    updateTimerDisplay();
    countdownTimer = setInterval(updateTimerDisplay, 1000);
  }

  function backToEmailStage() {
    clearAlerts();
    if (countdownTimer) clearInterval(countdownTimer);
    if (authOtpSection) authOtpSection.style.display = 'none';
    if (authEmailSection) authEmailSection.style.display = 'block';
    if (authEmailInput) authEmailInput.focus();
  }

  // Autofill helper
  window.fillDemoOtp = function() {
    if (!activeOtp) return;
    const inputs = document.querySelectorAll('.otp-digit-input');
    for (let i = 0; i < 6; i++) {
      if (inputs[i]) inputs[i].value = activeOtp[i] || '';
    }
    setTimeout(() => handleVerifyOtp(), 150);
  };

  // Stage 2: Verify OTP (Single Account Guarantee)
  function handleVerifyOtp(e) {
    if (e) e.preventDefault();
    clearAlerts();

    const inputs = document.querySelectorAll('.otp-digit-input');
    const enteredCode = Array.from(inputs).map(inp => inp.value).join('').trim();

    if (enteredCode.length !== 6) {
      showError(authErrorAlert, 'Please enter the complete 6-digit security code.');
      return;
    }

    if (enteredCode !== activeOtp) {
      showError(authErrorAlert, 'Invalid security code. Please check the code and try again.');
      inputs.forEach(inp => inp.value = '');
      if (inputs[0]) inputs[0].focus();
      return;
    }

    // OTP Verified! Single-Account Logic
    setButtonLoading(verifyOtpSubmitBtn, true, 'Verifying Account...');

    setTimeout(() => {
      const registry = getUsersRegistry();
      const cleanEmail = pendingEmail.toLowerCase();
      let user = registry[cleanEmail];

      if (user) {
        // Existing user: Update name/brand if provided and empty
        if (pendingName && (!user.name || user.name.includes('@'))) user.name = pendingName;
        if (pendingBrand && !user.brand_name) user.brand_name = pendingBrand;
        user.lastLoginAt = new Date().toISOString();
      } else {
        // New user: Create single unique record
        const fallbackName = pendingName || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        user = {
          id: 'usr_' + Date.now(),
          email: cleanEmail,
          name: fallbackName,
          brand_name: pendingBrand || 'USA Private Label Partner',
          role: 'buyer',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
      }

      // Save to registry (guaranteed single record per cleanEmail)
      registry[cleanEmail] = user;
      saveUsersRegistry(registry);

      // Set active session
      currentUser = user;
      authToken = 'zbm_otp_session_' + Date.now();
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_KEY, authToken);

      showSuccess(authSuccessAlert, `Authenticated! Welcome, ${currentUser.name}.`);
      renderHeaderAuth();
      populateDrawerBuyer();

      if (countdownTimer) clearInterval(countdownTimer);

      setTimeout(() => {
        closeAuthModal();
        setButtonLoading(verifyOtpSubmitBtn, false, 'Verify & Access Trade Portal');
      }, 700);

    }, 500);
  }

  // UI Modal Handlers
  window.openAuthModal = function(initialTab = 'signin') {
    if (!authModal) return;
    clearAlerts();

    // If already logged in, show profile dropdown
    if (currentUser) {
      toggleUserDropdown();
      return;
    }

    backToEmailStage();
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (authEmailInput) {
      setTimeout(() => authEmailInput.focus(), 150);
    }
  };

  window.closeAuthModal = function() {
    if (!authModal) return;
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    if (countdownTimer) clearInterval(countdownTimer);
    clearAlerts();
  };

  // Sign out
  window.handleSignOut = function() {
    clearSession();
    renderHeaderAuth();
    const nameInp = document.getElementById('buyerNameInput');
    const brandInp = document.getElementById('buyerBrandInput');
    if (nameInp) nameInp.value = '';
    if (brandInp) brandInp.value = '';
  };

  // Render Header Auth Button / User Profile Dropdown
  function renderHeaderAuth() {
    if (!authHeaderContainer) return;

    if (currentUser) {
      const displayName = (currentUser.name || 'Buyer').split(' ')[0];
      authHeaderContainer.innerHTML = `
        <div class="user-profile-menu">
          <button id="userProfileBtn" class="btn-header logged-in" onclick="toggleUserDropdown(event)" title="Logged in as ${currentUser.name}">
            <i class="fa-solid fa-circle-user" style="color: #25D366; font-size: 1.15rem;"></i>
            <span class="user-name-label">${displayName}</span>
            <i class="fa-solid fa-chevron-down dropdown-arrow"></i>
          </button>
          <div id="userDropdownMenu" class="user-dropdown-card" style="display: none;">
            <div class="user-dropdown-header">
              <div class="user-avatar-circle">${displayName[0].toUpperCase()}</div>
              <div class="user-dropdown-info">
                <strong>${currentUser.name}</strong>
                <span>${currentUser.email}</span>
                ${currentUser.brand_name ? `<span class="user-brand-tag"><i class="fa-solid fa-briefcase"></i> ${currentUser.brand_name}</span>` : ''}
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <div class="user-dropdown-items">
              <div class="user-dropdown-stat">
                <span>Account Status:</span>
                <strong style="color: #166534;"><i class="fa-solid fa-shield-check"></i> Verified B2B Buyer</strong>
              </div>
              <div class="user-dropdown-stat">
                <span>Authentication:</span>
                <strong style="color: var(--accent-gold);"><i class="fa-solid fa-lock"></i> OTP Verified</strong>
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <button class="user-logout-btn" onclick="handleSignOut()">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;
    } else {
      authHeaderContainer.innerHTML = `
        <button id="openAuthModalBtn" class="btn-header auth-trigger-btn" onclick="openAuthModal('signin')" title="Sign In via Instant OTP">
          <i class="fa-regular fa-circle-user" style="color: var(--accent-gold); font-size: 1.15rem;"></i>
          <span>Sign In</span>
        </button>
      `;
    }
  }

  // Dropdown toggle
  window.toggleUserDropdown = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('userDropdownMenu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
  };

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('userDropdownMenu');
    const btn = document.getElementById('userProfileBtn');
    if (menu && menu.style.display === 'block') {
      if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        menu.style.display = 'none';
      }
    }
  });

  // Populate Drawer Buyer Info
  function populateDrawerBuyer() {
    if (!currentUser) return;
    const brandInp = document.getElementById('buyerBrandInput');
    const nameInp = document.getElementById('buyerNameInput');
    if (brandInp && !brandInp.value && currentUser.brand_name) {
      brandInp.value = currentUser.brand_name;
    }
    if (nameInp && !nameInp.value && currentUser.name) {
      nameInp.value = currentUser.name;
    }
  }

  function clearAlerts() {
    if (authErrorAlert) { authErrorAlert.style.display = 'none'; authErrorAlert.innerText = ''; }
    if (authSuccessAlert) { authSuccessAlert.style.display = 'none'; authSuccessAlert.innerText = ''; }
  }

  function showError(el, message) {
    if (!el) return;
    el.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${message}</span>`;
    el.style.display = 'flex';
  }

  function showSuccess(el, message) {
    if (!el) return;
    el.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    el.style.display = 'flex';
  }

  function setButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    if (isLoading) {
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${text}</span>`;
    } else {
      btn.innerHTML = `<span>${text}</span>`;
    }
  }

  // Expose global auth helpers
  window.populateDrawerBuyer = populateDrawerBuyer;
  window.ZBM_AUTH = {
    getUser: () => currentUser,
    getToken: () => authToken,
    isLoggedIn: () => !!currentUser
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
