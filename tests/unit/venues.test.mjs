import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { venueLookup } from '../../src/modules/lope-toolkit/venues.js';

describe('venue line builders', () => {
  it('rebuilds gymzaal lines from the actual hall dimensions', () => {
    const venue = venueLookup['gymzaal-standard'];
    const standard = venue.buildLineLayers({ width: 28, height: 16 });
    const resized = venue.buildLineLayers({ width: 50, height: 16 });

    const standardOuter = standard.find((layer) => layer.type === 'rect' && layer.stroke === '#e8dec9');
    const resizedOuter = resized.find((layer) => layer.type === 'rect' && layer.stroke === '#e8dec9');
    const standardCenterLine = standard.find((layer) => layer.type === 'line' && layer.stroke === '#d94841');
    const resizedCenterLine = resized.find((layer) => layer.type === 'line' && layer.stroke === '#d94841');

    assert.equal(standardOuter.width, 27.1);
    assert.equal(resizedOuter.width, 49.1);
    assert.equal(standardCenterLine.x1, 14);
    assert.equal(resizedCenterLine.x1, 25);
  });

  it('keeps soccer penalty-box measurements tied to real meters', () => {
    const venue = venueLookup['voetbalveld-standard'];
    const lines = venue.buildLineLayers({ width: 100, height: 64 });

    const penaltyBox = lines.find((layer) => layer.type === 'rect' && layer.width === 16.5);
    const goalArea = lines.find((layer) => layer.type === 'rect' && layer.width === 5.5);
    const penaltyMark = lines.find((layer) => layer.type === 'circle' && layer.cx === 89);

    assert.equal(penaltyBox.width, 16.5);
    assert.equal(goalArea.width, 5.5);
    assert.equal(penaltyMark.cx, 89);
  });

  it('uses standard indoor line colors for gymzaal sports', () => {
    const venue = venueLookup['gymzaal-standard'];
    const lines = venue.buildLineLayers({ width: 28, height: 16 });

    const basketballLine = lines.find((layer) => layer.stroke === '#d94841');
    const volleyballLine = lines.find((layer) => layer.stroke === '#e0b321');
    const badmintonLine = lines.find((layer) => layer.stroke === '#2f7de1');

    assert.equal(basketballLine.stroke, '#d94841');
    assert.equal(volleyballLine.stroke, '#e0b321');
    assert.equal(badmintonLine.stroke, '#2f7de1');
  });
});
