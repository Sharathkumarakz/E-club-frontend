import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubDetailviewComponent } from './club-detailview.component';

describe('ClubDetailviewComponent', () => {
  let component: ClubDetailviewComponent;
  let fixture: ComponentFixture<ClubDetailviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubDetailviewComponent]
    });
    fixture = TestBed.createComponent(ClubDetailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
