import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private infoMessages: any;
  public forgotPasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.translateService.stream([
      'info-messages',
    ]).subscribe(translations => {
      this.infoMessages = translations['info-messages']
    });
   }

   get email() { 
    return this.forgotPasswordForm.get('email'); 
  }

   async sendEmail() {
    try {
      this.spinner.show();
      await this.authService.sentResetPasswordEmail(this.email.value);
      this.toastService.success(`${this.infoMessages.emailSent}`);
      this.spinner.hide();
      this.route.navigate(['']);
    } catch(e) {
      this.spinner.hide();
      this.toastService.error(e.message);
    }
   }

}
