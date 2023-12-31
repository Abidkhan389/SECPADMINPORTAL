import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from '../_pipes/file-size.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../_services/data.service';
import { LookupService } from '../_services/lookup.service';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParseJsonPipe } from '../_pipes/parseJson.pipe';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { HrefPreventDefaultDirective } from '../_directives/href-prevent-default.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [
    FileUploadComponent,
    HrefPreventDefaultDirective,
    FileSizePipe, ParseJsonPipe
  ],
  imports: [
    CommonModule,
    NgbProgressbarModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgSelectModule,
    AngularEditorModule,
  ],
  exports:[
    FileUploadComponent,
    AngularEditorModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    UiSwitchModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgApexchartsModule,
    NgbModule,
    AgmCoreModule,
    FileSizePipe,
    ParseJsonPipe ,
    HrefPreventDefaultDirective
  ],
   providers: [
        DataService,
        LookupService,
        GoogleMapsAPIWrapper
    ]
})
export class ShareModule { }
