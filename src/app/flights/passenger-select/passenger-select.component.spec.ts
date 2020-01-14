import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerSelectComponent } from './passenger-select.component';

describe('PassengerSelectComponent', () => {
  let component: PassengerSelectComponent;
  let fixture: ComponentFixture<PassengerSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
