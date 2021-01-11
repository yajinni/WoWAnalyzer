import SPELLS from 'common/SPELLS';
import CoreAbilities from 'parser/core/modules/Abilities';
import Enemies from 'parser/shared/modules/Enemies';

import Ability from './Ability';

// The amount of time after a proc has occurred when casting a filler is no longer acceptable
const REACTION_TIME_THRESHOLD = 500;

const hastedCooldown = (baseCD, haste) => (baseCD / (1 + haste));

class Abilities extends CoreAbilities {
  static ABILITY_CLASS = Ability;
  static dependencies = {
    ...CoreAbilities.dependencies,
    enemies: Enemies,
  };

  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      // Rotational Spells
      {
        spell: SPELLS.MANGLE_BEAR,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          if (combatant.hasBuff(SPELLS.INCARNATION_GUARDIAN_OF_URSOC_TALENT.id)) {
            return hastedCooldown(1.5, haste);
          }
          return hastedCooldown(6, haste);
        },
        gcd: {
          base: 1500,
        },
        antiFillerSpam: {
          isHighPriority: true,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.7,
          averageIssueEfficiency: 0.6,
          majorIssueEfficiency: 0.5,
        },
        timelineSortIndex: 1,
      },
      {
        spell: SPELLS.THRASH_BEAR,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          if (combatant.hasBuff(SPELLS.INCARNATION_GUARDIAN_OF_URSOC_TALENT.id)) {
            return hastedCooldown(1.5, haste);
          }
          return hastedCooldown(6, haste);
        },
        gcd: {
          base: 1500,
        },
        antiFillerSpam: {
          isHighPriority: true,
        },
        castEfficiency: {
          suggestion: true,
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.MOONFIRE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        antiFillerSpam: {
          isFiller: (event, selectedCombatant, targets) => {
            if (combatant.hasTalent(SPELLS.GALACTIC_GUARDIAN_TALENT.id) && selectedCombatant.hasBuff(SPELLS.GALACTIC_GUARDIAN.id)) {
              return false;
            }
            // Check if moonfire is present on the current target
            // Note that if the current target has no enemy data we can't track whether the dot
            // is ticking or not, in that case we consider it non-filler as a concession.
            if (!this.enemies.getEntity(event) || !this.enemies.getEntity(event).hasBuff(SPELLS.MOONFIRE_BEAR.id, event.timestamp)) {
              return false;
            }
            return true;
          },
          isHighPriority: ({ timestamp }, selectedCombatant) =>
            // Account for reaction time; the player must have had the proc for at least this long
            selectedCombatant.hasBuff(SPELLS.GALACTIC_GUARDIAN.id, timestamp - REACTION_TIME_THRESHOLD)
          ,
        },
        timelineSortIndex: 3,
      },
      {
        spell: SPELLS.SWIPE_BEAR,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        antiFillerSpam: {
          isFiller: (event, selectedCombatant, targets) => targets.length < 4,
        },
        timelineSortIndex: 4,
      },
      {
        spell: SPELLS.MAUL,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 5,
      },
      // Cat Form abilities
      {
        spell: SPELLS.SHRED,
        // Technically available baseline, but it is never used without FA
        enabled: combatant.hasTalent(SPELLS.FERAL_AFFINITY_TALENT_GUARDIAN.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          static: 1000,
        },
      },
      {
        spell: SPELLS.RAKE,
        enabled: combatant.hasTalent(SPELLS.FERAL_AFFINITY_TALENT_GUARDIAN.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          static: 1000,
        },
      },
      {
        spell: SPELLS.RIP,
        enabled: combatant.hasTalent(SPELLS.FERAL_AFFINITY_TALENT_GUARDIAN.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          static: 1000,
        },
      },
      {
        spell: SPELLS.FEROCIOUS_BITE,
        enabled: combatant.hasTalent(SPELLS.FERAL_AFFINITY_TALENT_GUARDIAN.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          static: 1000,
        },
      },
      // Cooldowns
      {
        spell: SPELLS.BARKSKIN,
        buffSpellId: SPELLS.BARKSKIN.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: combatant.hasTalent(SPELLS.SURVIVAL_OF_THE_FITTEST_TALENT.id) ? 90 - (90 / 3) : 90,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.SURVIVAL_INSTINCTS,
        buffSpellId: SPELLS.SURVIVAL_INSTINCTS.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: combatant.hasTalent(SPELLS.SURVIVAL_OF_THE_FITTEST_TALENT.id) ? 240 - (240 / 3) : 240,
        charges: 2,
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.INCARNATION_GUARDIAN_OF_URSOC_TALENT,
        category: Abilities.SPELL_CATEGORIES.SEMI_DEFENSIVE,
        gcd: {
          base: 1500,
        },
        cooldown: 180,
        enabled: combatant.hasTalent(SPELLS.INCARNATION_GUARDIAN_OF_URSOC_TALENT.id),
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.BRISTLING_FUR_TALENT,
        buffSpellId: SPELLS.BRISTLING_FUR_TALENT.id,
        isDefensive: true,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
        cooldown: 40,
        enabled: combatant.hasTalent(SPELLS.BRISTLING_FUR_TALENT.id),
        timelineSortIndex: 9,
      },
      {
        spell: SPELLS.IRONFUR,
        buffSpellId: SPELLS.IRONFUR.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: null,
        cooldown: .5,
        timelineSortIndex: 7,
      },
      {
        spell: SPELLS.FRENZIED_REGENERATION,
        buffSpellId: SPELLS.FRENZIED_REGENERATION.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: {
          base: 1500,
        },
        cooldown: haste => hastedCooldown(36, haste),
        charges: 2,
        timelineSortIndex: 8,
      },
      {
        spell: SPELLS.PULVERIZE_TALENT,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        enabled: combatant.hasTalent(SPELLS.PULVERIZE_TALENT.id),
        gcd: {
          base: 1500,
        },
        antiFillerSpam: {
          // A spell must meet these conditions to be castable
          isHighPriority: ({ timestamp, targetID }, selectedCombatant, targets) => {
            const pulverizeTalented = combatant.hasTalent(SPELLS.PULVERIZE_TALENT.id);
            const target = targets.find(t => t.id === targetID);
            if (!target) {
              return false;
            }
            const targetHasThrashStacks = target.hasBuff(SPELLS.THRASH_BEAR_DOT.id, timestamp).stacks >= 2;
            return pulverizeTalented && targetHasThrashStacks;
          },
        },
        timelineSortIndex: 6,
      },
      // Raid utility
      {
        spell: SPELLS.STAMPEDING_ROAR_BEAR,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 120,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.GROWL,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
      },
      {
        spell: SPELLS.SKULL_BASH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
      },
      {
        spell: SPELLS.BEAR_FORM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CAT_FORM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.TRAVEL_FORM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MOONKIN_FORM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.REBIRTH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.INCAPACITATING_ROAR,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.TYPHOON,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MASS_ENTANGLEMENT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.MASS_ENTANGLEMENT_TALENT.id),
        cooldown: 30,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.MIGHTY_BASH_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.MIGHTY_BASH_TALENT.id),
        cooldown: 50,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: [SPELLS.WILD_CHARGE_TALENT, SPELLS.WILD_CHARGE_MOONKIN, SPELLS.WILD_CHARGE_CAT, SPELLS.WILD_CHARGE_BEAR, SPELLS.WILD_CHARGE_TRAVEL],
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
        gcd: null,
        enabled: combatant.hasTalent(SPELLS.WILD_CHARGE_TALENT.id),
      },
      {
        spell: SPELLS.DASH,
        buffSpellId: SPELLS.DASH.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: !combatant.hasTalent(SPELLS.TIGER_DASH_TALENT.id),
        cooldown: 180,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.TIGER_DASH_TALENT,
        buffSpellId: SPELLS.TIGER_DASH_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 45,
        enabled: combatant.hasTalent(SPELLS.TIGER_DASH_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HIBERNATE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SOOTHE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 10,
        gcd: {
          base: 1500,
        },
      },
    ];
  }
}

export default Abilities;
