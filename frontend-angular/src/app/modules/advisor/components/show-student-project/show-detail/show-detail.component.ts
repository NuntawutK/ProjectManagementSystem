import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/interfaces/project/project';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
})
export class ShowDetailComponent implements OnInit {

  @Input() openModal!: boolean;
  @Output() event = new EventEmitter<boolean>();

  @Input() project: Project | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onCloseModal() {
    this.openModal = false;
    this.event.emit(this.openModal);

    if (!this.openModal)
      this.project = undefined;
    
  }

}
