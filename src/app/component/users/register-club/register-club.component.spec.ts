import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterClubComponent } from './register-club.component';

describe('RegisterClubComponent', () => {
  let component: RegisterClubComponent;
  let fixture: ComponentFixture<RegisterClubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterClubComponent]
    });
    fixture = TestBed.createComponent(RegisterClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
