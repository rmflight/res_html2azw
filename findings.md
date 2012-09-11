# Calibre

It turns out Calibre can do a pretty decent job of conversion to MOBI format,
and it is scriptable as well. A list of the commands are [here](http://manual.calibre-ebook.com/cli/cli-index.html). 

This doesn't do a great job with the BMC Bioinformatics example, because the 
figures and tables are separate, so we might need a script to first get the 
figures, change the links in the main text, and then run the `ebook-convert`
command on it.

Need to test how we would actually include figures.

Problems: biggest one is going to be equations. If you read heavy equation
papers probably the easiest way to get them is included as images. For example, 
BMC Bioinformatics allows switching between using and not using mathjax.

# P.E.T.

[Murray Meehan](http://murraymeehan.blogspot.com) has an idea for a [PDF to 
Ebook Transmogrifier](http://murraymeehan.blogspot.com/2012/06/pet-pdf-to-ebook-transmogrifier.html) that it sounds like he may be working on. This could be
very interesting.


