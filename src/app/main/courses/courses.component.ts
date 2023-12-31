import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { Messages } from 'src/app/_common';
import { ResultMessages } from 'src/app/_common/constant';
import { showErrorMessage, showSuccessMessage } from 'src/app/_common/messages';
import { Patterns } from 'src/app/_common/Validators/patterns';
import { NoWhitespaceValidator } from 'src/app/_common/Validators/validators';
import { CoursesService } from 'src/app/_services/administration/courses.service';
import { AddeditcoursesComponent } from './addeditcourses/addeditcourses.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.sass']
})
export class CoursesComponent implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  courseList: any;
  course: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'categoryName', 'courseName', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCategories = 0;
  pageSize = 5;
  currentPage = 1;
  noData: boolean = false;
  CurrentCourseId: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tableParams: Table;
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public coursesService: CoursesService, private dilog: MatDialog, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }

  ngOnInit(): void {
    this.validateForm();
    this.fetchAllCourses();
  }
  validateForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      status: ['',],
    });
  }
  updateStatus(event, course) {
    this.loading = false;
    let model = {
      id: course.courseId,
      status: event ? 1 : 0
    }
    return this.coursesService.updateCourse(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          course.status = event
        }
        else {
          showErrorMessage(data.message)
          course.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  // On Advance Search Submit
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.fetchAllCourses();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllCourses()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllCourses();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.fetchAllCourses();
  }
  //Fetching All with sorting or filtering with activeInActive
  fetchAllCourses() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.coursesService.getAllCourses(this.tableParams)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.count = result.totalCount;
          this.dataSource = result.dataList;
          if (this.count == 0) {
            this.noData = true;
          }
          else{
            this.noData = false
          }
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }
  ViewCourse(Id: any) {
    this.CurrentCourseId = Id;
    this.AddEdit(this.CurrentCourseId, true);
  }
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, IsReadOnly?: any) {

    const dialogref = this.dilog.open(AddeditcoursesComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        courseId: Id,
        IsReadOnly: IsReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllCourses();
        }
      },
    });
  }
}
