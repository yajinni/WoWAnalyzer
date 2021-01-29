import React from 'react';

import { Boss, findByBossId } from 'game/raids';
import { formatDuration, formatNumber, formatPercentage } from 'common/format';
import ModuleError from 'parser/core/ModuleError';
import {
  AnyEvent,
  CombatantInfoEvent,
  Event, EventType,
  HasSource,
  HasTarget,
  MappedEvent,
} from 'parser/core/Events';

import Haste from 'parser/shared/modules/Haste';
import DeathRecapTracker from 'parser/shared/modules/DeathRecapTracker';

import Module, { Options } from './Module';
import Fight from './Fight';
import Analyzer from './Analyzer';
import EventFilter from './EventFilter';
import { EventListener } from './EventSubscriber';
import { Builds } from '../Config';
// Normalizers
import ApplyBuffNormalizer from '../shared/normalizers/ApplyBuff';
import CancelledCastsNormalizer from '../shared/normalizers/CancelledCasts';
import PrePullCooldownsNormalizer from '../shared/normalizers/PrePullCooldowns';
import FightEndNormalizer from '../shared/normalizers/FightEnd';
import PhaseChangesNormalizer from '../shared/normalizers/PhaseChanges';
import MissingCastsNormalizer from '../shared/normalizers/MissingCasts';
// Enhancers
import SpellTimeWaitingOnGlobalCooldown from '../shared/enhancers/SpellTimeWaitingOnGlobalCooldown';
// Core modules
import HealingDone from '../shared/modules/throughput/HealingDone';
import DamageDone from '../shared/modules/throughput/DamageDone';
import DamageTaken from '../shared/modules/throughput/DamageTaken';
import ThroughputStatisticGroup from '../shared/modules/throughput/ThroughputStatisticGroup';
import DeathTracker from '../shared/modules/DeathTracker';

import Combatants from '../shared/modules/Combatants';
import AbilityTracker from '../shared/modules/AbilityTracker';
import StatTracker from '../shared/modules/StatTracker';
import AlwaysBeCasting from '../shared/modules/AlwaysBeCasting';
import FilteredActiveTime from '../shared/modules/FilteredActiveTime';
import Abilities from './modules/Abilities';
import Buffs from './modules/Buffs';
import AbilitiesMissing from '../shared/modules/AbilitiesMissing';
import CastEfficiency from '../shared/modules/CastEfficiency';
import SpellUsable from '../shared/modules/SpellUsable';
import EventHistory from '../shared/modules/EventHistory';
import SpellHistory from '../shared/modules/SpellHistory';
import GlobalCooldown from '../shared/modules/GlobalCooldown';
import Enemies from '../shared/modules/Enemies';
import EnemyInstances from '../shared/modules/EnemyInstances';
import Pets from '../shared/modules/Pets';
import ManaValues from '../shared/modules/ManaValues';
import SpellManaCost from '../shared/modules/SpellManaCost';
import Channeling from '../shared/modules/Channeling';
import DeathDowntime from '../shared/modules/downtime/DeathDowntime';
import TotalDowntime from '../shared/modules/downtime/TotalDowntime';
import DistanceMoved from '../shared/modules/others/DistanceMoved';
import DispelTracker from '../shared/modules/DispelTracker';
// Tabs
import RaidHealthTab from '../shared/modules/features/RaidHealthTab';

import CritEffectBonus from '../shared/modules/helpers/CritEffectBonus';

