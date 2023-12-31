import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DropDownUtils, Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage } from 'src/app/_common';
import { EnrollUserService } from 'src/app/_services/administration/enroll-user.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-addedit-enroll-user',
  templateUrl: './addedit-enroll-user.component.html',
  styleUrls: ['./addedit-enroll-user.component.sass']
})
export class AddeditEnrollUserComponent extends DropDownUtils implements OnInit {

  EnrollUserForm: FormGroup;
  categoryName: any;
  loading: any;
  courseList: any
  UserList: any
  editcase:boolean=true;
  //addEditCourse: ICourse;
  categoryList: any;
  isreadOnly: boolean = true;
  userId: any;
  validationMessages = Messages.validation_messages;
  constructor(private fb: FormBuilder, protected lookupService: LookupService, protected router: Router, private dialogref: MatDialogRef<AddeditEnrollUserComponent>,
    private dilog: MatDialog, public enrollUserService: EnrollUserService, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(lookupService, router);
    this.GetAllCategory(data => (this.categoryList = data));
    this.getAllUsers();
  }
  ngOnInit(): void {
    this.validateform();
    if (this.data.enrolledId) 
    {
      this.GetEnrollUser(this.data.enrolledId, data => {
        this.editcase=false;
        this.getCoursesDDlByCategory(data.categoryId)
        this.EnrollUserForm.patchValue(data);
        if (this.data.IsReadOnly) {
          this.editcase=false;
          this.isreadOnly = true;
          this.EnrollUserForm.disable();
        }
      });
    }
  }
  getCourses(Id:any){
    this.editcase=true;
    this.getCoursesDDlByCategory(Id);
  }
 
  getCoursesDDlByCategory(val:any) {
      this.enrollUserService.GetCourseDDLByCategory(val).pipe(
        finalize(() => {
          this.loading = false;
        }))
        .subscribe(result => {
          if (result) {
            if(this.editcase)
            {
              this.courseList = [];
              this.EnrollUserForm.get('courseId').reset();
              this.EnrollUserForm.controls['courseId'].setValue(result[0].courseId);
            }
            this.courseList=result;
            //this.EnrollUserForm.controls['courseId'].setValue(this.categoryList.courseId);
            //this.EnrollUserForm.get('courseId').setValue(this.categoryList.courseId);
          }
        },
          error => {
            showErrorMessage(ResultMessages.serverError);
          });  
  }
 
  getAllUsers() {
    this.enrollUserService.GetAllUsers().pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.UserList=result;
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  //Getting By ID
  GetEnrollUser(Id:any, callback) {
    this.loading = true;
    this.enrollUserService.GetEnrollUserById(Id).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          callback(result);
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
      // .subscribe(result => {
      //   if (result) {
      //     this.getCoursesDDlByCategory(result.categoryId);
      //     this.EnrollUserForm.patchValue(result);
      //     if (this.data.IsReadOnly) {
      //       this.isreadOnly = true;
      //       this.EnrollUserForm.disable();
      //     }
      //   }
      // },
      //   error => {
      //     showErrorMessage(ResultMessages.serverError);
      //   });
  }
  AddEdit() {
    let model = Object.assign({}, this.EnrollUserForm.getRawValue());
    if (this.data.enrolledId)
      model.enrolledId = this.data.enrolledId;
    this.enrollUserService.addEditEnrollUser(model).subscribe((data: any) => {
      this.dialogref.close(true);
    });

  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }
  validateform() {
    this.EnrollUserForm = this.fb.group({
      categoryId: [null, Validators.required],
      courseId: [null, Validators.required],
      userId: [null, Validators.required],
    });
  }
}
