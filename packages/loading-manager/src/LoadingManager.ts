import { createLoadingComment } from "./createLoadingComment";

import type { LoadingManager as ILoadingManager } from "./LoadingManager.interface";
import type { LoadingManagerItem } from "./LoadingManagerItem.type";
import type { LoadingManagerState } from "./LoadingManagerState.type";

function _sumWeights(items: Set<LoadingManagerItem>): number {
  let _sum = 0;

  for (let item of items) {
    _sum += item.weight;
  }

  return _sum;
}

export function LoadingManager(): ILoadingManager {
  const state: LoadingManagerState = Object.seal({
    comment: "",
    expectsAtLeast: 0,
    progress: 0,
    version: 0,
  });

  const _itemsLoaded: Set<LoadingManagerItem> = new Set();
  const _itemsToLoad: Set<LoadingManagerItem> = new Set();
  let _previousComment: string = "";
  let _previousProgress: number = -1;
  let _startProgress: boolean = false;

  function done(item: LoadingManagerItem) {
    _itemsLoaded.add(item);
  }

  function expectAtLeast(expectAtLeast: number) {
    state.expectsAtLeast = expectAtLeast;
    _startProgress = true;
    update();
  }

  function update() {
    const itemsToLoadWeights = _sumWeights(_itemsToLoad);
    const totalWeights = Math.max(state.expectsAtLeast, itemsToLoadWeights);

    if (totalWeights < 1) {
      return;
    }

    const itemsLoadedWeights = _sumWeights(_itemsLoaded);

    if (itemsLoadedWeights > itemsToLoadWeights) {
      throw new Error("There are more items loaded than items that are pending to load.");
    }

    state.comment = createLoadingComment(_itemsLoaded, _itemsToLoad);

    if (_startProgress) {
      state.progress = Math.max(state.progress, itemsLoadedWeights / totalWeights);
    }

    if (_previousComment === state.comment && _previousProgress === state.progress) {
      return;
    }

    _previousComment = state.comment;
    _previousProgress = state.progress;

    state.version += 1;
  }

  function reset() {
    _itemsLoaded.clear();
    _itemsToLoad.clear();
    _previousComment = "";
    _previousProgress = -1;
    _startProgress = false;
    state.comment = "";
    state.expectsAtLeast = 0;
    state.progress = 0;
    state.version += 1;
  }

  function start() {}

  function stop() {}

  function waitFor(item: LoadingManagerItem) {
    _itemsToLoad.add(item);
  }

  return Object.freeze({
    name: "LoadingManager",
    state: state,

    done: done,
    expectAtLeast: expectAtLeast,
    reset: reset,
    start: start,
    stop: stop,
    update: update,
    waitFor: waitFor,
  });
}