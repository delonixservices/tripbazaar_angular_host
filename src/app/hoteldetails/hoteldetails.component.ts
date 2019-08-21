import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { HttpParams } from "@angular/common/http";
import { Subject, Observable, of, concat } from 'rxjs';
import { ApiService, JwtService, AlertService } from '../core/services';

declare var $: any;

@Component({
	selector: 'app-hoteldetails-page',
	templateUrl: './hoteldetails.component.html',
	styleUrls: ['./hoteldetails.component.css']
})

export class HoteldetailsComponent implements OnInit {
	selectedArea: any;
	suggestions: any;
	checkInDate: any;
	checkOutDate: any;
	suggestionsLoading = false;
	hotelsearchkeys: any;
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


	constructor(private route: ActivatedRoute,
		private router: Router,
		public api: ApiService,
		public jwt: JwtService,
		public alertService: AlertService,
	) {

		this.hotelObj = JSON.parse(localStorage.getItem('hotelObj'));
		console.log('hotel search');
		console.log(this.hotelObj);
		this.math = Math;
		if (this.hotelObj === undefined || this.hotelObj == "" || this.hotelObj == null) {
			this.alertService.error("Please select correct hotel");
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.searchResult();
		this.loadDestination();
		this.selectedArea = this.hotelsearchkeys.area;
		this.checkInDate = this.hotelsearchkeys.checkindate;
		this.checkOutDate = this.hotelsearchkeys.checkoutdate;
		this.roomdetail = this.hotelsearchkeys.details;
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
			"room": '' + (this.roomdetail.length) + 1,
			"adult_count": "1",
			"child_count": "0",
			"children": []
		});
	}

	removeRoomFromSearch() {
		if (this.roomdetail.length > 1) {
			this.roomdetail.pop();
		}
	}

	checkChildren(index) {
		if (this.roomdetail[index].children.length > +this.roomdetail[index].child_count) {
			this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - +this.roomdetail[index].child_count);
		} else {
			for (var i = this.roomdetail[index].children.length; i < +this.roomdetail[index].child_count; i++) {
				this.roomdetail[index].children.push({ "child": i + 1, "age": "1" });
			}
		}
	}

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
				this.searchResult();
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

	searchResult() {
		this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));

		this.api.post("/search", this.hotelsearchkeys)
			.subscribe((response) => {
				if (response.data != undefined) {
					this.hotelObj.searchkey = this.hotelsearchkeys;
					console.log('searchkey');
					console.log(this.hotelObj.searchkey);
					// this.filteredHotels = response.data.hotels;
					localStorage.setItem('transaction_identifier', response.transaction_identifier);
					localStorage.setItem('searchObj', JSON.stringify(response.data.search));
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.validation = err.message
				}
			});
	}

	searchAvailability() {

	}
}
