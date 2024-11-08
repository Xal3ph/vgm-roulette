import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsConsoleComponent } from './options-console.component';

describe('OptionsConsoleComponent', () => {
  let component: OptionsConsoleComponent;
  let fixture: ComponentFixture<OptionsConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
