import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, takeUntil } from 'rxjs/operators';
import { HttpParams } from "@angular/common/http";
import { Subject, of, concat } from 'rxjs';
import { ApiService, JwtService, AlertService } from '../../core/services';
// import { NgxGalleryAnimation, NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { ImageItem, GalleryComponent } from '@ngx-gallery/core';

@Component({
  selector: 'app-hoteldetails-page',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
  // encapsulation: ViewEncapsulation.None,
})

export class HoteldetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  suggestions: any;
  private ngUnsubscribe = new Subject();

  selectedArea: any;
  checkInDate: any;
  checkOutDate: any;
  suggestionsLoading = false;
  // hotelsearchkeys: any;
  hoteldetailkeys: any = {};
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

  @ViewChild(GalleryComponent, { static: false }) gallery: GalleryComponent;

  // public galleryImages: NgxGalleryImage[];
  // public galleryOptions: NgxGalleryOptions[];


  searchObj: any;
  searchresultkeys: any;

  constructor (private route: ActivatedRoute,
    private router: Router,
    public api: ApiService,
    public jwt: JwtService,
    public alertService: AlertService
  ) {

    this.hotelObj = JSON.parse(localStorage.getItem('hotelObj'));
    console.log(this.hotelObj);
    if (!this.hotelObj) {
      this.alertService.error("Please select correct hotel");
      // this.router.navigate(['/hotels/searchresult']);
    }
  }

  ngOnInit() {

    this.searchresultkeys = JSON.parse(localStorage.getItem('searchresultkeys'));

    this.route.queryParams.subscribe((params) => {
      this.hoteldetailkeys.checkindate = params.checkindate;
      this.hoteldetailkeys.checkoutdate = params.checkoutdate;
      // this.hoteldetailkeys.area = {
      // 	'id': params.hotelId,
      // 	'name': params.name,
      // 	'type': params.type
      // }
      this.hoteldetailkeys.hotelId = params.hotelId;
      this.hoteldetailkeys.details = JSON.parse(params.details);
      this.hoteldetailkeys.transaction_identifier = params.transaction_identifier;

      this.hoteldetailkeys.referenceId = params.referenceId;

      console.log(this.hoteldetailkeys);

      this.loadHotelDetails();
      this.loadDestination();

      this.selectedArea = this.hoteldetailkeys.area;
      this.checkInDate = this.hoteldetailkeys.checkindate;
      this.checkOutDate = this.hoteldetailkeys.checkoutdate;
      this.roomdetail = this.hoteldetailkeys.details;

    }, (err) => {
      console.log(err);
      this.router.navigate(['/hotels', 'searchresult'], { queryParams: this.searchresultkeys });
    });

    // this.searchResult();
    // this.loadHotelDetails();
    // this.loadDestination();
    // // Changes Ankit
    // this.selectedArea = this.hoteldetailkeys.area;
    // this.checkInDate = this.hoteldetailkeys.checkindate;
    // this.checkOutDate = this.hoteldetailkeys.checkoutdate;
    // this.roomdetail = this.hoteldetailkeys.details;
    // this.selectedArea = this.hotelsearchkeys.area;
    // this.checkInDate = this.hotelsearchkeys.checkindate;
    // this.checkOutDate = this.hotelsearchkeys.checkoutdate;
    // this.roomdetail = this.hotelsearchkeys.details;

    // Added Ankit
    // ngx-gallery

    // this.galleryOptions = [
    // 	{
    // 		width: '600px',
    // 		height: '400px',
    // 		thumbnailsColumns: 4,
    // 		imageAnimation: NgxGalleryAnimation.Slide
    // 	},
    // 	// max-width 800
    // 	{
    // 		breakpoint: 800,
    // 		width: '100%',
    // 		height: '600px',
    // 		imagePercent: 80,
    // 		thumbnailsPercent: 20,
    // 		thumbnailsMargin: 20,
    // 		thumbnailMargin: 20
    // 	},
    // 	// max-width 400
    // 	{
    // 		breakpoint: 400,
    // 		preview: false
    // 	}
    // ];
  }

  ngAfterViewInit(): void {
    let imageItems = [];
    for (let i = 0; i < this.hotelObj.imageDetails.count; i++) {
      const image: ImageItem = new ImageItem({
        src: `${this.hotelObj.imageDetails.prefix}${i}${this.hotelObj.imageDetails.suffix}`, thumb: `${this.hotelObj.imageDetails.prefix}${i}${this.hotelObj.imageDetails.suffix}`
      });

      imageItems.push(image);
    }
    if (imageItems.length > 0)
      this.gallery.load(imageItems);
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
    // this.hoteldetailkeys = JSON.parse(localStorage.getItem('hoteldetailkeys'));
    console.log(this.hoteldetailkeys)
    this.api.post("/hotels/packages", this.hoteldetailkeys)
      // this.api.loadData("/hotelPackages.json")
      // Added Ankit	
      // emit values until provided observable i.e ngUnsubscribe emits
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        if (response.data) {
          console.log(response);
          this.hotelObj = response.data.hotel;
          // sorting packages in increasing order of the price
          this.hotelObj.rates.packages.sort((a, b) => a.chargeable_rate - b.chargeable_rate);
          this.hotelObj.searchkey = this.hoteldetailkeys;
          this.searchObj = response.data.search;
          localStorage.setItem('hotelObj', JSON.stringify(response.data.hotel));
          localStorage.setItem('transaction_identifier', response.data.transaction_identifier);
          localStorage.setItem('searchObj', JSON.stringify(response.data.search));
        }
      }, (err) => {
        console.log('Cannot get hotel packages ', err);
        if (err.message !== undefined) {
          this.validation = err.message
        }
        // this.hoteldetailkeys = JSON.parse(localStorage.getItem('hotelsearchkeys'));
        this.hotelObj.searchkey = this.hoteldetailkeys;
        this.alertService.error("No room available for this date. Please select another date.");
        this.router.navigate(['/']);
      });
  }

  packageSelectedHandler(hotelPackage) {
    console.log(1);
    this.selectPackage(hotelPackage);
  }

  selectPackage(hotelPackage) {
    if (hotelPackage === undefined || hotelPackage == "" || hotelPackage == null) {
      this.alertService.error("Please Select correct hotel package");
    } else {
      localStorage.setItem('packageObj', JSON.stringify(hotelPackage));
      // this.router.navigate(['/hotels/hotelbooking']);
      const queryParams = {
        search: JSON.stringify(this.searchObj),
        details: JSON.stringify(this.hoteldetailkeys.details),
        hotelId: this.hotelObj.hotelId,
        bookingKey: hotelPackage.booking_key,
        transaction_identifier: this.hoteldetailkeys.transaction_identifier
      };
      console.log(queryParams)

      this.router.navigate(['/hotels', 'hotelbooking'], { 'queryParams': queryParams });
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
        // this.hotelsearchkeys = { "area": this.selectedArea, "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "details": this.roomdetail };
        // localStorage.setItem('hotelsearchkeys', JSON.stringify(this.hotelsearchkeys));
        // this.hotelObj.searchkey = this.hotelsearchkeys;
        // // this.searchResult();
        // this.router.navigate(['/hotels/searchresult']);
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
        switchMap(term => this.api.get("/hotels/suggest", term).pipe(
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
  // localStorage.setItem('transaction_identifier', response.data.transaction_identifier);
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
    // el.scrollIntoView({
    //   behavior: 'smooth',
    // });

    const navbarHeight = 70;

    window.scroll({
      top: el.offsetTop - navbarHeight - 10,
      behavior: 'smooth'
    });
  }

  ngOnDestroy() {
    // Added Ankit
    // Unsubscribing the observable after component is destroyed - prevents memory leak
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
