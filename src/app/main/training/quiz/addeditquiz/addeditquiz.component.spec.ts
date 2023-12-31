import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditquizComponent } from './addeditquiz.component';

describe('AddeditquizComponent', () => {
  let component: AddeditquizComponent;
  let fixture: ComponentFixture<AddeditquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeditquizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
