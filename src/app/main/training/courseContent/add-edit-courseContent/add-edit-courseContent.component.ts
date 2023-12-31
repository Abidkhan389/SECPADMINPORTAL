import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ICourseContent } from 'src/app/interfaces/courseContent/ICourseContent';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage, showInfoMessage } from 'src/app/_common';
import { DropDownUtils } from 'src/app/_common/_helper/dropdownUtils';
import { CourseContentService } from 'src/app/_services/administration/courseContent.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { IUploadFile } from 'src/app/interfaces/IUploadFile';
import { AttachmentService } from 'src/app/_services/attachment.service';
import { UploadedFileinfoService } from 'src/app/_services/administration/uploaded-fileinfo.service';




@Component({
  selector: 'app-add-edit-trainings',
  templateUrl: './add-edit-courseContent.component.html',
  styleUrls: ['./add-edit-courseContent.component.sass']
})
export class AddEditCourseContentComponent extends DropDownUtils implements OnInit {
  contentForm: FormGroup;
  courseName: any;
  lectureList: any;
  loading: any;
  serverFileName: any;
  isreadOnly: boolean = false;
  addNewContent: boolean = true;
  addEditContent: ICourseContent;
  courseList: any;
  uploadOptions: IUploadFile = {
    accept: '.png,.jpeg,.jpg,.gif,.pdf,.docx ,.doc',
    maxFiles: 10,
    multiple: false,
    files: null,
    size: '5 MB',
    disableActions: false
  }
  uploadFileName: string = '[]'
  types = [
    { type: "0", name: 'Video' },
    { type: "1", name: 'Document' },
  ];
  validationMessages = Messages.validation_messages;
  disable: boolean;
  constructor(private fb: FormBuilder, protected lookupService: LookupService, protected router: Router,
    private dialogref: MatDialogRef<AddEditCourseContentComponent>, public attachmentService: AttachmentService,
    public courseContentService: CourseContentService,private uploadedFileinfoService: UploadedFileinfoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(lookupService, router);
    this.getAllCoursesForDDL(data => (this.courseList = data));
  }
  ngOnInit(): void {
    if (this.data.contentId) {
      this.GetContent()
    }
    this.validateform();

  }
  getLectureDDLByCourse(val: any) {
    this.contentForm.patchValue({ lectureId: null });
    if (val) {
      this.getAllLecturesDDLByCourseId(val.courseId, data => (this.lectureList = data));
    }
  }
  uploadedAttachments($event) {
    this.uploadFileName = $event;
    this.contentForm.get('attachments').setValue(this.uploadFileName);
    const data = JSON.parse(this.uploadFileName);
    this.serverFileName = data[0].serverFileName;
    //console.log(this.uploadFileName.indexOf("[]"))
  }
  getLecturesForSelectedCourse(event) {
    this.getAllLecturesDDLByCourseId(event, data => (this.lectureList = data));

  }
  //Getting By ID
  GetContent() {
    this.loading = true;
    this.courseContentService.getContentById(this.data.contentId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.contentForm.patchValue(result);
          this.getLecturesForSelectedCourse(result.courseId);
          this.uploadedAttachments(result.attachments);
          if (this.data.readOnly) {
            this.isreadOnly = true
            this.disable=this.data.readOnly
            this.uploadOptions.disableActions = true;
            this.contentForm.disable();
          }
        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  AddEdit() {
    this.addEditContent = this.contentForm.value;
    this.addEditContent.attachments=this.serverFileName;
    if (this.data.contentId)
      this.addEditContent.contentId = this.data.contentId;
    this.courseContentService.addEditContent(this.addEditContent).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.attachmentService.deleteFile(this.uploadedFileinfoService.getFilename(), null, this.uploadedFileinfoService.getFoldername()).subscribe(
      result => {
        if (result) 
        {
        }
      },
      error => {
        showErrorMessage(ResultMessages.serverError);
      }
     )
        this.dialogref.close();
  }
  validateform() {
    this.contentForm = this.fb.group({
      contentName: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])),
      link: new FormControl(''),
      attachments: new FormControl(''),
      order: new FormControl('', Validators.compose([Validators.required, Validators.pattern(Patterns.Num)])),
      type: new FormControl(null, Validators.required),
      text: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.maxLength(50)])),
      courseId: new FormControl(null, Validators.required),
      lectureId: new FormControl(null, Validators.required)
    });
  }
}
