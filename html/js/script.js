/* Author: 

*/

(function( $ ){

  var Bricker = {
    fetchFragments: function(prefix, callback) {
      var url = '../api/'+(prefix||'index')+'.json' 
      console.log(url);
      $.ajax({ url: url
             , dataType: 'json'
             , data: {}
             , success: function(data, textStatus, jqXHR){
                callback(data); 
               }
             , error: function(jqXHR, textStatus, errorThrown) {
               console.log("ERRORS");
               console.log(errorThrown);
             }
      });

      // if (prefix == '') return callback(['container', 'content/_id_', 'transition']);
      // if (prefix == '/content/_id_') return callback(['eins', 'zwo']);
      // if (prefix == '/content/_id_/zwo') return callback(['foo']);
      // callback( { foo: 1} ); 
    }, 

    buildFragmentLi: function (prefix, fragment) {
      var li = $('<li>'+fragment.prefix+'</li>'); 
      li.data('prefix', [prefix, fragment.prefix].join('/'));
      return li;
    },

    buildFragmentList: function(prefix, fragments) {
      var ul = $('<ul class="fragments" />');
      $.each(fragments,function(i,f){
        var li = Bricker.buildFragmentLi(prefix, f);
        ul.append(li); 
      });
      return ul;
    },

    displayFragments: function(container, prefix, data) {

      // Empty out
      container.children().remove();

      // Build another list or display documentation
      if (data.fragments instanceof Array) {

        var ul = Bricker.buildFragmentList(prefix, data.fragments);
        container.append(ul); 
        container.append($('<div class="bricker"></div>'));

      // Display this endpoint
      } else {
        container.append($('<div>endpoint</div>'));
      }
    }

  };

  $.fn.bricker = function( prefix ) {  
    var container = $(this);
    Bricker.fetchFragments(prefix, function(f) {
      Bricker.displayFragments(container, prefix, f); 
    } );
  }

})(jQuery);


$(document).ready(function(){

  $('#main').bricker('');
  $('ul.fragments li').live('click', function() {
    var element = $(this);
    element.parent().parent().contents('div').bricker(element.data('prefix'));
  });

});



















