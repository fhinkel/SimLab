#!/usr/bin/ruby

require 'cgi'
cgi = CGI.new
puts cgi.header

h = cgi.params 
n = h['n'].to_s.scan(/\d/).to_s


t = h['tt']
# Do something with this table!

puts "f#{n} = x1 * x#{n}"