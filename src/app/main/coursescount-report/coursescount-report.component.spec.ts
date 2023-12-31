import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursescountReportComponent } from './coursescount-report.component';

describe('CoursescountReportComponent', () => {
  let component: CoursescountReportComponent;
  let fixture: ComponentFixture<CoursescountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursescountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursescountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
