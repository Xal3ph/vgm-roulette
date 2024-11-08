import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, model, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { OptionsGenreComponent } from "./options-genre/options-genre.component";
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { GenreService } from '../genre/genre.service';
import { OptionsConsoleComponent } from "./options-console/options-console.component";

export interface Selectable {
  name: string;
  checked: boolean;
  show?: boolean;
  children?: Selectable[];
}

@Component({
  selector: 'options-drawer',
  templateUrl: './options-drawer.component.html',
  styleUrl: './options-drawer.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, OptionsGenreComponent, MatExpansionModule, OptionsConsoleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsDrawerComponent {
  accordion = viewChild.required(MatAccordion);
  consoleTotal = ""
  genreTotal = ""

  constructor(private genreService: GenreService) {

  }
}

