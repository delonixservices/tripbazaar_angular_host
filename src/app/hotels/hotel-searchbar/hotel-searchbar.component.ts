import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { ApiService, JwtService, AuthService, AlertService, GoogleAnalyticsService } from '../../core';


@Component({
  selector: 'app-hotel-searchbar',
  templateUrl: './hotel-searchbar.component.html',
  styleUrls: ['./hotel-searchbar.component.css'],
  host: {
    '(document:click)': 'hostClick($event)',
  }
})

export class HotelSearchbarComponent implements OnInit {

  selectedArea: any;

  // checkInDateModel: NgbDateStruct;
  // checkOutDateModel: NgbDateStruct;
  checkInDate: any;
  checkOutDate: any;
  checkInMinDate: NgbDateStruct;
  checkOutMinDate: NgbDateStruct;

  hotelsearchkeys: any;

  guests: number = 2;
  roomdetail = [{
    "room": "1",
    "adult_count": "1",
    "child_count": "0",
    "children": []
  }];

  // currentAccordion: number = 0;

  @ViewChild('checkInContainer', { static: false }) checkInContainer: ElementRef;
  @ViewChild('checkOutContainer', { static: false }) checkOutContainer: ElementRef;

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  showDatePicker: boolean = false;
  fromDay: string;
  toDay: string;
  weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  constructor (public route: ActivatedRoute,
    public router: Router,
    public api: ApiService,
    public jwt: JwtService,
    private authService: AuthService,
    public alertService: AlertService,
    public googleAnalytics: GoogleAnalyticsService,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public dpConfig: NgbDatepickerConfig,
    public calendar: NgbCalendar,
    public modalService: NgbModal,
  ) {

  }

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

  }

  selectedAreaChanged(selectedArea) {
    console.log(selectedArea);
    this.selectedArea = selectedArea;
  }

  hostClick(event: MouseEvent) {
    if (this.showDatePicker) {
      if (this.checkInContainer && this.checkInContainer.nativeElement && !this.checkInContainer.nativeElement.contains(event.target) && !this.checkOutContainer.nativeElement.contains(event.target)) {
        this.showDatePicker = false;
      }
    }
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

  // OPEN MODAL
  openModal(modifySearchModal) {
    this.modalService.open(modifySearchModal);
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
  // addRoomInSearch(acc: NgbAccordion) {
  //   this.currentAccordion = this.currentAccordion + 1;
  //   setTimeout(() => acc.expand(`panel${this.currentAccordion}`), 0);
  //   this.roomdetail.push({
  //     "room": '' + ((this.roomdetail.length) + 1),
  //     "adult_count": "1",
  //     "child_count": "0",
  //     "children": []
  //   });
  //   this.updateGuests();
  // }

  // removeRoomFromSearch(index) {
  //   console.log(this.roomdetail.length);
  //   if (this.roomdetail.length > 1) {
  //     const arr = this.roomdetail.splice(index, 1);
  //     console.log(arr, index);
  //   }
  //   this.updateGuests();
  // }

  // removeRoomFromSearch(acc: NgbAccordion) {
  //   setTimeout(() => acc.collapse(`panel${this.currentAccordion}`), 0);
  //   this.currentAccordion = this.currentAccordion - 1;
  //   setTimeout(() => acc.expand(`panel${this.currentAccordion}`), 0);
  //   console.log(this.roomdetail.length);
  //   if (this.roomdetail.length > 1) {
  //     this.roomdetail.pop();
  //   }
  // }

  // checkChildren(index) {
  //   // console.log('room = ' + index);
  //   // console.log('child_count = ' + Number(this.roomdetail[index].child_count));
  //   // console.log(this.roomdetail[index]);

  //   if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
  //     // this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - Number(this.roomdetail[index].child_count));
  //     this.roomdetail[index].children.splice(Number(this.roomdetail[index].child_count), this.roomdetail[index].children.length + 1);
  //   } else {
  //     for (let i = 0; i < Number(this.roomdetail[index].child_count); i++) {
  //       console.log(this.roomdetail[index].children[i] === undefined);
  //       if (this.roomdetail[index].children[i] === undefined) {
  //         this.roomdetail[index].children[i] = { age: "5" };
  //       }
  //     }
  //   }
  //   // console.log(this.roomdetail[index]);
  // }

  updateGuests() {
    let guests = 0;
    this.roomdetail.forEach((room) => {
      guests += Number(room.adult_count) + Number(room.child_count);
    });
    this.guests = guests;
    console.log('guests =' + this.guests);
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
      this.roomdetail = roomdetail;
    }
  }

  onSearchClinked() {

    // google analytics
    this.googleAnalytics.eventEmitter('hotelSearch', 'hotels', 'click', 'method', 1);

    console.log(this.selectedArea);
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
        this.hotelsearchkeys = { "area": this.selectedArea, "checkindate": this.checkInDate, "checkoutdate": this.checkOutDate, "details": this.roomdetail };

        localStorage.setItem('hotelsearchkeys', JSON.stringify(this.hotelsearchkeys));

        const queryParams = {
          "checkindate": this.checkInDate,
          "checkoutdate": this.checkOutDate,
          "name": this.selectedArea.name,
          "type": this.selectedArea.type,
          "id": this.selectedArea.id,
          // "transaction_identifier": this.selectedArea.transaction_identifier,
          "details": JSON.stringify(this.roomdetail)
        };

        // saving query params in local storage, for navigating to the searchresult component again
        localStorage.setItem('searchresultkeys', JSON.stringify(queryParams));
        if (this.selectedArea.transaction_identifier)
          localStorage.setItem('transaction_identifier', this.selectedArea.transaction_identifier);
        this.router.navigate(['/hotels', 'searchresult'], { 'queryParams': queryParams });

        console.log(queryParams);
      }
    } else {
      this.alertService.error("All fields are required!");
    }
  }
}

