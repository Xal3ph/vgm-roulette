import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VgmRouletteComponent } from './vgm-roulette.component';

describe('VgmRouletteComponent', () => {
  let component: VgmRouletteComponent;
  let fixture: ComponentFixture<VgmRouletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VgmRouletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VgmRouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
