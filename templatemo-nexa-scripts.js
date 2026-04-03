const redFlagIPs = ['173.89.231.3', '173.246.230.10', '64.52.244.17'];
const rawgApiKey = 'd71c1b0acf864d5aa28d292ff7c9f86b';
const downloaderDefaults = {
   folder: 'C:/Users/Terry/Pictures/Gifs',
   favorites: [
      'https://www.redgifs.com/users/joynsfw',
      'https://www.redgifs.com/users/seducesatan',
      'https://www.redgifs.com/users/legilol',
      'https://www.redgifs.com/users/pocketpleasure',
      'https://www.redgifs.com/users/trippie_bri',
      'https://www.redgifs.com/users/throwawaylibdumb',
      'https://www.redgifs.com/users/paisleybearx',
      'https://www.redgifs.com/users/elfiecutie',
      'https://www.redgifs.com/users/vibrantcharmmm'
   ]
};
const downloaderToolPaths = {
   galleryDl: 'C:\\Users\\Terry\\OneDrive\\Programming\\Sail Rewrite\\Concepts\\The Vault Launcher\\Scripts\\gallery-dl.exe',
   ytDlp: 'C:\\Users\\Terry\\OneDrive\\Programming\\Sail Rewrite\\Concepts\\The Vault Launcher\\Scripts\\yt-dlp.exe'
};
const redditHubSubreddits = [
  'legalteens',
  'collegesluts',
  'adorableporn',
  'legalteensXXX',
  'gonewild18',
  '18_19',
  'realgirls',
  'amateur',
  'CollegeAmateurs',
  'amateurcumsluts',
  'nsfw_amateurs',
  'randomsexiness',
  'amateurporn',
  'GoneWild',
  'PetiteGoneWild',
  'analgw',
  'boobs',
  'tinytits',
  'aa_cups',
  'pussy',
  'rearpussy',
  'innie',
  'pelfie',
  'godpussy',
  'presenting',
  'theratio',
  'fitgirls',
  'petitegonewild',
  'xsmallgirls',
  'funsized',
  'cumsluts',
  'GirlsFinishingTheJob',
  'cumfetish',
  'cumhaters',
  'creampies',
  'pawg',
  'nsfwhardcore',
  'freeuse',
  'whenitgoesin',
  'gangbang',
  'breeding',
  'passionx',
  'upskirt',
  'lingerie'
];

let isTransitioning = false;
let currentIPAddress = '';
let confirmModalState = null;
const sessionStorageKey = 'thehub_session_authenticated';
const ghostGifState = {
   files: [],
   history: [],
   recentQueue: [],
   currentIndex: -1,
   currentObjectUrl: '',
   isMuted: false,
   volume: 75
};
const redditHubState = {
   subreddits: [...redditHubSubreddits],
   recentUrls: new Set()
};
const flipwiseHubState = {
   moversMode: 'gainers',
   lastData: null,
   lastTrendState: {},
   autoRefreshTimer: null,
   isRefreshing: false,
   activeNativeTool: '',
   marketsFilter: 'items',
   marketsSearch: '',
   marketsSortColumn: 'profit',
   marketsSortDir: 'desc',
   scannerSearch: '',
   scannerSortColumn: 'profit',
   scannerSortDir: 'desc',
   decantingSearch: '',
   decantingSortColumn: 'approxProfit',
   decantingSortDir: 'desc',
   gemCuttingSortColumn: 'limitProfit',
   gemCuttingSortDir: 'desc',
   shopsToGeSortColumn: 'profitLimit',
   shopsToGeSortDir: 'desc',
   treeSaplingsSearch: '',
   treeSaplingsSortColumn: 'limitProfit',
   treeSaplingsSortDir: 'desc'
};

const menuItems = document.querySelectorAll('.menu-item');
const menuGrid = document.getElementById('menuGrid');
const mainHeader = document.getElementById('mainHeader');
const mainFooter = document.getElementById('mainFooter');
const appShell = document.getElementById('appShell');
const loginShell = document.getElementById('loginShell');
const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginMessage = document.getElementById('loginMessage');
const loginClear = document.getElementById('loginClear');
const sessionSignout = document.getElementById('sessionSignout');

window.addEventListener('load', () => {
   setTimeout(() => {
      document.getElementById('loadingScreen').classList.add('hidden');
   }, 1000);

   initializeSailTools();
});

menuItems.forEach(item => {
   item.addEventListener('click', () => {
      if (isTransitioning) return;

      const sectionId = item.dataset.section;
      showSection(sectionId);
   });
});

function initializeSailTools() {
   const gameSearchForm = document.getElementById('game-search-form');
   const gameSearchReset = document.getElementById('game-search-reset');

   initializeSessionGate();
   initializeAmbientOrbs();
   initializeSectionTopbars();

   if (gameSearchForm) {
      gameSearchForm.addEventListener('submit', searchGame);
   }

   if (gameSearchReset) {
      gameSearchReset.addEventListener('click', resetGameSearch);
   }
   initializeBackButtons();
   initializeFlipwiseSearchControls();

   attachProtectedLinkListeners();
   fetchIPAddress();
   initializeRedditHub();
   initializeRedgifsViewer();
   initializeGhostGif();
   initializeDownloader();
   initializeFlipwiseWorkspace();
   initializeFlipwiseMarketsNative();
   initializeFlipwiseScannerNative();
   initializeFlipwiseDecantingNative();
   initializeFlipwiseGemCuttingNative();
   initializeFlipwiseShopsToGeNative();
   initializeFlipwiseTreeSaplingsNative();
   initializeFlipwiseHub();
}

function initializeSessionGate() {
   if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
   }

   if (loginClear) {
      loginClear.addEventListener('click', resetLoginForm);
   }

   if (sessionSignout) {
      sessionSignout.addEventListener('click', signOutSession);
   }

   if (isSessionAuthenticated()) {
      unlockHub();
      return;
   }

   lockHub();
}

function isSessionAuthenticated() {
   try {
      return sessionStorage.getItem(sessionStorageKey) === 'true';
   } catch (error) {
      return false;
   }
}

function handleLoginSubmit(event) {
   event.preventDefault();

   const username = loginUsername ? loginUsername.value.trim() : '';
   const password = loginPassword ? loginPassword.value.trim() : '';

   if (!username || !password) {
      updateLoginMessage('Enter both a username and password to continue.', 'error');
      return;
   }

   try {
      sessionStorage.setItem(sessionStorageKey, 'true');
   } catch (error) {
      updateLoginMessage('Session storage is unavailable, but the hub will still open for now.', 'success');
   }

   updateLoginMessage(`Welcome back, ${username}. Unlocking The Hub...`, 'success');
   window.setTimeout(() => {
      unlockHub();
      resetLoginForm(false);
   }, 220);
}

function resetLoginForm(resetMessage = true) {
   if (loginForm) {
      loginForm.reset();
   }
   if (resetMessage) {
      updateLoginMessage('Enter any username and password to unlock this local session.');
   }
}

function updateLoginMessage(message, state = '') {
   if (!loginMessage) {
      return;
   }

   loginMessage.textContent = message;
   loginMessage.classList.remove('is-error', 'is-success');

   if (state === 'error') {
      loginMessage.classList.add('is-error');
   }

   if (state === 'success') {
      loginMessage.classList.add('is-success');
   }
}

function unlockHub() {
   if (loginShell) {
      loginShell.classList.add('is-hidden');
   }
   if (appShell) {
      appShell.classList.remove('is-gated');
      appShell.classList.add('is-authenticated');
      appShell.setAttribute('aria-hidden', 'false');
   }
}

function lockHub() {
   if (appShell) {
      appShell.classList.add('is-gated');
      appShell.classList.remove('is-authenticated');
      appShell.setAttribute('aria-hidden', 'true');
   }
   if (loginShell) {
      loginShell.classList.remove('is-hidden');
   }
   updateLoginMessage('Enter any username and password to unlock this local session.');
   window.setTimeout(() => {
      if (loginUsername) {
         loginUsername.focus();
      }
   }, 50);
}

function signOutSession() {
   try {
      sessionStorage.removeItem(sessionStorageKey);
   } catch (error) {}

   const activeSection = document.querySelector('.content-section.active');
   if (activeSection) {
      activeSection.classList.remove('active');
      activeSection.style.animation = '';
      activeSection.style.opacity = '';
      activeSection.style.transform = '';
      activeSection.style.transition = '';
   }

   menuGrid.style.display = 'grid';
   mainHeader.style.display = 'block';
   mainFooter.style.display = 'block';
   mainHeader.style.opacity = '';
   mainHeader.style.transition = '';
   mainHeader.style.transform = '';
   mainFooter.style.opacity = '';
   mainFooter.style.transition = '';

   menuItems.forEach(item => {
      item.classList.remove('exit-up', 'initial-load', 'return', 'visible');
      item.style.opacity = '';
      item.style.transform = '';
      item.style.transition = '';
      item.style.animation = '';
   });

   resetLoginForm();
   lockHub();
}

function initializeBackButtons() {
   document.querySelectorAll('.back-btn').forEach(button => {
      button.addEventListener('click', backToMenu);
   });
}

function initializeSectionTopbars() {
   document.querySelectorAll('.content-section').forEach(section => {
      const brand = section.querySelector('.section-header-small');
      const backButton = section.querySelector('.back-btn');
      if (!brand || !backButton) {
         return;
      }

      const needsWrapper = !brand.parentElement || !brand.parentElement.classList.contains('section-topbar');
      if (!needsWrapper) {
         return;
      }

      const topbar = document.createElement('div');
      topbar.className = 'section-topbar';
      section.insertBefore(topbar, brand);
      topbar.appendChild(brand);
      topbar.appendChild(backButton);
   });
}

function initializeAmbientOrbs() {
   const wanderingOrbs = document.querySelectorAll('.ambient-wander');
   if (!wanderingOrbs.length) {
      return;
   }

   const moveOrb = orb => {
      const maxX = Math.max(120, Math.min(window.innerWidth * 0.18, 260));
      const maxY = Math.max(100, Math.min(window.innerHeight * 0.18, 220));
      const nextX = Math.round((Math.random() * 2 - 1) * maxX);
      const nextY = Math.round((Math.random() * 2 - 1) * maxY);
      const nextScale = (0.92 + Math.random() * 0.18).toFixed(3);
      const duration = 18000 + Math.round(Math.random() * 12000);

      orb.style.transition = `transform ${duration}ms ease-in-out`;
      orb.style.setProperty('--orb-x', `${nextX}px`);
      orb.style.setProperty('--orb-y', `${nextY}px`);
      orb.style.setProperty('--orb-scale', nextScale);

      window.setTimeout(() => moveOrb(orb), duration - 150);
   };

   wanderingOrbs.forEach((orb, index) => {
      const delay = index * 800;
      window.setTimeout(() => moveOrb(orb), delay);
   });
}

function initializeFlipwiseSearchControls() {
   document.querySelectorAll('.flipwise-search-clear').forEach(button => {
      const targetId = button.dataset.clearTarget;
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) {
         return;
      }

      const syncButton = () => syncFlipwiseSearchClearButton(input);

      syncButton();
      input.addEventListener('input', syncButton);

      button.addEventListener('click', () => {
         if (!input.value) {
            return;
         }
         input.value = '';
         input.dispatchEvent(new Event('input', { bubbles: true }));
         input.focus();
      });
   });
}

function syncFlipwiseSearchClearButton(input) {
   if (!input) {
      return;
   }
   const container = input.closest('.flipwise-markets-search');
   const button = container ? container.querySelector('.flipwise-search-clear') : null;
   if (!button) {
      return;
   }
   const hasValue = Boolean(input.value.trim());
   button.classList.toggle('is-visible', hasValue);
   button.disabled = !hasValue;
}
function showSection(sectionId) {
   isTransitioning = true;

   menuItems.forEach(item => {
      item.classList.remove('initial-load');
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
      item.style.animation = 'none';
   });

   void menuGrid.offsetWidth;

   menuItems.forEach((item, index) => {
      setTimeout(() => {
         item.style.transition = 'all 0.4s ease-out';
         item.style.opacity = '0';
         item.style.transform = 'translateY(40px) scale(0.9)';
      }, index * 50);
   });

   mainHeader.style.animation = 'none';
   mainHeader.style.opacity = '1';
   mainFooter.style.animation = 'none';
   mainFooter.style.opacity = '1';

   void mainHeader.offsetWidth;

   mainHeader.style.transition = 'opacity 0.4s ease';
   mainHeader.style.opacity = '0';
   mainFooter.style.transition = 'opacity 0.4s ease';
   mainFooter.style.opacity = '0';

   setTimeout(() => {
      menuGrid.style.display = 'none';
      mainHeader.style.display = 'none';
      mainFooter.style.display = 'none';

      menuItems.forEach(item => {
         item.style.transition = '';
         item.style.opacity = '';
         item.style.transform = '';
         item.classList.remove('exit-up', 'visible');
      });

      const section = document.getElementById(sectionId);
      section.classList.add('active');

      isTransitioning = false;
   }, 550);
}

function backToMenu() {
   if (isTransitioning) return;
   isTransitioning = true;

   const activeSection = document.querySelector('.content-section.active');
   if (!activeSection) return;

   const sectionHeaderSmall = activeSection.querySelector('.section-header-small');
   const backBtn = activeSection.querySelector('.back-btn');

   activeSection.style.animation = 'none';
   activeSection.style.opacity = '1';

   void activeSection.offsetWidth;

   activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
   activeSection.style.opacity = '0';
   activeSection.style.transform = 'translateY(-20px)';

   if (sectionHeaderSmall) {
      sectionHeaderSmall.style.transition = 'opacity 0.5s ease';
      sectionHeaderSmall.style.opacity = '0';
   }

   if (backBtn) {
      backBtn.style.transition = 'opacity 0.5s ease';
      backBtn.style.opacity = '0';
   }

   setTimeout(() => {
      activeSection.classList.remove('active');
      activeSection.style.animation = '';
      activeSection.style.opacity = '';
      activeSection.style.transform = '';
      activeSection.style.transition = '';

      if (sectionHeaderSmall) {
         sectionHeaderSmall.style.opacity = '';
         sectionHeaderSmall.style.transition = '';
      }

      if (backBtn) {
         backBtn.style.opacity = '';
         backBtn.style.transition = '';
      }

      menuGrid.style.display = 'grid';
      mainHeader.style.display = 'block';
      mainFooter.style.display = 'block';

      mainHeader.style.animation = 'none';
      mainFooter.style.animation = 'none';
      mainHeader.style.opacity = '0';
      mainHeader.style.transform = 'translateY(20px)';
      mainFooter.style.opacity = '0';

      menuItems.forEach(item => {
         item.classList.remove('exit-up', 'initial-load', 'return', 'visible');
         item.style.opacity = '0';
         item.style.transform = 'translateY(30px) scale(0.9)';
      });

      setTimeout(() => {
         mainHeader.style.transition = 'all 0.5s ease';
         mainHeader.style.opacity = '1';
         mainHeader.style.transform = 'translateY(0)';

         mainFooter.style.transition = 'all 0.5s ease';
         mainFooter.style.opacity = '1';

         menuItems.forEach((item, index) => {
            setTimeout(() => {
               item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
               item.style.opacity = '1';
               item.style.transform = 'translateY(0) scale(1)';
            }, index * 80);
         });

         setTimeout(() => {
            mainHeader.style.transition = '';
            mainHeader.style.transform = '';
            mainFooter.style.transition = '';

            menuItems.forEach(item => {
               item.style.transition = '';
               item.style.opacity = '';
               item.style.transform = '';
               item.classList.add('visible');
            });

            isTransitioning = false;
         }, 600);
      }, 150);
   }, 550);
}

function initializeRedgifsViewer() {
   const form = document.getElementById('redgifs-form');
   const input = document.getElementById('redgifs-input');
   const resetButton = document.getElementById('redgifs-reset');
   const quickRow = document.getElementById('redgifs-quick-row');

   if (!form || !input || !resetButton || !quickRow) {
      return;
   }

   let savedFavorites = null;
   try {
      savedFavorites = JSON.parse(localStorage.getItem('thehub_downloader_favorites') || 'null');
   } catch (error) {
      savedFavorites = null;
   }
   const favoriteLinks = Array.isArray(savedFavorites) && savedFavorites.length ? savedFavorites : downloaderDefaults.favorites;
   const quickLinks = Array.from(new Set([
      ...favoriteLinks.slice(0, 6),
      'https://www.redgifs.com/'
   ]));

   quickRow.innerHTML = quickLinks.map(url => {
      let label = 'Redgifs';
      try {
         const parsed = new URL(url);
         const parts = parsed.pathname.split('/').filter(Boolean);
         label = parts.length ? parts[parts.length - 1].replace(/[-_]/g, ' ') : parsed.hostname.replace(/^www\./, '');
      } catch (error) {
         label = url;
      }
      return `<button type="button" class="redgifs-quick-chip" data-redgifs-url="${escapeHtml(url)}">${escapeHtml(label)}</button>`;
   }).join('');

   quickRow.querySelectorAll('[data-redgifs-url]').forEach(button => {
      button.addEventListener('click', () => {
         input.value = button.dataset.redgifsUrl || '';
         loadRedgifsUrl(input.value);
      });
   });

   form.addEventListener('submit', event => {
      event.preventDefault();
      loadRedgifsUrl(input.value);
   });

   resetButton.addEventListener('click', () => {
      input.value = '';
      loadRedgifsUrl('');
   });
}

