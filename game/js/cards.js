// RUNEFORGE — card data. 30 distinct rune cards in 3 archetypes (Fire, Iron, Storm).
// Effect fields: dmg (damage to enemy), block (shield for self), draw (cards drawn),
// heal (life restored), energy (energy gained), pierce (ignores block).
// Cost is energy. Rarity: common < rare < epic (frame colour only).
export const ARCHETYPES = {
  Fire: { color: '#e8632c', glow: '#ff9a3d', icon: 'flame' },
  Iron: { color: '#8fa3b8', glow: '#c8d6e5', icon: 'anvil' },
  Storm: { color: '#7b6fd0', glow: '#b3a6ff', icon: 'bolt' },
};

export const CARDS = [
  // ---- Fire: raw damage ----
  { id: 'ember-spark', name: 'Ember Spark', arch: 'Fire', cost: 1, dmg: 3, rarity: 'common', text: 'Deal 3 damage.' },
  { id: 'ashen-bolt', name: 'Ashen Bolt', arch: 'Fire', cost: 1, dmg: 2, draw: 1, rarity: 'common', text: 'Deal 2 damage. Draw 1.' },
  { id: 'kindle', name: 'Kindle', arch: 'Fire', cost: 1, dmg: 2, energy: 1, rarity: 'common', text: 'Deal 2 damage. Gain 1 energy.' },
  { id: 'flame-lash', name: 'Flame Lash', arch: 'Fire', cost: 2, dmg: 5, rarity: 'common', text: 'Deal 5 damage.' },
  { id: 'cinder-burst', name: 'Cinder Burst', arch: 'Fire', cost: 2, dmg: 4, draw: 1, rarity: 'rare', text: 'Deal 4 damage. Draw 1.' },
  { id: 'scorch', name: 'Scorch', arch: 'Fire', cost: 2, dmg: 5, pierce: true, rarity: 'rare', text: 'Deal 5 damage. Pierces block.' },
  { id: 'pyrebrand', name: 'Pyrebrand', arch: 'Fire', cost: 3, dmg: 7, rarity: 'rare', text: 'Deal 7 damage.' },
  { id: 'molten-rain', name: 'Molten Rain', arch: 'Fire', cost: 3, dmg: 5, shred: 3, rarity: 'rare', text: 'Deal 5 damage. Strip 3 block.' },
  { id: 'wildfire', name: 'Wildfire', arch: 'Fire', cost: 3, dmg: 6, draw: 1, rarity: 'epic', text: 'Deal 6 damage. Draw 1.' },
  { id: 'dragons-breath', name: "Dragon's Breath", arch: 'Fire', cost: 3, dmg: 8, rarity: 'epic', text: 'Deal 8 damage.' },
  // ---- Iron: block and heavy hits ----
  { id: 'iron-wall', name: 'Iron Wall', arch: 'Iron', cost: 1, block: 4, rarity: 'common', text: 'Gain 4 block.' },
  { id: 'rivet-shield', name: 'Rivet Shield', arch: 'Iron', cost: 1, block: 5, rarity: 'common', text: 'Gain 5 block.' },
  { id: 'steel-plate', name: 'Steel Plate', arch: 'Iron', cost: 1, block: 3, draw: 1, rarity: 'common', text: 'Gain 3 block. Draw 1.' },
  { id: 'anvil-guard', name: 'Anvil Guard', arch: 'Iron', cost: 2, block: 7, rarity: 'common', text: 'Gain 7 block.' },
  { id: 'hammerfall', name: 'Hammerfall', arch: 'Iron', cost: 2, dmg: 4, block: 3, rarity: 'rare', text: 'Deal 4 damage. Gain 3 block.' },
  { id: 'ironclad', name: 'Ironclad', arch: 'Iron', cost: 2, dmg: 3, block: 5, rarity: 'rare', text: 'Deal 3 damage. Gain 5 block.' },
  { id: 'quench', name: 'Quench', arch: 'Iron', cost: 2, block: 6, heal: 2, rarity: 'rare', text: 'Gain 6 block. Heal 2.' },
  { id: 'bulwark', name: 'Bulwark', arch: 'Iron', cost: 3, block: 10, rarity: 'rare', text: 'Gain 10 block.' },
  { id: 'titans-grip', name: "Titan's Grip", arch: 'Iron', cost: 3, dmg: 6, block: 4, rarity: 'epic', text: 'Deal 6 damage. Gain 4 block.' },
  { id: 'forge-slam', name: 'Forge Slam', arch: 'Iron', cost: 3, dmg: 8, block: 2, rarity: 'epic', text: 'Deal 8 damage. Gain 2 block.' },
  // ---- Storm: draw and tempo ----
  { id: 'gale-draw', name: 'Gale Draw', arch: 'Storm', cost: 1, draw: 2, rarity: 'common', text: 'Draw 2 cards.' },
  { id: 'tempest-eye', name: 'Tempest Eye', arch: 'Storm', cost: 1, draw: 1, energy: 1, rarity: 'common', text: 'Draw 1. Gain 1 energy.' },
  { id: 'wind-shear', name: 'Wind Shear', arch: 'Storm', cost: 1, dmg: 3, rarity: 'common', text: 'Deal 3 damage.' },
  { id: 'static-charge', name: 'Static Charge', arch: 'Storm', cost: 1, dmg: 2, draw: 1, rarity: 'common', text: 'Deal 2 damage. Draw 1.' },
  { id: 'stormcall', name: 'Stormcall', arch: 'Storm', cost: 2, dmg: 3, draw: 1, rarity: 'rare', text: 'Deal 3 damage. Draw 1.' },
  { id: 'lightning-rod', name: 'Lightning Rod', arch: 'Storm', cost: 2, dmg: 4, energy: 1, rarity: 'rare', text: 'Deal 4 damage. Gain 1 energy.' },
  { id: 'cloudburst', name: 'Cloudburst', arch: 'Storm', cost: 2, heal: 3, draw: 1, rarity: 'rare', text: 'Heal 3. Draw 1.' },
  { id: 'eye-of-storm', name: 'Eye of the Storm', arch: 'Storm', cost: 2, dmg: 3, block: 4, rarity: 'rare', text: 'Deal 3 damage. Gain 4 block.' },
  { id: 'thunderhead', name: 'Thunderhead', arch: 'Storm', cost: 3, dmg: 6, draw: 1, rarity: 'epic', text: 'Deal 6 damage. Draw 1.' },
  { id: 'arc-surge', name: 'Arc Surge', arch: 'Storm', cost: 3, dmg: 5, energy: 2, rarity: 'epic', text: 'Deal 5 damage. Gain 2 energy.' },
];

export const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

export function buildDeck(rng) {
  const deck = CARDS.map((c) => c.id);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
