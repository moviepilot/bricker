/* Author: 

*/

  var Bricker = {
    fetchFragments: function(prefix, callback) {
      prefix  = prefix=='/' ? '/index' : prefix;
      var url = '../api'+prefix+'.json' 
      console.log(url);
      $.ajax({ url: url
             , data: {}
             , success: function(data, textStatus, jqXHR){
                callback(data); 
               }
             , error: function(jqXHR, textStatus, errorThrown) {
               callback({'endpoint': [textStatus, url].join(' ')});
             }
      });
    }, 

    buildFragmentLi: function (prefix, fragment) {
      var li = $('<li>'+fragment.prefix+'</li>'); 
      li.data('prefix', [prefix, fragment.prefix].join(''));
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
      container.parent().children('.endpoint').remove();

      // Build another list or display documentation
      if(data.fragments instanceof Array) {
        var ul = Bricker.buildFragmentList(prefix, data.fragments);
        container.append(ul); 
        container.append($('<div class="bricker"></div>'));
      }

      // Display this endpoint
      if (data.endpoint) {
        container.append($('<pre class="endpoint">'+data.endpoint+'</pre>'));
      }
    },

    handleFragmentClick: function() {
      var element = $(this);
      var parent  = element.parent().parent();
      element.parent().children().removeClass('active');
      element.addClass('active');
      parent.contents('div').bricker(element.data('prefix'));
                         
    }
  };


(function( $ ){
  $.fn.bricker = function( prefix ) {  
    var container = $(this);
    Bricker.fetchFragments(prefix, function(f) {
      Bricker.displayFragments(container, prefix, f); 
    } );
  }

})(jQuery);


$(document).ready(function(){

  $('#main').bricker('/');
  $('ul.fragments li').live('click', Bricker.handleFragmentClick);

});



















