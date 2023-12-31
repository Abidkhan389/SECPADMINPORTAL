import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { DropDownUtils, Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common';
import { EnrollUserService } from 'src/app/_services/administration/enroll-user.service';
import { Table } from 'src/app/interfaces/ITable';
import { AddeditEnrollUserComponent } from './addedit-enroll-user/addedit-enroll-user.component';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-enroll-user',
  templateUrl: './enroll-user.component.html',
  styleUrls: ['./enroll-user.component.sass']
})
export class EnrollUserComponent extends DropDownUtils implements OnInit {

  form: FormGroup;
  loading: boolean = true;
  courseList: any;
  course: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'userName', 'categoryName', 'courseName', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCategories = 0;
  pageSize = 5;
  currentPage = 1;
  categoryList:any;
  noData: boolean = false;
  CurrentEnrollmentId: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tableParams: Table;
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public enrollUserService: EnrollUserService, private dilog: MatDialog,
     private fb: FormBuilder, private modalService: NgbModal, protected lookupService: LookupService,
      protected router: Router) {
      super(lookupService, router);
      this.GetAllCategory(data => (this.categoryList = data));
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }

  ngOnInit(): void {
    this.validateForm();
    this.fetchAllEnrollUser();
    this.form.get("categoryId").valueChanges.subscribe(val => {
      this.courseList = [];
      this.form.get('courseId').reset();
      if (val) {
        this.GetCoursesAgainstCategory(val);
      }

    })
  }
  validateForm() {
    this.form = this.fb.group({
      categoryId: [null,Validators.compose([])],
      courseId: [null,Validators.compose([])],
      userName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
    });
  }
  GetCoursesAgainstCategory(Id: any) {
    this.courseList=[];
    this.form.get('courseId').reset();
    this.enrollUserService.GetCourseDDLByCategory(Id).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.courseList=result;
        }
      },
        error => {
          showInfoMessage(ResultMessages.notExist);
        }
        );
    
  }
  // On Advance Search Submit
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.fetchAllEnrollUser();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllEnrollUser()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllEnrollUser();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.fetchAllEnrollUser();
  }
  //Fetching All with sorting or filtering with activeInActive
  fetchAllEnrollUser() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.enrollUserService.getAllEnrollUsers(this.tableParams)
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
    this.CurrentEnrollmentId = Id;
    this.AddEdit(this.CurrentEnrollmentId, true);
  }
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, IsReadOnly?: any) {

    const dialogref = this.dilog.open(AddeditEnrollUserComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        enrolledId: Id,
        IsReadOnly: IsReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllEnrollUser();
        }
      },
    });
  }
}
