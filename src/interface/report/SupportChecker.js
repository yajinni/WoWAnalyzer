import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Trans, t } from '@lingui/macro';

import Icon from 'common/Icon';
import Tooltip from 'common/Tooltip';
import DiscordButton from 'interface/common/thirdpartybuttons/Discord';
import GitHubButton from 'interface/common/thirdpartybuttons/GitHub';
import makeAnalyzerUrl from 'interface/common/makeAnalyzerUrl';
import { ignoreSpecNotSupportedWarning } from 'interface/actions/specNotSupported';
import { getSpecsIgnoredNotSupportedWarning } from 'interface/selectors/skipSpecNotSupported';
import Panel from 'interface/others/Panel';

import Background from './images/weirdnelf.png';

class SupportChecker extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    config: PropTypes.shape({
      patchCompatibility: PropTypes.string.isRequired,
      spec: PropTypes.shape({
        id: PropTypes.number.isRequired,
        className: PropTypes.string.isRequired,
        specName: PropTypes.string.isRequired,
      }).isRequired,
      isSupported: PropTypes.bool,
    }).isRequired,
    report: PropTypes.object.isRequired,
    fight: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    player: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    ignoreSpecNotSupportedWarning: PropTypes.func.isRequired,
    ignored: PropTypes.array.isRequired,
  };

  constructor() {
    super();
    this.handleClickContinue = this.handleClickContinue.bind(this);
  }

  handleClickContinue() {
    // I chose on purpose not to store this in a cookie since I don't want this to be forgotten. It should not be a big deal if this happens every time the page is loaded, so long as it isn't shown every fight.
    this.props.ignoreSpecNotSupportedWarning(this.props.config.spec.id);
  }

  get continue() {
    return this.props.ignored.includes(this.props.config.spec.id);
  }

  render() {
    const { children, config, report, fight, player } = this.props;

    const spec = config.spec;

    if (!this.continue && !config.isSupported) {
      return (
        <div className="container offset">
          <h1>
            <div className="back-button">
              <Tooltip content={t({
                id: "interface.report.supportChecker.tooltip.backToPlayerSelection",
                message: `Back to player selection`
              })}>
                <Link to={makeAnalyzerUrl(report, fight.id)}>
                  <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
                </Link>
              </Tooltip>
            </div>
            <span className={spec.className.replace(' ', '')}>{player.name} - {spec.specName} {spec.className}</span>
          </h1>

          <Panel title={<Trans id="interface.report.supportChecker.specNotSupported">Sorry, this spec is currently not supported</Trans>}>
            <div className="flex wrapable">
              <div className="flex-main" style={{ minWidth: 400 }}>
                <Trans id="interface.report.supportChecker.specNotSupportedDetails">
                  This spec hasn't been updated for the latest patch so we're afraid it might be outdated and misleading. We recommend reading the <a href="https://www.wowhead.com/class-guides"><img src="/img/wowhead-tiny.png" style={{ height: '1em' }} alt="Wowhead" /> Wowhead</a> and <a href="https://www.icy-veins.com/wow/class-guides">Icy Veins</a> guides to gain more knowledge about your spec and use this to analyze yourself. You can also try asking for help in a <a href="https://www.reddit.com/r/wow/wiki/discord">class Discord</a>.<br /><br />

                  We have no ETA for support for {spec.specName} {spec.className}. We need volunteer contributors to maintain specs, and seeing as {spec.specName} {spec.className} is out of date, it's likely nobody is currently maintaining it. If you are interested or know someone who might be interested helping people help themselves, check out <a href="https://github.com/WoWAnalyzer/WoWAnalyzer">GitHub</a> or <a href="https://wowanalyzer.com/discord">Discord</a> for more information.<br /><br />

                  If you want us to prioritize support for this spec, consider upvoting support for this spec on <a href="https://suggestions.wowanalyzer.com/">the suggestions board</a>. The most popular suggestions will be bountied with funds raised from <Link to="/premium">Premium</Link>.
                </Trans><br /><br />

                <div style={{ paddingBottom: '0.5em' }}>
                  <GitHubButton />{' '}
                  <DiscordButton />
                </div>
                <Tooltip content={<Trans id="interface.report.supportChecker.tooltip.khadgarApproves">Khadgar approves your bravery</Trans>}>
                  <Link
                    to={makeAnalyzerUrl(report, fight.id, player.id)}
                    onClick={this.handleClickContinue}
                    style={{ fontSize: '1.1em' }}
                  >
                    <Icon icon="quest_khadgar" /> <Trans id="interface.report.supportChecker.continueAnyway">Continue anyway</Trans>
                  </Link>
                </Tooltip>
              </div>
              <div className="flex-sub">
                <img
                  src={Background}
                  alt=""
                  style={{
                    paddingLeft: 15,
                    maxWidth: 250,
                    marginBottom: -15,
                  }}
                />
              </div>
            </div>
          </Panel>
        </div>
      );
    }

    return children;
  }
}

const mapStateToProps = state => ({
  ignored: getSpecsIgnoredNotSupportedWarning(state),
});
export default connect(mapStateToProps, {
  ignoreSpecNotSupportedWarning,
})(SupportChecker);
