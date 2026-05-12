import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { venueLookup } from '../../src/modules/lope-toolkit/venues.js';

describe('venue line builders', () => {
  it('rebuilds gymzaal lines from the actual hall dimensions', () => {
    const venue = venueLookup['gymzaal-standard'];
    const standard = venue.buildLineLayers({ width: 28, height: 16 });
    const resized = venue.buildLineLayers({ width: 50, height: 16 });

    assert.equal(standard[1].width, 27);
    assert.equal(resized[1].width, 49);
    assert.equal(standard[2].x1, 14);
    assert.equal(resized[2].x1, 25);
  });

  it('keeps soccer penalty-box measurements tied to real meters', () => {
    const venue = venueLookup['voetbalveld-standard'];
    const lines = venue.buildLineLayers({ width: 100, height: 64 });

    assert.equal(lines[3].width, 16.5);
    assert.equal(lines[5].width, 5.5);
    assert.equal(lines[8].cx, 89);
  });
});
