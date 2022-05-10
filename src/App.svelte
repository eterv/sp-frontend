<script lang="ts">
  import TodoContainer from './components/TodoContainer.svelte';
  import { loadTodosFromStorage, sideLength } from './store';
  import { debounce } from './utils';

  const onWindowResize = () =>
    sideLength.set(
      window.innerWidth < 1200 ? 0 : window.innerWidth < 2000 ? 1 : 2
    );
  onWindowResize();

  loadTodosFromStorage();
</script>

<svelte:window on:resize={debounce(onWindowResize)} />

<main>
  <TodoContainer />
</main>
