import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModifySearchComponent } from './hotel-modify-search.component';

describe('HotelModifySearchComponent', () => {
  let component: HotelModifySearchComponent;
  let fixture: ComponentFixture<HotelModifySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModifySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModifySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
