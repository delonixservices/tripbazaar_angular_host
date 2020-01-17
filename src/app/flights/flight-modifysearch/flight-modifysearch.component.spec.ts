import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModifysearchComponent } from './flight-modifysearch.component';

describe('FlightModifysearchComponent', () => {
  let component: FlightModifysearchComponent;
  let fixture: ComponentFixture<FlightModifysearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModifysearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModifysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
