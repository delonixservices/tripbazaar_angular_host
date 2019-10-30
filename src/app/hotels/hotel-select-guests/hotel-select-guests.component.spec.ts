import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSelectGuestsComponent } from './hotel-select-guests.component';

describe('HotelSelectGuestsComponent', () => {
  let component: HotelSelectGuestsComponent;
  let fixture: ComponentFixture<HotelSelectGuestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSelectGuestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSelectGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
