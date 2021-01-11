import React from 'react';

import BaseModule from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

import CancelledCasts from '../CancelledCasts';
import AlwaysBeCasting from '../AlwaysBeCasting';
import MoonfireUptime from '../MoonfireUptime';
import SunfireUptime from '../SunfireUptime';
import StellarFlareUptime from '../../talents/StellarFlareUptime';
import LunarEmpowerment from '../LunarEmpowerment';
import SolarEmpowerment from '../SolarEmpowerment';
import EarlyDotRefreshes from '../EarlyDotRefreshes';
import EarlyDotRefreshesInstants from '../EarlyDotRefreshesInstants';

import AstralPowerDetails from '../../resourcetracker/AstralPowerDetails';

import Component from './Component';

class Checklist extends BaseModule {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    alwaysBeCasting: AlwaysBeCasting,
    cancelledCasts: CancelledCasts,
    moonfireUptime: MoonfireUptime,
    sunfireUptime: SunfireUptime,
    stellarFlareUptime: StellarFlareUptime,
    lunarEmpowerment: LunarEmpowerment,
    solarEmpowerment: SolarEmpowerment,
    earlyDotRefreshes: EarlyDotRefreshes,
    earlyDotRefreshesInstants: EarlyDotRefreshesInstants,
    astralPowerDetails: AstralPowerDetails,
  };

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          downtime: this.alwaysBeCasting.suggestionThresholds,
          cancelledCasts: this.cancelledCasts.suggestionThresholds,
          moonfireUptime: this.moonfireUptime.suggestionThresholds,
          sunfireUptime: this.sunfireUptime.suggestionThresholds,
          stellarFlareUptime: this.stellarFlareUptime.suggestionThresholds,
          moonfireRefresh: this.earlyDotRefreshesInstants.suggestionThresholdsMoonfireEfficiency,
          sunfireRefresh: this.earlyDotRefreshesInstants.suggestionThresholdsSunfireEfficiency,
          stellarFlareRefresh: this.earlyDotRefreshes.suggestionThresholdsStellarFlareEfficiency,
          astralPowerEfficiency: this.astralPowerDetails.suggestionThresholds,
          solarEmpowermentEfficiency: this.solarEmpowerment.suggestionThresholds,
          lunarEmpowermentEfficiency: this.lunarEmpowerment.suggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
