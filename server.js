/* ============================================================
   StormZone 3D — squad relay server
   ------------------------------------------------------------
   Lets friends play co-op waves or free-for-all together.

   SETUP (one time):
     1. Install Node.js  (https://nodejs.org)
     2. In this folder run:   npm init -y && npm install ws
     3. Start it:             node server.js
   It listens on ws://localhost:8080 by default.

   PLAY:
     - Everyone opens index.html in their browser.
     - Open "Squad", set the server address, Create a squad,
       share the 6-char code, friends Join, host hits Start.

   PLAY OVER THE INTERNET (not just same PC):
     - Run this on a host machine and forward port 8080, or
       deploy to any host (Render/Railway/Fly/a VPS) and use
       that wss:// address in the game's Squad screen.
   ============================================================ */

const PORT = process.env.PORT || 8080;
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: PORT });

const rooms = new Map(); // code -> { host: ws, clients: Set<ws> }

function code() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 6; i++) c += A[Math.floor(Math.random() * A.length)];
  return rooms.has(c) ? code() : c;
}

function members(room) {
  return [...room.clients].map(c => c.pid);
}

function broadcast(room, msg, except) {
  const data = JSON.stringify(msg);
  for (const c of room.clients) {
    if (c !== except && c.readyState === WebSocket.OPEN) c.send(data);
  }
}

function leave(ws) {
  const room = rooms.get(ws.room);
  if (!room) return;
  room.clients.delete(ws);
  broadcast(room, { t: "left", id: ws.pid });
  if (ws === room.host) {
    // promote next member to host
    const next = [...room.clients][0];
    if (next) { room.host = next; next.send(JSON.stringify({ t: "joined", code: ws.room, host: true, members: members(room) })); }
  }
  if (room.clients.size === 0) rooms.delete(ws.room);
  else broadcast(room, { t: "members", members: members(room) });
  ws.room = null;
}

wss.on("connection", ws => {
  ws.on("message", raw => {
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    ws.pid = m.id || ws.pid;

    switch (m.t) {
      case "create": {
        const c = code();
        rooms.set(c, { host: ws, clients: new Set([ws]) });
        ws.room = c;
        ws.send(JSON.stringify({ t: "made", code: c, members: members(rooms.get(c)) }));
        break;
      }
      case "join": {
        const room = rooms.get((m.joinCode || "").toUpperCase());
        if (!room) { ws.send(JSON.stringify({ t: "error", msg: "No such squad" })); return; }
        room.clients.add(ws);
        ws.room = m.joinCode.toUpperCase();
        ws.send(JSON.stringify({ t: "joined", code: ws.room, host: false, members: members(room) }));
        broadcast(room, { t: "members", members: members(room) }, ws);
        break;
      }
      case "leave":
        leave(ws);
        break;
      case "start": {
        const room = rooms.get(ws.room);
        if (room && room.host === ws) broadcast(room, { t: "start", mode: m.mode || "team" });
        break;
      }
      case "state": {
        const room = rooms.get(ws.room);
        if (room) broadcast(room, { t: "state", id: ws.pid, x: m.x, y: m.y, z: m.z, yaw: m.yaw, hp: m.hp }, ws);
        break;
      }
      case "hit": {
        const room = rooms.get(ws.room);
        if (room) broadcast(room, { t: "hit", target: m.target, dmg: m.dmg });
        break;
      }
      case "shoot": {
        const room = rooms.get(ws.room);
        if (room) broadcast(room, { t: "shoot", id: ws.pid }, ws);
        break;
      }
    }
  });

  ws.on("close", () => leave(ws));
});

console.log("StormZone squad server running on ws://localhost:" + PORT);
