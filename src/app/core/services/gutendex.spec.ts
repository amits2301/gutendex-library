import { TestBed } from '@angular/core/testing';

import { Gutendex } from './gutendex';

describe('Gutendex', () => {
  let service: Gutendex;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gutendex);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
