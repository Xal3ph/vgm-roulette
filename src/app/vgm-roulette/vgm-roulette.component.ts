import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
// import genres from '../../../assets/data/genres.json'

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'
import { CommonModule, Location } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';
import { GenreComponent } from "../genre/genre.component";
import { Genre } from '../genre/genre';
import { Game } from '../game/game';
import { GenreService } from '../genre/genre.service';
import { GameService } from '../game/game.service';
import { GameComponent } from '../game/game.component';
import { urlSafeToBinary, charArrayToBinaryArray } from "../utils/convert";


@Component({
  selector: 'app-vgm-roulette',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FontAwesomeModule, FlexLayoutModule, GenreComponent, GameComponent],
  templateUrl: './vgm-roulette.component.html',
  styleUrl: './vgm-roulette.component.scss'
})
export class VgmRouletteComponent implements OnInit, AfterViewInit {
  genres: Genre[] = []
  games: Game[] = []
  @ViewChild('clouds1') clouds1!: ElementRef;
  @ViewChild('clouds2') clouds2!: ElementRef;
  @ViewChild('clouds3') clouds3!: ElementRef;
  @ViewChild('cloudLonely') cloudLonely!: ElementRef;
  @ViewChild('background') background!: ElementRef;
  startTime = new Date();

  selectedGenre?: Genre
  selectedGame?: Game

  
  constructor(
    library: FaIconLibrary,
    private http: HttpClient, 
    private renderer: Renderer2,
    private genreService: GenreService,
    private gameService: GameService,
    private location: Location
  ) {
    library.addIcons(faWikipediaW);
    console.log()
  }

  clear() {
    this.genres = []
    this.games = []
  }

  async rollGenre(count: number) {
    this.genres = this.genreService.roll(count)
  }
  async rollGame(count: number) {
    this.games = await this.gameService.roll(count)
  }
  async roll() {
    this.clear()
    this.rollGenre(3)
    this.rollGame(3)
  }

  ngOnInit(): void {
    this.setTimer();
    const hash = this.location.path(true).split('#')[1] || '';
    console.log(hash);
    let parent = "", children: string[], childrenStr = "", platforms = ""
    hash.split('&').forEach( h => {
      switch(h.split('=')[0]) {
        case "p":
          parent = h.split('=')[1]
          break;
        case "c": 
        childrenStr = h.split('=')[1]
          break;
        case "g":
          platforms = h.split('=')[1]
          break;
        default:
          break;
      }
    })
    console.log(`parent: ${parent}`)
    console.log(`childrenStr: ${childrenStr}`)
    console.log(`platforms: ${platforms}`)
    parent = urlSafeToBinary(parent)
    children = charArrayToBinaryArray(childrenStr)
    platforms = urlSafeToBinary(platforms)
    console.log(`parent: ${parent}`)
    console.log(`children: ${children}`)
    console.log(`platforms: ${platforms}`)
    this.genreService.loadSaveCode(parent, children)
    this.gameService.loadSaveCode(platforms)
    // this.genreService.parentFilter = 
  }

  ngAfterViewInit(): void {
  }

  private setTimer() {
    setTimeout(() => {
      let dt = (new Date().getTime() - this.startTime.getTime())/1000;
      const ratio = this.clouds1.nativeElement.getBoundingClientRect().height / 216;
      let cloud1Width = ((10*(dt))%(384*ratio));
      let cloud2Width = (5*(dt))%(384*ratio);
      let cloud3Width = ((dt))%(384*ratio);
      let cloudLWidth = ((dt))%(384*ratio);
      this.renderer.setStyle(this.clouds1.nativeElement, 'background-position-x', `${ cloud1Width }px`);
      this.renderer.setStyle(this.clouds2.nativeElement, 'background-position-x', `${ cloud2Width }px`);
      this.renderer.setStyle(this.clouds3.nativeElement, 'background-position-x', `${ cloud3Width }px`);
      this.renderer.setStyle(this.cloudLonely.nativeElement, 'background-position-x', `${ cloudLWidth }px`);
      this.setTimer();
    }, 100);
  }

  get saveCode() {
    return `${this.genreService.saveCode}&${this.gameService.saveCode}`;
  }
}
