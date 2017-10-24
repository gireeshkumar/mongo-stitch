import { TestBed, inject } from '@angular/core/testing';

import { StitchDBService } from './stitch-db.service';

describe('StitchDBService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StitchDBService]
    });
  });

  it('should be created', inject([StitchDBService], (service: StitchDBService) => {
    expect(service).toBeTruthy();
  }));
});
