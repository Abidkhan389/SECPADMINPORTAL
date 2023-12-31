import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { ReportService } from 'src/app/_services/administration/report.service';
import { Table } from 'src/app/interfaces/ITable';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-enrolled-course-report',
  templateUrl: './enrolled-course-report.component.html',
  styleUrls: ['./enrolled-course-report.component.sass']
})
export class EnrolledCourseReportComponent implements OnInit {
  tableParams: Table;
  validationMessages = Messages.validation_messages;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  noData: boolean = false;
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'userName', 'userCnic', 'userMob-Num', 'courseName','Assign' ,'enrollmentStatus'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  form: FormGroup;
  loading: boolean = true;
  isCollapsed: boolean = true;
  count: number = 0;
  constructor(private fb: FormBuilder, private modalService: NgbModal, protected userReportService: ReportService) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null }
  }

  ngOnInit(): void {
    this.validateForm();
    this.fetchAllUsers();
  }
  validateForm() {
    this.form = this.fb.group({
      courseTitle: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      username: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      CNIC: ['', Validators.compose([NoWhitespaceValidator, Validators.maxLength(15)])],
      enrolledStatus: ['',],
    });
  }
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.fetchAllUsers();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllUsers()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllUsers();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.fetchAllUsers();
  }
  fetchAllUsers() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.userReportService.EnrollmentDetails(this.tableParams)
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
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }
  confirmBox(event, enrollment) {
    
    Swal.fire({
      title: (event==false ? 'Are you sure want to Disable  this course For user?' : 'Are you want to Enable this course For user?'),
      // text: 'Are You Sure!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: (event==false ?  'Yes, Disabled !' : 'Yes,Enable!'),
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.updateStatus(event, enrollment);

      } 
      else if (result.isDismissed) {
        debugger
        enrollment.status=!event;
        Swal.fire(
          'Cancelled',
          (event==false ? 'Disabled Cancel':'Enable Cancel'),
          'error'
        )

      }

    })
  }

  updateStatus(event, enrollment) {
    debugger
    this.loading = false;
    let model = {
      id: enrollment.enrollmentId,
      status: event ? 1 : 0
    }
    return this.userReportService.updateEnrollmentDisableStatus(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          debugger
          showSuccessMessage(data.message)
          enrollment.status = event
        }
        else {
          showErrorMessage(data.message)
          enrollment.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
}
