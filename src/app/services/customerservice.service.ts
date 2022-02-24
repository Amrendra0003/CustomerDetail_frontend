import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class CustomerserviceService {
  url='https://localhost:44372/api/Customer/';
  constructor(private http: HttpClient) { }
  customersData(){
    return this.http.get(this.url + 'GetCustomers');
  }
  addCustomer(customerDetails:any){
    return this.http.post(this.url + 'AddCustomer',customerDetails);
  }
}
