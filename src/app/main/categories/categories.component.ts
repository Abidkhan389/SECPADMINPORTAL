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
import { AddEditCategorieComponent } from './add-edit-categorie/add-edit-categorie.component';
import { Table } from 'src/app/interfaces/ITable';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showSuccessMessage } from 'src/app/_common';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  categoryList: any;
  category: any[] = [];
  modalOptions: NgbModalOptions = {};
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'categoryName', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalCategories = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  tableParams: Table;
  @ViewChild('myTable') table: any;
  isCollapsed: boolean = true;
  count: number = 0;
  validationMessages = Messages.validation_messages;
  constructor(public categoryService: CategoryService, private dilog: MatDialog, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };

  }
  ngOnInit(): void {
    this.validateForm();
    this.fetchAllCategories();
  }
  validateForm() {
    this.form = this.fb.group({
      categoryName: ['', Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])],
      status: ['',],
    });
  }
  updateStatus(event, category) {
    this.loading = false;
    let model = {
      id: category.categoryId,
      status: event ? 1 : 0
    }
    return this.categoryService.updateCategory(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          category.status = event
        }
        else {
          showErrorMessage(data.message)
          category.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }

  // On Advance Search Submit
  onSubmit() {
    this.tableParams.start = 0;
    this.fetchAllCategories();
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllCategories();
  }
  //Reset Form Values on Advance Search
  resetTable() {
    this.form.reset();
    this.fetchAllCategories();
  }
  //Fetching All with sorting or filtering with activeInActive
  fetchAllCategories() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.categoryService.getAllCategories(this.tableParams)
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

    const dialogref = this.dilog.open(AddEditCategorieComponent, {
      height: '230px',
      width: '350px',
      disableClose: true,
      autoFocus: false,
      data: {
        categoryId: Id,
        readOnly: isReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllCategories();
        }
      },
    });
  }
  ViewCategory(Id: any) {
    this.AddEdit(Id, true);
  }
  onPaginate(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllCategories()
  }
}

