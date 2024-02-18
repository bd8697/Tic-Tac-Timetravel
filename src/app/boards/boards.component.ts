import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss']
})
export class BoardsComponent implements OnInit {
  boards: string[]

  constructor() { }

  ngOnInit(): void {
    this.boards = Array(3).fill(null)
  }

}
