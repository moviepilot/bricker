var code = $("#example").html()
var template = $("#template").html()
    
var view = {
    request: { params: [ {"key": "foo", "value": "bar"},
                          {"key": "bar", "value": "false"} ] },
    response: { body: "{title: 'Matrix'}"}
};

var REP = {

    
}
    
var varParser = {
    parse: function(lines) {
        self.lines = lines;
        self.current = null;
        self.data = {};
        self.i = 0;
        self.parseLine();
    },

    parseLine: function() {
        if( p = self.lines[self.i].match(/^([\w]+)\: *([^ ]?.*)$/) ) {
            self.parseSectionHeader(p);
            self.parseLine(lines, i++);
        } elseif( self.lines[self.i].match(/^[ ]+([\w]+)\: *([^ ]?.*)$/)  ) {
            self.data[current][match[1]] = match[2]
        }
    },

    parseSectionHeader: function(match) {
        self.current = match[1].toLowerCase();
        if(match[1] == 'Response') {
            self.data.response = match[2];
        }
    },
        
    advance: function() {
        self.i++;
        if(self.lines.length > self.i) {
            self.parseLine;
        }
    }
};
        
    
   
var html = Mustache.to_html(template, view);
$("#fancy").append(html);


