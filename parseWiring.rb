#!/usr/bin/ruby

require 'pp'
require 'cgi'
cgi = CGI.new
puts cgi.header
# random filenmae
h = cgi.params 
data = h['d']

puts "<pre>"
a = data.to_s.split(/\n|;/).reject!{ |s| s.empty?}
hh = Hash.new 
a.each{ |l| 
  aa = l.split(/->/)
  aa.map!{ |var| var.strip }
  aa.each{ |var| 
    unless (hh.key?var) then
      hh[var] = []
    end
    
  }
  puts aa
  aa.each_cons(2){ |pair|
    pp pair
    source = pair.first
    target = pair.last
    hh[source].push target 
  }
}


pp hh
  
puts "<\pre>"
  

