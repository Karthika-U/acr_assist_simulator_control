import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';
import { SettingsService } from '../shared/services/settings.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { Metadata } from '../shared/models/metadata.model';
import { Parser } from '../shared/utils/parser';
import { TemplateDetails } from '../shared/models/template-details.model';
import { XMLUtil } from '../shared/utils/XMLUtil';
import { SchemaValidator } from '../shared/utils/SchemaValidator';
import { debug } from 'util';
import { ExecutedResults } from '../shared/models/executed-results.model';
import { ExpressionResult } from '../shared/models/expression-result.model';

@Component({
  selector: 'acr-assist-simulator',
  templateUrl: './assist-simulator.component.html',
  styleUrls: ['../../styles.css']
})
export class AssistSimulatorComponent implements OnInit, OnChanges {
  @Output() onUpdateExecutedResult = new EventEmitter<ExecutedResults>();
  @Input() templateContent: string;
  @Input() imagePath: string;
  errorMessage: string;
  FormValues: Object;
  ExpressionBlocks: ExpressionBlock[];
  isValid: boolean;
  isEmptyContent: boolean;
  DataElements: DataElement[];
  FormChanged: boolean;
  BaseFormValues: Object;
  ValidationBlocks;
  DataElementObj;
  Metadata: Metadata;
  previousNonRelevantDataItems: number[] = [];
  public settingsService: SettingsService;

  constructor(
    private globalsService: GlobalsService,
     settingsService: SettingsService,
    private cd: ChangeDetectorRef
  ) {
    this.settingsService = settingsService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processData();
  }

  ngOnInit() {
    this.processData();
  }

  resetData() {
    this.FormValues = {};
    this.BaseFormValues = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.ValidationBlocks = [];
    this.DataElementObj = {};

    this.globalsService.XMLAcronyms = {};
    this.ExpressionBlocks = [];
    this.DataElements = [];
    this.Metadata = undefined;
    this.FormValues = {};
    this.ValidationBlocks = [];
    this.globalsService.evaluateExpessions = true;
    this.globalsService.ComputedElementConditions = {};
    this.globalsService.XMLAcronyms = {};
    this.isValid = true;
    this.errorMessage = '';
  }
  validateXML() {
    const validator = new SchemaValidator();
    const validationResult = validator.Validate('', this.templateContent);
    return validationResult;
  }

  processData() {
    this.isEmptyContent =
      this.templateContent === undefined ||
      this.templateContent.length === 0 ||
      this.imagePath === undefined ||
      this.imagePath.length === 0;

    if (this.isEmptyContent === false) {
      this.resetData();
      this.previousNonRelevantDataItems = [];

      const templateDetails = new TemplateDetails();
      templateDetails.imagePath = this.imagePath;
      templateDetails.templateContent = this.templateContent;
      const util = new XMLUtil();
      util.load(templateDetails);

      this.globalsService.XMLAcronyms = util.Acronyms;
      this.Metadata = util.Metadata;
      this.DataElements = util.DataElements;
      this.ExpressionBlocks = util.ExpressionBlocks;
      this.ValidationBlocks = util.ValidationBlocks;
      this.FormValues = util.FormValues;
      this.BaseFormValues = JSON.parse(JSON.stringify(this.FormValues));
    }
  }

  cacheNonRelevantElements(notRelevantDataElments: number[]) {
    this.previousNonRelevantDataItems = [];
    for (let i = 0, len = notRelevantDataElments.length; i < len; i++) {
      this.previousNonRelevantDataItems[i] = notRelevantDataElments[i];
    }
  }

  checkIfThereAreNewNonRelevantDataElements(
    notRelevantDataElments: number[]
  ): boolean {
    let doesNewElementExists = false;
    if (
      this.previousNonRelevantDataItems.length !== notRelevantDataElments.length
    ) {
      doesNewElementExists = true;
     } else {
      for (let i = 0, len = notRelevantDataElments.length; i < len; i++) {
        const notRelevantDataElment = notRelevantDataElments[i];
        if (this.previousNonRelevantDataItems.indexOf(notRelevantDataElment) < 0) {
          doesNewElementExists = true;
          break;
        }

      }
    }
    return doesNewElementExists;
  }

  displayDataElements(expressionResult: ExpressionResult) {
      if (
      !this.checkIfThereAreNewNonRelevantDataElements(expressionResult.nonRelevantElementIndex)
    ) {
      return;
    }
   this.DataElements.forEach(de => {
      const deindex = this.DataElements.indexOf(de);
      if (
        expressionResult.nonRelevantElementIndex !== undefined &&
        expressionResult.nonRelevantElementIndex.indexOf(deindex) !== -1
      ) {
        de.Visible = false;
      } else {
        de.Visible = true;
      }
    });
    if (expressionResult.executedResults != null) {
        this.onUpdateExecutedResult.emit(expressionResult.executedResults);
    }
    this.cacheNonRelevantElements(expressionResult.nonRelevantElementIndex);
  }
}
