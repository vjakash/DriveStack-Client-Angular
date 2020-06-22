import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindisplayComponent } from './maindisplay.component';

describe('MaindisplayComponent', () => {
  let component: MaindisplayComponent;
  let fixture: ComponentFixture<MaindisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaindisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaindisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
