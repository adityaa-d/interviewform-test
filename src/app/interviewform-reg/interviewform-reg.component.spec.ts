import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewformRegComponent } from './interviewform-reg.component';

describe('InterviewformRegComponent', () => {
  let component: InterviewformRegComponent;
  let fixture: ComponentFixture<InterviewformRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterviewformRegComponent]
    });
    fixture = TestBed.createComponent(InterviewformRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
