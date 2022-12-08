import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { startWith } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// we need to implement an interface OnInit, and because we are implementing it we're obligated to define the method ngOnInit().
export class AppComponent implements OnInit {
  // the entire state of application is going to be inside of this appState variable, and the type of it is an Observable,
  // then we pass in the type for that Observable, which is the entire application state and the data we're going to manage is 
  // the custom http response
  appState$: Observable<AppState<CustomResponse>>;
  
  constructor(private serverService: ServerService) {}


  // Every time that this component is done initializing, is going to call this ngOnInit() and that's gonna fire any code we put inside
  ngOnInit(): void{
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        // Whenever the app initialized it's gonna go through this and...

        // 2 once the app get some data, it's gonna return LOADED state or...
        return { dataState: DataState.LOADED_STATE, appData: response } // the object returned does not give any complaint because it matches the description of the type that we set for appState$
      }),
      // 1 if it doesn't have the response immediately, will call the startWith() method and show to the user that the app is in LOADING state, but
      startWith({ dataState: DataState.LOADING_STATE }),
      // 3 ...,if  we get an error for some reason, it's gonna return ERROR state.
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }
}
