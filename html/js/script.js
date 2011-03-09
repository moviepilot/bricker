
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
    var url = '../api'+prefix+'/endpoints.txt?'+Math.random(); 
    $.ajax({ url: url
           , data: {}
           , success: function(data, textStatus, jqXHR){
              callback(Bricker.parseEndpoints(data)); 
             }
           , error: function(jqXHR, textStatus, errorThrown) {}
    });
  }, 

  parseEndpoints: function(data) {
    var endpoints = data.split("---\n")
    return endpoints;
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

  buildEndpoints: function(prefix, endpoints) {
   var containers = [];
   $.each(endpoints, function(i, text) {
     var endpoint = Bricker.parseEndpoint(text);
     var container = $('<div class="endpoint"/>');
     container.append($('<h1>'+endpoint.method+' '+prefix+'</h1>'));
     container.append ($('<pre>'+endpoint.example+'</pre>')); 
     containers.push(container);
   });
   return containers;
  },

  parseEndpoint: function(text) {
    var endpoint = {};                
    var lines = text.split("\n");
    
    endpoint.method = lines.splice(0,1);
    endpoint.example = lines.join('\n');


    return endpoint;
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
    var endpoints = Bricker.buildEndpoints(prefix, endpoints);
    container.parent().children('.endpoint').remove();
    $.each(endpoints, function(i,e){container.append(e)});
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
