import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { IUserDetail } from 'src/app/interfaces/user/IUserDetail';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage } from 'src/app/_common';
import { UserManegementService } from 'src/app/_services/administration/user-manegement.service';

@Component({
  selector: 'app-addedit-user',
  templateUrl: './addedit-user.component.html',
  styleUrls: ['./addedit-user.component.sass']
})
export class AddeditUserComponent implements OnInit {
  userForm: FormGroup;
  loading: any;
  isreadOnly: boolean = false;
  addEdituser: IUserDetail;
  validationMessages = Messages.validation_messages;
  disable: boolean;
  hide = true;
  roles = [
    { role: "User", name: 'User' },
    { role: "Admin", name: 'Admin' },
  ];
  constructor(private fb: FormBuilder,
    private dialogref: MatDialogRef<AddeditUserComponent>, public userMangementService: UserManegementService, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit(): void {
    if (this.data.userId) {
      this.GetUserDetail()
    }
    this.validateform();

  }
  //Getting By ID
  GetUserDetail() {
    this.loading = true;
    this.userMangementService.getUserDetail(this.data.userId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.userForm.patchValue(result);
          if (!this.data.readOnly) {
            this.userForm.controls['password'].disable();
          }
          if (this.data.readOnly) {
            this.isreadOnly = true;
            this.userForm.disable()
          }
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  AddEdit() {
    // this.addEdituser = this.userForm.value;
    this.addEdituser = this.userForm.getRawValue();
    if (this.data.userId) {
      this.addEdituser.userId = this.data.userId
    }
    this.userMangementService.addEditUser(this.addEdituser).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }
  validateform() {
    this.userForm = this.fb.group({
      firstName: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.nameRegex), Validators.maxLength(50)])),
      lastName: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.nameRegex), Validators.maxLength(50)])),
      cnic: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.CnicPattern)])),
      dob: new FormControl('', Validators.compose([Validators.required])),
      username: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.emailRegex), Validators.required, Validators.maxLength(50)])),
      mobileNumber: new FormControl('', Validators.compose([Validators.required, Validators.pattern(Patterns.Num), Validators.maxLength(11), Validators.minLength(11)])),
      password: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
    });
  }

}