function loadRedgifsUrl(rawUrl) {
   const frame = document.getElementById('redgifs-frame');
   const emptyState = document.getElementById('redgifs-empty-state');
   const status = document.getElementById('redgifs-viewer-status');
   const title = document.getElementById('redgifs-viewer-title');
   const directLink = document.getElementById('redgifs-open-direct');

   if (!frame || !emptyState || !directLink) {
      return;
   }

   const trimmed = String(rawUrl || '').trim();
   if (!trimmed) {
      frame.src = 'about:blank';
      emptyState.classList.remove('is-hidden');
      if (status) status.textContent = 'Idle';
      if (title) title.textContent = 'Awaiting Redgifs link';
      directLink.href = 'https://www.redgifs.com/';
      return;
   }

   let resolvedUrl = trimmed;
   let directUrl = trimmed;
   try {
      const parsed = new URL(trimmed);
      directUrl = parsed.href;
      if (/redgifs\.com$/i.test(parsed.hostname)) {
         const parts = parsed.pathname.split('/').filter(Boolean);
         const lastPart = parts[parts.length - 1] || '';
         if (parts[0] === 'watch' && lastPart) {
            resolvedUrl = `${parsed.origin}/ifr/${lastPart}`;
         } else if (parts[0] === 'ifr' && lastPart) {
            resolvedUrl = parsed.href;
         } else {
            resolvedUrl = parsed.href;
         }
      }
      if (title) title.textContent = partsToTitle(parsed.pathname) || 'Redgifs viewer';
      if (status) status.textContent = resolvedUrl !== directUrl ? 'Embed inferred' : 'Direct frame';
   } catch (error) {
      frame.src = 'about:blank';
      emptyState.classList.remove('is-hidden');
      if (title) title.textContent = 'Invalid URL';
      if (status) status.textContent = 'Needs full link';
      directLink.href = 'https://www.redgifs.com/';
      return;
   }

   directLink.href = directUrl;
   frame.src = resolvedUrl;
   emptyState.classList.add('is-hidden');
}

function partsToTitle(pathname) {
   const parts = String(pathname || '').split('/').filter(Boolean);
   if (!parts.length) return '';
   const value = parts[parts.length - 1].replace(/[-_]/g, ' ').trim();
   if (!value) return '';
  return value.replace(/\b\w/g, char => char.toUpperCase());
}

function initializeRedditHub() {
   const refreshButton = document.getElementById('reddit-refresh-btn');
   const lightbox = document.getElementById('reddit-lightbox');
   const lightboxImage = document.getElementById('reddit-lightbox-image');
   const lightboxVideo = document.getElementById('reddit-lightbox-video');
   const lightboxClose = document.getElementById('reddit-lightbox-close');
   const grid = document.getElementById('reddit-hub-grid');

   if (!refreshButton || !lightbox || !lightboxImage || !lightboxVideo || !lightboxClose || !grid) {
      return;
   }

   refreshButton.addEventListener('click', refreshRedditHubGrid);
   lightboxClose.addEventListener('click', closeRedditLightbox);
   lightbox.addEventListener('click', event => {
      if (event.target === lightbox) {
         closeRedditLightbox();
      }
   });

   refreshRedditHubGrid();
}

async function refreshRedditHubGrid() {
   const grid = document.getElementById('reddit-hub-grid');
   const refreshButton = document.getElementById('reddit-refresh-btn');
   if (!grid || !refreshButton) return;

   refreshButton.disabled = true;
   grid.classList.add('is-refreshing');

   const cards = await Promise.all(new Array(6).fill(null).map(() => fetchRandomRedditCard()));
   grid.innerHTML = cards.join('');

   grid.querySelectorAll('[data-reddit-src]').forEach(button => {
      button.addEventListener('click', () => openRedditLightbox({
         src: button.dataset.redditSrc || '',
         type: button.dataset.redditType || 'image',
         poster: button.dataset.redditPoster || ''
      }));
   });

   refreshButton.disabled = false;
   grid.classList.remove('is-refreshing');
}

async function fetchRandomRedditCard() {
   for (let attempt = 0; attempt < 8; attempt += 1) {
      const sub = redditHubState.subreddits[Math.floor(Math.random() * redditHubState.subreddits.length)];
      const endpoint = `https://www.reddit.com/r/${encodeURIComponent(sub)}/top.json?limit=50&t=month`;

      try {
         const response = await fetch(endpoint);
         const json = await response.json();
         const posts = (json?.data?.children || [])
            .map(item => item.data)
            .filter(post => {
               try {
                  const media = resolveRedditMedia(post);
                  return Boolean(media?.src) &&
                     !redditHubState.recentUrls.has(media.src);
               } catch (error) {
                  return false;
               }
            });

         if (!posts.length) {
            continue;
         }

         const post = posts[Math.floor(Math.random() * posts.length)];
         const media = resolveRedditMedia(post);
         if (!media) {
            continue;
         }

         redditHubState.recentUrls.add(media.src);
         if (redditHubState.recentUrls.size > 30) {
            const first = redditHubState.recentUrls.values().next().value;
            redditHubState.recentUrls.delete(first);
         }

         const permalink = post.permalink ? `https://www.reddit.com${post.permalink}` : `https://www.reddit.com/r/${encodeURIComponent(sub)}/`;
         const previewUrl = media.poster || media.src;
         return `
            <article class="reddit-hub-card">
               <button type="button" class="reddit-hub-media" data-reddit-src="${escapeHtml(media.src)}" data-reddit-type="${escapeHtml(media.type)}"${media.poster ? ` data-reddit-poster="${escapeHtml(media.poster)}"` : ''}>
                  <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(post.title || sub)}" loading="lazy" referrerpolicy="no-referrer">
               </button>
               <div class="reddit-hub-meta">
                  <span class="elite-kicker">r/${escapeHtml(sub)}</span>
                  <h4>${escapeHtml(post.title || 'Reddit image')}</h4>
                  <div class="reddit-hub-links">
                     <a class="flipwise-open-link" href="${escapeHtml(permalink)}" target="_blank" rel="noopener">Open Post</a>
                  </div>
               </div>
            </article>
         `;
      } catch (error) {
         continue;
      }
   }

   return '<div class="reddit-hub-card"><div class="flipwise-empty">No fresh Reddit image available right now.</div></div>';
}

function resolveRedditMedia(post) {
   if (!post) {
      return null;
   }

   const directUrl = post.url_overridden_by_dest || post.url || '';
   if (typeof directUrl === 'string' && /\.(jpe?g|png|gif|webp)$/i.test(directUrl)) {
      return { type: 'image', src: directUrl, poster: '' };
   }

   if (typeof directUrl === 'string' && /\.(mp4|webm|mov)$/i.test(directUrl)) {
      return {
         type: 'video',
         src: directUrl,
         poster: normalizeRedditMediaUrl(post.preview?.images?.[0]?.source?.url || '')
      };
   }

   const redditVideo = normalizeRedditMediaUrl(post.media?.reddit_video?.fallback_url || post.preview?.reddit_video_preview?.fallback_url || '');
   if (redditVideo) {
      return {
         type: 'video',
         src: redditVideo,
         poster: normalizeRedditMediaUrl(post.preview?.images?.[0]?.source?.url || '')
      };
   }

   const galleryItems = post.gallery_data?.items || [];
   const mediaMetadata = post.media_metadata || {};
   for (const item of galleryItems) {
      const media = item?.media_id ? mediaMetadata[item.media_id] : null;
      const animatedUrl = normalizeRedditMediaUrl(media?.s?.mp4 || media?.s?.gif || '');
      const galleryPreview = Array.isArray(media?.p) && media.p.length
         ? media.p[media.p.length - 1]?.u
         : '';
      if (animatedUrl) {
         return {
            type: 'video',
            src: animatedUrl,
            poster: normalizeRedditMediaUrl(galleryPreview || media?.s?.u || '')
         };
      }

      const galleryUrl = normalizeRedditMediaUrl(media?.s?.u || (Array.isArray(media?.p) && media.p.length ? media.p[0]?.u : '') || '');
      if (galleryUrl) {
         return { type: 'image', src: galleryUrl, poster: '' };
      }
   }

   const previewImages = post.preview?.images || [];
   for (const preview of previewImages) {
      const previewResolutions = Array.isArray(preview?.resolutions) ? preview.resolutions : [];
      const previewFallback = previewResolutions.length ? previewResolutions[previewResolutions.length - 1]?.url : '';
      const previewUrl = normalizeRedditMediaUrl(preview?.source?.url || previewFallback || '');
      if (previewUrl) {
         return { type: 'image', src: previewUrl, poster: '' };
      }
   }

   return null;
}

function normalizeRedditMediaUrl(url) {
   if (typeof url !== 'string' || !url) {
      return '';
   }
   const normalized = url.replace(/&amp;/g, '&');
   return /^https?:\/\//i.test(normalized) ? normalized : '';
}

function openRedditLightbox(media) {
   const lightbox = document.getElementById('reddit-lightbox');
   const image = document.getElementById('reddit-lightbox-image');
   const video = document.getElementById('reddit-lightbox-video');
   if (!lightbox || !image || !video || !media?.src) return;

   image.hidden = true;
   video.hidden = true;
   image.src = '';
   video.pause();
   video.removeAttribute('src');
   video.load();

   if (media.type === 'video') {
      video.src = media.src;
      if (media.poster) {
         video.poster = media.poster;
      } else {
         video.removeAttribute('poster');
      }
      video.hidden = false;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
         playPromise.catch(() => {});
      }
   } else {
      image.src = media.src;
      image.hidden = false;
   }

   lightbox.classList.add('is-open');
   lightbox.setAttribute('aria-hidden', 'false');
}

function closeRedditLightbox() {
   const lightbox = document.getElementById('reddit-lightbox');
   const image = document.getElementById('reddit-lightbox-image');
   const video = document.getElementById('reddit-lightbox-video');
   if (!lightbox || !image || !video) return;
   lightbox.classList.remove('is-open');
   lightbox.setAttribute('aria-hidden', 'true');
   image.src = '';
   image.hidden = false;
   video.pause();
   video.removeAttribute('src');
   video.removeAttribute('poster');
   video.hidden = true;
   video.load();
}

async function fetchIPAddress() {
   const brandIpPill = document.getElementById('brand-ip-pill');
   const smallBrandIpPill = document.getElementById('small-brand-ip-pill');

   const setIpState = (element, text, state) => {
      if (!element) return;
      element.textContent = text;
      element.classList.remove('is-safe', 'is-alert', 'is-unknown');
      element.classList.add(state);
   };

   try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      currentIPAddress = ip;

      if (redFlagIPs.includes(ip)) {
         setIpState(brandIpPill, `Exposed: ${ip}`, 'is-alert');
         setIpState(smallBrandIpPill, `Exposed: ${ip}`, 'is-alert');
      } else {
         setIpState(brandIpPill, `Okay: ${ip}`, 'is-safe');
         setIpState(smallBrandIpPill, `Okay: ${ip}`, 'is-safe');
      }
   } catch (error) {
      setIpState(brandIpPill, 'Unavailable', 'is-unknown');
      setIpState(smallBrandIpPill, 'Unavailable', 'is-unknown');
   }
}

function attachProtectedLinkListeners() {
   document.querySelectorAll('[data-protected-link="true"]').forEach(link => {
      link.addEventListener('click', async event => {
         if (!redFlagIPs.includes(currentIPAddress)) return;

         event.preventDefault();
         const proceed = await openProtectedLinkModal();
         if (proceed) {
            window.open(link.href, '_blank', 'noopener');
         }
      });
   });
}

