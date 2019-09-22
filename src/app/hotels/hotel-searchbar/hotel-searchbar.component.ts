import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, concat, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, JwtService, AuthService, AlertService } from '../../core';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hotel-searchbar',
  templateUrl: './hotel-searchbar.component.html',
  styleUrls: ['./hotel-searchbar.component.css'],
  host: {
    '(document:click)': 'hostClick($event)',
  }
})
export class HotelSearchbarComponent implements OnInit {

  selectedArea: any = {
    displayName: "Singapore, Singapore | (486)",
    hotelCount: 486,
    id: "3168",
    name: "Singapore, Singapore",
    transaction_identifier: "60a2022f77404b808be86fc770fe3cfc",
    type: "city"
  };
  suggestions: any;
  showNgSelect: boolean;
  // checkInDateModel: NgbDateStruct;
  // checkOutDateModel: NgbDateStruct;
  checkInDate: any;
  checkOutDate: any;
  checkInMinDate: NgbDateStruct;
  checkOutMinDate: NgbDateStruct;

  suggestionsLoading = false;
  hotelsearchkeys: any;
  guests: number = 1;
  roomdetail = [{
    "room": "1",
    "adult_count": "1",
    "child_count": "0",
    "children": []
  }];

  @ViewChild('checkInContainer', { static: false }) checkInContainer: ElementRef;
  @ViewChild('checkOutContainer', { static: false }) checkOutContainer: ElementRef;
  @ViewChild('hotelSuggestionsContainer', { static: false }) hotelSuggestionsContainer: ElementRef;

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
    public calendar: NgbCalendar
  ) {
    const date = new Date();
    const todaysDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    dpConfig.minDate = todaysDate;
    // this.checkInDateModel = todaysDate;
    // this.onCheckInDateSelect(todaysDate);

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday());

    this.fromDay = this.weekdays[calendar.getWeekday(this.fromDate)];
    this.toDay = this.weekdays[calendar.getWeekday(this.toDate)];
  }

  ngOnInit() {
    this.checkInDate = this.parseDate(this.fromDate);
    this.checkOutDate = this.parseDate(this.toDate);

    this.loadDestination();
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


  // format checkIn and checkOut dates
  // onCheckInDateSelect(date: NgbDateStruct) {
  //   this.checkInDate = this.ngbDateParserFormatter.format(date);
  //   const dateModal = Object.assign({}, this.checkInDateModel);
  //   dateModal.day = dateModal.day + 1;
  //   this.checkOutMinDate = dateModal;
  //   this.checkOutDateModel = dateModal;
  //   this.checkOutDate = this.ngbDateParserFormatter.format(dateModal);
  // }

  // onCheckOutDateSelect(date: NgbDateStruct) {
  //   this.checkOutDate = this.ngbDateParserFormatter.format(date);
  // }

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
    // console.log('room = ' + index);
    // console.log('child_count = ' + Number(this.roomdetail[index].child_count));
    // console.log(this.roomdetail[index]);

    if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
      // this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - Number(this.roomdetail[index].child_count));
      this.roomdetail[index].children.splice(Number(this.roomdetail[index].child_count), this.roomdetail[index].children.length + 1);
    } else {
      for (let i = 0; i < Number(this.roomdetail[index].child_count); i++) {
        console.log(this.roomdetail[index].children[i] === undefined);
        if (this.roomdetail[index].children[i] === undefined) {
          this.roomdetail[index].children[i] = { age: "5" };
        }
      }
    }
    // console.log(this.roomdetail[index]);
  }

  doneClicked() {
    let guests = 0;
    this.roomdetail.forEach((room) => {
      guests += Number(room.adult_count) + Number(room.child_count);
    });
    this.guests = guests;
    // console.log('guests =' + this.guests);
  }

  search() {
    // console.log(this.checkInDate);
    if (this.selectedArea && this.checkInDate && this.checkOutDate && this.roomdetail) {
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
        this.router.navigate(['/hotels', 'searchresult']);

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
        switchMap(term => this.api.get("/suggest", term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.suggestionsLoading = false)
        ))
      )
    );
  }
}
