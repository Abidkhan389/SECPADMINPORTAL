import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { DropDownUtils, Helpers, Messages } from 'src/app/_common';
import { ResultMessages } from 'src/app/_common/constant';
import { showErrorMessage, showSuccessMessage } from 'src/app/_common/messages';
import { Patterns } from 'src/app/_common/Validators/patterns';
import { NoWhitespaceValidator } from 'src/app/_common/Validators/validators';
import { QuestionLevel, QuestionType } from 'src/app/_common/_helper/enum';
import { QuizService } from 'src/app/_services/administration/quiz.service';
import { AddeditquizComponent } from './addeditquiz/addeditquiz.component';
import { LookupService } from 'src/app/_services/lookup.service';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass']
})
export class QuizComponent extends DropDownUtils implements OnInit {
  tableParams: Table;
  form: FormGroup;
  loading: boolean = true;
  courseList: any;
  LectureList: any;
  quiz: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'courseName', 'lectureName', 'question', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCategories = 0;
  pageSize = 5;
  currentPage = 1;
  noData: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  [x: string]: any;
  validationMessages = Messages.validation_messages;
  constructor(public quizService: QuizService, private dilog: MatDialog, private fb: FormBuilder, protected lookupService: LookupService, protected router: Router,) {
    super(lookupService, router);
    this.getAllCoursesForDDL(data => (this.CoursesList = data));
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
    this.questionType = Helpers.enumToArray(QuestionType);
    this.questionLevel = Helpers.enumToArray(QuestionLevel);

  }

  ngOnInit(): void {
    this.validateForm();
    this.getAllQuestions();

  }
  GetLecturesAgainstCourse(Id: any) {
    this.LectureList=[];
    this.form.get('lectureId').reset();
    if (Id) {
      this.getAllLecturesDDLByCourseId(Id.courseId, data => (this.LectureList = data));
    }
  }
  onSubmit() {
    this.tableParams.start = 0;
    this.noData = false;
    this.getAllQuestions();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.getAllQuestions()
  }

  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.getAllQuestions();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.LectureList=[];
    this.form.reset();
    this.noData = false;
    this.getAllQuestions();
  }
  updateStatus(event, quiz) {
    this.loading = false;
    let model = {
      id: quiz.questionId,
      status: event ? 1 : 0
    }
    return this.quizService.updatestatus(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          quiz.status = event
        }
        else {
          showErrorMessage(data.message)
          quiz.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  getAllQuestions() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
     this.quizService.getAllQuizez(this.tableParams)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.count = result.totalCount;
          this.dataSource = result.dataList
          if (this.count == 0) {
            this.noData = true
          }
          else{
            this.noData = false
          }         
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }
  ViewQuiz(Id: any) {
    this.CurrendCourseId = Id;
    this.AddEdit(this.CurrendCourseId,true);
  }
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, IsReadOnly?: any) {

    const dialogref = this.dilog.open(AddeditquizComponent, {
      width: '650px',
      disableClose: true,
      autoFocus: false,
      data: {
        questionId: Id,
        IsReadOnly: IsReadOnly
      }
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.getAllQuestions();
        }
      },
    });
  }
  validateForm() {
    this.form = this.fb.group({
      question: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(500)])],
      questionType: [null, Validators.compose([])],
      courseId: [null, Validators.compose([])],
      lectureId: [null, Validators.compose([])],
      difficultyType: [null, Validators.compose([])],
      status: ['',],
    });
  }
}
