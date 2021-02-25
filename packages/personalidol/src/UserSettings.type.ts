import type { UserSettings as BaseUserSettings } from "@personalidol/framework/src/UserSettings.type";

export type UserSettings = BaseUserSettings & {
  devicePixelRatio: number;
  language: string;
  pixelRatio: number;
  shadowMapSize: 512 | 1024 | 2048 | 4096;
  useDynamicLighting: boolean;
  useOffscreenCanvas: boolean;
  useShadows: boolean;
};
