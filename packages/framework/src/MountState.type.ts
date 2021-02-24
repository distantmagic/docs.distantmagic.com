import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { PreloadableState } from "./PreloadableState.type";

export type MountState = MainLoopUpdatableState &
  PreloadableState & {
    isDisposed: boolean;
    isMounted: boolean;
  };
