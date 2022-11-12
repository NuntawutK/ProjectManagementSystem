import { Component, Input, OnInit } from '@angular/core';
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { ProjectDefenseService } from '../../../services/project-defense.service';

@Component({
  selector: 'app-see-request-detail',
  templateUrl: './see-request-detail.component.html'
})
export class SeeRequestDetailComponent implements OnInit {

  @Input() selectedDefenseRequest!: ProjectDefenseRequest;
  @Input() index!: number;

  constructor(
    private projectDefenseService: ProjectDefenseService
  ) { }

  ngOnInit(): void {
  } 
  
  toggleRequestStatus(bool: boolean) {
    this.selectedDefenseRequest.projectDefenseRequestStatusAccepted = bool;
  }

  submit() {
    if (this.selectedDefenseRequest.projectDefenseRequestStatusAccepted === false && 
      this.selectedDefenseRequest.projectDefenseRequestStatusMessage === '') {
        alert('กรุณากรอกเหตุผลการไม่อนุมัติ');
        return;
      }
    
    let payload: Partial<ProjectDefenseRequest> = {
      projectDefenseRequestStatusAccepted: this.selectedDefenseRequest.projectDefenseRequestStatusAccepted,
      projectDefenseRequestStatusMessage: this.selectedDefenseRequest.projectDefenseRequestStatusMessage,
    }

    this.projectDefenseService.updateProjectDefense(this.selectedDefenseRequest.id, payload).subscribe({
      next: res => {
        if (res.id === this.selectedDefenseRequest.id) {
          alert('บันทึกการอนุมัติโครงงานสำเร็จ');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      },
      error: err => {
        console.error(err);
        alert('บันทึกการอนุมัติโครงงานล้มเหลว');
      }
    })
  }

}
