import CoreCombatLogParser from 'parser/core/CombatLogParser';
import ArcaneTorrent from 'parser/shared/modules/racials/bloodelf/ArcaneTorrent';

import Abilities from './modules/features/Abilities';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import CooldownThroughputTracker from './modules/features/CooldownThroughputTracker';
import Felstorm from './modules/features/Felstorm';
import Checklist from './modules/features/Checklist/Module';
import SummonDemonicTyrant from './modules/features/SummonDemonicTyrant';
import LegionStrike from './modules/features/LegionStrike';

import SoulShardTracker from './modules/soulshards/SoulShardTracker';
import SoulShardDetails from './modules/soulshards/SoulShardDetails';

import DemoPets from './modules/pets/DemoPets';
import PetDamageHandler from './modules/pets/DemoPets/PetDamageHandler';
import PetSummonHandler from './modules/pets/DemoPets/PetSummonHandler';
import WildImpEnergyHandler from './modules/pets/DemoPets/WildImpEnergyHandler';
import PowerSiphonHandler from './modules/pets/DemoPets/PowerSiphonHandler';
import DemonicTyrantHandler from './modules/pets/DemoPets/DemonicTyrantHandler';
import ImplosionHandler from './modules/pets/DemoPets/ImplosionHandler';
import PetTimelineTab from './modules/pets/PetTimelineTab';
import PrepullPetNormalizer from './modules/pets/normalizers/PrepullPetNormalizer';
import SummonOrderNormalizer from './modules/pets/normalizers/SummonOrderNormalizer';

import PowerSiphonNormalizer from './modules/talents/normalizers/PowerSiphonNormalizer';

import TalentStatisticBox from './modules/talents';
import Dreadlash from './modules/talents/Dreadlash';
import DemonicStrength from './modules/talents/DemonicStrength';
import BilescourgeBombers from './modules/talents/BilescourgeBombers';
import DemonicCalling from './modules/talents/DemonicCalling';
import PowerSiphon from './modules/talents/PowerSiphon';
import Doom from './modules/talents/Doom';
import FromTheShadows from './modules/talents/FromTheShadows';
import SoulStrike from './modules/talents/SoulStrike';
import SummonVilefiend from './modules/talents/SummonVilefiend';
import SoulConduit from './modules/talents/SoulConduit';
import InnerDemons from './modules/talents/InnerDemons';
import GrimoireFelguard from './modules/talents/GrimoireFelguard';
import SacrificedSouls from './modules/talents/SacrificedSouls';
import DemonicConsumption from './modules/talents/DemonicConsumption';
import NetherPortal from './modules/talents/NetherPortal';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Features
    abilities: Abilities,
    alwaysBeCasting: AlwaysBeCasting,
    cooldownThroughputTracker: CooldownThroughputTracker,
    felstorm: Felstorm,
    checklist: Checklist,
    summonDemonicTyrant: SummonDemonicTyrant,
    legionStrike: LegionStrike,

    // Core
    soulShardTracker: SoulShardTracker,
    soulShardDetails: SoulShardDetails,

    // Pets
    demoPets: DemoPets,
    petDamageHandler: PetDamageHandler,
    petSummonHandler: PetSummonHandler,
    wildImpEnergyHandler: WildImpEnergyHandler,
    powerSiphonHandler: PowerSiphonHandler,
    demonicTyrantHandler: DemonicTyrantHandler,
    implosionHandler: ImplosionHandler,
    petTimelineTab: PetTimelineTab,
    summonOrderNormalizer: SummonOrderNormalizer,
    prepullPetNormalizer: PrepullPetNormalizer,

    // Normalizers
    powerSiphonNormalizer: PowerSiphonNormalizer,

    // Talents
    talents: TalentStatisticBox,
    dreadlash: Dreadlash,
    demonicStrength: DemonicStrength,
    bilescourgeBombers: BilescourgeBombers,
    demonicCalling: DemonicCalling,
    soulConduit: SoulConduit,
    innerDemons: InnerDemons,
    fromTheShadows: FromTheShadows,
    soulStrike: SoulStrike,
    summonVilefiend: SummonVilefiend,
    powerSiphon: PowerSiphon,
    doom: Doom,
    grimoireFelguard: GrimoireFelguard,
    sacrificedSouls: SacrificedSouls,
    demonicConsumption: DemonicConsumption,
    netherPortal: NetherPortal,

    // There's no throughput benefit from casting Arcane Torrent on cooldown
    arcaneTorrent: [ArcaneTorrent, { castEfficiency: null }] as const,
  };
}

export default CombatLogParser;
