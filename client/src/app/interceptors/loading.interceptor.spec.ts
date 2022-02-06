import { TestBed } from '@angular/core/testing';

import { LoadinggInterceptor } from './loading.interceptor';

describe('LoadinggInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoadinggInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoadinggInterceptor = TestBed.inject(LoadinggInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
