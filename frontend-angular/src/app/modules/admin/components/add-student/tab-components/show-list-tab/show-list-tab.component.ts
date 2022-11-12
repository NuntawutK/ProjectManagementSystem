import { Component, Input, OnInit } from "@angular/core";

// interfaces
import { Student } from "src/app/interfaces/user/student";

@Component({
  selector: 'show-list-tab',
  templateUrl: './show-list-tab.component.html'
})
export class ShowListTabComponent implements OnInit {

  @Input() studentList!: Student[];

  constructor() { }

  ngOnInit() {    
  }

}