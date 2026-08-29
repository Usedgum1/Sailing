const redFlagIPs = ['173.89.231.3', '173.246.230.10', '64.52.244.17'];

const linkCollections = [
    {
        title: 'Computer',
        tone: 'cyan',
        links: [
            { label: 'GOG Games', href: 'https://www.gog-games.to/' },
            { label: 'CG Games PC', href: 'https://www.cg-gamespc.net/' },
            { label: 'Abandonware Games', href: 'https://abandonwaregames.net/' },
            { label: 'Game PC Full', href: 'https://gamepcfull.com/' },
            { label: 'Get Free Games', href: 'https://www.getfreegames.net/' },
            { label: 'Games Pack', href: 'https://gamespack.net/' },
            { label: 'GamezDL', href: 'https://gamezdl.cc/' },
            { label: 'Anker Games', href: 'https://www.ankergames.net/' },
            { label: 'FitGirl Repacks', href: 'https://fitgirl-repacks.site/' }
        ]
    },
    {
        title: 'Android',
        tone: 'magenta',
        links: [
            { label: 'APKMODY', href: 'https://apkmody.mobi/' },
            { label: 'Modyolo', href: 'https://modyolo.com/' }
        ]
    },
    {
        title: 'Streaming',
        tone: 'violet',
        links: [
            { label: 'Cineby', href: 'https://www.cineby.at/' },
            { label: '1Shows', href: 'https://www.1shows.nl/' }
        ]
    },
    {
        title: 'Reddit',
        tone: 'cyan',
        links: [
            { label: 'Piracy Megathread', href: 'https://www.reddit.com/r/Piracy/wiki/megathread' },
            { label: 'Reddit Home', href: 'https://www.reddit.com/' }
        ]
    }
];

const rawgHome = 'https://rawg.io/';
const hizHome = 'https://hizsearch.pages.dev/';
const sourcePairKey = 'sail-source-pair';
const catalogSources = [
    { id: 'fitgirl', label: 'FitGirl', href: 'https://fitgirl-repacks.site/', embed: true, protected: true },
    { id: 'steamrip', label: 'SteamRip', href: 'https://steamrip.com/', embed: true, protected: true },
    { id: 'dodi', label: 'DODI', href: 'https://dodi-repacks.site/', embed: false, protected: true },
    { id: 'gog-games', label: 'GOG Games', href: 'https://www.gog-games.to/', embed: false, protected: true },
    { id: 'cg-games', label: 'CG Games PC', href: 'https://www.cg-gamespc.net/', embed: false, protected: true },
    { id: 'anker', label: 'Anker Games', href: 'https://www.ankergames.net/', embed: false, protected: true },
    { id: 'gamezdl', label: 'GamezDL', href: 'https://gamezdl.cc/', embed: false, protected: true },
    { id: 'hiz', label: 'HizSearch', href: hizHome, embed: true, protected: false }
];
const views = ['sources', 'lookup', 'links', 'settings'];
const viewAliases = {
    search: 'lookup',
    'source-lookup': 'lookup'
};

let currentIPAddress = '';
let confirmModalState = null;

window.addEventListener('load', () => {
    setGreeting();
    renderLinkCollections();
    initializeNavigation();
    initializeSourcePickers();
    initializeLookupSearch();
    attachProtectedLinkListeners();
    fetchIPAddress();
    applyView(getViewFromHash());
});

function setGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const target = document.getElementById('greeting-text');
    if (target) target.textContent = greeting;
}

function initializeNavigation() {
    document.querySelectorAll('[data-view]').forEach(element => {
        element.addEventListener('click', () => applyView(element.dataset.view));
    });

    window.addEventListener('hashchange', () => applyView(getViewFromHash()));
    document.getElementById('notify-btn')?.addEventListener('click', () => applyView('settings'));
}

function resolveView(viewName) {
    if (views.includes(viewName)) return viewName;
    return viewAliases[viewName] || 'sources';
}

