import { Component, OnInit } from '@angular/core';
// import genres from '../../../assets/data/genres.json'
import genresCat from '../../assets/data/genres-categorized.json'

// https://github.com/Elbriga14/EveryVideoGameEver
import SNESGames from '../../assets/data/SNESGames.json'
import NESGames from '../../assets/data/NESGames.json'
import SegaGenesisGames from '../../assets/data/SegaGenesisGames.json'
import PS1Games from '../../assets/data/PS1Games.json'

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClient } from '@angular/common/http';


interface Game {
  Game: string
  GameLink: string
  Year: string
  Dev: string
  DevLink: string
  Publisher: string
  PublisherLink: string
  Platform: string
  PlatformLink: string
  Image: String
}

@Component({
  selector: 'app-vgm-roulette',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FontAwesomeModule, FlexLayoutModule],
  templateUrl: './vgm-roulette.component.html',
  styleUrl: './vgm-roulette.component.scss'
})
export class VgmRouletteComponent {
  genreCat: string = ""
  genre: string = ""
  game?: Game

  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNzU1ZWQzZDFjOWE1MmM3NWZiOGYwYWZhYTZiYjcxMSIsImp0aSI6ImYyN2MyZjkxNjY0ZGY4ZWIwYjNjNzFlODgxMGJhOTg5NzRkMTY0ZDIyNDI0OGI4Njg1ZDI3YmI2MmJiMTIwYmNhMjY1ZDI4YTkwYjJmZjlhIiwiaWF0IjoxNzI2Njg0MDE4LjYyMzM5MSwibmJmIjoxNzI2Njg0MDE4LjYyMzM5NSwiZXhwIjozMzI4MzU5MjgxOC42MjA1ODMsInN1YiI6IjE1NDEyNjQiLCJpc3MiOiJodHRwczovL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.jx3-nWrMZP3Q5N6dKnYExfIgo5uKC1-GNNQ16--nnKdpEWdpvTjGhJwOCf4uJKdYGueStRIKzilUdCEQGzPin9_MPvmMjJS5Z16C078P9ybnJ80XsRn-BljA6gWV_5Vr_UNMdptromH_hsW8v0p2RAdZlc20mL_p9lgsUGni0_Q9NgPKew35fD7xeAfzkR0-cLQf2BOSviRUaRnIg8QCfnZcliFGL6Alzo04X8-f_88-ZRpBXBysPywjSAx4sTYQWMsySW4ZwGIXWYOt2HfZ3VtuADtx6TD6GhPMGHD8kM8l7b5LOQPL5q4y2AiWWDpKce3b_6gR7eOBt52F6bKKM1gvl6xL8cJNnJ4-kpw6kjWd3amY5aG2XBOglwKx96TUhE-Glvu37ex3hjKnd5dPNNfaboPcQwyjnYrOo8eYP51QxJ75WqFDOArAx5bpdWtsms-nMV2LqfbhiNoWNaQlmbDpw9gJJvetlD9Kn41xVcNAj0dGDzWLwce_XgfG-V9m5Llm8fHM60SxzoiFJ5KhthDk-BhJV68VrIgQowr2C3EfT78UHT1wvTGpl3jnrWI3VihSuHYTZV6bqbsYokPPOKOQJHeKmOykFyEgbWp1JnHDgmw6IsPNzIbwD7cgaE-7T3WaDimByImOua4GpeGWNfROM02ey1OBiwuYjsLwAnU"

  get games(): Game[] {
    return [...SNESGames, ...NESGames, ...SegaGenesisGames, ...PS1Games].filter(x => x.GameLink != undefined) as any[]
  }

  constructor(library: FaIconLibrary, private http: HttpClient) {
    library.addIcons(faWikipediaW);
    delete (genresCat as any)['Comedy'];
  }

  ngOnInit(): void {
  }

  // getRandomGenre(): string {
  //   return genres[Math.floor(Math.random()*genres.length)];
  // }

  getRandomGenreSub(key: string): string {
    const gc = genresCat as {[key: string]: string[]}
    return gc[key][Math.floor(Math.random()*gc[key].length)];
  }

  getRandomGenreCat(): string {
    const keys = Object.keys(genresCat);
    const index = Math.floor(Math.random()*keys.length);
    // const cat = keys[index];
    // return cat === 'Comedy' ? this.getRandomGenreCat() : cat;
    return keys[index];
  }

  clear() {
    this.genreCat = ""
    this.genre = ""
    this.game = undefined
  }

  async getRandomGame(): Promise<Game> {
    const index = Math.floor(Math.random()*this.games.length);
    const game: Game = await new Promise((resolve) => {
      setTimeout(() =>{
        resolve(this.games[index])
      }, 100)
    });
    if(!game?.GameLink) {
      return game;
    }
    const request = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${game.GameLink.split('/').slice(-1)[0]}&prop=images&imlimit=20&origin=*&format=json&formatversion=2`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${this.token}`}
      }
    );
    const wiki = await request.json();
    console.log(wiki);
    const images = wiki.query?.pages?.[0].images ?? []
    let filename: string | undefined = undefined;
    for(let image of images) {
      const p = image?.title.replaceAll(' ', '_')
      console.log(p)
      if(![
        "File:Disambig_gray.svg",
        "File:EC1835_C_cut.jpg",
        "File:OOjs_UI_icon_edit-ltr-progressive.svg",
        "File:Star_empty.svg",
        "File:Star_full.svg",
        "File:Star_half.svg",
        "File:Symbol_category_class.svg",
        "File:Pending-protection-shackle.svg",
        "File:Wiktionary-logo-en-v2.svg",
        "File:Basketball_Clipart.svg",
        "File:Crystal_Clear_app_kedit.svg",
        "File:Question_book-new.svg",
        "File:Ambox_important.svg",
        "File:Rubik's_cube_v3.svg",
        ]
        .includes(p) && !p.includes("File:Flag") &&  !p.includes("File:Symbol")) {
        filename = p
        break;
      }      
    }
    // let filename = images?.[0].title.replaceAll(' ', '_');
    // console.log(filename)
    if(filename) {
      const requestImage = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${filename}&prop=imageinfo&iiprop=url&origin=*&format=json&formatversion=2`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${this.token}`}
        }
      )
      const wikiImage = await requestImage.json();
      console.log(wikiImage.query.pages?.[0].imageinfo[0].url)
      game.Image = wikiImage.query.pages?.[0].imageinfo[0].url
      console.log(game);
      // await fetch(
      //   "https://en.wikipedia.org/w/api.php?action=query&titles=San_Francisco&prop=images&imlimit=20&origin=*&format=json&formatversion=2",
      //   {
      //     method: "GET"
      //   }
      // )
    }
    return game;
  }

  async rollGenre() {
    this.genreCat = this.getRandomGenreCat()
    this.genre = this.getRandomGenreSub(this.genreCat)    
  }
  async rollGame() {
    this.game = await this.getRandomGame()
  }
  async roll() {
    this.clear()
    this.rollGenre()
    this.rollGame()
  }

}
