import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInComponent ]
    })
    // Inject the AuthService to be used in this component
    .compileComponents();
    // Inject the AngularFireAuth to be used in this component
  });
    // Inject the Router to be used in this component

  beforeEach(() => {
    // Listen for changes in authentication state
    fixture = TestBed.createComponent(SignInComponent);
      // If the user is logged in, navigate to the notes page
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
        // If the user is not logged in, do nothing

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