function getViewFromHash() {
    const view = window.location.hash.replace('#', '');
    return resolveView(view);
}

function applyView(viewName) {
    const nextView = resolveView(viewName);

    document.querySelectorAll('[data-view-panel]').forEach(panel => {
        const isActive = panel.dataset.viewPanel === nextView;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('is-active', item.dataset.view === nextView);
    });

    const workspace = document.querySelector('.workspace');
    workspace?.classList.toggle('is-sources', nextView === 'sources');
    workspace?.classList.toggle('is-lookup', nextView === 'lookup');

    if (window.location.hash !== `#${nextView}`) {
        window.location.hash = nextView;
    }

    if (nextView === 'lookup') {
        document.getElementById('lookup-search-input')?.focus();
    }
}

function initializeSourcePickers() {
    const pair = getSavedSourcePair();

    ['left', 'right'].forEach(side => {
        const select = document.getElementById(`source-${side}-select`);
        if (!select) return;

        select.innerHTML = catalogSources.map(source => (
            `<option value="${source.id}">${escapeHtml(source.label)}</option>`
        )).join('');
        select.value = pair[side];
        select.addEventListener('change', () => {
            applySourcePane(side, select.value);
            saveSourcePair();
        });
        applySourcePane(side, select.value);
    });
}

function getSourceById(id) {
    return catalogSources.find(source => source.id === id) || catalogSources[0];
}

function getSavedSourcePair() {
    try {
        const saved = JSON.parse(localStorage.getItem(sourcePairKey) || '{}');
        return {
            left: catalogSources.some(source => source.id === saved.left) ? saved.left : 'fitgirl',
            right: catalogSources.some(source => source.id === saved.right) ? saved.right : 'steamrip'
        };
    } catch (error) {
        return { left: 'fitgirl', right: 'steamrip' };
    }
}

function saveSourcePair() {
    const left = document.getElementById('source-left-select')?.value || 'fitgirl';
    const right = document.getElementById('source-right-select')?.value || 'steamrip';
    try {
        localStorage.setItem(sourcePairKey, JSON.stringify({ left, right }));
    } catch (error) {
        // Keep the pickers usable if storage is blocked.
    }
}

function setProtectedFlag(element, isProtected) {
    if (isProtected) element.setAttribute('data-protected-link', 'true');
    else element.removeAttribute('data-protected-link');
}

function applySourcePane(side, sourceId) {
    const source = getSourceById(sourceId);
    const frame = document.getElementById(`source-${side}-frame`);
    const fallback = document.getElementById(`source-${side}-fallback`);
    const name = document.getElementById(`source-${side}-name`);
    const open = document.getElementById(`source-${side}-open`);
    const launch = document.getElementById(`source-${side}-launch`);

    if (name) name.textContent = source.label;
    if (open) {
        open.href = source.href;
        setProtectedFlag(open, source.protected);
    }
    if (launch) {
        launch.href = source.href;
        launch.textContent = `Open ${source.label}`;
        setProtectedFlag(launch, source.protected);
    }

    if (source.embed) {
        if (frame) {
            frame.hidden = false;
            frame.title = source.label;
            frame.src = source.href;
        }
        if (fallback) fallback.hidden = true;
        return;
    }

    if (frame) {
        frame.hidden = true;
        frame.removeAttribute('src');
    }
    if (fallback) fallback.hidden = false;
}

function initializeLookupSearch() {
    document.getElementById('lookup-search-form')?.addEventListener('submit', event => {
        event.preventDefault();
        const query = document.getElementById('lookup-search-input')?.value.trim();
        applyLookupQuery(query);
    });
}

