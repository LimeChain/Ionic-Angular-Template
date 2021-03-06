import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  private infoMessages: any;
  public signUpForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService
  ) {
    this.translateService.stream([
      'info-messages',
    ]).subscribe(translations => {
      this.infoMessages = translations['info-messages']
    });
   }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get email() { 
    return this.signUpForm.get('email'); 
  }

  get password() { 
    return this.signUpForm.get('password'); 
  }

  async signUp() {
    const email = this.email.value;
    const password = this.password.value;
    try {
        this.spinner.show();
        await this.authService.signUp(email, password);
        this.spinner.hide();
        await this.showInfoAlert();
        this.router.navigate(['']);
    } catch(e) {
      this.spinner.hide();
      this.showErrorAlert(e.message);
    }
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertCtrl
      .create({
        header: `${this.infoMessages.authFailed}`,
        message: message,
        buttons: ['Okay']
      })
      alert.present();
  }

  private async showInfoAlert() {
    const alert = await this.alertCtrl
      .create({
        header: `${this.infoMessages.infoMessage}`,
        message: `${this.infoMessages.message}`,
        buttons: [
          {
            text: `${this.infoMessages.button}`,
            handler: () => {
              this.toastService.success(`${this.infoMessages.successfullyLogged}`);
            }
          }
        ]
      })
      alert.present();
  }
}
