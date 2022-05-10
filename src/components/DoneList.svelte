<script lang="ts">
  import { donesList } from '@/store';
  import Card from './Card.svelte';

  export let dateIndex: number;

  $: list = $donesList[dateIndex];
</script>

<div class="count">끝난 일 ({list.length})</div>

{#each list as item, index (item.id)}
  <Card done {item} {index} />
{/each}

<style lang="scss">
  .count {
    margin: 30px 0 10px;
    font-size: 17px;
  }
</style>
