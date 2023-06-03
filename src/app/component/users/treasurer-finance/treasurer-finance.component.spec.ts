import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasurerFinanceComponent } from './treasurer-finance.component';

describe('TreasurerFinanceComponent', () => {
  let component: TreasurerFinanceComponent;
  let fixture: ComponentFixture<TreasurerFinanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreasurerFinanceComponent]
    });
    fixture = TestBed.createComponent(TreasurerFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
