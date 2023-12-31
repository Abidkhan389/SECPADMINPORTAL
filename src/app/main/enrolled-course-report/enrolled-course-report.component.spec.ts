import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledCourseReportComponent } from './enrolled-course-report.component';

describe('EnrolledCourseReportComponent', () => {
  let component: EnrolledCourseReportComponent;
  let fixture: ComponentFixture<EnrolledCourseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrolledCourseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrolledCourseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
