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
  private readonly apiUrl: 'http://localhost:8080/';

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

  // save a server = post request, we have to pass in the request body
  save$ = (server: Server) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>('${this.apiUrl}/server/save', server)
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

  /** <b>filter all the servers by a specific status.</b>
   *
   * What we're getting, in terms of what parameters this new Observable is taking, is the status that we want to filter by in the data
   * so the entire http response and what we're doing is :
   * - creating the new Observable of type CustomResponse
   * - define a callback function (=>) which return a suscriber (suscriber.complete();) after
   *     1) console logging the response
   *     2) calling .next(), the way we emit a new value to whoever is subscribed to this Observable
   *        - for the object that we want to return, we're gonna check to see if the status is ALL. If this is the case,
   *           we're going to return the first response, an object made by response and message. 
   *        - If the status is not ALL, then we have to filter the servers so we're going to 
   *            1) we spread everything inside the response (again),
   *            2) override the message and the data that we have to filter. The message is going to be: we're gonna filter all the servers with .filter() and
   *               if the lenght of the array after we filtered everything (because when .filter() is called, it's gonna filter the array based on the condtition 
   *               inside the curved brakets) is > 0, than we're going to pass the message "Servers filtered by..." and SERVER_UP or SERVER_DOWN depending by the 
   *               case or "No server of _status found",
   *            3) data = the servers that we have to filter and return to the user. For data (which is an object from the interface CustomResponse) 
   *               we're going to say: for the servers, we're just gonna get the response, so, whatever we got form the caller of this function, 
   *               grab the data (the array of Server) and then access the servers, filtering by whatever status is passed.
   *               
   */
  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
  new Observable<CustomResponse>(
    suscriber => {
      console.log(response);
      suscriber.next(
        status == Status.ALL ? 
        { ...response, message : 'Servers filtered by ${status} status'} 
        // or ..
        :
        {
          ...response,
          // override message 
          message: response.data.servers
          .filter(server => server.status === status).length > 0 ? "Servers filtered by" +
           + "${status === Status.SERVER_UP ? 'SERVER UP'" + 
           + " : 'SERVER DOWN'} status" : "No server of ${status} found",
           // to solve the error "response: CustomResponse is probably undefined _> tsconfig.jspn"
           data: { servers: response.data.servers.filter(server => server.status === status)}
        }
      );
      suscriber.complete();
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
  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError('An error occurred. Error code: ${error.status}');
  }
  
}
