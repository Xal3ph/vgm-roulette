import { Injectable } from "@angular/core";
import genresCat from '../../assets/data/genres-categorized.json'
import { Genre } from "./genre";
import { binaryStringToHex, binaryToUrlSafe, binaryToCharArray } from "../utils/convert";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  parentFilter = new BehaviorSubject<string[]>([])
  parentFilter$ = this.parentFilter.asObservable();

  childFilter = new BehaviorSubject<string[]>([])
  childFilter$ = this.childFilter.asObservable();


  public where = ([key, value]: [string, string[]]) => this.parentFilter.value.includes(key) || this.parentFilter.value.length === 0
  public whereChildren = (c: string) => this.childFilter.value.includes(c) || this.parentFilter.value.length === 0

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

  get saveCode() {
    const parentString = binaryToUrlSafe(Object.keys(genresCat).map(g => this.parentFilter.value.includes(g) ? '1':'0').join(''))
    const childrenString = binaryToCharArray(Object.values(genresCat).flat().map(g => this.childFilter.value.includes(g) ? '1':'0').join(''))
    return `p=${parentString}&c=${childrenString}`
  }

  loadSaveCode(parent: string, children: string[]){
    this.parentFilter.next([])
    while(parent.length < Object.keys(genresCat).length) {
      parent = "0" + parent
    }
    for (let i = 0; i < parent.length; ++i) {
      if (parent.charAt(i) == "1") {
        this.parentFilter.next([...this.parentFilter.value, Object.keys(genresCat)[i]])
      }
    }

    this.childFilter.next([])
    for (let i = 0; i < children.length; ++i) {
      while(children[i].length < 36) {
        children[i] = "0" + children[i]
      }
      for (let j = 0; j < children[i].length; ++j) {
        if (children[i].charAt(j) == "1") {
          this.childFilter.next([...this.childFilter.value, Object.values(genresCat).flat()[i*36+j]])
        }
      }
    }
  }

}