function applyLookupQuery(query) {
    const rawgUrl = query ? `${rawgHome}search?query=${encodeURIComponent(query)}` : rawgHome;
    const hizUrl = query ? `${hizHome}?q=${encodeURIComponent(query)}` : hizHome;

    const rawgFrame = document.getElementById('lookup-rawg-frame');
    const hizFrame = document.getElementById('lookup-hiz-frame');
    const rawgOpen = document.getElementById('lookup-rawg-open');
    const hizOpen = document.getElementById('lookup-hiz-open');

    if (rawgFrame) rawgFrame.src = rawgUrl;
    if (hizFrame) hizFrame.src = hizUrl;
    if (rawgOpen) rawgOpen.href = rawgUrl;
    if (hizOpen) hizOpen.href = hizUrl;
}

function renderLinkCollections() {
    const grid = document.getElementById('links-grid');
    if (!grid) return;

    grid.innerHTML = linkCollections.map(group => `
        <section class="link-group">
            <h3>${escapeHtml(group.title)}</h3>
            <div class="link-list">
                ${group.links.map(link => `
                    <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer" data-protected-link="true">${escapeHtml(link.label)}</a>
                `).join('')}
            </div>
        </section>
    `).join('');
}

async function fetchIPAddress() {
    const pills = [document.getElementById('settings-ip-pill')];
    const notifyDot = document.getElementById('notify-dot');
    const sidebar = document.getElementById('ip-monitor');
    const sidebarDot = document.getElementById('sidebar-ip-dot');
    const sidebarLabel = document.getElementById('sidebar-ip-label');
    const sidebarValue = document.getElementById('sidebar-ip-value');
    const guard = document.getElementById('settings-guard-pill');

    const setState = (label, value, state) => {
        pills.forEach(element => {
            if (!element) return;
            element.textContent = `${label}: ${value}`;
            element.classList.remove('is-safe', 'is-alert', 'is-unknown');
            element.classList.add(state);
        });

        if (sidebar) {
            sidebar.classList.remove('is-safe', 'is-alert', 'is-unknown');
            sidebar.classList.add(state);
        }
        if (sidebarDot) {
            sidebarDot.classList.remove('is-safe', 'is-alert', 'is-unknown');
            sidebarDot.classList.add(state);
        }
        if (sidebarLabel) sidebarLabel.textContent = label;
        if (sidebarValue) sidebarValue.textContent = value;
        if (notifyDot) notifyDot.hidden = state !== 'is-alert';
    };

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        currentIPAddress = ip;

        if (redFlagIPs.includes(ip)) {
            setState('Exposed', ip, 'is-alert');
            if (guard) guard.textContent = 'Prompts enabled';
        } else {
            setState('Okay', ip, 'is-safe');
            if (guard) guard.textContent = 'Quiet mode';
        }
    } catch (error) {
        setState('IP Status', 'Unavailable', 'is-unknown');
    }
}

function attachProtectedLinkListeners() {
    document.querySelectorAll('[data-protected-link="true"]').forEach(link => {
        if (link.dataset.guardBound === 'true') return;
        link.dataset.guardBound = 'true';
        link.addEventListener('click', async event => {
            if (link.getAttribute('data-protected-link') !== 'true') return;
            if (!redFlagIPs.includes(currentIPAddress)) return;
            event.preventDefault();
            const proceed = await openProtectedLinkModal();
            if (proceed) window.open(link.href, '_blank', 'noopener');
        });
    });
}

function openProtectedLinkModal() {
    const modal = document.getElementById('confirm-modal');
    const backdrop = document.getElementById('confirm-modal-backdrop');
    const cancelButton = document.getElementById('confirm-modal-cancel');
    const confirmButton = document.getElementById('confirm-modal-confirm');
    if (!modal || !backdrop || !cancelButton || !confirmButton) return Promise.resolve(false);
    if (confirmModalState) return Promise.resolve(false);

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
            if (event.key === 'Escape') cleanup(false);
        };

        confirmModalState = { cleanup };
        backdrop.addEventListener('click', handleCancel);
        cancelButton.addEventListener('click', handleCancel);
        confirmButton.addEventListener('click', handleConfirm);
        document.addEventListener('keydown', handleKeydown);
        confirmButton.focus();
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
