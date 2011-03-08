/* Author: 

*/

(function( $ ){

  var Bricker = {
    fetchFragments: function(prefix) {

      if (prefix == '') return ['container', 'content/_id_', 'transition'];
      if (prefix == '/content/_id_') return ['eins', 'zwo'];
      if (prefix == '/content/_id_/zwo') return ['foo'];
      return { foo: 1}; 
    }, 

    buildFragmentLi: function (prefix, fragment) {
      var li = $('<li>'+fragment+'</li>'); 
      li.data('prefix', [prefix, fragment].join('/'));
      return li;
    },

    buildFragmentList: function(prefix, fragments) {
      // Create list 
      var ul = $('<ul class="fragments" />');

      // Fill fragment list
      $.each(fragments,function(i,f){
        var li = Bricker.buildFragmentLi(prefix, f);
        ul.append(li); 
      });
      
      return ul;
    }

  };

  $.fn.bricker = function( prefix ) {  

    // Prepare shit
    var fragments = Bricker.fetchFragments(prefix),
        container = $(this),
          content = null;

    // Empty out
    container.children().remove();

    // Build another list or display documentation
    if (fragments instanceof Array) {

      var ul = Bricker.buildFragmentList(prefix, fragments);
      container.append(ul); 
      container.append($('<div class="bricker"></div>'));

    // Display this endpoint
    } else {
      container.append($('<div>'+fragments+'</div>'));
    }
  }

})(jQuery);


$(document).ready(function(){

  $('#main').bricker('');
  $('ul.fragments li').live('click', function() {
    var element = $(this);
    element.parent().parent().contents('div').bricker(element.data('prefix'));
  });

});



















