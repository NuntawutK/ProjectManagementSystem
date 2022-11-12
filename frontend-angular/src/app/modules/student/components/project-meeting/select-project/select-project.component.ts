import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project, ProjectStudent } from 'src/app/interfaces/project/project';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html'
})
export class SelectProjectComponent implements OnInit {

  @Input() projectStudentList!: ProjectStudent[];
  @Output() selectedEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  clickSelect(index: number) {
    this.selectedEvent.emit(index);
  }
}
