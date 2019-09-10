import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Subject, Observable, of, concat } from 'rxjs';
import { ApiService, JwtService, AlertService, AuthService } from '../core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-hotelbooking-page',
	templateUrl: './hotelbooking.component.html',
	styleUrls: ['./hotelbooking.component.css']
})

export class HotelbookingComponent implements OnInit, OnDestroy {

	@ViewChild('form') form: ElementRef;
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
	public discountedPrice;
	public hotelsearchkeys: any;
	public transaction_identifier: any;
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

	constructor(private route: ActivatedRoute,
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

		// this.Number = Number;
		this.searchObj = JSON.parse(localStorage.getItem('searchObj'));
		this.packageObj = JSON.parse(localStorage.getItem('packageObj'));
		this.hotelObj = JSON.parse(localStorage.getItem('hotelObj'));
		this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));
		this.transaction_identifier = localStorage.getItem('transaction_identifier')

		if (this.packageObj === undefined || this.packageObj == "" || this.packageObj == null || this.searchObj === undefined || this.searchObj == "" || this.searchObj == null || this.hotelObj === undefined || this.hotelObj == "" || this.hotelObj == null || this.hotelsearchkeys === undefined || this.hotelsearchkeys == "" || this.hotelsearchkeys == null || this.transaction_identifier === undefined || this.transaction_identifier == "" || this.transaction_identifier == null) {
			this.alertService.error("Something went wrong! Please search Again1");
			this.router.navigate(['/searchresult']);
		}
	}

	ngOnInit() {
		this.loadBookingPolicy();
		this.checkInDate = this.searchObj.check_in_date;
		this.checkOutDate = this.searchObj.check_out_date;

		this.hotelsearchkeys.details.map((room, index) => {
			var roomGuest = [];
			for (let i = 1; i <= room.adult_count; i++) {
				roomGuest.push({ "firstname": "", "lastname": "", "mobile": "" });
			}
			var roomObj = { "room_guest": roomGuest };
			this.guest.push(roomObj);
		});

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

	hotelPreBook() {
		const isMobileValid = this.contactDetail.mobile !== "" && this.contactDetail.mobile.length === 10 ? true : false;

		if (this.contactDetail.last_name == undefined || this.contactDetail.name == undefined || !isMobileValid) {
			this.contactDetailsValidation = "All the fields are required";
			return true;
		}

		const prebookParams = {
			"hotel": this.hotelObj,
			"package": this.packageObj,
			"booking_policy": this.booking_policy,
			"search": this.searchObj,
			"guest": this.guest,
			"transaction_id": this.transaction_identifier,
			"contactDetail": this.contactDetail,
			"coupon": this.couponCode,
			"gstDetail": this.gstDetail
		}
		console.log('prebookParams', prebookParams);

		this.api.post("/prebook", prebookParams)
			// Added Ankit	
			// emit values until provided observable i.e ngUnsubscribe emits
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((response) => {
				if (response && response.data && response.data.booking_id !== undefined) {
					let url = this.api.baseUrl + "api/process-payment/" + response.data.booking_id;
					window.location.assign(url);
				} else {
					this.alertService.error("Something Went Wrong Try again.2");
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.alertService.error(err.message);
					this.validation = err.message
				} else
					this.alertService.error("Something Went Wrong Try again.3");
			});
	}

	// hotelBook() {
	// 	this.api.post("/book", { "bookingid": this.bookingid, "transactionid": this.transactionid })
	// 		.subscribe((response) => {
	// 			if (response.data != undefined) {
	// 				localStorage.removeItem('transaction_identifier');
	// 				localStorage.removeItem('searchObj');
	// 				localStorage.removeItem('packageObj');
	// 				localStorage.removeItem('hotelObj');
	// 				localStorage.removeItem('hotelsearchkeys');
	// 				this.router.navigate(['/']);
	// 			}
	// 		}, (err) => {
	// 			if (err.message !== undefined) {
	// 				this.validation = err.message
	// 			}
	// 		});
	// }

	loadBookingPolicy() {
		this.api.post("/bookingpolicy", { "package": this.packageObj, "search": this.searchObj, "transaction_id": this.transaction_identifier })
			// Added Ankit	
			// emit values until provided observable i.e ngUnsubscribe emits
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((response) => {
				if (response && response.data !== undefined) {
					this.booking_policy = response.data;
					console.log(this.booking_policy)
				} else {
					this.alertService.error("Something Went Wrong Try again.4");
					console.log(response)
					this.router.navigate(['/searchresult']);
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.alertService.error("Something Went Wrong Try again.5");
					this.validation = err.message;
					this.router.navigate(['/searchresult']);
				}
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
							this.discountedPrice = Math.ceil(this.packageObj.chargeable_rate_with_tax_excluded - this.packageObj.chargeable_rate_with_tax_excluded / 100 * (this.couponCode.value));
						} else {
							this.discountedPrice = Math.ceil(this.packageObj.chargeable_rate_with_tax_excluded - this.couponCode.value);
						}
					} else {
						this.alertService.error("Something Went Wrong Try again.6");
					}
				}, (err) => {
					if (err.message !== undefined) {
						this.couponValidation = err.message
					}
				})
		}
	}

	deleteCoupon() {
		this.couponCode = {
			name: '',
			type: '',
			value: 0
		};
		this.discountedPrice = "";

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

	ngOnDestroy() {
		// Added Ankit
		// Unsubscribing the observable after component is destroyed - prevents memory leak
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
