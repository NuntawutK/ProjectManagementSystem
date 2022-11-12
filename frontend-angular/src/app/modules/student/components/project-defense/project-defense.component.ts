import { Component, OnInit } from '@angular/core';
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';
import { ProjectDefenseService } from '../../services/project-defense.service';

@Component({
  selector: 'app-project-defense',
  templateUrl: './project-defense.component.html'
})
export class ProjectDefenseComponent implements OnInit {

  projectDefenseRequestList: ProjectDefenseRequest[] = [];

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
      },
      error: err => {
        console.error(err);
      }
    })
  }
}
