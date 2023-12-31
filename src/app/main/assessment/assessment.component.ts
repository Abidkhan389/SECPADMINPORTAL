import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { DropDownUtils, Helpers, Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { QuestionLevel, QuestionType } from 'src/app/_common/enum';
import { AssessmentService } from 'src/app/_services/administration/assessment.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { Table } from 'src/app/interfaces/ITable';
import { AddeditassessmentComponent } from './addeditassessment/addeditassessment.component';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.sass']
})
export class AssessmentComponent extends DropDownUtils implements OnInit {
  tableParams: Table;
  form: FormGroup;
  loading: boolean = true;
  courseList: any;
  quiz: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'courseName','question', 'actions'];
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
  constructor(public assessmentService: AssessmentService, private dilog: MatDialog, private fb: FormBuilder, protected lookupService: LookupService, protected router: Router,) {
    super(lookupService, router);
    this.getAllCoursesForDDL(data => (this.CoursesList = data));
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
    this.questionType = Helpers.enumToArray(QuestionType);
    this.questionLevel = Helpers.enumToArray(QuestionLevel);
  }
  ngOnInit(): void {
    this.validateForm();
    this.getAllAssessment();

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
    this.getAllAssessment();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.getAllAssessment()
  }

  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.getAllAssessment();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.LectureList=[];
    this.form.reset();
    this.noData = false;
    this.getAllAssessment();
  }
  updateStatus(event, assessment) {
    this.loading = false;
    let model = {
      id: assessment.assessmentId,
      status: event ? 1 : 0
    }
    return this.assessmentService.updatestatus(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          assessment.status = event
        }
        else {
          showErrorMessage(data.message)
          assessment.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  getAllAssessment() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
     this.assessmentService.getAllAssessment(this.tableParams)
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
  ViewAssessment(Id: any) {
    this.CurrendAssessmentId = Id;
    this.AddEdit(this.CurrendAssessmentId,true);
  }
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, IsReadOnly?: any) {

    const dialogref = this.dilog.open(AddeditassessmentComponent, {
      width: '650px',
      disableClose: true,
      autoFocus: false,
      data: {
        AssessmentId: Id,
        IsReadOnly: IsReadOnly
      }
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.getAllAssessment();
        }
      },
    });
  }
  validateForm() {
    this.form = this.fb.group({
      question: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(500)])],
      questionType: [null, Validators.compose([])],
      courseId: [null, Validators.compose([])],
      difficultyType: [null, Validators.compose([])],
      status: ['',],
    });
  }

}
