var sys = require('sys');

var lines = ['POST /nodes/movies'
,''
,'Params:'
,'  unsafe:   true'
,'  some_tag: 15'
,''
,'Headers:'
,'  Content-type: application/json'
,''
,'Body:'
,''
,'    { title: "Matrix"               # We only store original ones'
,'    , production_year: 1999         # Contains a NUMBA '
,'    }'
,''
,''
,''
,''];



var varParser = {
    parse: function(lines) {
        this.lines = lines;
        this.current = null;
        this.data = {};
        this.i = 0;
        this.parseLine();
    },

    parseLine: function() {
      if( match = this.lines[this.i].match(/^([\w]+)\: *([^ ]?.*)$/) ) {
        this.parseSectionHeader(match);
      } else if( match = this.lines[this.i].match(/^[ ]+([\w]+)\: *([^ ]?.*)$/)  ) {
        this.parseValue(match);
      } else {
      }
      this.advance();
     },

    parseSectionHeader: function(match) {
        this.current = match[1].toLowerCase();
        if(match[1] == 'Response') {
            this.data.response = match[2];
        }
    },

    parseValue: function(match) {
        this.data[this.current] =  this.data[this.current] || {};
        this.data[this.current][match[1]] = match[2]
    },
        
    advance: function(from) {
        this.i++;
        if(this.lines.length > this.i) {
          this.parseLine();
        } else {
          sys.debug("done from "+from+", "+this.i+">="+this.lines.length);
          sys.debug(sys.inspect(this.data));
        }
    }
};
        
    
varParser.parse(lines);

