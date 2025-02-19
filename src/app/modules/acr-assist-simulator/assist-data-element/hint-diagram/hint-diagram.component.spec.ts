import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HintDiagramComponent } from './hint-diagram.component';
import { CarouselComponent } from 'ngx-bootstrap/carousel/carousel.component';
import { SlideComponent } from 'ngx-bootstrap/carousel/slide.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel/carousel.config';

describe('HintDiagramComponent', () => {
  let component: HintDiagramComponent;
  let fixture: ComponentFixture<HintDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HintDiagramComponent, CarouselComponent, SlideComponent ],
      providers: [CarouselConfig]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
