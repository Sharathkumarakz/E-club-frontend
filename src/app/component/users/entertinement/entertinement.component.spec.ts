import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertinementComponent } from './entertinement.component';

describe('EntertinementComponent', () => {
  let component: EntertinementComponent;
  let fixture: ComponentFixture<EntertinementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntertinementComponent]
    });
    fixture = TestBed.createComponent(EntertinementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
