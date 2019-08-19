import { Component, OnInit, Input } from '@angular/core';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Subject, Observable, of, concat } from 'rxjs';
import { ApiService, JwtService, AlertService } from '../core/services';
import { Options, LabelType } from 'ng5-slider';

@Component({
	selector: 'app-searchresult-page',
	templateUrl: '././searchresult.component.html',
	styleUrls: ['././searchresult.component.css']
})

export class SearchresultComponent implements OnInit {

	selectedArea: any;
	suggestions: any;
	checkInDate: any;
	checkOutDate: any;
	suggestionsLoading = false;
	hotelsearchkeys: any;
	checkRecord = false;
	norecordfoundtitle;
	norecordfoundmsg;
	roomdetail = [{
		"room": "1",
		"adult_count": "1",
		"child_count": "0",
		"children": []
	}];
	suggestionsInput = new Subject<HttpParams>();

	public allHotel;
	public filteredHotels = [];
	public copyFilteredHotels = [];

	public validation: any;

	public RootTypeFilters = [
		{ name: "All", selected: true, value: ["Standard", "Deluxe", "Superior", "Triple"] },
		{ name: "Standard", selected: false, value: "Standard" },
		{ name: "Deluxe", selected: false, value: "Deluxe" },
		{ name: "Superior", selected: false, value: "Superior" },
		{ name: "Triple", selected: false, value: "Triple" },
	]

	public Refundable = [
		{ name: "All", selected: true, value: [true, false] },
		{ name: "Yes", selected: false, value: true },
		{ name: "No", selected: false, value: false },
	]

	public FoodServerd = [
		{ name: "All", selected: true, value: [1, 2] },
		{ name: "1 Serving", selected: false, value: 1 },
		{ name: "2 Serving", selected: false, value: 2 },
	]

	searchText = '';

	// ng-slider
	minHotelPrice: number = 5000;
	maxHotelPrice: number = 100000;
	options: Options = {
		floor: 5000,
		ceil: 100000,
		translate: (value: number, label: LabelType): string => {
			switch (label) {
				case LabelType.Low:
					return '<b>Min price:</b> &#8377;' + value;
				case LabelType.High:
					return '<b>Max price:</b> &#8377;' + value;
				default:
					return '&#8377;' + value;
			}
		}
	};

	constructor(public route: ActivatedRoute, private router: Router, public api: ApiService, public jwt: JwtService, public alertService: AlertService) {


	}

	hoteldetails(hotel) {
		if (hotel === undefined || hotel == "" || hotel == null) {
			this.alertService.error("Please Select correct hotel");
		} else {
			localStorage.setItem('hotelObj', JSON.stringify(hotel));
			this.router.navigate(['/hoteldetails']);
		}

	}

	priceFilter() {
		console.log('price filter');
		console.log('Min price = ' + this.minHotelPrice);
		console.log('Max price = ' + this.maxHotelPrice);
		this.filteredHotels = JSON.parse(JSON.stringify(this.copyFilteredHotels));

		this.filteredHotels = this.filteredHotels.filter((hotel) => {
			const chargeable_rate = hotel.rates.packages[0].chargeable_rate;
			return chargeable_rate >= this.minHotelPrice && chargeable_rate <= this.maxHotelPrice;
		});
		console.log(this.filteredHotels);
		if (this.filteredHotels.length <= 0) {
			this.norecordfoundtitle = "No Room available currently, Please look for some other option";
		} else {
			this.norecordfoundtitle = "";
		}
	}


	sideBarFilter() {
		// data.hotels[""0""].rates.packages[""0""].room_details.non_refundable
		// data.hotels[""0""].rates.packages[""0""].room_details.food
		// data.hotels[""0""].rates.packages[""0""].room_details.room_type
		// data.hotels[""0""].rates.packages[""0""].chargeable_rate
		// this.filteredHotels

		this.filteredHotels = JSON.parse(JSON.stringify(this.copyFilteredHotels));
		setTimeout(() => {
			const roomTypeFilter = [];
			for (let index = 0; index < this.RootTypeFilters.length; index++) {
				const element = this.RootTypeFilters[index];
				if (element.name === 'All') {
					continue;
				}
				if (element.selected === true) {
					roomTypeFilter.push(element.value);
				}
			}

			if (roomTypeFilter.length > 0) {
				this.filteredHotels = this.filteredHotels.filter(function (hotel) {
					return roomTypeFilter.includes(hotel.rates.packages[0].room_details.room_type);
				});
			}

			const refundableFilter = [];
			for (let index = 0; index < this.Refundable.length; index++) {
				const element = this.Refundable[index];
				if (element.name === 'All') {
					continue;
				}
				if (element.selected === true) {
					refundableFilter.push(element.value);
				}
			}

			if (refundableFilter.length > 0) {
				this.filteredHotels = this.filteredHotels.filter(function (hotel) {
					return refundableFilter.includes(hotel.rates.packages[0].room_details.non_refundable);
				});
			}

			const foodServerdFilter = [];
			for (let index = 0; index < this.FoodServerd.length; index++) {
				const element = this.FoodServerd[index];
				if (element.name === 'All') {
					continue;
				}
				if (element.selected === true) {
					foodServerdFilter.push(element.value);
				}
			}

			if (foodServerdFilter.length > 0) {
				this.filteredHotels = this.filteredHotels.filter(function (hotel) {
					return foodServerdFilter.includes(hotel.rates.packages[0].room_details.food);
				});
			}

			if (this.searchText) {
				this.filteredHotels = this.filteredHotels.filter(hotel => {
					return hotel && hotel.originalName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
				});
			}
		}, 0);
	}