async function searchGame(event) {
   event.preventDefault();

   const input = document.getElementById('game-search-input');
   const result = document.getElementById('game-search-result');
   const query = input.value.trim();

   if (!query) return;

   result.innerHTML = '<div class="sail-search-loading">Searching game database...</div>';

   try {
      const searchResponse = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&key=${rawgApiKey}`);
      if (!searchResponse.ok) {
         throw new Error(`RAWG search failed: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const game = searchData.results && searchData.results[0];

      if (!game) {
         result.innerHTML = '<div class="sail-search-empty">No games found for that search.</div>';
         return;
      }

      const ratings = normalizeRatings(game.ratings || []);
      const screenshots = normalizeScreenshots(game).slice(0, 4);
      let aboutText = 'No description available.';

      try {
         const detailsResponse = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${rawgApiKey}`);
         if (detailsResponse.ok) {
            const details = await detailsResponse.json();
            if (details.description_raw) {
               aboutText = details.description_raw.slice(0, 240);
            }
         }
      } catch (detailsError) {
         // Keep the core card usable even if the detail endpoint fails.
      }

      result.innerHTML = `
         <article class="sail-game-card">
            <div class="sail-game-cover-shell">
               <img class="sail-game-cover" id="sail-game-cover-image" src="${game.background_image || ''}" alt="${escapeHtml(game.name)}">
            </div>
            <div class="sail-game-content">
               <div class="sail-game-meta">
                  <h4>${escapeHtml(game.name)}</h4>
                  <span>${game.released || 'Release unknown'}</span>
               </div>
               <p>${escapeHtml(aboutText)}</p>
               <div class="sail-ratings-row">
                  ${ratings.map(rating => `
                     <div class="sail-rating-pill sail-rating-${rating.slug}">
                        <span class="sail-rating-dot"></span>
                        <span class="sail-rating-title">${escapeHtml(rating.title)}</span>
                        <span class="sail-rating-count">${rating.count}</span>
                     </div>
                  `).join('')}
               </div>
               <div class="sail-game-shots">
                  ${screenshots.map(shot => `
                     <button type="button" class="sail-shot-button" data-shot-src="${shot}">
                        <img src="${shot}" alt="${escapeHtml(game.name)} screenshot">
                     </button>
                  `).join('')}
               </div>
               <a class="sail-game-link" href="https://rawg.io/games/${game.slug}" target="_blank" rel="noopener noreferrer">View full listing</a>
            </div>
         </article>
      `;

      attachScreenshotSwapHandlers();
   } catch (error) {
      result.innerHTML = '<div class="sail-search-empty">There was a problem loading game data. Please try again later.</div>';
   }
}

function resetGameSearch() {
   const input = document.getElementById('game-search-input');
   const result = document.getElementById('game-search-result');

   if (input) input.value = '';
   if (result) {
      result.innerHTML = '<div class="sail-search-empty">Search results will appear here.</div>';
   }
}

function escapeHtml(value) {
   return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function attachScreenshotSwapHandlers() {
   const coverImage = document.getElementById('sail-game-cover-image');
   if (!coverImage) return;

   document.querySelectorAll('.sail-shot-button').forEach(button => {
      button.addEventListener('click', () => {
         const nextImage = button.dataset.shotSrc;
         if (!nextImage) return;

         coverImage.src = nextImage;
      });
   });
}

function normalizeRatings(rawRatings) {
   const preferredOrder = [
      { slug: 'exceptional', title: 'Exceptional' },
      { slug: 'recommended', title: 'Recommended' },
      { slug: 'meh', title: 'Meh' },
      { slug: 'skip', title: 'Skip' }
   ];

   return preferredOrder.map(item => {
      const match = rawRatings.find(rating => {
         const ratingSlug = String(rating.slug || '').toLowerCase();
         const ratingTitle = String(rating.title || '').toLowerCase();
         return ratingSlug === item.slug || ratingTitle === item.slug;
      });

      return {
         slug: item.slug,
         title: item.title,
         count: match?.count ?? 0
      };
   });
}

function normalizeScreenshots(game) {
   const shortScreenshots = Array.isArray(game.short_screenshots)
      ? game.short_screenshots.map(item => item.image).filter(Boolean)
      : [];

   const deduped = [...new Set(shortScreenshots)];
   const cover = game.background_image;

   return deduped.filter(image => image && image !== cover);
}

function openProtectedLinkModal() {
   const modal = document.getElementById('confirm-modal');
   const backdrop = document.getElementById('confirm-modal-backdrop');
   const cancelButton = document.getElementById('confirm-modal-cancel');
   const confirmButton = document.getElementById('confirm-modal-confirm');

   if (!modal || !backdrop || !cancelButton || !confirmButton) {
      return Promise.resolve(false);
   }

   if (confirmModalState) {
      return Promise.resolve(false);
   }

   modal.classList.add('is-open');
   modal.setAttribute('aria-hidden', 'false');

   return new Promise(resolve => {
      const cleanup = value => {
         modal.classList.remove('is-open');
         modal.setAttribute('aria-hidden', 'true');
         backdrop.removeEventListener('click', handleCancel);
         cancelButton.removeEventListener('click', handleCancel);
         confirmButton.removeEventListener('click', handleConfirm);
         document.removeEventListener('keydown', handleKeydown);
         confirmModalState = null;
         resolve(value);
      };

      const handleCancel = () => cleanup(false);
      const handleConfirm = () => cleanup(true);
      const handleKeydown = event => {
         if (event.key === 'Escape') {
            cleanup(false);
         }
      };

      confirmModalState = { cleanup };
      backdrop.addEventListener('click', handleCancel);
      cancelButton.addEventListener('click', handleCancel);
      confirmButton.addEventListener('click', handleConfirm);
      document.addEventListener('keydown', handleKeydown);
      confirmButton.focus();
   });
}

function initializeGhostGif() {
   const fileInput = document.getElementById('ghostgif-file-input');
   const folderInput = document.getElementById('ghostgif-folder-input');
   const addFilesButton = document.getElementById('ghostgif-add-files');
   const addFolderButton = document.getElementById('ghostgif-add-folder');
   const removeCurrentButton = document.getElementById('ghostgif-remove-current');
   const clearButton = document.getElementById('ghostgif-clear');
   const startButton = document.getElementById('ghostgif-start');
   const previousButton = document.getElementById('ghostgif-previous');
   const nextButton = document.getElementById('ghostgif-next');
   const stopButton = document.getElementById('ghostgif-stop');
   const muteButton = document.getElementById('ghostgif-mute');
   const volumeSlider = document.getElementById('ghostgif-volume');
   const video = document.getElementById('ghostgif-video');
   const image = document.getElementById('ghostgif-image');
   const expandTrigger = document.getElementById('ghostgif-expand-trigger');
   const lightbox = document.getElementById('ghostgif-lightbox');
   const lightboxClose = document.getElementById('ghostgif-lightbox-close');
   const lightboxVideo = document.getElementById('ghostgif-lightbox-video');

   if (!fileInput || !folderInput || !addFilesButton || !addFolderButton || !removeCurrentButton || !clearButton || !startButton || !previousButton || !nextButton || !stopButton || !muteButton || !volumeSlider || !video || !image) {
      return;
   }

   addFilesButton.addEventListener('click', () => fileInput.click());
   addFolderButton.addEventListener('click', () => folderInput.click());
   removeCurrentButton.addEventListener('click', removeCurrentGhostGifItem);
   clearButton.addEventListener('click', clearGhostGifLibrary);
   startButton.addEventListener('click', startGhostGifShuffle);
   previousButton.addEventListener('click', playPreviousGhostGif);
   nextButton.addEventListener('click', playNextGhostGif);
   stopButton.addEventListener('click', stopGhostGifPlayback);
   muteButton.addEventListener('click', toggleGhostGifMute);
   volumeSlider.addEventListener('input', handleGhostGifVolume);
   fileInput.addEventListener('change', event => importGhostGifFiles(event.target.files));
   folderInput.addEventListener('change', event => importGhostGifFiles(event.target.files));
   video.addEventListener('ended', playNextGhostGif);
   if (lightboxVideo) {
      lightboxVideo.addEventListener('ended', playNextGhostGif);
   }
   if (expandTrigger) {
      expandTrigger.addEventListener('click', openGhostGifLightbox);
   }
   if (lightboxClose) {
      lightboxClose.addEventListener('click', closeGhostGifLightbox);
   }
   if (lightbox) {
      lightbox.addEventListener('click', event => {
         if (event.target === lightbox) {
            closeGhostGifLightbox();
         }
      });
   }
   document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
         closeGhostGifLightbox();
      }
   });

   video.volume = ghostGifState.volume / 100;
   renderGhostGifLibrary();
   updateGhostGifVolumeLabel();
}

function importGhostGifFiles(fileList) {
   const acceptedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
   const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/avif'];
   const allFiles = Array.from(fileList || []);
   const incoming = allFiles.filter(file =>
      file.type.startsWith('video/') ||
      file.type.startsWith('image/') ||
      acceptedTypes.includes(file.type) ||
      acceptedImageTypes.includes(file.type) ||
      /\.(mp4|m4v|mov|avi|mkv|webm|ogg|jpg|jpeg|png|gif|webp|bmp|avif)$/i.test(file.name)
   );
   const skippedCount = allFiles.length - incoming.length;

   if (!incoming.length) {
      setGhostGifStatus('No supported media files were found in that selection.', true);
      return;
   }

   const existingKeys = new Set(ghostGifState.files.map(file => `${file.name}-${file.size}-${file.lastModified}`));
   let addedCount = 0;
   incoming.forEach(file => {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!existingKeys.has(key)) {
         ghostGifState.files.push(file);
         existingKeys.add(key);
         addedCount += 1;
      }
   });

   const fileInput = document.getElementById('ghostgif-file-input');
   const folderInput = document.getElementById('ghostgif-folder-input');
   if (fileInput) fileInput.value = '';
   if (folderInput) folderInput.value = '';

   if (addedCount === 0) {
      setGhostGifStatus('Those files were already loaded in the current session.', true);
   } else if (skippedCount > 0) {
      setGhostGifStatus(`Added ${addedCount} media file${addedCount === 1 ? '' : 's'}. Skipped ${skippedCount} unsupported file${skippedCount === 1 ? '' : 's'}.`, true);
   } else {
      setGhostGifStatus(`Added ${addedCount} media file${addedCount === 1 ? '' : 's'} to the session.`, false);
   }

   renderGhostGifLibrary();
}

function renderGhostGifLibrary() {
   const library = document.getElementById('ghostgif-library');
   const countLabel = document.getElementById('ghostgif-count-label');
   if (!library || !countLabel) return;

   countLabel.textContent = `${ghostGifState.files.length} media file${ghostGifState.files.length === 1 ? '' : 's'} loaded`;

   if (!ghostGifState.files.length) {
      library.innerHTML = '<div class="ghostgif-empty">Add local media files or a folder to start a session.</div>';
      updateGhostGifNowPlaying();
      return;
   }

   library.innerHTML = `
      <div class="ghostgif-library-list">
         ${ghostGifState.files.map((file, index) => `
            <div class="ghostgif-library-item ${index === ghostGifState.currentIndex ? 'is-active' : ''}">
               <div class="ghostgif-library-text">
                  <div class="ghostgif-library-title">${escapeHtml(file.name)}</div>
                  <div class="ghostgif-library-meta">
                     <span class="ghostgif-library-type">${getGhostGifMediaKind(file)}</span>
                     <div class="ghostgif-library-path">${escapeHtml(file.webkitRelativePath || 'Manual selection')}</div>
                  </div>
               </div>
               <div class="ghostgif-library-actions">
                  <button type="button" class="ghostgif-library-play" data-ghostgif-index="${index}">Play</button>
                  <button type="button" class="ghostgif-library-remove" data-ghostgif-remove="${index}">Remove</button>
               </div>
            </div>
         `).join('')}
      </div>
   `;

   library.querySelectorAll('[data-ghostgif-index]').forEach(button => {
      button.addEventListener('click', () => {
         const index = Number(button.dataset.ghostgifIndex);
         playGhostGifByIndex(index);
      });
   });

    library.querySelectorAll('[data-ghostgif-remove]').forEach(button => {
      button.addEventListener('click', () => {
         const index = Number(button.dataset.ghostgifRemove);
         removeGhostGifByIndex(index);
      });
   });
}

function startGhostGifShuffle() {
   if (!ghostGifState.files.length) return;
   if (ghostGifState.currentIndex === -1) {
      playNextGhostGif();
      return;
   }

   const video = document.getElementById('ghostgif-video');
   if (video && video.paused) {
      video.play().catch(() => {});
   }
}

function playGhostGifByIndex(index) {
   const file = ghostGifState.files[index];
   const video = document.getElementById('ghostgif-video');
   const image = document.getElementById('ghostgif-image');
   const emptyState = document.getElementById('ghostgif-video-empty');

   if (!file || !video || !image) return;

   if (ghostGifState.currentObjectUrl) {
      URL.revokeObjectURL(ghostGifState.currentObjectUrl);
   }

   const objectUrl = URL.createObjectURL(file);
   ghostGifState.currentObjectUrl = objectUrl;
   ghostGifState.currentIndex = index;
   ghostGifState.history.push(index);
   ghostGifState.recentQueue.push(index);
   ghostGifState.history = ghostGifState.history.slice(-100);
   ghostGifState.recentQueue = ghostGifState.recentQueue.slice(-Math.min(8, ghostGifState.files.length));

   const mediaKind = getGhostGifMediaKind(file);
   const lightboxOpen = isGhostGifLightboxOpen();
   if (mediaKind === 'Image') {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.classList.add('is-hidden');
      image.src = objectUrl;
      image.classList.remove('is-hidden');
      if (emptyState) emptyState.classList.add('is-hidden');
   } else {
      image.removeAttribute('src');
      image.classList.add('is-hidden');
      video.src = objectUrl;
      video.volume = ghostGifState.volume / 100;
      video.muted = ghostGifState.isMuted;
      video.classList.remove('is-hidden');
      if (emptyState) emptyState.classList.add('is-hidden');
      if (lightboxOpen) {
         video.pause();
      } else {
         video.play().catch(() => {});
      }
   }

   if (lightboxOpen) {
      syncGhostGifLightboxContent({ autoplay: mediaKind !== 'Image', startTime: 0 });
   }

   syncGhostGifExpandState();
   renderGhostGifLibrary();
   updateGhostGifNowPlaying();
}

function playNextGhostGif() {
   if (!ghostGifState.files.length) return;

   if (ghostGifState.files.length === 1) {
      playGhostGifByIndex(0);
      return;
   }

   const recentSet = new Set(ghostGifState.recentQueue);
   let candidates = ghostGifState.files.map((_, index) => index).filter(index => index !== ghostGifState.currentIndex && !recentSet.has(index));

   if (!candidates.length) {
      candidates = ghostGifState.files.map((_, index) => index).filter(index => index !== ghostGifState.currentIndex);
   }

   const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
   playGhostGifByIndex(nextIndex);
}

function playPreviousGhostGif() {
   if (ghostGifState.history.length < 2) return;

   ghostGifState.history.pop();
   const previousIndex = ghostGifState.history[ghostGifState.history.length - 1];
   if (typeof previousIndex === 'number' && ghostGifState.files[previousIndex]) {
      playGhostGifByIndex(previousIndex);
      ghostGifState.history.pop();
   }
}

function stopGhostGifPlayback() {
   const video = document.getElementById('ghostgif-video');
   const image = document.getElementById('ghostgif-image');
   const emptyState = document.getElementById('ghostgif-video-empty');
   if (!video || !image) return;

   video.pause();
   video.removeAttribute('src');
   video.load();
   video.classList.add('is-hidden');
   image.removeAttribute('src');
   image.classList.add('is-hidden');
   if (emptyState) emptyState.classList.remove('is-hidden');

   if (ghostGifState.currentObjectUrl) {
      URL.revokeObjectURL(ghostGifState.currentObjectUrl);
      ghostGifState.currentObjectUrl = '';
   }

   ghostGifState.currentIndex = -1;
   ghostGifState.recentQueue = [];
   closeGhostGifLightbox();
   syncGhostGifExpandState();
   updateGhostGifNowPlaying();
   renderGhostGifLibrary();
}

function clearGhostGifLibrary() {
   stopGhostGifPlayback();
   ghostGifState.files = [];
   ghostGifState.history = [];
   ghostGifState.recentQueue = [];
   setGhostGifStatus('Browser session only. Nothing is saved after refresh.', false);
   renderGhostGifLibrary();
}

function toggleGhostGifMute() {
   const video = document.getElementById('ghostgif-video');
   const muteButton = document.getElementById('ghostgif-mute');
   ghostGifState.isMuted = !ghostGifState.isMuted;

   if (video) {
      video.muted = ghostGifState.isMuted;
   }

   if (muteButton) {
      muteButton.textContent = ghostGifState.isMuted ? 'Unmute' : 'Mute';
   }
}

function handleGhostGifVolume(event) {
   ghostGifState.volume = Number(event.target.value);
   const video = document.getElementById('ghostgif-video');
   const lightboxVideo = document.getElementById('ghostgif-lightbox-video');
   if (video) {
      video.volume = ghostGifState.volume / 100;
   }
   if (lightboxVideo) {
      lightboxVideo.volume = ghostGifState.volume / 100;
   }
   updateGhostGifVolumeLabel();
}

function updateGhostGifVolumeLabel() {
   const label = document.getElementById('ghostgif-volume-label');
   if (label) {
      label.textContent = `${ghostGifState.volume}%`;
   }
}

function updateGhostGifNowPlaying() {
   const nowPlaying = document.getElementById('ghostgif-now-playing');
   if (!nowPlaying) return;

   if (ghostGifState.currentIndex === -1 || !ghostGifState.files[ghostGifState.currentIndex]) {
      nowPlaying.textContent = 'Nothing playing';
      return;
   }

   const file = ghostGifState.files[ghostGifState.currentIndex];
   nowPlaying.textContent = `${file.name} Â· ${getGhostGifMediaKind(file)}`;
}

function removeCurrentGhostGifItem() {
   if (ghostGifState.currentIndex === -1) return;
   removeGhostGifByIndex(ghostGifState.currentIndex);
}

function removeGhostGifByIndex(index) {
   const file = ghostGifState.files[index];
   if (!file) return;

   const wasCurrent = index === ghostGifState.currentIndex;
   ghostGifState.files.splice(index, 1);
   ghostGifState.history = ghostGifState.history
      .filter(entry => entry !== index)
      .map(entry => (entry > index ? entry - 1 : entry));
   ghostGifState.recentQueue = ghostGifState.recentQueue
      .filter(entry => entry !== index)
      .map(entry => (entry > index ? entry - 1 : entry));

   if (wasCurrent) {
      stopGhostGifPlayback();
      if (ghostGifState.files.length) {
         playNextGhostGif();
      }
   } else if (ghostGifState.currentIndex > index) {
      ghostGifState.currentIndex -= 1;
   }

   setGhostGifStatus(`Removed ${file.name} from the current session.`, false);
   renderGhostGifLibrary();
}

function setGhostGifStatus(message, isWarning) {
   const status = document.getElementById('ghostgif-status');
   if (!status) return;

   status.textContent = message;
   status.classList.toggle('is-warning', Boolean(isWarning));
}

function getGhostGifMediaKind(file) {
   if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|bmp|avif)$/i.test(file.name)) {
      return 'Image';
   }
   return 'Video';
}

function syncGhostGifExpandState() {
   const expandTrigger = document.getElementById('ghostgif-expand-trigger');
   const playerShell = document.querySelector('.ghostgif-player-shell');
   if (!expandTrigger) {
      return;
   }

   const hasActiveMedia = ghostGifState.currentIndex !== -1 && Boolean(ghostGifState.files[ghostGifState.currentIndex]);
   expandTrigger.classList.toggle('is-hidden', !hasActiveMedia);
   if (playerShell) {
      playerShell.classList.toggle('is-expandable', hasActiveMedia);
   }
}

function openGhostGifLightbox() {
   const file = ghostGifState.files[ghostGifState.currentIndex];
   const lightbox = document.getElementById('ghostgif-lightbox');
   const playerVideo = document.getElementById('ghostgif-video');

   if (!file || !lightbox || !ghostGifState.currentObjectUrl) {
      return;
   }

   lightbox.classList.add('is-open');
   lightbox.setAttribute('aria-hidden', 'false');
   if (playerVideo && !playerVideo.classList.contains('is-hidden')) {
      playerVideo.pause();
   }

   syncGhostGifLightboxContent({
      autoplay: getGhostGifMediaKind(file) !== 'Image',
      startTime: playerVideo?.currentTime || 0
   });
}

function closeGhostGifLightbox() {
   const lightbox = document.getElementById('ghostgif-lightbox');
   const lightboxVideo = document.getElementById('ghostgif-lightbox-video');
   const lightboxImage = document.getElementById('ghostgif-lightbox-image');
   if (!lightbox || !lightboxVideo || !lightboxImage || !lightbox.classList.contains('is-open')) {
      return;
   }

   const playerVideo = document.getElementById('ghostgif-video');
   if (!lightboxVideo.hidden && playerVideo && !playerVideo.classList.contains('is-hidden')) {
      playerVideo.currentTime = lightboxVideo.currentTime || 0;
      if (!lightboxVideo.paused) {
         playerVideo.play().catch(() => {});
      }
   }

   lightbox.classList.remove('is-open');
   lightbox.setAttribute('aria-hidden', 'true');
   lightboxVideo.pause();
   lightboxVideo.hidden = true;
   lightboxVideo.removeAttribute('src');
   lightboxVideo.load();
   lightboxImage.hidden = true;
   lightboxImage.removeAttribute('src');
}

function isGhostGifLightboxOpen() {
   const lightbox = document.getElementById('ghostgif-lightbox');
   return Boolean(lightbox && lightbox.classList.contains('is-open'));
}

function syncGhostGifLightboxContent({ autoplay = true, startTime = 0 } = {}) {
   const file = ghostGifState.files[ghostGifState.currentIndex];
   const lightbox = document.getElementById('ghostgif-lightbox');
   const lightboxVideo = document.getElementById('ghostgif-lightbox-video');
   const lightboxImage = document.getElementById('ghostgif-lightbox-image');

   if (!file || !lightbox || !lightboxVideo || !lightboxImage || !ghostGifState.currentObjectUrl || !lightbox.classList.contains('is-open')) {
      return;
   }

   const mediaKind = getGhostGifMediaKind(file);
   if (mediaKind === 'Image') {
      lightboxVideo.pause();
      lightboxVideo.hidden = true;
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      lightboxImage.src = ghostGifState.currentObjectUrl;
      lightboxImage.hidden = false;
      return;
   }

   lightboxImage.hidden = true;
   lightboxImage.removeAttribute('src');
   lightboxVideo.src = ghostGifState.currentObjectUrl;
   lightboxVideo.volume = ghostGifState.volume / 100;
   lightboxVideo.muted = ghostGifState.isMuted;
   lightboxVideo.hidden = false;
   lightboxVideo.currentTime = Math.max(0, startTime || 0);
   if (autoplay) {
      lightboxVideo.play().catch(() => {});
   }
}

function initializeDownloader() {
   const linksInput = document.getElementById('downloader-links');
   const favoritesSelect = document.getElementById('downloader-favorites');
   const folderInput = document.getElementById('downloader-folder');
   const addFavoriteButton = document.getElementById('downloader-add-favorite');
   const removeFavoriteButton = document.getElementById('downloader-remove-favorite');
   const loadFavoriteButton = document.getElementById('downloader-load-favorite');
   const copyCommandsButton = document.getElementById('downloader-copy-commands');
   const exportBatButton = document.getElementById('downloader-export-bat');
   const openLinksButton = document.getElementById('downloader-open-links');
   const clearLinksButton = document.getElementById('downloader-clear-links');

   if (!linksInput || !favoritesSelect || !folderInput || !addFavoriteButton || !removeFavoriteButton || !loadFavoriteButton || !copyCommandsButton || !exportBatButton || !openLinksButton || !clearLinksButton) {
      return;
   }

   const savedFavorites = JSON.parse(localStorage.getItem('thehub_downloader_favorites') || 'null');
   const savedFolder = localStorage.getItem('thehub_downloader_folder');
   const favorites = Array.isArray(savedFavorites) && savedFavorites.length ? savedFavorites : [...downloaderDefaults.favorites];

   folderInput.value = savedFolder || downloaderDefaults.folder;
   renderDownloaderFavorites(favorites);
   updateDownloaderStats();

   linksInput.addEventListener('input', updateDownloaderStats);
   folderInput.addEventListener('input', () => {
      localStorage.setItem('thehub_downloader_folder', folderInput.value.trim());
   });

   addFavoriteButton.addEventListener('click', () => addDownloaderFavorite(favorites));
   removeFavoriteButton.addEventListener('click', () => removeDownloaderFavorite(favorites));
   loadFavoriteButton.addEventListener('click', loadDownloaderFavorite);
   copyCommandsButton.addEventListener('click', copyDownloaderCommands);
   exportBatButton.addEventListener('click', exportDownloaderBat);
   openLinksButton.addEventListener('click', openDownloaderLinks);
   clearLinksButton.addEventListener('click', () => {
      linksInput.value = '';
      updateDownloaderStats();
      setDownloaderStatus('Queue cleared.', false);
   });
}

function getDownloaderLinks() {
   const linksInput = document.getElementById('downloader-links');
   if (!linksInput) return [];

   return linksInput.value
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
}

function classifyDownloaderLink(url) {
   const value = url.trim().toLowerCase();
   if (value.includes('redgifs.com/users/')) return 'profile';
   if (value.includes('redgifs.com/watch/')) return 'redgif';
   if (value) return 'video';
   return 'unknown';
}

function updateDownloaderStats() {
   const links = getDownloaderLinks();
   const counts = { profile: 0, redgif: 0, video: 0, unknown: 0 };

   links.forEach(link => {
      const type = classifyDownloaderLink(link);
      counts[type] = (counts[type] || 0) + 1;
   });

   setText('downloader-queue-count', `${links.length} link${links.length === 1 ? '' : 's'} queued`);
   setText('downloader-profile-count', String(counts.profile));
   setText('downloader-redgif-count', String(counts.redgif));
   setText('downloader-video-count', String(counts.video));
   setText('downloader-unknown-count', String(counts.unknown));
}

function renderDownloaderFavorites(favorites) {
   const favoritesSelect = document.getElementById('downloader-favorites');
   if (!favoritesSelect) return;

   favoritesSelect.innerHTML = favorites.map(url => {
      const label = escapeHtml(url.split('/').pop() || url);
      return `<option value="${escapeHtml(url)}">${label}</option>`;
   }).join('');

   localStorage.setItem('thehub_downloader_favorites', JSON.stringify(favorites));
}

function addDownloaderFavorite(favorites) {
   const links = getDownloaderLinks();
   const first = links[0];

   if (!first) {
      setDownloaderStatus('Paste a Redgifs profile link first.', true);
      return;
   }

   if (classifyDownloaderLink(first) !== 'profile') {
      setDownloaderStatus('Only Redgifs profile links can be saved as favorites.', true);
      return;
   }

   if (favorites.includes(first)) {
      setDownloaderStatus('That profile is already in favorites.', true);
      return;
   }

   favorites.push(first);
   renderDownloaderFavorites(favorites);
   setDownloaderStatus(`Added favorite: ${first}`, false);
}

function removeDownloaderFavorite(favorites) {
   const favoritesSelect = document.getElementById('downloader-favorites');
   if (!favoritesSelect || !favoritesSelect.value) {
      setDownloaderStatus('Select a favorite to remove.', true);
      return;
   }

   const nextFavorites = favorites.filter(url => url !== favoritesSelect.value);
   favorites.length = 0;
   favorites.push(...nextFavorites);
   renderDownloaderFavorites(favorites);
   setDownloaderStatus('Favorite removed.', false);
}

function loadDownloaderFavorite() {
   const favoritesSelect = document.getElementById('downloader-favorites');
   const linksInput = document.getElementById('downloader-links');
   if (!favoritesSelect || !linksInput || !favoritesSelect.value) {
      setDownloaderStatus('Select a favorite to load.', true);
      return;
   }

   linksInput.value = `${favoritesSelect.value}\n`;
   updateDownloaderStats();
   setDownloaderStatus('Favorite loaded into the queue.', false);
}

async function copyDownloaderCommands() {
   const commands = buildDownloaderCommands();
   if (!commands.length) {
      setDownloaderStatus('Paste at least one link before copying commands.', true);
      return;
   }

   try {
      await navigator.clipboard.writeText(commands.join('\n'));
      setDownloaderStatus(`Copied ${commands.length} command${commands.length === 1 ? '' : 's'} to the clipboard.`, false);
   } catch (error) {
      setDownloaderStatus('Clipboard copy failed in this browser context.', true);
   }
}

function exportDownloaderBat() {
   const commands = buildDownloaderCommands();
   if (!commands.length) {
      setDownloaderStatus('Paste at least one link before exporting a batch file.', true);
      return;
   }

   const contents = ['@echo off', 'setlocal enabledelayedexpansion', '', ...commands, '', 'echo.', 'echo Queue complete.', 'pause'].join('\r\n');
   const blob = new Blob([contents], { type: 'application/octet-stream' });
   downloadBlob(blob, 'the-hub-downloader.bat');
   setDownloaderStatus('Exported a Windows batch file for the current queue.', false);
}

function openDownloaderLinks() {
   const links = getDownloaderLinks();
   if (!links.length) {
      setDownloaderStatus('Paste at least one link before opening them.', true);
      return;
   }

   links.forEach(link => window.open(link, '_blank', 'noopener'));
   setDownloaderStatus(`Opened ${links.length} link${links.length === 1 ? '' : 's'} in new tabs.`, false);
}

function buildDownloaderCommands() {
   const folderInput = document.getElementById('downloader-folder');
   const outdir = folderInput?.value.trim() || downloaderDefaults.folder;
   const links = getDownloaderLinks();

   return links.map(url => {
      const type = classifyDownloaderLink(url);
      if (type === 'profile' || type === 'redgif') {
         return `"${downloaderToolPaths.galleryDl}" -o "base-directory=${outdir}" -o "directory=" -o "filename={id}.{extension}" -o "skip=true" "${url}"`;
      }
      return `"${downloaderToolPaths.ytDlp}" --no-overwrites -o "${outdir}/%(title).200s.%(ext)s" "${url}"`;
   });
}

function downloadBlob(blob, filename) {
   const url = URL.createObjectURL(blob);
   const anchor = document.createElement('a');
   anchor.href = url;
   anchor.download = filename;
   document.body.appendChild(anchor);
   anchor.click();
   anchor.remove();
   URL.revokeObjectURL(url);
}

function setDownloaderStatus(message, isWarning) {
   const status = document.getElementById('downloader-status');
   if (!status) return;

   status.textContent = message;
   status.classList.toggle('is-warning', Boolean(isWarning));
}

function initializeFlipwiseHub() {
   const refreshButton = document.getElementById('flipwise-refresh-btn');
   const autoRefresh = document.getElementById('flipwise-auto-refresh');
   const eventsClear = document.getElementById('flipwise-events-clear');
   const moverTabs = document.querySelectorAll('.flipwise-tab');

   if (!refreshButton || !autoRefresh || !moverTabs.length) {
      return;
   }

   moverTabs.forEach(tab => {
      tab.addEventListener('click', () => {
         flipwiseHubState.moversMode = tab.dataset.mode || 'gainers';
         moverTabs.forEach(item => item.classList.toggle('active', item === tab));
         renderFlipwiseMovers();
      });
   });

   refreshButton.addEventListener('click', () => {
      runFlipwiseHubRefresh();
   });

   autoRefresh.addEventListener('change', () => {
      if (autoRefresh.checked) {
         startFlipwiseHubAutoRefresh();
      } else {
         stopFlipwiseHubAutoRefresh();
      }
   });

   if (eventsClear) {
      eventsClear.addEventListener('click', () => {
         if (window.FlipwiseAlerts?.clearEvents) {
            window.FlipwiseAlerts.clearEvents();
         }
         renderFlipwiseEvents();
      });
   }

   updateFlipwiseRefreshLabels();
   runFlipwiseHubRefresh();

   if (autoRefresh.checked) {
      startFlipwiseHubAutoRefresh();
   }
}

function initializeFlipwiseWorkspace() {
   const buttons = document.querySelectorAll('.flipwise-workspace-btn');
   const frame = document.getElementById('flipwise-tool-frame');
   const currentTool = document.getElementById('flipwise-current-tool');
   const dashboardContent = document.getElementById('flipwise-dashboard-content');
   const frameShell = document.getElementById('flipwise-table-frame-shell');
   const nativeContent = document.getElementById('flipwise-native-tool-content');

   if (!buttons.length || !frame || !currentTool || !dashboardContent || !frameShell || !nativeContent) {
      return;
   }

   buttons.forEach(button => {
      button.addEventListener('click', () => {
         const nextPage = button.dataset.flipwisePage;
         const nextLabel = button.dataset.flipwiseLabel || button.textContent.trim();
         const nextMode = button.dataset.flipwiseMode || 'table';
         if (!nextPage) return;

         buttons.forEach(item => item.classList.toggle('active', item === button));
         currentTool.textContent = nextLabel;
         if (nextMode === 'dashboard') {
            dashboardContent.classList.remove('is-hidden');
            nativeContent.classList.add('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = '';
         } else if (nextMode === 'native-markets') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'markets';
            showFlipwiseNativeTool('markets');
            renderFlipwiseMarketsNative();
         } else if (nextMode === 'native-scanner') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'scanner';
            showFlipwiseNativeTool('scanner');
            renderFlipwiseScannerNative();
         } else if (nextMode === 'native-enchanting') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'enchanting';
            showFlipwiseNativeTool('enchanting');
            renderFlipwiseEnchanting();
         } else if (nextMode === 'native-outfit-sets') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'outfit-sets';
            showFlipwiseNativeTool('outfit-sets');
            renderFlipwiseOutfitSets();
         } else if (nextMode === 'native-tree-saplings') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'tree-saplings';
            showFlipwiseNativeTool('tree-saplings');
            renderFlipwiseTreeSaplings();
         } else if (nextMode === 'native-decanting') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'decanting';
            showFlipwiseNativeTool('decanting');
            renderFlipwiseDecanting();
         } else if (nextMode === 'native-gem-cutting') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'gem-cutting';
            showFlipwiseNativeTool('gem-cutting');
            renderFlipwiseGemCutting();
         } else if (nextMode === 'native-shops-to-ge') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'shops-to-ge';
            showFlipwiseNativeTool('shops-to-ge');
            renderFlipwiseShopsToGe();
         } else if (nextMode === 'native-money-makers') {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.remove('is-hidden');
            frameShell.classList.add('is-hidden');
            flipwiseHubState.activeNativeTool = 'money-makers';
            showFlipwiseNativeTool('money-makers');
            renderFlipwiseMoneyMakers();
         } else {
            dashboardContent.classList.add('is-hidden');
            nativeContent.classList.add('is-hidden');
            frameShell.classList.remove('is-hidden');
            flipwiseHubState.activeNativeTool = '';
            frame.src = nextPage;
         }
      });
   });
}

function initializeFlipwiseMarketsNative() {
   const searchInput = document.getElementById('fw-markets-search');
   const tabs = document.querySelectorAll('.flipwise-markets-tab');
   const headerRow = document.getElementById('fw-market-table-head-row');
   const tableBody = document.getElementById('fw-markets-table-body');
   const breakdownOverlay = document.getElementById('fw-breakdown-overlay');
   const breakdownClose = document.getElementById('fw-breakdown-close');

   if (!searchInput || !tabs.length || !headerRow || !tableBody) {
      return;
   }

   searchInput.addEventListener('input', () => {
      flipwiseHubState.marketsSearch = searchInput.value;
      renderFlipwiseMarketsNative();
   });

   tabs.forEach(tab => {
      tab.addEventListener('click', () => {
         const nextFilter = tab.dataset.filter || 'items';
         flipwiseHubState.marketsFilter = nextFilter;
         if (nextFilter === 'runes' || nextFilter === 'herblore') {
            flipwiseHubState.marketsSortColumn = 'profitLimit';
         } else {
            flipwiseHubState.marketsSortColumn = 'profit';
         }
         flipwiseHubState.marketsSortDir = 'desc';
         tabs.forEach(item => item.classList.toggle('active', item === tab));
         renderFlipwiseMarketsNative();
      });
   });

   headerRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;
      if (flipwiseHubState.marketsSortColumn === sortKey) {
         flipwiseHubState.marketsSortDir = flipwiseHubState.marketsSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.marketsSortColumn = sortKey;
         flipwiseHubState.marketsSortDir = 'desc';
      }
      renderFlipwiseMarketsNative();
   });

   tableBody.addEventListener('click', event => {
      const star = event.target.closest('.star-btn');
      if (!star) return;
      const itemName = star.dataset.itemName;
      if (!itemName) return;
      toggleFlipwiseFavorite(itemName);
      renderFlipwiseMarketsNative();
   });

   tableBody.addEventListener('contextmenu', event => {
      const row = event.target.closest('tr[data-item-name]');
      if (!row) return;

      const itemName = row.dataset.itemName;
      if (!itemName || !flipwiseHubState.lastData || !window.FlipwiseContextMenu) return;

      window.FlipwiseContextMenu.show(event, itemName, flipwiseHubState.marketsFilter, {
         idByName: flipwiseHubState.lastData.idByName || {},
         pinnedSet: getFlipwisePinned(),
         onTogglePin: name => {
            toggleFlipwisePin(name);
            renderFlipwiseMarketsNative();
         },
         onAddAlert: (name, side) => {
            const rowData = getFlipwiseDataByName(flipwiseHubState.lastData, name);
            if (!rowData || !window.FlipwiseAlerts?.setAlert) return;
            const timestamp = side === 'buy' ? rowData.lowTime : rowData.highTime;
            window.FlipwiseAlerts.setAlert(name, side, timestamp != null ? timestamp : 0);
            window.FlipwiseAlerts.appendEvent?.(`${name} ${side} alert set.`, 'alert-set');
            renderFlipwiseMarketsNative();
            renderFlipwiseEvents();
         },
         onClearAlert: (name, side) => {
            window.FlipwiseAlerts?.clearAlert?.(name, side);
            window.FlipwiseAlerts?.appendEvent?.(`${name} ${side} alert cleared.`, 'alert-clear');
            renderFlipwiseMarketsNative();
            renderFlipwiseEvents();
         },
         onBreakdown: name => {
            showFlipwiseMarketBreakdown(name);
         }
      });
   });

   if (breakdownOverlay && breakdownClose && !breakdownOverlay.dataset.bound) {
      const closeOverlay = () => {
         breakdownOverlay.style.display = 'none';
         breakdownOverlay.setAttribute('aria-hidden', 'true');
      };

      breakdownOverlay.dataset.bound = 'true';
      breakdownOverlay.addEventListener('click', event => {
         if (event.target === breakdownOverlay) {
            closeOverlay();
         }
      });
      breakdownClose.addEventListener('click', closeOverlay);
   }
}

function initializeFlipwiseScannerNative() {
   const searchInput = document.getElementById('fw-scanner-search');
   const headerRow = document.getElementById('fw-scanner-table-head-row');
   const tableBody = document.getElementById('fw-scanner-table-body');

   if (!searchInput || !headerRow || !tableBody) {
      return;
   }

   searchInput.addEventListener('input', () => {
      flipwiseHubState.scannerSearch = searchInput.value;
      renderFlipwiseScannerNative();
   });

   headerRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;

      if (flipwiseHubState.scannerSortColumn === sortKey) {
         flipwiseHubState.scannerSortDir = flipwiseHubState.scannerSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.scannerSortColumn = sortKey;
         flipwiseHubState.scannerSortDir = 'desc';
      }

      renderFlipwiseScannerNative();
   });

   tableBody.addEventListener('click', event => {
      const star = event.target.closest('.star-btn');
      if (!star) return;
      const itemName = star.dataset.itemName;
      if (!itemName) return;
      toggleFlipwiseFavorite(itemName);
      renderFlipwiseScannerNative();
   });
}

function initializeFlipwiseTreeSaplingsNative() {
   const searchInput = document.getElementById('fw-tree-saplings-search');
   const headRow = document.getElementById('fw-tree-saplings-head-row');

   if (!searchInput || !headRow) {
      return;
   }

   searchInput.addEventListener('input', () => {
      flipwiseHubState.treeSaplingsSearch = searchInput.value;
      renderFlipwiseTreeSaplings();
   });

   headRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;

      if (sortKey === flipwiseHubState.treeSaplingsSortColumn) {
         flipwiseHubState.treeSaplingsSortDir = flipwiseHubState.treeSaplingsSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.treeSaplingsSortColumn = sortKey;
         flipwiseHubState.treeSaplingsSortDir = sortKey === 'item' ? 'asc' : (sortKey === 'limitProfit' || sortKey === 'profitPer' ? 'desc' : 'asc');
      }

      renderFlipwiseTreeSaplings();
   });
}

function initializeFlipwiseDecantingNative() {
   const searchInput = document.getElementById('fw-decanting-search');
   const headRow = document.getElementById('fw-decanting-head-row');

   if (!searchInput || !headRow) {
      return;
   }

   searchInput.addEventListener('input', () => {
      flipwiseHubState.decantingSearch = searchInput.value;
      renderFlipwiseDecanting();
   });

   headRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;

      if (sortKey === flipwiseHubState.decantingSortColumn) {
         flipwiseHubState.decantingSortDir = flipwiseHubState.decantingSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.decantingSortColumn = sortKey;
         flipwiseHubState.decantingSortDir = sortKey === 'potion' ? 'asc' : (sortKey === 'approxProfit' || sortKey === 'theorizedLimit' ? 'desc' : 'asc');
      }

      renderFlipwiseDecanting();
   });
}

function initializeFlipwiseGemCuttingNative() {
   const headRow = document.getElementById('fw-gem-cutting-head-row');
   if (!headRow) {
      return;
   }

   headRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;

      if (sortKey === flipwiseHubState.gemCuttingSortColumn) {
         flipwiseHubState.gemCuttingSortDir = flipwiseHubState.gemCuttingSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.gemCuttingSortColumn = sortKey;
         flipwiseHubState.gemCuttingSortDir = sortKey === 'item' ? 'asc' : (sortKey === 'profit' || sortKey === 'limitProfit' ? 'desc' : 'asc');
      }

      renderFlipwiseGemCutting();
   });
}

function initializeFlipwiseShopsToGeNative() {
   const headRow = document.getElementById('fw-shops-to-ge-head-row');
   if (!headRow) {
      return;
   }

   headRow.addEventListener('click', event => {
      const th = event.target.closest('th[data-sort]');
      if (!th) return;
      const sortKey = th.dataset.sort;
      if (!sortKey) return;

      if (sortKey === flipwiseHubState.shopsToGeSortColumn) {
         flipwiseHubState.shopsToGeSortDir = flipwiseHubState.shopsToGeSortDir === 'asc' ? 'desc' : 'asc';
      } else {
         flipwiseHubState.shopsToGeSortColumn = sortKey;
         flipwiseHubState.shopsToGeSortDir = sortKey === 'shop' || sortKey === 'item' ? 'asc' : (sortKey === 'profitPer' || sortKey === 'profitLimit' ? 'desc' : 'asc');
      }

      renderFlipwiseShopsToGe();
   });
}

function runFlipwiseHubRefresh() {
   if (flipwiseHubState.isRefreshing) return;

   if (!window.FlipwiseAPI?.refresh) {
      renderFlipwiseHubUnavailable();
      return;
   }

   flipwiseHubState.isRefreshing = true;
   setFlipwiseRefreshingUi(true);

   window.FlipwiseAPI.refresh().then(data => {
      flipwiseHubState.lastData = data;
      persistFlipwiseRefreshStamp();
      updateFlipwiseRefreshLabels();
      checkFlipwiseTrendEvents(data);
      window.FlipwiseAlerts?.checkAlerts?.(data, data?.idByName);
      renderFlipwiseOpportunities(data);
      renderFlipwiseMovers();
      renderFlipwiseEvents();
      renderFlipwiseMoneyMakers();
      renderFlipwiseMarketsNative();
      renderFlipwiseScannerNative();
      renderFlipwiseEnchanting();
      renderFlipwiseOutfitSets();
      renderFlipwiseTreeSaplings();
      renderFlipwiseDecanting();
      renderFlipwiseGemCutting();
      renderFlipwiseShopsToGe();
   }).catch(() => {
      renderFlipwiseHubUnavailable();
   }).finally(() => {
      flipwiseHubState.isRefreshing = false;
      setFlipwiseRefreshingUi(false);
   });
}

function startFlipwiseHubAutoRefresh() {
   if (flipwiseHubState.autoRefreshTimer) return;
   flipwiseHubState.autoRefreshTimer = window.setInterval(runFlipwiseHubRefresh, 15000);
}

function stopFlipwiseHubAutoRefresh() {
   if (!flipwiseHubState.autoRefreshTimer) return;
   window.clearInterval(flipwiseHubState.autoRefreshTimer);
   flipwiseHubState.autoRefreshTimer = null;
}

function persistFlipwiseRefreshStamp() {
   const timestamp = Date.now();
   try {
      localStorage.setItem('flipwise-last-refresh-ts', String(timestamp));
      sessionStorage.setItem('flipwise-last-refresh-ts', String(timestamp));
   } catch (error) {
      // Ignore storage failures; labels will still update for the current page.
   }
}

function updateFlipwiseRefreshLabels() {
   const nowLabel = document.getElementById('flipwise-refresh-clock');
   const lastLabel = document.getElementById('flipwise-refresh-last');
   const rawStamp = sessionStorage.getItem('flipwise-last-refresh-ts') || localStorage.getItem('flipwise-last-refresh-ts');

   if (nowLabel) {
      const now = new Date();
      nowLabel.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
   }

   if (lastLabel) {
      if (flipwiseHubState.isRefreshing) {
         lastLabel.textContent = 'Refreshing live data...';
      } else if (!rawStamp) {
         lastLabel.textContent = 'Waiting for first sync';
      } else {
         const stamp = Number(rawStamp);
         const deltaSeconds = Math.max(0, Math.round((Date.now() - stamp) / 1000));
         lastLabel.textContent = deltaSeconds < 5 ? 'Just updated' : `${deltaSeconds}s ago`;
      }
   }
}

function renderFlipwiseHubUnavailable() {
   const moversList = document.getElementById('flipwise-movers-list');
   const opportunities = document.getElementById('flipwise-best-opportunity-list');
   if (moversList) moversList.innerHTML = '<div class="flipwise-empty">FlipWise market data could not be loaded.</div>';
   if (opportunities) opportunities.innerHTML = '<div class="flipwise-empty">No opportunity data is available right now.</div>';
   const moneyMakers = document.getElementById('flipwise-money-makers-grid');
   const marketsBody = document.getElementById('fw-markets-table-body');
   const scannerBody = document.getElementById('fw-scanner-table-body');
   const enchanting = document.getElementById('flipwise-enchanting-grid');
   const outfitSets = document.getElementById('flipwise-outfit-sets-grid');
   const treeSaplings = document.getElementById('fw-tree-saplings-body');
   const decanting = document.getElementById('fw-decanting-body');
   const gemCutting = document.getElementById('fw-gem-cutting-body');
   const shopsToGe = document.getElementById('fw-shops-to-ge-body');
   if (moneyMakers) moneyMakers.innerHTML = '<div class="flipwise-empty">Money maker tiles are not available right now.</div>';
   if (marketsBody) marketsBody.innerHTML = '<tr><td colspan="8" class="text-muted">Market data could not be loaded.</td></tr>';
   if (scannerBody) scannerBody.innerHTML = '<tr><td colspan="8" class="text-muted">Scanner data could not be loaded.</td></tr>';
   if (enchanting) enchanting.innerHTML = '<div class="flipwise-empty">Enchanting tiles are not available right now.</div>';
   if (outfitSets) outfitSets.innerHTML = '<div class="flipwise-empty">Outfit set tiles are not available right now.</div>';
   if (treeSaplings) treeSaplings.innerHTML = '<tr><td colspan="6" class="text-muted">Tree sapling data could not be loaded.</td></tr>';
   if (decanting) decanting.innerHTML = '<tr><td colspan="9" class="text-muted">Decanting data could not be loaded.</td></tr>';
   if (gemCutting) gemCutting.innerHTML = '<tr><td colspan="6" class="text-muted">Gem cutting data could not be loaded.</td></tr>';
   if (shopsToGe) shopsToGe.innerHTML = '<tr><td colspan="7" class="text-muted">Shops to GE data could not be loaded.</td></tr>';
}

function setFlipwiseRefreshingUi(isRefreshing) {
   const refreshButton = document.getElementById('flipwise-refresh-btn');
   const dashboard = document.querySelector('.flipwise-dashboard-panel');

   if (refreshButton) {
      refreshButton.disabled = isRefreshing;
      refreshButton.textContent = isRefreshing ? 'Refreshing...' : 'Refresh Now';
   }

   if (dashboard) {
      dashboard.classList.toggle('is-refreshing', Boolean(isRefreshing));
   }

   updateFlipwiseRefreshLabels();
}

function renderFlipwiseOpportunities(data) {
   const list = document.getElementById('flipwise-best-opportunity-list');
   if (!list) return;

   const items = buildFlipwiseBestOpportunities(data);
   setText('flipwise-opportunity-count', `${items.length} live entr${items.length === 1 ? 'y' : 'ies'}`);

   if (!items.length) {
      list.innerHTML = '<div class="flipwise-empty">No opportunity data is available right now.</div>';
      return;
   }

   list.innerHTML = items.map(item => {
      const valueClass = item.profit >= 0 ? 'flipwise-value-positive' : 'flipwise-value-negative';
      return `
         <button type="button" class="flipwise-opportunity-item" data-flipwise-nav-mode="${escapeHtml(item.mode || '')}" data-flipwise-nav-label="${escapeHtml(item.source || item.title || '')}" data-flipwise-nav-search="${escapeHtml(item.search || '')}" data-flipwise-nav-filter="${escapeHtml(item.filter || '')}">
            ${renderFlipwiseIcon(item.icon, item.title)}
            <div class="flipwise-item-main">
               <span class="flipwise-item-title">${escapeHtml(item.title)}</span>
               <span class="flipwise-item-meta">${escapeHtml(item.source)}</span>
            </div>
            <span class="flipwise-item-value ${valueClass}">${escapeHtml(formatFlipwiseProfit(item.profit, item.unit))}</span>
         </button>
      `;
   }).join('');

   list.querySelectorAll('[data-flipwise-nav-mode]').forEach(button => {
      button.addEventListener('click', () => {
         navigateFlipwiseDashboardItem({
            mode: button.dataset.flipwiseNavMode,
            label: button.dataset.flipwiseNavLabel,
            search: button.dataset.flipwiseNavSearch,
            filter: button.dataset.flipwiseNavFilter
         });
      });
   });
}

function renderFlipwiseMovers() {
   const list = document.getElementById('flipwise-movers-list');
   if (!list) return;

   const items = buildFlipwiseMoversList(flipwiseHubState.lastData, flipwiseHubState.moversMode);
   if (!items.length) {
      list.innerHTML = '<div class="flipwise-empty">Waiting for market data...</div>';
      return;
   }

   list.innerHTML = items.map((item, index) => {
      const valueClass = item.profit >= 0 ? 'flipwise-value-positive' : 'flipwise-value-negative';
      return `
         <button type="button" class="flipwise-mover-item" data-flipwise-nav-mode="native-markets" data-flipwise-nav-label="Markets" data-flipwise-nav-search="${escapeHtml(item.name || '')}" data-flipwise-nav-filter="${escapeHtml(item.filter || '')}">
            <div class="flipwise-mover-rank">${index + 1}</div>
            ${renderFlipwiseIcon(item.icon, item.name)}
            <div class="flipwise-item-main">
               <span class="flipwise-item-title">${escapeHtml(item.name)}</span>
               <span class="flipwise-item-meta">${flipwiseHubState.moversMode === 'gainers' ? 'Trending upward' : 'Trending downward'}</span>
            </div>
            <span class="flipwise-item-value ${valueClass}">${escapeHtml(formatFlipwiseProfit(item.profit, 'gp'))}</span>
         </button>
      `;
   }).join('');

   list.querySelectorAll('[data-flipwise-nav-mode]').forEach(button => {
      button.addEventListener('click', () => {
         navigateFlipwiseDashboardItem({
            mode: button.dataset.flipwiseNavMode,
            label: button.dataset.flipwiseNavLabel,
            search: button.dataset.flipwiseNavSearch,
            filter: button.dataset.flipwiseNavFilter
         });
      });
   });
}

function renderFlipwiseEvents() {
   const container = document.getElementById('flipwise-events-log');
   if (!container) return;

   const events = window.FlipwiseAlerts?.getEvents?.() || [];
   if (!events.length) {
      container.innerHTML = '<div class="flipwise-empty">Trend and alert events will appear here.</div>';
      return;
   }

   container.innerHTML = events.slice(0, 10).map(event => `
      <div class="flipwise-event-line">
         <span class="flipwise-event-tag">${escapeHtml((event.tag || 'event').replace(/-/g, ' '))}</span>
         <span class="flipwise-event-text">${escapeHtml(event.line || '')}</span>
      </div>
   `).join('');
}

function renderFlipwiseMoneyMakers() {
   const container = document.getElementById('flipwise-money-makers-grid');
   if (!container) return;

   const data = flipwiseHubState.lastData;
   const tiles = data?.moneyMakerTiles || [];
   const bestKey = data?.moneyMakerBestKey || null;

   if (!tiles.length) {
      container.innerHTML = '<div class="flipwise-empty">Money maker tiles are not available yet.</div>';
      return;
   }

   container.innerHTML = tiles.map(tile => {
      const isPrimary = bestKey && tile.key === bestKey && tile.profit > 0;
      const valueStr = tile.profit > 0 ? formatFlipwiseProfit(tile.profit, tile.unit) : (tile.profit < 0 ? formatFlipwiseProfit(tile.profit, tile.unit) : 'Inactive');
      const profitClass = tile.profit < 0 ? 'mm-tile-profit negative' : 'mm-tile-profit';
      return `
         <article class="mm-tile${isPrimary ? ' primary' : ''}">
            <div class="mm-tile-title">${escapeHtml(tile.title)}</div>
            ${buildFlipwiseMoneyMakerBreakdownHtml(tile)}
            <div class="${profitClass}">${escapeHtml(valueStr)}</div>
         </article>
      `;
   }).join('');
}

function renderFlipwiseMarketsNative() {
   const data = flipwiseHubState.lastData;
   const body = document.getElementById('fw-markets-table-body');
   const headRow = document.getElementById('fw-market-table-head-row');
   if (!body || !headRow) return;

   renderFlipwiseMarketCards(data);
   renderFlipwiseMarketHeader();

   const dataset = getFlipwiseMarketsDataset(data, flipwiseHubState.marketsFilter);
   let rows = Object.entries(dataset || {}).map(([name, d]) => ({ name, d }));
   const query = flipwiseHubState.marketsSearch.trim().toLowerCase();
   if (query) {
      rows = rows.filter(row => row.name.toLowerCase().includes(query));
   }

   const pinned = getFlipwisePinned();
   const mult = flipwiseHubState.marketsSortDir === 'asc' ? -1 : 1;
   const key = flipwiseHubState.marketsSortColumn;
   rows.sort((a, b) => {
      const pa = pinned.includes(a.name) ? 0 : 1;
      const pb = pinned.includes(b.name) ? 0 : 1;
      if (pa !== pb) return pa - pb;
      if (key === 'item') {
         return mult * a.name.localeCompare(b.name);
      }
      let va = a.d[key];
      let vb = b.d[key];
      if (['profit', 'low', 'high', 'roi', 'profitPer', 'profitLimit'].includes(key)) {
         va = va != null ? Number(va) : -Infinity;
         vb = vb != null ? Number(vb) : -Infinity;
         return mult * (vb - va);
      }
      if (key === 'highTime' || key === 'lowTime') {
         va = va != null ? va : 0;
         vb = vb != null ? vb : 0;
         return mult * (vb - va);
      }
      return 0;
   });

   const isVolumeTable = flipwiseHubState.marketsFilter === 'runes' || flipwiseHubState.marketsFilter === 'herblore';
   const colCount = isVolumeTable ? 6 : 8;
   if (!rows.length) {
      const message = !dataset ? 'Items will load here.' : query ? 'No items match your search.' : 'No items for this filter.';
      body.innerHTML = `<tr><td colspan="${colCount}" class="text-muted">${message}</td></tr>`;
      return;
   }

   body.innerHTML = rows.map(row => renderFlipwiseMarketRow(row, isVolumeTable)).join('');
   body.querySelectorAll('.star-btn').forEach(button => {
      button.innerHTML = button.classList.contains('star-btn--on') ? '&#9733;' : '&#9734;';
      if (!button.hasAttribute('aria-label')) {
         button.setAttribute('aria-label', 'Favorite');
      }
      if (!button.hasAttribute('title')) {
         button.setAttribute('title', button.classList.contains('star-btn--on') ? 'Unfavorite' : 'Favorite');
      }
   });
}

function renderFlipwiseMarketCards(data) {
   const cards = [
      { name: 'Scythe of Vitur', profit: 'fw-market-profit-scythe', buy: 'fw-market-buy-scythe', sell: 'fw-market-sell-scythe' },
      { name: 'Twisted Bow', profit: 'fw-market-profit-tbow', buy: 'fw-market-buy-tbow', sell: 'fw-market-sell-tbow' },
      { name: "Tumeken's Shadow", profit: 'fw-market-profit-shadow', buy: 'fw-market-buy-shadow', sell: 'fw-market-sell-shadow' },
      { name: 'Torva armour set', profit: 'fw-market-profit-torva', buy: 'fw-market-buy-torva', sell: 'fw-market-sell-torva' }
   ];
   const itemData = data?.itemData || {};

   cards.forEach(card => {
      const d = itemData[card.name];
      const profitEl = document.getElementById(card.profit);
      const buyEl = document.getElementById(card.buy);
      const sellEl = document.getElementById(card.sell);
      if (!profitEl || !buyEl || !sellEl) return;
      if (!d) {
         profitEl.textContent = '--';
         profitEl.className = 'flipwise-market-stat-value';
         buyEl.textContent = 'Buy: --';
         sellEl.textContent = 'Sell: --';
         return;
      }
      profitEl.textContent = formatFlipwiseSignedGp(d.profit);
      profitEl.className = `flipwise-market-stat-value ${d.profit > 0 ? 'positive' : d.profit < 0 ? 'negative' : ''}`.trim();
      buyEl.textContent = `Buy: ${formatFlipwiseNumber(d.low)}`;
      sellEl.textContent = `Sell: ${formatFlipwiseNumber(d.high)}`;
   });
}

function getFlipwiseMarketsDataset(data, filter) {
   if (!data) return null;
   if (filter === 'items') return data.itemData || {};
   if (filter === 'runes') return data.runesData || {};
   if (filter === 'herblore') return data.herbloreData || {};
   if (filter === 'third_age') return data.thirdAgeData || {};
   return data.itemData || {};
}

function renderFlipwiseMarketHeader() {
   const headRow = document.getElementById('fw-market-table-head-row');
   if (!headRow) return;
   const isVolumeTable = flipwiseHubState.marketsFilter === 'runes' || flipwiseHubState.marketsFilter === 'herblore';
   if (isVolumeTable) {
      headRow.innerHTML = `
         <th class="market-table__th-item" data-sort="item">Item</th>
         <th class="market-table__th-num text-right" data-sort="low">Buy</th>
         <th class="market-table__th-num text-right" data-sort="high">Sell</th>
         <th class="market-table__th-num text-right" data-sort="profitPer">Profit Per</th>
         <th class="market-table__th-num text-right" data-sort="profitLimit">Profit Limit</th>
         <th class="market-table__th-star"></th>
      `;
   } else {
      headRow.innerHTML = `
         <th class="market-table__th-item" data-sort="item">Item</th>
         <th class="market-table__th-num text-right" data-sort="low">Buy</th>
         <th class="market-table__th-num text-right" data-sort="high">Sell</th>
         <th class="market-table__th-num text-right" data-sort="profit">Profit</th>
         <th class="market-table__th-num text-right" data-sort="roi">ROI %</th>
         <th class="market-table__th-num text-right" data-sort="lowTime">Buy time</th>
         <th class="market-table__th-num text-right" data-sort="highTime">Sell time</th>
         <th class="market-table__th-star"></th>
      `;
   }

   headRow.querySelectorAll('th[data-sort]').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === flipwiseHubState.marketsSortColumn) {
         th.classList.add(flipwiseHubState.marketsSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
   });
}

function renderFlipwiseMarketRow(row, isVolumeTable) {
   const d = row.d || {};
   const low = d.low != null ? formatFlipwiseNumber(d.low) : '--';
   const high = d.high != null ? formatFlipwiseNumber(d.high) : '--';
   const favorite = isFlipwiseFavorite(row.name);

   if (isVolumeTable) {
      const perClass = d.profitPer > 0 ? 'positive' : d.profitPer < 0 ? 'negative' : '';
      const limitClass = d.profitLimit > 0 ? 'positive' : d.profitLimit < 0 ? 'negative' : '';
      return `
         <tr data-item-name="${escapeHtml(row.name)}">
            <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon(d, row.name)}</span><span class="coin-name">${escapeHtml(row.name)}</span></div></td>
            <td class="market-table__td-num">${low}</td>
            <td class="market-table__td-num">${high}</td>
            <td class="market-table__td-num change-cell ${perClass}">${escapeHtml(formatFlipwiseSignedGp(d.profitPer))}</td>
            <td class="market-table__td-num change-cell ${limitClass}">${escapeHtml(formatFlipwiseSignedGp(d.profitLimit))}</td>
            <td class="market-table__td-star"><button type="button" class="star-btn${favorite ? ' star-btn--on' : ''}" data-item-name="${escapeHtml(row.name)}">${favorite ? 'â˜…' : 'â˜†'}</button></td>
         </tr>
      `;
   }

   const profitClass = d.profit > 0 ? 'positive' : d.profit < 0 ? 'negative' : '';
   const roi = d.roi != null ? `${Number(d.roi).toFixed(1)}%` : '--';
   const buyAlert = window.FlipwiseAlerts?.hasAlert?.(row.name, 'buy');
   const sellAlert = window.FlipwiseAlerts?.hasAlert?.(row.name, 'sell');
   return `
      <tr data-item-name="${escapeHtml(row.name)}">
         <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon(d, row.name)}</span><span class="coin-name">${escapeHtml(row.name)}</span></div></td>
         <td class="market-table__td-num">${low}</td>
         <td class="market-table__td-num">${high}</td>
         <td class="market-table__td-num change-cell ${profitClass}">${escapeHtml(formatFlipwiseSignedGp(d.profit))}</td>
         <td class="market-table__td-num">${escapeHtml(roi)}</td>
         <td class="market-table__td-num${buyAlert ? ' market-table__td-alert-active' : ''}"${buyAlert ? ' title="Buy Alert Set"' : ''}>${escapeHtml(formatFlipwiseTimeAgo(d.lowTime))}</td>
         <td class="market-table__td-num${sellAlert ? ' market-table__td-alert-active' : ''}"${sellAlert ? ' title="Sell Alert Set"' : ''}>${escapeHtml(formatFlipwiseTimeAgo(d.highTime))}</td>
         <td class="market-table__td-star"><button type="button" class="star-btn${favorite ? ' star-btn--on' : ''}" data-item-name="${escapeHtml(row.name)}">${favorite ? 'â˜…' : 'â˜†'}</button></td>
      </tr>
   `;
}

function renderFlipwiseMarketIcon(d, fallbackName) {
   if (d?.icon) {
      const filename = String(d.icon).replace(/ /g, '_');
      const url = `https://oldschool.runescape.wiki/images/${encodeURIComponent(filename)}`;
      return `<img class="item-icon" src="${escapeHtml(url)}" alt="" loading="lazy" referrerpolicy="no-referrer" data-fallback="${escapeHtml((fallbackName || '?').charAt(0).toUpperCase())}" onerror="var f=this.getAttribute('data-fallback')||'?'; var s=document.createElement('span'); s.className='item-icon-fallback'; s.textContent=f; this.parentNode.replaceChild(s,this);">`;
   }
   return `<span class="item-icon-fallback">${escapeHtml((fallbackName || '?').charAt(0).toUpperCase())}</span>`;
}

