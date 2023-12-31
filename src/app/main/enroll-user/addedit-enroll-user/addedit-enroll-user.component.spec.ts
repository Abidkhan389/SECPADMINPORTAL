import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditEnrollUserComponent } from './addedit-enroll-user.component';

describe('AddeditEnrollUserComponent', () => {
  let component: AddeditEnrollUserComponent;
  let fixture: ComponentFixture<AddeditEnrollUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddeditEnrollUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditEnrollUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
