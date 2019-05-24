import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, SimpleChanges, SimpleChange } from '@angular/core';
import { NumericDataElement } from '../../../core/elements/models/numeric-data-element.model';
import { NumericElement } from '../assist-data-element.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectedCondition } from '../../../core/models/executed-result.model';
import { SimulatorEngineService } from '../../../core/services/simulator-engine.service';
import { SimulatorCommunicationService } from '../../shared/services/simulator-communication.service';
import { Subscription } from 'rxjs';
import { ResetCommunicationService } from '../../shared/services/reset-communication.service';


@Component({
  selector: 'acr-assist-numeric-element',
  templateUrl: './assist-numeric-element.component.html',
  styleUrls: ['./assist-numeric-element.component.css', '../../styles.css']
})
export class AssistNumericElementComponent implements OnInit, AfterViewInit {
  @Input() alignLabelAndControlToTopAndBottom: boolean;
  subscription: Subscription;
  @Input() numericDataElement: NumericDataElement;
  @Input() imagePath: string;
  @Output() returnNumericElement = new EventEmitter();
  numericElementForm: FormGroup;
  selectedCondition: SelectedCondition;
  numberValue: number;

  oldVal = null;

  constructor(private formBuilder: FormBuilder, private simulatorEngineService: SimulatorEngineService,
    simulatorCommunicationService: SimulatorCommunicationService,
    resetCommunicationService: ResetCommunicationService) {
    this.subscription = simulatorCommunicationService.simulatorSource$.subscribe(
      mission => {
        this.UpdateFormValidator();
      });

    this.subscription = resetCommunicationService.resetSource$.subscribe(
      mission => {

      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.createNumericElementForm();
  }

  ngAfterViewInit(): void {
    if (this.numericDataElement.currentValue !== undefined && this.numericDataElement.currentValue !== 0) {
      this.simulatorEngineService.addOrUpdateDataElement(this.numericDataElement.id, this.numericDataElement.currentValue,
        this.numericDataElement.currentValue);
      this.numberValue = this.numericDataElement.currentValue;
      this.loadedNumericValue(this.numericDataElement.id, this.numericDataElement.currentValue, this.numericDataElement.label);
    } else {
      this.returnNumericElement.emit(undefined);
    }
  }

  loadedNumericValue(id, value, selectedCondition) {
    const choiceElement = new NumericElement();
    choiceElement.elementId = id;
    choiceElement.selectedValue = value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = value;
    this.returnNumericElement.emit({ receivedElement: choiceElement, selectedCondition: this.selectedCondition });
  }

  choiceSelected(element, selectedCondition) {
    const choiceElement = new NumericElement();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;

    this.selectedCondition = new SelectedCondition();

    this.selectedCondition.selectedConditionId = element.id;
    this.selectedCondition.selectedCondition = selectedCondition;
    this.selectedCondition.selectedValue = element.value;
    this.returnNumericElement.emit({ receivedElement: choiceElement, selectedCondition: this.selectedCondition });
  }

  _keyUp(event: any, value) {
    // const $this = this;
    // if ($this.numericDataElement.maximum != undefined && parseFloat(value) > $this.numericDataElement.maximum) {
    //   event.preventDefault();
    //   if (value.toString().substring(0, value.toString().length - 1) == '') {
    //     $this.numberValue = undefined;
    //   } else {
    //     $this.numberValue = parseFloat(value.toString().substring(0, value.toString().length - 1));
    //   }
    // }
  }

  _keyUpInteger(event: any, value) {
    // const $this = this;
    // if ($this.numericDataElement.maximum != undefined && parseInt(value) > $this.numericDataElement.maximum) {
    //   event.preventDefault();
    //   if (value.toString().substring(0, value.toString().length - 1) == '') {
    //     $this.numberValue = undefined;
    //   } else {
    //     $this.numberValue = parseInt(value.toString().substring(0, value.toString().length - 1));
    //   }
    // }
  }

  onlyIntegerKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  private createNumericElementForm() {
    this.numericElementForm = this.formBuilder.group({
      numericElement: ['', Validators.compose([Validators.required, Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])],
    });
  }

  UpdateFormValidator() {
    this.numericElementForm.controls['numericElement'].setValidators([Validators.compose([Validators.required,
    Validators.min(+this.numericDataElement.minimum), Validators.max(+this.numericDataElement.maximum)])]);
    this.numericElementForm.controls['numericElement'].updateValueAndValidity();
  }
}
