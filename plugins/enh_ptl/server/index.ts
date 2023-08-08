import { PluginInitializerContext } from '../../../src/core/server';
import { EnhPtlPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new EnhPtlPlugin(initializerContext);
}

export { EnhPtlPluginSetup, EnhPtlPluginStart } from './types';
