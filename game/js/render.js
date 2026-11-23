// RUNEFORGE — rendering. Builds the whole screen as HTML strings from state;
// input.js owns every event (delegation on #app), so re-renders never drop
// handlers. Screens: title, table, win, loss. Overlays: help, menu.
import { ARCHETYPES } from './cards.js';
import { ANY_CARD } from './rules.js';
import { lookupForge } from './forge.js';

const ICONS = {
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 3-2 4-2 7 0 1.5 1 2.5 2 2.5S14 10 13 9c2 1 3 3 3 5a5 5 0 0 1-10 0c0-4 4-6 6-12z" fill="currentColor"/></svg>',
  anvil: '<svg viewBox="0 0 24 24"><path d="M4 7h16v3h-5l-1 3h3v2H7v-2h3l-1-3H4zM8 17h8v2H8z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21C7 16.5 2 13 2 8.5 2 5.5 4.5 3 7.5 3c1.7 0 3.3.9 4.5 2.5C13.2 3.9 14.8 3 16.5 3 19.5 3 22 5.5 22 8.5c0 4.5-5 8-10 12.5z" fill="currentColor"/></svg>',
};

function icon(name) { return ICONS[name] || ''; }

export function cardHTML(card, opts = {}) {
  const arch = ARCHETYPES[card.arch];
  const rare = card.rarity === 'epic' ? 'epic' : card.rarity === 'rare' ? 'rare' : '';
  const stats = [];
  if (card.dmg) stats.push(`⚔ ${card.dmg}${card.pierce ? ' pierce' : ''}`);
  if (card.block) stats.push(`🛡 ${card.block}`);
  if (card.draw) stats.push(`↻ ${card.draw}`);
  if (card.heal) stats.push(`✚ ${card.heal}`);
  if (card.energy) stats.push(`✦ +${card.energy}`);
  if (card.shred) stats.push(`−${card.shred} block`);
  const sel = opts.selected ? ' selected' : '';
  const dis = opts.disabled ? ' disabled' : '';
  const idx = opts.index !== undefined ? ` data-hand="${opts.index}"` : '';
  return `<div class="card ${rare}${sel}${dis}" style="--arch:${arch.color};--glow:${arch.glow}"${idx}>
    <div class="card-cost">${card.cost}</div>
    <div class="card-arch" style="color:${arch.glow}">${icon(arch.icon)}<span>${card.arch}</span></div>
    <div class="card-art" style="color:${arch.glow}">${icon(arch.icon)}</div>
    <div class="card-name">${card.name}</div>
    <div class="card-stats">${stats.join(' · ') || '—'}</div>
    <div class="card-text">${card.text}</div>
  </div>`;
}

function cardBackHTML() {
  return `<div class="card back"><div class="card-back-mark">ᚱ</div><div class="card-back-word">RUNEFORGE</div></div>`;
}

function lifeHTML(side, label, isPlayer) {
  return `<div class="life-box ${isPlayer ? 'you' : 'foe'}">
    <div class="life-label">${label}</div>
    <div class="life-row"><span class="life-heart">${icon('heart')}</span><span class="life-num">${side.life}</span>
    ${side.block > 0 ? `<span class="block-num">${icon('shield')} ${side.block}</span>` : ''}</div>
    <div class="life-sub">${isPlayer ? 'Your life' : 'Warden life'} · 20 max</div>
  </div>`;
}

function forgePanelHTML(game) {
  const sel = game.selected;
  if (sel.length === 2) {
    const a = ANY_CARD[game.player.hand[sel[0]]];
    const b = ANY_CARD[game.player.hand[sel[1]]];
    const result = lookupForge(a, b);
    if (result) {
      return `<div class="forge-panel ready">
        <div class="forge-title">⚒ FORGE READY</div>
        <div class="forge-pair">${a.name} + ${b.name}</div>
        <div class="forge-result">${cardHTML(result)}</div>
        <div class="forge-note">Costs 1 energy to forge, then play it like any card.</div>
      </div>`;
    }
    return `<div class="forge-panel"><div class="forge-title">⚒ FORGE</div><div class="forge-note">Those two runes refuse to fuse. Pick another pair.</div></div>`;
  }
  if (sel.length === 1) {
    return `<div class="forge-panel"><div class="forge-title">⚒ FORGE</div><div class="forge-note">Pick a second rune to forge with <b>${ANY_CARD[game.player.hand[sel[0]]].name}</b>.<br>Fire+Fire, Fire+Iron, Fire+Storm,<br>Iron+Iron, Iron+Storm, Storm+Storm.</div></div>`;
  }
  return `<div class="forge-panel"><div class="forge-title">⚒ FORGE</div><div class="forge-note">Select TWO runes in your hand to fuse them into a stronger forged card. Forging costs 1 energy.</div></div>`;
}

function renderTitle(game) {
  return `<div class="screen title-screen">
    <div class="title-glow"></div>
    <div class="title-word">ᚱ RUNEFORGE ᚱ</div>
    <div class="title-tag">Two smiths. Thirty runes. One anvil — forge your pair and break the Warden.</div>
    <div class="title-buttons">
      <button class="btn big" data-action="start">⚒ START DUEL</button>
      <button class="btn" data-action="help">HOW TO PLAY</button>
    </div>
    <div class="title-foot">A forge duel · 20 life each · 3 energy a turn · forge two runes into one</div>
    ${game.showHelp ? helpOverlayHTML() : ''}
  </div>`;
}

