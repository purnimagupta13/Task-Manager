import { TestBed } from '@angular/core/testing';
import { AuthService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should login admin with correct credentials', () => {
    const result = service.login('Purnima@angular.com', 'Purnima@123');
    expect(result).toBeTrue();
  });
});