function renderFlipwiseScannerNative() {
   const body = document.getElementById('fw-scanner-table-body');
   const headRow = document.getElementById('fw-scanner-table-head-row');
   if (!body || !headRow) return;

   headRow.querySelectorAll('th[data-sort]').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === flipwiseHubState.scannerSortColumn) {
         th.classList.add(flipwiseHubState.scannerSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
   });

   const dataset = flipwiseHubState.lastData?.scannerData || {};
   let rows = Object.entries(dataset).map(([name, d]) => ({ name, d }));
   const query = flipwiseHubState.scannerSearch.trim().toLowerCase();
   if (query) {
      rows = rows.filter(row => row.name.toLowerCase().includes(query));
   }

   const key = flipwiseHubState.scannerSortColumn;
   const mult = flipwiseHubState.scannerSortDir === 'asc' ? -1 : 1;
   rows.sort((a, b) => {
      if (key === 'item') {
         return mult * a.name.localeCompare(b.name);
      }
      let va = a.d[key];
      let vb = b.d[key];
      if (['profit', 'low', 'high', 'roi'].includes(key)) {
         va = va != null ? Number(va) : -Infinity;
         vb = vb != null ? Number(vb) : -Infinity;
         return mult * (vb - va);
      }
      if (key === 'highTime' || key === 'lowTime') {
         va = va != null ? va : 0;
         vb = vb != null ? vb : 0;
         return mult * (vb - va);
      }
      return 0;
   });

   if (!rows.length) {
      const message = Object.keys(dataset).length ? 'No items match your search.' : 'No scanner results. Try refreshing.';
      body.innerHTML = `<tr><td colspan="8" class="text-muted">${message}</td></tr>`;
      return;
   }

   body.innerHTML = rows.map(row => renderFlipwiseScannerRow(row)).join('');
   body.querySelectorAll('.star-btn').forEach(button => {
      button.innerHTML = button.classList.contains('star-btn--on') ? '&#9733;' : '&#9734;';
      button.setAttribute('aria-label', 'Favorite');
      button.setAttribute('title', button.classList.contains('star-btn--on') ? 'Unfavorite' : 'Favorite');
   });
}

