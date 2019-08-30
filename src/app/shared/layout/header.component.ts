import { Component, OnInit, Input, ViewChild, HostListener, ElementRef } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Subject, Observable, of, concat } from 'rxjs';
import { ApiService, JwtService, AuthService, AlertService } from '../../core/services';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
	selector: 'app-layout-header',
	templateUrl: './header.component.html',
	host: { '(document:click)': 'hostClick($event)' }
})

export class HeaderComponent implements OnInit {

	@Input() nav: string;
	selectedArea: any;
	suggestions: any;

	checkInDateModel: NgbDateStruct;
	checkOutDateModel: NgbDateStruct;
	checkInDate: any;
	checkOutDate: any;

	suggestionsLoading = false;
	hotelsearchkeys: any;
	guests: number = 1;
	roomdetail = [{
		"room": "1",
		"adult_count": "1",
		"child_count": "0",
		"children": []
	}];

	isLoggedIn: boolean;
	user = {
		name: ""
	}
	todaydate = new Date();

	@ViewChild('checkIn') checkIn: any;
	@ViewChild('checkOut') checkOut: any;
	@ViewChild('checkInContainer') checkInContainer: ElementRef;
	@ViewChild('checkOutContainer') checkOutContainer: ElementRef;

	suggestionsInput = new Subject<HttpParams>();

	constructor(public route: ActivatedRoute,
		public router: Router,
		public api: ApiService,
		public jwt: JwtService,
		private authService: AuthService,
		public alertService: AlertService,
		public ngbDateParserFormatter: NgbDateParserFormatter,
		public dpConfig: NgbDatepickerConfig
	) {
		const date = new Date();
		console.log(date.getMonth())
		dpConfig.minDate = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	}

	ngOnInit() {
		if (this.jwt.isAuth()) {
			if (this.user.name === "") {
				this.getLoggedInUser();
			}
			else {
				this.isLoggedIn = false;
			}
		} else {
			this.isLoggedIn = false;
			console.log('Not auth');
		}

		this.authService.getLoggedInUser.subscribe(name => {
			if (name) {
				this.isLoggedIn = true;
				this.user.name = <string>name;
			} else {
				this.isLoggedIn = false;
				this.user.name = "";
			}
		});

		/*Bootstrap DatePicker*/

		// this.getLoggedInUser();

		// 	localStorage.removeItem('transaction_identifier');
		// localStorage.removeItem('searchObj');
		// 	localStorage.removeItem('packageObj');
		// 	localStorage.removeItem('hotelObj');
		// localStorage.removeItem('hotelsearchkeys');
		this.loadDestination();

		// $.getScript('./assets/lib/js/app.js');

		// $('document').ready(() => {
		// 	console.log('ready');
		// 	$(".checkInDate").datepicker().on("changeDate", (evt) => {
		// 		console.log('checkin ' + evt.date);
		// 		var date = evt.date;
		// 		// var d = date.getDate();
		// 		var d = `${date.getDate()}`.padStart(2, '0');
		// 		// var m = date.getMonth() + 1;
		// 		// var m =	{date.getMonth() + 1}.padStart(2, '0');
		// 		var m = `${date.getMonth() + 1}`.padStart(2, '0');
		// 		var y = date.getFullYear();
		// 		this.checkInDate = y + '-' + m + '-' + d;
		// 		// console.log(this.checkInDate);
		// 	});

		// 	$(".checkOutDate").datepicker().on("changeDate", (evt) => {
		// 		console.log('checkout ' + evt.date);
		// 		var date = evt.date;
		// 		var d = `${date.getDate()}`.padStart(2, '0');
		// 		var m = `${date.getMonth() + 1}`.padStart(2, '0');
		// 		var y = date.getFullYear();
		// 		// 2019-03-10
		// 		this.checkOutDate = y + '-' + m + '-' + d;
		// 		// console.log(this.checkOutDate);
		// 	});
		// });
	}

	hostClick(event: MouseEvent) {
		console.log(this.isLoggedIn)

		if (this.checkIn && this.checkIn.isOpen()) {
			if (this.checkInContainer && this.checkInContainer.nativeElement && !this.checkInContainer.nativeElement.contains(event.target)) {
				this.checkIn.close();
			}
		}
		if (this.checkOut && this.checkOut.isOpen()) {
			if (this.checkOutContainer && this.checkOutContainer.nativeElement && !this.checkOutContainer.nativeElement.contains(event.target)) {
				this.checkOut.close();
			}
		}
	}

