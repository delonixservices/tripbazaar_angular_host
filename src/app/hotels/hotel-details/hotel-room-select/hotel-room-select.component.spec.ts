import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomSelectComponent } from './hotel-room-select.component';

describe('HotelRoomSelectComponent', () => {
  let component: HotelRoomSelectComponent;
  let fixture: ComponentFixture<HotelRoomSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
