import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ILecture } from 'src/app/interfaces/lecture/ILecture';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage } from 'src/app/_common';
import { DropDownUtils } from 'src/app/_common/_helper/dropdownUtils';
import { LectureService } from 'src/app/_services/administration/lecture.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-add-edit-lecture',
  templateUrl: './add-edit-lecture.component.html',
  styleUrls: ['./add-edit-lecture.component.sass']
})
export class AddEditLectureComponent extends DropDownUtils implements OnInit {
  courseList: any;
  lectureForm: FormGroup;
  addEditLecture: ILecture;
  courseName: any;
  isreadOnly: boolean = false;
  validationMessages = Messages.validation_messages;

  constructor(protected lookUpService: LookupService,
    private dialogref: MatDialogRef<AddEditLectureComponent>,
    protected router: Router, private fb: FormBuilder,
    public lectureService: LectureService, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(lookUpService, router)
    this.getAllCoursesForDDL(data => (this.courseList = data))
  }

  ngOnInit(): void {
    if (this.data.lectureId) {
      this.GetLecture();
    }
    this.validateForm();
  }
  validateForm() {
    this.lectureForm = this.fb.group({
      lectureTitle: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.titleRegex), Validators.maxLength(150)])),
      description: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.maxLength(500)])),
      lectureNumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern(Patterns.Num)])),
      courseId: new FormControl(null, Validators.required),
    });
  }
  AddEdit() {
    this.addEditLecture = this.lectureForm.value;
    if (this.data.lectureId)
      this.addEditLecture.lectureId = this.data.lectureId
    this.lectureService.addEditLecture(this.addEditLecture).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  GetLecture() {
    this.loading = true;
    this.lectureService.getLectureById(this.data.lectureId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.lectureForm.patchValue(result);
          if (this.data.readOnly) {
            this.isreadOnly = true;
            this.lectureForm.disable()
          }
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        }
      );
  }
  closeClick() {
    this.dialogref.close();
  }
}
