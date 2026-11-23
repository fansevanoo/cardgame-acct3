// RUNEFORGE — rules: playing cards, forging, damage, turns. Pure functions
// over the state object; render.js only reads, never mutates.
import { CARD_BY_ID } from './cards.js';
import { lookupForge, FORGE_RECIPES } from './forge.js';
import { MAX_ENERGY, drawCards } from './state.js';

export const FORGED_BY_ID = Object.fromEntries(Object.values(FORGE_RECIPES).map((c) => [c.id, c]));
export const ANY_CARD = { ...CARD_BY_ID, ...FORGED_BY_ID };

export function cardInHand(game, handIndex) {
  return ANY_CARD[game.player.hand[handIndex]] ?? null;
}

export function canAfford(game, card) {
  return card && game.player.energy >= card.cost;
}

export function applyCard(game, actor, card) {
  const self = actor === 'player' ? game.player : game.enemy;
  const foe = actor === 'player' ? game.enemy : game.player;
  if (card.shred) foe.block = Math.max(0, foe.block - card.shred);
  if (card.dmg) dealDamage(game, foe, card.dmg, card.pierce, actor);
  if (card.block) self.block += card.block;
  if (card.heal) self.life = Math.min(20, self.life + card.heal);
  if (card.energy) self.energy += card.energy;
  if (card.draw) drawCards(self, card.draw);
}

export function dealDamage(game, target, amount, pierce, actor) {
  let rest = amount;
  if (!pierce && target.block > 0) {
    const absorbed = Math.min(target.block, rest);
    target.block -= absorbed;
    rest -= absorbed;
  }
  target.life = Math.max(0, target.life - rest);
  game.lastDamage = { target: target === game.player ? 'player' : 'enemy', amount: rest, pierce: !!pierce, at: Date.now() };
  if (target.life <= 0) endDuel(game, actor);
}

export function playCard(game, handIndex) {
  const card = cardInHand(game, handIndex);
  if (!card || game.phase !== 'player' || game.screen !== 'table') return false;
  if (!canAfford(game, card)) return false;
  game.player.energy -= card.cost;
  game.player.hand.splice(handIndex, 1);
  game.player.discard.push(card.id);
  applyCard(game, 'player', card);
  game.selected = [];
  game.log.push(`You played ${card.name}.`);
  return true;
}

export function forgeSelected(game) {
  const [i, j] = game.selected;
  if (i === undefined || j === undefined || game.phase !== 'player') return null;
  const a = cardInHand(game, i);
  const b = cardInHand(game, j);
  const result = lookupForge(a, b);
  if (!result || game.player.energy < 1) return null;
  game.player.energy -= 1;
  const hi = Math.max(i, j), lo = Math.min(i, j);
  game.player.hand.splice(hi, 1);
  game.player.hand.splice(lo, 1);
  game.player.discard.push(a.id, b.id);
  game.player.hand.push(result.id);
  game.forgedCount += 1;
  game.selected = [game.player.hand.length - 1];
  game.log.push(`Forged ${a.name} + ${b.name} into ${result.name}!`);
  return result;
}

export function endPlayerTurn(game) {
  if (game.phase !== 'player' || game.screen !== 'table') return;
  game.phase = 'ai';
  game.selected = [];
  game.log.push('Ember Warden takes the anvil…');
}

export function startPlayerTurn(game) {
  game.turn += 1;
  game.phase = 'player';
  game.player.block = 0;
  game.enemy.block = 0;
  game.player.energy = MAX_ENERGY;
  drawCards(game.player, 1);
  game.log.push(`Turn ${game.turn} — draw a rune.`);
}

export function endDuel(game, winner) {
  game.phase = 'over';
  game.winner = winner;
  game.screen = winner === 'player' ? 'win' : 'loss';
  game.log.push(winner === 'player' ? 'Victory! The forge is yours.' : 'The Warden takes the forge…');
}
