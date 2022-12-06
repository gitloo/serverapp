import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl: 'any';

  constructor(private http: HttpClient) { }
   
  /* Typical way to make http request to the back end

      getServers(): Observable<CustomResponse>{
      return this.http.get<CustomResponse>('http://localhost:8080/server/list'); 
  */

  /* reactive way to make requests to the backend

      Retrieve a list of all servers
      <> to cast the object of the response into the type of data that we declare inside the <>
  */
  servers$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>('${this.apiUrl}/server/list')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  // save a server
  save$ = (server: Server) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>('${this.apiUrl}/server/save')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  // ping a server
  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>('${this.apiUrl}/server/ping/${ipAddress}')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  // to filter all the servers
  delete$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
  new Observable<CustomResponse>(
    subscriber => {
      console.log(response);
      subscriber.next(
        status == Status.ALL ? { ...response, message : 'Servers filtered by ${status} status'} :
        {
          ...response,
          message: response.data.servers?
          .filter(server => server.status === status).length > 0 ? 'Servers filtered by 
          ${status === Status.SERVER_UP ? ' SERVER UP' : 'SERVER DOWN'} status'
        }
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  // delete a server
  delete$ = (serverId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>('${this.apiUrl}/server/delete/${ipAddress}')
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  // we make handleError private because it's supposed to only be inside of this class
  // handleError method used for debugging purposes, whenever we're debugging this appliation or running it so that we can see the error in the console, if something happens
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError('An error occurred. Error code: ${error.status}');
  }
  
}
