import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError } from 'rxjs';
import { EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { GutendexService } from '../services/gutendex.service';
import { Book, BooksResponse } from '../models/book.models';

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

const initialLoadingState: LoadingState = {
  loading: false,
  error: null,
};

export interface BooksState {
  books: Book[];
  topic: string | null;
  search: string;
  next: string | null;
  loadingState: LoadingState;
}

const initialState: BooksState = {
  books: [],
  topic: null,
  search: '',
  next: null,
  loadingState: initialLoadingState,
};

export const BooksStore = signalStore(
  withState(initialState),

  withMethods((store, api = inject(GutendexService)) => ({
    loadBooks: rxMethod<{ topic: string; search?: string }>(
      pipe(
        tap(({ topic, search }) => {
          patchState(store, {
            topic,
            search: search ?? '',
            books: [],
            next: null,
            loadingState: { loading: true, error: null },
          });
        }),

        switchMap(({ topic, search }) =>
          api.getBooks(topic, search).pipe(
            tap((response: BooksResponse) => {
              patchState(store, {
                books: response.results,
                next: response.next,
                loadingState: { loading: false, error: null },
              });
            }),

            catchError((error: HttpErrorResponse) => {
              patchState(store, {
                loadingState: {
                  loading: false,
                  error: error.message || 'Failed to load books',
                },
              });

              return EMPTY;
            }),
          ),
        ),
      ),
    ),
    loadMore: rxMethod<void>(
      pipe(
        tap(() => {
          if (!store.next()) return;

          patchState(store, {
            loadingState: { loading: true, error: null },
          });
        }),

        switchMap(() => {
          const nextUrl = store.next();
          if (!nextUrl) return EMPTY;

          return api.getBooks('', '', nextUrl).pipe(
            tap((response: BooksResponse) => {
              patchState(store, (state) => ({
                books: [...state.books, ...response.results],
                next: response.next,
                loadingState: { loading: false, error: null },
              }));
            }),

            catchError((error: HttpErrorResponse) => {
              patchState(store, {
                loadingState: {
                  loading: false,
                  error: error.message || 'Failed to load more books',
                },
              });

              return EMPTY;
            }),
          );
        }),
      ),
    ),

    clearError() {
      patchState(store, {
        loadingState: { ...store.loadingState(), error: null },
      });
    },
  })),
);

export type BooksStore = InstanceType<typeof BooksStore>;
