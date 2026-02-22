import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksStore } from './books.store';
import { Book } from '../../core/models/book.models';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EN_LABELS } from '../../core/i18n/en';

@Component({
  selector: 'app-books',
  imports: [TitleCasePipe, ReactiveFormsModule],
  templateUrl: './books.html',
  styleUrl: './books.scss',
  providers: [BooksStore],
})
export class Books implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store: BooksStore = inject(BooksStore);
  readonly labels = EN_LABELS;

  searchControl = new FormControl('');

  @ViewChild('scrollTrigger', { static: false })
  scrollTrigger!: ElementRef<HTMLDivElement>;

  readonly currentGenreKey = computed(() => {
    const topic = this.store.topic();
    return topic ? (topic.toUpperCase() as keyof typeof this.labels.GENRES) : null;
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const topic = params.get('topic');
      if (topic) {
        this.store.loadBooks({ topic });
      }
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
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

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
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

    observer.observe(this.scrollTrigger.nativeElement);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openBook(book: Book): void {
    const formats = book.formats;

    const html = this.getFormat(formats, 'text/html');
    if (html) {
      window.open(html, '_blank');
      return;
    }

    const pdf = this.getFormat(formats, 'application/pdf');
    if (pdf) {
      window.open(pdf, '_blank');
      return;
    }

    const txt = this.getFormat(formats, 'text/plain');
    if (txt) {
      window.open(txt, '_blank');
      return;
    }

    alert('No viewable version available');
  }

  private getFormat(formats: Record<string, string>, mime: string): string | null {
    const entry = Object.entries(formats).find(
      ([type]) => type.startsWith(mime) && !type.includes('zip'),
    );

    return entry ? entry[1] : null;
  }
}
