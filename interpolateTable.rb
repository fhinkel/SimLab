#!/usr/bin/ruby

require 'cgi'
require 'pp'
cgi = CGI.new
puts cgi.header


h = cgi.params

t = h['t']




# given a transition table, calculate the function that interpolates this table
# if the table is not of full size, assume 0 for the missing inputs
#   A(t) 	B(t) 	C(t+1)
#   0	   0	   0 
#   0	   1	   0 
#   1	   0	   0 
#   1	   1	   1
# generates f_C = A*B
# the (t)'s are not necessary, just to clarify, that the last column is the output variable
#puts "<pre>"

p = 2
s = t.to_s.split(/\n/)
varNames = s.shift    #get the first line
numLines = s.size
#puts "number of lines #{s.size}<br>"
#puts "names: #{varNames} <br>"

inputNames = varNames.split(/\s+/)
outputName = inputNames.pop
n = inputNames.size

if (numLines > p ** n )
  puts "Error. Number of rows in the table should be at most p^n."
  exit 1
end

# keys of the hash are the integers corresonding to the p-ary string
# values are the output value as determined by transition table
outputs = Hash.new

# use a default value of 0, this should also put the keys in order
(p**n).times {|i|
  outputs[i] = 0
}
 
s.each{ |line|
    #puts "this is one line #{line} <br>"
    inputs = line.split(/\s+/)
    output = inputs.pop
    if (inputs.size != n ) 
      puts "Error. Number of inputs should be n."
      exit 1
    end
    nn = inputs.to_s.to_i(p)
    #puts "outputs[#{nn}] = #{output}<br>"
    outputs[nn] = output
}

#pp outputs
#pp outputs.sort

# prepare strings to run M2

LL = inputNames.collect{ |var| 
  var.gsub!(/\(.*\)/, "")
  "\"#{var}\", " 
}.to_s
LL.chop!  #cut off last blank
LL.chop!  #cut off last comma

vals = outputs.sort.collect{ |pairs|  "\"#{pairs.last}\", " }.to_s
#puts vals
vals.chop!  #cut off last blank
vals.chop!

#interpolate (List, ZZ, List) := (L, p, vals) 
#puts "/usr/local/bin/M2 indicatorFunc.m2 --stop --no-debug --silent -q -e 'interpolate( {#{LL} }, #{p}, {#{vals}} ); exit 0'<br>"
m2_result = `/usr/local/bin/M2 indicatorFunc.m2 --stop --no-debug --silent -q -e 'interpolate( {#{LL} }, #{p}, {#{vals}} ); exit 0'`

#puts "The following function interpolates the transition table: <br>"
puts "f_#{outputName.gsub(/\(.*\)/, "")} = #{m2_result}"
#puts "</pre>"

exit 0
