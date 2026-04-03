/**
 * Sidebar clock — 12hr time + "Refreshed X ago" from localStorage (persists across tabs).
 */
(function() {
  'use strict';
  var LAST_REFRESH_KEY = 'flipwise-last-refresh-ts';
  var clockEl = document.getElementById('refresh-clock');
  var lastEl = document.getElementById('refresh-last');

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function timeAgo(ts) {
    if (ts == null || ts === undefined || !isFinite(ts)) return '—';
    var ms = ts < 1e12 ? ts * 1000 : ts;
    var sec = Math.floor((Date.now() - ms) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return Math.floor(sec / 60) + ' min ago';
    return (sec / 3600).toFixed(1) + ' hr ago';
  }

  function getLastRefreshTs() {
    try {
      var saved = localStorage.getItem(LAST_REFRESH_KEY) || sessionStorage.getItem(LAST_REFRESH_KEY);
      if (saved && saved.trim()) {
        var n = parseInt(saved, 10);
        if (!isNaN(n) && n > 0) return n;
      }
    } catch (e) {}
    return null;
  }

  function updateClock() {
    var d = new Date();
    var h = d.getHours();
    var isPm = h >= 12;
    var h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    var time12 = h12 + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds()) + (isPm ? ' PM' : ' AM');
    if (clockEl) clockEl.textContent = time12;
    if (lastEl) {
      var ts = getLastRefreshTs();
      lastEl.textContent = ts ? 'Refreshed ' + timeAgo(ts) : '—';
    }
  }

  if (!clockEl && !lastEl) return;
  updateClock();
  setInterval(updateClock, 1000);

  /* On non-Markets/non-Scanner pages: Refresh button + optional 15s auto-refresh (dashboard Flips and Flops) */
  var refreshBtn = document.getElementById('refresh-btn');
  var isMarketsPage = !!document.getElementById('marketsTableBody');
  var isScannerPage = !!document.getElementById('scannerTableBody');
  var isMoneyMakersPage = !!document.getElementById('moneyMakerTiles');
  if (refreshBtn && !isMarketsPage && !isScannerPage && !isMoneyMakersPage && typeof window.FlipwiseAPI !== 'undefined') {
    function doRefresh(disableBtn) {
      if (disableBtn && refreshBtn) refreshBtn.disabled = true;
      window.FlipwiseAPI.refresh().then(function(data) {
        var t = Date.now();
        try {
          localStorage.setItem(LAST_REFRESH_KEY, String(t));
          sessionStorage.setItem(LAST_REFRESH_KEY, String(t));
        } catch (e) {}
        if (window.FlipwiseDashboard && typeof window.FlipwiseDashboard.onRefresh === 'function') {
          window.FlipwiseDashboard.onRefresh(data);
        }
      }).finally(function() {
        if (refreshBtn) refreshBtn.disabled = false;
      });
    }
    refreshBtn.addEventListener('click', function() { doRefresh(true); });
  }
})();
