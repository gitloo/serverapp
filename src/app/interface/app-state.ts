import { DataState } from "../enum/data-state.enum";

// diamond operator (<>) makes the object generics, so whatever type of data we declare in AppState<> is going to assign the type of data inside appData (application data)
export interface AppState<T> {
    // dataState is going to determine the state of the application, so at any given moment we can call on this data state and it's going to tell us in what state the application is: LOADING / LOADED / ERROR
    dataState: DataState;
    // appData and error are optional(followed by ? sign) because we are not going to have both at the same time
    // appData is going to contain all of the data of the application
    appData?: T;
    error?: string;
}