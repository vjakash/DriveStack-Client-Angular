import { TestBed } from '@angular/core/testing';

import { ServerservService } from './serverserv.service';

describe('ServerservService', () => {
  let service: ServerservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
