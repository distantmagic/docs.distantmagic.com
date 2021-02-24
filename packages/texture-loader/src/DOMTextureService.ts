import { MathUtils } from "three/src/math/MathUtils";

import { attachMultiRouter } from "@personalidol/framework/src/attachMultiRouter";
import { canvas2DDrawImage } from "@personalidol/dom-renderer/src/canvas2DDrawImage";
import { createResourceLoadMessage } from "@personalidol/loading-manager/src/createResourceLoadMessage";
import { createReusedResponsesCache } from "@personalidol/framework/src/createReusedResponsesCache";
import { createReusedResponsesUsage } from "@personalidol/framework/src/createReusedResponsesUsage";
import { notifyProgressManager } from "@personalidol/loading-manager/src/notifyProgressManager";
import { preloadImage } from "@personalidol/dom-renderer/src/preloadImage";
import { reuseResponse } from "@personalidol/framework/src/reuseResponse";

import { keyFromTextureRequest } from "./keyFromTextureRequest";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { ReusedResponsesCache } from "@personalidol/framework/src/ReusedResponsesCache.type";
import type { ReusedResponsesUsage } from "@personalidol/framework/src/ReusedResponsesUsage.type";

import type { DOMTextureService as IDOMTextureService } from "./DOMTextureService.interface";
import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";
import type { TextureRequest } from "./TextureRequest.type";

type TextureQueueItem = TextureRequest & {
  messagePort: MessagePort;
};

const _emptyTransferables: [] = [];
const _loadingCache: ReusedResponsesCache = createReusedResponsesCache();
const _loadingUsage: ReusedResponsesUsage = createReusedResponsesUsage();
const _textureQueue: Array<TextureQueueItem> = [];

const _messagesRouter = {
  createImageBitmap(messagePort: MessagePort, textureRequest: TextureRequest): void {
    _textureQueue.push({
      ...textureRequest,
      messagePort: messagePort,
    });
  },
};

export function DOMTextureService(canvas: HTMLCanvasElement, context2D: CanvasRenderingContext2D, progressMessagePort: MessagePort): IDOMTextureService {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  function registerMessagePort(messagePort: MessagePort) {
    attachMultiRouter(messagePort, _messagesRouter);
  }

  function start() {}

  function stop() {}

  function update() {
    if (_textureQueue.length < 1) {
      return;
    }

    do {
      let request = _textureQueue.shift();

      if (!request) {
        throw new Error("Unexpected empty processing request in the texture queue.");
      }

      _processTextureQueue(request);
    } while (_textureQueue.length > 0);
  }

  async function _createImageData(request: TextureQueueItem): Promise<ImageData> {
    const image: HTMLImageElement = await preloadImage(request.textureUrl);

    canvas2DDrawImage(canvas, context2D, image);

    return context2D.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
  }

  async function _processTextureQueue(request: TextureQueueItem): Promise<void> {
    const requestKey = keyFromTextureRequest(request);

    // prettier-ignore
    const { data: imageData, isLast } = await notifyProgressManager(
      progressMessagePort,
      createResourceLoadMessage("texture", request.textureUrl),
      reuseResponse<ImageData, TextureQueueItem>(_loadingCache, _loadingUsage, requestKey, request, _createImageData)
    );

    request.messagePort.postMessage(
      {
        imageData: <ImageDataBufferResponse>{
          imageDataBuffer: imageData.data.buffer,
          imageDataHeight: imageData.height,
          imageDataWidth: imageData.width,
          rpc: request.rpc,
        },
      },
      isLast ? [imageData.data.buffer] : _emptyTransferables
    );
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "DOMTextureService",
    state: state,

    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
