import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimsService {
  animTriggerCount = 0
  animTriggerEmitter = new Subject<number>()

  constructor() { }

  onInit() {
    this.initAnims()
  }

  initAnims() {
    this.animTriggerCount = 0
    for(let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.animTriggerCount++
        this.animTriggerEmitter.next(this.animTriggerCount)
      }, 500 * i);
    }
  }
}
