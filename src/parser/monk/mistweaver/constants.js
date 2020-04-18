import SPELLS from 'common/SPELLS';

export const ABILITIES_AFFECTED_BY_HEALING_INCREASES = [
  // Spells
  SPELLS.ENVELOPING_MIST.id,
  SPELLS.ESSENCE_FONT.id,
  SPELLS.ESSENCE_FONT_BUFF.id,
  SPELLS.RENEWING_MIST.id,
  SPELLS.RENEWING_MIST_HEAL.id,
  SPELLS.VIVIFY.id,
  SPELLS.SOOTHING_MIST.id,
  SPELLS.GUSTS_OF_MISTS.id,

  // Cooldowns
  SPELLS.LIFE_COCOON.id,
  SPELLS.REVIVAL.id,

  // Talents
  SPELLS.CHI_BURST_TALENT.id,
  SPELLS.CHI_BURST_HEAL.id,
  SPELLS.CHI_WAVE_TALENT.id,
  SPELLS.REFRESHING_JADE_WIND_TALENT.id,
  SPELLS.REFRESHING_JADE_WIND_HEAL.id,
  SPELLS.CRANE_HEAL.id, // Chi-Ji Heal

  // Misc
  SPELLS.LEECH.id,
  SPELLS.MARK_OF_THE_ANCIENT_PRIESTESS.id,
];

export const MISTWEAVER_HEALING_AURA = 1.4;
export const VIVIFY_SPELLPOWER_COEFFICIENT = 1.01;
export const VIVIFY_REM_SPELLPOWER_COEFFICIENT = .74;
export const ESSENCE_FONT_SPELLPOWER_COEFFICIENT = .3375;
