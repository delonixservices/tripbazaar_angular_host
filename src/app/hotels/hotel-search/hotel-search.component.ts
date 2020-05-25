import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from "@angular/common/http";
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ApiService, JwtService, AlertService, GoogleAnalyticsService } from '../../core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';

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

  public appliedFilters: any;

  public validation: any;
  public modalRef: any;

  // for hotel-search-filter component
  minHotelPrice: number;
  maxHotelPrice: number;

  totalHotelsCount: number;
  currentHotelsCount: number;
  page: number;
  // hotels per page
  perPage: number = 15;
  totalPages: number;

  // next hotels polling toggler
  allowNextIteration: boolean;
  pollingStatus: string;

  constructor (public route: ActivatedRoute,
    private router: Router,
    public api: ApiService,
    public jwt: JwtService,
    public alertService: AlertService,
    public googleAnalytics: GoogleAnalyticsService,
    public modalService: NgbModal
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    this.minHotelPrice = 0;
    this.maxHotelPrice = 100000;

    this.route.queryParams.subscribe((params) => {
      let checkInDate = params.checkindate;
      let checkOutDate = params.checkoutdate;

      const checkInTime = new Date(checkInDate).getTime();
      const today = new Date();
      if (isNaN(checkInTime) || checkInTime < today.getTime()) {
        checkInDate = formatDate(today, "yyyy-MM-dd", "en-US");
      }

      const checkOutTime = new Date(checkOutDate).getTime();

      if (isNaN(checkOutTime) || checkOutTime < today.setDate(today.getDate() + 1)) {
        checkOutDate = formatDate(new Date(today.setDate(today.getDate() + 1)), "yyyy-MM-dd", "en-US");
      }

      console.log(checkInDate, checkOutDate);

      this.hotelsearchkeys.checkindate = checkInDate;
      this.hotelsearchkeys.checkoutdate = checkOutDate;
      this.hotelsearchkeys.area = {
        'id': params.id,
        'name': params.name,
        'type': params.type
      }

      if (params.details && params.details.room) {
        this.hotelsearchkeys.details = JSON.parse(params.details);
      } else {
        this.hotelsearchkeys.details = [{
          room: "1",
          adult_count: "1",
          child_count: "0",
          children: []
        }]
      }

      const transaction_identifier = localStorage.getItem('transaction_identifier');

      if (transaction_identifier) {
        this.hotelsearchkeys.transaction_identifier = transaction_identifier;
      }

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
    this.appliedFilters = filters;
    this.searchResult(this.hotelsearchkeys, filters);
  }

  searchResult(hotelsearchkeys, filters = {}) {
    // this.hotelsearchkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));

    const queryParams = Object.assign({
      'perPage': this.perPage
    }, hotelsearchkeys);
    queryParams.filters = filters;

    this.searchHotels(queryParams)
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
          this.currentHotelsCount = response.data.currentHotelsCount;
          this.page = response.data.page;
          // this.perPage = response.data.perPage;
          this.totalPages = response.data.totalPages;
          this.pollingStatus = response.data.status;

          if (response.data.price) {
            this.minHotelPrice = response.data.price.minPrice;
            this.maxHotelPrice = response.data.price.maxPrice;
          }
          this.filteredHotels = response.data.hotels;
          this.copyFilteredHotels = JSON.parse(JSON.stringify(this.filteredHotels))
          if (response.data.transaction_identifier) {
            localStorage.setItem('transaction_identifier', response.data.transaction_identifier);
            this.transaction_identifier = response.data.transaction_identifier;
          }
          if (this.pollingStatus !== "complete")
            this.allowNextIteration = true;

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



    // code before pagination

    // this.api.post("/hotels/search", queryParams)
    // // this.api.loadData("/hotelSearch.json")
    // // Added Ankit	
    // // emit values until provided observable i.e ngUnsubscribe emits
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe((response) => {
    //   if (response && response.data != undefined) {
    //     console.log('Search res ', response.data);
    //     if (response.data.totalHotelsCount == 0) {
    //       this.norecordfoundtitle = "There is no hotel available currently. Please search for other hotels";
    //       this.filteredHotels = [];
    //       this.copyFilteredHotels = [];
    //       return;
    //     }
    //     this.allHotel = response.data;
    //     this.totalHotelsCount = response.data.totalHotelsCount;

    //     if (response.data.price) {
    //       this.minHotelPrice = response.data.price.minPrice;
    //       this.maxHotelPrice = response.data.price.maxPrice;
    //     }
    //     this.filteredHotels = response.data.hotels;
    //     this.copyFilteredHotels = JSON.parse(JSON.stringify(this.filteredHotels))
    //     // localStorage.setItem('transaction_identifier', response.data.transaction_identifier);
    //     this.transaction_identifier = response.data.transaction_identifier;
    //     localStorage.setItem('searchObj', JSON.stringify(response.data.search));
    //     this.norecordfoundtitle = "";
    //   } else {
    //     // this.norecordfoundmsg = "oops";
    //     this.filteredHotels = [];
    //     this.copyFilteredHotels = [];
    //     this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
    //   }
    // }, (err) => {
    //   this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
    //   this.alertService.error("No hotels available for this checkin date. Please select another checkin date.");
    //   console.log(err);
    //   this.filteredHotels = [];
    //   this.copyFilteredHotels = [];
    // });

  }

  searchHotels(queryParams): Observable<any> {
    return this.api.post("/hotels/search", queryParams);
  }


  // Load hoteldetails component
  hoteldetails(hotel) {
    if (hotel === undefined || hotel == "" || hotel == null) {
      this.alertService.error("Please Select correct hotel");
    } else {

      // google analytics
      this.googleAnalytics.eventEmitter('hoteldetails', 'hotels', 'click', `hotelName=${hotel.name}`, 3);

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
        // "transaction_identifier": this.transaction_identifier,
        "details": JSON.stringify(this.hotelsearchkeys.details)
      };
      console.log(queryParams);
      // saving query params in local storage, for navigating to the hoteldetails component again
      localStorage.setItem('hoteldetailparams', JSON.stringify(queryParams));
      this.router.navigate(['/hotels', 'hoteldetails'], { 'queryParams': queryParams });

    }
  }

  // MODIFY SEARCH
  openModal(modifySearchModal) {
    this.modalRef = this.modalService.open(modifySearchModal);
  }

  onScroll() {
    console.log("onScroll called...");

    // controll hotel polling
    // fetching next hotels is not allowed because current iteration is currently running
    if (!this.allowNextIteration) {
      return;
    }

    const requestParams = Object.assign({
      'page': this.page + 1,
      'perPage': this.perPage,
      'currentHotelsCount': this.currentHotelsCount,
      'filters': this.appliedFilters
    }, this.hotelsearchkeys);

    this.allowNextIteration = false;

    console.log(`Fetch next ${this.perPage} hotels...`);

    this.searchHotels(requestParams)
      // Added Ankit	
      // emit values until provided observable i.e ngUnsubscribe emits
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response && response.data != undefined) {
          console.log('Search res on scroll ', response.data);
          if (response.data.totalHotelsCount == 0) {
            // this.norecordfoundtitle = "There is no hotel available currently. Please search for other hotels";
            // this.filteredHotels = [];
            // this.copyFilteredHotels = [];
            // return;
          }

          this.filteredHotels = this.filteredHotels.concat(response.data.hotels);
          console.log(this.filteredHotels);
          this.totalHotelsCount = response.data.totalHotelsCount;
          this.currentHotelsCount = response.data.currentHotelsCount;
          this.page = response.data.page;
          // this.perPage = response.data.perPage;
          this.totalPages = response.data.totalPages;
          this.pollingStatus = response.data.status;

          if (this.pollingStatus !== "complete")
            this.allowNextIteration = true;

        } else {
          // // this.norecordfoundmsg = "oops";
          // this.filteredHotels = [];
          // this.copyFilteredHotels = [];
          // this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
        }
      }, (err) => {
        // this.norecordfoundtitle = "There is no result available currently. Please search for other hotel";
        // this.alertService.error("No hotels available for this checkin date. Please select another checkin date.");
        console.log(err);
        // this.filteredHotels = [];
        // this.copyFilteredHotels = [];
      });
  }

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