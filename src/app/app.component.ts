import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VgmRouletteComponent } from "./vgm-roulette/vgm-roulette.component";
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatListModule } from "@angular/material/list"
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, VgmRouletteComponent, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vgm-roulette';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  constructor(
    // public navigation: NavigationService,
    private breakpointObserver: BreakpointObserver,
    // public authService: AuthService,
    // public userService: UserService,
    // private router: Router,
    // private location: Location,
    // private matIconRegistry: MatIconRegistry,
    // private domSanitizer: DomSanitizer,
    // private http: HttpClient,
    // private formBuilder: UntypedFormBuilder,
    // public dialog: MatDialog,
    // private route: ActivatedRoute
    ) {

    }
}