function renderFlipwiseScannerRow(row) {
   const d = row.d || {};
   const low = d.low != null ? formatFlipwiseNumber(d.low) : '--';
   const high = d.high != null ? formatFlipwiseNumber(d.high) : '--';
   const profit = d.profit != null ? d.profit : 0;
   const profitClass = profit > 0 ? 'positive' : profit < 0 ? 'negative' : '';
   const roi = d.roi != null ? `${Number(d.roi).toFixed(1)}%` : '--';
   const favorite = isFlipwiseFavorite(row.name);

   return `
      <tr data-item-name="${escapeHtml(row.name)}">
         <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon(d, row.name)}</span><span class="coin-name">${escapeHtml(row.name)}</span></div></td>
         <td class="market-table__td-num">${low}</td>
         <td class="market-table__td-num">${high}</td>
         <td class="market-table__td-num change-cell ${profitClass}">${escapeHtml(formatFlipwiseSignedGp(d.profit))}</td>
         <td class="market-table__td-num">${escapeHtml(roi)}</td>
         <td class="market-table__td-num">${escapeHtml(formatFlipwiseTimeAgo(d.lowTime))}</td>
         <td class="market-table__td-num">${escapeHtml(formatFlipwiseTimeAgo(d.highTime))}</td>
         <td class="market-table__td-star"><button type="button" class="star-btn${favorite ? ' star-btn--on' : ''}" data-item-name="${escapeHtml(row.name)}"></button></td>
      </tr>
   `;
}

