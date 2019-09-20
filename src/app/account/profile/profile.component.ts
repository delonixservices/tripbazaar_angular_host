import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  public showEditProfile: any;
  private userId: any;
  public firstName;
  public lastName;
  public email;
  public password;
  public phone;

  public profile: any = {};

  public changePassModalRef: NgbModalRef;
  public changePhoneModalRef: NgbModalRef;
  public currentPassword: any;
  public newPassword: any;
  public confirmPassword: any;

  public validation;
  public changePassValidation;
  public changePhoneValidation;

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.api.get('/auth/me').subscribe((response) => {
      if (response && response.status === 200) {
        console.log(response.data);
        this.profile = response.data;
        this.userId = response.data._id;
        this.firstName = response.data.name;
        this.lastName = response.data.last_name;
        this.email = response.data.email;
        this.password = "**********";
        this.phone = response.data.mobile;
      }
    }, (err) => {
      this.router.navigate(['/account/login']);
    });
  }

  toggleEditProfile() {
    this.showEditProfile = !this.showEditProfile;
  }

  editProfile() {

    if (!this.userId || !this.firstName || !this.lastName || !this.email) {
      this.validation = "Required fields are empty";
      return true;
    }

    this.api.post('/auth/profile', {
      id: this.userId,
      name: this.firstName,
      last_name: this.lastName,
      email: this.email,
    }).subscribe((response) => {
      if (response && response.data) {
        this.profile = response.data;
        this.firstName = response.data.name;
        this.lastName = response.data.last_name;
        this.email = response.data.email;
        this.showEditProfile = false;
        this.authService.getLoggedInUser.next(this.firstName);
        this.validation = "";
        console.log(response);
      }
    }, (err) => {
      console.log(err);
      this.validation = "Unable to update the profile";
    });
  }

  openChangePassModal(changePassModal) {
    this.changePassModalRef = this.modalService.open(changePassModal);
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.changePassValidation = "Required fields are empty";
      return true;
    }
    if (this.currentPassword === this.newPassword) {
      this.changePassValidation = "New password cannot be same as current password";
      return true;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.changePassValidation = "New password and confirm password do not match";
      return true;
    }

    this.api.post('/auth/password', {
      password: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe((response) => {
      console.log(response);
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.changePassValidation = "";
      this.changePassModalRef.close();
    }, (err) => {
      console.log(err);
      this.changePassValidation = "Unable to change the password";
    })
  }

  openChangePhoneModal(changePhoneModal) {
    this.changePhoneModalRef = this.modalService.open(changePhoneModal);
  }
}
