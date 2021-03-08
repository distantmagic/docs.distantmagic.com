import { Fragment, h } from "preact";

import { DOMElementView } from "@personalidol/dom-renderer/src/DOMElementView";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/support/src/isCanvasTransferControlToOffscreenSupported";
import { isCustomEvent } from "@personalidol/framework/src/isCustomEvent";
import { unary } from "@personalidol/framework/src/unary";

import { DOMBreakpoints } from "./DOMBreakpoints.enum";
import { UserSettingsDynamicLightQualityMap } from "./UserSettingsDynamicLightQualityMap.enum";

import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { MessageUIStateChange } from "./MessageUIStateChange.type";
import type { UserSettings } from "./UserSettings.type";

const isOffscreenCanvasSupported = isCanvasTransferControlToOffscreenSupported();

const _css = `
  :host {
    all: initial;
  }

  *, * * {
    box-sizing: border-box;
  }

  .options__form {
    align-items: center;
    display: grid;
    grid-row-gap: 3rem;
  }

  .option__warning {
    color: yellow;
  }

  dl {
    display: grid;
    grid-gap: 0.8rem;
    margin: 0;
  }

  dd {
    font-weight: lighter;
    margin: 0;
  }

  dt {
    margin-bottom: -0.8rem;
  }

  h1 {
    align-items: center;
    background-color: black;
    border-bottom: 1px solid white;
    display: grid;
    font-family: Almendra;
    font-size: 3.2rem;
    font-variant: small-caps;
    font-weight: normal;
    grid-template-columns: 1fr auto;
    line-height: 1;
    margin: 0;
    padding-bottom: 1.6rem;
    position: sticky;
    top: 0;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: bold;
    margin: 0;
    padding-bottom: 1.6rem;
    padding-top: 3.2rem;
  }

  @media (max-width: ${DOMBreakpoints.MobileMax}px) {
    h1 {
      padding-top: 1.6rem;
      margin-top: 1.6rem;
    }
  }

  @media (min-width: ${DOMBreakpoints.TabletMin}px) {
    h1 {
      margin-top: 4.8rem;
      padding-top: 1.6rem;
    }
  }

  @media (max-width: ${DOMBreakpoints.TabletMax}px) {
    .options__form {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: ${DOMBreakpoints.DesktopMin}px) {
    .options__form {
      grid-column-gap: 2rem;
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const _booleanEdgeLabels: ["", ""] = ["", ""];

const _booleanLabels: [string, string] = ["ui:user_settings_label_off", "ui:user_settings_label_on"];
const _booleanValues: [false, true] = [false, true];

const _lightQualityLabels = ["ui:user_settings_label_off", "ui:user_settings_quality_low", "ui:user_settings_quality_medium", "ui:user_settings_quality_high"];
const _lightQualityValues = [
  UserSettingsDynamicLightQualityMap.None,
  UserSettingsDynamicLightQualityMap.Low,
  UserSettingsDynamicLightQualityMap.Medium,
  UserSettingsDynamicLightQualityMap.High,
];

const _lowHighEdgeLabels: [string, string] = ["ui:user_settings_quality_low", "ui:user_settings_quality_high"];

const _pixelRatioLabels = ["25%", "50%", "75%", "100%"];
const _pixelRatioValues = [0.25, 0.5, 0.75, 1];

const _shadowMapSizeLabels = ["512", "1024", "2048", "4096"];
const _shadowMapSizeValues = [512, 1024, 2048, 4096];

export class UserSettingsDOMElementView extends DOMElementView<UserSettings> {
  public css: string = _css;
  public userSettingsLastAcknowledgedVersion: number = -1;

  private _isUseOffscreenCanvasChanged: boolean = false;
  private _unaryT: (key: string) => string;

  constructor() {
    super();

    this._unaryT = unary(this.t);

    this.close = this.close.bind(this);
    this.onDynamicLightQualityChange = this.onDynamicLightQualityChange.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onPixelRatioChange = this.onPixelRatioChange.bind(this);
    this.onShadowMapSizeChange = this.onShadowMapSizeChange.bind(this);
    this.onShowStatsReporterChange = this.onShowStatsReporterChange.bind(this);
    this.onUseOffscreenCanvasChanged = this.onUseOffscreenCanvasChanged.bind(this);
    this.onUseShadowsChange = this.onUseShadowsChange.bind(this);
  }

  close() {
    const message: MessageUIStateChange = {
      isUserSettingsScreenOpened: false,
    };

    this.uiMessagePort.postMessage(message);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.close();
  }

  onDynamicLightQualityChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onDynamicLightQualityChange'.");
    }

    switch (evt.detail) {
      case UserSettingsDynamicLightQualityMap.None:
      case UserSettingsDynamicLightQualityMap.Low:
      case UserSettingsDynamicLightQualityMap.Medium:
      case UserSettingsDynamicLightQualityMap.High:
        this.userSettings.dynamicLightQuality = evt.detail;
        this.userSettings.version += 1;
        return;
      default:
        throw new Error(`Unexpected shadowmap size: "${evt.detail}"`);
    }
  }

  onPixelRatioChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onPixelRatioChange'.");
    }

    this.userSettings.pixelRatio = Number(evt.detail);
    this.userSettings.version += 1;
  }

  onShadowMapSizeChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onShadowMapSizeChange'.");
    }

    switch (evt.detail) {
      case 512:
      case 1024:
      case 2048:
      case 4096:
        this.userSettings.shadowMapSize = evt.detail;
        this.userSettings.version += 1;
        return;
      default:
        throw new Error(`Unexpected shadowmap size: "${evt.detail}"`);
    }
  }

  onShowStatsReporterChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onShowStatsReporterChange'.");
    }

    this.userSettings.showStatsReporter = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onUseOffscreenCanvasChanged(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onUseOffscreenCanvasChanged'.");
    }

    this._isUseOffscreenCanvasChanged = true;
    this.userSettings.useOffscreenCanvas = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onUseShadowsChange(evt: Event) {
    if (!isCustomEvent(evt)) {
      throw new Error("Expected custom event with:: 'onUseShadowsChange'.");
    }

    this.userSettings.useShadows = Boolean(evt.detail);
    this.userSettings.version += 1;
  }

  onOverlayClick(evt: MouseEvent) {
    const target = evt.target;

    if (!target || !(target instanceof HTMLElement) || target.id !== "options") {
      return;
    }

    this.close();
  }

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    super.beforeRender(delta, elapsedTime, tickTimerState);

    if (this.needsRender) {
      return;
    }

    this.needsRender = this.userSettingsLastAcknowledgedVersion < this.userSettings.version;
    this.userSettingsLastAcknowledgedVersion = this.userSettings.version;
  }

  render(delta: number) {
    const _booleanLabelsTranslated: [string, string] = _booleanLabels.map(this._unaryT) as [string, string];
    const _lowHighEdgeLabelsTranslated: [string, string] = _lowHighEdgeLabels.map(this._unaryT) as [string, string];

    return (
      <pi-settings-backdrop onDirectClick={this.close}>
        <h1>
          {this.t("ui:user_settings_options")}
          <pi-button onClick={this.close}>{this.t("ui:user_settings_done").toLocaleLowerCase()}</pi-button>
        </h1>
        <h2>{this.t("ui:user_settings_graphics")}</h2>
        <form class="options__form">
          <dl>
            <dt>{this.t("ui:user_settings_rendering_resolution")}</dt>
            <dd>{this.t("ui:user_settings_rendering_resolution_description")}</dd>
          </dl>
          <pi-slider
            currentValue={this.userSettings.pixelRatio}
            edgeLabels={_lowHighEdgeLabelsTranslated}
            labels={_pixelRatioLabels}
            onChange={this.onPixelRatioChange}
            values={_pixelRatioValues}
          />
          <dl>
            <dt>{this.t("ui:user_settings_dynamic_light_quality")}</dt>
            <dd>{this.t("ui:user_settings_dynamic_light_quality_description")}</dd>
          </dl>
          <pi-slider
            currentValue={this.userSettings.dynamicLightQuality}
            edgeLabels={_booleanEdgeLabels}
            labels={_lightQualityLabels.map(this._unaryT)}
            onChange={this.onDynamicLightQualityChange}
            values={_lightQualityValues}
          />
          <dl>
            <dt>{this.t("ui:user_settings_use_shadows")}</dt>
            <dd>{this.t("ui:user_settings_use_shadows_description")}</dd>
          </dl>
          <pi-slider
            currentValue={this.userSettings.useShadows}
            edgeLabels={_booleanEdgeLabels}
            labels={_booleanLabelsTranslated}
            onChange={this.onUseShadowsChange}
            values={_booleanValues}
          />
          <dl>
            <dt>{this.t("ui:user_settings_shadow_map_size")}</dt>
            <dd>{this.t("ui:user_settings_shadow_map_size_description")}</dd>
          </dl>
          <pi-slider
            currentValue={this.userSettings.shadowMapSize}
            edgeLabels={_lowHighEdgeLabelsTranslated}
            labels={_shadowMapSizeLabels}
            onChange={this.onShadowMapSizeChange}
            values={_shadowMapSizeValues}
          />
        </form>
        {isOffscreenCanvasSupported && (
          <Fragment>
            <h2>{this.t("ui:user_settings_experimental")}</h2>
            <form class="options__form">
              <dl>
                <dt>{this.t("ui:user_settings_use_offscreen_canvas")}</dt>
                <dd>{this.t("ui:user_settings_use_offscreen_canvas_description")}</dd>
                {this._isUseOffscreenCanvasChanged && (
                  <Fragment>
                    <dd class="option__warning">{this.t("ui:user_settings_required_reload_to_take_effect")}</dd>
                    <pi-reload-button />
                  </Fragment>
                )}
              </dl>
              <pi-slider
                currentValue={this.userSettings.useOffscreenCanvas}
                disabled={!isOffscreenCanvasSupported}
                edgeLabels={_booleanEdgeLabels}
                labels={_booleanLabelsTranslated}
                onChange={this.onUseOffscreenCanvasChanged}
                values={_booleanValues}
              />
            </form>
          </Fragment>
        )}
        <h2>{this.t("ui:user_settings_utilities")}</h2>
        <form class="options__form">
          <dl>
            <dt>{this.t("ui:user_settings_show_rendering_stats")}</dt>
            <dd>{this.t("ui:user_settings_show_rendering_stats_description")}</dd>
          </dl>
          <pi-slider
            currentValue={this.userSettings.showStatsReporter}
            edgeLabels={_booleanEdgeLabels}
            labels={_booleanLabelsTranslated}
            onChange={this.onShowStatsReporterChange}
            values={_booleanValues}
          />
        </form>
      </pi-settings-backdrop>
    );
  }
}