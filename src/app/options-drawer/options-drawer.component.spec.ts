import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsDrawerComponent } from './options-drawer.component';

describe('OptionsDrawerComponent', () => {
  let component: OptionsDrawerComponent;
  let fixture: ComponentFixture<OptionsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
