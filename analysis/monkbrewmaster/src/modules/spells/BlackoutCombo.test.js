import SPELLS from 'common/SPELLS';
import { SimpleFight, applybuff, refreshBuff, dpsCasts } from 'parser/monk/brewmaster/test-fixtures/SimpleFight';
import TestCombatLogParser from 'parser/core/tests/TestCombatLogParser';

import BlackoutCombo from './BlackoutCombo';

describe('Brewmaster.BlackoutCombo', () => {
  let parser;
  let module;
  beforeEach(() => {
    parser = new TestCombatLogParser();
    module = parser.loadModule(BlackoutCombo);
  });
  it('blackout combo is active by default', () => {
    expect(module.active).toBe(true);
  });
  it('blackout combo checks to see if active while talent is not selected', () => {
    parser.selectedCombatant.hasTalent = jest.fn(() => false);
    module = new BlackoutCombo({ owner: parser });
    expect(parser.selectedCombatant.hasTalent).toBeCalledWith(SPELLS.BLACKOUT_COMBO_TALENT.id);
    expect(module.active).toBe(false);
  });
  it('blackout combo checks to see if active while talent is selected', () => {
    parser.selectedCombatant.hasTalent = jest.fn(() => true);
    module = new BlackoutCombo({ owner: parser });
    expect(parser.selectedCombatant.hasTalent).toBeCalledWith(SPELLS.BLACKOUT_COMBO_TALENT.id);
    expect(module.active).toBe(true);
  });
  it('blackout combo when no events have been found', () => {
    expect(module.blackoutComboBuffs).toBe(0);
    expect(module.lastBlackoutComboCast).toBe(0);
    expect(module.blackoutComboConsumed).toBe(0);
  });
  it('track blackout combo buffs applied', () => {
    parser.processEvents([...applybuff, ...refreshBuff]);
    expect(module.blackoutComboBuffs).toBe(4);
  });
  it('track when last blackout combo was applied', () => {
    parser.processEvents([...applybuff, ...refreshBuff]);
    expect(module.lastBlackoutComboCast).toBe(9000);
  });
  it('track blackout combos consumed by other spells', () => {
    parser.processEvents(SimpleFight);
    expect(module.blackoutComboConsumed).toBe(2);
  });
  it('check to see if the object used to track spells os populated with no data', () => {
    expect(Object.keys(module.spellsBOCWasUsedOn).length).toBe(0);
  });
  it('check to see if the object used to track spells os populated with damage abilities that would consume', () => {
    parser.processEvents(dpsCasts);
    expect(Object.keys(module.spellsBOCWasUsedOn).length).toBe(0);
  });
  it('track how many times keg smash consumed BOC', () => {
    parser.processEvents(SimpleFight);
    expect(module.spellsBOCWasUsedOn[SPELLS.KEG_SMASH.id]).toBe(1);
  });
  it('track how many times breath of fire consumed BOC', () => {
    parser.processEvents(SimpleFight);
    expect(module.spellsBOCWasUsedOn[SPELLS.BREATH_OF_FIRE.id]).toBe(1);
  });
});
