import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityDetailPage } from './facility-detail.page';

describe('FacilityDetailPage', () => {
  let component: FacilityDetailPage;
  let fixture: ComponentFixture<FacilityDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FacilityDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
