
var Bricker = {

  fetchFragments: function(prefix, callback) {
    prefix  = prefix == '' ? '/index' : prefix;
    var url = '../api'+prefix+'.json?'+Math.random(); 
    $.ajax({ url: url
           , data: {}
           , success: function(data, textStatus, jqXHR){
              callback(data); 
             }
           , error: function(jqXHR, textStatus, errorThrown) {}
    });
  }, 

  fetchEndpoints: function(prefix, callback) {
    var url = '../api'+prefix+'/endpoints.txt'; 
    $.ajax({ url: url
           , data: {}
           , success: function(data, textStatus, jqXHR){
              callback(data); 
             }
           , error: function(jqXHR, textStatus, errorThrown) {}
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

  buildEndpoint: function(prefix, data) {
   var container = $('<div class="endpoint"/>');
   container.append($('<h1>'+prefix+'</h1>'));
   container.append ($('<pre>'+data+'</pre>')); 

   return container;
  },

  displayFragments: function(container, prefix, data) {
    // Empty out
    container.children().remove();

    // Build another list or display documentation
    if(data && data.fragments instanceof Array) {
      var ul = Bricker.buildFragmentList(prefix, data.fragments);
      container.append(ul); 
      container.append($('<div class="bricker"></div>'));
    }
  },

  displayEndpoints: function(container, prefix, endpoints) {
   var endpoint = Bricker.buildEndpoint(prefix, endpoints);
   container.parent().children('.endpoint').remove();
   container.append(endpoint);
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
      Bricker.fetchEndpoints(prefix, function(e) {
        Bricker.displayEndpoints(container, prefix, e);
      });
    });
  }

})(jQuery);


$(document).ready(function(){
  $('#main').bricker('');
  $('ul.fragments li').live('click', Bricker.handleFragmentClick);
});
