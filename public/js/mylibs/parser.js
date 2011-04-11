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
,'Params:'
,'  unsafe:   true'
,'  some_tag: 15'
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
    this.data  = { request: {}, response: {}, description: ''};
    this.current = null;

    return this.parseLine();
  },

  parseLine: function() {
    if(match = this.lines[this.i].match(/^##?[ ]*(.*)/)) {
      this.data.description += match[1]+"\n";
    } else if (match = this.lines[this.i].match(/^([A-Z]{3,6})([:]?[ ]+)(.*)$/)) {
      this.parseMethod(match);
    } else if (match = this.lines[this.i].match(/^Response:[ ]?(.*)$/)) {
      this.switchMode(match);
    } else if (this.current) {
      this.parseVars();
    }
    return this.advance();
  },

  parseMethod: function(match){
    this.data.method = match[1]; 
    this.data.uri    = match[3];
    this.current = "request";
  },

  switchMode: function(match){
    this.current = "response";
    this.data['response_code'] = match[1];
    this.i++;
  },

  parseVars: function() {
    var stop = this.current == 'request' ? 'Response' : null;
    var vars = varParser.parse(this.lines, this.i, stop); 
    this.i = vars[0]++;
    this.data[this.current] = vars[1];
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
      ret = this.parseLine();
      return ret;
    },

    parseLine: function() {
      if (this.stop && this.lines[this.i].substr(0, this.stop.length).toLowerCase() == this.stop.toLowerCase()) {
        return [this.i-1, this.data];
      } else if( match = this.lines[this.i].match(/^([\w]+)\: *(.*)$/) ) {
        this.parseSectionHeader(match);
      } else if(match = this.lines[this.i].match(/^    (.*)$/)) { 
        this.parseSample(match);
      } else if( match = this.lines[this.i].match(/^[ ]+([\w-]+)\: *([^ ]?.*)$/)  ) {
        this.parseValue(match);
      } else {
      }
      return this.advance();
     },

    parseSectionHeader: function(match) {
        this.current = match[1].toLowerCase();
    },

    parseValue: function(match) {
      this.data[this.current] =  this.data[this.current] || {};
      this.data[this.current][match[1]] = match[2]
    },

    parseSample: function(match){
      this.data[this.current] = this.data[this.current] || "";
      this.data[this.current] += match[1] + "\n";
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
        
    
sys.log(sys.inspect(exParser.parse(lines)));

