import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService, JwtService, AlertService, AuthService } from '../../core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hotelbooking-page',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css']
})

export class HotelbookingComponent implements OnInit, OnDestroy {

  @ViewChild('form', { static: false }) form: ElementRef;

  private ngUnsubscribe = new Subject();

  public searchObj: any;
  public packageObj: any;
  public hotelObj: any;
  public validation: any;
  public loginValidation: any;
  public couponValidation: any;
  public contactDetailsValidation: any;
  public memberDetailsValidation: any;
  public booking_policy: any;
  public paramsObj: any;
  public loginUser: any;
  public checkInDate: any;
  public checkOutDate: any;
  public contactDetail = { "name": "", "last_name": "", "mobile": "", "email": "" };
  public gstDetail = { "gstnumber": "", "name": "", "email": "", "address": "", "city": "", "pincode": "", "state": "", "mobile": "" };
  public coupon = { "code": "" };
  public hotelsearchkeys: any = {};
  public transaction_identifier: string;
  public guest: any = [];
  public couponCode = {
    name: '',
    'value': 0,
    type: ''
  };
  //public Number;
  public bookingid: any;
  public transactionid: any;
  public modalRef: any;
  public userAgree: boolean = true;
  bookingKey: any;
  hotelId: any;

  public baseAmount: number;
  public chargeableRate: number;
  public serviceCharge: number;
  public processingFee: number;
  public gst: number;
  public discountedPrice: number;

  public hoteldetailparams: any;


