/* Author: 

*/

(function( $ ){

  var Bricker = {
    fetchFragments: function(prefix) {
      if (prefix != '/') return []; 
      return ['container', 'content', 'transition'];
    }, 

    buildFragmentLi: function (prefix, fragment) {
      var li = $('<li>'+fragment+'</li>'); 
      li.data('prefix', [prefix, fragment].join('/'));
      return li;
    }
  };

  $.fn.bricker = function( prefix ) {  

    // Prepare shit
    var fragments = Bricker.fetchFragments(prefix),
        container = $(this),
               ul = $('<ul class="fragments" />');

    // Fill fragment list
    $.each(fragments,function(i,f){
      var li = Bricker.buildFragmentLi(prefix, f);
      ul.append(li); 
    });

    // Add fragment list
    container.append(ul); 

    // Add bricker container
    container.append($('<div />'));
  }

})(jQuery);


$(document).ready(function(){

  $('#main').bricker('/');

});



















