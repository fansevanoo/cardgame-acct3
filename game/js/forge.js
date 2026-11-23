// RUNEFORGE — forge recipes. Playing two runes together fuses them into one
// stronger forged card. The pair's archetypes decide the result, order-free.
// Forging costs 1 energy on top of the forged card's own cost when played.
export const FORGE_RECIPES = {
  'Fire+Fire': { id: 'inferno', name: 'Inferno', arch: 'Fire', cost: 3, dmg: 10, rarity: 'epic', text: 'Deal 10 damage.' },
  'Fire+Iron': { id: 'blade-of-embers', name: 'Blade of Embers', arch: 'Fire', cost: 3, dmg: 7, block: 3, rarity: 'epic', text: 'Deal 7 damage. Gain 3 block.' },
  'Fire+Storm': { id: 'lightning-brand', name: 'Lightning Brand', arch: 'Storm', cost: 3, dmg: 8, draw: 1, rarity: 'epic', text: 'Deal 8 damage. Draw 1.' },
  'Iron+Iron': { id: 'bastion', name: 'Bastion', arch: 'Iron', cost: 2, block: 12, rarity: 'epic', text: 'Gain 12 block.' },
  'Iron+Storm': { id: 'tempest-forge', name: 'Tempest Forge', arch: 'Storm', cost: 3, dmg: 6, block: 5, rarity: 'epic', text: 'Deal 6 damage. Gain 5 block.' },
  'Storm+Storm': { id: 'maelstrom', name: 'Maelstrom', arch: 'Storm', cost: 3, dmg: 9, draw: 1, rarity: 'epic', text: 'Deal 9 damage. Draw 1.' },
};

export function forgeKey(a, b) {
  return [a, b].sort().join('+');
}

export function lookupForge(cardA, cardB) {
  if (!cardA || !cardB || cardA.id === cardB.id) return null;
  return FORGE_RECIPES[forgeKey(cardA.arch, cardB.arch)] ?? null;
}
