import { Injectable } from "@angular/core";
import genresCat from '../../assets/data/genres-categorized.json'
import { Genre } from "./genre";
import { binaryStringToHex, binaryToUrlSafe, binaryToCharArray } from "../utils/convert";

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

  get saveCode() {
    // return this.parentFilter.map(p=>"p:"+p.substring(0,2)).join(',')
    const parentString = binaryToUrlSafe(Object.keys(genresCat).map(g => this.parentFilter.includes(g) ? '1':'0').join(''))
    // const childrenString = binaryToUrlSafe(Object.values(genresCat).flat().map(g => this.childFilter.includes(g) ? '1':'0').join(''))
    // const childrenString = binaryStringToHex(Object.values(genresCat).flat().map(g => this.childFilter.includes(g) ? '1':'0').join(''))
    const childrenString = binaryToCharArray(Object.values(genresCat).flat().map(g => this.childFilter.includes(g) ? '1':'0').join(''))
    // const childrenString = ""
    // console.log(Object.values(genresCat).flat().map(g => this.childFilter.includes(g) ? '1':'0').join(''))
    return `p=${parentString}&c=${childrenString}`
  }

  loadSaveCode(parent: string, children: string[]){
    this.parentFilter = []
    while(parent.length < Object.keys(genresCat).length) {
      parent = "0" + parent
    }
    for (let i = 0; i < parent.length; ++i) {
      if (parent.charAt(i) == "1") {
        this.parentFilter.push(Object.keys(genresCat)[i])
      }
    }
    console.log(this.parentFilter)

    this.childFilter = []
    for (let i = 0; i < children.length; ++i) {
      while(children[i].length < 36) {
        children[i] = "0" + children[i]
      }
      for (let j = 0; j < children[i].length; ++j) {
        if (children[i].charAt(j) == "1") {
          this.childFilter.push(Object.values(genresCat).flat()[i*36+j])
        }
      }
    }
    console.log(this.childFilter)
  }

}
