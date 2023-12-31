import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { Messages } from 'src/app/_common';
import { ResultMessages } from 'src/app/_common/constant';
import { showErrorMessage } from 'src/app/_common/messages';
import { Patterns } from 'src/app/_common/Validators/patterns';
import { NoWhitespaceValidator } from 'src/app/_common/Validators/validators';
import { EnrollmentApprovalService } from 'src/app/_services/administration/enrollment-approval.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-enrollment-approval',
  templateUrl: './enrollment-approval.component.html',
  styleUrls: ['./enrollment-approval.component.sass']
})
export class EnrollmentApprovalComponent implements OnInit {
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
    this.fetchAllWaitingForApprovalUserList();
  }
  validateForm() {
    this.form = this.fb.group({
      userName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      courseName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
    });
  }
  confirmBox(id: any) {
    Swal.fire({
      title: 'Are you sure want to Approve?',
      text: 'You will not be able to Unapprove this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approved !',
      cancelButtonText: 'No, Dont Approved'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ApprovalUserforCourse(id);

      } else if (result.isDismissed) {
        Swal.fire(
          'Cancelled',
          'Approval Cancelled',
          'error'
        )

      }

    })
  }

  ApprovalUserforCourse(Id: any) {
    this.loading = false;
    return this.enrollmentApprovalService.ApproveUserRequest(Id)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          this.fetchAllWaitingForApprovalUserList()
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
    this.fetchAllWaitingForApprovalUserList();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllWaitingForApprovalUserList()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllWaitingForApprovalUserList();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.fetchAllWaitingForApprovalUserList();
  }
  //Fetching All with sorting or filtering with activeInActive
  fetchAllWaitingForApprovalUserList() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.enrollmentApprovalService.fetchAllWaitingForApprovalUserList(this.tableParams)
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
