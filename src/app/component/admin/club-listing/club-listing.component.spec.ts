import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubListingComponent } from './club-listing.component';

describe('ClubListingComponent', () => {
  let component: ClubListingComponent;
  let fixture: ComponentFixture<ClubListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClubListingComponent]
    });
    fixture = TestBed.createComponent(ClubListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
