import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Messages, NoWhitespaceValidator, Patterns, showErrorMessage, ResultMessages } from 'src/app/_common';
import { EnrollmentApprovalService } from 'src/app/_services/administration/enrollment-approval.service';
import { Table } from 'src/app/interfaces/ITable';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-approval-requests',
  templateUrl: './approval-requests.component.html',
  styleUrls: ['./approval-requests.component.sass']
})
export class ApprovalRequestsComponent implements OnInit {
  loading: boolean = true;
  form: FormGroup;
  courseList: any;
  WaitingForApprovalUserList: any;
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'userName', 'courseName', 'Approval'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = 5;
  currentPage = 1;
  noData: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tableParams: Table;
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public enrollmentApprovalService: EnrollmentApprovalService, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }

  ngOnInit(): void {
    this.validateForm();
    this.AgainRequestsForCourseApproval();
  }
  validateForm() {
    this.form = this.fb.group({
      userName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      courseName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
    });
  }
  confirmBox(id: any) {
    Swal.fire({
      title: 'Are you sure want to give access to this course to user?',
      text: 'You will not be able to Unapprove this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approved !',
      cancelButtonText: 'No, Dont Approved'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ApproveUserRequest(id);

      } else if (result.isDismissed) {
        Swal.fire(
          'Cancelled',
          'Approval Cancelled',
          'error'
        )

      }

    })
  }

  ApproveUserRequest(Id: any) {
    this.loading = false;
    return this.enrollmentApprovalService.ApproveUserRequest(Id)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          this.AgainRequestsForCourseApproval()
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
    this.AgainRequestsForCourseApproval();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.AgainRequestsForCourseApproval()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.AgainRequestsForCourseApproval();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.AgainRequestsForCourseApproval();
  }
  //Fetching All with sorting or filtering with activeInActive
  AgainRequestsForCourseApproval() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.enrollmentApprovalService.AgainRequestsForCourseApproval(this.tableParams)
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
          else {
            this.noData = false
          }
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

}
