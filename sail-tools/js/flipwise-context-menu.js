/**
 * Flipwise — Right-click context menu for market rows.
 * Options: Pin/Unpin, Add/Clear Buy Alert, Add/Clear Sell Alert, Show Price Breakdown, Visit Wiki.
 */
(function() {
  'use strict';

  var menuEl = null;
  var currentItemName = null;
  var currentFilter = null;

  function getMenu() {
    if (menuEl) return menuEl;
    menuEl = document.createElement('div');
    menuEl.className = 'flipwise-context-menu';
    menuEl.setAttribute('role', 'menu');
    document.body.appendChild(menuEl);
    return menuEl;
  }

  function hide() {
    var m = getMenu();
    m.classList.remove('is-open');
    m.innerHTML = '';
    currentItemName = null;
    currentFilter = null;
  }

  function addItem(label, onClick, isDisabled) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'flipwise-context-menu-item';
    btn.textContent = label;
    if (isDisabled) btn.disabled = true;
    btn.addEventListener('click', function() {
      hide();
      if (onClick) onClick();
    });
    getMenu().appendChild(btn);
  }

  function addSeparator() {
    var sep = document.createElement('div');
    sep.className = 'flipwise-context-menu-sep';
    getMenu().appendChild(sep);
  }

  /**
   * Show context menu at the pointer location.
   * opts: idByName, pinnedSet, onTogglePin, onAddAlert, onClearAlert, onBreakdown, onVisitWiki
   */
  function show(event, itemName, filter, opts) {
    opts = opts || {};
    event.preventDefault();
    event.stopPropagation();
    currentItemName = itemName;
    currentFilter = filter || 'items';
    var idByName = opts.idByName || {};
    var pinned = opts.pinnedSet || [];
    var isPinned = pinned.indexOf(itemName) >= 0;
    var hasBuy = window.FlipwiseAlerts && window.FlipwiseAlerts.hasAlert(itemName, 'buy');
    var hasSell = window.FlipwiseAlerts && window.FlipwiseAlerts.hasAlert(itemName, 'sell');

    var menu = getMenu();
    menu.innerHTML = '';
    menu.classList.add('is-open');

    addItem(isPinned ? '  Unpin from Top  ' : '  Pin to Top  ', function() {
      if (opts.onTogglePin) opts.onTogglePin(itemName);
    });
    addSeparator();
    addItem('  Add Buy Alert  ', function() { if (opts.onAddAlert) opts.onAddAlert(itemName, 'buy'); });
    addItem('  Clear Buy Alert  ', function() { if (opts.onClearAlert) opts.onClearAlert(itemName, 'buy'); }, !hasBuy);
    addSeparator();
    addItem('  Add Sell Alert  ', function() { if (opts.onAddAlert) opts.onAddAlert(itemName, 'sell'); });
    addItem('  Clear Sell Alert  ', function() { if (opts.onClearAlert) opts.onClearAlert(itemName, 'sell'); }, !hasSell);
    addSeparator();
    addItem('  Show Price Breakdown  ', function() { if (opts.onBreakdown) opts.onBreakdown(itemName); });
    addSeparator();
    addItem('  Visit Wiki  ', function() {
      var id = idByName[itemName];
      if (id == null && typeof itemName === 'string') {
        var lower = itemName.toLowerCase();
        for (var k in idByName) { if (idByName.hasOwnProperty(k) && k.toLowerCase() === lower) { id = idByName[k]; break; } }
      }
      if (id != null) window.open('https://prices.runescape.wiki/osrs/item/' + id, '_blank');
    });

    var offset = 6;
    var x = event.clientX + offset;
    var y = event.clientY + offset;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    requestAnimationFrame(function() {
      var r = menu.getBoundingClientRect();
      if (r.right > window.innerWidth) menu.style.left = Math.max(12, event.clientX - r.width - offset) + 'px';
      if (r.bottom > window.innerHeight) menu.style.top = Math.max(12, event.clientY - r.height - offset) + 'px';
    });
  }

  document.addEventListener('click', hide);
  document.addEventListener('contextmenu', hide);

  window.FlipwiseContextMenu = {
    show: show,
    hide: hide,
    getCurrentItem: function() { return currentItemName; },
    getCurrentFilter: function() { return currentFilter; }
  };
})();
