/*
==========================================================================
Flipwise - Shared UI Behavior
Description: Theme toggles, mobile navigation, auth helpers, and page UI
==========================================================================
*/

(function() {
    'use strict';

    const THEME_STORAGE_KEYS = {
        palette: 'themePalette',
        mode: 'themeMode'
    };

    const THEME_DEFAULTS = {
        palette: 'copper',
        mode: 'dark'
    };

    function getThemeState() {
        try {
            const legacyMode = localStorage.getItem('theme');
            return {
                palette: localStorage.getItem(THEME_STORAGE_KEYS.palette) || THEME_DEFAULTS.palette,
                mode: localStorage.getItem(THEME_STORAGE_KEYS.mode) || legacyMode || THEME_DEFAULTS.mode
            };
        } catch (e) {
            return { palette: THEME_DEFAULTS.palette, mode: THEME_DEFAULTS.mode };
        }
    }

    function getThemeStateFromDOM() {
        const html = document.documentElement;
        return {
            palette: html.getAttribute('data-theme') || THEME_DEFAULTS.palette,
            mode: html.getAttribute('data-mode') || THEME_DEFAULTS.mode
        };
    }

    function applyTheme(themeState) {
        const html = document.documentElement;
        const palette = themeState && themeState.palette ? themeState.palette : THEME_DEFAULTS.palette;
        const mode = themeState && themeState.mode ? themeState.mode : THEME_DEFAULTS.mode;

        html.setAttribute('data-theme', palette);
        html.setAttribute('data-mode', mode);

        try {
            localStorage.setItem(THEME_STORAGE_KEYS.palette, palette);
            localStorage.setItem(THEME_STORAGE_KEYS.mode, mode);
            localStorage.removeItem('theme');
        } catch (e) {
            /* storage full or unavailable (e.g. private browsing); theme still applied on this page */
        }
    }

    function updateThemeModeLabel() {
        const html = document.documentElement;
        const modeText = document.querySelector('.theme-toggle-mode-text');
        if (modeText) {
            modeText.textContent = html.getAttribute('data-mode') === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }

    function initThemeSync() {
        window.addEventListener('storage', function(e) {
            if (e.key === THEME_STORAGE_KEYS.palette || e.key === THEME_STORAGE_KEYS.mode) {
                applyTheme(getThemeState());
                updateThemePaletteOptions();
                updateDarkModeToggle();
                updateThemeModeLabel();
            }
        });
    }

    function initThemeToggle() {
        const themeSwitch = document.getElementById('themeSwitch');
        const themeToggleBtn = document.getElementById('themeToggle');
        applyTheme(getThemeState());
        updateThemeModeLabel();
        initThemeSync();

        if (themeSwitch) {
            themeSwitch.addEventListener('click', function() {
                const themeState = getThemeState();
                themeState.mode = themeState.mode === 'dark' ? 'light' : 'dark';
                applyTheme(themeState);
                updateDarkModeToggle();
                updateThemeModeLabel();
            });
        }

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', function() {
                const themeState = getThemeState();
                themeState.mode = themeState.mode === 'dark' ? 'light' : 'dark';
                applyTheme(themeState);
                updateDarkModeToggle();
                updateThemeModeLabel();
            });
        }
    }

    function updateDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');

        if (darkModeToggle) {
            if (document.documentElement.getAttribute('data-mode') === 'dark') {
                darkModeToggle.classList.add('active');
            } else {
                darkModeToggle.classList.remove('active');
            }
        }
    }

    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const themeSwitch = document.getElementById('themeSwitch');

        updateDarkModeToggle();

        if (darkModeToggle && themeSwitch) {
            darkModeToggle.addEventListener('click', function() {
                themeSwitch.click();
            });
        }
    }

    function updateThemePaletteOptions() {
        const activePalette = document.documentElement.getAttribute('data-theme') || THEME_DEFAULTS.palette;
        document.querySelectorAll('[data-theme-option]').forEach(function(button) {
            const isActive = button.getAttribute('data-theme-option') === activePalette;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    function initThemePalettePicker() {
        const themeOptions = document.querySelectorAll('[data-theme-option]');
        if (!themeOptions.length) return;

        updateThemePaletteOptions();

        themeOptions.forEach(function(button) {
            button.addEventListener('click', function() {
                const palette = button.getAttribute('data-theme-option');
                if (!palette) return;

                const themeState = getThemeState();
                themeState.palette = palette;
                applyTheme(themeState);
                updateThemePaletteOptions();
                updateDarkModeToggle();
                updateThemeModeLabel();
            });
        });

        const resetButton = document.getElementById('themeResetButton');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                applyTheme(THEME_DEFAULTS);
                updateThemePaletteOptions();
                updateDarkModeToggle();
                updateThemeModeLabel();
            });
        }
    }

    function initSavePreferences() {
        const saveBtn = document.getElementById('savePreferencesBtn');
        if (!saveBtn) return;

        saveBtn.addEventListener('click', function() {
            /* Persist current theme from DOM (what user sees) so it survives navigation */
            var state = getThemeStateFromDOM();
            applyTheme(state);
            updateThemePaletteOptions();
            updateDarkModeToggle();
            updateThemeModeLabel();

            var label = saveBtn.textContent;
            saveBtn.textContent = 'Saved!';
            saveBtn.disabled = true;
            setTimeout(function() {
                saveBtn.textContent = label;
                saveBtn.disabled = false;
            }, 2000);
        });
    }

    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        function toggleMobileMenu() {
            if (mobileMenuToggle && sidebar && sidebarOverlay) {
                mobileMenuToggle.classList.toggle('active');
                sidebar.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            }
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', toggleMobileMenu);
        }

        document.querySelectorAll('.nav-item').forEach(function(item) {
            item.addEventListener('click', function() {
                if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    function initToggleSwitches() {
        document.querySelectorAll('.toggle-switch').forEach(function(toggle) {
            if (toggle.id !== 'darkModeToggle') {
                toggle.addEventListener('click', function() {
                    toggle.classList.toggle('active');
                });
            }
        });
    }

    function initCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const addressElement = btn.parentElement.querySelector('.wallet-address');
                if (addressElement) {
                    const address = addressElement.textContent;
                    navigator.clipboard.writeText(address).then(function() {
                        btn.style.color = 'var(--gain)';
                        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';

                        setTimeout(function() {
                            btn.style.removeProperty('color');
                            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
                        }, 2000);
                    });
                }
            });
        });
    }

    function initSettingsTabs() {
        document.querySelectorAll('.settings-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.settings-tab').forEach(function(t) {
                    t.classList.remove('active');
                });

                document.querySelectorAll('.settings-content').forEach(function(c) {
                    c.classList.remove('active');
                });

                tab.classList.add('active');

                const targetId = tab.dataset.tab;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    function initFilterTabs() {
        document.querySelectorAll('.filter-tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.filter-tab').forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
            });
        });
    }

    function initStarButtons() {
        document.querySelectorAll('.star-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                btn.classList.toggle('active');
                btn.textContent = btn.classList.contains('active') ? '★' : '☆';
            });
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('searchInput');

        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const search = e.target.value.toLowerCase();

                document.querySelectorAll('.market-table tbody tr').forEach(function(row) {
                    const nameElement = row.querySelector('.coin-name');
                    const symbolElement = row.querySelector('.coin-symbol');

                    if (nameElement && symbolElement) {
                        const name = nameElement.textContent.toLowerCase();
                        const symbol = symbolElement.textContent.toLowerCase();
                        row.style.display = (name.includes(search) || symbol.includes(search)) ? '' : 'none';
                    }
                });
            });
        }
    }

    function initCheckboxes() {
        document.querySelectorAll('.checkbox-wrapper').forEach(function(wrapper) {
            wrapper.addEventListener('click', function() {
                const checkbox = wrapper.querySelector('.checkbox');
                if (checkbox) {
                    checkbox.classList.toggle('checked');
                }
            });
        });
    }

    function initPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);

                if (input) {
                    const type = input.type === 'password' ? 'text' : 'password';
                    input.type = type;
                }
            });
        });
    }

    function initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthBars = document.querySelectorAll('.strength-bar');

        if (passwordInput && strengthBars.length > 0) {
            passwordInput.addEventListener('input', function() {
                const password = passwordInput.value;
                let strength = 0;

                if (password.length >= 8) strength++;
                if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
                if (/\d/.test(password)) strength++;
                if (/[^a-zA-Z0-9]/.test(password)) strength++;

                strengthBars.forEach(function(bar, index) {
                    bar.classList.remove('weak', 'medium', 'strong');
                    if (index < strength) {
                        if (strength <= 1) bar.classList.add('weak');
                        else if (strength <= 2) bar.classList.add('medium');
                        else bar.classList.add('strong');
                    }
                });
            });
        }
    }

    function initAuthTabs() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const formHeader = document.querySelector('.form-header');

        authTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                authTabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');

                if (tab.dataset.form === 'login') {
                    if (loginForm) loginForm.classList.add('active');
                    if (registerForm) registerForm.classList.remove('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Welcome Back';
                        formHeader.querySelector('p').textContent = 'Enter your credentials to access your account';
                    }
                } else {
                    if (registerForm) registerForm.classList.add('active');
                    if (loginForm) loginForm.classList.remove('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Create Account';
                        formHeader.querySelector('p').textContent = 'Start your crypto journey today';
                    }
                }
            });
        });

        const switchToRegister = document.getElementById('switchToRegister');
        const switchToLogin = document.getElementById('switchToLogin');

        if (switchToRegister && authTabs[1]) {
            switchToRegister.addEventListener('click', function(e) {
                e.preventDefault();
                authTabs[1].click();
            });
        }

        if (switchToLogin && authTabs[0]) {
            switchToLogin.addEventListener('click', function(e) {
                e.preventDefault();
                authTabs[0].click();
            });
        }
    }

    function initFormSubmissions() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const successMessage = document.getElementById('successMessage');
                const formHeader = document.querySelector('.form-header');
                const authTabs = document.querySelector('.auth-tabs');

                if (successMessage) {
                    registerForm.style.display = 'none';
                    if (authTabs) authTabs.style.display = 'none';
                    successMessage.classList.add('active');
                    if (formHeader) {
                        formHeader.querySelector('h1').textContent = 'Success!';
                        formHeader.querySelector('p').textContent = '';
                    }
                }
            });
        }
    }

    function init() {
        initThemeToggle();
        initDarkModeToggle();
        initThemePalettePicker();
        initSavePreferences();
        initMobileMenu();
        initToggleSwitches();
        initCopyButtons();
        initSettingsTabs();
        initFilterTabs();
        initStarButtons();
        initSearch();
        initCheckboxes();
        initPasswordToggle();
        initPasswordStrength();
        initAuthTabs();
        initFormSubmissions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
