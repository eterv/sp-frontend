<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { draggingDateIndex, draggingId, todos, type TodoItem } from '@/store';
  import type { SwipeEventDetail } from '@/utils';

  interface CustomEventMap {
    afterswipe: SwipeEventDetail;
    swipe: SwipeEventDetail;
    tap: Record<string, any>;
  }

  const dispatch = createEventDispatcher<CustomEventMap>();
  const dispatchAfterSwipe = (detail: SwipeEventDetail) =>
    dispatch('afterswipe', detail);
  const dispatchSwipe = (detail: SwipeEventDetail) => dispatch('swipe', detail);
  const dispatchTap = () => dispatch('tap');

  export let dateIndex: number;
  export let index: number;
  export let item: TodoItem;

  let coords = spring({ x: 0 }, { stiffness: 0.05, damping: 0.5 });
  let dragMode = false;
  let dxRatio = 0;
  let moved = false;
  let ref: HTMLDivElement;
  let swipeThreshold = 0.5;
  let timerForLongPress = 0;
  let x = 0;
  let width = 0;

  $: {
    dxRatio = $coords.x / width;

    if (dxRatio < 0) {
      dispatchSwipe({ cross: dxRatio < -swipeThreshold, direction: 'left' });
    } else if (dxRatio > 0) {
      dispatchSwipe({ cross: dxRatio > swipeThreshold, direction: 'right' });
    }
  }

  const cancelSwipe = () => {
    setTimeout(() => {
      coords.set({ x: 0 });
    });
  };

  const dragEnd = () => {
    dragMode = false;
    draggingDateIndex.set(-1);
    draggingId.set(-1);

    removeWindowMouseTouchEvents();
  };

  const dragEnter = async (e: DragEvent) => {
    if (item.done || $draggingDateIndex !== dateIndex) return;

    e.dataTransfer.dropEffect = 'move';
    todos.updatePriority($draggingId, index);
  };

  const dragStart = (e: DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';

    draggingDateIndex.set(dateIndex);
    draggingId.set(item.id);
  };

  const handleMousedown = (e: MouseEvent & TouchEvent) => {
    x = e.type.startsWith('touch') ? e.touches[0].pageX : e.clientX;

    timerForLongPress = setTimeout(() => {
      if (!moved) dragMode = true;
    }, 300);

    coords.stiffness = coords.damping = 1;

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('touchmove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
    window.addEventListener('touchend', handleMouseup);
  };

  const handleMousemove = (e: MouseEvent & TouchEvent) => {
    if (dragMode) return;

    let clientX = e.type.startsWith('touch') ? e.touches[0].pageX : e.clientX;

    if (!moved) {
      moved = true;
      clearInterval(timerForLongPress);
    }

    const dx = clientX - x;
    x = clientX;

    coords.update(($coords) => ({ x: $coords.x + dx }));
  };

  const handleMouseup = () => {
    if (dragMode) dragMode = false;

    x = 0;
    coords.stiffness = 0.05;
    coords.damping = 0.5;

    if (dxRatio > swipeThreshold) {
      dispatchAfterSwipe({ cancel: cancelSwipe, direction: 'right' });
      coords.set({ x: width + 50 });
    } else if (dxRatio < -swipeThreshold) {
      dispatchAfterSwipe({ cancel: cancelSwipe, direction: 'left' });
      coords.set({ x: -width - 50 });
    } else {
      coords.set({ x: 0 });
    }

    if (moved) moved = false;
    else dispatchTap();

    removeWindowMouseTouchEvents();
  };

  const removeWindowMouseTouchEvents = () => {
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('touchmove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
    window.removeEventListener('touchend', handleMouseup);
  };

  onMount(() => {
    ref.addEventListener('mousedown', handleMousedown);
    ref.addEventListener('touchstart', handleMousedown);

    width = ref.clientWidth;
  });
</script>

<div
  bind:this={ref}
  draggable={item && !item.done && dragMode}
  on:dragend={dragEnd}
  on:dragstart={dragStart}
  on:dragenter|preventDefault={dragEnter}
  on:dragover|preventDefault
  style={`transform: translate3d(${$coords.x}px, 0, 0)`}
  on:click
>
  <slot />
</div>
