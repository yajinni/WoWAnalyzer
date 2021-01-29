import { BonedustBrew, FaelineStomp, FallenOrder, FortifyingIngredients, GroundingBreath, HarmDenial, TouchOfDeath } from '@wowanalyzer/monk';

import CoreCombatLogParser from 'parser/core/CombatLogParser';
import ArcaneTorrent from 'parser/shared/modules/racials/bloodelf/ArcaneTorrent';

// Core
import HealingDone from './modules/core/HealingDone';
import DamageTaken from './modules/core/DamageTaken';
import HealingReceived from './modules/core/HealingReceived';
import Stagger from './modules/core/Stagger';
import BrewCDR from './modules/core/BrewCDR';
import SharedBrews from './modules/core/SharedBrews';
import StaggerFabricator from './modules/core/StaggerFabricator';
import GlobalCooldown from './modules/core/GlobalCooldown';
import Channeling from './modules/core/Channeling';
import Checklist from './modules/core/Checklist/Module';
// Spells
import PurifyingBrew from './modules/spells/PurifyingBrew';
import CelestialBrew from './modules/spells/CelestialBrew';
import BlackoutCombo from './modules/spells/BlackoutCombo';
import KegSmash from './modules/spells/KegSmash';
import TigerPalm from './modules/spells/TigerPalm';
import RushingJadeWind from './modules/spells/RushingJadeWind';
import BreathOfFire from './modules/spells/BreathOfFire';
import BlackOxBrew from './modules/spells/BlackOxBrew';
import HighTolerance from './modules/spells/HighTolerance';
import CelestialFortune from './modules/spells/CelestialFortune';
import GiftOfTheOxStat from './modules/spells/GiftOfTheOx';
import Shuffle from './modules/spells/Shuffle';
// Features
import Abilities from './modules/Abilities';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import StaggerPoolGraph from './modules/features/StaggerPoolGraph';

// Items
import StormtoutsLastKeg from './modules/shadowlands/legendaries/StormstoutsLastKeg';

// normalizers
import GiftOfTheOx from './normalizers/GiftOfTheOx';
import ExpelHarmNorm from './normalizers/ExpelHarm';

// Covenants
import WeaponsOfOrder from './modules/spells/shadowlands/WeaponsOfOrder';

// Conduits
import ScaldingBrew from './modules/shadowlands/conduits/ScaldingBrew';
import EvasiveStride from './modules/shadowlands/conduits/EvasiveStride';
import WalkWithTheOx from './modules/shadowlands/conduits/WalkWithTheOx';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Core
    healingDone: HealingDone,
    healingReceived: HealingReceived,
    damageTaken: DamageTaken,
    stagger: Stagger,
    staggerFabricator: StaggerFabricator,
    brewCdr: BrewCDR,
    brews: SharedBrews,
    channeling: Channeling,
    globalCooldown: GlobalCooldown,
    // There's no throughput benefit from casting Arcane Torrent on cooldown
    arcaneTorrent: [ArcaneTorrent, { castEfficiency: null }] as const,
    checklist: Checklist,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    abilities: Abilities,
    staggerPoolGraph: StaggerPoolGraph,

    // Spells
    purifyingBrew: PurifyingBrew,
    celestialBrew: CelestialBrew,
    blackoutCombo: BlackoutCombo,
    kegSmash: KegSmash,
    tigerPalm: TigerPalm,
    rjw: RushingJadeWind,
    bof: BreathOfFire,
    bob: BlackOxBrew,
    highTolerance: HighTolerance,
    cf: CelestialFortune,
    gotox: GiftOfTheOxStat,
    shuffle: Shuffle,
    touchOfDeath: TouchOfDeath,

    // Items
    stormstoutsLastKeg: StormtoutsLastKeg,

    // normalizers
    gotoxNorm: GiftOfTheOx,
    ehNorm: ExpelHarmNorm,

    // Covenants
    fallenOrder: FallenOrder,
    faelineStomp: FaelineStomp,
    weaponsOfOrder: WeaponsOfOrder,
    bonedustBrew: BonedustBrew,

    // Conduits
    /// Endurance
    harmDenial: HarmDenial,
    fortifyingIngredients: FortifyingIngredients,
    groundingBreath: GroundingBreath,
    evasiveStride: EvasiveStride,
    /// Potency
    scaldingBrew: ScaldingBrew,
    walkWithTheOx: WalkWithTheOx,
    /// Finesse
  };
}

export default CombatLogParser;
