import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborateTeamsComponent } from './teams.component';

describe('CollaborateTeamsComponent', () => {
  let component: CollaborateTeamsComponent;
  let fixture: ComponentFixture<CollaborateTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaborateTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaborateTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
