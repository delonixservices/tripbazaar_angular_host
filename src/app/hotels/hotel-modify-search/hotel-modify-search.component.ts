import { Component, OnInit, Output, ViewChild, ElementRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, concat, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { ApiService, JwtService, AuthService, AlertService } from '../../core';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-hotel-modify-search',
  templateUrl: './hotel-modify-search.component.html',
  styleUrls: ['./hotel-modify-search.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'hostClick($event)',
  }
})

export class HotelModifySearchComponent implements OnInit {

  @Output() searchClicked = new EventEmitter();

  selectedArea: any = {
    displayName: "Singapore, Singapore",
    id: "3168",
    name: "Singapore, Singapore",
    transaction_identifier: "",
    type: "city"
  };

  suggestions: any;
  showNgSelect: boolean;
  openNgSelect: boolean;
  checkInDate: any;
  checkOutDate: any;
  checkInMinDate: NgbDateStruct;
  checkOutMinDate: NgbDateStruct;

  suggestionsLoading = false;
  hotelsearchkeys: any;

  guests: number = 2;
  roomdetail = [{
    "room": "1",
    "adult_count": "1",
    "child_count": "0",
    "children": []
  }];

  @ViewChild('checkInContainer', { static: false }) checkInContainer: ElementRef;
  @ViewChild('checkOutContainer', { static: false }) checkOutContainer: ElementRef;
  @ViewChild('hotelSuggestionsContainer', { static: false }) hotelSuggestionsContainer: ElementRef;

  @ViewChild('select', { static: true }) ngSelect: NgSelectComponent;

  suggestionsInput = new Subject<HttpParams>();


  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  showDatePicker: boolean = false;
  fromDay: string;
  toDay: string;
  weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  constructor(public route: ActivatedRoute,
    public router: Router,
    public api: ApiService,
    public jwt: JwtService,
    private authService: AuthService,
    public alertService: AlertService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public dpConfig: NgbDatepickerConfig,
    public calendar: NgbCalendar,
    public modalService: NgbModal
  ) { }

  ngOnInit() {

    const date = new Date();
    const todaysDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    this.dpConfig.minDate = todaysDate;

    const recentSearch = JSON.parse(localStorage.getItem('hotelsearchkeys'));

    if (recentSearch) {
      this.selectedArea = recentSearch.area;
      this.roomdetail = recentSearch.details;
      this.updateGuests();

      const checkIn = recentSearch.checkindate;
      const checkOut = recentSearch.checkoutdate;

      console.log('Data from the recent search..');

      const date = new Date(checkIn);
      console.log(date);

      if (Date.now() > date.getTime()) {
        this.fromDate = this.calendar.getToday();
        this.toDate = this.calendar.getNext(this.calendar.getToday());
      } else {
        console.log(this.calendar.getToday())
        console.log(this.ngbDateParserFormatter.parse(checkIn));
        this.fromDate = this.ngbDateParserFormatter.parse(checkIn) as NgbDate;
        this.toDate = this.ngbDateParserFormatter.parse(checkOut) as NgbDate;
      }

    } else {
      this.fromDate = this.calendar.getToday();
      this.toDate = this.calendar.getNext(this.calendar.getToday());
    }

    this.checkInDate = this.parseDate(this.fromDate);
    this.checkOutDate = this.parseDate(this.toDate);

    this.fromDay = this.weekdays[this.calendar.getWeekday(this.fromDate)];
    this.toDay = this.weekdays[this.calendar.getWeekday(this.toDate)];

    this.loadDestination();

    this.router.onSameUrlNavigation = 'reload';
  }


  hostClick(event: MouseEvent) {
    if (this.showDatePicker) {
      if (this.checkInContainer && this.checkInContainer.nativeElement && !this.checkInContainer.nativeElement.contains(event.target) && !this.checkOutContainer.nativeElement.contains(event.target)) {
        this.showDatePicker = false;
      }
    }

    if (this.showNgSelect) {
      if (this.hotelSuggestionsContainer && this.hotelSuggestionsContainer.nativeElement && !this.hotelSuggestionsContainer.nativeElement.contains(event.target)) {
        this.showNgSelect = false;
      }
    }
  }

  suggestionsClicked() {
    this.showNgSelect = true;
    // focus on ng-select input
    // The timeout is required because you can't focus() an element that is still hidden. Until Angular change detection has a chance to run (which will be after method suggestionsClicked() finishes executing), the showNgSelect property in the DOM will not be updated, even though you set showNgSelect to true in your method.
    setTimeout(() => this.ngSelect.searchInput.nativeElement.focus(), 0);
    this.selectedArea = {};
  }

  selectDate() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.checkInDate = this.parseDate(date);
      this.fromDay = this.weekdays[this.calendar.getWeekday(this.fromDate)];
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.checkOutDate = this.parseDate(date);
      this.toDay = this.weekdays[this.calendar.getWeekday(this.toDate)];
    } else {
      this.toDate = null;
      this.checkOutDate = null;
      this.toDay = "";
      this.fromDate = date;
      this.checkInDate = this.parseDate(date);
      this.fromDay = this.weekdays[this.calendar.getWeekday(this.fromDate)];
    }

    if (this.fromDate && this.toDate) {
      this.showDatePicker = false;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  formatDate(date: NgbDate) {
    if (date)
      return `${date.day}/${date.month}/${date.year}`;
  }

  parseDate(date: NgbDate) {
    if (date)
      return this.ngbDateParserFormatter.format(date);
  }

  updateGuests() {
    let guests = 0;
    this.roomdetail.forEach((room) => {
      guests += Number(room.adult_count) + Number(room.child_count);
    });
    this.guests = guests;
    // console.log('guests =' + this.guests);
  }

  onGuestsChange(guests) {
    if (guests) {
      this.guests = guests;
    }
    console.log(guests)
  }

  onRoomdetailChange(roomdetail) {
    console.log(roomdetail)
    if (roomdetail) {
      // this.roomdetail = roomdetail;
    }
  }

  // OPEN MODAL
  openModal(modifySearchModal) {
    this.modalService.open(modifySearchModal);
  }

  search() {
    // console.log(this.checkInDate);
    if (this.selectedArea && this.checkInDate && this.checkOutDate && this.roomdetail) {
      let flag = true;
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
        this.searchClicked.emit();

        this.hotelsearchkeys = { "area": this.selectedArea, "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "details": this.roomdetail };

        localStorage.setItem('hotelsearchkeys', JSON.stringify(this.hotelsearchkeys));

        const queryParams = {
          "checkindate": this.checkInDate,
          "checkoutdate": this.checkOutDate,
          "name": this.selectedArea.name,
          "type": this.selectedArea.type,
          "id": this.selectedArea.id,
          "transaction_identifier": this.selectedArea.transaction_identifier,
          "details": JSON.stringify(this.roomdetail)
        };

        // saving query params in local storage, for navigating to the searchresult component again
        localStorage.setItem('searchresultkeys', JSON.stringify(queryParams));

        this.router.navigate(['/hotels', 'searchresult'], { 'queryParams': queryParams });

        console.log(this.hotelsearchkeys);
      }
    } else {
      this.alertService.error("All fields are required!");
    }
  }

  loadDestination() {
    // console.log("loadDestination called1");
    this.suggestions = concat(
      of([]),
      this.suggestionsInput.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => this.suggestionsLoading = true),
        switchMap(term => this.api.get("/hotels/suggest", term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => {
            this.suggestionsLoading = false
            this.openNgSelect = true;
          })
        ))
      )
    );
  }
}

