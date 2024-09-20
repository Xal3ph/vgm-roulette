import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Genre } from './genre';
import { GenreService } from './genre.service';

@Component({
  selector: 'genre-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FontAwesomeModule, FlexLayoutModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {
  @Input("genre")
  genre: Genre = {
    category: "",
    name: ""
  }

  get link() {
    return 'https://en.wikipedia.org/w/index.php?search='+this.genre.name.split(' ').join('+')
  }

  public constructor(private genreService: GenreService) {}

  getImage() {
    return `./assets/images/genres/${this.genre.category.replaceAll(' ', '_').replaceAll('&','').toLowerCase()}.jpg`
  }

  goToLink() {
    window.open(this.link, "_blank");
  }

  roll(event: any) {
    event.stopPropagation();
    this.genre = this.genreService.getRandomGenre()
  }

}
