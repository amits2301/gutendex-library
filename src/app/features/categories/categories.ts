import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CATEGORIES } from './constants/categories.constants';
import { EN_LABELS } from '../../core/i18n/en';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  readonly labels = EN_LABELS;
  categories = CATEGORIES;

  private router = inject(Router);

  navigate(topic: string) {
    this.router.navigate(['/books', topic]);
  }
}
