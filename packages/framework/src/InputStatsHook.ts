import { MathUtils } from "three/src/math/MathUtils";

import { getPrimaryPointerClientX } from "./getPrimaryPointerClientX";
import { getPrimaryPointerClientY } from "./getPrimaryPointerClientY";
import { getPrimaryPointerStretchVectorX } from "./getPrimaryPointerStretchVectorX";
import { getPrimaryPointerStretchVectorY } from "./getPrimaryPointerStretchVectorY";
import { isPrimaryMouseButtonPressed } from "./isPrimaryMouseButtonPressed";
import { isPrimaryPointerInitiatedByRootElement } from "./isPrimaryPointerInitiatedByRootElement";
import { isPrimaryTouchPressed } from "./isPrimaryTouchPressed";

import type { StatsHook } from "./StatsHook.interface";
import type { StatsReport } from "./StatsReport.type";
import type { TickTimerState } from "./TickTimerState.type";

const DEBUG_NAME: "input" = "input";

export function InputStatsHook(inputState: Int32Array): StatsHook {
  const statsReport: StatsReport = {
    debugName: DEBUG_NAME,
    isPrimaryMouseButtonPressed: false,
    isPrimaryPointerInitiatedByRootElement: false,
    isPrimaryTouchPressed: false,
    lastUpdate: 0,
    primaryPointerClientX: 0,
    primaryPointerClientY: 0,
    primaryPointerStretchVectorX: 0,
    primaryPointerStretchVectorY: 0,
  };

  function reset(): void {}

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    statsReport.isPrimaryMouseButtonPressed = isPrimaryMouseButtonPressed(inputState);
    statsReport.isPrimaryPointerInitiatedByRootElement = isPrimaryPointerInitiatedByRootElement(inputState);
    statsReport.isPrimaryTouchPressed = isPrimaryTouchPressed(inputState);
    statsReport.lastUpdate = tickTimerState.currentTick;
    statsReport.primaryPointerClientX = getPrimaryPointerClientX(inputState);
    statsReport.primaryPointerClientY = getPrimaryPointerClientY(inputState);
    statsReport.primaryPointerStretchVectorX = getPrimaryPointerStretchVectorX(inputState);
    statsReport.primaryPointerStretchVectorY = getPrimaryPointerStretchVectorY(inputState);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isPerformanceStatsHook: true,
    isStatsHook: true,
    name: `InputStatsHook("${DEBUG_NAME}")`,
    statsReport: statsReport,
    statsReportIntervalSeconds: 0,

    reset: reset,
    update: update,
  });
}