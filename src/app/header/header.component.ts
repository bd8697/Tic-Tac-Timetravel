import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AnimsService } from './../anims/anims.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger("titleAnim", [
      state('idle', style({
        'opacity' : 0,
      })),
      state('triggered', style({
        'opacity' : 1,
      })),
      transition('idle <=> triggered', [
        animate(1000),
      ])
    ]),
  ]
})
export class HeaderComponent implements OnInit {
  title1State = "idle"
  title2State = "idle"
  title3State = "idle"

  constructor(private animsService: AnimsService) { }

  ngOnInit(): void {
      this.animsService.onInit()
      this.animsService.animTriggerEmitter.subscribe((animTrigger) => {
        switch(animTrigger) {
          case 1: {
            this.title1State = 'triggered'
            break;
          }
          case 2: {
            this.title2State = 'triggered'
            break;
          }
          case 3: {
            this.title3State = 'triggered'
            break;
          }
        }
      })
  }
}
