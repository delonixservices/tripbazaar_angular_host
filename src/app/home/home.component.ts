import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService, JwtService } from '../core/services';
declare var $: any;

@Component({
	selector: 'app-home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


	public allOffer = [];
	public validation: any;
	public allBanner: any;
	public allHoliday: any;
	public allHotel: any;


	customOptions: any = {
		item: 3,
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: true,
		navSpeed: 700,
		navText: ['', ''],
		nav: true
	}

	constructor(private router: Router, public api: ApiService, public jwt: JwtService) {


	}
	async ngOnInit() {
		await this.api.get("/site/allspecialoffer")
			.subscribe((response) => {

				if (response.status == 200) {
					response.data.map((item, index) => {
						item.id = index + 1;
						this.allOffer.push(item);
					})

					$(document).ready(function () {

						$(".owl-carousel").owlCarousel({
							loop: true,
							items: 3,
							autoPlay: 1000,
							nav: true,
							responsiveClass: true,
							stopOnHover: true,
							responsive: {
								0: {
									items: 1,
									nav: true
								},
								600: {
									items: 2,
									nav: false
								},
								1000: {
									items: 3,
									nav: true,
									loop: false,
									dots: true,
								}
							}

						});
					});
				}
			}, (err) => {

				if (err.message !== undefined) {
					this.validation = err.message
				}
			})



		this.api.get("/site/allbanner")
			.subscribe((response) => {

				if (response.status == 200) {
					this.allBanner = response.data;
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.validation = err.message
				}
			})



		this.api.get("/site/holidaypackage")
			.subscribe((response) => {

				if (response.status == 200) {
					this.allHoliday = response.data;
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.validation = err.message
				}
			})



		this.api.get("/site/popularhotel")
			.subscribe((response) => {

				if (response.status == 200) {
					this.allHotel = response.data;
				}
			}, (err) => {
				if (err.message !== undefined) {
					this.validation = err.message
				}
			})
	}
}
