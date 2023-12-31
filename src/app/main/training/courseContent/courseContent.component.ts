import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { Table } from 'src/app/interfaces/ITable';
import { DropDownUtils, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showSuccessMessage } from 'src/app/_common';
import { CourseContentService } from 'src/app/_services/administration/courseContent.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AddEditCourseContentComponent } from './add-edit-courseContent/add-edit-courseContent.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './courseContent.component.html',
  styleUrls: ['./courseContent.component.sass']
})
export class CourseContentComponent extends DropDownUtils implements OnInit {
  form: FormGroup;
  tableParams: Table;
  courseDDL: any;
  lectureDDL: any;
  content: any[] = [];
  dataSource !: MatTableDataSource<any>;
  displayedColumns: string[] = ['sn.', 'status', 'contentName', 'order', 'lectureTitle', 'courseName', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isCollapsed: boolean = true;
  noData: boolean = false;
  @ViewChild('myTable') table: any;
  loading: boolean;
  count: number = 0;
  constructor(protected lookupService: LookupService,
    public courseContentService: CourseContentService, private dilog: MatDialog, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    super(lookupService, router)
    this.getAllCoursesForDDL(data => this.courseDDL = data);
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }

  ngOnInit(): void {
    this.validateForm();
    this.fetchAllContent();
  }
  getLectureDDLByCourse(val: any) {
    this.form.patchValue({ lectureId: null });
    if (val) {
      this.getAllLecturesDDLByCourseId(val.courseId, data => (this.lectureDDL = data));
    }
  }
  validateForm() {
    this.form = this.fb.group({
      contentName: new FormControl('', Validators.compose([NoWhitespaceValidator,
        Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])
      ),
      status: new FormControl('',),
      courseId: new FormControl(null, Validators.compose([])),
      lectureId: new FormControl(null, Validators.compose([])),
      type: new FormControl(null, Validators.compose([])),
      order: new FormControl(null, Validators.compose([NoWhitespaceValidator, Validators.pattern(Patterns.Num)]))
    });
  }
  ViewContent(Id: any) {
    this.AddEdit(Id, true);
  }
  AddEdit(Id?: any, isReadOnly?: any) {
    const dialogref = this.dilog.open(AddEditCourseContentComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        contentId: Id ? Id : null,
        readOnly: isReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllContent();
        }
      },
    });
  }
  updateStatus(event, content) {
    this.loading = false;
    let model = {
      id: content.contentId,
      status: event ? 1 : 0
    }
    return this.courseContentService.updateContent(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          content.status = event
        }
        else {
          showErrorMessage(data.message)
          content.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  fetchAllContent() {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
    this.courseContentService.getAllCourseContent(this.tableParams)
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
            this.noData = false;
          }
          this.dataSource.sort = this.sort;
        }
      });
  }
  // On Advance Search Submit
  onSubmit() {
    this.noData = false;
    this.tableParams.start = 0;
    this.fetchAllContent();
  }
  //Sorting on Coloum With MatSort
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllContent();
  }
  resetTable() {
    this.noData = false;
    this.lectureDDL = [];
    this.form.reset();
    this.fetchAllContent();
  }
  onPaginate(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllContent()
  }
}
