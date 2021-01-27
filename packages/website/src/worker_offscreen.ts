/// <reference lib="webworker" />

import Loglevel from "loglevel";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { Input } from "@personalidol/framework/src/Input";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MainLoopStatsHook } from "@personalidol/framework/src/MainLoopStatsHook";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";

import { createScenes } from "./createScenes";

import type { MainLoop as IMainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MessageWorkerReady } from "@personalidol/framework/src/MessageWorkerReady.type";
import type { ServiceManager as IServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

declare var self: DedicatedWorkerGlobalScope;

const eventBus = EventBus();
const logger = Loglevel.getLogger(self.name);

logger.setLevel(__LOG_LEVEL);
logger.debug(`WORKER_SPAWNED(${self.name})`);

const _canvasStyle = {
  height: 0,
  width: 0,
};

let _canvas: null | OffscreenCanvas = null;
let _devicePixelRatio: null | number = null;
let _dimensionsState: null | Uint32Array = null;
let _inputState: null | Int32Array = null;
let _isBootstrapped: boolean = false;
let _mainLoop: null | IMainLoop = null;
let _notifiedReady: boolean = false;
let _serviceManager: null | IServiceManager = null;
let _shouldNotifyReady: boolean = false;
let domMessagePort: null | MessagePort = null;
let fontPreloadMessagePort: null | MessagePort = null;
let md2MessagePort: null | MessagePort = null;
let progressMessagePort: null | MessagePort = null;
let quakeMapsMessagePort: null | MessagePort = null;
let statsMessagePort: null | MessagePort = null;
let texturesMessagePort: null | MessagePort = null;
let uiMessagePort: null | MessagePort = null;

function _createScenesSafe(): void {
  if (
    _canvas === null ||
    _devicePixelRatio === null ||
    _dimensionsState === null ||
    _inputState === null ||
    domMessagePort === null ||
    fontPreloadMessagePort === null ||
    md2MessagePort === null ||
    progressMessagePort === null ||
    quakeMapsMessagePort === null ||
    statsMessagePort === null ||
    texturesMessagePort === null ||
    uiMessagePort === null
  ) {
    return;
  }

  if (_isBootstrapped) {
    throw new Error(`WORKER(${self.name}) can be only bootstrapped once. It has to be torn down and reinitialized.`);
  }

  _mainLoop = MainLoop(MainLoopStatsHook(self.name, statsMessagePort), RequestAnimationFrameScheduler());
  _serviceManager = ServiceManager(logger);

  // prettier-ignore
  createScenes(
    _devicePixelRatio,
    eventBus,
    _mainLoop,
    _serviceManager,
    _canvas,
    _dimensionsState,
    _inputState,
    logger,
    domMessagePort,
    fontPreloadMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    statsMessagePort,
    texturesMessagePort,
    uiMessagePort,
  );

  _isBootstrapped = true;

  if (_shouldNotifyReady) {
    _notifyReady();
  }
}

function _notifyReady(): void {
  if (_notifiedReady) {
    throw new Error("WORKER(${self.name}) already notified its ready state.");
  }

  _notifiedReady = true;

  self.postMessage(<MessageWorkerReady>{
    ready: true,
  });
}

self.onmessage = createRouter({
  // Dependencies

  awaitSharedDimensions(awaitSharedDimensions: boolean): void {
    if (awaitSharedDimensions) {
      return;
    }

    _dimensionsState = Dimensions.createEmptyState(false);
    _inputState = Input.createEmptyState(false);
    _createScenesSafe();
  },

  canvas(canvas: OffscreenCanvas): void {
    // hack to make it work with three.js
    (canvas as any).style = _canvasStyle;

    _canvas = canvas;
    _createScenesSafe();
  },

  devicePixelRatio(devicePixelRatio: number): void {
    _devicePixelRatio = devicePixelRatio;
    _createScenesSafe();
  },

  dimensionsState(dimensions: Uint32Array): void {
    if (!_dimensionsState) {
      throw new Error("Dimensions state must be set before it's updated.");
    }

    _dimensionsState.set(dimensions);
  },

  domMessagePort(port: MessagePort): void {
    domMessagePort = port;
    _createScenesSafe();
  },

  fontPreloadMessagePort(port: MessagePort): void {
    fontPreloadMessagePort = port;
    _createScenesSafe();
  },

  inputState(input: Int32Array): void {
    if (!_inputState) {
      throw new Error("Input state must be set before it's updated.");
    }

    _inputState.set(input);
  },

  md2MessagePort(port: MessagePort): void {
    md2MessagePort = port;
    _createScenesSafe();
  },

  pointerZoomRequest(zoomAmount: number): void {
    eventBus.POINTER_ZOOM_REQUEST.forEach(function (callback) {
      callback(zoomAmount);
    });
  },

  progressMessagePort(port: MessagePort): void {
    progressMessagePort = port;
    _createScenesSafe();
  },

  quakeMapsMessagePort(port: MessagePort): void {
    quakeMapsMessagePort = port;
    _createScenesSafe();
  },

  sharedDimensionsState(dimensions: SharedArrayBuffer): void {
    _dimensionsState = new Uint32Array(dimensions);
  },

  sharedInputState(input: SharedArrayBuffer): void {
    _inputState = new Int32Array(input);
  },

  statsMessagePort(port: MessagePort): void {
    if (null !== statsMessagePort) {
      throw new Error(`Stats message port was already received by WORKER(${self.name}).`);
    }

    statsMessagePort = port;
    _createScenesSafe();
  },

  texturesMessagePort(port: MessagePort): void {
    texturesMessagePort = port;
    _createScenesSafe();
  },

  uiMessagePort(port: MessagePort): void {
    uiMessagePort = port;
    _createScenesSafe();
  },

  // WorkerService

  ready(): void {
    if (_isBootstrapped) {
      _notifyReady();
    } else {
      _shouldNotifyReady = true;
    }
  },

  start(): void {
    if (null === _mainLoop || null === _serviceManager) {
      throw new Error("MainLoop and ServiceManager are not ready.");
    }

    _mainLoop.start();
    _serviceManager.start();
  },

  stop(): void {
    if (null === _mainLoop || null === _serviceManager) {
      throw new Error("MainLoop and ServiceManager are not ready.");
    }

    _mainLoop.stop();
    _serviceManager.stop();
  },
});
