import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLectureComponent } from './add-edit-lecture.component';

describe('AddEditLectureComponent', () => {
  let component: AddEditLectureComponent;
  let fixture: ComponentFixture<AddEditLectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditLectureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
