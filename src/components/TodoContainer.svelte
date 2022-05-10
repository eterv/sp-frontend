<script lang="ts">
  import { derived } from 'svelte/store';
  import { dates } from '@/store';
  import DoneList from './DoneList.svelte';
  import TodoList from './TodoList.svelte';
  import DateNavigator from './DateNavigator.svelte';

  const dayText = '일월화수목금토';

  const datesList = derived(dates, ($dates) =>
    $dates.map((item) => {
      const date = new Date(item);

      return {
        year: date.getFullYear(),
        dateString: `${date.getMonth() + 1}월 ${date.getDate()}일 (${
          dayText[date.getDay()]
        })`,
      };
    })
  );
</script>

<div class="todos">
  {#each $datesList as item, i}
    <div class="item">
      <div class="date">
        <div class="y">{item.year}</div>
        <div class="md">{item.dateString}</div>
      </div>

      <div class="list">
        <TodoList dateIndex={i} />
        <DoneList dateIndex={i} />
      </div>
    </div>
  {/each}

  <DateNavigator />
</div>

<style lang="scss">
  .todos {
    display: flex;
    justify-content: center;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 10px;

    .item {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 327px + 40px;

      overflow: hidden;

      .list {
        flex: 1;
        margin-top: 20px;
        padding: 10px 20px;
      }

      &:not(:first-child) .list {
        border-left: 1px solid #ccc;
      }
    }

    .date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60px;
      text-align: center;

      .y {
        font-size: 15px;
      }
      .md {
        font-size: 17px;
      }
    }
  }
</style>
