import { Component, OnInit } from '@angular/core';

// interfaces
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';

// services
import { ProjectDefenseService } from '../../services/project-defense.service';

@Component({
  selector: 'app-student-project-defense-request',
  templateUrl: './student-project-defense-request.component.html'
})
export class StudentProjectDefenseRequestComponent implements OnInit {

  projectDefenseRequestList: ProjectDefenseRequest[] = [];
  filteredProjectDefenseRequestList: ProjectDefenseRequest[] = [];
  checkboxSelector = [
    {
      id: 'wait-for-approve',
      labelName: 'รอการอนุมัติ',
      value: 1,
      checked: true
    },
    {
      id: 'approved',
      labelName: 'อนุมัติเรียบร้อย',
      value: 2,
      checked: false
    }
  ];
  selectedCheckboxValue: number = 1;

  constructor(
    private projectDefenseService: ProjectDefenseService
  ) { }

  ngOnInit(): void {
    this.getProjectDefenseRequestList();
  }

  getProjectDefenseRequestList() {
    this.projectDefenseService.getProjectDefenseRequestList().subscribe({
      next: data => {
        this.projectDefenseRequestList = data;
        this.filteredProjectDefenseRequestList = this.filteringStudentList(this.selectedCheckboxValue);
      },
      error: err => {
        console.error(err);
      }
    })
  }
  
  handleCheckbox(event: any) {
    this.selectedCheckboxValue = Number(event.target.value);

    this.checkboxSelector.map((item: any) => {
      if (item.value === this.selectedCheckboxValue)
        item.checked = true;
      else
        item.checked = false;
    });

    this.filteredProjectDefenseRequestList = this.filteringStudentList(this.selectedCheckboxValue);
    
  }

  filteringStudentList(value: number) {
    let newFilteredRequest!: ProjectDefenseRequest[];
    switch (value) {
      case 1:
        newFilteredRequest = this.projectDefenseRequestList.filter(item => (item.projectDefenseRequestStatus.status === 'อยู่ระหว่างการอนุมัติ'));
        break;
      case 2:
        newFilteredRequest = this.projectDefenseRequestList.filter(item => (
          item.projectDefenseRequestStatus.status === 'อนุมัติ' || item.projectDefenseRequestStatus.status === 'ไม่อนุมัติ'));
        break;
      default:
        newFilteredRequest = [];
        break;
    }
    return newFilteredRequest;
  }

  toggleRequestStatus(bool: boolean, index: number) {
    this.filteredProjectDefenseRequestList[index].projectDefenseRequestStatusAccepted = bool;
  }

}
