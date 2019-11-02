import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ApiService, JwtService, AlertService } from '../../core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-searchresult-page',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css']
})

export class HotelSearchComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  selectedArea: any;
  suggestions: any;
  suggestionsLoading = false;
  checkInDate: any;
  checkOutDate: any;
  hotelsearchkeys: any = {};
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

  public transaction_identifier: string;
  public allHotel;
  public filteredHotels = [];
  public copyFilteredHotels = [];

  public validation: any;
  public modalRef: any;

  // for hotel-search-filter component
  minHotelPrice: number;
  maxHotelPrice: number;

  totalHotelsCount: any;

  constructor(public route: ActivatedRoute,
    private router: Router,
    public api: ApiService,
    public jwt: JwtService,
    public alertService: AlertService,
    public modalService: NgbModal
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    // commented Ankit
    // => creating problems when user is navigating from previous page to same page again
    // localStorage.removeItem('transaction_identifier');
    // localStorage.removeItem('searchObj');
    // localStorage.removeItem('packageObj');
    // localStorage.removeItem('hotelObj');

    // this.searchResult();
    // this.loadDestination();
    // this.selectedArea = this.hotelsearchkeys.area;
    // this.checkInDate = this.hotelsearchkeys.checkindate;
    // this.checkOutDate = this.hotelsearchkeys.checkoutdate;
    // this.roomdetail = this.hotelsearchkeys.details;
  }

  ngOnInit() {

    this.minHotelPrice = 0;
    this.maxHotelPrice = 100000;

    this.route.queryParams.subscribe((params) => {
      this.hotelsearchkeys.checkindate = params.checkindate;
      this.hotelsearchkeys.checkoutdate = params.checkoutdate;
      this.hotelsearchkeys.area = {
        'id': params.id,
        'name': params.name,
        'type': params.type
      }
      this.hotelsearchkeys.details = JSON.parse(params.details);
      this.hotelsearchkeys.transaction_identifier = params.transaction_identifier;
      console.log(this.hotelsearchkeys);

      this.searchResult(this.hotelsearchkeys);

      this.selectedArea = this.hotelsearchkeys.area;
      this.checkInDate = this.hotelsearchkeys.checkindate;
      this.checkOutDate = this.hotelsearchkeys.checkoutdate;
      this.roomdetail = this.hotelsearchkeys.details;

    }, (err) => {
      console.log(err);
    });
  }

  // No of nights in hotel
  getNoOfNights() {
    const checkIn = new Date(this.checkInDate).getTime();
    const checkOut = new Date(this.checkOutDate).getTime();
    return Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }

  onFiltersChange(filters) {
    console.log(filters);
    // cancel previous search request
    this.ngUnsubscribe.next();
    this.searchResult(this.hotelsearchkeys, filters);
  }

  searchResult(hotelsearchkeys, filters = {}) {
    // this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));

    const queryParams = Object.assign({}, hotelsearchkeys);
    queryParams.filters = filters;

    this.api.post("/hotels/search", queryParams)
      // Added Ankit	
      // emit values until provided observable i.e ngUnsubscribe emits
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response && response.data != undefined) {
          console.log('Search res ', response.data);
          if (response.data.totalHotelsCount == 0) {
            this.norecordfoundtitle = "There is no hotel available currently. Please search for other hotels";
            this.filteredHotels = [];
            this.copyFilteredHotels = [];
            return;
          }
          this.allHotel = response.data;
          this.totalHotelsCount = response.data.totalHotelsCount;

          if (response.data.price) {
            this.minHotelPrice = response.data.price.minPrice;
            this.maxHotelPrice = response.data.price.maxPrice;
          }
          this.filteredHotels = response.data.hotels;
          this.copyFilteredHotels = JSON.parse(JSON.stringify(this.filteredHotels))
          // localStorage.setItem('transaction_identifier', response.data.transaction_identifier);
          this.transaction_identifier = response.data.transaction_identifier;
          localStorage.setItem('searchObj', JSON.stringify(response.data.search));
          this.norecordfoundtitle = "";
        } else {
          // this.norecordfoundmsg = "oops";
          this.filteredHotels = [];
          this.copyFilteredHotels = [];
          this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
        }
      }, (err) => {
        this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
        this.alertService.error("No hotels available for this checkin date. Please select another checkin date.");
        console.log(err);
        this.filteredHotels = [];
        this.copyFilteredHotels = [];
      });
  }

  // Load hoteldetails component
  hoteldetails(hotel) {
    if (hotel === undefined || hotel == "" || hotel == null) {
      this.alertService.error("Please Select correct hotel");
    } else {

      let hoteldetailkeys = this.hotelsearchkeys;
      hoteldetailkeys.area.displayName = hotel.displayName;
      hoteldetailkeys.area.name = hotel.name;
      hoteldetailkeys.area.id = hotel.id;
      hoteldetailkeys.area.type = "hotel";
      localStorage.setItem('hoteldetailkeys', JSON.stringify(hoteldetailkeys));
      localStorage.setItem('hotelObj', JSON.stringify(hotel));

      // this.router.navigate(['/hotels/hoteldetails']);

      const queryParams = {
        "checkindate": this.hotelsearchkeys.checkindate,
        "checkoutdate": this.hotelsearchkeys.checkoutdate,
        "name": hotel.name,
        "type": hotel.type,
        "hotelId": hotel.hotelId,
        "transaction_identifier": this.transaction_identifier,
        "details": JSON.stringify(this.hotelsearchkeys.details)
      };
      console.log(queryParams);
      // saving query params in local storage, for navigating to the hoteldetails component again
      localStorage.setItem('hoteldetailparams', JSON.stringify(queryParams));
      this.router.navigate(['/hotels', 'hoteldetails'], { 'queryParams': queryParams });

    }
  }

  // priceFilter() {
  //   this.filteredHotels = JSON.parse(JSON.stringify(this.copyFilteredHotels));

  //   this.filteredHotels = this.filteredHotels.filter((hotel) => {
  //     const chargeable_rate = hotel.rates.packages[0].chargeable_rate;
  //     return chargeable_rate >= this.minHotelPrice && chargeable_rate <= this.maxHotelPrice;
  //   });
  //   // console.log(this.filteredHotels);
  //   if (this.filteredHotels.length <= 0) {
  //     this.norecordfoundtitle = "There is no Hotel available currently. Please search for other hotels";
  //   } else {
  //     this.norecordfoundtitle = "";
  //   }
  // }


  // sideBarFilter() {
  //   // data.hotels[""0""].rates.packages[""0""].room_details.non_refundable
  //   // data.hotels[""0""].rates.packages[""0""].room_details.food
  //   // data.hotels[""0""].rates.packages[""0""].room_details.room_type
  //   // data.hotels[""0""].rates.packages[""0""].chargeable_rate
  //   // this.filteredHotels

  //   this.filteredHotels = JSON.parse(JSON.stringify(this.copyFilteredHotels));
  //   setTimeout(() => {
  //     const roomTypeFilter = [];
  //     for (let index = 0; index < this.RootTypeFilters.length; index++) {
  //       const element = this.RootTypeFilters[index];
  //       if (element.name === 'All') {
  //         continue;
  //       }
  //       if (element.selected === true) {
  //         roomTypeFilter.push(element.value);
  //       }
  //     }

  //     if (roomTypeFilter.length > 0) {
  //       this.filteredHotels = this.filteredHotels.filter(function (hotel) {
  //         return roomTypeFilter.includes(hotel.rates.packages[0].room_details.room_type);
  //       });
  //     }

  //     const refundableFilter = [];
  //     for (let index = 0; index < this.Refundable.length; index++) {
  //       const element = this.Refundable[index];
  //       if (element.name === 'All') {
  //         continue;
  //       }
  //       if (element.selected === true) {
  //         refundableFilter.push(element.value);
  //       }
  //     }

  //     if (refundableFilter.length > 0) {
  //       this.filteredHotels = this.filteredHotels.filter(function (hotel) {
  //         return refundableFilter.includes(hotel.rates.packages[0].room_details.non_refundable);
  //       });
  //     }

  //     const foodServerdFilter = [];
  //     for (let index = 0; index < this.FoodServerd.length; index++) {
  //       const element = this.FoodServerd[index];
  //       if (element.name === 'All') {
  //         continue;
  //       }
  //       if (element.selected === true) {
  //         foodServerdFilter.push(element.value);
  //       }
  //     }

  //     if (foodServerdFilter.length > 0) {
  //       this.filteredHotels = this.filteredHotels.filter(function (hotel) {
  //         return foodServerdFilter.includes(hotel.rates.packages[0].room_details.food);
  //       });
  //     }

  //     if (this.searchText) {
  //       this.filteredHotels = this.filteredHotels.filter(hotel => {
  //         return hotel && hotel.originalName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
  //       });
  //     }
  //   }, 0);
  // }

  // FilterHotels() {
  //   var refund;
  //   var roomtype;
  //   var foodserve;
  //   var i = 0;
  //   setTimeout(() => {
  //     for (let refundtype of this.Refundable) {
  //       if (i == 0) {
  //         if (refundtype.selected === true) {
  //           refund = refundtype.value;
  //           break;
  //         }
  //       } else {
  //         if (refundtype.selected === true) {
  //           refund.push(refundtype.value);
  //         }
  //       }
  //       i++;
  //     }

  //     i = 0;
  //     this.RootTypeFilters.map((type, index) => {
  //       console.log(index);
  //       console.log(type);
  //       if (index == 0) {
  //         if (type.selected == true) {
  //           roomtype = type.value;
  //           return true;
  //         }
  //       } else {
  //         if (type.selected == true) {
  //           roomtype.push(type.value);
  //         }
  //         this.norecordfoundtitle = "Opps";
  //         this.norecordfoundmsg = "No Room available currently, Please look for some other option";
  //       }

  //     });
  //     // for(let type of this.RootTypeFilters; let){
  //     // 	if(i == 0){
  //     // 		if(type.selected == true){
  //     // 			roomtype = type.value;
  //     // 			break;
  //     // 		}

  //     // 	}else{
  //     // 		if(type.selected == true){
  //     // 			roomtype.push(type.value);	
  //     // 		}
  //     // 	}
  //     // 	i++;
  //     // }

  //     i = 0;
  //     for (let food of this.FoodServerd) {
  //       if (i == 0) {
  //         if (food.selected === true) {
  //           foodserve = food.value;
  //           break;
  //         }
  //       } else {
  //         if (food.selected === true) {
  //           foodserve.push(food.value);
  //         }
  //       }
  //       i++;
  //     }

  //     // this.filteredHotels =  this.allHotel.hotels.filter(function(hotel) {
  //     this.filteredHotels = this.allHotel.filter(function (hotel) {
  //       // return true;
  //       return (roomtype.indexOf(hotel.rates.packages[0].room_details.room_type) > -1) && (foodserve.indexOf(hotel.rates.packages[0].room_details.food) > -1);
  //     });
  //   }, 200)
  // }

  // SearchFilter() {
  //   this.FilterHotels();
  // }

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
    // this.FilterHotels();
  }

  // MODIFY SEARCH
  openModal(modifySearchModal) {
    this.modalRef = this.modalService.open(modifySearchModal);
  }

  // addRoomInSearch() {
  //   this.roomdetail.push({
  //     "room": String((this.roomdetail.length) + 1),
  //     "adult_count": "1",
  //     "child_count": "0",
  //     "children": []
  //   });
  // }

  // removeRoomFromSearch() {
  //   console.log(this.roomdetail.length);
  //   if (this.roomdetail.length > 1) {
  //     this.roomdetail.pop();
  //   }
  // }

  // CHANGES ANKIT
  // checkChildren(index) {
  //   if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
  //     this.roomdetail[index].children.splice(Number(this.roomdetail[index].child_count), this.roomdetail[index].children.length + 1);
  //   } else {
  //     for (let i = 0; i < Number(this.roomdetail[index].child_count); i++) {
  //       console.log(this.roomdetail[index].children[i] === undefined);
  //       if (this.roomdetail[index].children[i] === undefined) {
  //         this.roomdetail[index].children[i] = { age: "1" };
  //       }
  //     }
  //   }
  //   console.log(this.roomdetail[index]);
  // }

  // checkChildren(index) {
  // if(this.roomdetail[index].children.length > this.roomdetail[index].child_count){
  // 	this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - this.roomdetail[index].child_count);
  // }else{
  // 	for (var i=this.roomdetail[index].children.length; i<this.roomdetail[index].child_count; i++) {
  //       this.roomdetail[index].children.push({"child":i+1,"age":"1"});
  //     }

  // }
  // }

  // searchAgain() {

  //   if (this.selectedArea !== undefined && this.checkInDate !== undefined && this.checkOutDate !== undefined && this.roomdetail !== undefined) {
  //     var flag = true;
  //     loop1:
  //     for (let o of this.roomdetail) {
  //       for (let child of o.children) {
  //         if (child.age === undefined || child.age == "" || child.age > 11 || child.age < 0) {
  //           this.alertService.error("select correct age of child " + child.child + " in room " + o.room);
  //           flag = false;
  //           break loop1;
  //         }
  //       }
  //     }
  //     if (flag) {
  //       // this.hotelsearchkeys = { "area": this.selectedArea, "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "details": this.roomdetail };
  //       // localStorage.setItem('hotelsearchkeys', JSON.stringify(this.hotelsearchkeys));
  //       this.hotelsearchkeys = { "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "name": this.selectedArea.name, "type": this.selectedArea.type, "id": this.selectedArea.id, "transaction_identifier": this.selectedArea.transaction_identifier, "details": JSON.stringify(this.roomdetail) };

  //       this.modalRef.close();
  //       this.searchResult();
  //     }

  //   } else {
  //     this.alertService.error("All fields are required!");
  //   }
  // }

  showSearchLoader() {
    return (!this.allHotel || !this.allHotel.search) && (!this.norecordfoundtitle);
  }

  ngOnDestroy() {
    // Added Ankit
    // Unsubscribing the observable after component is destroyed - prevents memory leak
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}