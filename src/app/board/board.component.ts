import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimsService } from '../anims/anims.service';
import { GlobalBoardService } from '../boards/global-board.service';
import { Coord } from './../Entities/coord.entity';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    trigger("boardAnim", [
      state('idle', style({
        'opacity' : 0,
      })),
      state('offset', style({
        'opacity' : 0,
        'transform' : 'translateX(150%)'
      })),
      state('triggered', style({
        'opacity' : 1,
      })),
      transition('idle <=> triggered', [
        animate(1000),
      ]),
      transition('offset <=> triggered', [
        animate("1000ms 0ms ease-out", keyframes([
          style({
            'opacity' : 1,
            offset: 0.5,
          }),
          style({
            'transform' : 'translateX(0%)',
            offset: 1,
          }),
        ])),
      ])
    ]),
  ]
})

export class BoardComponent implements OnInit, OnDestroy {
  @Input() boardIdx: number;
  fields: string[][];
  isActive: boolean;
  moveCountSub: Subscription;
  winningCoords: Coord[] = [];
  boardState: string

  @ViewChild('board') board: ElementRef;

  constructor(private globalBoardService: GlobalBoardService, private animsService: AnimsService) {}

  ngOnInit(): void {
    this.newGame();
    this.moveCountSub = this.globalBoardService.moveCountEmitter.subscribe((moveCount) => {
      this.isActive = moveCount >= this.boardIdx ? true : false;
    });
    this.globalBoardService.winnerEmitter.subscribe((winner) => {
      this.isActive = winner ? false : true;
    });
    this.globalBoardService.winnerCoordsEmitter.subscribe((winnerCoords) => {
      winnerCoords.map((winnerCoord) => {
        if (winnerCoord.boardNo === this.boardIdx) {
          this.winningCoords.push(winnerCoord.coord);
        }
      });
    });
    this.animsService.animTriggerEmitter.subscribe((animTrigger) => {
      if(this.boardIdx === 0) {
        if(animTrigger === 1) {
          this.boardState = "triggered" 
        }
      } else if(this.boardIdx !== 0) {
        if(animTrigger === 3) {
          this.boardState = "triggered" 
      }
    }})
  }

  ngOnDestroy(): void {
    this.moveCountSub.unsubscribe();
  }

  newGame() {
    this.fields = new Array(3).fill(null).map(() => new Array(3).fill(null));
    this.isActive = this.boardIdx === 0 ? true : false;
    this.boardState = this.boardIdx === 0 ? "offset" : "idle"
  }

  act(row: number, col: number, boardIdx: number) {
    const coords: Coord = { x: row, y: col };
    if (this.fields[coords.x][coords.y] === null) {
      this.fields[coords.x][coords.y] = this.globalBoardService.player;
      this.globalBoardService.onAct(coords, boardIdx);
    }
  }

  won(row: number, col: number) {
    for (let winningCord of this.winningCoords) {
      if (row === winningCord.x && col === winningCord.y) {
        return true;
      }
    }
    return false;
  }

  onClick() {
    // clicked inside
  }
}
