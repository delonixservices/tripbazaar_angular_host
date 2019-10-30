import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchFiltersComponent } from './hotel-search-filters.component';

describe('HotelSearchFiltersComponent', () => {
  let component: HotelSearchFiltersComponent;
  let fixture: ComponentFixture<HotelSearchFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
