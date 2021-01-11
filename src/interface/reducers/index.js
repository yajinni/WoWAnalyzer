import { combineReducers } from 'redux';

export default () => combineReducers({
  // System
  error: require('./error').default,

  // App
  user: require('./user').default,
  report: require('./report').default,
  combatants: require('./combatants').default,
  reportHistory: require('./reportHistory').default,
  language: require('./language').default,
  specsIgnoredNotSupportedWarning: require('./specsIgnoredNotSupportedWarning').default,
  openModals: require('./openModals').default,

  // Caching
  charactersById: require('./charactersById').default,
  reportCodesIgnoredPreviousPatchWarning: require('./reportCodesIgnoredPreviousPatchWarning').default,
});
