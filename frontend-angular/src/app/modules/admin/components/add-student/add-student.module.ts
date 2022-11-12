import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// tab components
import { InputFieldTabComponent } from './tab-components/input-field-tab/input-field-tab.component';
import { UploadFileTabComponent } from './tab-components/upload-file-tab/upload-file-tab.component';
import { ShowListTabComponent } from './tab-components/show-list-tab/show-list-tab.component';

// components
import { AddStudentComponent } from './add-student.component';

@NgModule({
  declarations: [
    AddStudentComponent,
    InputFieldTabComponent,
    UploadFileTabComponent,
    ShowListTabComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [
    AddStudentComponent
  ]
})
export class AddStudentModule { }