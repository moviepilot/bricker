var sys = require('sys');

var lines = ['##'
,'# Creating a new movie node, all request '
,'# params are good, it will succeeed!'
,'# Watch out to not forget foo bar blah'
,''
,'POST /nodes/movies'
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
,'Response: 201 Created'
,''
,'Headers:'
,'  Content-type: application/json'
,''
,'Body:'
,'    { id: "a3efdd48c8329"'
,'    , type: "Movie"  '
,'    , payload: { title: "Matrix"'
,'               , production_year: 1999 }'
,'    }'
,''
];


var exParser = {

  parse: function(lines) {
    this.lines = lines;
    this.i     = 0;
    this.data  = {};

    // varParser.parse(this.lines, this.i, 'RESPONSE');
    return this.parseLine();
  },

  parseLine: function() {
    if(match = this.lines[this.i].match(/^#[ ]*(.*)/)) {
      this.data.description += match[2];
    } else if (match = this.lines[this.i].match(/^([A-Z]{3,6})([:]?[ ]+)(.*)$/)) {
     this.data.method = match[1]; 
     this.data.uri    = match[3];
    } else {
      var vars = varParser.parse(this.lines, this.i, 'Response'); 
      this.i = vars[0]++;
      this.data.foo = vars[1];
    }
    return this.advance();
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
    return this.data;
  }
  
};

var varParser = {
    parse: function(lines, start, stopword) {
      this.lines   = lines;
      this.current = null;
      this.data    = {};
      this.i       = start;
      this.stop    = stopword;
      res = this.parseLine();
      sys.debug("varParser extracted:");
      sys.debug(sys.inspect(res));
      return res;
    },

    parseLine: function() {
      if (this.stop && this.lines[this.i].substr(0, this.stop.length).toLowerCase() == this.stop.toLowerCase()) {
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
        
    
sys.debug(sys.inspect(exParser.parse(lines)));

