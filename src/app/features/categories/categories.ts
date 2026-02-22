import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CATEGORIES } from '../../core/constants/categories';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categories = CATEGORIES;

  private router = inject(Router);

  navigate(topic: string) {
    this.router.navigate(['/books', topic]);
  }
}
