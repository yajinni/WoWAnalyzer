import React from 'react';
import PropTypes from 'prop-types';

import { SpellLink } from 'interface';
import { SpellIcon } from 'interface';

import STATISTIC_CATEGORY from './STATISTIC_CATEGORY';
import StatisticBox from './StatisticBox';

export { default as STATISTIC_ORDER } from './STATISTIC_ORDER';

/**
 * @deprecated Use `parser/ui/Statistic` instead.
 */
const TalentStatisticBox = ({ talent, icon, label, ...others }) => (
  <StatisticBox
    {...others}
    icon={icon || <SpellIcon id={talent} />}
    label={label || <SpellLink id={talent} icon={false} />}
  />
);
TalentStatisticBox.propTypes = {
  talent: PropTypes.number.isRequired,
  /**
   * Override the trait's icon.
   */
  icon: PropTypes.node,
  /**
   * Override the trait's label.
   */
  label: PropTypes.node,
};
TalentStatisticBox.defaultProps = {
  category: STATISTIC_CATEGORY.TALENTS,
};

export default TalentStatisticBox;
