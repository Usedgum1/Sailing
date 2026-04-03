/**
 * Verify flipwise-data item IDs match OSRS Wiki mapping (prices.runescape.wiki).
 * Run: node verify-wiki-ids.js
 */
const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, 'wiki-mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const byId = {};
mapping.forEach(function (item) {
  if (item.id != null) byId[item.id] = item.name;
});

// Expected: id -> expected name (from our flipwise-data.js)
const expected = {
  // Enchanting
  6585: 'Amulet of fury',
  6581: 'Onyx amulet',
  564: 'Cosmic rune',
  554: 'Fire rune',
  557: 'Earth rune',
  19550: 'Ring of suffering',
  19538: 'Zenyte ring',
  566: 'Soul rune',
  565: 'Blood rune',
  11128: 'Berserker necklace',
  6577: 'Onyx necklace',
  19547: 'Necklace of anguish',
  19535: 'Zenyte necklace',
  21183: 'Bracelet of slaughter',
  21123: 'Topaz bracelet',
  // Outfit sets - Torva
  31145: 'Torva armour set',
  26382: 'Torva full helm',
  26384: 'Torva platebody',
  26386: 'Torva platelegs',
  // Inquisitor's
  24488: "Inquisitor's armour set",
  24419: "Inquisitor's great helm",
  24420: "Inquisitor's hauberk",
  24421: "Inquisitor's plateskirt",
  // Ancestral
  21049: 'Ancestral robes set',
  21018: 'Ancestral hat',
  21021: 'Ancestral robe top',
  21024: 'Ancestral robe bottom',
  // Dragon (lg)
  21882: 'Dragon armour set (lg)',
  11335: 'Dragon full helm',
  21892: 'Dragon platebody',
  4087: 'Dragon platelegs',
  21895: 'Dragon kiteshield',
  // Masori (f)
  27355: 'Masori armour set (f)',
  27235: 'Masori mask (f)',
  27238: 'Masori body (f)',
  27241: 'Masori chaps (f)',
  // Virtus
  31148: 'Virtus armour set',
  26241: 'Virtus mask',
  26243: 'Virtus robe top',
  26245: 'Virtus robe bottom',
  // Trailblazer t3 (wiki: 25001 hood, 25004 top, 25007 trousers, 25010 boots; set 25386)
  25386: 'Trailblazer relic hunter (t3) armour set',
  25001: 'Trailblazer hood (t3)',
  25004: 'Trailblazer top (t3)',
  25007: 'Trailblazer trousers (t3)',
  25010: 'Trailblazer boots (t3)',
  // Gilded (lg) – full helm, platebody, platelegs, kiteshield
  13036: 'Gilded armour set (lg)',
  // Gilded (sk) – full helm, platebody, plateskirt, kiteshield
  13038: 'Gilded armour set (sk)',
  3486: 'Gilded full helm',
  3481: 'Gilded platebody',
  3483: 'Gilded platelegs',
  3485: 'Gilded plateskirt',
  3488: 'Gilded kiteshield',
  // Oathplate
  30744: 'Oathplate armour set',
  30750: 'Oathplate helm',
  30753: 'Oathplate chest',
  30756: 'Oathplate legs',
  // Unusual methods
  22804: 'Dragon knife',
  22806: 'Dragon knife(p)',
  22808: 'Dragon knife(p+)',
  22810: 'Dragon knife(p++)',
  6: 'Cannon base',
  8: 'Cannon stand',
  10: 'Cannon barrels',
  12: 'Cannon furnace',
  12863: 'Dwarf multicannon',
  11926: 'Odium ward',
  11928: 'Odium shard 1',
  11929: 'Odium shard 2',
  11930: 'Odium shard 3',
  11924: 'Malediction ward',
  11931: 'Malediction shard 1',
  11932: 'Malediction shard 2',
  11933: 'Malediction shard 3',
  4627: "Bandit's brew",
  22929: 'Dragonfruit',
  23002: 'Bottled dragonbreath',
};

let ok = 0;
let bad = [];
Object.keys(expected).forEach(function (idStr) {
  const id = parseInt(idStr, 10);
  const want = expected[id];
  const got = byId[id];
  if (got === undefined) {
    bad.push({ id, expected: want, wiki: '(missing)' });
  } else if (got !== want) {
    bad.push({ id, expected: want, wiki: got });
  } else {
    ok++;
  }
});

console.log('Verified against https://prices.runescape.wiki/api/v1/osrs/mapping');
console.log('OK:', ok);
if (bad.length) {
  console.log('Mismatches or missing:');
  bad.forEach(function (b) {
    console.log('  id', b.id, '| expected:', b.expected, '| wiki:', b.wiki);
  });
  process.exit(1);
} else {
  console.log('All IDs match.');
}
