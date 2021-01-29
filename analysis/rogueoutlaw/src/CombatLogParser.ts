import {
  ComboPointDetails,
  EchoingReprimand,
  EnergyDetails,
  EnergyTracker,
  EssenceOfBloodfang,
  Flagellation,
  InvigoratingShadowdust,
  Sepsis,
  SerratedBoneSpike,
  SpellEnergyCost,
  SpellUsable,
} from '@wowanalyzer/rogue';

import CoreCombatLogParser from 'parser/core/CombatLogParser';
import ArcaneTorrent from 'parser/shared/modules/racials/bloodelf/ArcaneTorrent';

import Abilities from './modules/Abilities';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import Buffs from './modules/Buffs';

import OutlawComboPointTracker from './modules/core/OutlawComboPointTracker';
import ComboPoints from './modules/core/ComboPoints';
import OutlawEnergyCapTracker from './modules/core/OutlawEnergyCapTracker';
import Energy from './modules/core/Energy';

import Checklist from './modules/features/Checklist/Module';
import RollTheBonesBuffs from './modules/spells/RollTheBonesBuffs';
import RollTheBonesCastTracker from './modules/features/RollTheBonesCastTracker';
import RollTheBonesCounter from './modules/spells/RollTheBonesCounter';
import RollTheBonesEfficiency from './modules/spells/RollTheBonesEfficiency';
import RestlessBlades from './modules/core/RestlessBlades';
import SliceAndDiceUptime from './modules/spells/SliceAndDiceUptime';
import Dispatch from './modules/spells/Dispatch';
import Opportunity from './modules/spells/Opportunity';
import OpportunityDamageTracker from './modules/spells/OpportunityDamageTracker';
import BetweenTheEyes from './modules/spells/BetweenTheEyes';
import BetweenTheEyesDamageTracker from './modules/spells/BetweenTheEyesDamageTracker';
import Finishers from './modules/features/Finishers';

import BladeRush from './modules/talents/BladeRush';
import BladeFlurry from './modules/spells/BladeFlurry';
import GuileCharm from './modules/spells/shadowlands/legendaries/GuileCharm';
import GreenskinsWickers from './modules/spells/shadowlands/legendaries/GreenskinsWickers';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    //Feature
    abilities: Abilities,
    alwaysBeCasting: AlwaysBeCasting,
    buffs: Buffs,
    spellUsable: SpellUsable,
    checklist: Checklist,

    //Resource
    comboPointTracker: OutlawComboPointTracker,
    comboPointDetails: ComboPointDetails,
    comboPoints: ComboPoints,
    energyTracker: EnergyTracker,
    energyCapTracker: OutlawEnergyCapTracker,
    energyDetails: EnergyDetails,
    energy: Energy,
    spellEnergyCost: SpellEnergyCost,

    //Core
    restlessBlades: RestlessBlades,
    rollTheBonesCastTracker: RollTheBonesCastTracker,

    //Items
    guileCharm: GuileCharm,
    greenskinsWickers: GreenskinsWickers,
    essenceOfBloodfang: EssenceOfBloodfang,
    invigoratingShadowdust: InvigoratingShadowdust,

    //Casts
    dispatch: Dispatch,
    opportunityDamageTracker: OpportunityDamageTracker,
    opportunity: Opportunity,
    betweenTheEyesDamageTracker: BetweenTheEyesDamageTracker,
    betweenTheEyes: BetweenTheEyes,
    rollTheBonesBuffs: RollTheBonesBuffs,
    rollTheBonesCounter: RollTheBonesCounter,
    rollTheBonesEfficiency: RollTheBonesEfficiency,
    finishers: Finishers,
    sliceAndDiceUptime: SliceAndDiceUptime,
    bladeFlurry: BladeFlurry,
    //Talents
    bladeRush: BladeRush,
    // Covenants
    serratedBoneSpike: SerratedBoneSpike,
    echoingReprimand: EchoingReprimand,
    flagellation: Flagellation,
    sepsis: Sepsis,

    // Outlaw's throughput benefit isn't as big as for other classes since we don't have a lot of free gcds to use
    arcaneTorrent: [
      ArcaneTorrent,
      {
        gcd: 1000,
        castEfficiency: 0.5,
        extraSuggestion: 'You should be using Arcane Torrent whenever you have a free GCD for it.',
      },
    ] as const,
  };
}

export default CombatLogParser;
