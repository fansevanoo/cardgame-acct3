[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/fansevanoo/cardgame-acct3/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/fansevanoo/cardgame-acct3/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

# RUNEFORGE

A forge duel. Two smiths, thirty runes, one anvil. Each side has 20 life.
Cards are runes in three archetypes — **Fire** (damage), **Iron** (block and
heavy hits), **Storm** (draw and tempo). The twist: **forge** — play two
runes together to fuse them into a stronger forged card (Fire+Fire → Inferno,
Fire+Iron → Blade of Embers, Fire+Storm → Lightning Brand, Iron+Iron →
Bastion, Iron+Storm → Tempest Forge, Storm+Storm → Maelstrom). Every hand is
a puzzle of which pair to forge and which to save.

## How to run

Serve `game/` with any static server and open `game/index.html` in desktop
Chrome. For example, from this repo: `node serve.ts` is not included — use
`npx serve game` or `python3 -m http.server --directory game`. The game
loads zero network resources: all art is inline SVG/CSS, all sound is
synthesized WebAudio in code.

## Rules

- Each turn: draw 1 rune, gain 3 energy.
- Click a card to select it, then **Play** (or press Enter). Cards cost
  1–3 energy. Block absorbs damage; block resets at the start of your turn.
- Select **two** runes and press **Forge** (1 energy) to fuse them into a
  forged card, then play it like any card.
- End your turn and the Ember Warden answers with a heuristic AI (it scores
  every affordable play and forges when the fused card beats both runes apart).
- Reduce the Warden from 20 life to 0 to win. If your life hits 0, you lose.
- Keys: 1–7 select a card · Enter play / forge · Esc menu · R restart ·
  M mute. Mouse: hover enlarges a card, click to select.

## Structure

- `game/js/cards.js` — the 30 rune cards
- `game/js/forge.js` — forge recipes
- `game/js/state.js` — game state and setup
- `game/js/rules.js` — playing, forging, damage, turns
- `game/js/ai.js` — Warden heuristic
- `game/js/render.js` — screens and card frames
- `game/js/input.js` — mouse and keyboard
- `game/js/audio.js` — synthesized sound
- `game/js/main.js` — bootstrap and AI turn runner
