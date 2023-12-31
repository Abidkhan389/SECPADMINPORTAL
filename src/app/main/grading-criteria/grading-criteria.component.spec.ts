import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingCriteriaComponent } from './grading-criteria.component';

describe('GradingCriteriaComponent', () => {
  let component: GradingCriteriaComponent;
  let fixture: ComponentFixture<GradingCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradingCriteriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