import PotionChecker from '../shared/modules/items/PotionChecker';
import EnchantChecker from '../shared/modules/items/EnchantChecker';
import FlaskChecker from '../shared/modules/items/FlaskChecker';
import FoodChecker from '../shared/modules/items/FoodChecker';
import Healthstone from '../shared/modules/items/Healthstone';
import HealthPotion from '../shared/modules/items/HealthPotion';
import CombatPotion from '../shared/modules/items/CombatPotion';
import WeaponEnhancementChecker from '../shared/modules/items/WeaponEnhancementChecker';
import AugmentRuneChecker from '../shared/modules/items/AugmentRuneChecker';
import PreparationRuleAnalyzer from '../shared/modules/features/Checklist/PreparationRuleAnalyzer';
// Racials
import ArcaneTorrent from '../shared/modules/racials/bloodelf/ArcaneTorrent';
import GiftOfTheNaaru from '../shared/modules/racials/draenei/GiftOfTheNaaru';
import MightOfTheMountain from '../shared/modules/racials/dwarf/MightOfTheMountain';
import Stoneform from '../shared/modules/racials/dwarf/Stoneform';
import Berserking from '../shared/modules/racials/troll/Berserking';
import BloodFury from '../shared/modules/racials/orc/BloodFury';
// Shared Buffs
import VantusRune from '../shared/modules/spells/VantusRune';
// Shadowlands
// Dungeons
// PVP
//Enchants
// Crafted
import DarkmoonDeckVoracity from '../shared/modules/items/shadowlands/crafted/DarkmoonDeckVoracity';
//Dungeons
import OverchargedAnimaBattery from '../shared/modules/items/shadowlands/dungeons/OverchargedAnimaBattery';
// Castle Nathria
import SoulInfusion from '../shared/modules/spells/SoulInfusion';

import ParseResults from './ParseResults';
import EventsNormalizer from './EventsNormalizer';
import EventEmitter from './modules/EventEmitter';
import Combatant from './Combatant';

// This prints to console anything that the DI has to do
const debugDependencyInjection = false;
const MAX_DI_ITERATIONS = 100;
const isMinified = process.env.NODE_ENV === 'production';

type DependencyDefinition = typeof Module | readonly [typeof Module, { [option: string]: any }];
export type DependenciesDefinition = { [desiredName: string]: DependencyDefinition };

interface Talent {
  id: number;
}
export interface Player {
  id: number;
  name: string;
  talents: Talent[];
  artifact: unknown;
  gear: unknown;
  auras: unknown;
}

class CombatLogParser {
  /** @deprecated Move this kind of info to the Abilities config */
  static abilitiesAffectedByHealingIncreases: number[] = [];
  /** @deprecated Move this kind of info to the Abilities config */
  static abilitiesAffectedByDamageIncreases: number[] = [];

  static internalModules: DependenciesDefinition = {
    fightEndNormalizer: FightEndNormalizer,
    eventEmitter: EventEmitter,
    combatants: Combatants,
    deathDowntime: DeathDowntime,
    totalDowntime: TotalDowntime,
  };
  static defaultModules: DependenciesDefinition = {
    // Normalizers
    applyBuffNormalizer: ApplyBuffNormalizer,
    cancelledCastsNormalizer: CancelledCastsNormalizer,
    prepullNormalizer: PrePullCooldownsNormalizer,
    phaseChangesNormalizer: PhaseChangesNormalizer,
    missingCastsNormalize: MissingCastsNormalizer,

    // Enhancers
    spellTimeWaitingOnGlobalCooldown: SpellTimeWaitingOnGlobalCooldown,

    // Analyzers
    healingDone: HealingDone,
    damageDone: DamageDone,
    damageTaken: DamageTaken,
    throughputStatisticGroup: ThroughputStatisticGroup,
    deathTracker: DeathTracker,

    enemies: Enemies,
    enemyInstances: EnemyInstances,
    pets: Pets,
    spellManaCost: SpellManaCost,
    channeling: Channeling,
    eventHistory: EventHistory,
    abilityTracker: AbilityTracker,
    haste: Haste,
    statTracker: StatTracker,
    alwaysBeCasting: AlwaysBeCasting,
    filteredActiveTime: FilteredActiveTime,
    abilities: Abilities,
    buffs: Buffs,
    abilitiesMissing: AbilitiesMissing,
    CastEfficiency: CastEfficiency,
    spellUsable: SpellUsable,
    spellHistory: SpellHistory,
    globalCooldown: GlobalCooldown,
    manaValues: ManaValues,
    vantusRune: VantusRune,
    distanceMoved: DistanceMoved,
    deathRecapTracker: DeathRecapTracker,
    dispels: DispelTracker,

    critEffectBonus: CritEffectBonus,

    // Tabs
    raidHealthTab: RaidHealthTab,

    potionChecker: PotionChecker,
    enchantChecker: EnchantChecker,
    flaskChecker: FlaskChecker,
    foodChecker: FoodChecker,
    augmentRuneChecker: AugmentRuneChecker,
    healthstone: Healthstone,
    healthPotion: HealthPotion,
    combatPotion: CombatPotion,
    weaponEnhancementChecker: WeaponEnhancementChecker,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,

    // Racials
    arcaneTorrent: ArcaneTorrent,
    giftOfTheNaaru: GiftOfTheNaaru,
    mightOfTheMountain: MightOfTheMountain,
    stoneform: Stoneform,
    berserking: Berserking,
    bloodFury: BloodFury,

    // Items:

    // Legendaries

    // Crafted
    darkmoonDeckVoracity: DarkmoonDeckVoracity,

    // Shadowlands

    // Castle Nathria
    soulInfusion: SoulInfusion,

    // Dungeons
    overchargedAnimaBattery: OverchargedAnimaBattery,
  };
  // Override this with spec specific modules when extending
  static specModules: DependenciesDefinition = {};

