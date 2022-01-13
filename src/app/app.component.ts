import { Component, TemplateRef, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService } from 'ngx-bootstrap/modal';
import {CustomerserviceService} from "./services/customerservice.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DemoProject';
  customerDetails: any;
  customerForm: FormGroup;
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
  }
  get f() {
    return this.customerForm.controls;
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
    this.modalRef = this.modalService.show(template);
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
    this.customerForm.reset();
    this.modalService.hide();
  }
  SaveCustomerInfo(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  BackToCustInfo(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  SaveCustomerAddress(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  BackToCustAddress(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
