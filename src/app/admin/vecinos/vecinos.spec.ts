import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vecinos } from './vecinos';

describe('Vecinos', () => {
  let component: Vecinos;
  let fixture: ComponentFixture<Vecinos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vecinos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vecinos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
