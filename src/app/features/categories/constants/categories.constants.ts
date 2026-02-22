import { EN_LABELS } from '../../../core/i18n/en';

export type GenreKey = keyof typeof EN_LABELS.GENRES;

export interface Category {
  key: GenreKey;
  topic: string;
  icon: string;
}

export const CATEGORIES: readonly Category[] = [
  {
    key: 'FICTION',
    topic: 'fiction',
    icon: 'assets/icons/fiction.svg',
  },
  {
    key: 'DRAMA',
    topic: 'drama',
    icon: 'assets/icons/drama.svg',
  },
  {
    key: 'HUMOR',
    topic: 'humor',
    icon: 'assets/icons/humour.svg',
  },
  {
    key: 'POLITICS',
    topic: 'politics',
    icon: 'assets/icons/politics.svg',
  },
  {
    key: 'PHILOSOPHY',
    topic: 'philosophy',
    icon: 'assets/icons/philosophy.svg',
  },
  {
    key: 'HISTORY',
    topic: 'history',
    icon: 'assets/icons/history.svg',
  },
  {
    key: 'ADVENTURE',
    topic: 'adventure',
    icon: 'assets/icons/adventure.svg',
  },
] as const;
