import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { ILogin } from 'src/app/interfaces/auth/ILogin';
import { Messages, TokenHelper } from 'src/app/_common';
import { Patterns } from 'src/app/_common/Validators/patterns';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  LogIndata: ILogin;
  returnUrl: string;
  result: any;
  validationMessages = Messages.validation_messages
  loading: boolean;
  constructor(public formBuilder: FormBuilder, public router: Router, public authService: AuthService, private toastr: ToastrService) {
    this.LogIndata = {} as ILogin;
  }

  ngOnInit() {
    this.validateForm();
  }

  onSubmit() {
    this.LogIndata = this.form.value;
    this.authService.login(this.LogIndata).pipe(finalize(() => {
      this.form.reset();
      this.loading = false
    })).subscribe((result: any) => {
      if (result.token) {
        TokenHelper.setToken(result.token);
        localStorage.setItem("userId",result.id);
        this.router.navigateByUrl('/main/Dashboard')
      }
    });
  }

  validateForm() {
    this.form = this.formBuilder.group({
      userName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(Patterns.emailRegex)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ])),
      rememberMe: new FormControl(false, Validators.compose([
      ])),
    });
  }

}

