import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  constructor(
    public api: ApiService
  ) { }


  orderRetrive(order) {
    return new Observable((observer) => {
      const reqBody = {
        "bookingReff": {
          "id": order.bookingRefId,
          "otherId": order.otherId
        },
        "bookingReff2": {
          "airlineName": order.airlineName,
          "airlineCode": order.airlineCode,
          "id": order.bookingRefId
        },
        "orderId": order.orderId,
        "owner": order.owner,
        "travelAgency": {
          "agencyID": "string",
          "email": "string",
          "iata_Number": "string",
          "name": "string",
          "pseudoCity": "string"
        }
      };

      this.api.post('/flights/order-retrieve', reqBody).subscribe((response) => {
        // this.api.loadData('/orderRetrive.json').subscribe((response) => {
        console.log(response);
        console.log(JSON.stringify(response));

        const data = response.OrderViewRS;

        if (data.Errors) {
          console.log('Cannot get order view.');
          if (data.Errors.ErrorMessage) {
            return observer.error(data.Errors.ErrorMessage);
          } else {
            return observer.error(data.Errors.Error);
          }
        }

        observer.next(response);
        observer.complete();
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
    });
  }

  orderCancel(orderId, owner) {
    return new Observable((observer) => {
      const reqBody = {
        "orderId": orderId,
        "owner": owner,
        "travelAgency": {
          "agencyID": "string",
          "email": "string",
          "iata_Number": "string",
          "name": "string",
          "pseudoCity": "string"
        }
      }

      this.api.post('/flights/order-cancel', reqBody).subscribe((response) => {
        // this.api.loadData('/cancelOrder.json').subscribe((response) => {
        console.log(response);
        console.log(JSON.stringify(response));

        const data = response.OrderCancelRS;

        if (data.Errors) {
          console.log('Cannot flight');
          if (data.Errors.ErrorMessage) {
            return observer.error(data.Errors.ErrorMessage);
          } else {
            return observer.error(data.Errors.Error);
          }
        }

        observer.next(response);
        observer.complete();
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
    });
  }


  orderDocIssue(ticketDocObj) {
    return new Observable((observer) => {
      const reqBody = {
        "contactContactInformation": [
          {
            "countryDailingCode": "91",
            "email": {
              "email": "ankit@gmail.com",
              "lable": "Personal"
            },
            "id": "CID1",
            "phone": {
              "countryDialingCode": "91",
              "lable": "Personal",
              "phone": "9999999999"
            },
            "postalInfo": {
              "cityName": "Delhi",
              "countryCode": "IND",
              "countrySubdivisionName": "Delhi",
              "label": "Home",
              "postalCode": "110019",
              "street": "Nehru Place"
            }
          }
        ],
        "ticketDocInfo": {
          "bookingRef": {
            "airLineId": ticketDocObj.airLineId,
            "id": ticketDocObj.bookingRefId
          },
          "cardPayment": {
            "amount": "string", "approvalType": "string",
            "cardCode": "string",
            "cardHolderBillingAddress": {
              "cityName": "string",
              "countryCode": "string",
              "postalCode": "string",
              "stateProv": "string",
              "street": "string"
            },
            "cardHolderName": "string",
            "cardNumber": "string",
            "contactInfoRefs": "string",
            "expiration": "string",
            "orderId": "string",
            "orderItemId": "string",
            "owner": "string",
            "seriesCode": "string",
            "type": "string"
          },
          "cashPayment": {
            "amount": "string",
            "contactInfoRefs": "CID1",
            "orderId": "string",
            "orderItemId": "string",
            "owner": "string",
            "type": "string"
          },
          "orderRef": {
            "orderId": ticketDocObj.orderId,
            "owner": ticketDocObj.owner
          },
          "passengerRef": ticketDocObj.passengerRef
        },
        "ticketDocQuantity": 0,
        "travelAgency": {
          "agencyID": "string",
          "email": "string",
          "iata_Number": "string",
          "name": "string",
          "pseudoCity": "string"
        },
        "travelers": [
          {
            "contactReff": "CID1",
            "dob": "1999-10-16",
            "email": "ankit@gmail.com",
            "gender": "Male",
            "id": "T1",
            "middle": "Prasad",
            "name": "Ankit",
            "nameTitle": "Mr",
            "phone": "9999999999",
            "residenceCountryCode": "IND",
            "surname": "Phondani",
            "type": "ADT"
          }
        ]
      }

      // console.log(flight)
      console.log(reqBody);
      // spelling mistake made in backend
      this.api.post('/orderDocIssue', reqBody).subscribe((response) => {
        // this.api.loadData('/orderDocIssue.json').subscribe((response) => {
        // console.log(response);
        console.log(JSON.stringify(response));

        const data = response.OrderViewRS;

        if (data.Errors) {
          console.log('Cannot get order view.');
          return observer.error(data.Errors.ErrorMessage);
        }

        observer.next(response);
        observer.complete();
      }, (err) => {
        console.log(err);
        observer.error(err);
      });
    });
  }
}
