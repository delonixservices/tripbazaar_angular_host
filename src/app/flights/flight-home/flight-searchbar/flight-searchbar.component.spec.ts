import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchbarComponent } from './flight-searchbar.component';

describe('FlightSearchbarComponent', () => {
  let component: FlightSearchbarComponent;
  let fixture: ComponentFixture<FlightSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
