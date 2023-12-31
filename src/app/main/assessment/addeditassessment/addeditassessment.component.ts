import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { finalize } from 'rxjs/operators';
import { DropDownUtils, Helpers, Messages, NoWhitespaceValidator, ResultMessages, showErrorMessage } from 'src/app/_common';
import { languageType, mediumType, QuestionLevel, QuestionType } from 'src/app/_common/_helper/enum';
import { AssessmentService } from 'src/app/_services/administration/assessment.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-addeditassessment',
  templateUrl: './addeditassessment.component.html',
  styleUrls: ['./addeditassessment.component.sass']
})
export class AddeditassessmentComponent extends DropDownUtils implements OnInit {
  [x: string]: any;
  loading: any;
  QuizList: any;
  countindex: number = 0;
  CoursesList: any;
  AssessmentForm: FormGroup;
  questionOption: any = [];
  questionType: Object[] = [];
  mediumType: Object[] = [];
  languageTypes: Object[] = [];
  validationMessages = Messages.validation_messages;
  maxLength: number = 4;
  isreadOnly: boolean = false;
  btnDisable: boolean = false;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '2rem',
    minHeight: '2rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };
  constructor(private fb: FormBuilder, protected lookupService: LookupService, protected router: Router, private dialogref: MatDialogRef<AddeditassessmentComponent>,
    private dilog: MatDialog, public assessmentService: AssessmentService, @Inject(MAT_DIALOG_DATA) public data: any) {
    super(lookupService, router);
    this.getAllCoursesForDDL(data => (this.CoursesList = data));
    this.questionType = Helpers.enumToArray(QuestionType);
    this.questionLevel = Helpers.enumToArray(QuestionLevel);
    this.mediumType = Helpers.enumToArray(mediumType);
    this.languageTypes = Helpers.enumToArray(languageType);
  }

  ngOnInit(): void {
    this.validateform();
    //Patching values and pushing options values
    if (this.data.AssessmentId) {
      this.Getassessment(this.data.AssessmentId, data => {
        this.AssessmentForm.patchValue(data);
        //  this.AssessmentForm.patchValue({questionType: data.questionType});
        if (this.data.IsReadOnly) {
          this.AssessmentForm.disable();
          this.config.editable = false;
        }

        if (data)
          //this.QuizForm.get("courseId").setValue(data.courseId);
          this.questionOption = this.AssessmentForm.get('options') as FormArray;
        while (this.questionOption.length);
        this.questionOption.removeAt(0);
        if (data.options.length > 0) {
          data.options.forEach((item, ind) => {
            this.addQuestionOptions()
            this.questionOption.controls[ind].patchValue(item)
            if (data.type == QuestionType.TrueFalse) {
              this.questionOption.controls[ind].controls.optionTitle.disable()
            }
          });
        }
        if (this.data.IsReadOnly) {
          this.isreadOnly = true;
          this.questionOption.disable();
        }

      })
    }
    else {
      this.ngOnChanges();
    }
  }
  ngOnChanges() {
    this.AssessmentForm.get('questionType').valueChanges.subscribe(val => {
      while (this.questionOption.length)
        this.questionOption.removeAt(0)
      if (val == QuestionType.TrueFalse) {

        this.questionOption = this.questionOptions;
        this.questionOption.push(this.createOptionForm({ value: 'False', type: false }))
        this.questionOption.push(this.createOptionForm({ value: 'True', type: true }))
        this.btnDisable = true
      }
      else if (val == QuestionType.FillInBlank) {
        this.addQuestionOptions(null, true);
        this.btnDisable = false
        this.isFillInBlank = true;
      }
      else {
        this.btnDisable = false
      }
    })

  }
  //Getting By ID
  Getassessment(AssessmentId, callback) {
    this.loading = true;
    this.assessmentService.GetAssessmnetById(AssessmentId).pipe(
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
  }
  AddEditSubmit() {
    this.loading = true;
    let model = Object.assign({}, this.AssessmentForm.getRawValue());
    model.options.map((element, index) => {
      model.options.optionNo = element.optionNo = index + 1;
    })
    if (this.data.AssessmentId)
      model.AssessmentId = this.data.AssessmentId
    this.assessmentService.addEditAssessment(model).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }
  //Changing Values of Options
  valueChange(i) {
    this.questionOptions.controls.forEach((item, indx) => {
      if (indx == i) {
        item.get('isAnswer').setValue(true);
      } else {
        item.get('isAnswer').setValue(false);
      }
    })
  }
  get questionOptions(): FormArray {
    return this.AssessmentForm.get('options') as FormArray;
  }
  //Add Question Option
  addQuestionOptions(val?, type?) {

    this.questionOption = this.AssessmentForm.get('options') as FormArray;
    if (this.questionOption.length <= this.maxLength)
      this.questionOption.push(this.createOptionForm(val, type));
  }
  validateform() {
    this.AssessmentForm = this.fb.group({
      question: ['', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.maxLength(5000)])],
      courseId: [null, Validators.required],
      options: this.fb.array([]),
      explanation: ['', Validators.compose([])],
      questionType: [null, Validators.required, Validators.compose([])],
      medium: [null, Validators.required, Validators.compose([])],
      difficultyLevel: [null, Validators.required, Validators.compose([])],
      languageTypes: [null, Validators.compose([Validators.required])]
    });
  }
  createOptionForm(item?, type?) {

    return this.fb.group({
      optionTitle: new FormControl({ value: item ? item.value : null, disabled: item ? true : false }, Validators.compose([
        Validators.required,
        NoWhitespaceValidator,
      ])),
      optionNo: ['', Validators.compose([])],
      isAnswer: new FormControl(item ? item.type : type, Validators.compose([
        Validators.required,
      ])),
      isAnswered: ['', Validators.compose([])],
    });
  }
}
