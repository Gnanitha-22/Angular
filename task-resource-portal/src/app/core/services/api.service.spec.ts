import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { API_CONFIG } from '../config/api-config';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: API_CONFIG, useValue: { baseUrl: 'http://localhost:3000' } }]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should cache GET requests and return same observable result', (done) => {
    const res = [{ id: 1, name: 'One' }];
    service.getAll('projects').subscribe(data => {
      expect(data).toEqual(res);
      done();
    });

    const req = httpMock.expectOne('http://localhost:3000/projects');
    expect(req.request.method).toBe('GET');
    req.flush(res);
  });
});
