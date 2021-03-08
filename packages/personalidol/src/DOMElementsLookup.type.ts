import type { DOMElementsLookup as BaseDOMElementsLookup } from "@personalidol/dom-renderer/src/DOMElementsLookup.type";

import type { ButtonDOMElementView } from "./ButtonDOMElementView";
import type { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import type { InGameMenuDOMElementView } from "./InGameMenuDOMElementView";
import type { InGameMenuTriggerDOMElementView } from "./InGameMenuTriggerDOMElementView";
import type { LanguageSettingsDOMElementView } from "./LanguageSettingsDOMElementView";
import type { MainMenuButtonDOMElementProps } from "./MainMenuButtonDOMElementProps.interface";
import type { MainMenuButtonDOMElementView } from "./MainMenuButtonDOMElementView";
import type { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import type { MainMenuLanguageButtonDOMElementView } from "./MainMenuLanguageButtonDOMElementView";
import type { MainMenuLayoutDOMElementView } from "./MainMenuLayoutDOMElementView";
import type { MainMenuUserSettingsButtonDOMElementView } from "./MainMenuUserSettingsButtonDOMElementView";
import type { MousePointerLayerDOMElementView } from "./MousePointerLayerDOMElementView";
import type { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";
import type { ProgressManagerStateDOMElementProps } from "./ProgressManagerStateDOMElementProps.type";
import type { ProgressManagerStateDOMElementView } from "./ProgressManagerStateDOMElementView";
import type { ReloadButtonDOMElementView } from "./ReloadButtonDOMElementView";
import type { SettingsBackdropDOMElementProps } from "./SettingsBackdropDOMElementProps.interface";
import type { SettingsBackdropDOMElementView } from "./SettingsBackdropDOMElementView";
import type { SliderDOMElementProps } from "./SliderDOMElementProps.interface";
import type { SliderDOMElementView } from "./SliderDOMElementView";
import type { UserSettingsDOMElementView } from "./UserSettingsDOMElementView";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "pi-button": HTMLAttributes<ButtonDOMElementView>;
      "pi-main-menu-button": HTMLAttributes<MainMenuButtonDOMElementView> & MainMenuButtonDOMElementProps;
      "pi-main-menu-language-button": HTMLAttributes<MainMenuLanguageButtonDOMElementView>;
      "pi-main-menu-layout": HTMLAttributes<MainMenuLayoutDOMElementView>;
      "pi-main-menu-user-settings-button": HTMLAttributes<MainMenuUserSettingsButtonDOMElementView>;
      "pi-progress-manager-state": HTMLAttributes<ProgressManagerStateDOMElementView> & ProgressManagerStateDOMElementProps;
      "pi-reload-button": HTMLAttributes<ReloadButtonDOMElementView>;
      "pi-settings-backdrop": HTMLAttributes<SettingsBackdropDOMElementView> & SettingsBackdropDOMElementProps;
      "pi-slider": HTMLAttributes<SliderDOMElementView<any>> & SliderDOMElementProps<any>;
    }
  }
}

export type DOMElementsLookup = BaseDOMElementsLookup & {
  "pi-button": typeof ButtonDOMElementView;
  "pi-fatal-error": typeof FatalErrorDOMElementView;
  "pi-in-game-menu": typeof InGameMenuDOMElementView;
  "pi-in-game-menu-trigger": typeof InGameMenuTriggerDOMElementView;
  "pi-language-settings": typeof LanguageSettingsDOMElementView;
  "pi-main-menu": typeof MainMenuDOMElementView;
  "pi-main-menu-button": typeof MainMenuButtonDOMElementView;
  "pi-main-menu-language-button": typeof MainMenuLanguageButtonDOMElementView;
  "pi-main-menu-layout": typeof MainMenuLayoutDOMElementView;
  "pi-main-menu-user-settings-button": typeof MainMenuUserSettingsButtonDOMElementView;
  "pi-mouse-pointer-layer": typeof MousePointerLayerDOMElementView;
  "pi-object-label": typeof ObjectLabelDOMElementView;
  "pi-progress-manager-state": typeof ProgressManagerStateDOMElementView;
  "pi-reload-button": typeof ReloadButtonDOMElementView;
  "pi-settings-backdrop": typeof SettingsBackdropDOMElementView;
  "pi-slider": typeof SliderDOMElementView;
  "pi-user-settings": typeof UserSettingsDOMElementView;
};