	// prevent dropdown from closing when clicked inside
	preventDropdownClose(event: MouseEvent) {
		event.stopImmediatePropagation();
	}

	// format checkIn and checkOut dates
	onCheckInDateSelect(date: NgbDateStruct) {
		this.checkInDate = this.ngbDateParserFormatter.format(date);
	}

	onCheckOutDateSelect(date: NgbDateStruct) {
		this.checkOutDate = this.ngbDateParserFormatter.format(date);
	}

	// console.log(this.roomdetail);
	addRoomInSearch() {
		this.roomdetail.push({
			"room": '' + ((this.roomdetail.length) + 1),
			"adult_count": "1",
			"child_count": "0",
			"children": []
		});
	}

	removeRoomFromSearch() {
		console.log(this.roomdetail.length);
		if (this.roomdetail.length > 1) {
			this.roomdetail.pop();
		}
	}

	checkChildren(index) {
		console.log('room = ' + index);
		console.log('child_count = ' + Number(this.roomdetail[index].child_count));
		console.log(this.roomdetail[index]);

		if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
			// this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - Number(this.roomdetail[index].child_count));
			this.roomdetail[index].children.splice(Number(this.roomdetail[index].child_count), this.roomdetail[index].children.length + 1);
		} else {
			for (let i = 0; i < Number(this.roomdetail[index].child_count); i++) {
				console.log(this.roomdetail[index].children[i] === undefined);
				if (this.roomdetail[index].children[i] === undefined) {
					this.roomdetail[index].children[i] = { age: "1" };
				}
			}
		}
		console.log(this.roomdetail[index]);

		// if(this.roomdetail[index].children.length > this.roomdetail[index].child_count){
		// 	this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - this.roomdetail[index].child_count);
		// }else{
		// 	for (var i=this.roomdetail[index].children.length; i<this.roomdetail[index].child_count; i++) {
		//       this.roomdetail[index].children.push({"child":i+1,"age":"1"});
		//     }

		// }
	}

	doneClicked() {
		// console.log('dpdn clicked');
		let guests = 0;
		this.roomdetail.forEach((room) => {
			guests += Number(room.adult_count) + Number(room.child_count);
		});
		this.guests = guests;
		console.log('guests =' + this.guests);
	}

	search() {
		// console.log(this.checkInDate);
		if (this.selectedArea !== undefined && this.checkInDate !== undefined && this.checkOutDate !== undefined && this.roomdetail !== undefined) {
			var flag = true;
			loop1:
			for (let o of this.roomdetail) {
				for (let child of o.children) {
					if (child.age === undefined || child.age == "" || child.age > 11 || child.age < 0) {
						this.alertService.error("select correct age of child " + child.child + " in room " + o.room);
						flag = false;
						break loop1;
					}
				}
			}
			if (flag) {
				this.hotelsearchkeys = { "area": this.selectedArea, "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "details": this.roomdetail };
				localStorage.setItem('hotelsearchkeys', JSON.stringify(this.hotelsearchkeys));
				this.router.navigate(['/searchresult']);

				console.log(this.hotelsearchkeys);
			}
		} else {
			this.alertService.error("All fields are required!");
		}

	}


	loadDestination() {
		// console.log("loadDestination called");
		this.suggestions = concat(
			of([]),
			this.suggestionsInput.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => this.suggestionsLoading = true),
				switchMap(term => this.api.get("/suggest", term).pipe(
					catchError(() => of([])), // empty list on error
					tap(() => this.suggestionsLoading = false)
				))
			)
		);
	}

	logout() {
		this.authService.logout((success) => {
			this.router.navigate(['']);
		});
	}

	getLoggedInUser() {
		this.api.get("/auth/me")
			.subscribe((response) => {
				if (response.status == 200) {
					this.user.name = response.data.name;
					this.isLoggedIn = true;
				}
			}, (err) => {
				this.isLoggedIn = false;
				this.jwt.destroyToken();
				console.log('Jwt destroyed');
				console.log(`Unable to get logged in user: Error ${err.message}`);
			})
	}
}
