import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightVoucherComponent } from './flight-voucher.component';

describe('FlightVoucherComponent', () => {
  let component: FlightVoucherComponent;
  let fixture: ComponentFixture<FlightVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
