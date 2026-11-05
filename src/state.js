// Shared, mutable game state (one source of truth for the controller, board and camera).
export const game = { locked: true, cur: null, prev: null, seen: new Set() };
