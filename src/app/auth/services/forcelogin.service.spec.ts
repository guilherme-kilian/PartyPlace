import { TestBed } from '@angular/core/testing';

import { ForceloginService } from './forcelogin.service';

describe('ForceloginService', () => {
  let service: ForceloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForceloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
