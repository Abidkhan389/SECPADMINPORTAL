import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCategorieComponent } from './add-edit-categorie.component';

describe('AddEditCategorieComponent', () => {
  let component: AddEditCategorieComponent;
  let fixture: ComponentFixture<AddEditCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCategorieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
