import { TestBed } from '@angular/core/testing';

import { NxWelcomeComponent } from './nx-welcome.component';

describe('NxWelcomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NxWelcomeComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(NxWelcomeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(NxWelcomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome seed');
  });
});
