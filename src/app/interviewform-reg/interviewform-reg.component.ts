import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/api.service';

@Component({
  selector: 'app-interviewform-reg',
  templateUrl: './interviewform-reg.component.html',
  styleUrls: ['./interviewform-reg.component.css'],
})
export class InterviewformRegComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  panelOpenState = false;

  dataSource: any = new MatTableDataSource<any>([]);
  currentPage: number = 0; // Start from 0 for index-based calculations
  pageIndex: number = 0;
  search: any;
  filterItems: any;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.fetchDataFromAPI();
  }

  applicantForm: any;
  displayedColumns: string[] = ['SERIAL_NO', 'APP_NO', 'APP_NAME', 'APP_POSITION', 'APP_NOYEARS', 'APP_MOB', 'APP_EMAIL', 'EDIT', 'DELETE'];

  fetchDataFromAPI() {
    // Assume this is the API response array of objects
    const apiData = [
      {
        APP_NO: 'APP001',
        APP_DATE: new Date(),
        APP_NAME: 'John Doe',
        APP_POSITION: 'Software Engineer',
        APP_DOB: new Date('1990-01-01'),
        APP_AGE: 32,
        APP_GENDER: 'Male',
        APP_MOB: '1234567890',
        APP_EMAIL: 'john@example.com',
        APP_NOYEARS: 5.5,
        APP_REASON: 'Looking for better opportunities',
        APP_CURRENTEMPLOYER: 'ABC Inc.',
        APP_NP: 30
      },
      {
        APP_NO: 'APP002',
        APP_DATE: new Date(),
        APP_NAME: 'Jane Smith',
        APP_POSITION: 'Data Scientist',
        APP_DOB: new Date('1985-05-15'),
        APP_AGE: 36,
        APP_GENDER: 'Female',
        APP_MOB: '9876543210',
        APP_EMAIL: 'jane@example.com',
        APP_NOYEARS: 8.2,
        APP_REASON: 'Career growth',
        APP_CURRENTEMPLOYER: 'XYZ Corp.',
        APP_NP: 45
      }, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {}, {},
      {},




    ];

    this.dataSource.data = apiData;
    this.paginator.length = apiData.length;
    this.paginator.pageIndex = this.currentPage;
    this.filterItems = this.dataSource.data
    console.log(this.dataSource);
    // Assign API data to the MatTableDataSource
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private http: HttpClient,
  ) {
    this.loadForm();
  }


  ngOnInit(): void {
    this.fetch();
    this.applicantForm.get('APP_DOB').valueChanges.subscribe((dob: any) => {
      if (dob) {
        this.calculateAge(dob);
      }
    });

    // Subscribe to changes in APP_CURRENTEMPLOYER control value
    this.applicantForm
      .get('APP_CURRENTEMPLOYER')
      .valueChanges.subscribe((value: any) => {
        const npControl = this.applicantForm.get('APP_NP');
        // Enable APP_NP control if APP_CURRENTEMPLOYER value is not empty
        if (value && value.length > 0) {
          npControl.enable();
        } else {
          npControl.disable(); // Otherwise, disable it
        }
      });




  }

  ngAfterViewInit(): void {
    // After view initialization, fetch data and set up the paginator
    this.fetchDataFromAPI();
    this.dataSource.paginator = this.paginator;
  }
  
//   updateFilteredItems() {
// console.log('search');

//     this.dataSource.data = this.filterItems.filter((item: any) =>
//       item?.APP_NAME?.toLowerCase().includes(this.search.toLowerCase())
//     );
//   }

