import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, model, Output, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GenreService } from '../../genre/genre.service';
import { GameService } from '../../game/game.service';
import genresCat from '../../../assets/data/genres-categorized.json'
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

export interface Selectable {
  name: string;
  checked: boolean;
  show?: boolean;
  children?: Selectable[];
}

@Component({
  selector: 'options-genre',
  templateUrl: './options-genre.component.html',
  styleUrl: './options-genre.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
],
})
export class OptionsGenreComponent {
  @Output() genreTotalChange:EventEmitter<any> = new EventEmitter<any>();

  genres: Selectable[] = []
  get genreCount() {
    let _return = 0;
    if(this.genreService.parentFilter.value.length === 0) {
      _return = this.genreTotal
    } else {
      _return = this.genres.map(g=>(g.children?.filter(c=>c.checked) ?? []).length).reduce((prev, curr, i, arr) => {return prev + curr}, 0)
    }
    return _return
  };
  genreTotal = Object.values(genresCat).flat().length

  constructor(private genreService: GenreService) {}

  ngOnInit(): void {
    this.genres = []
    Object.entries(genresCat).forEach(([key, value])=>{
      var p: Selectable = {
        name: key,
        checked: false,
        show: false,
        children: value.map((cv: string)=>{return {name: cv, checked: false}})
      }
      this.genres.push(p)
    })
    this.genreTotalChange.emit(`${this.genreCount} / ${this.genreTotal}`)

    this.genreService.childFilter$.subscribe(() => {
      this.loadGenre([...this.genreService.parentFilter.value, ...this.genreService.childFilter.value])
    })
  }

  loadGenre(filter: string[]) {
    this.genres.forEach(g => {
      g.checked = filter.includes(g.name)
      g.children?.forEach(c => {
        c.checked = filter.includes(c.name)
      })
    })
    console.log(this.genres)
    this.genreTotalChange.emit(`${this.genreCount} / ${this.genreTotal}`)
  }

  partiallyCompleteGenre(genre: Selectable): boolean {
    if (!genre.children) {
      return false;
    }
    return genre.children.some(t => t.checked) && !genre.children.every(t => t.checked);
  };

  updateGenre(genre: Selectable, checked: boolean, index?: number) {
    genre.checked = checked
    genre.children?.forEach(c => c.checked = checked)
    this.genres.forEach(g => {
      if(g.children?.some(c => c.name === genre.name) && g.children?.some(c => c.checked)) {
        g.checked = true
      }
    })
    this.genreService.parentFilter.next(this.genres.filter(g=>g.checked).map(g=>g.name))
    this.genreService.childFilter.next(this.genres.filter(g=>g.checked).map(g=>g.children?.filter(c=>c.checked).map(c=>c.name) ?? []).flat())

    this.genreTotalChange.emit(`${this.genreCount} / ${this.genreTotal}`)

  }

  countCheckedChildren(s: Selectable) {
    if(this.genreService.parentFilter.value.length === 0) {
      return (s.children ?? []).length
    }
    return (s.children?.filter(s=>s.checked) ?? []).length
  }



}

