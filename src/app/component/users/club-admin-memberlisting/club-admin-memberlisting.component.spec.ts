import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAdminMemberlistingComponent } from './club-admin-memberlisting.component';

describe('ClubAdminMemberlistingComponent', () => {
  let component: ClubAdminMemberlistingComponent;
  let fixture: ComponentFixture<ClubAdminMemberlistingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubAdminMemberlistingComponent]
    });
    fixture = TestBed.createComponent(ClubAdminMemberlistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
