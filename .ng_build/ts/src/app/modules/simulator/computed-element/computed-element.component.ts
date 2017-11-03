import { Component, OnInit, Input } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-computed-element',
  template: `
    <ng-container *ngIf="DataElement.Visible && DataElement.ShowValue">
      <div class="form-group" [class.Visible]="(DataElement.Visible && DataElement.ShowValue)">

          <div class="col-sm-3">

              <label class="control-label DEElement" id="{{DataElement.ID}}">

                  {{DataElement.ID}}
              </label>

              <ng-container *ngIf="!common.isEmpty(DataElement.Hint) ">
                  <a>
                      <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="{{DataElement.Hint}}"></span>
                  </a>
              </ng-container>
          </div>
          <div class="col-sm-6">

              <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
                  <value-block-view [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></value-block-view>

              </ng-container>

              <ng-container *ngIf="!common.isEmpty(DataElement.ArithmaticExpression)">
                  <label class="control-label DEElement"> {{compute(DataElement.ArithmeticExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!common.isEmpty(DataElement.TextExpression)">
                  <label class="control-label DEElement"> {{textify(DataElement.TextExpression)}}</label>
              </ng-container>
          </div>
      </div>

    </ng-container>

    <ng-container *ngIf="!DataElement.ShowValue">
      <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
          <value-block-view [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></value-block-view>

      </ng-container>

      <ng-container *ngIf="!common.isEmpty(DataElement.ArithmaticExpression)">
          <input type="hidden" [attr.value]="compute(DataElement.ArithmeticExpression)" />
      </ng-container>
      <ng-container *ngIf="!common.isEmpty(DataElement.TextExpression)">
          <input type="hidden" [attr.value]="textify(DataElement.TextExpression)" />
      </ng-container>

    </ng-container>
  `,
  styles: [`

  `]
})
export class ComputedElementComponent implements OnInit {

  @Input() DataElement: DataElement;
  @Input() DataElements: Object = {};
  @Input() FormValues: Object = {};

  constructor() { }

  ngOnInit() {
  }

}
