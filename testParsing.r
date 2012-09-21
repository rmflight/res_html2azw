# after downloading a paper, we need to parse the html, find the figures, and insert them
# directly into the body of the html.

require(XML)

# work with the bioinformatics example
hDoc <- htmlParse(file="testHTML/bioinformaticsTest.htm")

figDivs <- getNodeSet(hDoc, path='//*[@class="fig-inline"]')

# now for each figure Div, parse the linked page

tmpDat <- figDivs[[1]]

tmpRef <- xpathApply(tmpDat, path='a/@href')