import SPELLS from 'common/SPELLS';
import COVENANTS from 'game/shadowlands/COVENANTS';
import CoreAbilities from 'parser/core/modules/Abilities';
import { SpellbookAbility } from 'parser/core/modules/Ability';

class Abilities extends CoreAbilities {
  spellbook(): SpellbookAbility[] {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.DEVASTATE,
        enabled: !combatant.hasTalent(SPELLS.DEVASTATOR_TALENT.id),
        gcd: {
          base: 1500,
        },
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        timelineSortIndex: 3,
      },
      {
        spell: SPELLS.WHIRLWIND,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHATTERING_THROW,
        gcd: {
          base: 1500,
        },
        cooldown: 180,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        timelineSortIndex: 3,
      },
      {
        spell: SPELLS.EXECUTE,
        enabled: !combatant.hasCovenant(COVENANTS.VENTHYR.id),
        gcd: {
          base: 1500,
        },
        cooldown: haste => 6 / (1 + haste),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        timelineSortIndex: 3,
      },
      {
        spell: SPELLS.REVENGE,
        gcd: {
          base: 1500,
        },
        buffSpellId: SPELLS.REVENGE_FREE_CAST.id,
        cooldown: haste => 3 / (1 + haste),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        timelineSortIndex: 3,
      },
      {
        spell: SPELLS.SHIELD_SLAM,
        gcd: {
          base: 1500,
        },
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        buffSpellId: SPELLS.PUNISH_DEBUFF.id,
        cooldown: haste => 9 / (1 + haste),
        timelineSortIndex: 1,
      },
      {
        spell: SPELLS.THUNDER_CLAP,
        gcd: {
          base: 1500,
        },
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 6 / (1 + haste)
        cooldown: haste => {
          if (combatant.hasTalent(SPELLS.UNSTOPPABLE_FORCE_TALENT.id) && combatant.hasBuff(SPELLS.AVATAR_TALENT.id)) {
            return 6 / 2 / (1 + haste);
          }
          return 6 / (1 + haste);
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: .9,
          extraSuggestion: 'Casting Thunder Clap regularly is very important for performing well.',
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.IGNORE_PAIN,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        buffSpellId: SPELLS.IGNORE_PAIN.id,
        timelineSortIndex: 4,
      },
      {
        spell: SPELLS.SHIELD_BLOCK,
        buffSpellId: SPELLS.SHIELD_BLOCK_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: haste => 16 / (1 + haste),
        charges: 2,
        timelineSortIndex: 5,
      },
      {
        spell: SPELLS.DEMORALIZING_SHOUT,
        buffSpellId: SPELLS.DEMORALIZING_SHOUT.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: {
          base: 1500,
        },
        cooldown: 45,
        timelineSortIndex: 8,
      },
      {
        spell: SPELLS.LAST_STAND,
        buffSpellId: SPELLS.LAST_STAND.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: combatant.hasTalent(SPELLS.BOLSTER_TALENT.id) ? 180 - 60 : 180,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.SHIELD_WALL,
        buffSpellId: SPELLS.SHIELD_WALL.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 240,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.SPELL_REFLECTION,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 25,
      },
      {
        spell: SPELLS.HEROIC_LEAP,
        gcd: {
          base: 1500,
        },
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasTalent(SPELLS.BOUNDING_STRIDE_TALENT.id) ? 45 - 15 : 45,
      },
      {
        spell: SPELLS.HEROIC_THROW,
        gcd: {
          base: 1500,
        },
        category: Abilities.SPELL_CATEGORIES.UTILITY,
      },
      {
        spell: SPELLS.TAUNT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
      },
      {
        spell: SPELLS.BERSERKER_RAGE,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60,
        timelineSortIndex: 8,
      },
      {
        spell: SPELLS.PUMMEL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
      },
      {
        spell: SPELLS.VICTORY_RUSH,
        enabled: !combatant.hasTalent(SPELLS.IMPENDING_VICTORY_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.OTHERS,
      },
      {
        spell: SPELLS.STORM_BOLT_TALENT,
        enabled: combatant.hasTalent(SPELLS.STORM_BOLT_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 30,
      },
      {
        spell: SPELLS.AVATAR_TALENT,
        buffSpellId: SPELLS.AVATAR_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 90,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.IMPENDING_VICTORY_TALENT,
        enabled: combatant.hasTalent(SPELLS.IMPENDING_VICTORY_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        cooldown: 30,
      },
      {
        spell: SPELLS.RAVAGER_TALENT_PROTECTION,
        enabled: combatant.hasTalent(SPELLS.RAVAGER_TALENT_PROTECTION.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: .9,
        },
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.DRAGON_ROAR_TALENT,
        enabled: combatant.hasTalent(SPELLS.DRAGON_ROAR_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 35,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.RALLYING_CRY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 180,
        timelineSortIndex: 9,
      },
    ];
  }
}

export default Abilities;
