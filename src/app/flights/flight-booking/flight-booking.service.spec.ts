import { TestBed } from '@angular/core/testing';

import { FlightBookingService } from './flight-booking.service';

describe('FlightBookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightBookingService = TestBed.get(FlightBookingService);
    expect(service).toBeTruthy();
  });
});
