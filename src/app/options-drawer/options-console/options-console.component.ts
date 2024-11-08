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
  platformTypes = [... new Set(this.gameService.games.map(g=>g.Platform.replace(/ *\([^)]*\) */g, "")))].sort();
  
  // Selected filters
  
  selectedPlatforms: string[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.games = this.gameService.games; // Load games from the service
    this.filteredGames = this.games; // Start with all games displayed
    this.consoleTotalChange.emit(`${this.filteredGames.length} / ${this.games.length}`)
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
      this.filteredGames = this.games; // No filter, show all games
    } else {
      this.filteredGames = this.games.filter(game => 
        this.selectedPlatforms.some(platform => game.Platform.replace(/ *\([^)]*\) */g, "") === platform.replace(/ *\([^)]*\) */g, ""))
      );
    }
    this.consoleTotalChange.emit(`${this.filteredGames.length} / ${this.games.length}`)
  }

  platformName(platform: String) {
    return platform.replace('the ', '');
  }
}