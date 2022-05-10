import { get, derived, writable } from 'svelte/store';
import { getDateString, getNextDateString } from '@/utils';

export interface TodoItem {
  id: number;
  date: string;
  done: boolean;
  priority?: number;
  text: string;
}

interface TodosStorageData {
  list: TodoItem[];
  nextId: number;
}

export function loadTodosFromStorage() {
  const data = localStorage.getItem('todos') ?? '';
  try {
    const { list, nextId } = JSON.parse(data) as TodosStorageData;

    todos.set(list ?? []);
    todos.setNextId(nextId ?? 1);
  } catch {
    /**/
  }
}

export function saveTodosToStorage() {
  const data: TodosStorageData = {
    list: get(todos),
    nextId: get(todos.nextId),
  };
  localStorage.setItem('todos', JSON.stringify(data));
}

function createTodoList() {
  const { set, subscribe, update } = writable<TodoItem[]>([]);
  const nextId = writable(1);

  const add = (text: string) => {
    const dateIndex = get(todosAddingDateIndex);

    update((v) => {
      v.push({
        id: get(nextId),
        date: get(dates)[dateIndex],
        done: false,
        priority: get(todosCounts)[dateIndex],
        text,
      });

      nextId.update((v) => v + 1);
      return v;
    });

    saveTodosToStorage();
  };

  const done = (id: number) => {
    update((v) => {
      const item = v.find((item) => item.id === id);
      item.done = true;

      const dateIndex = getDateIndexByDate(item.date);
      const len = get(donesCounts)[dateIndex];
      item.priority = len;

      // 우선순위 업데이트
      const list = get(todosList)[dateIndex];
      const j = list.findIndex((item) => item.id === id);

      for (let i = j + 1; i < list.length; i++) {
        const item2 = v.find((item) => item.id === list[i].id);
        item2.priority--;
      }

      return v;
    });

    todosSelectedId.set(-1);

    saveTodosToStorage();
  };

  const remove = (id: number) => {
    update((v) => {
      const index = v.findIndex((item) => item.id === id);
      if (index < 0) return v;

      const item = v[index];
      v.splice(index, 1);

      const dateIndex = getDateIndexByDate(item.date);

      // 우선순위 업데이트
      const isDone = item.done;
      const list = isDone
        ? get(donesList)[dateIndex]
        : get(todosList)[dateIndex];

      const j = list.findIndex((item) => item.id === id);

      for (
        let i = j + (isDone ? -1 : 1);
        isDone ? i >= 0 : i < list.length;
        i += isDone ? -1 : 1
      ) {
        const item2 = v.find((item) => item.id === list[i].id);
        item2.priority--;
      }

      return v;
    });

    saveTodosToStorage();
  };

  const updateText = (id: number, text: string) => {
    update((v) => {
      const item = v.find((item) => item.id === id);
      item.text = text;
      return v;
    });

    saveTodosToStorage();
  };

  const updatePriority = (id: number, newPriority: number) => {
    update((v) => {
      const item = v.find((item) => item.id === id);
      const curr = item.priority;
      const next = newPriority;

      const dateIndex = get(draggingDateIndex);
      const currList = get(todosList)[dateIndex];

      if (curr < next) {
        for (let i = curr + 1; i <= next; i++) {
          const item = v.find((item) => item.id === currList[i].id);
          item.priority = i - 1;
        }
      } else {
        for (let i = next; i < curr; i++) {
          const item = v.find((item) => item.id === currList[i].id);
          item.priority = i + 1;
        }
      }

      item.priority = next;

      saveTodosToStorage();

      return v;
    });
  };

  return {
    add,
    done,
    nextId,
    remove,
    set,
    setNextId: nextId.set,
    subscribe,
    updatePriority,
    updateText,
  };
}

export const todos = createTodoList();
export const todosSelectedId = writable(-1);
export const todosAddingDateIndex = writable(-1);

export const draggingDateIndex = writable(-1);
export const draggingId = writable(-1);

export const sideLength = writable(0);

export const currentDate = writable(getDateString());
export const dates = derived(
  [currentDate, sideLength],
  ([$currentDate, $sideLength]) => {
    const len = $sideLength * 2 + 1;
    return Array.from(Array(len), (_, i) =>
      getNextDateString($currentDate, i - $sideLength)
    );
  }
);

export const todosList = derived([dates, todos], ([$dates, $todos]) =>
  $dates.map(($date) =>
    $todos
      .filter((item) => item.date === $date && !item.done)
      .sort((a, b) => a.priority - b.priority)
  )
);
export const donesList = derived([dates, todos], ([$dates, $todos]) =>
  $dates.map(($date) =>
    $todos
      .filter((item) => item.date === $date && item.done)
      .sort((a, b) => b.priority - a.priority)
  )
);

export const todosCounts = derived(todosList, ($lists) =>
  $lists.map(($list) => $list.length)
);
export const donesCounts = derived(donesList, ($lists) =>
  $lists.map(($list) => $list.length)
);

export const getDateIndexByDate = (date: string) =>
  get(dates).findIndex((v) => v === date);

export const getRealDateIndex = (index: number) => index + get(sideLength);
