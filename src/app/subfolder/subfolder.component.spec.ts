import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubfolderComponent } from './subfolder.component';

describe('SubfolderComponent', () => {
  let component: SubfolderComponent;
  let fixture: ComponentFixture<SubfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
