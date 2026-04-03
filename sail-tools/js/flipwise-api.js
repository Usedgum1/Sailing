/**
 * Flipwise — OSRS Wiki API client. Fetches prices and builds item data.
 */
(function() {
  'use strict';

  var API_BASE = 'https://prices.runescape.wiki/api/v1/osrs';
  // Browsers block setting the `User-Agent` header. Keep headers minimal so fetch works everywhere.
  var API_HEADERS = { 'Accept': 'application/json' };
  var TIMEOUT_MS = 10000;

  function get(url) {
    return Promise.race([
      fetch(url, { headers: API_HEADERS }),
      new Promise(function(_, rej) { setTimeout(function() { rej(new Error('timeout')); }, TIMEOUT_MS); })
    ]).then(function(r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  function fetchParallel() {
    return Promise.all([
      get(API_BASE + '/latest').then(function(j) { return j.data || {}; }),
      get(API_BASE + '/24h').then(function(j) { return j.data || {}; }),
      get(API_BASE + '/mapping').then(function(j) { return Array.isArray(j) ? j : []; })
    ]).then(function(arr) {
      var mapping = arr[2] || [];
      var buyLimits = {};
      var iconById = {};
      var idByName = {};
      for (var i = 0; i < mapping.length; i++) {
        var item = mapping[i];
        if (!item) continue;
        var id = item.id;
        if (typeof id !== 'undefined' && typeof item.limit !== 'undefined')
          buyLimits[id] = item.limit;
        if (typeof id !== 'undefined' && item.icon)
          iconById[String(id)] = item.icon;
        if (typeof id !== 'undefined' && item.name != null)
          idByName[String(item.name)] = id;
      }
      return { prices: arr[0], volumes24h: arr[1], mapping: mapping, buyLimits: buyLimits, iconById: iconById, idByName: idByName };
    });
  }

  function trendArrow(profit) {
    var F = window.Flipwise;
    var neutralMin = F && F.TREND_NEUTRAL_MIN != null ? F.TREND_NEUTRAL_MIN : -500000;
    var neutralMax = F && F.TREND_NEUTRAL_MAX != null ? F.TREND_NEUTRAL_MAX : 500000;
    var smallUp = F && F.TREND_SMALL_UP != null ? F.TREND_SMALL_UP : 2000000;
    var mediumUp = F && F.TREND_MEDIUM_UP != null ? F.TREND_MEDIUM_UP : 5000000;
    if (profit >= neutralMin && profit <= neutralMax) return '\u2192';  /* → */
    if (profit > neutralMax) return profit < smallUp ? '\u25B2' : (profit < mediumUp ? '\u25B2\u25B2' : '\u25B2\u25B2\u25B2');  /* ▲ */
    return profit > -smallUp ? '\u25BC' : (profit > -mediumUp ? '\u25BC\u25BC' : '\u25BC\u25BC\u25BC');  /* ▼ */
  }

  function processScanner(prices, mapping, iconById) {
    var F = window.Flipwise;
    if (!F) return {};
    var nowSec = Math.floor(Date.now() / 1000);
    var maxAge = F.SCANNER_MAX_AGE_SECONDS != null ? F.SCANNER_MAX_AGE_SECONDS : 86400;
    var minProfit = F.SCANNER_MIN_PROFIT != null ? F.SCANNER_MIN_PROFIT : 50000;
    var minRoi = F.SCANNER_MIN_ROI != null ? F.SCANNER_MIN_ROI : 3;
    var topN = F.SCANNER_TOP_N != null ? F.SCANNER_TOP_N : 20;
    var maxTax = F.MAX_TAX || 5000000;
    iconById = iconById || {};
    mapping = mapping || [];
    var candidates = [];
    for (var i = 0; i < mapping.length; i++) {
      var item = mapping[i];
      if (!item || item.id == null) continue;
      var d = prices[String(item.id)] || {};
      var high = d.high;
      var low = d.low;
      var hts = d.highTime;
      var lts = d.lowTime;
      if (!high || !low || high <= low || !hts || !lts) continue;
      if ((nowSec - hts > maxAge) && (nowSec - lts > maxAge)) continue;
      var tax = Math.min(Math.floor(high * 0.02), maxTax);
      var profit = (high - tax) - low;
      var roi = low > 0 ? (profit / low * 100) : 0;
      if (profit < minProfit || roi < minRoi) continue;
      var arrow = trendArrow(profit);
      candidates.push({ name: item.name, high: high, low: low, profit: profit, roi: roi, highTime: hts, lowTime: lts, arrow: arrow, icon: iconById[String(item.id)] });
    }
    candidates.sort(function(a, b) { return b.profit - a.profit; });
    var out = {};
    for (var j = 0; j < topN && j < candidates.length; j++) {
      var c = candidates[j];
      out[c.name] = { high: c.high, low: c.low, profit: c.profit, roi: c.roi, highTime: c.highTime, lowTime: c.lowTime, arrow: c.arrow, icon: c.icon };
    }
    return out;
  }

  function processFlipItems(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.FLIP_ITEMS) return {};
    var out = {};
    var maxTax = F.MAX_TAX || 5000000;
    iconById = iconById || {};
    for (var i = 0; i < F.FLIP_ITEMS.length; i++) {
      var item = F.FLIP_ITEMS[i];
      var d = prices[String(item.id)] || {};
      var high = d.high;
      var low = d.low;
      var hts = d.highTime;
      var lts = d.lowTime;
      if (!high || !low) continue;
      var tax = Math.min(Math.floor(high * 0.02), maxTax);
      var profit = (high - tax) - low;
      var roi = low > 0 ? (profit / low * 100) : 0;
      out[item.name] = {
        high: high,
        low: low,
        profit: profit,
        roi: roi,
        highTime: hts,
        lowTime: lts,
        volume: 0,
        icon: iconById[String(item.id)]
      };
    }
    return out;
  }

  function processRunes(prices, buyLimits, iconById) {
    var F = window.Flipwise;
    if (!F || !F.HIGH_VOLUME_ITEMS) return {};
    var out = {};
    buyLimits = buyLimits || {};
    iconById = iconById || {};
    for (var i = 0; i < F.HIGH_VOLUME_ITEMS.length; i++) {
      var item = F.HIGH_VOLUME_ITEMS[i];
      var d = prices[String(item.id)] || {};
      var high = d.high;
      var low = d.low;
      var hts = d.highTime;
      var lts = d.lowTime;
      if (!high || !low) continue;
      var limit = buyLimits[item.id] || 0;
      var profitPer = high - low;
      var profitLimit = profitPer * limit;
      out[item.name] = {
        high: high,
        low: low,
        highTime: hts,
        lowTime: lts,
        profitPer: profitPer,
        profitLimit: profitLimit,
        limit: limit,
        icon: iconById[String(item.id)]
      };
    }
    return out;
  }

  function processHerblore(prices, buyLimits, iconById) {
    var F = window.Flipwise;
    if (!F || !F.HERBLORE_ITEMS) return {};
    var out = {};
    buyLimits = buyLimits || {};
    iconById = iconById || {};
    for (var i = 0; i < F.HERBLORE_ITEMS.length; i++) {
      var item = F.HERBLORE_ITEMS[i];
      var d = prices[String(item.id)] || {};
      var high = d.high;
      var low = d.low;
      var hts = d.highTime;
      var lts = d.lowTime;
      if (!high || !low) continue;
      var limit = buyLimits[item.id] || 0;
      var profitPer = high - low;
      var profitLimit = profitPer * limit;
      out[item.name] = {
        high: high,
        low: low,
        highTime: hts,
        lowTime: lts,
        profitPer: profitPer,
        profitLimit: profitLimit,
        limit: limit,
        icon: iconById[String(item.id)]
      };
    }
    return out;
  }

  function processThirdAge(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.THIRD_AGE_ITEMS) return {};
    var out = {};
    var maxTax = F.MAX_TAX || 5000000;
    iconById = iconById || {};
    for (var i = 0; i < F.THIRD_AGE_ITEMS.length; i++) {
      var item = F.THIRD_AGE_ITEMS[i];
      var d = prices[String(item.id)] || {};
      var high = d.high;
      var low = d.low;
      var hts = d.highTime;
      var lts = d.lowTime;
      if (!high || !low) continue;
      var tax = Math.min(Math.floor(high * 0.02), maxTax);
      var profit = (high - tax) - low;
      var roi = low > 0 ? (profit / low * 100) : 0;
      out[item.name] = {
        high: high,
        low: low,
        profit: profit,
        roi: roi,
        highTime: hts,
        lowTime: lts,
        volume: 0,
        icon: iconById[String(item.id)]
      };
    }
    return out;
  }

  function processMoneyMakers(prices, iconById, buyLimits) {
    var F = window.Flipwise;
    if (!F) return { tiles: [], bestKey: null };
    iconById = iconById || {};
    buyLimits = buyLimits || {};
    var maxTax = F.MAX_TAX || 5000000;
    var tooltips = F.MONEY_MAKER_TOOLTIPS || {};
    var tiles = [];
    function addTile(key, title, profit, unit, breakdown) {
      var label = profit > 0 ? '+' + Number(profit).toLocaleString() + ' gp' : (profit < 0 ? Number(profit).toLocaleString() + ' gp' : 'Inactive');
      var t = { key: key, title: title, profit: profit, label: label, unit: unit || 'gp', tooltip: tooltips[key] || '' };
      if (breakdown) t.breakdown = breakdown;
      tiles.push(t);
    }
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }

    // --- Knife (match Python: knives list + best_knife) ---
    var knifeData = {};
    var knivesList = [];
    if (F.KNIFE_ITEMS) {
      for (var i = 0; i < F.KNIFE_ITEMS.length; i++) {
        var k = F.KNIFE_ITEMS[i];
        var kv = get(k.id);
        knifeData[k.name] = { high: kv.high, low: kv.low };
        knivesList.push({ name: k.name, buy: kv.low, sell: kv.high, id: k.id, icon: iconById[String(k.id)] });
      }
    }
    var dkSell = (knifeData['Dragon knife'] || {}).high || 0;
    var bestKnifeProfit = 0;
    var bestKnifeName = '';
    if (F.KNIFE_ITEMS && dkSell > 0) {
      for (var name in knifeData) {
        if (name.indexOf('(p)') >= 0 && knifeData[name].low > 0) {
          var perProfit = dkSell - knifeData[name].low;
          var gross = perProfit * (F.KNIFE_BUY_LIMIT || 7000);
          var tax = Math.min(Math.floor(dkSell * (F.KNIFE_BUY_LIMIT || 7000) * 0.02), maxTax);
          var limitProfit = gross - tax;
          if (limitProfit > bestKnifeProfit) {
            bestKnifeProfit = limitProfit;
            bestKnifeName = name;
          }
        }
      }
    }
    addTile('knife', 'Dragon Knife Cleaning', bestKnifeProfit, 'gp', { knives: knivesList, best_knife: bestKnifeName });

    // --- Cannon (parts + cannon_sell, parts_profit, nulodion_profit) ---
    var cannonParts = F.CANNON_ITEMS || [];
    var partCosts = [];
    var partsCost = 0;
    var allParts = true;
    for (var c = 0; c < cannonParts.length; c++) {
      var pc = get(cannonParts[c].id);
      var cost = (pc.high && pc.low) ? Math.min(pc.high, pc.low) : (pc.low || pc.high || 0);
      if (!cost) allParts = false;
      partCosts.push(cost);
      partsCost += cost;
    }
    var mcSell = get(F.MULTICANNON_ID || 12863).high || 0;
    var cannonHourly = 0;
    var partsProfit = null;
    var nulodionProfit = null;
    if (mcSell) {
      var cTax = Math.min(Math.floor(mcSell * 0.02), maxTax);
      nulodionProfit = mcSell - cTax - (F.NULODION_COST || 750000);
      partsProfit = (allParts && partsCost) ? (mcSell - cTax - partsCost) : null;
      var bestC = Math.max(partsProfit != null ? partsProfit : -1e9, nulodionProfit);
      cannonHourly = bestC * (F.CANNON_HOURLY_RATE || 157);
    }
    var cannonPartIds = (F.CANNON_ITEMS || []).map(function(p) { return p.id; });
    addTile('cannon', 'Dwarven Multicannon', cannonHourly, 'gp/hr', {
      part1: partCosts[0] || 0, part2: partCosts[1] || 0, part3: partCosts[2] || 0, part4: partCosts[3] || 0,
      cannon_sell: mcSell, parts_profit: partsProfit, nulodion_profit: nulodionProfit,
      part_icons: [iconById[String(cannonPartIds[0])], iconById[String(cannonPartIds[1])], iconById[String(cannonPartIds[2])], iconById[String(cannonPartIds[3])]],
      cannon_icon: iconById[String(F.MULTICANNON_ID || 12863)]
    });

    // --- Odium ---
    var odiumShards = F.ODIUM_SHARD_ITEMS || [];
    var odiumPartCosts = [];
    var odiumCost = 0;
    for (var o = 0; o < odiumShards.length; o++) {
      var oc = get(odiumShards[o].id);
      var c = (oc.high && oc.low) ? Math.min(oc.high, oc.low) : (oc.low || oc.high || 0);
      odiumPartCosts.push(c);
      odiumCost += c;
    }
    var wardSell = get(F.ODIUM_WARD_ID || 11926).high || 0;
    var odiumBulk = (wardSell && odiumCost) ? (wardSell - Math.min(Math.floor(wardSell * 0.02), maxTax) - odiumCost) * (F.ODIUM_BULK_PER_HOUR || 20) : 0;
    var odiumIds = (F.ODIUM_SHARD_ITEMS || []).map(function(p) { return p.id; });
    addTile('odium', 'Odium Ward Assembly', odiumBulk, 'gp/hr', {
      part1: odiumPartCosts[0] || 0, part2: odiumPartCosts[1] || 0, part3: odiumPartCosts[2] || 0, ward_sell: wardSell,
      part_icons: [iconById[String(odiumIds[0])], iconById[String(odiumIds[1])], iconById[String(odiumIds[2])]],
      ward_icon: iconById[String(F.ODIUM_WARD_ID || 11926)]
    });

    // --- Malediction ---
    var malShards = F.MALEDICTION_SHARD_ITEMS || [];
    var malPartCosts = [];
    var malCost = 0;
    for (var m = 0; m < malShards.length; m++) {
      var mcv = get(malShards[m].id);
      var mcc = (mcv.high && mcv.low) ? Math.min(mcv.high, mcv.low) : (mcv.low || mcv.high || 0);
      malPartCosts.push(mcc);
      malCost += mcc;
    }
    var malSell = get(F.MALEDICTION_WARD_ID || 11924).high || 0;
    var malBulk = (malSell && malCost) ? (malSell - Math.min(Math.floor(malSell * 0.02), maxTax) - malCost) * (F.MALEDICTION_BULK_PER_HOUR || 20) : 0;
    var malIds = (F.MALEDICTION_SHARD_ITEMS || []).map(function(p) { return p.id; });
    addTile('malediction', 'Malediction Ward Assembly', malBulk, 'gp/hr', {
      part1: malPartCosts[0] || 0, part2: malPartCosts[1] || 0, part3: malPartCosts[2] || 0, ward_sell: malSell,
      part_icons: [iconById[String(malIds[0])], iconById[String(malIds[1])], iconById[String(malIds[2])]],
      ward_icon: iconById[String(F.MALEDICTION_WARD_ID || 11924)]
    });

    // --- Bandit (GE sell tax on brew sell) ---
    var banditRate = F.BANDIT_HOURLY_RATE || 929;
    var brewSellRaw = get(F.BANDITS_BREW_ID || 4627).high || get(F.BANDITS_BREW_ID).low || 0;
    var brewTax = brewSellRaw ? Math.min(Math.floor(brewSellRaw * 0.02), maxTax) : 0;
    var brewSell = brewSellRaw - brewTax;
    var brewPer = brewSellRaw ? Math.max(0, brewSell - (F.BANDIT_TRADER_GP || 750)) : null;
    var banditHourly = brewPer != null ? brewPer * banditRate : 0;
    addTile('bandit', "Buying Bandit Brews", banditHourly, 'gp/hr', {
      ge_sell: brewSellRaw,
      profit_per: brewPer,
      profit_per_hour: brewPer != null ? brewPer * banditRate : null,
      hourly_rate: banditRate,
      ge_sell_icon: iconById[String(F.BANDITS_BREW_ID || 4627)]
    });

    // --- Lockpicks (fixed 20 gp, sell on GE at higher of buy/sell; profit after 2% sell tax; per GE buy limit) ---
    var lockpickId = F.LOCKPICK_ID || 1523;
    var lockpickFixed = F.LOCKPICK_FIXED_GP != null ? F.LOCKPICK_FIXED_GP : 20;
    var lockpickRate = F.LOCKPICK_HOURLY_RATE != null ? F.LOCKPICK_HOURLY_RATE : 6000;
    var lockpickD = get(lockpickId);
    var lockpickGeRaw = Math.max(lockpickD.high || 0, lockpickD.low || 0);
    var lockpickTax = lockpickGeRaw ? Math.min(Math.floor(lockpickGeRaw * 0.02), maxTax) : 0;
    var lockpickGeAfterTax = lockpickGeRaw - lockpickTax;
    var lockpickProfitPer = lockpickGeRaw ? (lockpickGeAfterTax - lockpickFixed) : null;
    var lockpickHourly = (lockpickProfitPer != null) ? (lockpickProfitPer * lockpickRate) : 0;
    addTile('lockpicks', 'Buying Lockpicks', lockpickHourly, 'gp/hr', {
      fixed_gp: lockpickFixed,
      ge_price: lockpickGeRaw,
      ge_price_after_tax: lockpickGeAfterTax,
      tax: lockpickTax,
      profit_per: lockpickProfitPer,
      hourly_rate: lockpickRate,
      profit_per_hour: (lockpickProfitPer != null) ? lockpickProfitPer * lockpickRate : null,
      ge_buy_icon: iconById[String(lockpickId)]
    });

    // --- Soul rune (buy from Wizard 315 gp, sell on GE; profit after 2% sell tax) ---
    var soulPriceRaw = get(F.SOUL_RUNE_ID || 566).high || get(F.SOUL_RUNE_ID).low || 0;
    var soulTax = soulPriceRaw ? Math.min(Math.floor(soulPriceRaw * 0.02), maxTax) : 0;
    var soulPriceAfterTax = soulPriceRaw - soulTax;
    var soulProfit = soulPriceRaw ? (soulPriceAfterTax - (F.WIZARD_AKUTHA_100_GP || 315)) * (F.SOUL_RUNE_QUANTITY || 67000) : 0;
    addTile('soul_rune', 'Buying Soul Runes', soulProfit, 'gp', { ge_buy: soulPriceRaw, ge_buy_icon: iconById[String(F.SOUL_RUNE_ID || 566)] });

    // --- Dragonbreath ---
    var dfId = F.DRAGONFRUIT_ID || 22929;
    var bdbId = F.BOTTLED_DRAGONBREATH_ID || 23002;
    var dfPrice = get(dfId).low || get(dfId).high || 0;
    var costPer10 = dfPrice * 10 || 0;
    var bdbData = get(bdbId);
    var bdbHigh = bdbData.high || 0;
    var bdbLow = bdbData.low || 0;
    var productValDisplay = Math.max(bdbHigh, bdbLow);
    var dragonbreathHourly = 0;
    var profitPer = null;
    if (bdbLow && costPer10) {
      var bdbTax = Math.min(Math.floor(bdbLow * 0.02), maxTax);
      var revenuePerBottle = bdbLow - bdbTax;
      profitPer = revenuePerBottle - costPer10;
      dragonbreathHourly = profitPer * (F.DRAGONBREATH_HOURLY_RATE || 450);
    }
    var rate = F.DRAGONBREATH_HOURLY_RATE || 450;
    addTile('dragonbreath', 'Making Bottled Dragonbreath', dragonbreathHourly, 'gp/hr', {
      dragonfruit_icon: iconById[String(dfId)],
      cost_per: dfPrice,
      cost_per_10: costPer10,
      product_icon: iconById[String(bdbId)],
      product_value: productValDisplay,
      profit_per: profitPer,
      profit_per_hour: profitPer != null ? profitPer * rate : null,
      hourly_rate: rate
    });

    // --- Mithril seeds (fixed 350 gp, sell on GE; profit after 2% sell tax, ~1945/hr) ---
    var mithrilId = F.MITHRIL_SEED_ID || 299;
    var mithrilFixed = F.MITHRIL_SEED_FIXED_GP || 350;
    var mithrilRate = F.MITHRIL_SEED_HOURLY_RATE || 1945;
    var mithrilGeRaw = get(mithrilId).low || get(mithrilId).high || 0;
    var mithrilTax = mithrilGeRaw ? Math.min(Math.floor(mithrilGeRaw * 0.02), maxTax) : 0;
    var mithrilGeAfterTax = mithrilGeRaw - mithrilTax;
    var mithrilProfitPer = (mithrilGeRaw && mithrilFixed) ? mithrilGeAfterTax - mithrilFixed : null;
    var mithrilHourly = mithrilProfitPer != null ? mithrilProfitPer * mithrilRate : 0;
    addTile('mithril_seeds', 'Buying Mithril Seeds', mithrilHourly, 'gp/hr', {
      seed_icon: iconById[String(mithrilId)],
      fixed_gp: mithrilFixed,
      ge_price: mithrilGeRaw,
      profit_per: mithrilProfitPer,
      profit_per_hour: mithrilProfitPer != null ? mithrilProfitPer * mithrilRate : null,
      hourly_rate: mithrilRate
    });

    var bestKey = null;
    var bestProfit = 0;
    for (var t = 0; t < tiles.length; t++) {
      if (tiles[t].profit > bestProfit) {
        bestProfit = tiles[t].profit;
        bestKey = tiles[t].key;
      }
    }
    return { tiles: tiles, bestKey: bestKey };
  }

  function processEnchanting(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.ENCHANTING_RECIPES) return { tiles: [], bestKey: null };
    iconById = iconById || {};
    var maxTax = F.MAX_TAX || 5000000;
    var tiles = [];
    var bestKey = null;
    var bestProfit = -1;
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }
    for (var r = 0; r < F.ENCHANTING_RECIPES.length; r++) {
      var rec = F.ENCHANTING_RECIPES[r];
      var totalCost = 0;
      var materials = [];
      for (var i = 0; i < (rec.inputs || []).length; i++) {
        var inp = rec.inputs[i];
        var costEach = get(inp.id).low || get(inp.id).high || 0;
        var cost = costEach * (inp.qty || 1);
        totalCost += cost;
        materials.push({ name: inp.name || '—', qty: inp.qty || 1, cost: cost, icon: iconById[String(inp.id)] });
      }
      var out = get(rec.output_id || 0);
      var productValue = out.high || out.low || 0;
      var tax = productValue ? Math.min(Math.floor(productValue * 0.02), maxTax) : 0;
      var profitBeforeTax = productValue && totalCost ? productValue - totalCost : 0;
      var profitAfterTax = productValue && totalCost ? (productValue - tax) - totalCost : 0;
      tiles.push({
        key: rec.key,
        title: rec.title,
        profit: profitAfterTax,
        label: profitAfterTax > 0 ? '+' + Number(profitAfterTax).toLocaleString() + ' gp' : (profitAfterTax < 0 ? Number(profitAfterTax).toLocaleString() + ' gp' : 'Inactive'),
        unit: 'gp',
        breakdown: {
          materials: materials,
          total_cost: totalCost,
          product_name: rec.output_name || rec.title,
          product_value: productValue,
          product_icon: iconById[String(rec.output_id)],
          tax: tax,
          profit_before_tax: profitBeforeTax,
          profit_after_tax: profitAfterTax
        }
      });
      if (profitAfterTax > bestProfit) {
        bestProfit = profitAfterTax;
        bestKey = rec.key;
      }
    }
    return { tiles: tiles, bestKey: bestProfit > 0 ? bestKey : null };
  }

  function processOutfitSets(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.OUTFIT_SET_RECIPES) return { tiles: [], bestKey: null };
    iconById = iconById || {};
    var recipes = F.OUTFIT_SET_RECIPES || [];
    if (recipes.length === 0) return { tiles: [], bestKey: null };
    var maxTax = F.MAX_TAX || 5000000;
    var tiles = [];
    var bestKey = null;
    var bestProfit = -1;
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }
    for (var r = 0; r < recipes.length; r++) {
      var rec = recipes[r];
      var totalCost = 0;
      var materials = [];
      for (var i = 0; i < (rec.inputs || []).length; i++) {
        var inp = rec.inputs[i];
        var costEach = get(inp.id).low || get(inp.id).high || 0;
        var cost = costEach * (inp.qty || 1);
        totalCost += cost;
        materials.push({ name: inp.name || '—', qty: inp.qty || 1, cost: cost, icon: iconById[String(inp.id)] });
      }
      var out = get(rec.output_id || 0);
      var productValue = out.high || out.low || 0;
      var tax = productValue ? Math.min(Math.floor(productValue * 0.02), maxTax) : 0;
      var profitBeforeTax = productValue && totalCost ? productValue - totalCost : 0;
      var profitAfterTax = productValue && totalCost ? (productValue - tax) - totalCost : 0;
      var breakdown = {
        materials: materials,
        total_cost: totalCost,
        product_name: rec.output_name || rec.title,
        product_value: productValue,
        product_icon: iconById[String(rec.output_id)],
        tax: tax,
        profit_before_tax: profitBeforeTax,
        profit_after_tax: profitAfterTax
      };
      var setBuy = get(rec.output_id).high || get(rec.output_id).low || 0;
      var setToItemsPieces = [];
      var setToItemsTotalSell = 0;
      for (var j = 0; j < (rec.inputs || []).length; j++) {
        var pinp = rec.inputs[j];
        var pieceLow = get(pinp.id).low || get(pinp.id).high || 0;
        var pieceTax = pieceLow ? Math.min(Math.floor(pieceLow * 0.02), maxTax) : 0;
        var afterTax = pieceLow - pieceTax;
        setToItemsTotalSell += afterTax * (pinp.qty || 1);
        setToItemsPieces.push({ name: pinp.name, qty: pinp.qty || 1, sell: pieceLow, sell_after_tax: afterTax, icon: iconById[String(pinp.id)] });
      }
      var setToItemsProfit = setBuy && setToItemsTotalSell ? setToItemsTotalSell - setBuy : null;
      breakdown.set_to_items = {
        set_buy: setBuy,
        set_icon: iconById[String(rec.output_id)],
        set_name: rec.output_name || rec.title,
        pieces: setToItemsPieces,
        total_sell: setToItemsTotalSell,
        profit: setToItemsProfit
      };
      tiles.push({
        key: rec.key,
        title: rec.title,
        profit: profitAfterTax,
        label: profitAfterTax > 0 ? '+' + Number(profitAfterTax).toLocaleString() + ' gp' : (profitAfterTax < 0 ? Number(profitAfterTax).toLocaleString() + ' gp' : 'Inactive'),
        unit: 'gp',
        breakdown: breakdown
      });
      if (profitAfterTax > bestProfit) {
        bestProfit = profitAfterTax;
        bestKey = rec.key;
      }
    }
    return { tiles: tiles, bestKey: bestProfit > 0 ? bestKey : null };
  }

  function processTreeSaplings(prices, buyLimits, iconById) {
    var F = window.Flipwise;
    if (!F || !F.TREE_SAPLING_ITEMS) return {};
    var maxTax = F.MAX_TAX || 5000000;
    buyLimits = buyLimits || {};
    iconById = iconById || {};
    var out = {};
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }
    for (var i = 0; i < F.TREE_SAPLING_ITEMS.length; i++) {
      var row = F.TREE_SAPLING_ITEMS[i];
      var seedId = row.seed_id;
      var saplingSell = get(row.id).high || get(row.id).low || 0;
      var seedCost = seedId ? (get(seedId).low || get(seedId).high || 0) : 0;
      var tax = saplingSell ? Math.min(Math.floor(saplingSell * 0.02), maxTax) : 0;
      var profitPer = (saplingSell && seedCost) ? (saplingSell - tax) - seedCost : null;
      var limit = seedId ? (buyLimits[seedId] || 0) : 0;
      var limitProfit = (profitPer != null && limit) ? profitPer * limit : null;
      out[row.name] = {
        seedCost: seedCost || null,
        saplingSell: saplingSell || null,
        profitPer: profitPer,
        limit: limit || null,
        limitProfit: limitProfit,
        icon: iconById[String(row.id)]
      };
    }
    return out;
  }

  function processDecanting(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.DECANTING_ITEMS) return {};
    prices = prices || {};
    iconById = iconById || {};
    var maxTax = F.MAX_TAX != null ? F.MAX_TAX : 5000000;
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }
    var out = {};
    for (var i = 0; i < F.DECANTING_ITEMS.length; i++) {
      var row = F.DECANTING_ITEMS[i];
      var name = row.name;
      if (!name) continue;
      var id1 = row.id1;
      var id2 = row.id2;
      var id3 = row.id3;
      var id4 = row.id4;
      var dose1Cost = (id1 != null) ? (get(id1).low || get(id1).high || 0) : null;
      var dose2Cost = (id2 != null) ? (get(id2).low || get(id2).high || 0) : null;
      var dose3Cost = (id3 != null) ? (get(id3).low || get(id3).high || 0) : null;
      var dose1Uncertain = id1 != null && !get(id1).low && get(id1).high;
      var dose2Uncertain = id2 != null && !get(id2).low && get(id2).high;
      var dose3Uncertain = id3 != null && !get(id3).low && get(id3).high;
      var perDose1 = (dose1Cost != null && dose1Cost > 0) ? dose1Cost / 1 : Infinity;
      var perDose2 = (dose2Cost != null && dose2Cost > 0) ? dose2Cost / 2 : Infinity;
      var perDose3 = (dose3Cost != null && dose3Cost > 0) ? dose3Cost / 3 : Infinity;
      var minPerDose = Math.min(perDose1, perDose2, perDose3);
      var cheapestDose = null;
      if (minPerDose !== Infinity) {
        if (minPerDose === perDose1) cheapestDose = 1;
        else if (minPerDose === perDose2) cheapestDose = 2;
        else if (minPerDose === perDose3) cheapestDose = 3;
      }
      var cheapestCost = (minPerDose !== Infinity && isFinite(minPerDose)) ? Math.round(minPerDose * 4) : null;
      var sellRaw = (id4 != null) ? (get(id4).high || get(id4).low || 0) : null;
      var tax = (sellRaw != null && sellRaw > 0) ? Math.min(Math.floor(sellRaw * 0.02), maxTax) : 0;
      var approxSellPrice = sellRaw;
      var approxProfit = (approxSellPrice != null && cheapestCost != null) ? (approxSellPrice - tax) - cheapestCost : null;
      var theorizedLimit = (approxProfit != null) ? approxProfit * 2000 : null;
      out[name] = {
        dose1Cost: dose1Cost,
        dose2Cost: dose2Cost,
        dose3Cost: dose3Cost,
        dose1Uncertain: dose1Uncertain,
        dose2Uncertain: dose2Uncertain,
        dose3Uncertain: dose3Uncertain,
        cheapestDose: cheapestDose,
        cheapestCost: cheapestCost,
        approxSellPrice: approxSellPrice,
        approxProfit: approxProfit,
        theorizedLimit: theorizedLimit,
        icon: id4 != null ? iconById[String(id4)] : null
      };
    }
    return out;
  }

  function processGemCutting(prices, iconById) {
    var F = window.Flipwise;
    if (!F || !F.GEM_CUTTING_ITEMS) return {};
    prices = prices || {};
    iconById = iconById || {};
    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0, highTime: d.highTime, lowTime: d.lowTime };
    }
    function cheapest(h, l) {
      if (!h && !l) return null;
      if (!h) return l;
      if (!l) return h;
      return Math.min(h, l);
    }
    function highest(h, l) {
      if (!h && !l) return null;
      if (!h) return l;
      if (!l) return h;
      return Math.max(h, l);
    }
    var out = {};
    for (var i = 0; i < F.GEM_CUTTING_ITEMS.length; i++) {
      var row = F.GEM_CUTTING_ITEMS[i];
      if (!row || row.uncut_id == null || row.cut_id == null) continue;
      var u = get(row.uncut_id);
      var c = get(row.cut_id);
      var uncutPrice = cheapest(u.high, u.low);
      var cutValue = highest(c.high, c.low);
      var profit = (uncutPrice != null && cutValue != null) ? (cutValue - uncutPrice) : null;
      var limit = row.ge_limit != null ? Number(row.ge_limit) : null;
      var limitProfit = (profit != null && limit != null && isFinite(limit)) ? profit * limit : null;
      out[row.display_name || row.uncut_name || String(row.uncut_id)] = {
        uncutPrice: uncutPrice,
        cutValue: cutValue,
        profit: profit,
        geLimit: limit,
        limitProfit: limitProfit,
        uncut_icon: iconById[String(row.uncut_id)] || null,
        cut_icon: iconById[String(row.cut_id)] || null,
        uncut_name: row.uncut_name || null,
        cut_name: row.cut_name || null,
        uncut_id: row.uncut_id,
        cut_id: row.cut_id
      };
    }
    return out;
  }

  function processShopsToGe(prices, buyLimits, iconById) {
    var F = window.Flipwise;
    if (!F || !F.SHOPS_TO_GE_ITEMS) return {};
    prices = prices || {};
    buyLimits = buyLimits || {};
    iconById = iconById || {};
    var maxTax = F.MAX_TAX || 5000000;

    function get(id) {
      var d = prices[String(id)] || {};
      return { high: d.high || 0, low: d.low || 0 };
    }

    var out = {};
    for (var i = 0; i < F.SHOPS_TO_GE_ITEMS.length; i++) {
      var row = F.SHOPS_TO_GE_ITEMS[i];
      if (!row || row.item_id == null) continue;
      var id = row.item_id;
      var shopCost = row.shop_cost != null ? Number(row.shop_cost) : null;
      var p = get(id);
      var geRaw = Math.max(p.high || 0, p.low || 0);
      var tax = geRaw ? Math.min(Math.floor(geRaw * 0.02), maxTax) : 0;
      var geAfterTax = geRaw ? (geRaw - tax) : null;
      var profitPer = (geAfterTax != null && shopCost != null) ? (geAfterTax - shopCost) : null;
      var limit = row.ge_limit_override != null ? Number(row.ge_limit_override) : (buyLimits[id] || null);
      var profitLimit = (profitPer != null && limit != null) ? profitPer * limit : null;

      var itemName = row.display_name || String(id);
      var shopName = row.npc || '—';
      // Use a unique key so multiple shops selling same item don't overwrite each other.
      var key = shopName + ' | ' + itemName;
      out[key] = {
        npc: row.npc || null,
        itemName: itemName,
        shopCost: shopCost,
        gePrice: geRaw || null,
        geAfterTax: geAfterTax,
        tax: tax,
        profitPer: profitPer,
        geLimit: limit,
        profitLimit: profitLimit,
        icon: iconById[String(id)] || null,
        item_id: id
      };
    }
    return out;
  }

  function refresh() {
    return fetchParallel().then(function(data) {
      var iconById = data.iconById || {};
      var itemData = processFlipItems(data.prices, iconById);
      var thirdAgeData = processThirdAge(data.prices, iconById);
      var runesData = processRunes(data.prices, data.buyLimits, iconById);
      var herbloreData = processHerblore(data.prices, data.buyLimits, iconById);
      var scannerData = processScanner(data.prices, data.mapping, iconById);
      var mm = processMoneyMakers(data.prices, iconById, data.buyLimits);
      var enc = processEnchanting(data.prices, iconById);
      var out = processOutfitSets(data.prices, iconById);
      var treeSaplingsData = processTreeSaplings(data.prices, data.buyLimits, iconById);
      var decantingData = processDecanting(data.prices, iconById);
      var gemCuttingData = processGemCutting(data.prices, iconById);
      var shopsToGeData = processShopsToGe(data.prices, data.buyLimits, iconById);
      return {
        prices: data.prices,
        volumes24h: data.volumes24h,
        mapping: data.mapping,
        iconById: iconById,
        idByName: data.idByName || {},
        itemData: itemData,
        thirdAgeData: thirdAgeData,
        runesData: runesData,
        herbloreData: herbloreData,
        scannerData: scannerData,
        moneyMakerTiles: mm.tiles,
        moneyMakerBestKey: mm.bestKey,
        enchantingTiles: enc.tiles,
        enchantingBestKey: enc.bestKey,
        outfitSetTiles: out.tiles,
        outfitSetBestKey: out.bestKey,
        treeSaplingsData: treeSaplingsData,
        decantingData: decantingData,
        gemCuttingData: gemCuttingData,
        shopsToGeData: shopsToGeData
      };
    });
  }

  window.FlipwiseAPI = { refresh: refresh };
})();
