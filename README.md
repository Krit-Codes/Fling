# StormZone 3D

A first-person 3D arena shooter. Survive waves, launch enemies into the air and
shred them before they land, earn coins, and pour them into permanent upgrades.
Play solo or with friends.

## Play
Just open **index.html** in any modern browser (Chrome/Edge/Firefox).
Click the screen to lock the mouse and play. Press **Esc** to pause.

Your coins and upgrades save automatically in the browser.

## Controls
- **W A S D** — move
- **Mouse** — look / aim
- **Left click** — shoot (hold for automatic fire)
- **R** — reload (20 rounds, 3s)
- **Space** — jump (tap again to double jump; buy more jumps in Upgrades)
- **Shift** — dash (10s cooldown, reducible)
- **Esc** — pause

## The launch mechanic
Hit an enemy and it pops up into the air. While it's airborne it keeps taking
your bullet damage — and takes extra **fall damage** when it slams down. The
higher you keep it up, the harder the landing. The **Knockup** upgrade launches
them higher.

## Maps
Six zones with their own look and obstacle layout: Verdant Arena, Neon Grid,
Magma Pit, Glacier, Orbital Deck, and Demon Gate. Pick one on the menu.

## Upgrades (buy with coins)
Extra jumps, dash recharge, vitality, firepower, sprint legs, big mag, fast
hands (reload), nanoweave (regen), spring boots (jump height), lucky strike
(coins), knockup (launch height), and vampire (heal on kill). All permanent and
stack across runs.

## Play with friends (squads)
Online play uses the included **server.js** as a relay.

1. Install [Node.js](https://nodejs.org).
2. In this folder: `npm init -y && npm install ws`
3. Start the server: `node server.js`  (listens on `ws://localhost:8080`)
4. Everyone opens index.html → **Squad** → set the server address →
   **Create squad**, share the 6-character code, friends **Join**, host hits
   **Start**.

Modes: **Co-op waves** (fight enemies together) or **Free-for-all** (fight each
other — shooting another player damages them).

To play across the internet rather than one PC, run the server on a host with
port 8080 forwarded, or deploy it to any Node host (Render, Railway, Fly, a VPS)
and use that `wss://` address in the Squad screen.
