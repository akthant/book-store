import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UntypedFormControl, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  bookForm: UntypedFormGroup;
  isbn:string='';
  title:string='';
  description:string='';
  author:string='';
  publisher:string='';
  published_year:string='';
  constructor(private router: Router, private api: ApiService, private formBuilder: UntypedFormBuilder) { }

  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      'isbn' : [null, Validators.required],
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
      'author' : [null, Validators.required],
      'publisher' : [null, Validators.required],
      'published_year' : [null, Validators.required]
    });
  }
  onFormSubmit(form:NgForm) {
    this.api.postBook(form)
      .subscribe(res => {
          let id = res['_id'];
          this.router.navigate(['/book-details', id]);
        }, (err) => {
          console.log(err);
        });
  }
}
  /** Error when invalid control is dirty, touched, or submitted. */
  export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
  }