import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { GlobalBoardService } from './../boards/global-board.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input() content: string
  @Input() isActive: boolean
  @Input() won: boolean
  @Output() clicked = new EventEmitter<boolean>();

  player = "X"

  mouseIn: boolean

  @ViewChild('filled') btn: ElementRef;

  constructor(private globalBoradService: GlobalBoardService) { }

  ngOnInit(): void {
    this.globalBoradService.playerEmitter.subscribe((player) => {this.player = player})
  }

  get status() {
    return this.content === 'X' ? "danger" : "success"
  }

  onClick() {
      this.clicked.emit(true);
  }

  onMouseEnter() {
      this.mouseIn = true
  }

  onMouseLeave() {
    this.mouseIn = false
  }
}
