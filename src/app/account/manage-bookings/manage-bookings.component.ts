import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-bookings',
  templateUrl: './manage-bookings.component.html',
  styleUrls: ['./manage-bookings.component.css']
})

export class ManageBookingsComponent implements OnInit {

  public transaction: any;
  private loginUser: any;
  private cancellation: any;

  constructor(
    public api: ApiService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.transaction = JSON.parse(localStorage.getItem('manage_booking'));
    console.log(this.transaction);

    this.cancellation = this.transaction.cancel_response;

    this.api.get("/auth/me")
      .subscribe((response) => {
        if (response) {
          this.loginUser = response;
        }

      }, (err) => {
        this.router.navigate(['/account/login']);
      })
  }


  isCancelAllowed(date) {
    const checkInDate = new Date(date).getTime();
    return checkInDate > Date.now();
  }

  cancelHotelBooking(transactionid) {

    Swal({
      title: 'Are you sure?',
      text: 'Your hotel will be cancelled after this request',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'Do not cancel'
    }).then((result) => {
      if (result.value) {
        this.api.post("/hotels/cancel", { "user": this.loginUser, 'transactionId': transactionid })
          .subscribe((response) => {
            console.log(response)
            if (response && response.data) {
              this.cancellation = response;
              Swal({
                title: 'Hotel Cancelled!',
                text: 'Your hotel has been cancelled successfully',
                type: 'success'
              })
              console.log(response);
            }

          }, (err) => {
            Swal({
              title: 'Hotel Cancellation Failed!',
              text: "Hotel cannot be cancelled! Please try again.",
              type: 'error'
            })
          })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // handle dismiss
      }
    })
  }
}