  constructor (private route: ActivatedRoute,
    private router: Router,
    public api: ApiService,
    public jwt: JwtService,
    public authService: AuthService,
    public alertService: AlertService,
    public modalService: NgbModal
  ) {

    if (this.jwt.isAuth()) {
      this.api.get("/auth/me")
        // Added Ankit	
        // emit values until provided observable i.e ngUnsubscribe emits
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response) => {
          if (response.status == 200) {
            this.loginUser = response.data;
            this.contactDetail = response.data;
            // this.gstDetail = response.data;
          }
        }, (err) => {
          this.paramsObj = {
            mobile: '',
            password: ''
          };
        })
    } else {
      this.paramsObj = {
        mobile: '',
        password: ''
      };
    }

    this.hoteldetailparams = JSON.parse(localStorage.getItem('hoteldetailparams'));

    // this.Number = Number;
    this.searchObj = JSON.parse(localStorage.getItem('searchObj'));
    this.packageObj = JSON.parse(localStorage.getItem('packageObj'));
    this.hotelObj = JSON.parse(localStorage.getItem('hotelObj'));
    // // this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));
    const transaction_identifier = localStorage.getItem('transaction_identifier');
    if (transaction_identifier)
      this.transaction_identifier = transaction_identifier;

    if (this.packageObj === undefined || this.packageObj == "" || this.packageObj == null || this.searchObj === undefined || this.searchObj == "" || this.searchObj == null || this.hotelObj === undefined || this.hotelObj == "" || this.hotelObj == null || this.hotelsearchkeys === undefined || this.hotelsearchkeys == "" || this.hotelsearchkeys == null || this.transaction_identifier === undefined || this.transaction_identifier == "" || this.transaction_identifier == null) {
      // this.alertService.error("Something went wrong! Please search Again");
      // this.router.navigate(['/hotels/searchresult']);
    }

    this.chargeableRate = this.packageObj.chargeable_rate;
    this.baseAmount = this.packageObj.base_amount;
    this.serviceCharge = this.packageObj.service_charge;
    this.processingFee = this.packageObj.processing_fee;
    this.gst = this.packageObj.gst;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.search)
        this.searchObj = JSON.parse(params.search);
      this.bookingKey = params.bookingKey;
      this.hotelId = params.hotelId;
      // this.transaction_identifier = params.transaction_identifier;

      // currently not using ==>
      if (typeof (params.details) === "string") {
        this.hotelsearchkeys.details = JSON.parse(params.details);
        console.log(this.hotelsearchkeys.details)
        this.hotelsearchkeys.details.forEach((room, index) => {
          console.log(room)
          let roomGuest = [];
          for (let i = 0; i < parseInt(room.adult_count); i++) {
            roomGuest.push({ "firstname": "", "lastname": "", "mobile": "", "nationality": "IN" });
          }
          let roomObj = { "room_guest": roomGuest };
          this.guest.push(roomObj);
        });
      }
      // <==

      console.log(this.hotelObj);
      console.log(this.guest);

      this.loadBookingPolicy();

      this.checkInDate = this.searchObj.check_in_date;
      this.checkOutDate = this.searchObj.check_out_date;


    }, (err) => {
      console.log(err);
    });

    // this.loadBookingPolicy();

    // this.checkInDate = this.searchObj.check_in_date;
    // this.checkOutDate = this.searchObj.check_out_date;

    // this.hotelsearchkeys.details.map((room, index) => {
    // 	var roomGuest = [];
    // 	for (let i = 1; i <= room.adult_count; i++) {
    // 		roomGuest.push({ "firstname": "", "lastname": "", "mobile": "" });
    // 	}
    // 	var roomObj = { "room_guest": roomGuest };
    // 	this.guest.push(roomObj);
    // });

    // @TODO Resolve problem in gst route
    // this.api.get("/getgstdetails").subscribe((response) => {
    // 	if (response.status == 200) {
    // 		if (response.data.length > 0) {
    // 			// console.log(response.data);
    // 			this.gstDetail = response.data[0];
    // 		}
    // 	}
    // }, (err) => {
    // 	if (err.message !== undefined) {
    // 		this.validation = err.message
    // 	}
    // })
  }

  // No of nights in hotel
  getNoOfNights() {
    const checkIn = new Date(this.searchObj.check_in_date).getTime();
    const checkOut = new Date(this.searchObj.check_out_date).getTime();
    return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  openModal(logInModal) {
    this.modalRef = this.modalService.open(logInModal);
  }

  openBkgPolicyModal(bgkPolicyModal) {
    this.modalService.open(bgkPolicyModal);
  }

  openCancellationPolicyModal(cancellationPolicyModal) {
    this.modalService.open(cancellationPolicyModal);
  }

  login() {
    if (this.paramsObj.mobile === "" || this.paramsObj.password === "") {
      this.loginValidation = "Require fields are empty";
    } else {
      this.authService.login(this.paramsObj, (data, err) => {
        if (err) {
          if (err.message !== undefined)
            this.loginValidation = err.message
        } else {
          this.modalRef.close();
          this.loginUser = data.user;
          this.contactDetail = data.user;
        }
      });

      // this.api.post("/auth/login", this.paramsObj)
      // 	.subscribe((response) => {
      // 		if (response.status == 200) {
      // 			this.jwt.saveToken(response.data.token, response.data.refreshToken);
      // 			this.loginUser = response.data.user;
      // 			this.contactDetail = response.data.user;
      // 			// if(this.guest[0].firstname == "" || this.guest[0].firstname === undefined){
      // 			// 	this.guest[0].firstname = contactDetail.name;
      // 			// 	this.guest[0].mobile = contactDetail.mobile;
      // 			// }
      // 		}
      // 	}, (err) => {
      // 		if (err.message !== undefined) {

      // 		}
      // 	})
    }
  }

  loadBookingPolicy() {
    this.api.post("/hotels/bookingpolicy", { "hotelId": this.hotelId, "bookingKey": this.bookingKey, "search": this.searchObj, "transaction_id": this.transaction_identifier })
      // this.api.loadData("/hotelBookingpolicy.json")
      // Added Ankit	
      // emit values until provided observable i.e ngUnsubscribe emits
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response && response.data) {
          this.booking_policy = response.data;
          this.packageObj = response.data.package;

          this.chargeableRate = this.packageObj.chargeable_rate;
          this.baseAmount = this.packageObj.base_amount;
          this.serviceCharge = this.packageObj.service_charge;
          this.processingFee = this.packageObj.processing_fee;
          this.gst = this.packageObj.gst;

          console.log(this.booking_policy);
        } else {
          this.alertService.error("Something Went Wrong Try again.");
          console.log(response)
          this.router.navigate(['/hotels/searchresult']);
        }
        localStorage.removeItem('transaction_identifier');
      }, (err) => {
        if (err.message !== undefined) {
          this.validation = err.message;
        }
        localStorage.removeItem('transaction_identifier');
        this.alertService.error("Selected hotel package booked! Please select another package.");
        this.router.navigate(['/hotels/hoteldetails'], { queryParams: this.hoteldetailparams });

      });
  }

  hotelPreBook() {
    const isMobileValid = this.contactDetail.mobile !== "" && this.contactDetail.mobile.length === 10 ? true : false;

    if (this.contactDetail.last_name == undefined || this.contactDetail.name == undefined || !isMobileValid) {
      this.contactDetailsValidation = "All the fields are required";
      this.contactDetail.name = "";
      console.log(this.contactDetail);
      return;
    }

    if (!this.userAgree) {
      this.validation = "Please accept Hotel booking Policy and Terms of Service to proceed.";
      return;
    }

    const prebookParams = {
      // "hotel": this.hotelObj,
      // "package": this.packageObj,
      "booking_policy_id": this.booking_policy.booking_policy_id,
      "search": this.searchObj,
      "transaction_id": this.transaction_identifier,
      "contactDetail": this.contactDetail,
      "coupon": this.couponCode,
      "gstDetail": this.gstDetail,
      "guest": this.guest
    }
    console.log('prebookParams', prebookParams);

    this.api.post("/hotels/prebook", prebookParams)
      // Added Ankit	
      // emit values until provided observable i.e ngUnsubscribe emits
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response && response.data && response.data.booking_id !== undefined) {
          let url = this.api.baseUrl + "api/hotels/process-payment/" + response.data.booking_id;
          window.location.assign(url);
        } else {
          this.alertService.error("Something Went Wrong Try again");
          this.router.navigate(['/hotels/hoteldetails'], { queryParams: this.hoteldetailparams });
        }
        // remove transaction identifier after one transaction is completed
        localStorage.removeItem('transaction_identifier');
      }, (err) => {
        localStorage.removeItem('transaction_identifier');
        this.alertService.error("Booking session expired! Please try again.");
        console.log(err);
        this.router.navigate(['/hotels/hoteldetails'], { queryParams: this.hoteldetailparams });
      });
  }

  checkCopuonCode() {
    if (this.coupon.code == undefined) {
      this.alertService.error("Required fields are empty");
    } else {
      this.api.post("/couponCheck", this.coupon)
        // Added Ankit	
        // emit values until provided observable i.e ngUnsubscribe emits
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response) => {
          if (response.code != undefined) {
            this.couponCode = response.code;
            if (this.couponCode.type == 'Percentage') {
              // this.discountedPrice = Math.ceil(this.packageObj.chargeable_rate - this.packageObj.chargeable_rate / 100 * (this.couponCode.value));
              this.discountedPrice = Math.ceil(this.chargeableRate - (this.baseAmount / 100 * this.couponCode.value));
            } else {
              // this.discountedPrice = Math.ceil(this.packageObj.chargeable_rate - this.couponCode.value);
              this.discountedPrice = Math.ceil(this.chargeableRate - this.couponCode.value);
            }
            this.couponValidation = "";
          } else {
            this.alertService.error("Something Went Wrong Try again.6");
          }
        }, (err) => {
          this.deleteCoupon();
          this.couponValidation = "Sorry! Invalid coupon code";
        })
    }
  }

  deleteCoupon() {
    this.couponCode = {
      name: '',
      type: '',
      value: 0
    };
    this.discountedPrice = 0;

    this.coupon = {
      code: ''
    };
  }

  gstSubmit() {
    if (this.gstDetail.gstnumber == "" || this.gstDetail.name == "" || this.gstDetail.email == "" || this.gstDetail.mobile == "" || this.gstDetail.city == "" || this.gstDetail.pincode == "" || this.gstDetail.address == "" || this.gstDetail.state == "") {
      this.validation = "Require fields are empty";
    } else {
      this.api.post("/gstupdate", this.gstDetail)
        // Added Ankit	
        // emit values until provided observable i.e ngUnsubscribe emits
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response) => {
          if (response.data != undefined) {
            console.log(response);
            this.gstDetail = response.data;
            console.log(this.gstDetail);
            this.alertService.success("Your GST Details Successfully Updated.");
          }
        }, (err) => {
          if (err.message !== undefined) {
            this.validation = err.message
          }
        })
    }
  }

  checkUserAgree() {
    this.userAgree = !this.userAgree;
    console.log(this.userAgree);
  }

  ngOnDestroy() {
    // Added Ankit
    // Unsubscribing the observable after component is destroyed - prevents memory leak
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
