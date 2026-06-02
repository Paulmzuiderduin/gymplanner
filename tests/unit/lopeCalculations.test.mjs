import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clampPlacementToVenue,
  createPlacement,
  getPlacementMeterSize,
  getPlacementPercentSize,
  getPlacementRenderBox,
  getVenueDimensions,
  migrateLegacyPlacement
} from '../../src/modules/lope-toolkit/calculations.js';

describe('planner calculations', () => {
  it('uses custom venue dimensions when present', () => {
    const lesson = { venueDimensions: { width: 32, height: 18 } };
    const venue = { defaultDimensions: { width: 28, height: 16 } };
    assert.deepEqual(getVenueDimensions(lesson, venue), { width: 32, height: 18 });
  });

  it('keeps footprint sizes in meters and derives percentages from the current venue', () => {
    const size = getPlacementMeterSize({ renderMode: 'footprint', width: 3.6, height: 0.26 });
    assert.deepEqual(size, { widthM: 3.6, heightM: 0.26, renderMode: 'footprint' });

    const percent = getPlacementPercentSize({ widthM: 3.6, heightM: 0.26 }, { width: 28, height: 16 });
    assert.equal(percent.width, 12.86);
    assert.equal(percent.height, 1.63);
  });

  it('creates a placement inside the venue bounds', () => {
    const placement = createPlacement({
      item: { id: 'bank', renderMode: 'footprint', width: 3.6, height: 0.26 },
      venueDimensions: { width: 28, height: 16 },
      xM: 27.8,
      yM: 15.9
    });

    assert.ok(placement.xM <= 28 - placement.widthM);
    assert.ok(placement.yM <= 16 - placement.heightM);
  });

  it('clamps moved placements back into the venue', () => {
    const clamped = clampPlacementToVenue(
      {
        xM: 29,
        yM: -2,
        widthM: 3.6,
        heightM: 1
      },
      { width: 28, height: 16 }
    );

    assert.equal(clamped.xM, 24.4);
    assert.equal(clamped.yM, 0);
  });

  it('migrates legacy percentage placements into meter coordinates', () => {
    const migrated = migrateLegacyPlacement(
      {
        x: 25,
        y: 50,
        width: 5,
        height: 5,
        renderMode: 'icon'
      },
      { id: 'basketbal', renderMode: 'icon' },
      { width: 28, height: 16 }
    );

    assert.equal(migrated.xM, 7);
    assert.equal(migrated.yM, 8);
    assert.equal(migrated.widthM, 0.9);
    assert.equal(migrated.heightM, 0.9);
  });

  it('recomputes rendered percentages when the venue size changes', () => {
    const placement = {
      xM: 7,
      yM: 4,
      widthM: 3.6,
      heightM: 0.26
    };

    const standard = getPlacementRenderBox(placement, { width: 28, height: 16 });
    const wider = getPlacementRenderBox(placement, { width: 50, height: 16 });

    assert.equal(standard.left, '25%');
    assert.equal(standard.width, '12.86%');
    assert.equal(wider.left, '14%');
    assert.equal(wider.width, '7.2%');
  });
});
