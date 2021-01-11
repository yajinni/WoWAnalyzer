import { formatPercentage } from 'common/format';

import CoreAlwaysBeCasting from 'parser/shared/modules/AlwaysBeCasting';
import { t } from '@lingui/macro';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(0.20)
      .addSuggestion((suggest, actual, recommended) => suggest('Your downtime can be improved. Try to Always Be Casting (ABC); try to reduce the delay between casting spells and when you\'re not healing try to contribute some damage.')
        .icon('spell_mage_altertime')
        .actual(t({
      id: "demonhunter.vengeance.suggestions.alwaysBeCasting.downtime",
      message: `${formatPercentage(actual)}% downtime`
    }))
        .recommended(`<${formatPercentage(recommended)}% is recommended`)
        .regular(recommended + 0.05).major(recommended + 0.15));
  }
}

export default AlwaysBeCasting;
