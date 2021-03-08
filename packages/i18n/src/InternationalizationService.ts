import { MathUtils } from "three/src/math/MathUtils";

import { Progress } from "@personalidol/loading-manager/src/Progress";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";

import type { i18n } from "i18next";

import type { PreloadableState } from "@personalidol/framework/src/PreloadableState.type";
import type { Progress as IProgress } from "@personalidol/loading-manager/src/Progress.interface";
import type { RPCMessage } from "@personalidol/framework/src/RPCMessage.type";

import type { InternationalizationService as IInternationalizationService } from "./InternationalizationService.interface";

type LoadNamespacesRequest = RPCMessage & {
  namespaces: Array<string>;
};

export function InternationalizationService(i18next: i18n, progressMessagePort: MessagePort): IInternationalizationService {
  const state: PreloadableState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
  });

  const _messagesRouter = Object.freeze({
    async loadNamespaces(messagePort: MessagePort, { namespaces, rpc }: LoadNamespacesRequest): Promise<void> {
      if (namespaces.length < 1) {
        throw new Error("Expected namespaces.");
      }

      const progress: IProgress = Progress(progressMessagePort, "translation", namespaces.join(", "));

      progress.start();

      // prettier-ignore
      await progress.wait(i18next.loadNamespaces(namespaces));

      messagePort.postMessage({
        loadedNamespaces: {
          namespaces: namespaces,
          rpc: rpc,
        },
      });
    },
  });

  function _waitForInitialization(): Promise<void> {
    return new Promise(function (resolve) {
      i18next.on("loaded", resolve);
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    if (!i18next.isInitialized) {
      await _waitForInitialization();
    }

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function registerMessagePort(messagePort: MessagePort): void {
    attachMultiRouter(messagePort, _messagesRouter);
  }

  function start(): void {}

  function stop(): void {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
    i18next: i18next,
    name: "InternationalizationService",
    state: state,

    preload: preload,
    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
  });
}