function renderFlipwiseEnchanting() {
   const container = document.getElementById('flipwise-enchanting-grid');
   if (!container) return;

   const tiles = flipwiseHubState.lastData?.enchantingTiles || [];
   const bestKey = flipwiseHubState.lastData?.enchantingBestKey || null;

   if (!tiles.length) {
      container.innerHTML = '<div class="flipwise-empty">Enchanting tiles are not available yet.</div>';
      return;
   }

   container.innerHTML = tiles.map(tile => {
      const isPrimary = bestKey && tile.key === bestKey && tile.profit > 0;
      const valueStr = tile.profit > 0
         ? formatFlipwiseProfit(tile.profit, tile.unit)
         : (tile.profit < 0 ? formatFlipwiseProfit(tile.profit, tile.unit) : 'Inactive');
      const profitClass = tile.profit < 0 ? 'mm-tile-profit negative' : 'mm-tile-profit';
      return `
         <article class="mm-tile${isPrimary ? ' primary' : ''}">
            <div class="mm-tile-title">${escapeHtml(tile.title)}</div>
            ${buildFlipwiseEnchantingBreakdownHtml(tile)}
            <div class="${profitClass}">${escapeHtml(valueStr)}</div>
         </article>
      `;
   }).join('');
}

function renderFlipwiseOutfitSets() {
   const container = document.getElementById('flipwise-outfit-sets-grid');
   if (!container) return;

   const tiles = flipwiseHubState.lastData?.outfitSetTiles || [];
   const bestKey = flipwiseHubState.lastData?.outfitSetBestKey || null;

   if (!tiles.length) {
      container.innerHTML = '<div class="flipwise-empty">Outfit set tiles are not available yet.</div>';
      return;
   }

   container.innerHTML = tiles.map(tile => {
      const isPrimary = bestKey && tile.key === bestKey && tile.profit > 0;
      const valueStr = tile.profit > 0
         ? formatFlipwiseProfit(tile.profit, tile.unit)
         : (tile.profit < 0 ? formatFlipwiseProfit(tile.profit, tile.unit) : 'Inactive');
      const profitClass = tile.profit < 0 ? 'mm-tile-profit negative' : 'mm-tile-profit';
      return `
         <article class="mm-tile${isPrimary ? ' primary' : ''}">
            <div class="mm-tile-title">${escapeHtml(tile.title)}</div>
            ${buildFlipwiseOutfitSetBreakdownHtml(tile)}
            <div class="${profitClass}">${escapeHtml(valueStr)}</div>
         </article>
      `;
   }).join('');
}

