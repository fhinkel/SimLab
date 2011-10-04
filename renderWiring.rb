#!/usr/bin/ruby

require 'cgi'
cgi = CGI.new
puts cgi.header
# random filenmae
filename = (0...8).map{ ('a'..'z').to_a[rand(26)] }.join
filename = "./tmp/" + filename

h = cgi.params 
data = h['d']
data = "digraph SimLab {\n#{data}\n }"

File.open("#{filename}.dot", 'w') {|f| f.write(data) }
#puts "dot -Tjpg -o #{filename}.jpg" #{filename}.dot"
`dot -Tgif -o #{filename}.gif #{filename}.dot`
puts "#{filename}.gif"
#exit 1


#filename = filename + ".dot"
#h = cgi.params  # =>  {"FirstName"=>["Zara"],"LastName"=>["Ali"]}
#puts h
#return h

#{}``
#puts h['d']  # =>  ["Zara"]
#puts h['LastName']   # =>  ["Ali"]