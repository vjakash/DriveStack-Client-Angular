import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmodalComponent } from './newmodal.component';

describe('NewmodalComponent', () => {
  let component: NewmodalComponent;
  let fixture: ComponentFixture<NewmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
