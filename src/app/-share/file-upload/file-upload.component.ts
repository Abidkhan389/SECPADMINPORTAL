import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { IAttachment } from 'src/app/interfaces/IAttachment';
import { IUploadFile } from 'src/app/interfaces/IUploadFile';
import { APIPaths, Helpers, ResultMessages, showConfirmationMessage, showDeletedSuccessfully, showErrorMessage, TokenHelper } from 'src/app/_common';
import { AttachmentService } from 'src/app/_services/attachment.service';
import { UploadedFileinfoService } from 'src/app/_services/administration/uploaded-fileinfo.service';

@Component({
  selector: 'aims-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.sass']
})
export class FileUploadComponent implements OnInit, OnChanges {
  @Input() options: IUploadFile;
  @Input() files: string;
  @Input() folderName: string;
  @Input() idValue: string;
  @Output() uploadedFiles = new EventEmitter<string>();
  @Output() uploadedFile = new EventEmitter<string>();
  uploadFileName: string;
  statusBar?: number = null;
  uploadText: string = "Upload/Drop File Here";
  attachments: IAttachment[] = [];
  addNewAttachments: boolean = false;
  id: string;
  value: string;
  check: string;
  constructor(public attachmentService : AttachmentService,private uploadedFileinfoService: UploadedFileinfoService) { }

  ngOnInit() { }

  onClickUpload(event) {
    this.value = event.srcElement.parentElement.id
    if (this.value) {
      this.check = this.value + "1";
      document.getElementById(this.check).click();
    }
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {

    if (changes['options'])
      this.options = changes['options'].currentValue;
    if (changes['idValue']) {
      this.id = changes['idValue'].currentValue;
    }
    if (changes['files']) {
      this.options.files = changes['files'].currentValue;
      this.attachments = this.files ? JSON.parse(this.files) : [];
    }

  }

  onFileChange($event) {
    this.uploadFile($event.target.files[0])
    $event.target.value = '';
  }

  uploadFile(file) {
    var accept = document.getElementById(this.check).getAttribute("accept");
    var checkFileExtension = Helpers.validateExtension(file.name, accept);
    let fileSize = this.options.size.split(" ")[0];

    if (checkFileExtension && Helpers.formatBytes(file.size, fileSize)) {
      this.uploadFileName = file.name;

      var xhr = new XMLHttpRequest();
      this.fileUploaded(xhr, data => {
        if (data) {
          let att: IAttachment = {
            fileName: file.name,
            serverFileName: data,
            fileSize: file.size,
            isDeleted: false
          }
          this.attachments.push(att);
          if (this.check == "course1")
            this.uploadedFile.emit(JSON.stringify(this.attachments));
          else
            this.uploadedFiles.emit(JSON.stringify(this.attachments));
          setTimeout(() => {
            this.addNewAttachments = false;
            this.statusBar = null;
            this.uploadFileName = null;
          }, 1000);
        }
      });

      if (xhr.upload) {
        this.statusBar = 0;
        this.updateProgress(xhr, data => {
          this.statusBar = data;
        });
      }
      xhr.open("POST", APIPaths.uploadAttachemnt, true);
      xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.setRequestHeader('Authorization', 'Bearer ' + TokenHelper.getAccessToken());
      xhr.setRequestHeader("X-File-Name", file.name);
      xhr.setRequestHeader("X-File-Size", file.size);
      xhr.setRequestHeader("X-File-Type", file.type);
      xhr.setRequestHeader("X-File-Path", this.folderName);

      xhr.send(file);
    }
    else {
      this.removeFile();
    }
  }

  // fileUploaded(xhr, callback) {
  //   xhr.onreadystatechange = function (e) {
  //     if (xhr.readyState === 4) {//Done
  //       if (xhr.status === 200) {//Loading/Done
  //         let response = JSON.parse(xhr.response).data;
  //         if (response.success) {
  //           const parts = response.data.split(/[\\/]/);
  //           //Get the last part (the filename)
  //           const filename = parts.pop();
  //           this.FileName = filename; // Extract the filename
  //           //this.fileNameChange.emit(fileName);
  //           const foldername = parts.pop()
  //           this.FolderName=foldername;
  //           this.uploadedFileinfoService.setFileDetails(this.FileName,this.FolderName);
  //           //this.folderNameChange.emit(folderName);
  //           callback(response.data);
  //         }
  //         else {
  //          this.removeFile();
  //         }
  //       }
  //     }
  //     else if (xhr.readyState === 1) {//loading
  //     }
  //   };
  // }
  fileUploaded(xhr, callback) {
    xhr.onreadystatechange = (e) => { // Use an arrow function here
      if (xhr.readyState === 4) { // Done
        if (xhr.status === 200) { // Loading/Done
          let response = JSON.parse(xhr.response).data;
          if (response.success) {
            const parts = response.data.split(/[\\/]/);
            // Get the last part (the filename)
            const filename = parts.pop();// Extract the filename
            const foldername = parts.pop(); // Extract the foldername
            this.uploadedFileinfoService.setFileDetails(filename,foldername);
            callback(response.data);
          } else {
            this.removeFile();
          }
        }
      } else if (xhr.readyState === 1) { // Loading
      }
    };
  }
  

  updateProgress(xhr, callback) {
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        this.statusBar = e.loaded / e.total * 100;
        callback((e.loaded / e.total * 100))
      }
    };
    xhr.upload.onloadstart = function (e) {
      callback(0)
    };
    xhr.upload.onloadend = function (e) {
      callback(100)
    };
  }

  dragEnter($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  dragOver($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  removeFile() {
    this.addNewAttachments = false;
    this.statusBar = null;
    this.uploadFileName = null;
  }

  onDrop($event) {
    $event.preventDefault();
    this.uploadFile($event.dataTransfer.files[0])
  }

  deleteFile(file: IAttachment) {
    showConfirmationMessage('Are you sure?', 'Yes', 'You will not be able to revert this!').then((response) => {
      if (response.isConfirmed) {
        const parts = file.serverFileName.split(/[\\/]/);
        // Get the last part (the filename)
         const filename = parts.pop();

        this.attachmentService.deleteFile(filename, null, this.folderName).subscribe(
          result => {
            if (result) {
              this.attachments = this.attachments.filter(att => att.serverFileName !== file.serverFileName);
              this.uploadedFiles.emit(JSON.stringify(this.attachments));
            }
            showDeletedSuccessfully();
          },
          error => {
            showErrorMessage(ResultMessages.serverError);
          }
        )
      }
    });
  }

  downloadFile(file: IAttachment) {
    this.attachmentService.downloadFileFromFolder(file.serverFileName, this.folderName);
  }

}
