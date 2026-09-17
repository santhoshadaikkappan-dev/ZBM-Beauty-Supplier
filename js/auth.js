/**
 * ZANDRA BEAUTY MATRIX (ZBM) | B2B Client Authentication Controller
 * Secure Signup, Login, Password Visibility Toggle & SQLite/Bcrypt Integration
 */

(function() {
  'use strict';

  // API Endpoint configuration
  const API_BASE = (window.location.protocol.startsWith('http') && window.location.port === '5000')
    ? '/api/auth'
    : 'http://localhost:5000/api/auth';

  // Storage Keys
  const TOKEN_KEY = 'zbm_auth_token';
  const USER_KEY = 'zbm_auth_user';

  // State
  let currentUser = null;
  let authToken = localStorage.getItem(TOKEN_KEY) || null;

  // DOM Elements
  let authModal, authModalBackdrop, authModalClose;
  let tabSignInBtn, tabSignUpBtn;
  let signInFormSection, signUpFormSection;
  let signInForm, signUpForm;
  let signInErrorEl, signInSuccessEl, signUpErrorEl, signUpSuccessEl;
  let authHeaderContainer;

  // Initialize Auth System
  function initAuth() {
    cacheDOMElements();
    setupEventListeners();
    restoreSession();
  }

  function cacheDOMElements() {
    authModal = document.getElementById('authModal');
    authModalClose = document.getElementById('closeAuthModalBtn');
    tabSignInBtn = document.getElementById('tabSignInBtn');
    tabSignUpBtn = document.getElementById('tabSignUpBtn');
    signInFormSection = document.getElementById('signInFormSection');
    signUpFormSection = document.getElementById('signUpFormSection');
    signInForm = document.getElementById('signInForm');
    signUpForm = document.getElementById('signUpForm');
    signInErrorEl = document.getElementById('signInErrorAlert');
    signInSuccessEl = document.getElementById('signInSuccessAlert');
    signUpErrorEl = document.getElementById('signUpErrorAlert');
    signUpSuccessEl = document.getElementById('signUpSuccessAlert');
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

    if (tabSignInBtn) {
      tabSignInBtn.addEventListener('click', () => switchTab('signin'));
    }

    if (tabSignUpBtn) {
      tabSignUpBtn.addEventListener('click', () => switchTab('signup'));
    }

    if (signInForm) {
      signInForm.addEventListener('submit', handleSignIn);
    }

    if (signUpForm) {
      signUpForm.addEventListener('submit', handleSignUp);
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal && authModal.classList.contains('active')) {
        closeAuthModal();
      }
    });

    // Toggle password visibility triggers
    setupPasswordToggles();
  }

  function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const icon = btn.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          }
        } else {
          input.type = 'password';
          if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        }
      });
    });
  }

  // Restore and verify stored session
  async function restoreSession() {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser && authToken) {
        currentUser = JSON.parse(storedUser);
        renderHeaderAuth();
        populateDrawerBuyer();
        
        // Verify with server in background
        verifyTokenWithServer();
      } else {
        renderHeaderAuth();
      }
    } catch {
      clearSession();
      renderHeaderAuth();
    }
  }

  async function verifyTokenWithServer() {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          currentUser = data.user;
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
          renderHeaderAuth();
          populateDrawerBuyer();
        }
      } else if (res.status === 401 || res.status === 403) {
        clearSession();
        renderHeaderAuth();
      }
    } catch {
      // Backend offline or unreachable; keep cached profile for offline resilience
      console.warn('[AUTH] Could not verify session token with server.');
    }
  }

  function clearSession() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // UI Modal Handling
  window.openAuthModal = function(tab = 'signin') {
    if (!authModal) return;
    clearAlerts();
    switchTab(tab);
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeAuthModal = function() {
    if (!authModal) return;
    authModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  function switchTab(tab) {
    clearAlerts();
    if (tab === 'signup') {
      if (tabSignUpBtn) tabSignUpBtn.classList.add('active');
      if (tabSignInBtn) tabSignInBtn.classList.remove('active');
      if (signUpFormSection) signUpFormSection.style.display = 'block';
      if (signInFormSection) signInFormSection.style.display = 'none';
      const firstInp = document.getElementById('signupName');
      if (firstInp) setTimeout(() => firstInp.focus(), 150);
    } else {
      if (tabSignInBtn) tabSignInBtn.classList.add('active');
      if (tabSignUpBtn) tabSignUpBtn.classList.remove('active');
      if (signInFormSection) signInFormSection.style.display = 'block';
      if (signUpFormSection) signUpFormSection.style.display = 'none';
      const firstInp = document.getElementById('loginEmail');
      if (firstInp) setTimeout(() => firstInp.focus(), 150);
    }
  }

  function clearAlerts() {
    if (signInErrorEl) { signInErrorEl.style.display = 'none'; signInErrorEl.innerText = ''; }
    if (signInSuccessEl) { signInSuccessEl.style.display = 'none'; signInSuccessEl.innerText = ''; }
    if (signUpErrorEl) { signUpErrorEl.style.display = 'none'; signUpErrorEl.innerText = ''; }
    if (signUpSuccessEl) { signUpSuccessEl.style.display = 'none'; signUpSuccessEl.innerText = ''; }
  }

  // Sign In Handler
  async function handleSignIn(e) {
    e.preventDefault();
    clearAlerts();

    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (!email || !password) {
      showError(signInErrorEl, 'Please enter both your business email and password.');
      return;
    }

    try {
      setButtonLoading(submitBtn, true, 'Verifying Credentials...');

      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showError(signInErrorEl, data.error || 'Invalid email or password.');
        setButtonLoading(submitBtn, false, 'Sign In to Trade Account');
        return;
      }

      // Success
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

      showSuccess(signInSuccessEl, `Welcome back, ${currentUser.name}! Authenticated.`);
      renderHeaderAuth();
      populateDrawerBuyer();

      setTimeout(() => {
        closeAuthModal();
        setButtonLoading(submitBtn, false, 'Sign In to Trade Account');
      }, 1000);

    } catch (err) {
      console.error('[SIGNIN ERROR]', err);
      showError(signInErrorEl, 'Unable to connect to auth server. Please ensure backend server is running.');
      setButtonLoading(submitBtn, false, 'Sign In to Trade Account');
    }
  }

  // Sign Up Handler
  async function handleSignUp(e) {
    e.preventDefault();
    clearAlerts();

    const name = document.getElementById('signupName')?.value.trim();
    const brand_name = document.getElementById('signupBrand')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;
    const submitBtn = document.getElementById('signupSubmitBtn');

    // Validation
    if (!name || name.length < 2) {
      showError(signUpErrorEl, 'Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(signUpErrorEl, 'Please provide a valid business email address.');
      return;
    }

    if (!password || password.length < 8) {
      showError(signUpErrorEl, 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError(signUpErrorEl, 'Passwords do not match. Please re-enter your password.');
      return;
    }

    try {
      setButtonLoading(submitBtn, true, 'Encrypting & Creating Account...');

      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, brand_name, email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showError(signUpErrorEl, data.error || 'Failed to create account.');
        setButtonLoading(submitBtn, false, 'Create B2B Account');
        return;
      }

      // Success
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

      showSuccess(signUpSuccessEl, 'Account created securely with bcrypt encryption! Logging in...');
      renderHeaderAuth();
      populateDrawerBuyer();

      setTimeout(() => {
        closeAuthModal();
        setButtonLoading(submitBtn, false, 'Create B2B Account');
      }, 1200);

    } catch (err) {
      console.error('[SIGNUP ERROR]', err);
      showError(signUpErrorEl, 'Unable to connect to auth server. Please ensure backend server is running.');
      setButtonLoading(submitBtn, false, 'Create B2B Account');
    }
  }

  // Logout Handler
  window.handleSignOut = function() {
    clearSession();
    renderHeaderAuth();
    // Clear drawer buyer fields if matching
    const nameInp = document.getElementById('buyerNameInput');
    const brandInp = document.getElementById('buyerBrandInput');
    if (nameInp) nameInp.value = '';
    if (brandInp) brandInp.value = '';
  };

  // Render Header Auth Button / User Profile Dropdown
  function renderHeaderAuth() {
    if (!authHeaderContainer) return;

    if (currentUser) {
      const displayName = currentUser.name.split(' ')[0] || currentUser.name;
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
                <span>Security:</span>
                <strong style="color: var(--accent-gold);"><i class="fa-solid fa-key"></i> Bcrypt Encrypted</strong>
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
        <button id="openAuthModalBtn" class="btn-header auth-trigger-btn" onclick="openAuthModal('signin')" title="Sign In or Register B2B Account">
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

  // Auto-populate Drawer Buyer Info
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

  // Helpers
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

  // Expose current user getter and helpers
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
