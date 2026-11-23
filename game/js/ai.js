// RUNEFORGE — opponent AI. Heuristic scoring, never random: every affordable
// card is scored, the best play is taken, and forging is weighed against
// playing the two runes apart. Reads the same rules the player uses.
import { ANY_CARD } from './rules.js';
import { lookupForge } from './forge.js';

function scoreCard(game, card, me, foe) {
  let s = 0;
  if (card.dmg) {
    const lethal = card.dmg >= foe.life + foe.block ? 100 : 0;
    s += card.dmg * 1.2 + lethal;
  }
  if (card.block) s += card.block * (me.life <= 8 ? 1.1 : 0.7);
  if (card.draw) s += card.draw * 1.6;
  if (card.heal) s += card.heal * (me.life < 14 ? 1.0 : 0.3);
  if (card.energy) s += card.energy * 1.4;
  if (card.shred) s += card.shred * 0.4;
  if (card.pierce) s += 1.5;
  return s - card.cost * 0.4;
}

export function chooseAiMoves(game) {
  // Simulate on a copy of the AI's hand/energy; returns a list of actions:
  // {type:'play', handIndex} or {type:'forge', i, j}. Runs synchronously;
  // main.js animates the list one action at a time.
  const moves = [];
  let hand = [...game.enemy.hand];
  let energy = game.enemy.energy;
  const me = game.enemy, foe = game.player;
  for (;;) {
    let best = null;
    for (let i = 0; i < hand.length; i++) {
      const card = ANY_CARD[hand[i]];
      if (!card || card.cost > energy) continue;
      const s = scoreCard(game, card, me, foe);
      if (s > 1 && (!best || s > best.score)) best = { score: s, action: { type: 'play', handIndex: i } };
    }
    // Forge: only when the fused card beats playing both runes apart.
    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        const a = ANY_CARD[hand[i]], b = ANY_CARD[hand[j]];
        const fused = lookupForge(a, b);
        if (!fused || energy < 1 + fused.cost) continue;
        const fusedScore = scoreCard(game, fused, me, foe) - 1;
        const apart = scoreCard(game, a, me, foe) + scoreCard(game, b, me, foe);
        if (fusedScore > apart + 2 && (!best || fusedScore > best.score)) {
          best = { score: fusedScore, action: { type: 'forge', i, j } };
        }
      }
    }
    if (!best) break;
    moves.push(best.action);
    if (best.action.type === 'play') {
      energy -= ANY_CARD[hand[best.action.handIndex]].cost;
      hand.splice(best.action.handIndex, 1);
    } else {
      energy -= 1;
      const { i, j } = best.action;
      const fused = lookupForge(ANY_CARD[hand[i]], ANY_CARD[hand[j]]);
      hand.splice(Math.max(i, j), 1);
      hand.splice(Math.min(i, j), 1);
      hand.push(fused.id);
    }
    if (moves.length >= 6) break;
  }
  return moves;
}
