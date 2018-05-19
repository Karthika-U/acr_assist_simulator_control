import { Injectable } from '@angular/core';
import { FileDetails } from '../models/file-details.model';
import { Dictionary } from '../models/dictionary';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalsService {
  defaultModule =  'assets/XMLFIles/hello_assist/Hello_Assist.xml';

  public XMLList: Dictionary<FileDetails> = new Dictionary<FileDetails>();

  constructor(private http: Http) { }


  getDefaultModulePath(): Observable<string> {
    return this.http.get(this.defaultModule).map(res => res.text());
  }
}

