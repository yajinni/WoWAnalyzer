import React from 'react';

import { HawkCorrigan } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import Warning from 'interface/Alert/Warning';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list.
  contributors: [HawkCorrigan],
  // The WoW client patch this spec was last updated to be fully compatible with.
  patchCompatibility: '8.0.1',
  // If set to  false`, the spec will show up as unsupported.
  isSupported: false,
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <>
      <Warning>
        Hey there! Right now the Enhancement Shaman parser only holds very basic functionality. What we do show should be good to use, but it does not show the complete picture.
      </Warning>
    </>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/67LHQfJjCFzgyXBr/8-Normal+Stormwall+Blockade+-+Kill+(7:17)/118-Scryd',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.ENHANCEMENT_SHAMAN,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () => import('./CombatLogParser' /* webpackChunkName: "EnhancementShaman" */).then(exports => exports.default),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
  // footer: (
  //   <div className="panel fade-in" style={{ margin: '15px auto 30px', maxWidth: 400, textAlign: 'center' }}>
  //     <div className="panel-body text-muted">
  //       Questions about Enhancement? Visit <a href="http://www.discord.me/earthshrine">Earthshrine</a> Discord.<br />
  //     </div>
  //   </div>
  // ),
};
