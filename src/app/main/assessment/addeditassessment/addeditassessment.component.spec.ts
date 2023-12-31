import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditassessmentComponent } from './addeditassessment.component';

describe('AddeditassessmentComponent', () => {
  let component: AddeditassessmentComponent;
  let fixture: ComponentFixture<AddeditassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeditassessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
