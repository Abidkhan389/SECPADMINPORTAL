import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Helpers, Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage } from 'src/app/_common';
import { GradingCriteriaService } from 'src/app/_services/administration/grading-criteria.service';

@Component({
  selector: 'app-add-edit-grading-criteria',
  templateUrl: './add-edit-grading-criteria.component.html',
  styleUrls: ['./add-edit-grading-criteria.component.sass']
})
export class AddEditGradingCriteriaComponent implements OnInit {
  GradingCriteriaForm: FormGroup;
  loading: any;
  isreadOnly: boolean = false;
  validationMessages = Messages.validation_messages;
  grade_S_R = [
    { id: 0, name: 0 },
    { id: 50, name: 50 },
    { id: 60, name: 60 },
    { id: 70, name: 70 },
    { id: 80, name: 80 },
    { id: 90, name: 90 },
  ];
  grade_E_R = [
    { id: 50, name: 50 },
    { id: 60, name: 60 },
    { id: 70, name: 70 },
    { id: 80, name: 80 },
    { id: 90, name: 90 },
    { id: 100, name: 100 },
  ];
  gradeName = [
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "F", name: "F" },
  ];
  constructor(private fb: FormBuilder, protected router: Router, private dialogref: MatDialogRef<AddEditGradingCriteriaComponent>,
    private dilog: MatDialog, protected gradingCriteriaService: GradingCriteriaService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    if (this.data.gradingId) {
      this.GetGradingCriteria()
    }
    this.validateform();
  }
  //Getting By ID
  GetGradingCriteria() {
    this.loading = true;
    this.gradingCriteriaService.GetGradingCriteriaById(this.data.gradingId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.GradingCriteriaForm.patchValue(result);
          if (this.data.IsReadOnly) {
            this.isreadOnly = true;
            this.GradingCriteriaForm.disable();
          }
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  AddEditSubmit() {
    let model = Object.assign({}, this.GradingCriteriaForm.getRawValue());
    if (this.data.gradingId)
      model.gradingId = this.data.gradingId
    this.gradingCriteriaService.addEditGradingCriteria(model).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }
  validateform() {
    this.GradingCriteriaForm = this.fb.group({
      gradeName: [null, Validators.required],
      grade_S_R: [null, Validators.required],
      grade_E_R: [null, Validators.required],
    });
  }

}
