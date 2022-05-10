<script lang="ts">
  import {
    todos,
    todosAddingDateIndex,
    todosSelectedId,
    type TodoItem,
  } from '@/store';
  import type { SwipeEvent } from '@/utils';
  import Dragable from './Dragable.svelte';

  export let add = false;
  export let dateIndex = 1;
  export let done = false;
  export let editing = false;
  export let index = -1;
  export let item: TodoItem = undefined;

  let editField: HTMLInputElement;
  let editText = '';

  let swipedToLeft = false;
  let swipedToRight = false;

  $: id = item ? item.id : -1;
  $: selected = item && id === $todosSelectedId;

  $: {
    if (editing) {
      editField?.focus();

      if (!selected && item) editing = false;
    }
  }

  const edit = () => {
    if (!editText) {
      editField.focus();
      return;
    }

    if ($todosSelectedId === 0) {
      todos.add(editText);
    } else {
      todos.updateText(id, editText);
      todosSelectedId.set(-1);
    }

    reset();
  };

  const moveDone = () => todos.done(item.id);

  const onAfterSwipe = (e: SwipeEvent) => {
    const { cancel, direction } = e.detail;

    if (done && direction === 'right') {
      cancel();
      return;
    }

    if (direction === 'left') {
      setTimeout(() => {
        remove();
      }, 300);
    } else {
      setTimeout(() => {
        moveDone();
      }, 300);
    }
  };

  const onSwipe = (e: SwipeEvent) => {
    const { cross, direction } = e.detail;
    if (direction === 'left') {
      if (swipedToLeft !== cross) swipedToLeft = cross;
    } else {
      if (swipedToRight !== cross) swipedToRight = cross;
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') edit();
    else if (e.key === 'Escape') reset();
  };

  const startAdd = () => {
    todosSelectedId.set(0);
    todosAddingDateIndex.set(dateIndex);
  };
  const startEdit = () => {
    editing = true;
    editText = item.text;
  };

  const remove = () => todos.remove(id);

  const reset = () => {
    if ($todosSelectedId === 0) todosSelectedId.set(-1);
    else editing = false;

    editText = '';
    todosAddingDateIndex.set(-1);
  };

  const tap = () => {
    if (done) return;

    todosSelectedId.set(item.id);
  };
</script>

{#if editing}
  <input
    type="text"
    class="card editing"
    bind:this={editField}
    bind:value={editText}
    on:keydown={onKeyDown}
    maxlength="20"
  />
  <div class="commands">
    <button on:click={reset}>취소</button>
    <button on:click={edit}>완료</button>
  </div>
{:else if add}
  <button class="card" class:add on:click={startAdd}>+</button>
{:else}
  <Dragable
    {dateIndex}
    {index}
    {item}
    on:tap={tap}
    on:afterswipe={onAfterSwipe}
    on:swipe={onSwipe}
  >
    <button
      class="card"
      class:done={done || swipedToRight}
      class:deleted={swipedToLeft}
      class:selected>{item?.text}</button
    >

    {#if selected && !done}
      <div class="commands">
        <button on:click={remove}>삭제</button>
        <button on:click={startEdit}>수정</button>
        <button on:click={moveDone}>완료</button>
      </div>
    {/if}
  </Dragable>
{/if}

<style lang="scss">
  .card {
    display: block;
    width: 100%;
    height: 68px;
    margin-bottom: 8px;
    border: 0;
    border-radius: 12px;
    background-color: #5aaafa;
    color: #fff;
    font-size: 17px;
    text-align: center;
    transition-duration: 500ms;

    &:not(.editing) {
      cursor: pointer;
    }

    &.add {
      border: 1px solid #000;
      background-color: white;
      color: #000;
    }

    &.editing {
      background-color: #081f5c;
      color: #fff;

      &:focus {
        outline: none;
      }
    }

    &.selected {
      background-color: #007aff;
    }

    &.done {
      background-color: #969dab;
      text-decoration: line-through;
    }

    &.deleted {
      opacity: 0.3;
    }
  }

  .commands {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;

    button {
      width: 100px;
      height: 44px;
      border: 0;
      border-radius: 8px;
      background-color: #eee;
      color: #007aff;
      font-size: 15px;
      cursor: pointer;
    }
  }
</style>
