/**
 * ZANDRA BEAUTY MATRIX (ZBM) | B2B Client Authentication Controller
 * Direct Email & Password Sign-In with Strict Single-Account-Per-Email Enforcement
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
  let currentTab = 'signin'; // 'signin' or 'signup'

  // DOM Elements
  let authModal, authModalClose;
  let authErrorAlert, authSuccessAlert;
  let authTabSignIn, authTabSignUp;
  let signInFormSection, signUpFormSection;
  let signInForm, signUpForm;
  let signInEmail, signInPassword;
  let signUpName, signUpBrand, signUpEmail, signUpPassword, signUpConfirmPassword;
  let signInSubmitBtn, signUpSubmitBtn;
  let authHeaderContainer;

  // Initialize
  function initAuth() {
    cacheDOMElements();
    setupEventListeners();
    setupPasswordToggles();
    restoreSession();
  }

  function cacheDOMElements() {
    authModal = document.getElementById('authModal');
    authModalClose = document.getElementById('closeAuthModalBtn');
    authErrorAlert = document.getElementById('authErrorAlert');
    authSuccessAlert = document.getElementById('authSuccessAlert');
    authTabSignIn = document.getElementById('authTabSignIn');
    authTabSignUp = document.getElementById('authTabSignUp');
    signInFormSection = document.getElementById('signInFormSection');
    signUpFormSection = document.getElementById('signUpFormSection');
    signInForm = document.getElementById('signInForm');
    signUpForm = document.getElementById('signUpForm');
    signInEmail = document.getElementById('signInEmail');
    signInPassword = document.getElementById('signInPassword');
    signUpName = document.getElementById('signUpName');
    signUpBrand = document.getElementById('signUpBrand');
    signUpEmail = document.getElementById('signUpEmail');
    signUpPassword = document.getElementById('signUpPassword');
    signUpConfirmPassword = document.getElementById('signUpConfirmPassword');
    signInSubmitBtn = document.getElementById('signInSubmitBtn');
    signUpSubmitBtn = document.getElementById('signUpSubmitBtn');
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
  }

  // Password Visibility Toggle Button Handler
  function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const icon = this.querySelector('i');
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

  // Helper to read users registry (Strict Single Account Guarantee)
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

  // Switch between Sign In and Sign Up Tabs
  window.switchAuthTab = function(tab) {
    currentTab = tab;
    clearAlerts();

    if (tab === 'signin') {
      if (authTabSignIn) authTabSignIn.classList.add('active');
      if (authTabSignUp) authTabSignUp.classList.remove('active');
      if (signInFormSection) signInFormSection.style.display = 'block';
      if (signUpFormSection) signUpFormSection.style.display = 'none';
      if (signInEmail) setTimeout(() => signInEmail.focus(), 100);
    } else {
      if (authTabSignUp) authTabSignUp.classList.add('active');
      if (authTabSignIn) authTabSignIn.classList.remove('active');
      if (signUpFormSection) signUpFormSection.style.display = 'block';
      if (signInFormSection) signInFormSection.style.display = 'none';
      if (signUpName) setTimeout(() => signUpName.focus(), 100);
    }
  };

  // Sign In Handler
  function handleSignIn(e) {
    if (e) e.preventDefault();
    clearAlerts();

    const email = (signInEmail?.value || '').trim();
    const password = (signInPassword?.value || '').trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(authErrorAlert, 'Please enter a valid business email address.');
      return;
    }

    if (!password) {
      showError(authErrorAlert, 'Please enter your password.');
      return;
    }

    const cleanEmail = email.toLowerCase();
    const registry = getUsersRegistry();
    const user = registry[cleanEmail];

    if (!user) {
      showError(authErrorAlert, 'No account found with this email. Please click "Create Account" tab above.');
      return;
    }

    // Verify Password
    if (user.password !== password) {
      showError(authErrorAlert, 'Incorrect password. Please verify your credentials and try again.');
      if (signInPassword) {
        signInPassword.value = '';
        signInPassword.focus();
      }
      return;
    }

    // Password Match! Log in user
    setButtonLoading(signInSubmitBtn, true, 'Signing In...');

    setTimeout(() => {
      user.lastLoginAt = new Date().toISOString();
      registry[cleanEmail] = user;
      saveUsersRegistry(registry);

      currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        brand_name: user.brand_name,
        role: user.role || 'buyer'
      };
      authToken = 'zbm_auth_token_' + Date.now();
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_KEY, authToken);

      showSuccess(authSuccessAlert, `Welcome back, ${currentUser.name}!`);
      renderHeaderAuth();
      populateDrawerBuyer();

      setTimeout(() => {
        closeAuthModal();
        setButtonLoading(signInSubmitBtn, false, 'Sign In to Trade Account');
      }, 600);
    }, 400);
  }

  // Sign Up Handler (Strict Single-Account Enforcement)
  function handleSignUp(e) {
    if (e) e.preventDefault();
    clearAlerts();

    const name = (signUpName?.value || '').trim();
    const brand = (signUpBrand?.value || '').trim();
    const email = (signUpEmail?.value || '').trim();
    const password = (signUpPassword?.value || '').trim();
    const confirmPassword = (signUpConfirmPassword?.value || '').trim();

    if (!name) {
      showError(authErrorAlert, 'Please enter your full legal name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError(authErrorAlert, 'Please enter a valid business email address.');
      return;
    }

    if (!password || password.length < 6) {
      showError(authErrorAlert, 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError(authErrorAlert, 'Passwords do not match. Please re-enter your password.');
      return;
    }

    const cleanEmail = email.toLowerCase();
    const registry = getUsersRegistry();

    // STRICT CHECK: Does account with this email already exist?
    if (registry[cleanEmail]) {
      showError(authErrorAlert, 'An account with this email address already exists. Please switch to "Sign In" tab.');
      return;
    }

    // Create New Unique Account
    setButtonLoading(signUpSubmitBtn, true, 'Creating B2B Account...');

    setTimeout(() => {
      const newUser = {
        id: 'usr_' + Date.now(),
        email: cleanEmail,
        name: name,
        brand_name: brand || 'USA Private Label Partner',
        password: password,
        role: 'buyer',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // Save to registry
      registry[cleanEmail] = newUser;
      saveUsersRegistry(registry);

      // Auto Login
      currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        brand_name: newUser.brand_name,
        role: newUser.role
      };
      authToken = 'zbm_auth_token_' + Date.now();
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_KEY, authToken);

      showSuccess(authSuccessAlert, `Account created successfully! Welcome, ${currentUser.name}.`);
      renderHeaderAuth();
      populateDrawerBuyer();

      setTimeout(() => {
        closeAuthModal();
        setButtonLoading(signUpSubmitBtn, false, 'Create B2B Account');
      }, 600);
    }, 500);
  }

  // UI Modal Handlers
  window.openAuthModal = function(initialTab = 'signin') {
    if (!authModal) return;
    clearAlerts();

    // If already logged in, toggle profile dropdown
    if (currentUser) {
      toggleUserDropdown();
      return;
    }

    switchAuthTab(initialTab);
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeAuthModal = function() {
    if (!authModal) return;
    authModal.classList.remove('active');
    document.body.style.overflow = '';
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
            <span class="user-name-label desktop-text">${displayName}</span>
            <i class="fa-solid fa-chevron-down dropdown-arrow desktop-text"></i>
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
                <strong style="color: var(--accent-gold);"><i class="fa-solid fa-key"></i> Password Protected</strong>
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
          <span class="desktop-text">Sign In</span>
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
