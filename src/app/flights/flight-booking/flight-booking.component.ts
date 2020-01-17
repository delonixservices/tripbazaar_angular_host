import { Component, OnInit } from '@angular/core';
import { FlightBookingService } from './flight-booking.service';
import { AlertService } from '../../core/services';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.scss']
})
export class FlightBookingComponent implements OnInit {

  bookedFlight: any;
  flightSegments = [];

  passengerList = [];

  ticketDocObj = {
    airLineId: "",
    bookingRefId: "",
    orderId: "",
    owner: "",
    passengerRef: ""
  }
  ticketIssueTime: string;
  ticketDocNo: any;
  priceClass: any;
  priceClassCode: any;
  ticketPnr: any;

  orderRetrieveKeys = [];

  retrievedOrders = [{
    ticketIssueTime: '',
    ticketDocNo: '',
    priceClass: '',
    priceClassCode: '',
    ticketPnr: '',
    ticketDocObj: {
      airLineId: "",
      bookingRefId: "",
      orderId: "",
      owner: "",
      passengerRef: ""
    },
    flightSegments: [],
    passengerList: [],
    contactInfo: {
      email: '',
      phone: ''
    }
  }, {
    ticketIssueTime: '',
    ticketDocNo: '',
    priceClass: '',
    priceClassCode: '',
    ticketPnr: '',
    ticketDocObj: {
      airLineId: "",
      bookingRefId: "",
      orderId: "",
      owner: "",
      passengerRef: ""
    },
    flightSegments: [],
    passengerList: [],
    contactInfo: {
      email: '',
      phone: ''
    }
  }];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public alert: AlertService,
    public flightBookingService: FlightBookingService,
  ) { }

  ngOnInit() {
    // this.bookedFlight = JSON.parse(localStorage.getItem('bookedOrder'));
    // console.log(this.bookedFlight);

    this.route.queryParams.subscribe((params) => {

      const flightBookingKeys = JSON.parse(params.flightBookingKeys);

      const orders = [];

      flightBookingKeys.forEach((bookingKey) => {
        if (!bookingKey.bookingRefId || !bookingKey.otherId || !bookingKey.airlineName || !bookingKey.airlineCode || !bookingKey.orderId || !bookingKey.owner) {
          this.alert.error('Invalid Booking Id');
          return this.router.navigate(['']);
        }
        const keys = {
          'bookingRefId': bookingKey.bookingRefId,
          'otherId': bookingKey.otherId,
          'airlineName': bookingKey.airlineName,
          'airlineCode': bookingKey.airlineCode,
          'orderId': bookingKey.orderId,
          'owner': bookingKey.owner,
        }
        orders.push(keys);
      });

      // retrieve each orders
      orders.forEach((order, i) => {
        this.orderRetrive(order, i);
      })
    }, (err) => {
      console.log(err);
    });

  }

  orderRetrive(order, i) {
    console.log('order retrieve')
    this.flightBookingService.orderRetrive(order).subscribe((response) => {
      // console.log(response);

      const data = response['OrderViewRS'].Response;

      const segmentList = data['DataLists']['FlightSegmentList']['FlightSegment'];

      let flightSegmentList = [];

      if (Array.isArray(segmentList)) {
        // if segmentList is array of segments
        flightSegmentList = segmentList;
      } else {
        // if segmentList is single object
        flightSegmentList[0] = segmentList;
      }

      const flightSegments = [];

      flightSegmentList.forEach((flightSegment) => {

        let selectedPriceClass: any;

        const priceClass = data.DataLists.PriceClassList.PriceClass;
        if (Array.isArray(priceClass)) {
          selectedPriceClass = priceClass.filter((el) => el.Code === flightSegment.ClassOfService.Code)[0].Name;
        } else {
          selectedPriceClass = priceClass.Name;
        }

        const flightSegmentsObj = {
          airlineName: flightSegment.MarketingCarrier.Name,
          airlineId: flightSegment.MarketingCarrier.AirlineID,
          flightNo: flightSegment.MarketingCarrier.FlightNumber,
          duration: this.parseTime(flightSegment.FlightDetail.FlightDuration.Value),
          priceClass: selectedPriceClass,
          arrival: {
            airportCode: flightSegment.Arrival.AirportCode,
            airportName: flightSegment.Arrival.AirportName,
            date: flightSegment.Arrival.Date,
            time: flightSegment.Arrival.Time
          },
          departure: {
            airportCode: flightSegment.Departure.AirportCode,
            airportName: flightSegment.Departure.AirportName,
            date: flightSegment.Departure.Date,
            time: flightSegment.Departure.Time
          }
        }

        flightSegments.push(flightSegmentsObj);
      })
      console.log(this.retrievedOrders[i], i)
      this.retrievedOrders[i].flightSegments = flightSegments;

      const passengerRef = data.DataLists.PassengerList.Passenger;
      let passenger = [];
      if (!Array.isArray(passengerRef)) {
        passenger[0] = passengerRef;
      } else {
        passenger = passengerRef;
      }

      passenger.forEach((el) => {
        const passengerObj = {
          nameTitle: el.Individual.NameTitle,
          firstName: el.Individual.GivenName,
          middleName: el.Individual.MiddleName,
          lastName: el.Individual.Surname,
          dob: el.Individual.Birthdate,
          gender: el.Individual.Gender,
          type: el.PTC
        }
        this.retrievedOrders[i].passengerList.push(passengerObj);
      })

      // @TODO temporary

      let ticketDocInfo;

      if (Array.isArray(data.TicketDocInfos.TicketDocInfo)) {
        ticketDocInfo = data.TicketDocInfos.TicketDocInfo[0];
      } else {
        ticketDocInfo = data.TicketDocInfos.TicketDocInfo;
      }

      this.retrievedOrders[i].ticketDocNo = ticketDocInfo.TicketDocument.TicketDocNbr;
      this.retrievedOrders[i].ticketIssueTime = `${ticketDocInfo.TicketDocument.DateOfIssue} ${ticketDocInfo.TicketDocument.TimeOfIssue}`;
      // this.ticketDocObj.bookingRefId = data.Order.BookingReferences.BookingReference[0].ID;

      // segment 1
      // this.ticketPnr = data.TicketDocInfos.TicketDocInfo.TicketDocument.CouponInfo.CouponNumber;

      const couponInfo = ticketDocInfo.TicketDocument.CouponInfo;

      if (Array.isArray(couponInfo)) {
        this.retrievedOrders[i].ticketPnr = couponInfo[0].CouponNumber;
      } else {
        this.retrievedOrders[i].ticketPnr = couponInfo.CouponNumber;
      }

      let order = data.Order;

      // mistake in backend - sometimes returning two similar arrays order
      if (Array.isArray(order)) {
        order = order[0];
      }

      // for doc issue
      this.retrievedOrders[i].ticketDocObj.airLineId = order.BookingReferences.BookingReference[1].AirlineID.content;

      this.retrievedOrders[i].ticketDocObj.bookingRefId = ticketDocInfo.TicketDocument.TicketDocNbr;

      this.retrievedOrders[i].ticketDocObj.orderId = order.OrderID;

      this.retrievedOrders[i].ticketDocObj.owner = order.Owner;

      this.retrievedOrders[i].ticketDocObj.passengerRef = ticketDocInfo.PassengerReference;

      let contactInfo;

      if (Array.isArray(data.DataLists.ContactList.ContactInformation)) {
        contactInfo = data.DataLists.ContactList.ContactInformation[0];
      } else {
        contactInfo = data.DataLists.ContactList.ContactInformation;
      }

      this.retrievedOrders[i].contactInfo.email = contactInfo.ContactProvided[0].EmailAddress.EmailAddressValue;

      this.retrievedOrders[i].contactInfo.phone = contactInfo.ContactProvided[1].Phone.PhoneNumber;

    }, (err) => {
      this.alert.error(err);
    });
  }

  orderDocIssue() {
    this.flightBookingService.orderDocIssue(this.ticketDocObj).subscribe((response) => {
      console.log(response);
    }, (err) => {
      console.log(err);
    })
  }

  orderCancelClicked(order) {
    console.log(order);
    this.flightBookingService.orderCancel(order.ticketDocObj.orderId, order.ticketDocObj.owner).subscribe((response) => {
      console.log(response);
      Swal(
        'Order Canceled!',
        `Your order with the PNF: ${order.ticketPnr} has been canceled.`,
        'success'
      );
    }, (err) => {
      console.log(err);
      Swal(
        `Your order with the PNF: ${order.ticketPnr} cannot be canceled.`,
        `Error: ${err}`,
        'error'
      );
    });
  }

  parseTime(t) {
    const hrs = t.replace('PT', '').replace(/H.*$/, '');
    const mins = t.replace('PT', '').replace(/^(.*H)/, '').replace(/M.*$/, '');
    // console.log(`${hrs}hrs ${mins}mins`);
    return `${hrs}hrs ${mins}mins`;
  }

  totalDuration(depTime, ArrTime) {
    let depHrs = depTime.replace(/:.*$/, '');
    let depMins = depTime.replace(/^(.*:)/, '');
    let arrHrs = ArrTime.replace(/:.*$/, '');
    let arrMins = ArrTime.replace(/^(.*:)/, '');

    let hrs, mins;
    if (arrHrs < depHrs)
      hrs = 24 + parseInt(arrHrs) - parseInt(depHrs);
    else
      hrs = parseInt(arrHrs) - parseInt(depHrs);

    if (arrMins < depMins) {
      mins = 60 + parseInt(arrMins) - parseInt(depMins);
      // hrs++;
      hrs--;
    } else
      mins = parseInt(arrMins) - parseInt(depMins);
    // console.log(`${hrs}hrs ${mins}mins`);
    return `${hrs}hrs ${mins}mins`;
  }

}
