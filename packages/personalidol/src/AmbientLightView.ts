import { AmbientLight } from "three/src/lights/AmbientLight";
import { MathUtils } from "three/src/math/MathUtils";

import type { Scene } from "three/src/scenes/Scene";

import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityView } from "./EntityView.interface";
import type { UserSettings } from "./UserSettings.type";

export function AmbientLightView(userSettings: UserSettings, scene: Scene, entity: EntityLightAmbient): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _ambientLight = new AmbientLight(0xffffff, entity.light);

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_ambientLight);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_ambientLight);
  }

  function update(): void {
    if (userSettings.useDynamicLighting) {
      _ambientLight.intensity = entity.light;
    } else {
      _ambientLight.intensity = 1;
    }
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `AmbientLightView(${entity.light})`,
    needsUpdates: true,
    object3D: _ambientLight,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
