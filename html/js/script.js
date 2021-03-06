
var Bricker = {

  fetchFragments: function(prefix, callback) {
    prefix  = prefix == '' ? '/index' : prefix;
    var url = '../api'+prefix+'.json?'+Math.random(); 
    $.ajax({ url: url
           , data: {}
           , success: function(data, textStatus, jqXHR){
              callback(data); 
             }
           , error: function(jqXHR, textStatus, errorThrown) {
              callback(null); 
           }
    });
  }, 

  fetchEndpoints: function(prefix, callback) {
    var url = '../api'+prefix+'/endpoints.txt?'+Math.random(); 
    $.ajax({ url: url
           , data: {}
           , success: function(data, textStatus, jqXHR){
              callback(Bricker.parseEndpoints(data)); 
             }
           , error: function(jqXHR, textStatus, errorThrown) {
              callback([]);       
           }
    });
  }, 

  prefixToId: function(prefix) {
    return prefix.replace("/", "-");
  },

  parseEndpoints: function(data) {
    if(!data) return;
    var endpoints = data.split("---\n")
    return endpoints;
  },
  
  buildFragmentLi: function (prefix, fragment) {
    var id = Bricker.prefixToId(prefix); 
    var li = $('<li id="'+id+'">'+fragment.prefix+'</li>');
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
     var id = "<span class='highlight'>"+(i+1)+"</span>";
     var url = prefix.replace(/_id_$/, id).replace(/_id_/g, 123);
     var endpoint = Endpoint.parse(text);
     var container = $('<div class="endpoint"/>');
     container.append($('<h1><span class="highlight">'+endpoint.method+'</span> '+url+'</h1>'));
     container.append (endpoint.example); 
     containers.push(container);
   });
   return containers;
  },

  parseEndpoint: function(text) {
    var endpoint = {};                
    var lines = text.split("\n");
    endpoint.method = lines.splice(0,1);
    endpoint.example = lines.join("\n");
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
    var checked = $('#stack-cards');
    if (!checked || checked.attr('checked')) {
      container.parent().children('.endpoint').remove();
    }
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

var Endpoint = {

  emphasizeRegExp: /[^\w^"]*([\w"]+)[ ]*:[ ]+/g,

  parse: function(text) {
    var self = this,
        endpoint    = {},            
        lines       = [],
        annotations = []
        input       = text.split("\n");
    var method = input.splice(0,1);

    $.each(input, function(index, line){
      var parts = self.parseLine(line);
      lines.push(parts[0]);
      annotations.push(parts[1]);
    });

    var res = { method:  method,
                example: self.toHtml(lines, annotations)};
    return res;
  },

  parseLine: function(line) {
    var components = line.split("#");
    components[0] = components[0].replace(this.emphasizeRegExp, this.emphasize)
                                 .replace(/ /g, "&nbsp;");
    return components;    
  },

  emphasize: function(match, first) {
    return match.replace(first, "<em>"+first+"</em>" );
  },

  toHtml: function(lines, annotations) {
    var container = $("<table class='example'/>");
    $.each(lines, function(i, l) {
      container.append($("<tr><th>"+l+"</th><td>"+(annotations[i]||'')+"</td>")); 
    });
    console.log(container);
    return container;
  }

};

$(document).ready(function(){
  $('#main').bricker('');
  $('ul.fragments li').live('click', Bricker.handleFragmentClick);
});
