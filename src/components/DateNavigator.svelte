<script lang="ts">
  import { currentDate } from '@/store';
  import { getNextDateString } from '@/utils';

  const moveDate = (n: number) => {
    currentDate.update((v) => getNextDateString(v, n));
  };
</script>

<nav>
  <svg
    class="arrow left"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    on:click={() => moveDate(-1)}
  >
    <path
      d="M15.53 4.22a.75.75 0 0 1 0 1.06L8.81 12l6.72 6.72a.75.75 0 1 1-1.06 1.06l-7.25-7.25a.75.75 0 0 1 0-1.06l7.25-7.25a.75.75 0 0 1 1.06 0Z"
    />
  </svg>
  <svg
    class="arrow right"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    on:click={() => moveDate(1)}
  >
    <path
      d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0Z"
    />
  </svg>
</nav>

<style lang="scss">
  nav {
    .arrow {
      position: absolute;
      top: 0;
      width: 20px;
      height: 20px;
      margin-top: 20px;
      fill: #666;
      cursor: pointer;

      &.left {
        left: 30px;
      }
      &.right {
        right: 30px;
      }

      @media (min-width: 1200px) {
        position: fixed;
        top: 50%;
        width: 64px;
        height: 64px;
        margin-top: -32px;
        fill: #888;

        &.left {
          left: 0;
        }
        &.right {
          right: 0;
        }
      }
    }
  }
</style>
