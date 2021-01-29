import React, { ReactNode } from 'react';

import CoreChangelog from 'CHANGELOG';
import SPECS from 'game/SPECS';
import SpecIcon from 'interface/SpecIcon';
import DropdownIcon from 'interface/icons/Dropdown';
import Panel from 'interface/Panel';
import { Expandable } from 'interface/Expandable';
import AVAILABLE_CONFIGS from 'parser';
import { ChangelogEntry } from 'common/changelog';
import contributors, { Character, Contributor } from 'common/contributor';

type ContributorProps = {
  contributorId: string,
  ownPage?: boolean,
}

class ContributorDetails extends React.PureComponent<ContributorProps> {
  constructor(props: ContributorProps) {
    super(props);
    this.filterChangelog = this.filterChangelog.bind(this);
  }

  //region Layout-Helpers

  removeWhiteSpaces(string: string) {
    return string.replace(' ', '');
  }

  renderCharacter(character: Character) {
    return (
      <div key={character.name}>
        <a href={character.link} className={this.removeWhiteSpaces(character.spec.className)}>
          <SpecIcon id={character.spec.id} /> {character.name}
        </a>
      </div>
    );
  }

  filterChangelog(contribution: ChangelogEntry) {
    return contribution.contributors.includes(contributors[this.props.contributorId]);
  }

  contributionHeader(spec: number) {
    if (spec === 0) {
      return (
        <>
          <img src="/favicon.png" style={{ height: '2em', width: '2em', marginRight: 10 }} alt="Core" />
          Core
        </>
      );
    }

    return (
      <>
        <SpecIcon id={spec} style={{ height: '2em', width: '2em', marginRight: 10 }} />
        {SPECS[spec].specName} {SPECS[spec].className}
      </>
    );
  }

  links(object: { [name: string]: string } | undefined) {
    if (!object) {
      return null;
    }

    const value: ReactNode[] = [];
    Object.keys(object).forEach((key) => {
      value.push(
        <div>
          <a href={object[key]} target="_blank" rel="noopener noreferrer">{key}</a>
        </div>,
      );
    });
    return (
      <div className="row" style={{ marginBottom: 20 }}>
        <div className="col-md-3"><b>Links:</b></div>
        <div className="col-md-9">
          {value}
        </div>
      </div>
    );
  }

  additionalInfo(object: Contributor['others']) {
    if (object === undefined) {
      return null;
    }

    const value: React.ReactNode[] = [];
    Object.keys(object).forEach((key) => {
      const info = object[key];
      if (Array.isArray(info)) {
        const subvalue: React.ReactNode[] = [];
        info.forEach((elem) => {
          subvalue.push(<div>{elem}</div>);
        });

        value.push(<div className="row">
          <div className="col-md-3"><b>{key}:</b></div>
          <div className="col-md-9">
            {subvalue}
          </div>
        </div>);

      } else if (typeof info === 'string') {
        value.push(<div className="row">
          <div className="col-md-3"><b>{key}:</b></div>
          <div className="col-md-9">
            {object[key]}
          </div>
        </div>);
      }
    });
    return value;
  }

  get maintainer() {
    const maintainedSpecs = AVAILABLE_CONFIGS
      .filter(elem => elem.contributors.filter(contributor => contributor.nickname === this.props.contributorId).length > 0)
      .map(config => config.spec);
    if (maintainedSpecs.length === 0) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-3"><b>Maintainer:</b></div>
        <div className="col-md-9">
          {maintainedSpecs.map(spec => (
            <div key={spec.id} className={this.removeWhiteSpaces(spec.className)}>
              <SpecIcon id={spec.id} /> {spec.specName} {spec.className}
            </div>
          ))}
        </div>
      </div>
    );
  }

  chars(contributor: Contributor, mains: boolean) {
    const characters = mains ? contributor.mains : contributor.alts;
    if (!characters) {
      return null;
    }

    const style = mains ? { marginTop: 20 } : { marginBottom: 20 };
    return (
      <div className="row" style={style}>
        <div className="col-md-3"><b>{mains ? "Mains" : "Alts"}:</b></div>
        <div className="col-md-9">
          {characters.map(char => this.renderCharacter(char))}
        </div>
      </div>
    );
  }

  text(text: string | undefined, title: string) {
    if (!text) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-md-3"><b>{title}:</b></div>
        <div className="col-md-9">
          {text}
        </div>
      </div>
    );
  }

  invalidContributor() {
    return (
      <section>
        <header>
          <div className="row">
            <div className="col-md-12">
              <h1>Invalid Contributor</h1>
            </div>
          </div>
        </header>
      </section>
    );
  }

  componentDidMount() {
    if (this.props.ownPage) {
      return;
    }

    document.body.classList.toggle('no-scroll');
  }

  componentWillUnmount() {
    if (this.props.ownPage) {
      return;
    }

    document.body.classList.remove('no-scroll');
  }

  //endregion

  render() {
    const { contributorId } = this.props;
    const contributor: Contributor | undefined = contributors[contributorId];

    if (!contributor) {
      return this.invalidContributor();
    }

    const initial: {[id: number]: ChangelogEntry[]} = { 0: CoreChangelog };
    const contributions = AVAILABLE_CONFIGS.reduce((obj, elem) => {
      obj[elem.spec.id] = elem.changelog;
      return obj;
    }, initial);

    Object.keys(contributions).map(Number).forEach(key => {
      contributions[key] = contributions[key].filter(this.filterChangelog);
      if (contributions[key].length === 0) {
        delete contributions[key];
      }
    });

    if (!contributor.avatar) {
      contributor.avatar = '/favicon.png';
    }

    return (
      <div className="contributor-detail">
        <div className="flex-main">
          <div className="row">
            <div className="col-md-5">
              <Panel
                title={contributor.nickname}
              >
                <div style={{ textAlign: 'center' }}>
                  <img src={contributor.avatar} alt="Avatar" style={{ marginTop: 20, maxHeight: 200, borderRadius: '50%' }} />
                </div>
                <div className="flex-main contributorlist">
                  {this.text(contributor.about, 'About')}
                  <div className="row">
                    <div className="col-md-3"><b>GitHub:</b></div>
                    <div className="col-md-9">
                      <a href={'https://github.com/' + contributor.github} target="_blank" rel="noopener noreferrer">{contributor.github}</a>
                    </div>
                  </div>
                  {this.text(contributor.discord, 'Discord')}
                  {this.maintainer}
                  {this.links(contributor.links)}
                  {this.additionalInfo(contributor.others)}
                  {this.chars(contributor, true)}
                  {this.chars(contributor, false)}
                </div>
              </Panel>
            </div>

            <div className="col-md-7">
              <Panel
                title="Contributions this expansion"
                pad={false}
              >
                <ul className="list">
                  {Object.keys(contributions).map(Number).map((type, index) => (
                    <Expandable
                      key={index}
                      element="li"
                      header={(
                        <div className="flex">
                          <div className="flex-main name">
                            {this.contributionHeader(type)} ({contributions[type].length} {contributions[type].length === 1 ?  'change' : 'changes'})
                          </div>
                          <div className="flex-sub chevron">
                            <DropdownIcon />
                          </div>
                        </div>
                      )}
                    >
                      <ul className="list text depad">
                        {contributions[type].map((contribution, index) => (
                          <li key={index} className="row">
                            <div className="col-md-2">
                              {contribution.date.toLocaleDateString()}
                            </div>
                            <div className="col-md-10">
                              {contribution.changes}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Expandable>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContributorDetails;
