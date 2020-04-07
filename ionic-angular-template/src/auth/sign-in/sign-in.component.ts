import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  private infoMessages: any;
  public signInForm: FormGroup;
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
    this.signInForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get email() { 
    return this.signInForm.get('email'); 
  }

  get password() { 
    return this.signInForm.get('password'); 
  }

  async signIn() {
    this.spinner.show();
    const email = this.email.value;
    const password = this.password.value;
    try {
      const checkEmailVerified = await this.authService.checkUserEmailVerified(email, password);
      if (!checkEmailVerified) {
        this.spinner.hide();
        this.showInfoAlert();
        }
        await this.authService.getUserData();
        this.spinner.hide();
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
          message,
          buttons: [`${this.infoMessages.button}`]
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