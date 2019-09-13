$(function () {

	// $("#passenger-menu, #hotel-menu").click(function () {
	// 	$(".passenger").show();
	// });

	// $(document).mouseup(function (e) {
	// 	var container = $(".passenger");

	// 	// if the target of the click isn't the container nor a descendant of the container
	// 	if (!container.is(e.target) && container.has(e.target).length === 0) {
	// 		console.log('11')
	// 		// container.hide();
	// 	}
	// });

	/* Bootstrap DatePicker*/
	$('.mydatepicker, #datepicker').datepicker();
	$('.checkInDate').datepicker({
		// format: 'yyyy/mm/dd',
		autoclose: true,
		todayHighlight: true,
		toggleActive: true,
		startDate: 'd',
	});
	$('.checkOutDate').datepicker({
		// format: 'yyyy/mm/dd',
		autoclose: true,
		todayHighlight: true,
		toggleActive: true,
		startDate: '+1d',
	});

	$(".close").click(function () {
		$(".side-panel-holder ").hide();
	})
	$(".gstform").click(function () {
		$(".side-panel-holder ").hide();
	})

	$(".gst").click(function () {
		$(".gst-holder").show();
		$(".side-panel").addClass("slideInRight");
	})

	$(".remove-discount").click(function () {
		$(".coupon-discount").hide(100);
	})
	// $('#datepicker-autoclose').datepicker({
	//     autoclose: true,
	// 	todayHighlight: true,
	// 	format: 'yyyy/mm/dd',
	// 	startDate: new Date(),
	// });

	// commented by me
	// $(".last-dt").blur(function () {
	// 	$(".passenger").show();
	// 	$("#adult").focus();
	// });


	// $('input[name=class]').blur(function () {
	// 	$(".passenger").hide();
	// });// $('input[name=class]').blur(function () {
	// 	$(".passenger").hide();
	// });

	// jQuery('.mydatepicker, #datepicker').datepicker();
	// jQuery('#datepicker-autoclose').datepicker({
	//         autoclose: true,
	//         todayHighlight: true
	// });

	// jQuery('.mydatepicker, #datepicker').datepicker();
	// jQuery('#datepicker-autoclose').datepicker({
	//         autoclose: true,
	//         todayHighlight: true
	// });

	$('.fair-fee').popover({
		trigger: "click"
	});
	$("[data-toggle='popover']").on('show.bs.popover', function () {
		$(this).attr("data-content", $(this).parent().children(".popover-content").html());

	});

	$(".close").click(function () {
		$(".side-panel-holder ").hide();
	})

	$(".gst").click(function () {
		$(".gst-holder").show();
		$(".side-panel").addClass("slideInRight");
	})

	$(".remove-discount").click(function () {
		$(".coupon-discount").hide(100);
	})


	$(".depart .col").click(function () {
		$(this).toggleClass("active");

	});

	$(".depart .col input").click(function () {
		$(this).parent().parent().click();

	});

	// var adults = document.getElementById("adult");
	// var output1 = document.getElementById("total-adult");
	// output1.innerHTML = adults.value;

	// adults.oninput = function() {
	//   output1.innerHTML = this.value;
	// }

	// var child = document.getElementById("child");
	// var output2 = document.getElementById("total-child");
	// output2.innerHTML = child.value;

	// child.oninput = function() {
	//   output2.innerHTML = this.value;
	// }

	// Hotel 
	// var adults = document.getElementById("adult-hotel");
	// var output1 = document.getElementById("total-adult-hotel");
	// output1.innerHTML = adults.value;

	// adults.oninput = function () {
	// 	output1.innerHTML = this.value;
	// }

	// var child = document.getElementById("child-hotel");
	// var output2 = document.getElementById("total-child-hotel");
	// output2.innerHTML = child.value;

	// child.oninput = function () {
	// 	output2.innerHTML = this.value;
	// }


	// var infant = document.getElementById("infant");
	// var output3 = document.getElementById("total-infant");
	// output3.innerHTML = infant.value;

	// infant.oninput = function() {
	//   output3.innerHTML = this.value;
	// }

	// $(".addroom").click(function () {
	// 	$("#room2, .removeroom").show()
	// });

	// $(".removeroom").click(function () {
	// 	$("#room2, .removeroom").hide()
	// });

	// $('#select-passanger').click((e) => {
	// 	console.log(e.target.id);
	// 	if (e.target.id === "done") {
	// 		$(".dropdown #select-passanger #done").click(function (e) {
	// 			$('.dropdown #select-passanger').dropdown("toggle");
	// 			$('.dropdown #hotel-menu').dropdown("toggle");
	// 		});
	// 	} else {
	// 		e.stopImmediatePropagation();
	// 	}
	// })

	$('body').prepend('<a class="back-to-top">Back To Top  </a>');

	$(window).scroll(function () {
		if ($(window).scrollTop() > 300) {
			$('a.back-to-top').fadeIn('show');
			$('a.back-to-top').click(() => {
				// document.body.scrollTop = document.documentElement.scrollTop = 0;
				window.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			})
		} else {
			$('a.back-to-top').fadeOut('show');
		}
	})
});