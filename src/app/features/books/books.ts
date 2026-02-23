import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BooksStore } from './store/books.store';
import { Book } from './models/book.models';
import { EN_LABELS } from '../../core/i18n/en';
import { getPreferredBookUrl } from './utils/book.utils';

@Component({
  selector: 'app-books',
  imports: [ReactiveFormsModule],
  templateUrl: './books.html',
  styleUrl: './books.scss',
  providers: [BooksStore],
})
export class Books implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly store: BooksStore = inject(BooksStore);
  readonly labels = EN_LABELS;

  searchControl = new FormControl('');
  private observer!: IntersectionObserver;

  @ViewChild('scrollTrigger', { static: false })
  scrollTrigger!: ElementRef<HTMLDivElement>;

  readonly currentGenreKey = computed(() => {
    const topic = this.store.topic();
    return topic ? (topic.toUpperCase() as keyof typeof this.labels.GENRES) : null;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const topic = params.get('topic');
      if (topic) {
        this.store.loadBooks({ topic });
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const topic = this.store.topic();
        if (topic) {
          this.store.loadBooks({
            topic,
            search: value ?? '',
          });
        }
      });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.store.loadingState().loading && this.store.next()) {
          this.store.loadMore();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    );

    this.observer.observe(this.scrollTrigger.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openBook(book: Book): void {
    const url = getPreferredBookUrl(book);

    if (url) {
      window.open(url, '_blank');
    } else {
      alert(this.labels.COMMON.ERROR_NO_VIEWABLE);
    }
  }
}
