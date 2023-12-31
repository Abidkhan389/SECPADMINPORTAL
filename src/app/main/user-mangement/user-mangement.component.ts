import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showInfoMessage, showSuccessMessage } from 'src/app/_common';
import { UserManegementService } from 'src/app/_services/administration/user-manegement.service';
import { AddeditUserComponent } from './addedit-user/addedit-user.component';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-user-mangement',
  templateUrl: './user-mangement.component.html',
  styleUrls: ['./user-mangement.component.sass']
})
export class UserMangementComponent implements OnInit {

  form: FormGroup;
  userGrades: any;
  loading: boolean;
  user: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'username', 'mobileNumber', 'role', 'CNIC', 'certificate', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tableParams: Table;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public userManegementService: UserManegementService, private dilog: MatDialog, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };

  }
  ngOnInit(): void {
    this.validateForm();
    this.fetchAllUser();
  }
  validateForm() {
    this.form = this.fb.group({
      username: new FormControl('',
        Validators.compose([NoWhitespaceValidator])
      ),
      role: new FormControl('',
        Validators.compose([NoWhitespaceValidator])
      ),
      CNIC: new FormControl('',
        Validators.compose([NoWhitespaceValidator,])
      ),
      status: new FormControl('',)
    })
  }
  updateStatus(event, user) {
    this.loading = false;
    let model = {
      id: user.userId,
      status: event ? 1 : 0
    }
    return this.userManegementService.updateUser(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          user.status = event
        }
        else {
          showErrorMessage(data.message)
          user.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }

  // On Advance Search Submit
  onSubmit() {
    this.tableParams.start = 0;
    this.fetchAllUser();
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllUser();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.form.reset();
    this.fetchAllUser();
  }
  //Fetching All with sorting or filtering with activeInActive
  fetchAllUser() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.userManegementService.getAllUsers(this.tableParams)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.count = result.totalCount;
          this.dataSource = result.dataList;
          this.dataSource.sort = this.sort;
        }
      });
  }
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, isReadOnly?: any) {

    const dialogref = this.dilog.open(AddeditUserComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        userId: Id,
        readOnly: isReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllUser();
        }
      },
    });
  }
  ViewUser(Id: any) {
    this.AddEdit(Id, true);
  }
  onPaginate(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllUser()
  }
  ViewCertificate(content, val) {
    return this.userManegementService.getUserDetailForCertificate(val)
      .subscribe(result => {
        if (result) {
          this.userGrades = result;
          //let u = result.userName
          //this.user = u.split('@')[0]
          //  if (result.grade != "F") {
          this.openDetailModal(content);
          // }
          // else
          //   showInfoMessage("No Certificate issue Yet")
        }
      });
  }
  openDetailModal(content) {
    this.modalOptions.backdrop = 'static';
    this.modalOptions.keyboard = false;
    this.modalOptions.size = 'lg';
    this.modalOptions.centered = true;
    this.modalService.open(content, this.modalOptions);
  }
  onPrint() {
    let data = document.getElementById('print');

    const doc = new jsPDF();
    // let data = document.getElementById('print');
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')

      let pdf = new jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      pdf.save(this.userGrades.fullName + '  Report.pdf');
    }).catch(function (error) {
      console.error('oops, something went wrong!', error);
    });

  }
}
