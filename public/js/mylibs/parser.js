var sys = require('sys');

var lines = ['POST /nodes/movies'
,''
,'Params:'
,'  unsafe:   true'
,'  some_tag: 18'
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
,'RESPONSE:'
,'Body:'
,''
,'    { title: "NONONONONONO"               # We only store original ones'
,'    , production_year: 1999         # Contains a NUMBA '
,''
,''];



var varParser = {
    parse: function(lines, stop) {
      this.lines   = lines;
      this.current = null;
      this.data    = {};
      this.i       = 0;
      this.stop    = stop;
      return this.parseLine();
    },

    parseLine: function() {
      if (this.stop && this.lines[this.i].substr(0, this.stop.length) == this.stop) {
        return this.result();  
      } else if( match = this.lines[this.i].match(/^([\w]+)\: *([^ ]?.*)$/) ) {
        this.parseSectionHeader(match);
      } else if( match = this.lines[this.i].match(/^[ ]+([\w]+)\: *([^ ]?.*)$/)  ) {
        this.parseValue(match);
      } 
      return this.advance();
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
        
    advance: function() {
        this.i++;
        if(this.lines.length > this.i) {
          return this.parseLine();
        } else {
          return this.result();
        }
    },

    result: function() {
      return [this.i, this.data];
    }

};
        
    
sys.debug(sys.inspect(varParser.parse(lines, 'RESPONSE')));

