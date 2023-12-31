import { HttpClient } from '@angular/common/http';
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
import { LectureService } from 'src/app/_services/administration/lecture.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { AddEditLectureComponent } from './add-edit-lecture/add-edit-lecture.component';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.sass']
})
export class LectureComponent extends DropDownUtils implements OnInit {
  tableParams: Table;
  form: FormGroup;
  courseDDL: any;
  loading: boolean;
  isCollapsed: boolean = true;
  lecture: any[] = [];
  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 count: number = 0;
  noData: boolean = false;
  displayedColumns: string[] = ['sn.', 'status', 'lectureNumber', 'lectureTitle', 'courseName', 'actions'];
  constructor(protected lookUpService: LookupService, 
    public lectureService: LectureService, private dilog: MatDialog, private fb: FormBuilder, private modalService: NgbModal, protected router: Router) {
    super(lookUpService, router)
    this.getAllCoursesForDDL(data => this.courseDDL = data);
    this.tableParams = { start: 0, limit: 5, sort: '', order: 'ASC', search: null };
  }

  ngOnInit(): void {
    this.validateForm();
    this.fetchAllLectures();
  }
  validateForm()
  {
      this.form = this.fb.group({
        lectureTitle: new FormControl('',
          Validators.compose([NoWhitespaceValidator,
            Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])
        ),
        status: new FormControl('', ),
        courseId : new FormControl(null, )

      })
  }
  resetTable() {
    this.noData= false;
    this.form.reset();
    this.fetchAllLectures();
  }
  onSubmit() {
    this.noData= false;
    this.tableParams.start = 0;
    this.fetchAllLectures();
  }
  fetchAllLectures()
  {
    this.loading = true;
    Object.assign(this.tableParams, this.form.value);
     this.lectureService.getAllLectures(this.tableParams)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.count = result.totalCount;
          this.dataSource = result.dataList;
          if(result.totalCount == 0)
          {
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
  updateStatus(event, lecture) {
    this.loading = false;
    let model = {
      id: lecture.lectureId,
      status: event ? 1 : 0
    }
    return this.lectureService.updateLectures(model)
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(data => {
        if (data.success) {
          showSuccessMessage(data.message)
          lecture.status = event
        }
        else {
          showErrorMessage(data.message)
          lecture.status = !event
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  ViewLecture(Id: any) {
     this.AddEdit(Id, true);
  }
  AddEdit(Id?: any , isReadOnly?: any) {
    const dialogref = this.dilog.open(AddEditLectureComponent, {
      disableClose: true,   
      autoFocus: false,    
      data: {
        lectureId: Id ? Id : null,
        readOnly : isReadOnly
      },
    })
    dialogref.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.fetchAllLectures();
        }
      },
    });
  }
  onPaginate(pageEvent: PageEvent) {
    this.tableParams.limit = pageEvent.pageSize
    this.tableParams.start = pageEvent.pageIndex * pageEvent.pageSize
    this.fetchAllLectures()
  }
  onSort(sort: Sort) {
    this.tableParams.sort = sort.active;
    this.tableParams.order = sort.direction;
    this.tableParams.start = 0;
    this.fetchAllLectures();
  }
}