  applyTimeFilter = (start: number, end: number) => null; //dummy function gets filled in by event parser
  applyPhaseFilter = (phase: any, instance: any) => null; //dummy function gets filled in by event parser

  // TODO create report type
  report: any;
  /** Character info from the Battle.net API (optional) */
  // TODO create profile type
  characterProfile: any;

  // Player info from WCL - required
  player: SelectedPlayer;
  playerPets: Array<{
    name: string;
    id: number;
    guid: number;
    type: "Pet",
    icon: string;
  }>;
  fight: Fight;
  build: string;
  builds: Builds;
  boss: Boss | null;
  combatantInfoEvents: CombatantInfoEvent[];

  //Disabled Modules
  disabledModules!: { [state in ModuleError]: any[] };

  adjustForDowntime = true;
  get hasDowntime() {
    return this.getModule(TotalDowntime).totalBaseDowntime > 0;
  }

  _modules: { [name: string]: Module } = {};
  get activeModules() {
    return Object.values(this._modules).filter((module) => module.active);
  }

  get playerId() {
    return this.player.id;
  }
  get fightId() {
    return this.fight.id;
  }

  _timestamp: number;
  get currentTimestamp() {
    return this.finished ? this.fight.end_time : this._timestamp;
  }
  get fightDuration() {
    return (
      this.currentTimestamp -
      this.fight.start_time -
      (this.adjustForDowntime ? this.getModule(TotalDowntime).totalBaseDowntime : 0)
    );
  }
  finished = false;

  get players(): Player[] {
    return this.report.friendlies;
  }
  get selectedCombatant(): Combatant {
    return this.getModule(Combatants).selected;
  }

  constructor(
    report: any,
    selectedPlayer: SelectedPlayer,
    selectedFight: Fight,
    combatantInfoEvents: CombatantInfoEvent[],
    characterProfile: any,
    build: string,
    builds: Builds,
  ) {
    this.report = report;
    this.player = selectedPlayer;
    this.playerPets = report.friendlyPets.filter(
      (pet: { petOwner: any }) => pet.petOwner === selectedPlayer.id,
    );
    this.fight = selectedFight;
    this.build = build;
    this.builds = builds;
    this.combatantInfoEvents = combatantInfoEvents;
    // combatantinfo events aren't included in the regular events, but they're still used to analysis. We should have them show in the history to make it complete.
    combatantInfoEvents.forEach((event) => this.eventHistory.push(event));
    this.characterProfile = characterProfile;
    this._timestamp = selectedFight.start_time;
    this.boss = findByBossId(selectedFight.boss);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore populated dynamically but object keys still strongly typed
    this.disabledModules = {};
    //initialize disabled modules for each state
    Object.values(ModuleError).forEach((key) => {
      this.disabledModules[key] = [];
    });
    const ctor = this.constructor as typeof CombatLogParser;
    this.initializeModules({
      ...ctor.internalModules,
      ...ctor.defaultModules,
      ...ctor.specModules,
    });
  }
  finish() {
    this.finished = true;
    /** @var {EventEmitter} */
    const emitter = this.getModule(EventEmitter);
    console.log(
      'Events triggered:',
      emitter.numTriggeredEvents,
      'Event listeners added:',
      emitter.numEventListeners,
      'Listeners called:',
      emitter.numListenersCalled,
      'Listeners called (after filters):',
      emitter.numActualExecutions,
      'Listeners filtered away:',
      emitter.numListenersCalled - emitter.numActualExecutions,
    );
  }

