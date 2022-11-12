import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// components
import { AddAdvisorComponent } from './add-advisor.component';

// tab components
import { InputFieldTabComponent } from './tab-components/input-field-tab/input-field-tab.component';
import { UploadFileTabComponent } from './tab-components/upload-file-tab/upload-file-tab.component';
import { ShowListTabComponent } from './tab-components/show-list-tab/show-list-tab.component';

@NgModule({
  declarations: [
    AddAdvisorComponent,
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
    AddAdvisorComponent
  ]
})
export class AddAdvisorModule { }