import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface EnhPtlPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnhPtlPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
