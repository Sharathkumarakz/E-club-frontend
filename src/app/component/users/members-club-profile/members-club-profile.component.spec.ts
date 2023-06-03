import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersClubProfileComponent } from './members-club-profile.component';

describe('MembersClubProfileComponent', () => {
  let component: MembersClubProfileComponent;
  let fixture: ComponentFixture<MembersClubProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersClubProfileComponent]
    });
    fixture = TestBed.createComponent(MembersClubProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
