export type SwipeEvent = CustomEvent<SwipeEventDetail>;
export type SwipeEventDetail = {
  cancel?(): void;
  cross?: boolean;
  direction: 'left' | 'right';
};
