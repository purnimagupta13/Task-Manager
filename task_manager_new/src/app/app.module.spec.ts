import { TestBed } from '@angular/core/testing';
import { AppModule } from './app-module';

describe('AppModule', () => {
  it('should compile AppModule', async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();

    const moduleInstance = TestBed.inject(AppModule);
    expect(moduleInstance).toBeTruthy();
  });
});
