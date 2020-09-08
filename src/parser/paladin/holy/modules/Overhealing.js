import React from 'react';
import { Trans, t } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import { i18n } from 'interface/RootLocalizationProvider';
import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';

import DivinePurpose from './talents/DivinePurpose';

class Overhealing extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    healingDone: HealingDone,
    divinePurpose: DivinePurpose,
  };

  getRawHealing(ability) {
    return ability.healingEffective + ability.healingAbsorbed + ability.healingOverheal;
  }
  getOverhealingPercentage(spellId) {
    const ability = this.abilityTracker.getAbility(spellId);
    return ability.healingOverheal / this.getRawHealing(ability);
  }

  get lightOfDawnOverhealing() {
    return this.getOverhealingPercentage(SPELLS.LIGHT_OF_DAWN_HEAL.id);
  }
  get lightOfDawnSuggestionThresholds() {
    const base = this.divinePurpose.active ? 0.45 : 0.4;
    return {
      actual: this.lightOfDawnOverhealing,
      isGreaterThan: {
        minor: base,
        average: base + 0.1,
        major: base + 0.2,
      },
      style: 'percentage',
    };
  }
  get holyShockOverhealing() {
    return this.getOverhealingPercentage(SPELLS.HOLY_SHOCK_HEAL.id);
  }
  get holyShockSuggestionThresholds() {
    const base = this.divinePurpose.active ? 0.4 : 0.35;
    return {
      actual: this.holyShockOverhealing,
      isGreaterThan: {
        minor: base,
        average: base + 0.1,
        major: base + 0.2,
      },
      style: 'percentage',
    };
  }
  get flashOfLightOverhealing() {
    return this.getOverhealingPercentage(SPELLS.FLASH_OF_LIGHT.id);
  }
  get flashOfLightSuggestionThresholds() {
    return {
      actual: this.flashOfLightOverhealing,
      isGreaterThan: {
        minor: 0.25,
        average: 0.4,
        major: 0.5,
      },
      style: 'percentage',
    };
  }
  get bestowFaithOverhealing() {
    return this.getOverhealingPercentage(SPELLS.BESTOW_FAITH_TALENT.id);
  }
  get bestowFaithSuggestionThresholds() {
    return {
      actual: this.bestowFaithOverhealing,
      isGreaterThan: {
        minor: 0.4,
        average: 0.5,
        major: 0.6,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.lightOfDawnSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <Trans>
          Try to avoid overhealing with <SpellLink id={SPELLS.LIGHT_OF_DAWN_CAST.id} />. Save it for
          when people are missing health.
        </Trans>,
      )
        .icon(SPELLS.LIGHT_OF_DAWN_CAST.icon)
        .actual(i18n._(t`${formatPercentage(actual)}% overhealing`))
        .recommended(i18n._(t`<${formatPercentage(recommended)}% is recommended`));
    });

    when(this.holyShockSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <Trans>
          Try to avoid overhealing with <SpellLink id={SPELLS.HOLY_SHOCK_CAST.id} />. Save it for
          when people are missing health.
        </Trans>,
      )
        .icon(SPELLS.HOLY_SHOCK_HEAL.icon)
        .actual(i18n._(t`${formatPercentage(actual)}% overhealing`))
        .recommended(i18n._(t`<${formatPercentage(recommended)}% is recommended`));
    });

    when(this.flashOfLightSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <Trans>
          Try to avoid overhealing with <SpellLink id={SPELLS.FLASH_OF_LIGHT.id} />. If Flash of
          Light would overheal it is generally advisable to cast a{' '}
          <SpellLink id={SPELLS.HOLY_LIGHT.id} /> instead.
        </Trans>,
      )
        .icon(SPELLS.FLASH_OF_LIGHT.icon)
        .actual(i18n._(t`${formatPercentage(actual)}% overhealing`))
        .recommended(i18n._(t`<${formatPercentage(recommended)}% is recommended`));
    });

    when(this.bestowFaithSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <Trans>
          Try to avoid overhealing with <SpellLink id={SPELLS.BESTOW_FAITH_TALENT.id} />. Cast it
          just before someone is about to take damage and consider casting it on targets other than
          tanks.
        </Trans>,
      )
        .icon(SPELLS.BESTOW_FAITH_TALENT.icon)
        .actual(i18n._(t`${formatPercentage(actual)}% overhealing`))
        .recommended(i18n._(t`<${formatPercentage(recommended)}% is recommended`));
    });
  }
}

export default Overhealing;
