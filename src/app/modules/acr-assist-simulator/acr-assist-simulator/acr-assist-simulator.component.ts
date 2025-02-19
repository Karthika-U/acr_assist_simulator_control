import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FinalExecutedHistory } from '../assist-data-element/assist-data-element.component';
import { SimulatorEngineService } from '../../core/services/simulator-engine.service';
import { InputData } from '../../core/models/input-data.model';
import { ReportTextPosition } from '../../core/models/report-text.model';
import { ChoiceDataElement, BaseDataElement, Template, Diagram, MainReportText } from 'testruleengine/Library/Models/Class';
import { SubscriptionLike as ISubscription, Subject } from 'rxjs';
import { UtilityService } from '../../core/services/utility.service';
import { ChoiceElementDisplayEnum } from '../../core/models/choice-element-display.enum';
import { getTemplate } from 'testruleengine/Library/Utilities/TemplateManager';
import { AIInputData } from '../../core/models/ai-input-data.model';
import { ToastrService } from 'ngx-toastr';
import { ChoiceControlStyle } from '../../core/models/choice-control-style.model';

const $ = require('jquery');

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './acr-assist-simulator.component.html',
  styleUrls: ['./acr-assist-simulator.component.css', '../styles.css']
})
export class AcrAssistSimulatorComponent implements OnChanges, OnInit, OnDestroy {

  @Input() hideKeyDiagramTab: boolean;
  template: Template;
  isEmptyContent: boolean;
  keyDiagrams: Diagram[] = [];
  resultText: MainReportText;
  isRequiredFieldIsNotFilled: boolean;
  isReset: boolean;
  dataElements: BaseDataElement[];
  position = ReportTextPosition;
  isInvalidFile: boolean;
  moduleName: string;
  acceptedFileTypes = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'];
  resetValuesSubscription: ISubscription;

  @Input() customizeChoiceControlById: ChoiceControlStyle[];
  @Input() choiceControlStyle: ChoiceElementDisplayEnum;
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  @Input() resetValuesNotifier: Subject<any>;
  @Input() templateContent: string;
  @Input() assetsBaseUrl: string;
  @Input() showKeyDiagram: boolean;
  @Input() hideKeyImageUpload: boolean;
  @Input() reportTextPosition: ReportTextPosition;
  @Input() inputValues: InputData[] = [];
  @Input() inputData: string;
  @Input() showResetButton = true;
  @Input() showReportText = true;
  @Input() fontSize: string;
  @Input() fontFamily: string;
  @Input() fontColor: string;
  @Input() backgroundColor: string;
  @Input() cssClass: string[];
  @Input() choiceElementDisplay: ChoiceElementDisplayEnum;
  @Input() aiInputs: AIInputData[] = [];
  @Input() showTabularReportText = false;
  @Output() returnExecutionHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() returnDataElementChanged: EventEmitter<InputData[]> = new EventEmitter<InputData[]>();
  @Output() returnDefaultElements = new EventEmitter();
  @Output() returnReportText: EventEmitter<MainReportText> = new EventEmitter<MainReportText>();
  @Output() callBackAfterGettingShowKeyDiagram: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('imageUpload') imageUpload: any;
  @ViewChild('simulatorBlock', { read: ElementRef }) private simulatorBlock: ElementRef;

  constructor(
    private simulatorEngineService: SimulatorEngineService,
    private toastr: ToastrService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    if (this.resetValuesNotifier != null) {
      this.resetValuesSubscription = this.resetValuesNotifier.subscribe((event) => {
        this.resetElements();
      });
    }
  }

  ngOnChanges(): void {
    this.isReset = true;
    this.resultText = undefined;
    this.isRequiredFieldIsNotFilled = true;
    this.isEmptyContent = this.templateContent === undefined || this.templateContent.length === 0 && this.inputValues.length === 0 &&
      this.inputData === undefined;

    if (this.isEmptyContent) {
      return;
    }
    if (this.utilityService.isNotEmptyString(this.inputData)) {
      this.inputValues = JSON.parse(this.inputData);
    }
    if (this.utilityService.isValidInstance(this.imageUpload)) {
      this.imageUpload.nativeElement.value = '';
    }

    this.template = getTemplate(this.templateContent);
    if (this.utilityService.isNotEmptyArray(this.inputValues)) {
      this.populateTestCaseData();
    }

    this.simulatorEngineService.initialize(this.template);
    this.dataElements = this.template.dataElements;

    if (this.moduleName !== this.template.metadata.id) {
      this.keyDiagrams = new Array<Diagram>();
    }

    if (!this.keyDiagrams.length) {
      // console.log(this.template.metadata.diagrams);
      this.template.metadata.diagrams.forEach(diag => {
        const element = new Diagram();
        element.label = diag.label;
        element.location = diag.location;
        element.keyDiagram = diag.keyDiagram;
        element.id = diag.id;
        this.keyDiagrams.push(element);
      });
    }

    if (this.utilityService.isNotEmptyArray(this.aiInputs)) {
      const element = this.dataElements.find(x => x.id === this.aiInputs[0].id);
      if (this.utilityService.isValidInstance(element)) {
        element.sources = this.aiInputs;
      }
    }

    const context = this;
    setTimeout(function (e) {
      context.applyInputStyles();
    }, 100);
  }

