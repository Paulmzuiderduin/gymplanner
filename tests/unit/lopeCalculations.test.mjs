import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clampPlacementToCanvas, createPlacement, getPlacementSize, getVenueDimensions } from '../../src/modules/lope-toolkit/calculations.js';

describe('planner calculations', () => {
  it('uses custom venue dimensions when present', () => {
    const lesson = { venueDimensions: { width: 32, height: 18 } };
    const venue = { defaultDimensions: { width: 28, height: 16 } };
    assert.deepEqual(getVenueDimensions(lesson, venue), { width: 32, height: 18 });
  });

  it('converts real footprint size into percentages', () => {
    const item = { renderMode: 'footprint', width: 3.6, height: 0.26 };
    const size = getPlacementSize(item, { width: 28, height: 16 });
    assert.equal(size.width, 12.86);
    assert.equal(size.height, 1.63);
  });

  it('creates a placement inside the canvas bounds', () => {
    const placement = createPlacement({
      item: { id: 'bank', renderMode: 'footprint', width: 3.6, height: 0.26 },
      venueDimensions: { width: 28, height: 16 },
      x: 98,
      y: 98
    });

    assert.ok(placement.x <= 100 - placement.width);
    assert.ok(placement.y <= 100 - placement.height);
  });

  it('clamps moved placements back into the visible area', () => {
    const clamped = clampPlacementToCanvas({
      x: 98,
      y: -3,
      width: 12,
      height: 10
    });

    assert.equal(clamped.x, 88);
    assert.equal(clamped.y, 0);
  });
});