  _getModuleClass(config: DependencyDefinition): [typeof Module, any] {
    let moduleClass;
    let options;
    if (config instanceof Array) {
      moduleClass = config[0];
      options = config[1];
    } else {
      moduleClass = config;
      options = {};
    }
    return [moduleClass, options];
  }
  _resolveDependencies(dependencies: { [desiredName: string]: typeof Module }) {
    const availableDependencies: { [name: string]: Module } = {};
    const missingDependencies: Array<typeof Module> = [];
    if (dependencies) {
      Object.keys(dependencies).forEach((desiredDependencyName) => {
        const dependencyClass = dependencies[desiredDependencyName];

        const dependencyModule = this.getOptionalModule(dependencyClass);
        if (dependencyModule) {
          availableDependencies[desiredDependencyName] = dependencyModule;
        } else {
          missingDependencies.push(dependencyClass);
        }
      });
    }
    return [availableDependencies, missingDependencies] as const;
  }
  /**
   * @param {Module} moduleClass
   * @param {object} [options]
   * @param {string} [desiredModuleName]  Deprecated: will be removed Soon™.
   */
  loadModule<T extends typeof Module>(
    moduleClass: T,
    options: { [prop: string]: any; priority: number },
    desiredModuleName = `module${Object.keys(this._modules).length}`,
  ) {
    // eslint-disable-next-line new-cap
    const module = new moduleClass({
      ...options,
      owner: this,
    });
    if (options) {
      // We can't set the options via the constructor since a parent constructor can't override the values of a child's class properties.
      // See https://github.com/Microsoft/TypeScript/issues/6110 for more info
      Object.keys(options).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        module[key] = options[key];
      });
    }
    // TODO: Remove module naming
    module.key = desiredModuleName;
    this._modules[desiredModuleName] = module;
    return module;
  }
  initializeModules(modules: DependenciesDefinition, iteration = 1) {
    // TODO: Refactor and test, this dependency injection thing works really well but it's hard to understand or change.
    const failedModules: string[] = [];
    Object.keys(modules).forEach((desiredModuleName) => {
      const moduleConfig = modules[desiredModuleName];
      if (!moduleConfig) {
        return;
      }
      const [moduleClass, options] = this._getModuleClass(moduleConfig);
      const [availableDependencies, missingDependencies] = this._resolveDependencies(
        moduleClass.dependencies,
      );
      const hasMissingDependency = missingDependencies.length === 0;

      if (hasMissingDependency) {
        if (debugDependencyInjection) {
          if (Object.keys(availableDependencies).length === 0) {
            console.log('Loading', moduleClass.name);
          } else {
            console.log(
              'Loading',
              moduleClass.name,
              'with dependencies:',
              Object.keys(availableDependencies),
            );
          }
        }
        // The priority goes from lowest (most important) to highest, seeing as modules are loaded after their dependencies are loaded, just using the count of loaded modules is sufficient.
        const priority = Object.keys(this._modules).length;
        try {
          this.loadModule(
            moduleClass,
            {
              ...options,
              ...availableDependencies,
              priority,
            },
            desiredModuleName,
          );
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            throw e;
          }
          this.disabledModules[ModuleError.INITIALIZATION].push({
            key: isMinified ? desiredModuleName : moduleClass.name,
            module: moduleClass,
            error: e,
          });
          debugDependencyInjection &&
            console.warn(moduleClass.name, 'disabled due to error during initialization: ', e);
        }
      } else {
        const disabledDependencies = missingDependencies
          .map((d) => d.name)
          .filter((x) =>
            this.disabledModules[ModuleError.INITIALIZATION].map((d) => d.module.name).includes(x),
          ); // see if a dependency was previously disabled due to an error
        if (disabledDependencies.length !== 0) {
          // if a dependency was already marked as disabled due to an error, mark this module as disabled
          this.disabledModules[ModuleError.DEPENDENCY].push({
            key: isMinified ? desiredModuleName : moduleClass.name,
            module: moduleClass,
          });
          debugDependencyInjection &&
            console.warn(
              moduleClass.name,
              'disabled due to error during initialization of a dependency.',
            );
        } else {
          debugDependencyInjection &&
            console.warn(
              moduleClass.name,
              'could not be loaded, missing dependencies:',
              missingDependencies.map((d) => d.name),
            );
          failedModules.push(desiredModuleName);
        }
      }
    });

    if (failedModules.length !== 0) {
      debugDependencyInjection &&
        console.warn(
          `${failedModules.length} modules failed to load, trying again:`,
          failedModules.map((key) => {
            const def = modules[key];
            if (def instanceof Array) {
              return def[0].name;
            } else {
              return (def as typeof Module).name;
            }
          }),
        );
      const newBatch: DependenciesDefinition = {};
      failedModules.forEach((key) => {
        newBatch[key] = modules[key];
      });
      if (iteration > MAX_DI_ITERATIONS) {
        // Sometimes modules can't be imported at all because they depend on modules not enabled or have a circular dependency. Stop trying after a while.
        // eslint-disable-next-line no-debugger
        debugger;
        throw new Error(`Failed to load modules: ${Object.keys(newBatch).join(', ')}`);
      }
      this.initializeModules(newBatch, iteration + 1);
    } else {
      this.allModulesInitialized();
    }
  }
  allModulesInitialized() {
    // Executed when module initialization is complete
  }
  _moduleCache = new Map();
  getOptionalModule<T extends Module>(type: { new (options: Options): T }): T | undefined {
    // We need to use a cache and can't just set this on initialization because we sometimes search by the inheritance chain.
    const cacheEntry = this._moduleCache.get(type);
    if (cacheEntry !== undefined) {
      return cacheEntry;
    }
    // Search for a specific module by its type, accepting any modules that have the type somewhere in the inheritance chain
    const module = Object.values(this._modules).find((module) => module instanceof type);
    this._moduleCache.set(type, module);
    return module as T;
  }
  getModule<T extends Module>(type: { new (options: Options): T }): T {
    const module = this.getOptionalModule(type);
    if (module === undefined) {
      throw new Error(`Module not found: ${type.name}`);
    }
    return module;
  }
  normalize(events: AnyEvent[]) {
    this.activeModules
      .filter((module) => module instanceof EventsNormalizer)
      .map((module) => module as EventsNormalizer)
      .sort((a, b) => a.priority - b.priority) // lowest should go first, as `priority = 0` will have highest prio
      .forEach((normalizer) => {
        if (normalizer.normalize) {
          events = normalizer.normalize(events);
        }
      });
    return events;
  }

  /** The amount of events parsed. This can reliably be used to determine if something should re-render. */
  eventCount = 0;
  eventHistory: AnyEvent[] = [];
  addEventListener<ET extends EventType, E extends MappedEvent<ET>>(
    eventFilter: ET | EventFilter<ET>,
    listener: EventListener<ET, E>,
    module: Module,
  ) {
    this.getModule(EventEmitter).addEventListener(eventFilter, listener, module);
  }

  deepDisable(module: Module, state: ModuleError, error: Error | undefined = undefined) {
    if (!module.active) {
      return; //return early
    }
    console.error('Disabling', isMinified ? module.key : module.constructor.name);
    this.disabledModules[state].push({
      key: isMinified ? module.key : module.constructor.name,
      module: module.constructor,
      ...(error && { error: error }),
    });
    module.active = false;
    this.activeModules.forEach((active) => {
      const ctor = active.constructor as typeof Module;
      const deps = ctor.dependencies;
      // Inspectors may light up `module instanceof depClass` because of the constructor cast
      if (deps && Object.values(deps).find((depClass) => module instanceof depClass)) {
        this.deepDisable(active, ModuleError.DEPENDENCY);
      }
    });
  }

  byPlayer<ET extends EventType>(event: Event<ET>, playerId = this.player.id) {
    return HasSource(event) && event.sourceID === playerId;
  }
  toPlayer<ET extends EventType>(event: Event<ET>, playerId = this.player.id) {
    return HasTarget(event) && event.targetID === playerId;
  }
  byPlayerPet<ET extends EventType>(event: Event<ET>) {
    return HasSource(event) && this.playerPets.some((pet) => pet.id === event.sourceID);
  }
  toPlayerPet<ET extends EventType>(event: Event<ET>) {
    return HasTarget(event) && this.playerPets.some((pet) => pet.id === event.targetID);
  }

  getPercentageOfTotalHealingDone(healingDone: number) {
    return healingDone / this.getModule(HealingDone).total.effective;
  }
  formatItemHealingDone(healingDone: number) {
    return `${formatPercentage(
      this.getPercentageOfTotalHealingDone(healingDone),
    )} % / ${formatNumber((healingDone / this.fightDuration) * 1000)} HPS`;
  }
  formatItemAbsorbDone(absorbDone: number) {
    return `${formatNumber(absorbDone)}`;
  }
  getPercentageOfTotalDamageDone(damageDone: number) {
    return damageDone / this.getModule(DamageDone).total.effective;
  }
  formatItemDamageDone(damageDone: number) {
    return `${formatPercentage(this.getPercentageOfTotalDamageDone(damageDone))} % / ${formatNumber(
      (damageDone / this.fightDuration) * 1000,
    )} DPS`;
  }
  getPercentageOfTotalDamageTaken(damageTaken: number) {
    return damageTaken / this.getModule(DamageTaken).total.effective;
  }
  formatTimestamp(timestamp: number, precision = 0) {
    return formatDuration((timestamp - this.fight.start_time) / 1000, precision);
  }

  generateResults(adjustForDowntime: boolean): ParseResults {
    this.adjustForDowntime = adjustForDowntime;

    let results: ParseResults = new ParseResults();

    const addStatistic = (statistic: any, basePosition: number, key: string) => {
      if (!statistic) {
        return;
      }
      const position =
        statistic.props.position !== undefined ? statistic.props.position : basePosition;
      results.statistics.push(
        React.cloneElement(statistic, {
          key,
          position,
        }),
      );
    };

    const attemptResultGeneration = () =>
      Object.keys(this._modules)
        .filter((key) => this._modules[key].active)
        .sort((a, b) => this._modules[b].priority - this._modules[a].priority)
        .every((key, index) => {
          const module = this._modules[key];

          try {
            if (module instanceof Analyzer) {
              const analyzer = module as Analyzer;
              if (analyzer.statistic) {
                let basePosition = index;
                if (analyzer.statisticOrder !== undefined) {
                  basePosition = analyzer.statisticOrder;
                  console.warn(
                    'DEPRECATED',
                    "Setting the position of a statistic via a module's `statisticOrder` prop is deprecated. Set the `position` prop on the `StatisticBox` instead. Example commit: https://github.com/WoWAnalyzer/WoWAnalyzer/commit/ece1bbeca0d3721ede078d256a30576faacb803d",
                    module,
                  );
                }

                // TODO - confirm removing i18n doesn't actually change anything here
                const statistic = analyzer.statistic();
                if (statistic) {
                  if (Array.isArray(statistic)) {
                    statistic.forEach((statistic, statisticIndex) => {
                      addStatistic(statistic, basePosition, `${key}-statistic-${statisticIndex}`);
                    });
                  } else {
                    addStatistic(statistic, basePosition, `${key}-statistic`);
                  }
                }
              }
              if (analyzer.tab) {
                const tab = analyzer.tab();
                if (tab) {
                  results.tabs.push(tab);
                }
              }
              if (analyzer.suggestions) {
                analyzer.suggestions(results.suggestions.when);
              }
            }
          } catch (e) {
            //error occured during results generation of module, disable module and all modules depending on it
            if (process.env.NODE_ENV !== 'production') {
              throw e;
            }
            this.deepDisable(module, ModuleError.RESULTS, e);
            //break loop and start again with inaccurate modules now disabled (in case of modules being rendered before their dependencies' errors are encountered)
            return false;
          }
          return true;
        });

    //keep trying to generate results until no "new" errors are found anymore to weed out all the inaccurate / errored modules
    let generated = false;
    while (!generated) {
      results = new ParseResults();

      results.tabs = [];
      generated = attemptResultGeneration();
    }

    return results;
  }
}
export type SelectedPlayer = {
  name: string;
  id: number;
  guid: number;
  type: string;
};

export default CombatLogParser;
