import { Component, TemplateRef, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerserviceService } from "./services/customerservice.service";
import csc from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'DemoProject';
  customerDetails: any;
  customerForm: FormGroup;
  submitted1 = false;
  submitted2 = false;
  submitted3 = false;
  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];
  selectedCountryCode!: string;
  selectedStateCode!: string;
  modalRef: any;
  phoneNumber = "^[1-9]{1}[0-9]{9}$";
  isExpandForAddressVar: any = false;
  isExpandForProfessionVar: any = false;
  rowId: any = 0;

  constructor(private fb: FormBuilder, public spinner: NgxSpinnerService, public modalService: BsModalService, public customerDataService: CustomerserviceService) {
    this.customerForm = this.fb.group({
      Id: 0,
      FirstName: [null, [Validators.required]],
      LastName: [null, [Validators.required]],
      DateOfBirth: [null, [Validators.required]],
      Gender: [null, [Validators.required]],
      PhoneNumber: [null, [Validators.required, Validators.pattern(this.phoneNumber), Validators.maxLength(10)]],
      JobTitle: [null, [Validators.required]],
      JobDetail: [null, [Validators.required]],
      CompanyName: [null, [Validators.required]],
      EmployeeId: [null, [Validators.required]],
      Address: [null, [Validators.required]],
      StreetNo: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Country: [null, [Validators.required]],
      ZipCode: [null, [Validators.required]]
    });
  }
  ngOnInit() {
    this.getAllCustomers();
    this.getCountries();
  }
  get f() {
    return this.customerForm.controls;
  }
  getCountries() {
    this.countries = csc.getAllCountries();
  }
  selectedLevel1: any;
  selectedLevel2: any;
  getState() {
    var result = this.countries.find(obj => {
      return obj.name === this.selectedLevel1
    });
    this.selectedCountryCode = result!.isoCode;
    this.states = csc.getStatesOfCountry(this.selectedCountryCode);
  }
  getCity() {
    var result = this.states.find(obj => {
      return obj.name === this.selectedLevel2
    });
    this.selectedStateCode = result!.isoCode;
    this.cities = csc.getCitiesOfState(this.selectedCountryCode, this.selectedStateCode);
  }
  getAllCustomers() {
    this.spinner.show();
    this.customerDataService.customersData().subscribe((data: any) => {
      this.customerDetails = data;
      this.spinner.hide();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Records Fetched Successfully!',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
  addCustomer(template: TemplateRef<any>) {
    let ngbModalOptions: any = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }
  onSubmitCustomerDetails(event: { preventDefault: () => void; }) {
    this.spinner.show();
    event.preventDefault();
    if (this.customerForm.value.Gender === "Male") {
      this.customerForm.value.Gender = true;
    }
    else {
      this.customerForm.value.Gender = false;
    }
    this.submitted3 = true;
    if (this.isValidForLogin()) {
      this.customerForm.value.Id = 0;
      this.customerDataService.addCustomer(this.customerForm.value).subscribe((data: any) => {
        this.spinner.hide();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added Successfully!',
          showConfirmButton: false,
          timer: 1500
        })
        this.modalService.hide();
        this.customerForm.reset();
        this.getAllCustomers();
        this.submitted1 = false;
        this.submitted2 = false;
        this.submitted3 = false;
      });
    }
    else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'All fields are required!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  hideModel() {
    this.submitted1 = false;
    this.submitted2 = false;
    this.submitted3 = false;
    this.customerForm.reset();
    this.modalService.hide();
  }
  SaveCustomerInfo(template: TemplateRef<any>) {
    let ngbModalOptions: any = {
      backdrop: 'static',
      keyboard: false
    };
    this.submitted1 = true;
    if (this.customerForm.value.FirstName == null
      || this.customerForm.value.LastName == null
      || this.customerForm.value.DateOfBirth == null
      || this.customerForm.value.Gender == null
      || this.customerForm.value.PhoneNumber == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'All fields are required!',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else {
      this.modalRef.hide();
      this.modalRef = this.modalService.show(template, ngbModalOptions);
    }
  }
  BackToCustInfo(template: TemplateRef<any>) {
    let ngbModalOptions: any = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }
  SaveCustomerAddress(template: TemplateRef<any>) {
    let ngbModalOptions: any = {
      backdrop: 'static',
      keyboard: false
    };
    this.submitted2 = true;
    if (this.customerForm.value.Address == null
      || this.customerForm.value.Country == null
      || this.customerForm.value.State == null
      || this.customerForm.value.StreetNo == null
      || this.customerForm.value.ZipCode == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'All fields are required!',
        showConfirmButton: false,
        timer: 1500
      })
    }
    else {
      this.modalRef.hide();
      this.modalRef = this.modalService.show(template, ngbModalOptions);
    }
  }
  BackToCustAddress(template: TemplateRef<any>) {
    let ngbModalOptions: any = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }
  isValidForLogin() {
    if (!this.customerForm.valid) {
      return false;
    }
    return true;
  }
  isExpandForAddressFun(id: any) {
    this.rowId = id;
    this.isExpandForAddressVar = true;
    this.isExpandForProfessionVar = false;
  }
  isExpandForProfessionFun(id: any) {
    this.rowId = id;
    this.isExpandForProfessionVar = true;
    this.isExpandForAddressVar = false;
  }
  hideAddressTable() {
    this.isExpandForAddressVar = false;
  }
  hideProfessionTable() {
    this.isExpandForProfessionVar = false;
  }
}
