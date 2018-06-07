import { Component, Input, Output, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { TemplateManagerService } from '../shared/services/template-manager.service';
import { OnChanges, AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {Template} from '../../core/models/template.model';
import { ImageElements } from '../../core/elements/models/image-elements.model';
import { MainReportText, FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { Diagram } from '../../core/models/diagram.model';
import { BaseDataElement } from '../../core/elements/models/base-data-element.model';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';
const $ = require('jquery');
declare var init_keyImagesUI: any;

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css', '../styles.css']
})
export class AcrAssistSimulatorComponent implements  OnChanges, AfterContentInit {
  @Input() templateContent: string;
  @Input() imagePath: string;
  @Input() showKeyDiagram: boolean;
  @Input() reportTextPosition: ReportTextPosition;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  @Output() returnExecutionHistory: EventEmitter<FinalExecutedHistory> = new EventEmitter<FinalExecutedHistory>();
  @Output() returnDefaultElements = new EventEmitter();
  @ViewChild('imageUpload') imageUpload: any;
  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: Diagram[];
  resultText: MainReportText;
  isReset: boolean;
  dataElements: BaseDataElement[];
  position =  ReportTextPosition;

  constructor(private templateManagerService: TemplateManagerService , private simulatorEngineService: SimulatorEngineService) {
    }

  ngAfterContentInit(): void {
    this.reloadUI();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isReset = true;
    this.isEmptyContent =   this.templateContent === undefined || this.templateContent.length === 0 && this.inputValues.length === 0 &&
    this.inputData === undefined ;
    if (this.isEmptyContent) {
      return;
    }
    if (this.inputData !== undefined) {
      if (this.inputData.length > 0) {
        this.inputValues = JSON.parse(this.inputData);
      }
    }
    if (this.imageUpload !== undefined) {
      this.imageUpload.nativeElement.value = '';
    }

    try {
      this.template =  this.templateManagerService.getTemplate(this.templateContent);
      this.simulatorEngineService.initialize(this.template);
      if (this.inputValues.length !== 0) {
        for (const dataeElement of this.template.dataElements) {
          const inputValue = this.inputValues.filter( x => x.dataElementId === dataeElement.id);
          if (inputValue !== undefined && inputValue.length > 0 ) {
            dataeElement.currentValue = inputValue[0].dataElementValue;
          }
        }
      }
      this.dataElements = this.template.dataElements;
      this.keyDiagrams = new Array<Diagram>();

      for (let index = 0; index < this.template.metadata.diagrams.length; index++) {
          const element = new Diagram();
          element.label = this.template.metadata.diagrams[index].label;
          element.location = this.imagePath + '/' + this.template.metadata.diagrams[index].location;
          element.keyDiagram = this.template.metadata.diagrams[index].keyDiagram;
          this.keyDiagrams.push(element);
      }
    } catch (error) {
      this.template = undefined;
    }

    this.resultText = undefined;
  }
  resetElements() {
    this.template =  this.templateManagerService.getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);

    this.dataElements = this.template.dataElements;
    this.resultText = undefined;
    this.returnDefaultElements.emit();
  }


  recieveReportText (textReport: MainReportText) {
    this.resultText = textReport;
  }

  recievedExecutionHistory (finalExecutionHistory: FinalExecutedHistory) {
       this.returnExecutionHistory.emit(finalExecutionHistory);
  }

  changeListener(event): void {
    this.keyDiagrams = new Array<Diagram>();
    for (const image in event.target.files) {
      if (event.target.files.hasOwnProperty(image)) {
        const reader = new FileReader();
        const diagram = new Diagram();
        diagram.label = event.target.files[image].name;
        diagram.keyDiagram = image === '0' ? true : false;
        const imageType = event.target.files[image].imageType;
        const fileStream = event.target.files[image];

        reader.onload = (event1: any) => {
          diagram.location = reader.result;
        };

        reader.readAsDataURL(event.target.files[image]);

        reader.onloadend = (event1: any) => {
          this.keyDiagrams.push(diagram);
          this.reloadUI();
        };
      }
    }
  }

  collapseKeyDiagram() {
    if ($('#icon_keydiagram').hasClass('fa fa-minus')) {
      $('#icon_keydiagram').removeClass('fa fa-minus');
      $('#icon_keydiagram').addClass('fa fa-plus');
      $('#body_keydiagram').css({
        'display': 'none'
      });
    } else {
      $('#icon_keydiagram').removeClass('fa fa-plus');
      $('#icon_keydiagram').addClass('fa fa-minus');
      $('#body_keydiagram').removeAttr('style');
    }
  }

  collapseReportText() {
    if ($('#icon_reporttext').hasClass('fa fa-minus')) {
      $('#icon_reporttext').removeClass('fa fa-minus');
      $('#icon_reporttext').addClass('fa fa-plus');
      $('#body_reporttext').css({
        'display': 'none'
      });
    } else {
      $('#icon_reporttext').removeClass('fa fa-plus');
      $('#icon_reporttext').addClass('fa fa-minus');
      $('#body_reporttext').removeAttr('style');
    }
  }

  reloadUI() {
    setTimeout(_ => {
      init_keyImagesUI();
    });
  }
}
