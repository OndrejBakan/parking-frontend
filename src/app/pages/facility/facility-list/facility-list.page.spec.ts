import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacilityListPage } from './facility-list.page';

describe('FacilityListPage', () => {
  let component: FacilityListPage;
  let fixture: ComponentFixture<FacilityListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FacilityListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