function buildFlipwiseOutfitSetBreakdownHtml(tile) {
   const breakdown = tile?.breakdown;
   if (!breakdown) return '';

   const html = [];
   const iconImg = icon => {
      if (!icon) return '';
      const filename = String(icon).replace(/ /g, '_');
      const url = `https://oldschool.runescape.wiki/images/${encodeURIComponent(filename)}`;
      return `<img class="mm-item-icon" src="${escapeHtml(url)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
   };
   const profitRowClass = value => value != null && value < 0 ? ' mm-row mm-negative' : value != null && value >= 0 ? ' mm-row mm-winner' : ' mm-row';

   if (breakdown.set_to_items) {
      const sti = breakdown.set_to_items;
      html.push('<div class="mm-breakdown-section-label">Items to Set</div>');
      if (Array.isArray(breakdown.materials)) {
         breakdown.materials.forEach(material => {
            const qty = material.qty > 1 ? ` x ${material.qty}` : '';
            html.push(`
               <div class="mm-row">
                  <span class="mm-row-left">${iconImg(material.icon)}<span class="mm-label">${escapeHtml(material.name)}${escapeHtml(qty)}:</span></span>
                  <span class="mm-val">${formatFlipwiseNumber(material.cost)} gp</span>
               </div>
            `);
         });
      }
      html.push('<div class="mm-group-divider"></div>');
      html.push(`
         <div class="mm-row">
            <span class="mm-row-left">${iconImg(breakdown.product_icon)}<span class="mm-label">${escapeHtml(breakdown.product_name || '')}:</span></span>
            <span class="mm-val">${formatFlipwiseNumber(breakdown.product_value)} gp</span>
         </div>
      `);
      html.push(`
         <div class="${profitRowClass(breakdown.profit_after_tax)}">
            <span class="mm-label">Profit:</span>
            <span class="mm-val">${breakdown.profit_after_tax != null ? formatFlipwiseSignedGp(breakdown.profit_after_tax) : '--'}</span>
         </div>
      `);
      html.push('<div class="mm-divider"></div>');
      html.push('<div class="mm-breakdown-section-label">Set to Items</div>');
      html.push(`
         <div class="mm-row">
            <span class="mm-row-left">${iconImg(sti.set_icon)}<span class="mm-label">${escapeHtml(sti.set_name || '')}:</span></span>
            <span class="mm-val">${formatFlipwiseNumber(sti.set_buy)} gp</span>
         </div>
      `);
      html.push('<div class="mm-group-divider"></div>');
      if (Array.isArray(sti.pieces)) {
         sti.pieces.forEach(piece => {
            const qty = piece.qty > 1 ? ` x ${piece.qty}` : '';
            html.push(`
               <div class="mm-row">
                  <span class="mm-row-left">${iconImg(piece.icon)}<span class="mm-label">${escapeHtml(piece.name)}${escapeHtml(qty)}:</span></span>
                  <span class="mm-val">${formatFlipwiseNumber(piece.sell_after_tax)} gp</span>
               </div>
            `);
         });
      }
      html.push(`
         <div class="${profitRowClass(sti.profit)}">
            <span class="mm-label">Profit:</span>
            <span class="mm-val">${sti.profit != null ? formatFlipwiseSignedGp(sti.profit) : '--'}</span>
         </div>
      `);
   } else if (Array.isArray(breakdown.materials) && breakdown.materials.length) {
      breakdown.materials.forEach(material => {
         const qty = material.qty > 1 ? ` x ${material.qty}` : '';
         html.push(`
            <div class="mm-row">
               <span class="mm-row-left">${iconImg(material.icon)}<span class="mm-label">${escapeHtml(material.name)}${escapeHtml(qty)}:</span></span>
               <span class="mm-val">${formatFlipwiseNumber(material.cost)} gp</span>
            </div>
         `);
      });
      html.push('<div class="mm-divider"></div>');
      html.push(`<div class="mm-row"><span class="mm-label"><strong>Total cost:</strong></span><span class="mm-val">${formatFlipwiseNumber(breakdown.total_cost)} gp</span></div>`);
      html.push(`<div class="mm-row"><span class="mm-row-left">${iconImg(breakdown.product_icon)}<span class="mm-label"><strong>${escapeHtml(breakdown.product_name || '')}:</strong></span></span><span class="mm-val">${formatFlipwiseNumber(breakdown.product_value)} gp</span></div>`);
      html.push(`<div class="${breakdown.profit_before_tax != null && breakdown.profit_before_tax < 0 ? 'mm-row mm-negative' : 'mm-row'}"><span class="mm-label"><strong>Profit:</strong></span><span class="mm-val">${breakdown.profit_before_tax != null ? formatFlipwiseSignedGp(breakdown.profit_before_tax) : '--'}</span></div>`);
      html.push(`<div class="mm-row"><span class="mm-label"><strong>Tax:</strong></span><span class="mm-val">${breakdown.tax != null ? `${formatFlipwiseNumber(breakdown.tax)} gp` : '--'}</span></div>`);
      html.push(`<div class="${breakdown.profit_after_tax != null && breakdown.profit_after_tax < 0 ? 'mm-row mm-negative' : 'mm-row'}"><span class="mm-label"><strong>Profit after GE Tax:</strong></span><span class="mm-val">${breakdown.profit_after_tax != null ? formatFlipwiseSignedGp(breakdown.profit_after_tax) : '--'}</span></div>`);
   } else if (Array.isArray(breakdown.rows) && breakdown.rows.length) {
      breakdown.rows.forEach(row => {
         html.push(`
            <div class="mm-row${row.winner ? ' mm-winner' : ''}${row.profit != null && row.profit < 0 ? ' mm-negative' : ''}">
               <span class="mm-label">${escapeHtml(row.label || '')}</span>
               <span class="mm-val">${escapeHtml(String(row.value ?? '--'))}</span>
            </div>
         `);
      });
   }

   return html.length ? `<div class="mm-tile-breakdown">${html.join('')}</div>` : '';
}

function renderFlipwiseTreeSaplings() {
   const body = document.getElementById('fw-tree-saplings-body');
   if (!body) return;

   const F = window.Flipwise;
   const items = (F?.TREE_SAPLING_ITEMS || []).slice();
   const data = flipwiseHubState.lastData?.treeSaplingsData || {};
   const query = flipwiseHubState.treeSaplingsSearch.trim().toLowerCase();
   let filtered = query ? items.filter(item => (item.name || '').toLowerCase().includes(query)) : items;

   const sortKey = flipwiseHubState.treeSaplingsSortColumn;
   const sortDir = flipwiseHubState.treeSaplingsSortDir;
   filtered.sort((a, b) => {
      if (sortKey === 'item') {
         const cmp = a.name.localeCompare(b.name);
         return sortDir === 'asc' ? cmp : -cmp;
      }
      const aValue = data[a.name] && data[a.name][sortKey] != null ? data[a.name][sortKey] : ((sortKey === 'limitProfit' || sortKey === 'profitPer') ? -Infinity : 0);
      const bValue = data[b.name] && data[b.name][sortKey] != null ? data[b.name][sortKey] : ((sortKey === 'limitProfit' || sortKey === 'profitPer') ? -Infinity : 0);
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
   });

   const headRow = document.getElementById('fw-tree-saplings-head-row');
   if (headRow) {
      headRow.querySelectorAll('th[data-sort]').forEach(th => {
         th.classList.remove('sort-asc', 'sort-desc');
         if (th.dataset.sort === sortKey) {
            th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
         }
      });
   }

   if (!filtered.length) {
      body.innerHTML = `<tr><td colspan="6" class="text-muted">${query ? 'No saplings match your search.' : 'No data.'}</td></tr>`;
      return;
   }

   body.innerHTML = filtered.map(item => {
      const row = data[item.name] || {};
      const profitClass = row.profitPer != null && row.profitPer < 0 ? ' negative' : row.profitPer != null && row.profitPer > 0 ? ' positive' : '';
      const limitProfitClass = row.limitProfit != null && row.limitProfit < 0 ? ' negative' : row.limitProfit != null && row.limitProfit > 0 ? ' positive' : '';
      return `
         <tr>
            <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon({ icon: row.icon }, item.name)}</span><span class="coin-name">${escapeHtml(item.name)}</span></div></td>
            <td class="market-table__td-num">${escapeHtml(row.seedCost != null ? `${formatFlipwiseNumber(row.seedCost)} gp` : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.saplingSell != null ? `${formatFlipwiseNumber(row.saplingSell)} gp` : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.profitPer != null ? formatFlipwiseSignedGp(row.profitPer) : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.limit != null ? formatFlipwiseNumber(row.limit) : '--')}</td>
            <td class="market-table__td-num change-cell${limitProfitClass}">${escapeHtml(row.limitProfit != null ? formatFlipwiseSignedGp(row.limitProfit) : '--')}</td>
         </tr>
      `;
   }).join('');
}

function renderFlipwiseDecanting() {
   const body = document.getElementById('fw-decanting-body');
   if (!body) return;

   const items = (window.Flipwise?.DECANTING_ITEMS || []).slice();
   const data = flipwiseHubState.lastData?.decantingData || {};
   const query = flipwiseHubState.decantingSearch.trim().toLowerCase();
   let filtered = query ? items.filter(item => (item.name || '').toLowerCase().includes(query)) : items;

   const sortKey = flipwiseHubState.decantingSortColumn;
   const sortDir = flipwiseHubState.decantingSortDir;
   filtered.sort((a, b) => {
      if (sortKey === 'potion') {
         const cmp = (a.name || '').localeCompare(b.name || '');
         return sortDir === 'asc' ? cmp : -cmp;
      }
      const aValue = data[a.name] && data[a.name][sortKey] != null ? data[a.name][sortKey] : ((sortKey === 'approxProfit' || sortKey === 'theorizedLimit') ? -Infinity : 0);
      const bValue = data[b.name] && data[b.name][sortKey] != null ? data[b.name][sortKey] : ((sortKey === 'approxProfit' || sortKey === 'theorizedLimit') ? -Infinity : 0);
      if (typeof aValue === 'number' && typeof bValue === 'number') {
         return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
   });

   const headRow = document.getElementById('fw-decanting-head-row');
   if (headRow) {
      headRow.querySelectorAll('th[data-sort]').forEach(th => {
         th.classList.remove('sort-asc', 'sort-desc');
         if (th.dataset.sort === sortKey) {
            th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
         }
      });
   }

   if (!filtered.length) {
      body.innerHTML = `<tr><td colspan="9" class="text-muted">${query ? 'No potions match your search.' : 'No data.'}</td></tr>`;
      return;
   }

   const formatCost = (value, uncertain) => {
      if (value == null) return '--';
      return `${formatFlipwiseNumber(value)} gp${uncertain ? ' ?' : ''}`;
   };

   body.innerHTML = filtered.map(item => {
      const row = data[item.name] || {};
      const profitClass = row.approxProfit != null && row.approxProfit < 0 ? ' negative' : row.approxProfit != null && row.approxProfit > 0 ? ' positive' : '';
      const limitClass = row.theorizedLimit != null && row.theorizedLimit < 0 ? ' negative' : row.theorizedLimit != null && row.theorizedLimit > 0 ? ' positive' : '';
      return `
         <tr>
            <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon({ icon: row.icon }, item.name)}</span><span class="coin-name">${escapeHtml(item.name)}</span></div></td>
            <td class="market-table__td-num">${escapeHtml(formatCost(row.dose1Cost, row.dose1Uncertain))}</td>
            <td class="market-table__td-num">${escapeHtml(formatCost(row.dose2Cost, row.dose2Uncertain))}</td>
            <td class="market-table__td-num">${escapeHtml(formatCost(row.dose3Cost, row.dose3Uncertain))}</td>
            <td class="market-table__td-num">${escapeHtml(row.cheapestDose != null ? String(row.cheapestDose) : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.cheapestCost != null ? `${formatFlipwiseNumber(row.cheapestCost)} gp` : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.approxSellPrice != null ? `${formatFlipwiseNumber(row.approxSellPrice)} gp` : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.approxProfit != null ? formatFlipwiseSignedGp(row.approxProfit) : '--')}</td>
            <td class="market-table__td-num change-cell${limitClass}">${escapeHtml(row.theorizedLimit != null ? formatFlipwiseSignedGp(row.theorizedLimit) : '--')}</td>
         </tr>
      `;
   }).join('');
}

function renderFlipwiseGemCutting() {
   const body = document.getElementById('fw-gem-cutting-body');
   if (!body) return;

   const dataset = flipwiseHubState.lastData?.gemCuttingData || {};
   const keys = Object.keys(dataset);
   if (!keys.length) {
      body.innerHTML = '<tr><td colspan="6" class="text-muted">No gem cutting data.</td></tr>';
      return;
   }

   const sortKey = flipwiseHubState.gemCuttingSortColumn;
   const sortDir = flipwiseHubState.gemCuttingSortDir;
   keys.sort((a, b) => {
      const rowA = dataset[a] || {};
      const rowB = dataset[b] || {};

      if (sortKey === 'item') {
         const cmp = a.localeCompare(b);
         return sortDir === 'asc' ? cmp : -cmp;
      }

      const valueA = rowA[sortKey] != null ? Number(rowA[sortKey]) : ((sortKey === 'profit' || sortKey === 'limitProfit') ? -Infinity : 0);
      const valueB = rowB[sortKey] != null ? Number(rowB[sortKey]) : ((sortKey === 'profit' || sortKey === 'limitProfit') ? -Infinity : 0);
      return sortDir === 'asc' ? valueA - valueB : valueB - valueA;
   });

   const headRow = document.getElementById('fw-gem-cutting-head-row');
   if (headRow) {
      headRow.querySelectorAll('th[data-sort]').forEach(th => {
         th.classList.remove('sort-asc', 'sort-desc');
         if (th.dataset.sort === sortKey) {
            th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
         }
      });
   }

   body.innerHTML = keys.map(name => {
      const row = dataset[name] || {};
      const profit = row.profit != null ? row.profit : null;
      const profitClass = profit > 0 ? ' positive' : profit < 0 ? ' negative' : '';
      return `
         <tr>
            <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon({ icon: row.uncut_icon || row.cut_icon }, name)}</span><span class="coin-name">${escapeHtml(name)}</span></div></td>
            <td class="market-table__td-num">${escapeHtml(row.uncutPrice != null ? `${formatFlipwiseNumber(row.uncutPrice)} gp` : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.cutValue != null ? `${formatFlipwiseNumber(row.cutValue)} gp` : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.profit != null ? formatFlipwiseSignedGp(row.profit) : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.geLimit != null ? formatFlipwiseNumber(row.geLimit) : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.limitProfit != null ? formatFlipwiseSignedGp(row.limitProfit) : '--')}</td>
         </tr>
      `;
   }).join('');
}

function renderFlipwiseShopsToGe() {
   const body = document.getElementById('fw-shops-to-ge-body');
   if (!body) return;

   const dataset = flipwiseHubState.lastData?.shopsToGeData || {};
   const keys = Object.keys(dataset);
   if (!keys.length) {
      body.innerHTML = '<tr><td colspan="7" class="text-muted">No items configured yet.</td></tr>';
      return;
   }

   const sortKey = flipwiseHubState.shopsToGeSortColumn;
   const sortDir = flipwiseHubState.shopsToGeSortDir;
   keys.sort((a, b) => {
      const rowA = dataset[a] || {};
      const rowB = dataset[b] || {};

      if (sortKey === 'shop') {
         const cmp = (rowA.npc || '').localeCompare(rowB.npc || '');
         return sortDir === 'asc' ? cmp : -cmp;
      }

      if (sortKey === 'item') {
         const cmp = (rowA.itemName || a).localeCompare(rowB.itemName || b);
         return sortDir === 'asc' ? cmp : -cmp;
      }

      const valueA = rowA[sortKey] != null ? Number(rowA[sortKey]) : ((sortKey === 'profitPer' || sortKey === 'profitLimit') ? -Infinity : 0);
      const valueB = rowB[sortKey] != null ? Number(rowB[sortKey]) : ((sortKey === 'profitPer' || sortKey === 'profitLimit') ? -Infinity : 0);
      return sortDir === 'asc' ? valueA - valueB : valueB - valueA;
   });

   const headRow = document.getElementById('fw-shops-to-ge-head-row');
   if (headRow) {
      headRow.querySelectorAll('th[data-sort]').forEach(th => {
         th.classList.remove('sort-asc', 'sort-desc');
         if (th.dataset.sort === sortKey) {
            th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
         }
      });
   }

   body.innerHTML = keys.map(key => {
      const row = dataset[key] || {};
      const itemName = row.itemName || key;
      const profit = row.profitPer != null ? row.profitPer : null;
      const profitClass = profit > 0 ? ' positive' : profit < 0 ? ' negative' : '';
      return `
         <tr>
            <td class="market-table__td-item"><span class="coin-name">${escapeHtml(row.npc || '--')}</span></td>
            <td class="market-table__td-item"><div class="coin-cell"><span class="coin-icon">${renderFlipwiseMarketIcon({ icon: row.icon }, itemName)}</span><span class="coin-name">${escapeHtml(itemName)}</span></div></td>
            <td class="market-table__td-num">${escapeHtml(row.shopCost != null ? `${formatFlipwiseNumber(row.shopCost)} gp` : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.geAfterTax != null ? `${formatFlipwiseNumber(row.geAfterTax)} gp` : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.profitPer != null ? formatFlipwiseSignedGp(row.profitPer) : '--')}</td>
            <td class="market-table__td-num">${escapeHtml(row.geLimit != null ? formatFlipwiseNumber(row.geLimit) : '--')}</td>
            <td class="market-table__td-num change-cell${profitClass}">${escapeHtml(row.profitLimit != null ? formatFlipwiseSignedGp(row.profitLimit) : '--')}</td>
         </tr>
      `;
   }).join('');
}

function navigateFlipwiseDashboardItem({ mode, label, search = '', filter = '' }) {
   if (!mode) return;

   if (mode === 'native-markets') {
      if (filter) {
         flipwiseHubState.marketsFilter = filter;
      }
      flipwiseHubState.marketsSearch = search || '';
      const searchInput = document.getElementById('fw-markets-search');
      if (searchInput) {
         searchInput.value = flipwiseHubState.marketsSearch;
         syncFlipwiseSearchClearButton(searchInput);
      }
      const tabs = document.querySelectorAll('.flipwise-markets-tab');
      tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.filter === flipwiseHubState.marketsFilter));
   }

   if (mode === 'native-tree-saplings') {
      flipwiseHubState.treeSaplingsSearch = search || '';
      const searchInput = document.getElementById('fw-tree-saplings-search');
      if (searchInput) {
         searchInput.value = flipwiseHubState.treeSaplingsSearch;
         syncFlipwiseSearchClearButton(searchInput);
      }
   }

   if (mode === 'native-decanting') {
      flipwiseHubState.decantingSearch = search || '';
      const searchInput = document.getElementById('fw-decanting-search');
      if (searchInput) {
         searchInput.value = flipwiseHubState.decantingSearch;
         syncFlipwiseSearchClearButton(searchInput);
      }
   }

   const button = document.querySelector(`.flipwise-workspace-btn[data-flipwise-mode="${mode}"]`);
   if (button) {
      button.click();
   }
}

function buildFlipwiseEnchantingBreakdownHtml(tile) {
   const breakdown = tile?.breakdown;
   if (!breakdown) return '';

   const html = [];
   const iconImg = icon => {
      if (!icon) return '';
      const filename = String(icon).replace(/ /g, '_');
      const url = `https://oldschool.runescape.wiki/images/${encodeURIComponent(filename)}`;
      return `<img class="mm-item-icon" src="${escapeHtml(url)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
   };

   if (Array.isArray(breakdown.materials) && breakdown.materials.length) {
      breakdown.materials.forEach(material => {
         const qty = material.qty > 1 ? ` x ${material.qty}` : '';
         html.push(`
            <div class="mm-row">
               <span class="mm-row-left">${iconImg(material.icon)}<span class="mm-label">${escapeHtml(material.name)}${escapeHtml(qty)}:</span></span>
               <span class="mm-val">${formatFlipwiseNumber(material.cost)} gp</span>
            </div>
         `);
      });
      html.push('<div class="mm-divider"></div>');
      html.push(`
         <div class="mm-row">
            <span class="mm-label"><strong>Total cost:</strong></span>
            <span class="mm-val">${formatFlipwiseNumber(breakdown.total_cost)} gp</span>
         </div>
      `);
      html.push(`
         <div class="mm-row">
            <span class="mm-row-left">${iconImg(breakdown.product_icon)}<span class="mm-label"><strong>${escapeHtml(breakdown.product_name || '')}:</strong></span></span>
            <span class="mm-val">${formatFlipwiseNumber(breakdown.product_value)} gp</span>
         </div>
      `);
      html.push(`
         <div class="mm-row${breakdown.profit_before_tax != null && breakdown.profit_before_tax < 0 ? ' mm-negative' : ''}">
            <span class="mm-label"><strong>Profit:</strong></span>
            <span class="mm-val">${breakdown.profit_before_tax != null ? `${formatFlipwiseSignedGp(breakdown.profit_before_tax)}` : '--'}</span>
         </div>
      `);
      html.push(`
         <div class="mm-row">
            <span class="mm-label"><strong>Tax:</strong></span>
            <span class="mm-val">${breakdown.tax != null ? `${formatFlipwiseNumber(breakdown.tax)} gp` : '--'}</span>
         </div>
      `);
      html.push(`
         <div class="mm-row${breakdown.profit_after_tax != null && breakdown.profit_after_tax < 0 ? ' mm-negative' : ''}">
            <span class="mm-label"><strong>Profit after GE Tax:</strong></span>
            <span class="mm-val">${breakdown.profit_after_tax != null ? `${formatFlipwiseSignedGp(breakdown.profit_after_tax)}` : '--'}</span>
         </div>
      `);
   } else if (Array.isArray(breakdown.rows) && breakdown.rows.length) {
      breakdown.rows.forEach(row => {
         html.push(`
            <div class="mm-row${row.winner ? ' mm-winner' : ''}${row.profit != null && row.profit < 0 ? ' mm-negative' : ''}">
               <span class="mm-label">${escapeHtml(row.label || '')}</span>
               <span class="mm-val">${escapeHtml(String(row.value ?? '--'))}</span>
            </div>
         `);
      });
   }

   if (!html.length) return '';
   return `<div class="mm-tile-breakdown">${html.join('')}</div>`;
}

function formatFlipwiseTimeAgo(ts) {
   if (ts == null || ts === undefined) return '--';
   const ms = typeof ts === 'number' && ts < 1e12 ? ts * 1000 : ts;
   const seconds = Math.floor((Date.now() - ms) / 1000);
   if (seconds < 60) return 'Just now';
   if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
   return `${(seconds / 3600).toFixed(1)} hr ago`;
}

function getFlipwiseFavorites() {
   try {
      return JSON.parse(localStorage.getItem('flipwise-favorites') || '[]');
   } catch (error) {
      return [];
   }
}

function isFlipwiseFavorite(name) {
   return getFlipwiseFavorites().includes(name);
}

function toggleFlipwiseFavorite(name) {
   const favorites = getFlipwiseFavorites();
   const index = favorites.indexOf(name);
   if (index >= 0) {
      favorites.splice(index, 1);
   } else {
      favorites.push(name);
   }
   try {
      localStorage.setItem('flipwise-favorites', JSON.stringify(favorites));
   } catch (error) {
      // Ignore storage failure and keep the current UI responsive.
   }
}

function getFlipwisePinned() {
   try {
      return JSON.parse(localStorage.getItem('flipwise-pinned') || '[]');
   } catch (error) {
      return [];
   }
}

function toggleFlipwisePin(name) {
   const pinned = getFlipwisePinned();
   const index = pinned.indexOf(name);
   if (index >= 0) {
      pinned.splice(index, 1);
   } else {
      pinned.push(name);
   }
   try {
      localStorage.setItem('flipwise-pinned', JSON.stringify(pinned));
   } catch (error) {
      // Ignore storage failure and keep the current UI responsive.
   }
}

function getFlipwiseDataByName(data, name) {
   if (!data) return null;
   return (data.itemData && data.itemData[name])
      || (data.thirdAgeData && data.thirdAgeData[name])
      || (data.runesData && data.runesData[name])
      || (data.herbloreData && data.herbloreData[name])
      || (data.scannerData && data.scannerData[name])
      || null;
}

function showFlipwiseNativeTool(tool) {
   const moneyMakers = document.getElementById('flipwise-money-makers-grid');
   const markets = document.getElementById('flipwise-native-markets');
   const scanner = document.getElementById('flipwise-native-scanner');
   const enchanting = document.getElementById('flipwise-enchanting-grid');
   const outfitSets = document.getElementById('flipwise-outfit-sets-grid');
   const treeSaplings = document.getElementById('flipwise-native-tree-saplings');
   const decanting = document.getElementById('flipwise-native-decanting');
   const gemCutting = document.getElementById('flipwise-native-gem-cutting');
   const shopsToGe = document.getElementById('flipwise-native-shops-to-ge');
   if (moneyMakers) moneyMakers.classList.toggle('is-hidden', tool !== 'money-makers');
   if (markets) markets.classList.toggle('is-hidden', tool !== 'markets');
   if (scanner) scanner.classList.toggle('is-hidden', tool !== 'scanner');
   if (enchanting) enchanting.classList.toggle('is-hidden', tool !== 'enchanting');
   if (outfitSets) outfitSets.classList.toggle('is-hidden', tool !== 'outfit-sets');
   if (treeSaplings) treeSaplings.classList.toggle('is-hidden', tool !== 'tree-saplings');
    if (decanting) decanting.classList.toggle('is-hidden', tool !== 'decanting');
    if (gemCutting) gemCutting.classList.toggle('is-hidden', tool !== 'gem-cutting');
    if (shopsToGe) shopsToGe.classList.toggle('is-hidden', tool !== 'shops-to-ge');
}

function showFlipwiseMarketBreakdown(itemName) {
   const overlay = document.getElementById('fw-breakdown-overlay');
   const title = document.getElementById('fw-breakdown-title');
   const content = document.getElementById('fw-breakdown-content');
   if (!overlay || !title || !content) return;

   const dataset = getFlipwiseMarketsDataset(flipwiseHubState.lastData, flipwiseHubState.marketsFilter);
   const d = dataset && dataset[itemName];
   title.textContent = `${itemName} - Price Breakdown`;

   if (!d) {
      content.innerHTML = '<p class="text-muted">No data for this item.</p>';
   } else {
      const isVolumeTable = flipwiseHubState.marketsFilter === 'runes' || flipwiseHubState.marketsFilter === 'herblore';
      const rows = [
         { label: 'Buy', value: d.low != null ? `${formatFlipwiseNumber(d.low)} gp` : '--' },
         { label: 'Sell', value: d.high != null ? `${formatFlipwiseNumber(d.high)} gp` : '--' }
      ];

      if (isVolumeTable) {
         rows.push({
            label: 'Profit per',
            value: d.profitPer != null ? formatFlipwiseSignedGp(d.profitPer) : '--',
            cls: d.profitPer > 0 ? 'positive' : d.profitPer < 0 ? 'negative' : ''
         });
         rows.push({
            label: 'Profit limit',
            value: d.profitLimit != null ? formatFlipwiseSignedGp(d.profitLimit) : '--',
            cls: d.profitLimit > 0 ? 'positive' : d.profitLimit < 0 ? 'negative' : ''
         });
      } else {
         rows.push({
            label: 'Profit',
            value: d.profit != null ? formatFlipwiseSignedGp(d.profit) : '--',
            cls: d.profit > 0 ? 'positive' : d.profit < 0 ? 'negative' : ''
         });
         rows.push({ label: 'ROI %', value: d.roi != null ? `${Number(d.roi).toFixed(1)}%` : '--' });
         rows.push({ label: 'Buy time', value: formatFlipwiseTimeAgo(d.lowTime) });
         rows.push({ label: 'Sell time', value: formatFlipwiseTimeAgo(d.highTime) });
      }

      content.innerHTML = rows.map(row => `
         <div class="breakdown-row">
            <span class="label">${escapeHtml(row.label)}</span>
            <span class="value${row.cls ? ` ${row.cls}` : ''}">${escapeHtml(row.value)}</span>
         </div>
      `).join('');
   }

   overlay.style.display = 'flex';
   overlay.setAttribute('aria-hidden', 'false');
}

function buildFlipwiseMoneyMakerBreakdownHtml(tile) {
   const breakdown = tile?.breakdown;
   if (!breakdown) return '';

   const F = window.Flipwise;
   const key = tile.key;
   const html = [];

   const iconImg = icon => {
      if (!icon) return '';
      const filename = String(icon).replace(/ /g, '_');
      const url = `https://oldschool.runescape.wiki/images/${encodeURIComponent(filename)}`;
      return `<img class="mm-item-icon" src="${escapeHtml(url)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
   };

   const rowWithIcon = (icon, label, value) => {
      const left = icon ? `<span class="mm-row-left">${iconImg(icon)}<span class="mm-label">${label}</span></span>` : `<span class="mm-label">${label}</span>`;
      return `<div class="mm-row">${left}<span class="mm-val">${value}</span></div>`;
   };

   if (key === 'knife' && breakdown.knives?.length) {
      const best = breakdown.best_knife || '';
      breakdown.knives.forEach(knife => {
         const rowClass = knife.name === best ? 'mm-row mm-winner' : 'mm-row';
         const left = knife.icon ? `<span class="mm-row-left">${iconImg(knife.icon)}<span class="mm-label">${escapeHtml(knife.name)}:</span></span>` : `<span class="mm-label">${escapeHtml(knife.name)}:</span>`;
         html.push(`<div class="${rowClass}">${left}<span class="mm-val">B: ${formatFlipwiseNumber(knife.buy)} S: ${formatFlipwiseNumber(knife.sell)}</span></div>`);
      });
   } else if (key === 'cannon') {
      const cannonItems = F?.CANNON_ITEMS || [{ name: 'Cannon base' }, { name: 'Cannon stand' }, { name: 'Cannon barrels' }, { name: 'Cannon furnace' }];
      const partIcons = breakdown.part_icons || [];
      [breakdown.part1, breakdown.part2, breakdown.part3, breakdown.part4].forEach((value, index) => {
         const partName = cannonItems[index] ? cannonItems[index].name : 'Part';
         html.push(rowWithIcon(partIcons[index], `GE ${escapeHtml(partName)}:`, `${formatFlipwiseNumber(value)} gp`));
      });
      html.push(rowWithIcon(breakdown.cannon_icon, 'GE Cannon:', `${formatFlipwiseNumber(breakdown.cannon_sell)} gp`));
      const partsProfit = breakdown.parts_profit;
      const nulProfit = breakdown.nulodion_profit;
      const partsClass = partsProfit != null && nulProfit != null && partsProfit >= nulProfit ? 'mm-row mm-winner' : 'mm-row';
      const nulClass = nulProfit != null && (partsProfit == null || nulProfit > partsProfit) ? 'mm-row mm-winner' : 'mm-row';
      html.push(`<div class="${partsClass}"><span class="mm-label">GE Bought Parts:</span><span class="mm-val">${formatFlipwiseSignedGp(partsProfit)}</span></div>`);
      html.push(`<div class="${nulClass}"><span class="mm-label">Nulodion:</span><span class="mm-val">${formatFlipwiseSignedGp(nulProfit)}</span></div>`);
   } else if (key === 'odium' && F?.ODIUM_SHARD_ITEMS) {
      const icons = breakdown.part_icons || [];
      F.ODIUM_SHARD_ITEMS.forEach((item, index) => {
         html.push(rowWithIcon(icons[index], `${escapeHtml(item.name)}:`, `${formatFlipwiseNumber([breakdown.part1, breakdown.part2, breakdown.part3][index])} gp`));
      });
      html.push(rowWithIcon(breakdown.ward_icon, 'Odium ward:', `${formatFlipwiseNumber(breakdown.ward_sell)} gp`));
   } else if (key === 'malediction' && F?.MALEDICTION_SHARD_ITEMS) {
      const icons = breakdown.part_icons || [];
      F.MALEDICTION_SHARD_ITEMS.forEach((item, index) => {
         html.push(rowWithIcon(icons[index], `${escapeHtml(item.name)}:`, `${formatFlipwiseNumber([breakdown.part1, breakdown.part2, breakdown.part3][index])} gp`));
      });
      html.push(rowWithIcon(breakdown.ward_icon, 'Malediction ward:', `${formatFlipwiseNumber(breakdown.ward_sell)} gp`));
   } else if (key === 'bandit') {
      html.push(rowWithIcon(breakdown.ge_sell_icon, 'Bandit Trader:', '750 gp'));
      html.push(rowWithIcon(breakdown.ge_sell_icon, 'GE Sell Rate:', `${formatFlipwiseNumber(breakdown.ge_sell)} gp`));
      html.push(`<div class="mm-row"><span class="mm-label">Profit per:</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per)}</span></div>`);
      html.push(`<div class="mm-row${breakdown.profit_per_hour >= 0 ? ' mm-winner' : ' mm-negative'}"><span class="mm-label">Per Hour (~${breakdown.hourly_rate ?? 929}):</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per_hour)}</span></div>`);
   } else if (key === 'soul_rune') {
      html.push('<div class="mm-row"><span class="mm-label">Wizard Akutha (50):</span><span class="mm-val">308 gp</span></div>');
      html.push('<div class="mm-row mm-winner"><span class="mm-label">Wizard Akutha (100):</span><span class="mm-val">315 gp</span></div>');
      html.push('<div class="mm-row"><span class="mm-label">Wizard Akutha (150):</span><span class="mm-val">338 gp</span></div>');
      html.push(rowWithIcon(breakdown.ge_buy_icon, 'Approx. GE Price:', `${formatFlipwiseNumber(breakdown.ge_buy)} gp`));
   } else if (key === 'lockpicks') {
      html.push(rowWithIcon(breakdown.ge_buy_icon, 'Lockpick Cost:', `${formatFlipwiseNumber(breakdown.fixed_gp)} gp`));
      html.push(rowWithIcon(breakdown.ge_buy_icon, 'GE Price:', `${formatFlipwiseNumber(breakdown.ge_price)} gp`));
      if (breakdown.ge_price_after_tax != null) {
         html.push(`<div class="mm-row"><span class="mm-label">After tax:</span><span class="mm-val">${formatFlipwiseNumber(breakdown.ge_price_after_tax)} gp</span></div>`);
      }
      html.push(`<div class="mm-row"><span class="mm-label">Profit per:</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per)}</span></div>`);
      html.push(`<div class="mm-row${breakdown.profit_per_hour >= 0 ? ' mm-winner' : ' mm-negative'}"><span class="mm-label">Per Hour (~${breakdown.hourly_rate ?? 6000}):</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per_hour)}</span></div>`);
   } else if (key === 'dragonbreath') {
      html.push(rowWithIcon(breakdown.dragonfruit_icon, 'Cost Per:', `${formatFlipwiseNumber(breakdown.cost_per)} gp`));
      html.push(rowWithIcon(breakdown.dragonfruit_icon, 'Cost Per 10:', `${formatFlipwiseNumber(breakdown.cost_per_10)} gp`));
      html.push(rowWithIcon(breakdown.product_icon, 'Bottled Dragonbreath:', `${formatFlipwiseNumber(breakdown.product_value)} gp`));
      html.push(`<div class="mm-row"><span class="mm-label">Profit per:</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per)}</span></div>`);
      html.push(`<div class="mm-row${breakdown.profit_per_hour >= 0 ? ' mm-winner' : ' mm-negative'}"><span class="mm-label">Per Hour (~${breakdown.hourly_rate ?? 450}):</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per_hour)}</span></div>`);
   } else if (key === 'mithril_seeds') {
      html.push(rowWithIcon(breakdown.seed_icon, 'Mithril Seed:', `${formatFlipwiseNumber(breakdown.fixed_gp)} gp`));
      html.push(rowWithIcon(breakdown.seed_icon, 'GE Price:', `${formatFlipwiseNumber(breakdown.ge_price)} gp`));
      html.push(`<div class="mm-row"><span class="mm-label">Profit per:</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per)}</span></div>`);
      html.push(`<div class="mm-row${breakdown.profit_per_hour >= 0 ? ' mm-winner' : ' mm-negative'}"><span class="mm-label">Per Hour (~${breakdown.hourly_rate ?? 1945}):</span><span class="mm-val">${formatFlipwiseSignedGp(breakdown.profit_per_hour)}</span></div>`);
   }

   return html.length ? `<div class="mm-tile-breakdown">${html.join('')}</div>` : '';
}

function formatFlipwiseNumber(value) {
   if (value == null || Number.isNaN(Number(value))) return '--';
   return Number(value).toLocaleString();
}

function formatFlipwiseSignedGp(value) {
   if (value == null || Number.isNaN(Number(value))) return '--';
   const number = Number(value);
   return `${number >= 0 ? '+' : ''}${number.toLocaleString()} gp`;
}

function buildFlipwiseMoversList(data, mode) {
   if (!data) return [];

   const combined = [];
   const addGroup = (group, filter) => {
      Object.entries(group || {}).forEach(([name, item]) => {
         const profit = item?.profit ?? item?.profitLimit;
         if (typeof profit === 'number' && !Number.isNaN(profit)) {
            combined.push({ name, profit, icon: item?.icon || null, filter });
         }
      });
   };

   addGroup(data.itemData, 'items');
   addGroup(data.thirdAgeData, 'third_age');
   addGroup(data.runesData, 'runes');
   addGroup(data.herbloreData, 'herblore');

   combined.sort((a, b) => b.profit - a.profit);
   return mode === 'losers' ? combined.slice(-5).reverse() : combined.slice(0, 5);
}

function buildFlipwiseBestOpportunities(data) {
   if (!data) return [];

   const opportunities = [];
   const maybePush = (entry) => {
      if (entry && typeof entry.profit === 'number' && !Number.isNaN(entry.profit)) {
         opportunities.push(entry);
      }
   };

   const bestMoneyMaker = (data.moneyMakerTiles || []).find(tile => tile.key === data.moneyMakerBestKey);
   if (bestMoneyMaker) {
      maybePush({
         source: 'Unusual Methods',
         title: bestMoneyMaker.title,
         profit: bestMoneyMaker.profit,
         unit: bestMoneyMaker.unit || 'gp',
         mode: 'native-money-makers',
         icon: bestMoneyMaker.breakdown?.cannon_icon || bestMoneyMaker.breakdown?.ward_icon || bestMoneyMaker.breakdown?.product_icon || null
      });
   }

   const bestEnchant = (data.enchantingTiles || []).find(tile => tile.key === data.enchantingBestKey);
   if (bestEnchant) {
      maybePush({
         source: 'Enchanting',
         title: bestEnchant.title,
         profit: bestEnchant.profit,
         unit: 'gp',
         mode: 'native-enchanting',
         icon: bestEnchant.breakdown?.product_icon || null
      });
   }

   const bestSet = (data.outfitSetTiles || []).find(tile => tile.key === data.outfitSetBestKey);
   if (bestSet) {
      maybePush({
         source: 'Outfit Sets',
         title: bestSet.title,
         profit: bestSet.profit,
         unit: 'gp',
         mode: 'native-outfit-sets',
         icon: bestSet.breakdown?.product_icon || null
      });
   }

   const treePick = getFlipwiseTopObjectEntry(data.treeSaplingsData, row => row?.limitProfit ?? row?.profitPer);
   if (treePick) {
      maybePush({
         source: 'Tree Saplings',
         title: treePick.name,
         profit: treePick.value,
         unit: 'gp',
         mode: 'native-tree-saplings',
         search: treePick.name,
         icon: treePick.row?.icon || null
      });
   }

   const decantPick = getFlipwiseTopObjectEntry(data.decantingData, row => row?.theorizedLimit ?? row?.approxProfit);
   if (decantPick) {
      maybePush({
         source: 'Decanting',
         title: decantPick.name,
         profit: decantPick.value,
         unit: 'gp',
         mode: 'native-decanting',
         search: decantPick.name,
         icon: decantPick.row?.icon || null
      });
   }

   return opportunities.sort((a, b) => b.profit - a.profit).slice(0, 5);
}

function getFlipwiseTopObjectEntry(group, valueFn) {
   let best = null;
   Object.entries(group || {}).forEach(([name, row]) => {
      const value = valueFn(row);
      if (typeof value !== 'number' || Number.isNaN(value)) return;
      if (!best || value > best.value) {
         best = { name, row, value };
      }
   });
   return best;
}

function renderFlipwiseIcon(iconName, label) {
   if (iconName) {
      const url = `https://oldschool.runescape.wiki/images/${encodeURIComponent(String(iconName).replace(/ /g, '_'))}`;
      return `<span class="flipwise-icon"><img src="${escapeHtml(url)}" alt="" loading="lazy" referrerpolicy="no-referrer"></span>`;
   }

   const fallback = escapeHtml((label || '?').charAt(0).toUpperCase());
   return `<span class="flipwise-icon">${fallback}</span>`;
}

