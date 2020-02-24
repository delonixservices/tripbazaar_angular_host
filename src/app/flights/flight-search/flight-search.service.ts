import { Injectable } from "@angular/core";
import { ApiService } from '../../core/services/api.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FlightSearchService {

  private ngUnsubscribe = new Subject();

  constructor (
    public api: ApiService
  ) { }

  getFlights(departureAirport, arrivalAirport, departureDate, returnDate, passengers): Observable<any> {
    return new Observable((observer) => {
      const reqUrl = '/flights/flight-search/';

      let isTwoWayJourney: boolean = false;

      let originAndDes = [{
        "arrival": {
          "airportCode": arrivalAirport
        },
        "departure": {
          "airportCode": departureAirport,
          "date": departureDate
        }
      }];

      if (returnDate) {
        isTwoWayJourney = true;

        originAndDes = [{
          "arrival": {
            "airportCode": arrivalAirport
          },
          "departure": {
            "airportCode": departureAirport,
            "date": departureDate
          }
        }, {
          "arrival": {
            "airportCode": departureAirport
          },
          "departure": {
            "airportCode": arrivalAirport,
            "date": returnDate
          }
        }];
      }

      const travelers = [];
      const adult_count = passengers.adult_count;
      const child_count = passengers.child_count;
      const infant_count = passengers.infant_count;

      // const totalTravelers = adult_count + child_count + infant_count;
      let travelerCount = 0;
      for (let i = 0; i < adult_count; i++) {
        travelerCount++;
        const traveler = {
          "anonymous": true,
          "id": `T${travelerCount}`,
          "type": "ADT"
        }
        travelers.push(traveler);
      }

      for (let i = 0; i < child_count; i++) {
        travelerCount++;
        const traveler = {
          "anonymous": true,
          "id": `T${travelerCount}`,
          "type": "CHD"
        }
        travelers.push(traveler);
      }

      for (let i = 0; i < infant_count; i++) {
        travelerCount++;
        const traveler = {
          "anonymous": true,
          "id": `T${travelerCount}`,
          "type": "INF"
        }
        travelers.push(traveler);
      }

      const reqBody = {
        "originAndDes": originAndDes,
        "preferences": {
          "airLine": {
            "email": "string",
            "iataNumber": "string",
            // "id": "UK",
            "id": "6E",
            "name": "string",
            "type": ""
          },
          "classCode": "5"
        },
        "travelAgency": {
          "agencyID": "string",
          "email": "string",
          "iata_Number": "string",
          "name": "string",
          "pseudoCity": "string"
        },
        "travelers": travelers
      }

      this.api.post(reqUrl, reqBody)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response) => {
          // load static data
          // this.api.loadData('/flightSearch.json').subscribe((response) => {
          // this.api.loadData('/flightSearchReturn.json').subscribe((response) => {
          console.log(response);
          console.log(JSON.stringify(response));

          const data = response['DelonixShoppingRes'];
          if (data.Errors) {
            console.log('Sorry no flights found.');
            return observer.error(data.Errors.Error.content);
          }

          const shoppingResponseID = data.ShoppingResponseID;

          const originDestination = data.DataLists.OriginDestinationList.OriginDestination;

          // string of flight keys seprated by space
          let oneWayFlightStr: string;
          if (Array.isArray(originDestination)) {
            console.log(arrivalAirport, departureAirport)
            const orgDes = originDestination.filter((el) => el.ArrivalCode === arrivalAirport && el.DepartureCode === departureAirport)[0];
            if (orgDes) {
              oneWayFlightStr = orgDes.FlightReferences.content;
            } else {
              return observer.error('Origin Destination not found');
            }
          } else {
            oneWayFlightStr = originDestination.FlightReferences.content;
          }

          const oneWayFlightList = data.DataLists.FlightList.Flight.filter((el => oneWayFlightStr.includes(el.FlightKey)));

          // for return flight arrivalAirport will be departureAirport  and departureAirport will be arrivalAirport
          let returnFlightList: [];
          if (isTwoWayJourney) {
            // string of flight keys seprated by space
            const returnFlightStr = originDestination.filter((el) => el.ArrivalCode === departureAirport && el.DepartureCode === arrivalAirport)[0].FlightReferences.content;

            returnFlightList = data.DataLists.FlightList.Flight.filter((el => returnFlightStr.includes(el.FlightKey)));
          }

          const flightSegmentList = data['DataLists']['FlightSegmentList']['FlightSegment'];

          const offers = data['OffersGroup']['AirlineOffers']['Offer'];

          let flightTypeId = "SD";
          let oneWayFlights = this.parseFlights(oneWayFlightList, flightSegmentList, offers, flightTypeId);
          let returnFlights = [];
          if (isTwoWayJourney) {
            flightTypeId = "DS";
            returnFlights = this.parseFlights(returnFlightList, flightSegmentList, offers, flightTypeId);
          }

          const passengers = data.DataLists.PassengerList.Passenger;

          let passengerList = [];

          if (!Array.isArray(passengers)) {
            passengerList[0] = passengers;
          } else {
            passengerList = passengers;
          }

          const flights = {
            'oneWayFlights': oneWayFlights,
            'returnFlights': returnFlights,
            'passengers': passengerList,
            'responseId': shoppingResponseID.ResponseID
          }
          // return flights;
          observer.next(flights);
          observer.complete();
        }, err => {
          console.log(err);
          return observer.error(err);
          // this.alert.error(err.message);
        })

    })
  }

  parseFlights(flightList, flightSegmentList, offers, flightTypeId) {

    const flights = [];

    // Find detail of every flight
    flightList.forEach((flight) => {
      const segmentRefs = flight.SegmentReferences.content;

      const segmentKeys = segmentRefs.split(/(\s+)/).filter(seg => seg.trim().length > 0);

      const flightSegments = [];

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

      const offerRef = offers.filter(el => el.FlightsOverview.FlightRef.content === flight.FlightKey)[0];

      let offerItemsRef = [];

      if (!Array.isArray(offerRef.OfferItem)) {
        offerItemsRef[0] = offerRef.OfferItem;
      } else {
        offerItemsRef = offerRef.OfferItem;
      }

      // console.log(offerItemsRef)

      const offerID = offerRef.OfferID;

      const owner = offerRef.Owner;

      const offerItems = [];

      offerItemsRef.forEach((item) => {
        const offerItem = {
          "offerItemId": item.OfferItemID,
          // every offerItem will have different passengerRefs
          "passengerRefs": item.Service[0].PassengerRefs
        }
        offerItems.push(offerItem);
      });

      let fareDetails = [];

      offerItems.forEach((item) => {
        const fare = offerItemsRef.filter((el) => el.OfferItemID === item.offerItemId)[0].FareDetail.Price;

        const fareDetailObj = {
          passengerRefs: item.passengerRefs,
          baseAmount: fare.BaseAmount.content,
          taxes: fare.Taxes.Total.content,
          totalAmount: Math.floor(fare.TotalAmount.DetailCurrencyPrice.Total.content)
        }
        fareDetails.push(fareDetailObj);
      })

      // Beggage Allowance
      // const baggage = data['DataLists']['BaggageAllowanceList']['BaggageAllowance'];

      // error conflict

      // const checkIn = baggage.filter(el => el.BaggageCategory === 'Checked')[0].WeightAllowance.MaximumWeight.Value;
      // const cabin = baggage.filter(el => el.BaggageCategory === 'CarryOn')[0].WeightAllowance.MaximumWeight.Value;

      const checkIn = 7;
      const cabin = 13;

      const baggageAllowance = {
        checkIn: `${checkIn}kgs`,
        cabin: `${cabin}kgs`
      }

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
        flightTypeId: flightTypeId,
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
        fareDetails: fareDetails,
        baggageAllowance: baggageAllowance,
        offerId: offerID,
        owner: owner,
        offerItems: offerItems,
      }

      flights.push(flightObj);
    });

    return flights;
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

  handleUnsubscribe() {
    this.ngUnsubscribe.next();
    // can't unsubscribe again after calling .complete()
    // this.ngUnsubscribe.complete();
  }
}
