import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubHomeComponent } from './club-home.component';

describe('ClubHomeComponent', () => {
  let component: ClubHomeComponent;
  let fixture: ComponentFixture<ClubHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubHomeComponent]
    });
    fixture = TestBed.createComponent(ClubHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
