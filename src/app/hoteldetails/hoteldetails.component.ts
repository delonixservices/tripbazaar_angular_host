import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, takeUntil } from 'rxjs/operators'
import { HttpParams } from "@angular/common/http";
import { Subject, Observable, of, concat } from 'rxjs';
import { ApiService, JwtService, AlertService } from '../core/services';

@Component({
	selector: 'app-hoteldetails-page',
	templateUrl: './hoteldetails.component.html',
	styleUrls: ['./hoteldetails.component.css']
})

export class HoteldetailsComponent implements OnInit, OnDestroy {
	suggestions: any;
	private ngUnsubscribe = new Subject();

	selectedArea: any;
	checkInDate: any;
	checkOutDate: any;
	suggestionsLoading = false;
	hotelsearchkeys: any;
	hoteldetailkeys: any;
	guests: number = 1;
	roomdetail = [{
		"room": "1",
		"adult_count": "1",
		"child_count": "0",
		"children": []
	}];
	suggestionsInput = new Subject<HttpParams>();
	public validation: any;
	public hotelObj: any = "";
	public math: any;
	public display: any;

	// for getting food type from food code, eg: foodCode 1 = Room Only
	public foodType = [
		"",
		"Room Only",
		"Breakfast",
		"Lunch",
		"Dinner",
		"Half Board: Could be any 2 meals (e.g.breakfast and lunch, lunch and dinner",
		"Full Board: Breakfast, lunch and dinner",
		"All Inclusive"
	];

	constructor(private route: ActivatedRoute,
		private router: Router,
		public api: ApiService,
		public jwt: JwtService,
		public alertService: AlertService,
	) {

		this.hotelObj = JSON.parse(localStorage.getItem('hotelObj'));
		this.math = Math;
		if (this.hotelObj === undefined || this.hotelObj == "" || this.hotelObj == null) {
			this.alertService.error("Please select correct hotel");
			this.router.navigate(['/searchresult']);
		}
	}

	ngOnInit() {
		// this.searchResult();
		this.loadHotelDetails();
		this.loadDestination();
		// Changes Ankit
		this.selectedArea = this.hoteldetailkeys.area;
		this.checkInDate = this.hoteldetailkeys.checkindate;
		this.checkOutDate = this.hoteldetailkeys.checkoutdate;
		this.roomdetail = this.hoteldetailkeys.details;
		// this.selectedArea = this.hotelsearchkeys.area;
		// this.checkInDate = this.hotelsearchkeys.checkindate;
		// this.checkOutDate = this.hotelsearchkeys.checkoutdate;
		// this.roomdetail = this.hotelsearchkeys.details;
	}

	// No of nights in hotel
	getNoOfNights() {
		const checkIn = new Date(this.checkInDate).getTime();
		const checkOut = new Date(this.checkOutDate).getTime();
		return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
	}

	// changes Ankit
	// Load hotel details
	loadHotelDetails() {
		this.hoteldetailkeys = JSON.parse(localStorage.getItem('hoteldetailkeys'));
		this.api.post("/search", this.hoteldetailkeys)
			// Added Ankit	
			// emit values until provided observable i.e ngUnsubscribe emits
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((response) => {
				if (response.data != undefined) {
					console.log(response);
					this.hotelObj = response.data.hotels[0];
					this.hotelObj.rates.packages.sort((a, b) => a.chargeable_rate - b.chargeable_rate);
					this.hotelObj.searchkey = this.hoteldetailkeys;
					localStorage.setItem('hotelObj', JSON.stringify(response.data.hotels[0]));
					localStorage.setItem('transaction_identifier', response.transaction_identifier);
					localStorage.setItem('searchObj', JSON.stringify(response.data.search));
				}
			}, (err) => {
				console.log('Cannot get hotel packages ', err);
				if (err.message !== undefined) {
					this.validation = err.message
				}
				this.hoteldetailkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));
				this.hotelObj.searchkey = this.hoteldetailkeys;
			});
	}

	selectPackage(hotelPackage) {
		if (hotelPackage === undefined || hotelPackage == "" || hotelPackage == null) {
			this.alertService.error("Please Select correct hotel package");
		} else {
			localStorage.setItem('packageObj', JSON.stringify(hotelPackage));
			this.router.navigate(['/hotelbooking']);
		}
	}

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

	// CHANGES ANKIT
	checkChildren(index) {
		if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
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
	}

	// COMMENTED ANKIT
	// checkChildren(index) {
	// 	if (this.roomdetail[index].children.length > +this.roomdetail[index].child_count) {
	// 		this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - +this.roomdetail[index].child_count);
	// 	} else {
	// 		for (var i = this.roomdetail[index].children.length; i < +this.roomdetail[index].child_count; i++) {
	// 			this.roomdetail[index].children.push({ "child": i + 1, "age": "1" });
	// 		}
	// 	}
	// }

	searchAgain() {
		this.display = "d-none";
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
				this.hotelObj.searchkey = this.hotelsearchkeys;
				// this.searchResult();
				this.router.navigate(['/searchresult']);
			}

		} else {
			this.alertService.error("All fields are required!");
		}
	}


	loadDestination() {
		this.suggestions = concat(
			of([]),
			this.suggestionsInput.pipe(
				debounceTime(800),
				distinctUntilChanged(),
				tap(() => this.suggestionsLoading = true),
				switchMap(term => this.api.get("/suggest", term).pipe(
					catchError(() => of([])), // empty list on error
					tap(() => this.suggestionsLoading = false)
				))
			)
		);
	}

	// searchResult() {
	// 	this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));
	// 	console.log(this.hotelsearchkeys);
	// 	this.api.post("/search", this.hotelsearchkeys)
	// 		.subscribe((response) => {
	// 			if (response.data != undefined) {
	// 				this.hotelObj.searchkey = this.hotelsearchkeys;
	// 				// this.filteredHotels = response.data.hotels;
	// 				localStorage.setItem('transaction_identifier', response.transaction_identifier);
	// 				localStorage.setItem('searchObj', JSON.stringify(response.data.search));
	// 			}
	// 		}, (err) => {
	// 			if (err.message !== undefined) {
	// 				this.validation = err.message
	// 			}
	// 		});
	// }

	searchAvailability() { }

	// Scroll into view
	scroll(el: HTMLElement) {
		el.scrollIntoView();
	}

	ngOnDestroy() {
		// Added Ankit
		// Unsubscribing the observable after component is destroyed - prevents memory leak
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