  setDefaultImage(event, diagram) {
    event.target.src = 'assets/img/default.gif';
    diagram.isError = true;
  }

  imageLoaded(event, diagram) {
    if (event.target.src.includes('/assets/img/default.gif')) {
      diagram.isError = true;
    } else {
      diagram.isError = false;
    }
  }

  ngOnDestroy() {
    if (this.utilityService.isValidInstance(this.resetValuesSubscription)) {
      this.resetValuesSubscription.unsubscribe();
    }
  }

  applyInputStyles() {
    if (this.utilityService.isNotEmptyString(this.fontSize)) {
      this.simulatorBlock.nativeElement.style.fontSize = this.fontSize;
    }

    if (this.utilityService.isNotEmptyString(this.fontColor)) {
      this.simulatorBlock.nativeElement.style.color = this.fontColor;
    }

    if (this.utilityService.isNotEmptyString(this.fontFamily)) {
      this.simulatorBlock.nativeElement.style.fontFamily = this.fontFamily;
    }

    if (this.utilityService.isNotEmptyString(this.backgroundColor)) {
      this.simulatorBlock.nativeElement.style.backgroundColor = this.backgroundColor;
    }

    this.simulatorBlock.nativeElement.className = 'box box-primary box-solid margin-b-0';
    if (this.utilityService.isNotEmptyArray(this.cssClass)) {
      const classes = this.simulatorBlock.nativeElement.className;
      const classesArray = classes.split(' ');
      const classesNeedToApply = new Array<string>();
      classesArray.forEach(classItem => {
        this.cssClass.forEach(css => {
          if (classItem.trim() !== css.trim() && classesNeedToApply.indexOf(css) <= -1) {
            classesNeedToApply.push(css);
          }
        });
      });

      if (this.utilityService.isNotEmptyArray(classesNeedToApply)) {
        classesNeedToApply.forEach(classNeedToApply => {
          const nativeClasses = this.simulatorBlock.nativeElement.className.split(' ');
          if (this.utilityService.isNotEmptyArray(nativeClasses)) {
            if (nativeClasses.indexOf(classNeedToApply) <= -1) {
              this.simulatorBlock.nativeElement.className = this.simulatorBlock.nativeElement.className + ' ' + classNeedToApply;
            }
          } else {
            this.simulatorBlock.nativeElement.className = this.simulatorBlock.nativeElement.className + ' ' + classNeedToApply;
          }
        });
      }
    }
  }

  isValidImageURL(location: string) {
    return this.utilityService.isValidImageURL(location) || this.utilityService.isImageDataUrl(location);
  }

  getImageDataUrl(label: string): string {
    if (this.utilityService.isNotEmptyString(label)) {
      if (this.utilityService.isImageDataUrl(label)) {
        return label;
      } else if (this.utilityService.isValidInstance(this.assetsBaseUrl)) {
        return `${this.assetsBaseUrl}/${label}`;
      }
    }
  }

  diagramExist(diagram: Diagram) {
    return this.keyDiagrams.some(function (el) {
      return el.location === diagram.location;
    });
  }

  resetElements() {
    this.moduleName = this.template.metadata.id;
    this.template = getTemplate(this.templateContent);
    this.simulatorEngineService.initialize(this.template);
    this.dataElements = Object.assign({}, this.template.dataElements);
    this.resultText = undefined;
    this.isRequiredFieldIsNotFilled = true;
    const $this = this;
    setTimeout(function (e) {
      $this.resizeKeyImages();
    }, 100);
    this.returnDefaultElements.emit();
  }

  recieveReportText(textReport: MainReportText) {
    this.resultText = textReport;
    this.isRequiredFieldIsNotFilled = this.utilityService.isValidInstance(textReport) ? textReport.isRequiredFieldIsNotFilled : true;
    this.returnReportText.emit(textReport);

    if (this.utilityService.isValidInstance(this.resultText)) {
      $('#tab1_reportText').prop('checked', true);
    }
  }

