import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { QuizService } from 'src/app/_services/administration/quiz.service';
import { AngularEditorConfig } from '@kolkov/angular-editor'
import { Messages, NoWhitespaceValidator, Patterns, showErrorMessage, ResultMessages, Helpers, DropDownUtils } from 'src/app/_common';
import { languageType, mediumType, QuestionLevel, QuestionType } from 'src/app/_common/_helper/enum';
import { LookupService } from 'src/app/_services/lookup.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addeditquiz',
  templateUrl: './addeditquiz.component.html',
  styleUrls: ['./addeditquiz.component.sass']
})
export class AddeditquizComponent extends DropDownUtils implements OnInit {
  [x: string]: any;
  loading: any;
  QuizList: any;
  countindex: number = 0;
  CoursesList: any;
  LectureList: any;
  QuizForm: FormGroup;
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
  constructor(private fb: FormBuilder, protected lookupService: LookupService, protected router: Router, private dialogref: MatDialogRef<AddeditquizComponent>,
    private dilog: MatDialog, public quizService: QuizService, @Inject(MAT_DIALOG_DATA) public data: any) {
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
    if (this.data.questionId) {
      this.GetQuiz(this.data.questionId, data => {
        this.GetLecturesAgainstCourse(data.courseId)
        this.QuizForm.patchValue(data);
        if (this.data.IsReadOnly) {
          this.QuizForm.disable();
          this.config.editable = false;
        }

        if (data)
          //this.QuizForm.get("courseId").setValue(data.courseId);
          this.questionOption = this.QuizForm.get('options') as FormArray;
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

    this.QuizForm.get('type').valueChanges.subscribe(val => {
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

    this.QuizForm.get("courseId").valueChanges.subscribe(val => {
      this.LectureList = [];
      this.QuizForm.get('lectureId').reset();
      if (val) {
        this.getAllLecturesDDLByCourseId(val, data => (this.LectureList = data));
      }

    })
  }
  GetLecturesAgainstCourse(event) {
    this.getAllLecturesDDLByCourseId(event, data => (this.LectureList = data));
  }
  //Getting By ID
  GetQuiz(questionId, callback) {
    this.loading = true;
    this.quizService.GetQuizById(questionId).pipe(
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
    let model = Object.assign({}, this.QuizForm.getRawValue());
    model.options.map((element, index) => {
      model.options.optionNo = element.optionNo = index + 1;
    })
    if (this.data.questionId)
      model.questionId = this.data.questionId
    this.quizService.addEditQuiz(model).subscribe((data: any) => {
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
    return this.QuizForm.get('options') as FormArray;
  }
  //Add Question Option
  addQuestionOptions(val?, type?) {

    this.questionOption = this.QuizForm.get('options') as FormArray;
    if (this.questionOption.length <= this.maxLength)
      this.questionOption.push(this.createOptionForm(val, type));
  }
  validateform() {
    this.QuizForm = this.fb.group({
      question: ['', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.maxLength(2000)])],
      courseId: [null, Validators.required],
      lectureId: [null, Validators.required],
      options: this.fb.array([]),
      explanation: ['', Validators.compose([])],
      type: [null, Validators.required, Validators.compose([])],
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
