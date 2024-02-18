import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalBoardService } from './../boards/global-board.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  winsX = 0
  wins0 = 0
  winsSub: Subscription;
  
  constructor(private globalBoardService: GlobalBoardService) { }

  ngOnDestroy(): void {
    this.winsSub.unsubscribe()
  }

  ngOnInit(): void {
    this.winsSub = this.globalBoardService.winsEmitter.subscribe((wins) => {
      this.winsX = wins.winsX;
      this.wins0 = wins.wins0;
    });
  }

}