  recievedExecutionHistory(finalExecutionHistory: FinalExecutedHistory) {
    this.returnExecutionHistory.emit(finalExecutionHistory);
  }

  recivedOnDataElementChanged(data: InputData[]) {
    this.returnDataElementChanged.emit(data);
  }

  gettingShowKeyDiagram(data: string) {
    this.callBackAfterGettingShowKeyDiagram.emit(data);
    $('[id^=div_keydiagram]').each(function (e) {
      if (data !== undefined && data !== null && data !== '') {
        if ($(this).attr('data-keydiagramId') === data) {
          // tslint:disable-next-line:no-shadowed-variable
          $('[id^=div_keydiagram]').each(function (e) {
            $(this).removeClass('active');
          });
          $(this).addClass('item zoom active');
        }
      }
    });
  }

  changeListener(event): void {
    this.isInvalidFile = false;
    this.keyDiagrams = new Array<Diagram>();
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      const diagram = new Diagram();
      diagram.label = event.target.files[i].name;
      diagram.keyDiagram = i === 0 ? true : false;

      if (!(this.acceptedFileTypes.indexOf(event.target.files[i].type) > -1)) {
        this.isInvalidFile = true;
      }

      reader.onload = (event1: any) => {
        diagram.location = reader.result.toString();
      };

      reader.readAsDataURL(event.target.files[i]);

      reader.onloadend = (event1: any) => {
        this.keyDiagrams.push(diagram);
      };
    }

    if ($('#icon_keydiagram').hasClass('fa fa-plus')) {
      this.collapseKeyDiagram();
    }
  }

  resizeKeyImages() {
    const windowHeight = window.innerHeight;
    const reportTextHeight = $('#div-right-reportText').height();
    const height = windowHeight - reportTextHeight - 150;
    if (reportTextHeight === 1) {
      $('#carousel-example-generic').height('auto');
    } else {
      $('#carousel-example-generic').height(height + 'px');
    }
  }

  collapseKeyDiagram() {
    if ($('#icon_keydiagram').hasClass('fa fa-minus')) {
      $('#icon_keydiagram').removeClass('fa fa-minus');
      $('#icon_keydiagram').addClass('fa fa-plus');
      $('#body_keydiagram').css({
        display: 'none'
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
        display: 'none'
      });
    } else {
      $('#icon_reporttext').removeClass('fa fa-plus');
      $('#icon_reporttext').addClass('fa fa-minus');
      $('#body_reporttext').removeAttr('style');
    }
  }

  populateTestCaseData() {
    this.template.dataElements.forEach(dataeElement => {
      const inputValue = this.inputValues.filter(x => x.dataElementId.toUpperCase() === dataeElement.id.toUpperCase());
      if (inputValue !== undefined && inputValue.length > 0) {
        if (dataeElement.dataElementType === 'ChoiceDataElement' || dataeElement.dataElementType === 'MultiChoiceDataElement') {
          const choiceElement = dataeElement as ChoiceDataElement;
          if (Array.isArray(inputValue[0].dataElementValue)) {
            const values = [];
            choiceElement.choiceInfo.forEach(choice => {
              inputValue[0].dataElementValue.forEach(value => {
                if (choice.value.toUpperCase() === value.toUpperCase()) {
                  values.push(choice.value);
                }
              });
            });
            inputValue[0].dataElementValue = values;
          } else {
            choiceElement.choiceInfo.forEach(choice => {
              if (inputValue[0].dataElementValue !== undefined) {
                if (choice.value.toUpperCase() === inputValue[0].dataElementValue.toUpperCase()) {
                  inputValue[0].dataElementValue = choice.value;
                  return;
                }
              }

            });
          }
        }
        dataeElement.currentValue = inputValue[0].dataElementValue;
      }
    });
  }

  clipboardError(error: Error): void {
    this.toastr.error('Failed to copy to clipboard');
  }

  clipboardSuccess(value: string): void {
    this.toastr.success('Successfully copied to clipboard');
  }

  getReportTextInnerContent(reportTextContentForEmptySectionName) {
    if (this.utilityService.isValidInstance(reportTextContentForEmptySectionName)) {
      const msgb = reportTextContentForEmptySectionName.innerText.trim();
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = msgb;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastr.success('Successfully copied to clipboard');
    } else {
      this.toastr.error('Failed to copy to clipboard');
    }
    // return '';
  }
}
