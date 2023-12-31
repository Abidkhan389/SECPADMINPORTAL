import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ICourse } from 'src/app/interfaces/Courses/ICourse';
import { DropDownUtils, Messages, NoWhitespaceValidator, Patterns, showErrorMessage } from 'src/app/_common';
import { ResultMessages } from 'src/app/_common/constant';

import { CoursesService } from 'src/app/_services/administration/courses.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-addeditcourses',
  templateUrl: './addeditcourses.component.html',
  styleUrls: ['./addeditcourses.component.sass']
})
export class AddeditcoursesComponent extends DropDownUtils implements OnInit {
  CourseForm: FormGroup;
  categoryName: any;
  loading: any;
  addEditCourse: ICourse;
  categoryList: any;
  isreadOnly: boolean = false;
  validationMessages = Messages.validation_messages;
  constructor(private fb: FormBuilder, protected lookupService: LookupService, protected router: Router, private dialogref: MatDialogRef<AddeditcoursesComponent>,
    private dilog: MatDialog, public courseService: CoursesService, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(lookupService, router);
    this.GetAllCategory(data => (this.categoryList = data));
  }
  ngOnInit(): void {
    if (this.data.courseId) {
      this.GetCourse()
    }
    this.validateform();
  }

  //Getting By ID
  GetCourse() {
    this.loading = true;
    this.courseService.GetCourseById(this.data.courseId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.CourseForm.patchValue(result);
          if(this.data.IsReadOnly)
          {
            this.isreadOnly = true;
            this.CourseForm.disable();
          }
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  AddEditSubmit() {
    this.addEditCourse = this.CourseForm.value;
    if (this.data.courseId)
      this.addEditCourse.courseId = this.data.courseId
    this.courseService.addEditCourse(this.addEditCourse).subscribe((data: any) => {
      this.dialogref.close(true);
    });

  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }
  validateform() {
    this.CourseForm = this.fb.group({
      title: ['', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      description: ['', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.titleRegex), Validators.maxLength(500)])],
      icon: ['', Validators.required],
      value: ['', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.decimalNum)])],
      categoryId:[null, Validators.required],
      duration:[null,Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.Num)])]
    });
  }
}
