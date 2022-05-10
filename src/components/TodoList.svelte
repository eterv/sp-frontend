<script lang="ts">
  import { flip } from 'svelte/animate';
  import { todosSelectedId, todosList, todosAddingDateIndex } from '@/store';
  import Card from './Card.svelte';

  export let dateIndex: number;

  $: list = $todosList[dateIndex];
</script>

<div class="count">할 일 ({list.length})</div>

<Card add {dateIndex} />
{#each list as item, index (item.id)}
  <div animate:flip={{ duration: 500 }}>
    <Card {dateIndex} {index} {item} />
  </div>
{/each}

{#if $todosAddingDateIndex === dateIndex && $todosSelectedId === 0}
  <Card editing />
{/if}

<style lang="scss">
  .count {
    margin: 0 0 10px;
    font-size: 17px;
  }
</style>
