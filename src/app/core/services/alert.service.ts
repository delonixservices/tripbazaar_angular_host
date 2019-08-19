import { Injectable } from '@angular/core';
import swal from 'sweetalert2'

@Injectable()
export class AlertService {
	error(msg) {
		swal({
				title: 'Oops...',
				text: msg,
				type: 'error',
				confirmButtonText: 'Cool'
		});
	}
	success(msg) {
		swal({
				title: 'Good job!',
				text: msg,
				type: 'success',
				showConfirmButton: false,
				timer: 3000
		});
	}
	warning(msg) {
		swal({
				title: 'Warning!',
				text: msg,
				type: 'warning',
				confirmButtonText: 'ok'
		});
	}

}