	FilterHotels() {
		var refund;
		var roomtype;
		var foodserve;
		var i = 0;
		setTimeout(() => {


			for (let refundtype of this.Refundable) {
				if (i == 0) {
					if (refundtype.selected === true) {
						refund = refundtype.value;
						break;
					}

				} else {
					if (refundtype.selected === true) {
						refund.push(refundtype.value);
					}

				}
				i++;
			}

			i = 0;
			this.RootTypeFilters.map((type, index) => {
				console.log(index);
				console.log(type);
				if (index == 0) {
					if (type.selected == true) {
						roomtype = type.value;
						return true;
					}
				} else {
					if (type.selected == true) {
						roomtype.push(type.value);
					}
					this.norecordfoundtitle = "Opps";
					this.norecordfoundmsg = ' "No Room available currently, Please look for some other option " ';
				}

			});
			// for(let type of this.RootTypeFilters; let){
			// 	if(i == 0){
			// 		if(type.selected == true){
			// 			roomtype = type.value;
			// 			break;
			// 		}

			// 	}else{
			// 		if(type.selected == true){
			// 			roomtype.push(type.value);	
			// 		}
			// 	}
			// 	i++;
			// }

			i = 0;
			for (let food of this.FoodServerd) {
				if (i == 0) {
					if (food.selected === true) {
						foodserve = food.value;
						break;
					}

				} else {
					if (food.selected === true) {
						foodserve.push(food.value);
					}

				}
				i++;
			}

			// this.filteredHotels =  this.allHotel.hotels.filter(function(hotel) {
			this.filteredHotels = this.allHotel.filter(function (hotel) {
				// return true;
				return (roomtype.indexOf(hotel.rates.packages[0].room_details.room_type) > -1) && (foodserve.indexOf(hotel.rates.packages[0].room_details.food) > -1);
			});
		}, 200)
	}

	SearchFilter() {
		this.FilterHotels();
	}

	SearchFood() {
		// console.log(this.FoodServerd[0]);
		// console.log(this.FoodServerd[1]); 
		// console.log(this.FoodServerd[2]);
		// if((this.FoodServerd[1].selected == true && this.FoodServerd[2].selected == true) || (this.FoodServerd[1].selected == false && this.FoodServerd[2].selected == false)){
		// 	this.FoodServerd[0].selected = true;
		// 	this.FoodServerd[1].selected = false;
		// 	this.FoodServerd[2].selected = false;
		// 	console.log("yes");
		// }else{
		// 	this.FoodServerd[0].selected = false;
		// 	console.log("no");
		// }
		// console.log(this.FoodServerd);
		this.FilterHotels();
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
		// if(this.roomdetail[index].children.length > this.roomdetail[index].child_count){
		// 	this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - this.roomdetail[index].child_count);
		// }else{
		// 	for (var i=this.roomdetail[index].children.length; i<this.roomdetail[index].child_count; i++) {
		//       this.roomdetail[index].children.push({"child":i+1,"age":"1"});
		//     }

		// }
	}

	searchAgain() {

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
				this.searchResult();
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
					this.allHotel = response.data;
					this.filteredHotels = response.data.hotels;
					this.copyFilteredHotels = JSON.parse(JSON.stringify(this.filteredHotels))
					localStorage.setItem('transaction_identifier', response.transaction_identifier);
					localStorage.setItem('searchObj', JSON.stringify(response.data.search));

				} else {
					this.norecordfoundtitle = "Opps";
					this.norecordfoundmsg = ' "No Room available currently, Please look for some other option " ';
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.validation = err.message
				}
			});
	}

	ngOnInit() {
		localStorage.removeItem('transaction_identifier');
		localStorage.removeItem('searchObj');
		localStorage.removeItem('packageObj');
		localStorage.removeItem('hotelObj');

		this.searchResult();
		this.loadDestination();
		this.selectedArea = this.hotelsearchkeys.area;
		this.checkInDate = this.hotelsearchkeys.checkindate;
		this.checkOutDate = this.hotelsearchkeys.checkoutdate;
		this.roomdetail = this.hotelsearchkeys.details;


	}
}
