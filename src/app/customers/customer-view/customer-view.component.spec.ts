import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerViewComponent } from './customer-view.component';

describe('CustomerViewComponent', () => {
  let component: CustomerViewComponent;
  let fixture: ComponentFixture<CustomerViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
