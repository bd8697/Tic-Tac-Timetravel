import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalBoardService } from './../boards/global-board.service';
import { AnimsService } from './../anims/anims.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  animations: [
    trigger('flash', [
      state(
        'in',
        style({ transform: 'scale(1) ', 'text-shadow': '0px 0px 3px #A0F144' })
      ),
      state(
        'out',
        style({
          transform: 'scale(1.1)',
          'text-shadow': '0px 0px 10px #A0F144',
        })
      ),
      transition('in => out', animate('0.37s ease-in-out')),
      transition('out => in', animate('0.37s ease-in-out')),
    ]),
  ],
})
export class CanvasComponent implements OnInit, OnDestroy {
  winner: string;
  player = 'X';
  turnColor = '#F19D44';
  animState = 'in';
  boardsInited = true;
  timesWonThisRound = 0;
  private winnerSub: Subscription;

  constructor(
    private globalBoardService: GlobalBoardService,
    private changeDetector: ChangeDetectorRef,
    private animsService: AnimsService
  ) {}

  ngOnInit(): void {
    this.globalBoardService.winnerEmitter.subscribe((winner) => {
      if(this.timesWonThisRound === 0) {
        this.globalBoardService.moveCount--;
      }
      this.timesWonThisRound++;
      this.winner = winner;
    });
    this.globalBoardService.playerEmitter.subscribe((player) => {
        this.player = player;
        if (player === 'X') {
          this.turnColor = '#F19D44';
        } else if (player === '0') {
          this.turnColor = '#4495f1';
        }
    });
  }

  onEnd() {
    if (this.animState === 'in') {
      this.animState = 'out';
    } else {
      this.animState = 'in';
    }
  }

  ngOnDestroy(): void {
    this.winnerSub.unsubscribe();
  }

  reinitChildComponent(): void {
    this.boardsInited = false;
    this.changeDetector.detectChanges();
    this.boardsInited = true;

  }

  onPlayAgain() {
    this.globalBoardService.newGame();
    this.timesWonThisRound = 0;
    this.animsService.initAnims();
    this.reinitChildComponent();
  }
}
