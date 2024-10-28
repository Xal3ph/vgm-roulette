import { Injectable } from "@angular/core";
import genresCat from '../../assets/data/genres-categorized.json'
import { Genre } from "./genre";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  getRandomGenreSub(key: string): string {
    const gc = genresCat as {[key: string]: string[]}
    return gc[key][Math.floor(Math.random()*gc[key].length)];
  }

  getRandomGenreCat(): string {
    delete (genresCat as any)['Comedy'];
    const keys = Object.keys(genresCat);
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
