import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCourseContentComponent } from './add-edit-courseContent.component';

describe('AddEditCourseContentComponent', () => {
  let component: AddEditCourseContentComponent;
  let fixture: ComponentFixture<AddEditCourseContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCourseContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
