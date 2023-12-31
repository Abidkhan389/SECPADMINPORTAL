import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { CategoryService } from 'src/app/_services/administration/category.service';
import { Table } from 'src/app/interfaces/ITable';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { AddEditGradingCriteriaComponent } from './add-edit-grading-criteria/add-edit-grading-criteria.component';
import { GradingCriteriaService } from 'src/app/_services/administration/grading-criteria.service';

@Component({
  selector: 'app-grading-criteria',
  templateUrl: './grading-criteria.component.html',
  styleUrls: ['./grading-criteria.component.sass']
})
export class GradingCriteriaComponent implements OnInit {
  form: FormGroup;
  loading: boolean = true;
  GradingCriteriaList: any;
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'gradeName', 'Grade_S_R', 'Grade_E_R', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCategories = 0;
  pageSize = 5;
  currentPage = 1;
  noData: boolean = false;
  CurrentGradingCriteriaId: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tableParams: Table;
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public categoryService: CategoryService, private dilog: MatDialog, private fb: FormBuilder,
     private modalService: NgbModal, protected router: Router, protected gradingCriteriaService:GradingCriteriaService) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }
  ngOnInit(): void {
    this.validateForm();
    this.fetchAllGradingCriteria();
  }
  validateForm() {
    this.form = this.fb.group({
      gradeName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      
    });
  }
  // On Advance Search Submit
  onSubmit() {
    this.tableParams.start = 0;
    this.fetchAllGradingCriteria();
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllGradingCriteria();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.form.reset();
    this.fetchAllGradingCriteria();
  }
  // Pagination with server side
  pageChanged(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllGradingCriteria()
  }
  ViewgradeCriteria(Id: any) {
    this.CurrentGradingCriteriaId = Id;
    this.AddEdit(this.CurrentGradingCriteriaId, true);
  }
  fetchAllGradingCriteria() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.gradingCriteriaService.getAllGradingCriteria(this.tableParams)
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
  //Add Edit With Mat Dialoge Modal Ref
  AddEdit(Id?: any, IsReadOnly?: any) {

    const dialogref = this.dilog.open(AddEditGradingCriteriaComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        gradingId: Id,
        IsReadOnly: IsReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllGradingCriteria();
        }
      },
     });
  }

}
