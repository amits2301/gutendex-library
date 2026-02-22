import { Injectable } from '@angular/core';
import { BooksResponse } from '../models/book.models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Gutendex {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBooks(topic: string, search?: string, nextUrl?: string) {
    if (nextUrl) {
      return this.http.get<BooksResponse>(nextUrl);
    }

    let params = new HttpParams().set('topic', topic).set('mime_type', 'image/');

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http.get<BooksResponse>(this.baseUrl + '/books', {
      params,
    });
  }
}
