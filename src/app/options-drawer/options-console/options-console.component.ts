import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { GameService } from '../../game/game.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'options-console',
  standalone: true,
  imports: [
    CommonModule, MatChipsModule, MatIconModule
  ],
  templateUrl: './options-console.component.html',
  styleUrl: './options-console.component.scss'
})
export class OptionsConsoleComponent implements OnInit {
  @Output() consoleTotalChange:EventEmitter<any> = new EventEmitter<any>();
  games = this.gameService.games
  showGames = false
  // filteredGames: Game[] = [];

  get filteredGames() {
    return this.gameService.filteredGames;
  }

  set filteredGames(filteredGames) {
    this.gameService.filteredGames = filteredGames
  }
  
  // Available console types
  // platformTypes = ['NES', 'GBA', 'Sega Genesis', 'SNES', 'GameCube', 'PS1'];
  // platformTypes = [... new Set(this.gameService.games.map(g=>this.platformName(g.Platform)))].sort();
  platformTypes = this.gameService.platformTypes
  
  // Selected filters
  
  get selectedPlatforms() {
    return this.gameService.selectedPlatforms.value;
  }

  set selectedPlatforms(selectedPlatforms) {
    this.gameService.selectedPlatforms.next(selectedPlatforms);
  }

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.games = this.gameService.games; // Load games from the service
    // this.filteredGames = this.games; // Start with all games displayed
    this.consoleTotalChange.emit(`${this.filteredGames.length} / ${this.games.value.length}`)
    this.gameService.games$.subscribe(() => {
      this.platformTypes = this.gameService.platformTypes
      this.applyFilter()
    })
    this.gameService.selectedPlatforms$.subscribe(()=>{
      this.applyFilter();
    })
  }

  toggleConsole(platform: string): void {
    // Add or remove platform from selected filters
    const index = this.selectedPlatforms.indexOf(platform);
    if (index >= 0) {
      this.selectedPlatforms.splice(index, 1);
    } else {
      this.selectedPlatforms.push(platform);
    }

    // Apply the filter
    this.applyFilter();
  }

  applyFilter(): void {
    // Filter games by selected consoles
    if (this.selectedPlatforms.length === 0) {
      this.filteredGames = this.games.value; // No filter, show all games
    } else {
      this.filteredGames = this.games.value.filter(game => 
        this.selectedPlatforms.some(platform => this.platformName(game.Platform).replace(/ *\([^)]*\) */g, "") === platform?.replace(/ *\([^)]*\) */g, ""))
      );
    }
    this.consoleTotalChange.emit(`${this.filteredGames.length} / ${this.games.value.length}`)
  }

  platformName(platform: String) {
    return platform.replace(/ *\([^)]*\) */g, "").replace('the ', '').trim();
  }
}