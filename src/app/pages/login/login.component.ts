import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { Router, Params } from '@angular/router';
import { StitchDBService } from '../../services/stitch-db.service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder,  private stitchDB:StitchDBService,private router: Router ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      console.log(values);
      //stitchClient.login('<user-email>', '<user-password>');
      
      this.stitchDB.login(values.email, values.password).then(rslt=>{
          console.log("Login success");
          console.log(rslt);
           this.router.navigate(['/pages/blogs']);
      },
      err=>{
        console.log("Error in login");
        console.log(err);
      })
      
    }
  }
}
