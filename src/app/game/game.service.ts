import { Injectable } from "@angular/core";
import { Game } from "./game";
// https://github.com/Elbriga14/EveryVideoGameEver
import NESGames from '../../assets/data/NESGames.json'
import GBAGames from '../../assets/data/GBAGames.json'
import SegaGenesisGames from '../../assets/data/SegaGenesisGames.json'
import SNESGames from '../../assets/data/SNESGames.json'
import GamecubeGames from '../../assets/data/GamecubeGames.json'
import PS1Games from '../../assets/data/PS1Games.json'

@Injectable({
  providedIn: 'root'
})
export class GameService {
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNzU1ZWQzZDFjOWE1MmM3NWZiOGYwYWZhYTZiYjcxMSIsImp0aSI6ImYyN2MyZjkxNjY0ZGY4ZWIwYjNjNzFlODgxMGJhOTg5NzRkMTY0ZDIyNDI0OGI4Njg1ZDI3YmI2MmJiMTIwYmNhMjY1ZDI4YTkwYjJmZjlhIiwiaWF0IjoxNzI2Njg0MDE4LjYyMzM5MSwibmJmIjoxNzI2Njg0MDE4LjYyMzM5NSwiZXhwIjozMzI4MzU5MjgxOC42MjA1ODMsInN1YiI6IjE1NDEyNjQiLCJpc3MiOiJodHRwczovL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.jx3-nWrMZP3Q5N6dKnYExfIgo5uKC1-GNNQ16--nnKdpEWdpvTjGhJwOCf4uJKdYGueStRIKzilUdCEQGzPin9_MPvmMjJS5Z16C078P9ybnJ80XsRn-BljA6gWV_5Vr_UNMdptromH_hsW8v0p2RAdZlc20mL_p9lgsUGni0_Q9NgPKew35fD7xeAfzkR0-cLQf2BOSviRUaRnIg8QCfnZcliFGL6Alzo04X8-f_88-ZRpBXBysPywjSAx4sTYQWMsySW4ZwGIXWYOt2HfZ3VtuADtx6TD6GhPMGHD8kM8l7b5LOQPL5q4y2AiWWDpKce3b_6gR7eOBt52F6bKKM1gvl6xL8cJNnJ4-kpw6kjWd3amY5aG2XBOglwKx96TUhE-Glvu37ex3hjKnd5dPNNfaboPcQwyjnYrOo8eYP51QxJ75WqFDOArAx5bpdWtsms-nMV2LqfbhiNoWNaQlmbDpw9gJJvetlD9Kn41xVcNAj0dGDzWLwce_XgfG-V9m5Llm8fHM60SxzoiFJ5KhthDk-BhJV68VrIgQowr2C3EfT78UHT1wvTGpl3jnrWI3VihSuHYTZV6bqbsYokPPOKOQJHeKmOykFyEgbWp1JnHDgmw6IsPNzIbwD7cgaE-7T3WaDimByImOua4GpeGWNfROM02ey1OBiwuYjsLwAnU"

  get games(): Game[] {
    return [...SNESGames, ...NESGames, ...SegaGenesisGames, ...PS1Games, ...GBAGames, ...GamecubeGames].filter(x => x.GameLink != undefined) as any[]
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
    const images = wiki.query?.pages?.[0].images ?? []
    let filename: string | undefined = undefined;
    for(let image of images) {
      const p = image?.title.replaceAll(' ', '_')
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
        "File:Edit-clear.svg",
        "File:Electronic-Arts-Logo.svg",
        "File:Blue_iPod_Nano.jpg",
        "File:Rubik's_cube_v3.svg",
        ]
        .includes(p) && !p.includes("File:Flag") &&  !p.includes("File:Symbol")) {
        filename = p
        break;
      }      
    }
    if(filename) {
      const requestImage = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${filename}&prop=imageinfo&iiprop=url&origin=*&format=json&formatversion=2`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${this.token}`}
        }
      )
      const wikiImage = await requestImage.json();
      game.Image = wikiImage.query.pages?.[0].imageinfo[0].url
    }
    return game;
  }

  async roll(count: number): Promise<Game[]> {
    const games: Game[] = []
    for(let i = 0; i < count; i++) {
      try{
        games.push(await this.getRandomGame())
      }
      catch {
        count++;
        if (count>10){
          break;
        }
      }
    }
    return games
  }

}
