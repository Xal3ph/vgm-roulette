import { Injectable } from "@angular/core";
import genresCat from '../../assets/data/genres-categorized.json'
import { Genre } from "./genre";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  hash: string = ""

  parentFilter:string[] = []
  childFilter: string[] = []
  public where = ([key, value]: [string, string[]]) => this.parentFilter.includes(key) || this.parentFilter.length === 0
  public whereChildren = (c: string) => this.childFilter.includes(c) || this.parentFilter.length === 0

  get genres() {
    return Object.fromEntries(Object.entries(genresCat).filter(this.where))
  }

  getRandomGenreSub(key: string): string {
    const gc = this.genres as {[key: string]: string[]}
    var gcFiltered = gc[key].filter(this.whereChildren) ?? []
    return (gcFiltered)[Math.floor(Math.random()*gcFiltered.length)];
  }

  getRandomGenreCat(): string {
    // delete (this.genres as any)['Comedy'];
    const keys = Object.keys(this.genres);
    const index = Math.floor(Math.random()*keys.length);
    return keys[index];
  }

  getRandomGenre(): Genre {
    const category = this.getRandomGenreCat()
    const name = this.getRandomGenreSub(category)
    return {category, name}
  }

  roll(count: number): Genre[] {
    const genres: Genre[] = []
    for(let i = 0; i < count; i++) {
      genres.push(this.getRandomGenre())
    }
    return genres
  }

}
