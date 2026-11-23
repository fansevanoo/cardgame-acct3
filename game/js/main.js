// RUNEFORGE — bootstrap. Wires state + rules + AI + render + input, runs the
// AI turn with delays, and stages fixed screens for screenshots (?screen=
// title|table|win|loss, ?seed=N). Default load is the normal title screen.
import { newGame, startDuel, drawCards } from './state.js';
import { playCard, forgeSelected, endPlayerTurn, startPlayerTurn, applyCard, endDuel } from './rules.js';
import { ANY_CARD } from './rules.js';
import { lookupForge } from './forge.js';
import { chooseAiMoves } from './ai.js';
import { render } from './render.js';
import { bindInput } from './input.js';
import { sfx, setMuted } from './audio.js';

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') ?? Date.now() % 2147483647);
const game = newGame(seed);
window.__game = game;
window.__api = { playCard, forgeSelected, endPlayerTurn, startPlayerTurn, chooseAiMoves, render };
window.__cards = ANY_CARD;
window.__lookupForge = lookupForge;

let aiTimer = null;

function refresh() { render(game); }

function afterDamageCheck() {
  // Clear the floating damage number once its animation is done.
  setTimeout(refresh, 1700);
}

const hooks = {
  afterAction(kind) {
    if (kind === 'select') sfx.click();
    refresh();
  },
  startDuel() {
    sfx.play();
    startDuel(game);
    game.showHelp = !game.seenHelp;
    game.seenHelp = true;
    refresh();
  },
  playSelected() {
    const idx = game.selected[0];
    const card = ANY_CARD[game.player.hand[idx]];
    if (!card) return;
    const ok = playCard(game, idx);
    if (ok) {
      if (card.dmg) { sfx.hit(); document.getElementById('app').classList.add('hit-shake'); setTimeout(() => document.getElementById('app').classList.remove('hit-shake'), 400); }
      else sfx.play();
      afterDamageCheck();
    }
    refresh();
  },
  forgeSelected() {
    const result = forgeSelected(game);
    if (result) { sfx.forge(); refresh(); }
  },
  endTurn() {
    endPlayerTurn(game);
    refresh();
    runAiTurn();
  },
  restart() {
    clearTimeout(aiTimer);
    const keepMuted = game.muted;
    const fresh = newGame(seed);
    Object.assign(game, fresh);
    game.muted = keepMuted;
    setMuted(keepMuted);
    startDuel(game);
    refresh();
  },
  toTitle() {
    clearTimeout(aiTimer);
    const fresh = newGame(seed);
    Object.assign(game, fresh);
    game.screen = 'title';
    refresh();
  },
};

function executeAiMove(move) {
  const e = game.enemy;
  if (move.type === 'play') {
    const id = e.hand[move.handIndex];
    const card = ANY_CARD[id];
    if (!card || card.cost > e.energy) return;
    e.energy -= card.cost;
    e.hand.splice(move.handIndex, 1);
    e.discard.push(id);
    applyCard(game, 'enemy', card);
    game.log.push(`Warden plays ${card.name}.`);
    if (card.dmg) sfx.hit(); else sfx.play();
  } else {
    const a = ANY_CARD[e.hand[move.i]];
    const b = ANY_CARD[e.hand[move.j]];
    const fused = lookupForge(a, b);
    if (!fused || e.energy < 1) return;
    e.energy -= 1;
    e.hand.splice(Math.max(move.i, move.j), 1);
    e.hand.splice(Math.min(move.i, move.j), 1);
    e.discard.push(a.id, b.id);
    e.hand.push(fused.id);
    game.log.push(`Warden forges ${fused.name}!`);
    sfx.forge();
  }
  refresh();
  afterDamageCheck();
}

function runAiTurn() {
  drawCards(game.enemy, 1);
  game.enemy.energy = 3;
  const moves = chooseAiMoves(game);
  let step = 0;
  const tick = () => {
    if (game.screen !== 'table' || game.phase !== 'ai') return;
    if (step >= moves.length) {
      startPlayerTurn(game);
      refresh();
      return;
    }
    executeAiMove(moves[step]);
    step += 1;
    aiTimer = setTimeout(tick, 750);
  };
  aiTimer = setTimeout(tick, 650);
}

// ---- staged screens for screenshots (deterministic, ?seed=7) ----
function stageTable() {
  startDuel(game);
  game.turn = 4;
  game.player.life = 16; game.player.block = 3; game.player.energy = 3;
  game.enemy.life = 14; game.enemy.block = 2;
  game.player.hand = ['ember-spark', 'flame-lash', 'iron-wall', 'gale-draw', 'stormcall'];
  game.enemy.hand = ['pyrebrand', 'anvil-guard', 'thunderhead', 'bulwark', 'arc-surge'];
  game.player.deck = game.player.deck.slice(0, 18);
  game.enemy.deck = game.enemy.deck.slice(0, 19);
  game.player.discard = ['ashen-bolt', 'rivet-shield', 'wind-shear'];
  game.enemy.discard = ['kindle', 'steel-plate'];
  game.selected = [0, 2]; // Ember Spark + Iron Wall -> Blade of Embers preview
  game.log = [
    'Turn 3 — Warden played Hammerfall.',
    'You forged Lightning Brand!',
    'Turn 4 — draw a rune.',
    'The forge is hot. Pick your pair.',
  ];
}

function stageEnd(won) {
  startDuel(game);
  game.turn = won ? 7 : 6;
  game.forgedCount = won ? 3 : 1;
  if (won) { game.enemy.life = 0; game.player.life = 12; endDuel(game, 'player'); }
  else { game.player.life = 0; game.enemy.life = 9; endDuel(game, 'enemy'); }
}

bindInput(game, hooks);
const screen = params.get('screen');
if (screen === 'table') stageTable();
else if (screen === 'win') stageEnd(true);
else if (screen === 'loss') stageEnd(false);
refresh();