updateFilteredItems() {
  this.dataSource.data = this.filterItems.filter((item: any) => {
    // Convert all property values to lowercase for case-insensitive search
    const lowerCaseItem = Object.keys(item).reduce((acc: any, key: string) => {
      acc[key] = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
      return acc;
    }, {});

    // Check if any property value contains the search term
    for (const key in lowerCaseItem) {
      if (Object.prototype.hasOwnProperty.call(lowerCaseItem, key)) {
        if (typeof lowerCaseItem[key] === 'string' && lowerCaseItem[key].includes(this.search.toLowerCase())) {
          return true; // Return true if any property value contains the search term
        }
      }
    }
    return false; // Return false if no property value contains the search term
  });
}


  loadForm() {
    if (!this.isEdit) {
      this.applicantForm = this.fb.group({
        APP_NO: ['', [Validators.required, Validators.maxLength(10)]],
        APP_DATE: ['', [Validators.required]],
        APP_NAME: ['', [Validators.required, Validators.maxLength(250)]],
        APP_POSITION: ['', [Validators.required, Validators.maxLength(250)]],
        APP_DOB: ['', [Validators.required]],
        APP_AGE: [{ value: '', disabled: true }, , [Validators.required]],
        APP_GENDER: ['', [Validators.required, Validators.maxLength(15)]],
        APP_MOB: ['', [Validators.maxLength(15), Validators.pattern('[0-9]*')]],
        APP_EMAIL: ['', [Validators.maxLength(50), Validators.email]],
        APP_NOYEARS: ['', [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
        APP_REASON: ['', [Validators.maxLength(250)]],
        APP_CURRENTEMPLOYER: ['', [Validators.maxLength(250)]],
        APP_NP: [{ value: '', disabled: true }],
      });
    } else {
      this.applicantForm = this.fb.group({
        APP_NO: [this.selctedElementToEdit?.APP_NO || '', [Validators.required, Validators.maxLength(10)]],
        APP_DATE: [this.selctedElementToEdit?.APP_DATE || '', [Validators.required]],
        APP_NAME: [this.selctedElementToEdit?.APP_NAME || '', [Validators.required, Validators.maxLength(250)]],
        APP_POSITION: [this.selctedElementToEdit?.APP_POSITION || '', [Validators.required, Validators.maxLength(250)]],
        APP_DOB: [this.selctedElementToEdit?.APP_DOB || '', [Validators.required]],
        APP_AGE: [{ value: this.selctedElementToEdit?.APP_AGE || '', disabled: true }, , [Validators.required]],
        APP_GENDER: [this.selctedElementToEdit?.APP_GENDER || '', [Validators.required, Validators.maxLength(15)]],
        APP_MOB: [this.selctedElementToEdit?.APP_MOB || '', [Validators.maxLength(15), Validators.pattern('[0-9]*')]],
        APP_EMAIL: [this.selctedElementToEdit?.APP_EMAIL || '', [Validators.maxLength(50), Validators.email]],
        APP_NOYEARS: [this.selctedElementToEdit?.APP_NOYEARS || '', [Validators.pattern(/^\d+(\.\d{1,1})?$/)]],
        APP_REASON: [this.selctedElementToEdit?.APP_REASON || '', [Validators.maxLength(250)]],
        APP_CURRENTEMPLOYER: [this.selctedElementToEdit?.APP_CURRENTEMPLOYER || '', [Validators.maxLength(250)]],
        APP_NP: [{ value: this.selctedElementToEdit?.APP_NP || '', disabled: true }],
      });
    }

  }




  calculateAge(dob: Date) {
    // Calculate age based on the selected date of birth
    const currentDate = new Date();
    const birthDate = new Date(dob);
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    // Update the APP_AGE control with the calculated age
    this.applicantForm.get('APP_AGE').setValue(age);
  }

  onSubmit() {
    console.log(this.applicantForm.value);


    if (this.applicantForm.valid) {
      // let appDate = this.datePipe.transform(
      //   this.applicantForm.value.APP_DATE,
      //   'short'
      // );

      // let appDob = this.datePipe.transform(
      //   this.applicantForm.value.APP_DOB,
      //   'short'

      // );

      // this.applicantForm.patchValue({
      //   APP_DATE: appDate,
      //   APP_DOB: appDob
      // });

      // let data = this.applicantForm.value.
      // console.log(this.applicantForm.value);
      // const data = this.applicantForm.value;
      // const dataArray = Object.values(data);
      // this.demoData.push(dataArray);
      if (!this.isEdit) {
        this.save(this.applicantForm.value);
        this.applicantForm.reset();
        this.isEdit = false;
        Object.keys(this.applicantForm.controls).forEach(key => {
          this.applicantForm.get(key)?.setErrors(null);
        });
        this.fetchDataFromAPI();
      } else {
        this.update(this.selctedElementToEdit.APP_ID, this.applicantForm.value);
        this.applicantForm.reset();
        // location.reload();
        this.isEdit = false;
        Object.keys(this.applicantForm.controls).forEach(key => {
          this.applicantForm.get(key)?.setErrors(null);
        });
        this.fetchDataFromAPI();
      }
    } else {
      Object.keys(this.applicantForm.controls).forEach(key => {
        this.applicantForm.get(key)?.markAsTouched();
      });
    }

  }


  fetch() {
    this.apiService.fetch().subscribe((res: any) => {
      console.log(res);

    });
  }
  save(data: any) {
    this.apiService.save(data).subscribe((res: any) => {
      console.log(res);
    });
  }
  update(id: any, data: any) {
    this.apiService.update(id, data).subscribe((res: any) => {
      console.log(res);
    });
  }

  delete(id: any) {
    this.apiService.delete(id).subscribe((res: any) => {
      console.log(res);
    });
  }

  selctedElementToEdit: any
  isEdit = false;
  onEdit(item: any) {
    this.selctedElementToEdit = item;
    this.isEdit = true;
    this.loadForm();
  }
}
