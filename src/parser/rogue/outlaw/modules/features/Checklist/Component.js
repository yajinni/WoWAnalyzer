import React from 'react';
import PropTypes from 'prop-types';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import Checklist from 'parser/shared/modules/features/Checklist';
import Rule from 'parser/shared/modules/features/Checklist/Rule';
import Requirement from 'parser/shared/modules/features/Checklist/Requirement';
import PreparationRule from 'parser/shared/modules/features/Checklist/PreparationRule';
import GenericCastEfficiencyRequirement from 'parser/shared/modules/features/Checklist/GenericCastEfficiencyRequirement';

const OutlawRogueChecklist = ({ combatant, castEfficiency, thresholds }) => {
  const AbilityRequirement = props => (
    <GenericCastEfficiencyRequirement
      castEfficiency={castEfficiency.getCastEfficiencyForSpellId(props.spell)}
      {...props}
    />
  );
  AbilityRequirement.propTypes = {
    spell: PropTypes.number.isRequired,
  };

  const hasBetweenTheEyesTrait = combatant.hasTrait(SPELLS.ACE_UP_YOUR_SLEEVE.id) || combatant.hasTrait(SPELLS.DEADSHOT.id);

  return (
    <Checklist>
      {!combatant.hasTalent(SPELLS.SLICE_AND_DICE_TALENT.id) && (
        <Rule
          name="Maximize your Roll the Bones usage"
          description={<>Efficient use of <SpellLink id={SPELLS.ROLL_THE_BONES.id} /> is a critical part of Outlaw rogue. You should try to keep as high of an uptime as possible with any of the buffs, and reroll efficiently to get higher value buffs. <SpellLink id={SPELLS.RUTHLESS_PRECISION.id} /> and <SpellLink id={SPELLS.GRAND_MELEE.id} /> are the highest value of the six possible buffs. You should reroll until you get one of them, or any two other buffs. Any high value roll should be kept for the full duration.</>}
        >
          <Requirement
            name={(
              <>
                <SpellLink id={SPELLS.ROLL_THE_BONES.id} /> uptime
              </>
            )}
            thresholds={thresholds.rollTheBonesBuffs}
          />
          {thresholds.rollTheBonesEfficiency.map(suggestion => {
            return (
              <Requirement
                name={`Reroll ${suggestion.label} efficiency`}
                thresholds={suggestion.suggestionThresholds}
              />
            );
          })}
        </Rule>
      )}
      <Rule
        name="Use your finishers efficiently"
        description={<>Your two damaging finishers should typically be used at maximum combo points. If you have <SpellLink id={SPELLS.RUTHLESS_PRECISION.id} /> active, or you are using either the <SpellLink id={SPELLS.ACE_UP_YOUR_SLEEVE.id} /> or <SpellLink id={SPELLS.DEADSHOT.id} /> traits, you should prioritize <SpellLink id={SPELLS.BETWEEN_THE_EYES.id} /> as your damaging finisher.</>}
      >
        <Requirement name="Finisher combo point inefficiency" thresholds={thresholds.finishers} />
        {(!combatant.hasTalent(SPELLS.SLICE_AND_DICE_TALENT.id) || hasBetweenTheEyesTrait) && (
          <Requirement
            name={(
              <>
                Inefficient <SpellLink id={SPELLS.DISPATCH.id} /> casts
              </>
            )}
            thresholds={thresholds.dispatch}
          />
        )}
        {!combatant.hasTalent(SPELLS.SLICE_AND_DICE_TALENT.id) && !hasBetweenTheEyesTrait && (
          <Requirement
            name={(
              <>
                Inefficient <SpellLink id={SPELLS.BETWEEN_THE_EYES.id} /> casts
              </>
            )}
            thresholds={thresholds.betweenTheEyes}
          />
        )}
      </Rule>
      <Rule
        name="Make sure to use your opportunity procs"
        description={<>Your <SpellLink id={SPELLS.OPPORTUNITY.id} /> proc will do more damage than a <SpellLink id={SPELLS.SINISTER_STRIKE.id} />, so make sure to use <SpellLink id={SPELLS.PISTOL_SHOT.id} /> as your combo point builder when the proc is available and you aren't already capped on combo points.</>}
      >
        <Requirement
          name={(
            <>
              Delayed <SpellLink id={SPELLS.OPPORTUNITY.id} /> procs
            </>
          )}
          thresholds={thresholds.opportunity}
        />
      </Rule>
      <Rule
        name="Do not overcap your resources"
        description="You should try to always avoid overcapping your Energy and Combo Points."
      >
        <Requirement name="Energy generator efficiency" thresholds={thresholds.energyEfficiency} />
        <Requirement name="Combo Point efficiency" thresholds={thresholds.comboPointEfficiency} />
        <Requirement name="Energy regeneration efficiency" thresholds={thresholds.energyCapEfficiency} />
      </Rule>
      <Rule
        name="Use your cooldowns"
        description="Your cooldowns are a major contributor to your DPS, and should be used as frequently as possible throughout a fight. A cooldown should be held on to only if a priority DPS phase is coming soon. Holding cooldowns too long will hurt your DPS."
      >
        <AbilityRequirement spell={SPELLS.ADRENALINE_RUSH.id} />
        {combatant.hasTalent(SPELLS.GHOSTLY_STRIKE_TALENT.id) && (
          <AbilityRequirement spell={SPELLS.GHOSTLY_STRIKE_TALENT.id} />
        )}
        {combatant.hasTalent(SPELLS.MARKED_FOR_DEATH_TALENT.id) && (
          <AbilityRequirement spell={SPELLS.MARKED_FOR_DEATH_TALENT.id} />
        )}
        {combatant.hasTalent(SPELLS.BLADE_RUSH_TALENT.id) && (
          <AbilityRequirement spell={SPELLS.BLADE_RUSH_TALENT.id} />
        )}
        {combatant.hasTalent(SPELLS.KILLING_SPREE_TALENT.id) && (
          <AbilityRequirement spell={SPELLS.KILLING_SPREE_TALENT.id} />
        )}
        <AbilityRequirement spell={SPELLS.VANISH.id} />
      </Rule>
      <PreparationRule thresholds={thresholds} />
    </Checklist>
  );
};

OutlawRogueChecklist.propTypes = {
  castEfficiency: PropTypes.object.isRequired,
  combatant: PropTypes.shape({
    hasTalent: PropTypes.func.isRequired,
    hasTrinket: PropTypes.func.isRequired,
    hasTrait: PropTypes.func.isRequired,
  }).isRequired,
  thresholds: PropTypes.object.isRequired,
};

export default OutlawRogueChecklist;
