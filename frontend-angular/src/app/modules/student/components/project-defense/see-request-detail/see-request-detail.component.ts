import { Component, Input, OnInit } from '@angular/core';
import { ProjectDefenseRequest } from 'src/app/interfaces/project/project-defense';

@Component({
  selector: 'app-see-request-detail',
  templateUrl: './see-request-detail.component.html'
})
export class SeeRequestDetailComponent implements OnInit {

  @Input() selectedProjectDefenseRequest!: ProjectDefenseRequest;
  @Input() index!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
