import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Game } from './game';
import { GameService } from './game.service';

@Component({
  selector: 'game-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, FontAwesomeModule, FlexLayoutModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  @Input("game")
  game: Game = {
    Dev: "",
    DevLink: "",
    Game: "",
    GameLink: "",
    Image: "", 
    Platform: "",
    PlatformLink: "",
    Publisher: "",
    PublisherLink: "",
    Year: ""
  }

  public constructor(private gameService: GameService){}

  async roll(event: any) {
    event.stopPropagation();
    this.game = await this.gameService.getRandomGame()
  }

  get consoleImage() {
    let consoleImage = './assets/images/consoles/' + this.consoleName.toLowerCase().replace(' (megadrive)', '').replace('the ', '').replaceAll(' ', '') + '.png';
    return consoleImage
  }

  get consoleName() {
    return this.game.Platform.replace(/ *\([^)]*\) */g, "").replace('the ', '');
  }
}
