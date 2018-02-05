import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ImageElements } from '../../../core/elements/models/image-elements.model';
import { ChoiceDataElement } from '../../../core/elements/models/choice-data-element-model';
import { ChoiceElement } from '../assist-data-element.component';
import { Rules } from '../../../core/rules/models/rules.model';
const $ = require('jquery');
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'acr-assist-choice-element',
  templateUrl: './assist-choice-element.component.html',
  styleUrls: ['./assist-choice-element.component.css', '../../../../modules/styles.css']
})
export class AssistChoiceElementComponent implements OnInit {
  @Input() choiceDataElement: ChoiceDataElement;
  @Input() imagePath: string;
  @Input() Rules: Rules;
  @Input() keyDiagrams: ImageElements[];
  @Output() returnChoiceElement: EventEmitter<ChoiceElement> = new EventEmitter<ChoiceElement>();
  choiceElementForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.createChoiceElementForm();
  }

  ngOnInit() {
    for (let index = 0; index < this.keyDiagrams.length; index++) {
      this.keyDiagrams[index].location =  this.imagePath + '/' + this.keyDiagrams[index].location;
    }
  }
  choiceSelected(elementId: string, selectedText: string, selectedValue: string) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = elementId;
    choiceElement.selectedValue = selectedValue;
    choiceElement.selectedText = selectedText;
    this.returnChoiceElement.emit(choiceElement);
  }

  dropdownChoiceSelected(element) {
    const choiceElement = new ChoiceElement ();
    choiceElement.elementId = element.id;
    choiceElement.selectedValue = element.value;
    choiceElement.selectedText = element.selectedOptions[0].label;
    this.returnChoiceElement.emit(choiceElement);
   }

  private createChoiceElementForm() {
    this.choiceElementForm = this.formBuilder.group({
      checkBox: ['', Validators.required],
    }, {
      validator: this.specificValueInsideRange('checkBox')
    });
  }

  private specificValueInsideRange(checkBoxKey: string) {
    return (group: FormGroup) => {
      const choiceControl = group.controls[checkBoxKey];
      if (choiceControl.value === 'undefined' || choiceControl.value === '') {
        return choiceControl.setErrors({ notEquivalent: true });
      }else {
        return choiceControl.setErrors(null);
      }
    };
  }
}
