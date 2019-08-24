import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services';

@Component({
	selector: 'app-dashboard-page',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

	public loginUser: any;
	public transactions: any;

	constructor(private router: Router, public api: ApiService) {

	}

	getMyTransaction() {
		this.api.post("/mytransaction", { "user": this.loginUser })
			.subscribe((response) => {
				if (response.status == 200) {
					this.transactions = response.data;
					console.log(this.transactions);
				}

			}, (err) => {
			})
	}

	cancelHotelBooking(transactionid) {
		this.api.post("/cancel", { "user": this.loginUser, 'transactionid': transactionid })
			.subscribe((response) => {
				if (response.status == 200) {
					// this.transactions = response.data;
					console.log(response);
				}

			}, (err) => {
			})
	}

	hotelinvoice(id) {
		this.router.navigate(['/hotelinvoice'], { queryParams: { id: id } });
	}

	ngOnInit() {

		this.api.get("/auth/me")
			.subscribe((response) => {
				if (response.status == 200) {
					this.loginUser = response.data;
					this.getMyTransaction();
				}

			}, (err) => {
				this.router.navigate(['/login']);
			})
	}

}
