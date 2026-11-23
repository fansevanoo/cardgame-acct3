// RUNEFORGE — input. One delegated click handler on #app plus keyboard.
// All game mutations go through rules.js / main.js callbacks; this file only
// translates gestures into actions.
import { playCard, forgeSelected, endPlayerTurn } from './rules.js';
import { sfx, setMuted } from './audio.js';

export function bindInput(game, hooks) {
  const app = document.getElementById('app');

  app.addEventListener('click', (ev) => {
    const cardEl = ev.target.closest('[data-hand]');
    if (cardEl && game.screen === 'table' && game.phase === 'player') {
      const i = Number(cardEl.dataset.hand);
      toggleSelect(game, i);
      hooks.afterAction('select');
      return;
    }
    const btn = ev.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    sfx.click();
    if (action === 'start') hooks.startDuel();
    else if (action === 'help') { game.showHelp = true; hooks.afterAction('help'); }
    else if (action === 'close-help') { game.showHelp = false; hooks.afterAction('help'); }
    else if (action === 'play') { if (game.selected.length === 1) hooks.playSelected(); }
    else if (action === 'forge') { hooks.forgeSelected(); }
    else if (action === 'end-turn') { hooks.endTurn(); }
    else if (action === 'toggle-mute') { game.muted = !game.muted; setMuted(game.muted); hooks.afterAction('mute'); }
    else if (action === 'menu') { game.menuOpen = true; hooks.afterAction('menu'); }
    else if (action === 'close-menu') { game.menuOpen = false; hooks.afterAction('menu'); }
    else if (action === 'restart') { game.menuOpen = false; hooks.restart(); }
    else if (action === 'to-title') { game.menuOpen = false; hooks.toTitle(); }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (game.showHelp) { game.showHelp = false; hooks.afterAction('help'); }
      else if (game.screen === 'table') { game.menuOpen = !game.menuOpen; hooks.afterAction('menu'); }
      return;
    }
    if (ev.key === 'm' || ev.key === 'M') { game.muted = !game.muted; setMuted(game.muted); hooks.afterAction('mute'); return; }
    if (ev.key === 'r' || ev.key === 'R') {
      if (game.screen === 'table' || game.screen === 'win' || game.screen === 'loss') hooks.restart();
      return;
    }
    if (game.screen !== 'table' || game.phase !== 'player') return;
    const n = Number(ev.key);
    if (n >= 1 && n <= game.player.hand.length) {
      toggleSelect(game, n - 1);
      hooks.afterAction('select');
    } else if (ev.key === 'Enter') {
      if (game.selected.length === 2) hooks.forgeSelected();
      else if (game.selected.length === 1) hooks.playSelected();
      else hooks.endTurn();
    }
  });
}

function toggleSelect(game, i) {
  const at = game.selected.indexOf(i);
  if (at >= 0) game.selected.splice(at, 1);
  else if (game.selected.length < 2) game.selected.push(i);
  else game.selected = [i];
}
