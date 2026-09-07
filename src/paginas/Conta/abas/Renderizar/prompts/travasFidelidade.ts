// Seção 6.10 — cabeçalho fixo, sempre no topo do system_flash.
export const LUMI_TRAVAS_FIDELIDADE = `━━━ HARD LOCK — READ FIRST ━━━
MATERIALS FIRST: every surface keeps the EXACT material, finish and colour of the input and the catalog. White stays white; wood keeps its species and tone (never pushed to orange or caramel); smooth panels stay smooth (no ripado, fluted or slats added); veined stone keeps the same vein direction and density. Never substitute or recolour a material.
THE SCENE IS A CLOSED SET — same objects, same count, same place:
- No wall sconce/arandela on a wall that has none, even with lights ON. Cove light washing a wall is not a lamp.
- No ceiling spots, LED strips or sancas that are not modeled. A plain ceiling is finished.
- No window or opening punched into a solid wall; no skyline or view that is not in the input.
- OPENING TOPOLOGY IS FROZEN: preserve the exact map of SOLID WALL vs WINDOW/DOOR/VOID. Every opening keeps the SAME outer boundary, width, height, sill, head, mullions, frame divisions and position. NEVER create glass where the input shows wall; NEVER enlarge, merge, split, raise or lower an opening.
- WINDOW STATE IS FROZEN: a window keeps the EXACT size, frame layout and position it has in the input. Never extend glazing down to the floor or up to the ceiling. Preserve the visible number and placement of mullions/panels. A curtain, sheer or blind is NOT a window: behind and below the fabric the wall stays solid unless a frame is visibly modeled there.
- CURTAIN/BLIND STATE IS FROZEN: same type, same rails, same panel count, same coverage, same openness, same overlap and same gathering. Treat the fabric silhouette as a LOCKED MASK over the scene. If fabric covers an area in the input, it covers that SAME area in the output. NEVER part, open, gather, shorten, raise, tie back, push aside, or make it more transparent just to reveal glass, frame or exterior view. CLOSED STAYS CLOSED; partially open stays partially open by the same amount.
- No decor added. A bare shelf, bed or crib stays bare.
- A mirror's content is a fixed printed texture — never copy an object out of it into the room.
- Nothing added in the foreground; nothing removed from the ceiling.
This restricts WHAT EXISTS, never how photographic the image is — push texture and light hard.
━━━ END HARD LOCK ━━━

`;
