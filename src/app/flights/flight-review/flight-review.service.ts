import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FlightReviewService {

  constructor (
    public api: ApiService
  ) { }

  getPrice(flight, returnFlight, passengers, responseId): Observable<any> {
    return new Observable((observer) => {

      const travelers = [];

      console.log(passengers);

      passengers.forEach((el) => {
        const traveler = {
          "anonymous": true,
          "type": el.PTC,
          "id": el.PassengerID
        }
        travelers.push(traveler);
      });

      const adult_count = passengers.adult_count;
      const child_count = passengers.child_count;
      const infant_count = passengers.infant_count;

      // const totalTravelers = adult_count + child_count + infant_count;

      for (let i = 0; i < adult_count; i++) {
        const traveler = {
          "anonymous": true,
          "type": "ADT"
        }
        travelers.push(traveler);
      }

      for (let i = 0; i < child_count; i++) {
        const traveler = {
          "anonymous": true,
          "type": "CHD"
        }
        travelers.push(traveler);
      }

      for (let i = 0; i < infant_count; i++) {
        const traveler = {
          "anonymous": true,
          "type": "INF"
        }
        travelers.push(traveler);
      }

      const offers = [];

      // const flightOfferObj = {
      //   "offerId": flight.offerId,
      //   "offerItems": [
      //     {
      //       "offerItemId": flight.offerItemId,
      //       "passengerRefs": flight.passengerRefs,
      //       "seatSelection": {
      //         "column": "string",
      //         "row": "string"
      //       }
      //     }
      //   ],
      //   "owner": flight.owner,
      //   "responseId": responseId
      // }

      const flightOfferObj = {
        "offerId": flight.offerId,
        "offerItems": flight.offerItems,
        "owner": flight.owner,
        "responseId": responseId
      }
      offers.push(flightOfferObj);

      if (returnFlight) {
        const returnFlightOfferObj = {
          "offerId": returnFlight.offerId,
          "offerItems": returnFlight.offerItems,
          "owner": returnFlight.owner,
          "responseId": responseId
        }
        offers.push(returnFlightOfferObj);
      }

      const reqBody = {
        "offers": offers,
        "travelAgency": {
          "agencyID": "",
          "email": "",
          "iata_Number": "",
          "name": "",
          "pseudoCity": ""
        },
        "travelers": travelers
      }
      console.log(flight);
      console.log(reqBody);

      // spelling mistake made in backend /priceRequset
      this.api.post('/flights/flight-price', reqBody).subscribe((response) => {
        // this.api.loadData('/priceRequest.json').subscribe((response) => {
        // this.api.loadData('/priceRequestReturn.json').subscribe((response) => {

        console.log(response);
        console.log(JSON.stringify(response));

        const data = response.DelonixOfferPriceRes;

        if (data.Errors) {
          console.log('Your session is expired.');
          return observer.error(data.Errors.Error.content);
        }

        const responseId = data.ShoppingResponseID.ResponseID;

        const transactionIdentifier = response.transaction_identifier;

        const flight = data.DataLists.FlightList.Flight;

        let flightList = [];
        if (Array.isArray(flight)) {
          flightList = flight;
        } else {
          flightList[0] = flight;
        }

        let flightSegmentList = [];
        const segmentList = data['DataLists']['FlightSegmentList']['FlightSegment'];

        if (Array.isArray(segmentList)) {
          // if segmentList is array of segments
          flightSegmentList = segmentList;
        } else {
          // if segmentList is single object
          flightSegmentList[0] = segmentList;
        }

        const pricedOffer = data['PricedOffer'];

        let flights = [];

        flightList.forEach((flight) => {
          const flightObj = this.parseFlight(flight, flightSegmentList, pricedOffer);
          flights.push(flightObj);
        })

        const timeLimits = {
          "offerExpiration": {
            "time": pricedOffer.TimeLimits.OfferExpiration.DateTime
          },
          "ticketTimeLimit": pricedOffer.TimeLimits.OtherLimits.OtherLimit.TicketByTimeLimit.TicketBy

        }

        // Add fare detail
        let offerItemRef = pricedOffer.OfferItem;

        let offerItem = [];

        if (!Array.isArray(offerItemRef)) {
          offerItem[0] = pricedOffer.OfferItem;
        } else {
          offerItem = offerItemRef;
        }

        let fareDetails = {
          baseAmount: offerItem[0].FareDetail.Price.BaseAmount.content + offerItem[0].FareDetail.Price.BaseAmount.content,
          taxes: offerItem[0].FareDetail.Price.Taxes.Total.content,
          totalAmount: Math.floor(offerItem[0].FareDetail.Price.TotalAmount.DetailCurrencyPrice.Total.content)
        }

        if (offerItem.length > 1) {
          fareDetails = {
            baseAmount: offerItem[0].FareDetail.Price.BaseAmount.content + offerItem[1].FareDetail.Price.BaseAmount.content,
            taxes: offerItem[0].FareDetail.Price.Taxes.Total.content + offerItem[1].FareDetail.Price.Taxes.Total.content,
            totalAmount: Math.floor(offerItem[0].FareDetail.Price.TotalAmount.DetailCurrencyPrice.Total.content + offerItem[1].FareDetail.Price.TotalAmount.DetailCurrencyPrice.Total.content)
          }
        }

        const passengers = data.DataLists.PassengerList.Passenger;

        let passengerList = [];

        if (!Array.isArray(passengers)) {
          passengerList[0] = passengers;
        } else {
          passengerList = passengers;
        }

        const resObj = {
          flights: flights,
          fareDetails: fareDetails,
          timeLimits: timeLimits,
          responseId: responseId,
          passengerList: passengerList,
          transactionIdentifier: transactionIdentifier
        }

        observer.next(resObj);
        observer.complete();
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
    })
  }

  parseFlight(flight, flightSegmentList, pricedOffer) {

    const segmentRefs = flight.SegmentReferences.content;

    // const segmentKeys = segmentRefs.split(/(\s+)/).filter(seg => seg.trim().length > 0);

    // mistake in response: temporarily spliting segments using 'S': i.e SEG1SEG2 
    const segmentKeys = segmentRefs.split('S').filter(seg => seg.trim().length > 0).map((seg) => seg ? 'S' + seg : false);

    console.log(segmentKeys);

    const flightSegments = [];
    console.log(flightSegmentList);

    segmentKeys.forEach((segmentKey) => {
      const flightSegment = flightSegmentList.filter(el => el.SegmentKey === segmentKey)[0];

      const flightSegmentsObj = {
        airlineName: flightSegment.MarketingCarrier.Name,
        airlineID: flightSegment.MarketingCarrier.AirlineID,
        flightNo: flightSegment.MarketingCarrier.FlightNumber,
        duration: this.parseTime(flightSegment.FlightDetail.FlightDuration.Value),
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
    });

    const offerItemRef = pricedOffer.OfferItem;
    let offerItem = [];

    if (!Array.isArray(offerItemRef)) {
      offerItem[0] = pricedOffer.OfferItem;
    } else {
      offerItem = pricedOffer.OfferItem;
    }

    // Passenger Refs
    // const passengerRefs = pricedOffer.OfferItem[0].Service[0].PassengerRefs;

    // const offerItemId = pricedOffer.OfferItem[0].OfferItemID;

    const offerId = pricedOffer.OfferID;

    const owner = pricedOffer.Owner;

    const offerItems = [];

    offerItem.forEach((item) => {
      const offerItem = {
        "offerItemId": item.OfferItemID,
        // every offerItem will have different passengerRefs
        "passengerRefs": item.Service[0].PassengerRefs
      }
      offerItems.push(offerItem);
    });

    // Beggage Allowance
    // const baggage = pricedOffer.BaggageAllowance;

    // const checkIn = baggage.filter(el => el.BaggageCategory === 'Checked')[0].WeightAllowance.MaximumWeight.Value;
    // const cabin = baggage.filter(el => el.BaggageCategory === 'CarryOn')[0].WeightAllowance.MaximumWeight.Value;

    // const baggageAllowance = {
    //   checkIn: `${checkIn}kgs`,
    //   cabin: `${cabin}kgs`
    // }

    const firstFlightSegment = flightSegmentList.filter(el => el.SegmentKey === segmentKeys[0])[0];
    const lastFlightSegment = flightSegmentList.filter(el => el.SegmentKey === segmentKeys[segmentKeys.length - 1])[0];

    const isNonStop = segmentKeys.length > 1 ? false : true;
    let totalDuration;
    if (isNonStop) {
      totalDuration = this.parseTime(firstFlightSegment.FlightDetail.FlightDuration.Value);
    } else {
      totalDuration = this.totalDuration(firstFlightSegment.Departure.Time, lastFlightSegment.Arrival.Time);
    }

    const flightObj = {
      arrival: {
        airportCode: lastFlightSegment.Arrival.AirportCode,
        airportName: lastFlightSegment.Arrival.AirportName,
        date: lastFlightSegment.Arrival.Date,
        time: lastFlightSegment.Arrival.Time
      },
      departure: {
        airportCode: firstFlightSegment.Departure.AirportCode,
        airportName: firstFlightSegment.Departure.AirportName,
        date: firstFlightSegment.Departure.Date,
        time: firstFlightSegment.Departure.Time
      },
      totalDuration: totalDuration,
      nonStop: isNonStop,
      flightSegments: flightSegments,
      // baggageAllowance: baggageAllowance,
      offerId: offerId,
      owner: owner,
      offerItems: offerItems,
    }

    return flightObj;
  }


  processOrder(flights, contactdetails, passengers, responseId, transactionIdentifier) {
    return new Observable((observer) => {

      const contactInfo = [{
        "countryDailingCode": "91",
        "email": {
          "email": contactdetails.email,
          "lable": "Personal"
        },
        "id": "CID1",
        "phone": {
          "countryDialingCode": "91",
          "lable": "Personal",
          "phone": contactdetails.phone.toString()
        },
        "postalInfo": {
          "cityName": "Delhi",
          "countryCode": "IND",
          "countrySubdivisionName": "Delhi",
          "label": "Home",
          "postalCode": "110019",
          "street": "Nehru Place"
        }
      }];

      const travelers = [];

      passengers.forEach((passenger) => {
        const traveler = {
          "contactReff": "CID1",
          "dob": passenger.dob,
          "email": contactdetails.email,
          "gender": "Male",
          "id": passenger.id,
          "middle": passenger.middle_name,
          "name": passenger.first_name,
          "nameTitle": passenger.name_title,
          "phone": contactdetails.phone.toString(),
          "residenceCountryCode": "IND",
          "surname": passenger.last_name,
          "type": passenger.type
        }
        travelers.push(traveler);
      })

      const offers = [];

      flights.forEach((flight) => {
        const flightOfferObj = {
          "offerId": flight.offerId,
          "offerItems": flight.offerItems,
          "owner": flight.owner,
          "responseId": responseId
        }
        offers.push(flightOfferObj);
      })

      const reqBody = {
        "contactContactInformation": contactInfo,
        "offers": offers,
        "travelAgency": {
          "agencyID": "string",
          "email": "string",
          "iata_Number": "string",
          "name": "string",
          "pseudoCity": "string"
        },
        "travelers": travelers,
        "transactionIdentifier": transactionIdentifier
      }

      // console.log(flight)
      console.log(reqBody);
      // spelling mistake made in backend
      this.api.post('/flights/order-process', reqBody).subscribe((response) => {
        // this.api.loadData('/createOrder.json').subscribe((response) => {
        console.log(response);
        // console.log(JSON.stringify(response));

        // const data = response.OrderViewRS;

        // if (data.Errors) {
        //   console.log('Cannot get order view.');
        //   if (data.Errors.ErrorMessage) {
        //     return observer.error(data.Errors.ErrorMessage);
        //   } else {
        //     return observer.error(data.Errors.Error);
        //   }
        // }

        if (!response.bookingId) {
          return observer.error('Invalid booking Id');
        }

        observer.next(response);
        observer.complete();
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
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
