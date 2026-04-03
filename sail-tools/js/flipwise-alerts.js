/**
 * Flipwise — Alert storage, check on refresh, event log, optional browser notifications.
 * Alerts fire when Buy Time or Sell Time timestamp updates (new GE data).
 */
(function() {
  'use strict';

  var ALERTS_KEY = 'flipwise-alerts';
  var EVENTS_KEY = 'flipwise-events';
  var EVENTS_MAX = 200;

  function getAlerts() {
    try {
      var raw = localStorage.getItem(ALERTS_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return typeof o === 'object' && o !== null ? o : {};
    } catch (e) { return {}; }
  }

  /** Alert storage: { "Item Name|buy": lastLowTime (Buy time), "Item Name|sell": lastHighTime (Sell time) } */
  function setAlert(itemName, side, lastTs) {
    var alerts = getAlerts();
    var key = itemName + '|' + side;
    alerts[key] = lastTs;
    try { localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); } catch (e) {}
  }

  function clearAlert(itemName, side) {
    var alerts = getAlerts();
    var key = itemName + '|' + side;
    delete alerts[key];
    try { localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); } catch (e) {}
  }

  function hasAlert(itemName, side) {
    var key = itemName + '|' + side;
    return getAlerts().hasOwnProperty(key);
  }

  function getDataByName(data, name) {
    return (data && data.itemData && data.itemData[name]) ||
      (data && data.thirdAgeData && data.thirdAgeData[name]) ||
      (data && data.runesData && data.runesData[name]) ||
      (data && data.herbloreData && data.herbloreData[name]) ||
      (data && data.scannerData && data.scannerData[name]) || null;
  }

  /** Check all alerts against fresh data; fire and remove when timestamp updated. */
  function checkAlerts(data, idByName) {
    if (!data) return;
    var alerts = getAlerts();
    var idByN = idByName || {};
    var keys = Object.keys(alerts);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var parts = key.split('|');
      if (parts.length !== 2) continue;
      var name = parts[0];
      var side = parts[1];
      var lastTs = alerts[key];
      var row = getDataByName(data, name);
      if (!row) continue;
      var newTs = side === 'buy' ? (row.lowTime) : (row.highTime);
      if (newTs != null && newTs > lastTs) {
        clearAlert(name, side);
        var msg = name + ' ' + side + ' alert triggered!';
        appendEvent(msg, 'alert-triggered');
        if (window.FlipwiseSounds && window.FlipwiseSounds.playAlertTriggered)
          window.FlipwiseSounds.playAlertTriggered();
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          try { new Notification('OSRS Alert Triggered', { body: msg }); } catch (e) {}
        }
      }
    }
  }

  function appendEvent(msg, tag) {
    tag = tag || 'neutral';
    var time = new Date();
    var timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    var line = '[' + timeStr + '] ' + msg;
    try {
      var arr = [];
      var raw = sessionStorage.getItem(EVENTS_KEY);
      if (raw) try { arr = JSON.parse(raw); } catch (e) {}
      arr.unshift({ line: line, tag: tag, ts: time.getTime() });
      if (arr.length > EVENTS_MAX) arr.length = EVENTS_MAX;
      sessionStorage.setItem(EVENTS_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  function getEvents() {
    try {
      var raw = sessionStorage.getItem(EVENTS_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function clearEvents() {
    try { sessionStorage.setItem(EVENTS_KEY, '[]'); } catch (e) {}
  }

  function requestNotificationPermission() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') Notification.requestPermission();
  }

  window.FlipwiseAlerts = {
    getAlerts: getAlerts,
    setAlert: setAlert,
    clearAlert: clearAlert,
    hasAlert: hasAlert,
    checkAlerts: checkAlerts,
    appendEvent: appendEvent,
    getEvents: getEvents,
    clearEvents: clearEvents,
    requestNotificationPermission: requestNotificationPermission
  };
})();
