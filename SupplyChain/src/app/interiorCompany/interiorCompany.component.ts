/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { interiorCompanyService } from './interiorCompany.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-interiorcompany',
  templateUrl: './interiorCompany.component.html',
  styleUrls: ['./interiorCompany.component.css'],
  providers: [interiorCompanyService]
})
export class interiorCompanyComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  CompanyType = new FormControl('', Validators.required);
  tradeId = new FormControl('', Validators.required);
  companyName = new FormControl('', Validators.required);
  address = new FormControl('', Validators.required);


  constructor(public serviceinteriorCompany: interiorCompanyService, fb: FormBuilder) {
    this.myForm = fb.group({
      CompanyType: this.CompanyType,
      tradeId: this.tradeId,
      companyName: this.companyName,
      address: this.address
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceinteriorCompany.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.iff.supplychain.network.interiorCompany',
      'CompanyType': this.CompanyType.value,
      'tradeId': this.tradeId.value,
      'companyName': this.companyName.value,
      'address': this.address.value
    };

    this.myForm.setValue({
      'CompanyType': null,
      'tradeId': null,
      'companyName': null,
      'address': null
    });

    return this.serviceinteriorCompany.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'CompanyType': null,
        'tradeId': null,
        'companyName': null,
        'address': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.iff.supplychain.network.interiorCompany',
      'CompanyType': this.CompanyType.value,
      'companyName': this.companyName.value,
      'address': this.address.value
    };

    return this.serviceinteriorCompany.updateParticipant(form.get('tradeId').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceinteriorCompany.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceinteriorCompany.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'CompanyType': null,
        'tradeId': null,
        'companyName': null,
        'address': null
      };

      if (result.CompanyType) {
        formObject.CompanyType = result.CompanyType;
      } else {
        formObject.CompanyType = null;
      }

      if (result.tradeId) {
        formObject.tradeId = result.tradeId;
      } else {
        formObject.tradeId = null;
      }

      if (result.companyName) {
        formObject.companyName = result.companyName;
      } else {
        formObject.companyName = null;
      }

      if (result.address) {
        formObject.address = result.address;
      } else {
        formObject.address = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'CompanyType': null,
      'tradeId': null,
      'companyName': null,
      'address': null
    });
  }
}
