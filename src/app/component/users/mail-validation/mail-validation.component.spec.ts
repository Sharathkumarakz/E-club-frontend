import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailValidationComponent } from './mail-validation.component';

describe('MailValidationComponent', () => {
  let component: MailValidationComponent;
  let fixture: ComponentFixture<MailValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailValidationComponent]
    });
    fixture = TestBed.createComponent(MailValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
