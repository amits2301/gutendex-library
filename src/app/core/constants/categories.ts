export interface Category {
  label: string;
  topic: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { label: 'FICTION', topic: 'fiction', icon: 'assets/icons/fiction.svg' },
  { label: 'DRAMA', topic: 'drama', icon: 'assets/icons/drama.svg' },
  { label: 'HUMOUR', topic: 'humour', icon: 'assets/icons/humour.svg' },
  { label: 'POLITICS', topic: 'politics', icon: 'assets/icons/politics.svg' },
  { label: 'PHILOSOPHY', topic: 'philosophy', icon: 'assets/icons/philosophy.svg' },
  { label: 'HISTORY', topic: 'history', icon: 'assets/icons/history.svg' },
  { label: 'ADVENTURE', topic: 'adventure', icon: 'assets/icons/adventure.svg' },
];
