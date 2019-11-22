import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public loginUser: any;
  public transactions: any;

  constructor(
    private router: Router,
    public api: ApiService,
  ) {

  }

  ngOnInit() {

    this.api.get("/auth/me")
      .subscribe((response) => {
        if (response) {
          this.loginUser = response;
          this.getMyTransaction();
        }
        // if (response.status === 200) {
        // 	this.loginUser = response.data;
        // 	this.getMyTransaction();
        // } else {
        // 	this.router.navigate(['/account/login']);
        // }

      }, (err) => {
        this.router.navigate(['/account/login']);
      })
  }


  getMyTransaction() {
    this.api.post("/hotels/transactions", { "user": this.loginUser })
      .subscribe((response) => {
        this.transactions = response.data;
        console.log(this.transactions);
      }, (err) => {
        console.log(err);
      })
  }

  viewDetailsClickHandler(transaction) {
    localStorage.setItem('manage_booking', JSON.stringify(transaction));
    this.router.navigate(['account/manage-booking']);
  }

  // cancelHotelBooking(transactionid) {

  //   Swal({
  //     title: 'Are you sure?',
  //     text: 'Your hotel will be cancelled after this request',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, cancel it!',
  //     cancelButtonText: 'Do not cancel'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.api.post("/hotels/cancel", { "user": this.loginUser, 'transactionId': transactionid })
  //         .subscribe((response) => {
  //           console.log(response)
  //           if (response && response.data) {
  //             this.transactions.forEach((transaction) => {
  //               if (transaction._id === transactionid) {
  //                 transaction.status = 2;
  //               }
  //             })
  //             Swal({
  //               title: 'Hotel Cancelled!',
  //               text: 'Your hotel has been cancelled successfully',
  //               type: 'success'
  //             })
  //             console.log(response);
  //           }

  //         }, (err) => {
  //           Swal({
  //             title: 'Hotel Cancellation Failed!',
  //             text: "Hotel cannot be cancelled! Please try again.",
  //             type: 'error'
  //           })
  //         })
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // handle dismiss
  //     }
  //   })
  // }

  hotelInvoice(id) {
    this.router.navigate(['/hotels/hotelinvoice'], { queryParams: { id: id } });
  }

  hotelVoucher(id) {
    this.router.navigate(['/hotels/hotelvoucher'], { queryParams: { id: id } });
  }

  // isCancelAllowed(date) {
  //   const checkInDate = new Date(date).getTime();
  //   return checkInDate > Date.now();
  // }
}
