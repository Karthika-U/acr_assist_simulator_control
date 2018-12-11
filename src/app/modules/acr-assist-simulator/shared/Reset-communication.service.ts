import { ViewChild, Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResetCommunicationService {
    // Observable string sources
    private ResetSource = new Subject<string>();

    // Observable string streams
    resetSource$ = this.ResetSource.asObservable();

    // Service message commands
    messageEmitter(mission: string) {
        this.ResetSource.next(mission);
    }
}
