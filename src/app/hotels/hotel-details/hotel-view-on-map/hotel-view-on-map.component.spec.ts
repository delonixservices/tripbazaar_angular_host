import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelViewOnMapComponent } from './hotel-view-on-map.component';

describe('HotelViewOnMapComponent', () => {
  let component: HotelViewOnMapComponent;
  let fixture: ComponentFixture<HotelViewOnMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelViewOnMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelViewOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
