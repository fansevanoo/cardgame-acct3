// RUNEFORGE — game state. One plain object, no framework. Screens:
// 'title' | 'table' | 'win' | 'loss'. A seeded RNG makes staged states
// (screenshots, playtests) reproducible; normal play seeds from the clock.
export const START_LIFE = 20;
export const MAX_ENERGY = 3;
export const MAX_HAND = 7;

import { buildDeck } from './cards.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newSide(deck) {
  return { life: START_LIFE, block: 0, energy: MAX_ENERGY, deck: [...deck], hand: [], discard: [] };
}

export function newGame(seed) {
  const rng = mulberry32(seed);
  const game = {
    seed,
    rng,
    screen: 'title',
    turn: 1,
    phase: 'player', // 'player' | 'ai' | 'over'
    player: newSide(buildDeck(rng)),
    enemy: newSide(buildDeck(rng)),
    selected: [], // hand indexes selected for play/forge
    log: [],
    lastDamage: null,
    winner: null,
    muted: false,
    showHelp: false,
    forgedCount: 0,
  };
  return game;
}

// Injected by main.js to avoid a circular import (cards.js has no imports).

export function drawCards(side, n) {
  for (let i = 0; i < n; i++) {
    if (side.deck.length === 0) {
      if (side.discard.length === 0) return;
      side.deck = side.discard.splice(0);
      for (let j = side.deck.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [side.deck[j], side.deck[k]] = [side.deck[k], side.deck[j]];
      }
    }
    if (side.hand.length >= MAX_HAND) { side.discard.push(side.deck.pop()); continue; }
    side.hand.push(side.deck.pop());
  }
}

export function startDuel(game) {
  game.screen = 'table';
  game.phase = 'player';
  game.turn = 1;
  game.winner = null;
  game.log = ['The forge is lit. Your move, smith.'];
  drawCards(game.player, 4);
  drawCards(game.enemy, 4);
  game.player.energy = MAX_ENERGY;
}
