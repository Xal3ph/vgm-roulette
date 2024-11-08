import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsGenreComponent } from './options-genre.component';

describe('OptionsGenreComponent', () => {
  let component: OptionsGenreComponent;
  let fixture: ComponentFixture<OptionsGenreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsGenreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
