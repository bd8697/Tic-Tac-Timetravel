import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Coord } from '../Entities/coord.entity';

@Injectable({
  providedIn: 'root',
})
export class GlobalBoardService {
  boards: string[][][];
  globalBoards: string[][][];
  winner: string;
  globalBoardSources: number[][][];
  moveCount = 0;
  winsX = 0;
  wins0 = 0;
  winsEmitter = new Subject<{winsX: number, wins0: number}>()
  winnerEmitter = new Subject<string>()
  winnerCoordsEmitter = new Subject<{boardNo: number, coord: Coord}[]>()
  moveCountEmitter = new Subject<number>()
  playerEmitter = new Subject<string>()

  constructor() {
    this.newGame();
  }

  newGame() {
    this.winner = null;
    this.winnerEmitter.next(this.winner)
    this.moveCount = 0;
    this.moveCountEmitter.next(this.moveCount)
    this.playerEmitter.next(this.player)
    this.boards = new Array(3)
      .fill(null)
      .map(() => new Array(3).fill(null).map(() => new Array(3).fill(null)));
      this.globalBoards = new Array(3)
      .fill(null)
      .map(() => new Array(3).fill(null).map(() => new Array(3).fill(null)));
    this.globalBoardSources = new Array(3)
      .fill(null)
      .map(() => new Array(3).fill(null).map(() => new Array(3).fill(null)));
  }

  get player() {
    return this.moveCount % 2 === 0 ? 'X' : '0';
  }

  onAct(coords: Coord, boardNo: number) {
    this.boards[boardNo][coords.x][coords.y] = this.player;
    for(let i = 0; i < this.boards.length; i++) {
      // handle global boards
      if (i >= boardNo && this.globalBoardSources[i][coords.x][coords.y] <= boardNo) {
        // if valid, override
        this.globalBoards[i][coords.x][coords.y] = this.player;
        this.globalBoardSources[i][coords.x][coords.y] = boardNo;
      }
    }

    this.moveCount++;
    this.checkForEnd(coords, boardNo);

    if(this.moveCount < 3) {
      this.moveCountEmitter.next(this.moveCount)
    }
    this.playerEmitter.next(this.player)
  }

  checkForEnd(coords: Coord, boardNo: number) {
    if (this.moveCount === 9 * 3) {
      this.winner = 'draw';
      this.winnerEmitter.next(this.winner)
      return;
    }

    for(let i = boardNo; i < this.boards.length; i++) {
      this.checkForWin(coords, i, boardNo)
    }

    if(this.winner) {
      this.winsEmitter.next({winsX: this.winsX, wins0: this.wins0})
    }
  }

  checkForWin(coords: Coord, globalBoardNo: number, boardNo: number) {
    const n = 3;
    let winningCoords: {boardNo: number, coord: Coord}[] = []
    for (let y = 0; y < n; y++) {
      if (
        this.globalBoards[globalBoardNo][coords.x][y] !==
        this.boards[boardNo][coords.x][coords.y]
      ) {
        break;
      }
      else {
        const winningCoord: Coord = {x: coords.x, y}
        winningCoords.push({boardNo: this.globalBoardSources[globalBoardNo][coords.x][y], coord: winningCoord})
      }
      if (y === n - 1) {
        this.handleWin(boardNo, coords.x, coords.y)
        this.winnerCoordsEmitter.next(winningCoords)
      }
    }
    winningCoords = []
    for (let x = 0; x < n; x++) {
      if (
        this.globalBoards[globalBoardNo][x][coords.y] !==
        this.boards[boardNo][coords.x][coords.y]
      ) {
        break;
      }
      else {
        const winningCoord: Coord = {x, y: coords.y}
        winningCoords.push({boardNo: this.globalBoardSources[globalBoardNo][x][coords.y], coord: winningCoord})
      }
      if (x === n - 1) {
        this.handleWin(boardNo, coords.x, coords.y)
        this.winnerCoordsEmitter.next(winningCoords)
      }
    }
    winningCoords = []
    if (coords.x === coords.y) {
      for (let x = 0; x < n; x++) {
        if (
          this.globalBoards[globalBoardNo][x][x] !==
          this.boards[boardNo][coords.x][coords.y]
        ) {
          break;
        }
        else {
          const winningCoord: Coord = {x, y: x}
          winningCoords.push({boardNo: this.globalBoardSources[globalBoardNo][x][x], coord: winningCoord})
        }
        if (x === n - 1) {
          this.handleWin(boardNo, coords.x, coords.y)
          this.winnerCoordsEmitter.next(winningCoords)
        }
      }
    }
    winningCoords = []
    if (coords.x + coords.y === n - 1) {
      for (let x = 0; x < n; x++) {
        if (
          this.globalBoards[globalBoardNo][x][n - 1 - x] !=
          this.boards[boardNo][coords.x][coords.y]
        ) {
          break;
        }
        else {
          const winningCoord: Coord = {x, y: n - 1 - x}
          winningCoords.push({boardNo: this.globalBoardSources[globalBoardNo][x][n - 1 - x], coord: winningCoord})
        }
        if (x === n - 1) {
          this.handleWin(boardNo, coords.x, coords.y)
          this.winnerCoordsEmitter.next(winningCoords)
        }
      }
    }
  }

  handleWin (boardNo: number, x: number, y: number) {
    this.winner = this.boards[boardNo][x][y];
    this.winnerEmitter.next(this.winner)
    if(this.winner === 'X') {
      this.winsX++;
    }
    else if(this.winner === '0') {
      this.wins0++;
    }
  }
}
