import { Component, OnInit , Input} from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';

@Component({
  selector: 'acr-image-map',
  template: `
    <ng-container *ngIf="DataElement.ImagePath != Undefined">
      <div class="table tableImagemap">
          <div class="table-row">
              <div class="table-cell imgMap-table-cell">
                  OR
              </div>
              <div class="table-cell center-align">
                  <div>
                      <label class="imageMap-label"> Select value from image.</label>
                      <br />
                      <button type="button" class="btn btn-default" data-toggle="modal" attr.data-target="#{{'imgMap_Modal_'+DataElement.ID}}">
                          <span class="glyphicon glyphicon-picture" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Image Map"></span>
                      </button>
                  </div>
              </div>
          </div>
      </div>
      <ng-container *ngIf="DataElement.ImagePath != Undefined">
          <div class="modal fade img-modal" tabindex="-1" role="dialog" attr.id="{{'imgMap_Modal_'+DataElement.ID}}" aria-labelledby="mySmallModalLabel">
              <div class="modal-dialog modal-lg" role="document" [ngStyle]="{'width':DataElement.ImagePath.width + 30}">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h4 class="modal-title">
                              {{SelectionValue}}
                          </h4>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                      </div>
                      <div class="modal-body">
                          <div class="row">
                              <div class="col-md-12">
                                  <ng-container *ngIf="imageExist == true">
                                      <img class="ImgOption danger" alt="No Image Available!!!" data-dismiss="modal" attr.id="{{'imgMap_Img_'+DataElement.ID}}" (click)="imageClick($event,DataElement);" attr.data-elementID="{{DataElement.ID}}"
                                           attr.usemap="#{{'imgMap_'+DataElement.ID}}" src="{{DataElement.ImagePath}}">
                                      <map name="{{'imgMap_'+DataElement.ID}}">
                                          <ng-container *ngFor="let imgOpt of DataElement.ImageOptions">
                                              <area attr.shape="{{imgOpt.Shape}}" attr.imgID="{{'imgMap_Img_'+DataElement.ID}}" attr.coords="{{imgOpt.Coordinates}}" attr.alt="{{imgOpt.Value}}" onmouseover='myHover(this);' onmouseout='myLeave();' (mouseover)='displayValue(imgOpt.Value);' (mouseout)='displayValue("");' (click)="setValue(imgOpt.Value);" data-dismiss="modal">
                                          </ng-container>
                                      </map>
                                  </ng-container>

                                  <ng-container *ngIf="imageExist == false">
                                      <div class="">
                                          No Image Map Available...
                                      </div>
                                  </ng-container>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </ng-container>
    </ng-container>
  `,
  styles: [`

  `]
})
export class ImageMapComponent  {

  @Input() DataElement: DataElement;
  @Input() DataElements: Object = {};
  @Input() FormValues: Object = {};
  imageExist = true;
  SelectionValue = '';
}
