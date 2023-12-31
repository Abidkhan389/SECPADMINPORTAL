import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGradingCriteriaComponent } from './add-edit-grading-criteria.component';

describe('AddEditGradingCriteriaComponent', () => {
  let component: AddEditGradingCriteriaComponent;
  let fixture: ComponentFixture<AddEditGradingCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditGradingCriteriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGradingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