export function helpOverlayHTML() {
  return `<div class="overlay" data-action="close-help">
    <div class="panel">
      <h2>HOW TO PLAY</h2>
      <p><b>Goal:</b> reduce the Ember Warden from 20 life to 0 before yours hits 0.</p>
      <p><b>Each turn:</b> draw 1 rune, gain 3 energy. Click a card to select it, then <b>Play</b> (or press Enter). End your turn and the Warden answers.</p>
      <p><b>Forge:</b> select TWO runes, then press <b>Forge</b> (1 energy). Fire+Fire → Inferno, Fire+Iron → Blade of Embers, Fire+Storm → Lightning Brand, Iron+Iron → Bastion, Iron+Storm → Tempest Forge, Storm+Storm → Maelstrom.</p>
      <p><b>Keys:</b> 1–7 select a card · Enter play / forge · Esc menu · R restart · M mute.</p>
      <button class="btn big" data-action="close-help">GOT IT</button>
    </div>
  </div>`;
}

function renderTable(game) {
  const p = game.player, e = game.enemy;
  const enemyHand = Array.from({ length: e.hand.length }, () => cardBackHTML()).join('');
  const playerHand = p.hand.map((id, i) => {
    const card = ANY_CARD[id];
    return cardHTML(card, { index: i, selected: game.selected.includes(i), disabled: game.phase !== 'player' || card.cost > p.energy });
  }).join('');
  const energy = Array.from({ length: 3 }, (_, i) => `<span class="pip${i < p.energy ? ' on' : ''}">✦</span>`).join('');
  const turnText = game.phase === 'player' ? 'YOUR TURN' : game.phase === 'ai' ? 'WARDEN’S TURN…' : 'DUEL OVER';
  const dmg = game.lastDamage && Date.now() - game.lastDamage.at < 1600
    ? `<div class="floater ${game.lastDamage.target}">${game.lastDamage.amount > 0 ? '−' + game.lastDamage.amount : 'BLOCKED'}</div>` : '';
  const shake = game.lastDamage && Date.now() - game.lastDamage.at < 500 && game.lastDamage.amount >= 5 ? ' shake' : '';
  return `<div class="screen table-screen${shake}">
    <div class="topbar">
      ${lifeHTML(e, 'EMBER WARDEN', false)}
      <div class="turn-box"><div class="turn-num">TURN ${game.turn}</div><div class="turn-ind ${game.phase}">${turnText}</div></div>
      <div class="piles"><div class="pile">📚 Deck<br><b>${e.deck.length}</b></div><div class="pile">🗑 Discard<br><b>${e.discard.length}</b></div></div>
    </div>
    <div class="enemy-hand">${enemyHand}</div>
    <div class="midrow">
      <div class="mid-left">${forgePanelHTML(game)}</div>
      <div class="mid-log"><div class="log-title">FORGE LOG</div>${game.log.slice(-4).map((l) => `<div>${l}</div>`).join('')}</div>
      <div class="mid-right">
        <div class="piles"><div class="pile">📚 Deck<br><b>${p.deck.length}</b></div><div class="pile">🗑 Discard<br><b>${p.discard.length}</b></div></div>
      </div>
    </div>
    <div class="player-row">
      ${lifeHTML(p, 'YOU', true)}
      <div class="energy-box"><div class="energy-label">ENERGY</div><div class="energy-pips">${energy}</div></div>
      <div class="actions">
        <button class="btn" data-action="play" ${game.selected.length === 1 ? '' : 'disabled'}>▶ PLAY</button>
        <button class="btn forge" data-action="forge" ${game.selected.length === 2 ? '' : 'disabled'}>⚒ FORGE</button>
        <button class="btn end" data-action="end-turn" ${game.phase === 'player' ? '' : 'disabled'}>END TURN ⏎</button>
      </div>
      <div class="sys-buttons">
        <button class="btn small" data-action="toggle-mute">${game.muted ? '🔇 MUTED' : '🔊 SOUND'}</button>
        <button class="btn small" data-action="menu">☰ MENU</button>
      </div>
    </div>
    <div class="player-hand">${playerHand}</div>
    ${dmg}
    ${game.showHelp ? helpOverlayHTML() : ''}
    ${game.menuOpen ? `<div class="overlay"><div class="panel"><h2>PAUSED</h2>
      <button class="btn big" data-action="close-menu">RESUME</button>
      <button class="btn" data-action="restart">↻ RESTART DUEL</button>
      <button class="btn" data-action="help">HOW TO PLAY</button>
      <button class="btn" data-action="to-title">TITLE SCREEN</button></div></div>` : ''}
  </div>`;
}

function renderEnd(game, won) {
  const title = won ? '⚒ VICTORY ⚒' : 'THE FORGE GOES DARK';
  const sub = won
    ? 'The Ember Warden kneels. Your runes sang true — the anvil is yours.'
    : 'The Warden’s hammer falls last. Your runes scatter cold across the floor.';
  const stats = `Turns: ${game.turn} · Forged: ${game.forgedCount} · Your life: ${game.player.life} · Warden life: ${game.enemy.life}`;
  return `<div class="screen ${won ? 'win-screen' : 'loss-screen'}">
    <div class="end-word">${title}</div>
    <div class="end-sub">${sub}</div>
    <div class="end-stats">${stats}</div>
    <div class="title-buttons">
      <button class="btn big" data-action="restart">↻ FORGE AGAIN</button>
      <button class="btn" data-action="to-title">TITLE SCREEN</button>
    </div>
  </div>`;
}

export function render(game) {
  const app = document.getElementById('app');
  if (!app) return;
  if (game.screen === 'title') app.innerHTML = renderTitle(game);
  else if (game.screen === 'table') app.innerHTML = renderTable(game);
  else if (game.screen === 'win') app.innerHTML = renderEnd(game, true);
  else app.innerHTML = renderEnd(game, false);
  document.title = game.screen === 'table' ? `RUNEFORGE — Turn ${game.turn}` : 'RUNEFORGE';
}
