#!/usr/bin/ruby

p_value = 2

require 'cgi'
cgi = CGI.new
puts cgi.header
functions = cgi.params['f']

#puts functions 

# random filename
filename = (0...8).map{ ('a'..'z').to_a[rand(26)] }.join
filename = "./tmp/" + filename

File.open("#{filename}.txt", 'w') {|f| f.write(functions) }

#puts "./Analysis/analysis #{p_value} #{filename}"
ret = `./Analysis/analysis #{p_value} #{filename}`
puts ret