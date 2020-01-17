import { TestBed } from '@angular/core/testing';

import { FlightReviewService } from './flight-review.service';

describe('FlightReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightReviewService = TestBed.get(FlightReviewService);
    expect(service).toBeTruthy();
  });
});
