import React from 'react';
import PropTypes from 'prop-types';

import StatisticBox from './StatisticBox';

export { STATISTIC_ORDER } from './StatisticBox';

/**
 * @deprecated Use `parser/ui/Statistic` instead.
 */
class LazyLoadStatisticBox extends React.PureComponent {
  static propTypes = {
    loader: PropTypes.func.isRequired,
    value: PropTypes.node.isRequired,
    children: PropTypes.node,
  };
  static contextTypes = {
    updateResults: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      loaded: false,
      loading: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.loaded) {
      return;
    }

    this.setState({
      loading: true,
    });
    this.props.loader().then((result) => {
      this.setState({
        loading: false,
        loaded: true,
      });
      this.context.updateResults();
      return result;
    });
  }

  render() {
    const { value, children, ...others } = this.props;
    delete others.loader;
    delete others.children;

    return (
      <StatisticBox
        onClick={this.handleClick}
        value={this.state.loaded ? value : (this.state.loading ? 'Loading...' : 'Click to load')}
        style={{ cursor: this.state.loaded ? undefined : 'pointer' }}
        {...others}
      >
        {this.state.loaded ? children : null}
      </StatisticBox>
    );
  }
}

export default LazyLoadStatisticBox;
