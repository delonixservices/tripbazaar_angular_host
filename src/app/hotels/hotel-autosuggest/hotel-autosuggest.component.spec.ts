import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelAutosuggestComponent } from './hotel-autosuggest.component';

describe('HotelAutosuggestComponent', () => {
  let component: HotelAutosuggestComponent;
  let fixture: ComponentFixture<HotelAutosuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelAutosuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelAutosuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
