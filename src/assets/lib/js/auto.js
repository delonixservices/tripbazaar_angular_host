$(document).ready(function(){

  initSliders();

  var FJS = FilterJS.auto(hotels);

  FJS.addCallback('afterFilter', function(result){

    $('#total_movies').text(result.length);
  });

  FJS.filter();

  window.FJS = FJS;
});

function initSliders(){
  $("#rates_slider").slider({
    min: 0,
    max: 100000,
    values:[0, 100000],
    step: 10,
    range:true,
    slide: function( event, ui ) {
      $("#rates_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ]);
      $('#range_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });
// 
  // $('#genre_criteria :checkbox').prop('checked', true);
  $('#all_options_room_type').on('click', function(){
    $('#room_type_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });

  $('#all_options_refundable_criteria').on('click', function(){
    $('#refundable_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });

  $('#all_options_food_served_criteria').on('click', function(){
    $('#food_served_criteria :checkbox').prop('checked', $(this).is(':checked'));
  });
}