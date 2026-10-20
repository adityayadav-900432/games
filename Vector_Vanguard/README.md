# Vector Vanguard

A complete Computer Graphics arcade game built with HTML5 Canvas, CSS and vanilla JavaScript.

## Run
Open `index.html` in a modern browser.

## Gameplay
You pilot a vector interceptor in a procedural asteroid field.
- W / Up: thrust
- A / D / Left / Right: rotate
- Space: fire
- P: pause
- Esc: main menu

## Graphics concepts
- Local-to-world transformations
- Translation and rotation
- Geometric primitives and polygon paths
- Circle/radius collision
- Bresenham line demonstration
- Midpoint Circle demonstration
- Viewport clipping
- Particle animation
- Delta-time physics
- Screen wrapping
- Layered rendering
- Procedural object generation

## Architecture
`index.html` — UI and game screens
`style.css` — visual design
`game.js` — simulation, input, renderer, collision, difficulty and lab

## Game design
The game was selected as a complementary project to an endless runner: it demonstrates continuous rotation, vector direction, projectiles, radial collision and polygon geometry more directly.

## Persistence
Best score is stored with browser localStorage.

## Academic design
Classic algorithms are shown in Graphics Lab rather than being artificially forced into every real-time frame. The game renderer uses Canvas paths for smooth gameplay while the lab exposes the syllabus algorithms.
