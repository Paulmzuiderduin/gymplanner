import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateBeweegdoelen, inferActivityKey } from '../../src/modules/lope-toolkit/goalGenerator.js';

describe('beweegdoelen generator', () => {
  it('detects the activity from natural language', () => {
    const activity = inferActivityKey('basketbal', 'Aan het einde van de les wil ik dat leerlingen de setshot kunnen uitvoeren.');
    assert.equal(activity, 'basketbal');
  });

  it('generates base and differentiated goals', () => {
    const output = generateBeweegdoelen({
      schoolType: 'voortgezet onderwijs',
      classLabel: '2 vwo',
      activity: 'basketbal',
      prompt: 'Ik geef 2 vwo basketbal. Aan het einde van de les wil ik dat leerlingen de setshot kunnen uitvoeren.',
      rolesText: '',
      seriesContext: ''
    });

    assert.match(output.baseGoal, /setshot/i);
    assert.match(output.underAverage, /Onder|stilstand|korte afstand/i);
    assert.match(output.average, /zelfstandig|controle/i);
    assert.match(output.aboveAverage, /tijdsdruk|kwaliteit/i);
  });

  it('adds optional role variants when roles are supplied', () => {
    const output = generateBeweegdoelen({
      schoolType: 'voortgezet onderwijs',
      classLabel: '1 vmbo',
      activity: 'tikspel',
      prompt: 'Ik geef een tikspel en wil dat leerlingen slimme keuzes maken.',
      rolesText: 'tikker, renner',
      seriesContext: ''
    });

    assert.equal(output.roleVariants.length, 2);
    assert.match(output.roleVariants[0].goal, /tikker/i);
    assert.match(output.roleVariants[1].goal, /renner/i);
  });
});
