import type { UserSettings as IUserSettings } from "./UserSettings.type";

function createEmptyState(pixelRatio: number): IUserSettings {
  return {
    devicePixelRatio: pixelRatio,
    language: "en",
    pixelRatio: 1,
    shadowMapSize: 512,
    showStatsReporter: false,
    useDynamicLighting: true,
    useOffscreenCanvas: false,
    useShadows: true,
    version: 0,
  };
}

export const UserSettings = Object.freeze({
  createEmptyState: createEmptyState,
});
