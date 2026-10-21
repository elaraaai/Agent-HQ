# Agent HQ

A live 3D office dashboard for AI agent teams — 8 teams, 31 agents, one Data Center.

The floor is a ring of team islands around a server-rack Data Center, with a
Director's cabin, cartoon agents who type at their desks and walk the glowing
paths, and paper planes carrying handoffs between teams. Orders are typed
(text-based): give the office an order and watch the teams work; anything
waiting on the Director raises a hand. All activity on the floor is a live
simulation.

Files: `index.html` (page, styles, markup), `app.js` (the office logic),
`three.min.js` (Three.js library). The page loads both scripts from this
repo through the jsDelivr CDN, so it also runs when deployed on its own —
the live site is on Vercel.
