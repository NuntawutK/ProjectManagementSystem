import { Component, Input, OnInit } from "@angular/core";
import { Advisor } from "src/app/interfaces/user/advisor";

@Component({
  selector: 'show-list-tab',
  templateUrl: './show-list-tab.component.html'
})
export class ShowListTabComponent implements OnInit {

  @Input() advisorList!: Advisor[];

  constructor() { }

  ngOnInit() {    
  }

}