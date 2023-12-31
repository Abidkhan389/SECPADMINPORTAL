import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Messages, NoWhitespaceValidator, Patterns, showInfoMessage } from 'src/app/_common';
import { ReportService } from 'src/app/_services/administration/report.service';
import { Table } from 'src/app/interfaces/ITable';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-grades-report',
  templateUrl: './grades-report.component.html',
  styleUrls: ['./grades-report.component.sass']
})
export class GradesReportComponent implements OnInit {

  tableParams: Table;
  modalOptions: NgbModalOptions = {};
  validationMessages = Messages.validation_messages;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  noData: boolean = false;
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'userName', 'courseName', 'grade', 'certificate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  form: FormGroup;
  loading: boolean = true;
  isCollapsed: boolean = true;
  count: number = 0;
  userGrade: any;
  user: any;
  constructor(private fb: FormBuilder, private modalService: NgbModal, protected reportService: ReportService) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null }
  }

  ngOnInit(): void {
    this.validateForm();
    this.getAllUserGrades();
  }
  validateForm() {
    this.form = this.fb.group({
      userName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      courseTitle: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      grade: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex)])],
    });
  }
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.getAllUserGrades();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.getAllUserGrades()
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.getAllUserGrades();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.noData = false;
    this.form.reset();
    this.getAllUserGrades();
  }
  getAllUserGrades() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.reportService.GetAllUserGrades(this.tableParams)
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

  ViewCertificate(content, val) {
    return this.reportService.GetGradeById(val)
      .subscribe(result => {
        if (result) {
          this.userGrade = result;
          let u = result.userName
          this.user = u.split('@')[0]
          if (result.grade != "F") {
            this.openDetailModal(content);
          }
          else
            showInfoMessage("No Certificate issue Yet")
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
      pdf.save(this.userGrade.courseTitle + ' Certificate.pdf');
    }).catch(function (error) {
      console.error('oops, something went wrong!', error);
    });

  }
}


