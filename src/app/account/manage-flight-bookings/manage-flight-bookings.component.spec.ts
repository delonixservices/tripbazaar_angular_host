import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFlightBookingsComponent } from './manage-flight-bookings.component';

describe('ManageFlightBookingsComponent', () => {
  let component: ManageFlightBookingsComponent;
  let fixture: ComponentFixture<ManageFlightBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFlightBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFlightBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
