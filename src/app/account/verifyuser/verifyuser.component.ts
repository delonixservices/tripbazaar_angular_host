import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verifyuser',
  templateUrl: './verifyuser.component.html',
  styleUrls: ['./verifyuser.component.css']
})
export class VerifyuserComponent implements OnInit {

  public otpObj: any;
  public validation: any;
  public token: any;
  public mobile: any;
  public userId: any;
  public modalRef: NgbModalRef;
  public chgMobileValidation;

  constructor(
    private router: Router,
    public api: ApiService,
    private route: ActivatedRoute,
    public modalService: NgbModal
  ) {
    this.otpObj = {
      otp: '',
      id: '',
    };
  }

  ngOnInit() {
    this.otpObj.id = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log(this.otpObj)
  }

  openModal(modal) {
    this.modalRef = this.modalService.open(modal);
  }

  otpsubmit() {
    if (this.otpObj.otp == "") {
      this.validation = "Require fields are empty";
    } else {
      this.api.get("/auth/verify", this.otpObj)
        .subscribe((response) => {
          if (response.status == 200) {
            this.router.navigate(['/account/login']);
          }
        }, (err) => {
          if (err.message !== undefined) {
            this.validation = err.message
          }
        })
    }
  }

  resentotp() {
    console.log('resend otp');
  }

  // changeMobile() {
  //   if (this.otpObj.otp == "") {
  //     this.chgMobileValidation = "Please enter mobile no";
  //   } else {
  //     this.api.post("/auth/changemobile", { id: this.userId, mobile: "8279877463" })
  //       .subscribe((response) => {
  //         if (response.status == 200) {
  //           this.chgMobileValidation = "";
  //           this.modalRef.close();
  //         }
  //       }, (err) => {
  //         if (err.message !== undefined) {
  //           this.chgMobileValidation = err.message
  //         }
  //       })
  //   }
  // }

}


