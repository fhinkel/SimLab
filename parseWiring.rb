#!/usr/bin/ruby

require 'pp'
require 'cgi'
cgi = CGI.new
puts cgi.header
# random filenmae
h = cgi.params 
data = h['d']


a = data.to_s.split(/\n|;/).reject!{ |s| s.empty?}
hh = Hash.new 
a.each{ |l|
  #puts "line: " 
  #puts l
  
  l.sub!(/\[.*\]/, '')
  #puts l
  
  aa = l.split(/->/)
  aa.map!{ |var| 
    var.gsub!(/\"/, '')
    var.strip 
    
  }
  aa.each{ |var| 
    unless (hh.key?var) then
      hh[var] = []
    end
    
  }
  aa.each_cons(2){ |pair|
    source = pair.first
    target = pair.last
    hh[source].push target 
  }
}


#Array.new(hh.keys, hh.values)
pp [hh.keys, hh.values]

#pp hh
#puts hh
  