function formatFlipwiseProfit(value, unit) {
   if (typeof value !== 'number' || Number.isNaN(value)) return '--';
   const absolute = Math.abs(Math.round(value)).toLocaleString();
   const prefix = value >= 0 ? '+' : '-';
   return `${prefix}${absolute} ${unit === 'gp/hr' ? 'gp/hr' : 'gp'}`;
}

function checkFlipwiseTrendEvents(data) {
   const allItems = buildFlipwiseMoversList(data, 'gainers').concat(buildFlipwiseMoversList(data, 'losers'));
   allItems.forEach(item => {
      const level = getFlipwiseTrendLevel(item.profit);
      const previous = flipwiseHubState.lastTrendState[item.name];
      flipwiseHubState.lastTrendState[item.name] = level;

      if ((level === 3 || level === -3) && previous !== level) {
         const direction = level === 3 ? 'trending upward' : 'trending downward';
         window.FlipwiseAlerts?.appendEvent?.(`${item.name} is ${direction}.`, level === 3 ? 'surge' : 'crash');
      }
   });
}

function getFlipwiseTrendLevel(profit) {
   if (typeof profit !== 'number' || Number.isNaN(profit)) return 0;
   const neutralMin = window.Flipwise?.TREND_NEUTRAL_MIN ?? -500000;
   const neutralMax = window.Flipwise?.TREND_NEUTRAL_MAX ?? 500000;
   const smallUp = window.Flipwise?.TREND_SMALL_UP ?? 5000000;
   const mediumUp = window.Flipwise?.TREND_MEDIUM_UP ?? 10000000;
   if (profit >= neutralMin && profit <= neutralMax) return 0;
   if (profit > neutralMax) return profit < smallUp ? 1 : (profit < mediumUp ? 2 : 3);
   return profit > -smallUp ? -1 : (profit > -mediumUp ? -2 : -3);
}

function setText(id, value) {
   const element = document.getElementById(id);
   if (element) {
      element.textContent = value;
   }
}



