import { Component, Input } from '@angular/core';
import { StringUtilityService } from '../shared/services/string-utility.service';
export class DataElementComponent {
    /**
     * @param {?} stringUtilityService
     */
    constructor(stringUtilityService) {
        this.stringUtilityService = stringUtilityService;
        this.DataElements = [];
        this.FormValues = {};
        this.ValidationBlocks = [];
        this.formInitialized = true;
        this.defaultOption = 'Select';
        this.console = console;
    }
    /**
     * @return {?}
     */
    itemSelected() {
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        return eval(cond);
    }
    /**
     * @param {?} DataElementID
     * @param {?} choiceValue
     * @param {?} event
     * @return {?}
     */
    updateMultichoice(DataElementID, choiceValue, event) {
        let /** @type {?} */ previousValue = this.FormValues[DataElementID];
        if (event.currentTarget.checked) {
            if (previousValue === undefined) {
                previousValue = [];
            }
            previousValue.push(choiceValue);
        }
        else {
            const /** @type {?} */ index = previousValue.indexOf(choiceValue);
            if (index > -1) {
                previousValue.splice(index, 1);
            }
        }
        this.FormValues[DataElementID] = previousValue;
    }
}
DataElementComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-data-element',
                template: `
    <canvas id='Can-ImgMap'>

    </canvas>
    <ng-container *ngFor="let DataElement of DataElements">



      <ng-container *ngIf="(DataElement.ElementType == 'ComputedElement')">
        <acr-computed-element [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-computed-element>
      </ng-container>


      <ng-container *ngIf="(DataElement.ElementType == 'ChoiceDataElement' || DataElement.ElementType == 'NumericDataElement' || DataElement.ElementType == 'IntegerDataElement' || DataElement.ElementType == 'MultiChoiceDataElement') ">
        <ng-container *ngIf="DataElement.Visible">
          <div class="form-group " [class.Visible]="DataElement.Visible">
            <div class="col-sm-5 text-left content-padding">
              <label class="control-label DEElement" id="{{DataElement.ID}}">
                {{DataElement.Label}}
              </label>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.Hint) ">
                <a>
                  <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="right" title="{{DataElement.Hint}}"></span>
                </a>
              </ng-container>
              <ng-container *ngIf="DataElement.Diagrams != undefined ">
                <acr-hint-diagram [DataElement]="DataElement"></acr-hint-diagram>
              </ng-container>
              <ng-container *ngIf="ValidationBlocks.length > 0">
                <ng-container *ngFor="let Block of ValidationBlocks">
                  <ng-container *ngIf="(DataElement.Visible)">
                    <ng-container *ngIf="evaluate(Block.Condition)">
                      <ng-container *ngIf="Block.DataElementID == DataElement.ID">
                        <ng-container *ngIf="Block.Message =='Minimum value required'">
                          <span class="required-field">Minimum Value: {{Block.Minimum}}</span>
                        </ng-container>
                        <ng-container *ngIf="Block.Message != 'Minimum value required'">
                          <span class="required-field">* Required field !!!</span>
                        </ng-container>
                      </ng-container>
                    </ng-container>
                  </ng-container>
                </ng-container>
              </ng-container>
            </div>

            <div class="col-sm-7 text-left content-padding">
              <div class="input-group ">
                <!--Choice DataElements-->
                <ng-container *ngIf="DataElement.ElementType == 'ChoiceDataElement' ">
                  <div class="row">
                    <ng-container *ngIf="DataElement.ChoiceOptions.length == 2">
                      <!-- Full width for radio if Imagepath exist -->
                      <ng-container *ngIf="DataElement.ImagePath != undefined">
                        <div id="radio-inline">
                          <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                              <div class="row">
                                  <div class="col-sm-12">
                            <label class="rad DEValues">
                              <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                checked style="display:none;">
                              <div  (click)="itemSelected()">
                                <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                  checked>
                                <span>{{choice.Label}}</span>

                              </div>
                              <div class="clear"></div>
                            </label>
                            </div></div>
                          </ng-container>
                        </div>
                      </ng-container>
                      <!-- Full width for radio if Imagepath does not exist -->
                      <ng-container *ngIf="DataElement.ImagePath == undefined">
                        <div id="radio-inline">
                          <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                            <div class="row">
                                <div class="col-sm-12">
                                    <label class="rad DEValues">
                                        <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                          checked style="display:none;">
                                        <div  (click)="itemSelected()" >
                                          <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                            checked>
                                          <span>{{choice.Label}}</span>
                                        </div>

                                      </label>
                                </div>
                            </div>

                          </ng-container>
                        </div>
                      </ng-container>
                    </ng-container>
                    <ng-container *ngIf="DataElement.ChoiceOptions.length != 2">
                      <!-- Dropdown will be created if choice options have more than 5 choices-->
                      <ng-container *ngIf="DataElement.ChoiceOptions.length > 5">
                        <select id="{{DataElement.ID}}" [(ngModel)]="FormValues[DataElement.ID]" (ngModelChange)="itemSelected()">
                          <option [value]="Select">--Select--</option>
                          <option *ngFor="let choice of DataElement.ChoiceOptions" [value]="choice.Value">{{choice.Label}}</option>
                        </select>
                      </ng-container>
                      <!-- Radio button will be created if choice options have are <=5 choices-->
                      <ng-container *ngIf="DataElement.ChoiceOptions.length <= 5">
                        <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                          <div id="radio-inline">
                              <div class="row">
                                  <div class="col-sm-12">
                                    <label class="rad DEValues">
                                      <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                        checked style="display:none;">
                                      <div  (click)="itemSelected()">
                                        <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                          checked>
                                        <span>{{choice.Label}}</span>

                                      </div>

                            </label>
                          </div> </div>
                          </div>
                        </ng-container>
                      </ng-container>
                    </ng-container>
                  </div>
                  <!-- imagemap will be displyed here -->
                  <ng-container *ngIf="DataElement.ImagePath != undefined">
                    <div class="row">
                      <acr-image-map [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-image-map>
                    </div>
                  </ng-container>


                </ng-container>
                <!--Multi Choice DataElements-->
                <ng-container *ngIf="DataElement.ElementType == 'MultiChoiceDataElement' ">
                  <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                    <div class="checkbox">
                      <label >
                        <input type="checkbox" value={{choice.Value}} (change)="updateMultichoice(DataElement.ID,choice.Value,$event)">
                        <span> {{choice.Label}}</span>
                      </label>
                    </div>
                  </ng-container>
                </ng-container>

                <!--NumericDataElement-->
                <ng-container *ngIf="DataElement.ElementType == 'NumericDataElement' ">
                  <input type="number" [(ngModel)]="FormValues[DataElement.ID]" class="form-control" name="FormValues['{{DataElement.ID}}']"
                    (keypress)="itemSelected()">
                </ng-container>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
                styles: [`
    .content-padding {
      padding-top: 5px;
      padding-right: 5px;
    }
  `]
            },] },
];
/**
 * @nocollapse
 */
DataElementComponent.ctorParameters = () => [
    { type: StringUtilityService, },
];
DataElementComponent.propDecorators = {
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'ValidationBlocks': [{ type: Input },],
};
function DataElementComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    DataElementComponent.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    DataElementComponent.ctorParameters;
    /** @type {?} */
    DataElementComponent.propDecorators;
    /** @type {?} */
    DataElementComponent.prototype.DataElements;
    /** @type {?} */
    DataElementComponent.prototype.FormValues;
    /** @type {?} */
    DataElementComponent.prototype.ValidationBlocks;
    /** @type {?} */
    DataElementComponent.prototype.formInitialized;
    /** @type {?} */
    DataElementComponent.prototype.defaultOption;
    /** @type {?} */
    DataElementComponent.prototype.console;
    /** @type {?} */
    DataElementComponent.prototype.stringUtilityService;
}
//# sourceMappingURL=data-element.component.js.map