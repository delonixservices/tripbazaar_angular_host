import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlightBookingService {

  constructor (
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
        // console.log(JSON.stringify(response));

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
}
