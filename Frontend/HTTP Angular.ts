first in app.config.ts


step 1


register provideHttpClient()


import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};


step 2

create dto :: Model


export interface Employee {
    id:number;
    name: string;
    salary: number;
}


Step 3

create employee service

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
 private _url = 'http://localhost:8080/employees';
 
 //http=inject(HttpClient)
 
 constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this._url).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(() => error.message || 'Server Error!');
  }
}




Step 4: Create Component

import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-emphttp',
  standalone: true,
  imports: [],
  template: `
   <h2>Employee List</h2>
    @if (errorMessage) {
      <p style="color:red">{{ errorMessage }}</p>
    }

	@if (employees.length > 0) {
	<table border="1">
	  <tr>
		<th>ID</th><th>Name</th><th>Age</th>
	  </tr>

	  @for ( emp of employees; track emp.id) {
		<tr>
		  <td>{{ emp.id }}</td>
		  <td>{{ emp.name }}</td>
		  <td>{{ emp.salary }}</td>
		</tr>
	  }
	</table>
	}
  `,
  styles: ``
})
export class EmphttpComponent implements OnInit {
  public employees: Employee[] = [];
  public errorMessage = '';

  constructor(private _es: EmployeeService) {}

  ngOnInit() {
    this._es.getEmployees().subscribe({
      next: data => this.employees = data,
      error: err => this.errorMessage = err
    });
  }
}
