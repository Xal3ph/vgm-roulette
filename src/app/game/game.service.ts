import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { binaryToUrlSafe } from "../utils/convert";
import { Game } from "./game";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";
// https://github.com/Elbriga14/EveryVideoGameEver



@Injectable({
  providedIn: 'root'
})
export class GameService {
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNzU1ZWQzZDFjOWE1MmM3NWZiOGYwYWZhYTZiYjcxMSIsImp0aSI6ImYyN2MyZjkxNjY0ZGY4ZWIwYjNjNzFlODgxMGJhOTg5NzRkMTY0ZDIyNDI0OGI4Njg1ZDI3YmI2MmJiMTIwYmNhMjY1ZDI4YTkwYjJmZjlhIiwiaWF0IjoxNzI2Njg0MDE4LjYyMzM5MSwibmJmIjoxNzI2Njg0MDE4LjYyMzM5NSwiZXhwIjozMzI4MzU5MjgxOC42MjA1ODMsInN1YiI6IjE1NDEyNjQiLCJpc3MiOiJodHRwczovL21ldGEud2lraW1lZGlhLm9yZyIsInJhdGVsaW1pdCI6eyJyZXF1ZXN0c19wZXJfdW5pdCI6NTAwMCwidW5pdCI6IkhPVVIifSwic2NvcGVzIjpbImJhc2ljIl19.jx3-nWrMZP3Q5N6dKnYExfIgo5uKC1-GNNQ16--nnKdpEWdpvTjGhJwOCf4uJKdYGueStRIKzilUdCEQGzPin9_MPvmMjJS5Z16C078P9ybnJ80XsRn-BljA6gWV_5Vr_UNMdptromH_hsW8v0p2RAdZlc20mL_p9lgsUGni0_Q9NgPKew35fD7xeAfzkR0-cLQf2BOSviRUaRnIg8QCfnZcliFGL6Alzo04X8-f_88-ZRpBXBysPywjSAx4sTYQWMsySW4ZwGIXWYOt2HfZ3VtuADtx6TD6GhPMGHD8kM8l7b5LOQPL5q4y2AiWWDpKce3b_6gR7eOBt52F6bKKM1gvl6xL8cJNnJ4-kpw6kjWd3amY5aG2XBOglwKx96TUhE-Glvu37ex3hjKnd5dPNNfaboPcQwyjnYrOo8eYP51QxJ75WqFDOArAx5bpdWtsms-nMV2LqfbhiNoWNaQlmbDpw9gJJvetlD9Kn41xVcNAj0dGDzWLwce_XgfG-V9m5Llm8fHM60SxzoiFJ5KhthDk-BhJV68VrIgQowr2C3EfT78UHT1wvTGpl3jnrWI3VihSuHYTZV6bqbsYokPPOKOQJHeKmOykFyEgbWp1JnHDgmw6IsPNzIbwD7cgaE-7T3WaDimByImOua4GpeGWNfROM02ey1OBiwuYjsLwAnU"
  hash: string = ""

  games = new BehaviorSubject<Game[]>([])
  games$ = this.games.asObservable()
  
  platformTypes: string[] = [];
  filteredGames: Game[] = [];

  selectedPlatforms = new BehaviorSubject<string[]>([])
  selectedPlatforms$ = this.selectedPlatforms.asObservable();

  constructor(private http: HttpClient) {
    this.loadGames()
  }

  loadGames() {
    this.games$.subscribe(games => {
      this.platformTypes = [... new Set(games.map(g=>this.platformName(g.Platform)))].sort()
    })
    const endpoints = [
      "GamecubeGames",
      "GBAGames",
      "N64Games",
      "NESGames",
      "PS1Games",
      "PS2Games",
      "PS3Games",
      "PS4Games",
      "SegaGenesisGames",
      "SNESGames",
      // "SteamGames",
      "SwitchGames",
      "WiiGames",
      "WiiUGames",
      "WindowsGames",
      "XBOXGames",
      "XBOX360Games",
      "XboxOneGames",

      // batch 2
      "AppleIIGames",
      "PC88Games",
      "PC98Games",
      "SegaSaturnGames",
      "GameGearGames",
      "GBCGames",
      "GBGames",
      "DreamcastGames",
      "DSGames",
      "DOSGames",
    ].map(
      (item) => `./assets/data/${item}.json`
    );

    forkJoin(endpoints.map((url) => this.http.get(url))).subscribe((data) => {
      this.games.next((data.flat() as Game[]).filter(x => x.GameLink != undefined))
    });
  }

  async getImagesFromWikipedia(titles: string) {
    const request = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${titles}&prop=images&imlimit=20&origin=*&format=json&formatversion=2&redirects`,
      {
        method: "GET",
        headers: { 'Authorization': `Bearer ${this.token}`}
      }
    );
    const wiki = await request.json();
    return wiki
  }

  async getImageFromWikipedia(wikiUrl: string) {
    let wiki = await this.getImagesFromWikipedia(wikiUrl.split('/').slice(-1)[0])
    let images = wiki.query?.pages?.[0].images ?? []
    const redirect = wiki.query?.redirects?.[0].to;
    if(images.length == 0 && redirect) {
      wiki = this.getImagesFromWikipedia(redirect)
      images = wiki.query?.pages?.[0].images ?? []
    }
    let filename: string | undefined = undefined;
    for(let image of images) {
      const p = image?.title.replaceAll(' ', '_')
      if(!["File:EC1835_C_cut.jpg", "File:Blue_iPod_Nano.jpg"].includes(p)
        && !p.includes("File:Flag")
        && !p.includes("File:Symbol")
        && this.endsWithAny(p, [".png", ".webp", ".jpg", ".jpeg", ".bmp", ".avif"])) {
          filename = p
          break;
      }      
    }
    if(filename) {
      const requestImage = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${filename}&prop=imageinfo&imlimit=50&iiprop=url&origin=*&format=json&formatversion=2`,
        {
          method: "GET",
          headers: { 'Authorization': `Bearer ${this.token}`}
        }
      )
      const wikiImage = await requestImage.json();
      return wikiImage.query.pages?.[0].imageinfo[0].url
    }
    return;
  }

  async getRandomGame(): Promise<Game> {
    const index = Math.floor(Math.random()*this.filteredGames.length);
    const game: Game = this.filteredGames[index]
    if(!game?.GameLink) { return game; }
    game.Image = await this.getImageFromWikipedia(game.GameLink)
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

  endsWithAny(str: string, suffixes: string[]) {
    for (let suffix of suffixes) {
      if (str.endsWith(suffix)) {
        return true;
      }
    }
    return false;
  }

  platformName(platform: String) {
    return platform.replace(/ *\([^)]*\) */g, "").replace('the ', '').trim();
  }

  get saveCode() {
    const str = binaryToUrlSafe(this.platformTypes.map(g => this.selectedPlatforms.value.includes(g) ? '1':'0').join(''))
    return `g=${str}`
  }

  loadSaveCode(platforms: string) {
    this.selectedPlatforms.next([])
    while(platforms.length < this.platformTypes.length) {
      platforms = "0" + platforms
    }
    for (let i = 0; i < platforms.length; ++i) {
      if (platforms.charAt(i) == "1") {
        this.selectedPlatforms.next([...this.selectedPlatforms.value, this.platformTypes[i]])
      }
    }
  }

}
