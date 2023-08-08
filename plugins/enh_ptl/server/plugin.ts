import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { EnhPtlPluginSetup, EnhPtlPluginStart } from './types';
import { defineRoutes } from './routes';

export class EnhPtlPlugin implements Plugin<EnhPtlPluginSetup, EnhPtlPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('enh-ptl: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('enh-ptl: Started');
    return {};
  }

  public stop() {}
}
