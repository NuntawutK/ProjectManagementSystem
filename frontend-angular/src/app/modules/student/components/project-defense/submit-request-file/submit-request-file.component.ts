import { Component, Input, OnInit } from '@angular/core';
import { ProjectDefenseFileStorage, ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { ProjectDefenseService } from '../../../services/project-defense.service';

@Component({
  selector: 'app-submit-request-file',
  templateUrl: './submit-request-file.component.html'
})
export class SubmitRequestFileComponent implements OnInit {

  @Input() selectedProjectDefenseRequest!: ProjectDefenseRequest;
  @Input() index!: number;
  fileNameList: ProjectDefenseFileStorage[] = [];
  fileNameListForSubmit: string[] = [];
  loading: boolean = false;
  
  constructor(
    private projectDefenseService: ProjectDefenseService
  ) { }

  ngOnInit(): void {
    this.getFileNameList();
  }

  getFileNameList() {
    this.projectDefenseService.getFileNameList(this.selectedProjectDefenseRequest.id).subscribe({
      next: data => {
        this.fileNameList = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  onChangeFile(event: any) {
    if (event.target.files.length == 0) return;

    let fileList: ProjectDefenseFileStorage[] = [];
    this.fileNameListForSubmit = [];
    for (let index = 0; index < event.target.files.length; index++) {
      let file = event.target.files[index];
      const reader = new FileReader();
      let pattern = 'application/pdf';
      
      if (!file.type.match(pattern)) {
        alert('เฉพาะไฟล์ .pdf เท่านั้น');
        return;
      }

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (!reader.result) {
          alert('พบปัญหาในการอัพโหลดไฟล์ โปรดลองในภายหลัง');
          return;
        }

        fileList.push({
          fileName: file.name,
          fileData: reader.result?.toString(),
        } as ProjectDefenseFileStorage)
        this.fileNameListForSubmit.push(file.name);
      }
    }

    this.selectedProjectDefenseRequest.projectDefenseFileStorages = fileList;
  }

  submit() {
    if (!this.selectedProjectDefenseRequest.projectDefenseFileStorages || this.selectedProjectDefenseRequest.projectDefenseFileStorages.length === 0) {
      alert('ไม่มีไฟล์ที่ถูกอัพโหลด โปรดตรวจสอบอีกครั้ง');
      return;
    }

    let payload: Partial<ProjectDefenseRequest> = {
      id: this.selectedProjectDefenseRequest.id,
      projectDefenseFileStorages: this.selectedProjectDefenseRequest.projectDefenseFileStorages,
    }
    console.log(payload);

    this.loading = true;
    this.projectDefenseService.updateProjectDefenseRequest(payload).subscribe({
      next: _ => {
        this.loading = false;
        alert('อัพโหลดไฟล์สำเร็จ');
        this.fileNameListForSubmit = [];
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      error: _ => {
        this.loading = false;
        alert('อัพโหลดไฟล์ล้มเหลว');
      }
    })
  }

  openSubmittedFiles(fileStorageId: number) {
    this.projectDefenseService.openSubmittedFiles(fileStorageId).subscribe({
      next: data => {
        if (data.fileData) {
          var hiddenElement = document.createElement('a');
          hiddenElement.href = data.fileData;
          hiddenElement.target = '_blank';
          hiddenElement.download = data.fileName;
          hiddenElement.click();
        }
      },
      error: _ => {
        alert('มีปัญหาบางอย่างเกิดขึ้น โปรดลองในภายหลัง');
      }
    });
  }

  deleteSubmittedFiles(fileStorageId: number) {
    if (confirm('ยืนยันการลบไฟล์') == false)
      return;
    
    this.projectDefenseService.deleteSubmittedFiles(fileStorageId).subscribe({
      next: data => {
        if (data) {
          alert('ลบไฟล์สำเร็จ');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
      error: _ => {
        alert('มีปัญหาบางอย่างเกิดขึ้น โปรดลองในภายหลัง');
      }
    })
  }

}
