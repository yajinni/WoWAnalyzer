import React from 'react';

import SPECS from 'game/SPECS';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [],
  // The WoW client patch this spec was last updated.
  patchCompatibility: '9.0.2',
  isPartial: true,
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <>
      We hope this analyzer will help improve your Feral druid experience. As always it's best to
      focus on improving one aspect of your play at a time. Keeping good uptimes on your DoTs is key
      to good damage output, so is a great place to start. Unless you have very high haste you can
      expect to spend time waiting for energy during bos fights, use this to your advantage as it
      gives you time to plan what to do next rather than spamming buttons.
      <br />
      <br />
      Most of the mechanics are now covered in this analyzer but there's always things to improve.
      If you have suggestions or comments about the analyzer you can reach the WoWAnalyzer team on{' '}
      <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/issues/new">GitHub</a>, on{' '}
      <a href="https://discord.gg/AxphPxU">Discord</a>, or message me (
      <a href="/contributor/Anatta336">Anatta</a>) directly on Discord. We're always interested in
      improving the analyzer, whether it's in-depth theorycraft or rewording some text to be easier
      to understand. The whole project is open source and welcomes contributions so you can directly
      improve it too!
      <br />
      <br />
      If you have questions about playing Feral check out the{' '}
      <a href="https://www.discord.gg/dreamgrove">Dreamgrove</a> Discord for an active community,
      and the <a href="http://www.wowhead.com/feral-druid-guide">Feral guide</a> on Wowhead is an
      excellent resource.
    </>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/tQRnCGHaTgKrA2JV/9-Heroic+Grong+the+Revenant+-+Kill+(3:18)/555-Hoofhartd',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.FERAL_DRUID,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () =>
    import('./CombatLogParser' /* webpackChunkName: "FeralDruid" */).then(
      (exports) => exports.default,
    ),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};
