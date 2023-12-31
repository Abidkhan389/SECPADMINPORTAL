import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditcoursesComponent } from './addeditcourses.component';

describe('AddeditcoursesComponent', () => {
  let component: AddeditcoursesComponent;
  let fixture: ComponentFixture<AddeditcoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeditcoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
