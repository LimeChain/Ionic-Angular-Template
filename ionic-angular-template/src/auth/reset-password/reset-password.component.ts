import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EqualValueValidator } from '../../validators/validator';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private infoMessages: any;
  public mode: string;
  public actionCode: string;
  public resetPasswordForm: FormGroup;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private equalValueValidator: EqualValueValidator,
    private tranlateService: TranslateService,
    private toastService: ToastService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), this.equalValueValidator.matchValues('newPassword')]]
    }) ;
    this.getActivatedRoute();
    this.tranlateService.get('info-messages').subscribe((messages) => {
      this.infoMessages = messages;
    });
  }
  
  getActivatedRoute() {
    this.activatedRoute.queryParams
    .subscribe(async (params) => {
      this.mode = params.mode;
      this.actionCode = params.oobCode;
  });
  }

  get newPassword() { 
    return this.resetPasswordForm.get('newPassword'); 
  }

  get confirmPassword() { 
    return this.resetPasswordForm.get('confirmPassword'); 
  }

  async resetPassword() {
    try {
      const newPassword = this.newPassword.value;
      const email = await this.authService.verifyPasswordResetCode(this.actionCode);
      await this.authService.resetPassword(newPassword, this.actionCode, email);
      this.toastService.success(`${this.infoMessages.passwordChanged}`)
      this.router.navigate(['/signin']);
    } catch(e) {
      this.toastService.error(e.message)
      }
    }
}
