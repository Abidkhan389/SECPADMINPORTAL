import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Messages, NoWhitespaceValidator, Patterns } from 'src/app/_common';
import { ReportService } from 'src/app/_services/administration/report.service';
import { Table } from 'src/app/interfaces/ITable';

@Component({
  selector: 'app-coursescount-report',
  templateUrl: './coursescount-report.component.html',
  styleUrls: ['./coursescount-report.component.sass']
})
export class CoursescountReportComponent implements OnInit {
  tableParams: Table;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  noData: boolean = false;
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'courseName', 'count', ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading: boolean = true;
  count: number = 0;
  form: FormGroup;
  isCollapsed: boolean = true;
  validationMessages = Messages.validation_messages;
  constructor(private modalService: NgbModal,protected userReportService:ReportService,private fb: FormBuilder,) { 
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null }
  }
  ngOnInit(): void {
    this.validateForm();
    this.fetchAllCoursesCount();
  }
  validateForm() {
    this.form = this.fb.group({
      courseTitle: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
    });
  }
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.fetchAllCoursesCount();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllCoursesCount()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllCoursesCount();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.fetchAllCoursesCount();
  }
  fetchAllCoursesCount(){
    this.loading = true;
    Object.assign(this.tableParams,this.form.value);
    this.userReportService.EnrolledCoursesCountReport(this.tableParams)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.count = result.totalCount;
          this.dataSource = result.dataList;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

}
