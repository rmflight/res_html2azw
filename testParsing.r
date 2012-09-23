# after downloading a paper, we need to parse the html, find the figures, and insert them
# directly into the body of the html.

require(XML)

# work with the bioinformatics example
hDoc <- htmlParse(file="testHTML/bioinformaticsTest.htm")

figDivs <- getNodeSet(hDoc, path='//*[@class="fig-inline"]')

# now for each figure Div, parse the linked page

tmpDat <- figDivs[[1]]

tmpRef <- as.character(xpathApply(tmpDat, path='a/@href')[[1]])

figDoc <- htmlParse(file=tmpRef)
figfigDivs <- getNodeSet(figDoc, path='//*[@class="fig-expansion"]')
tmp2 <- figfigDivs[[1]]
fullFig <- as.character(xpathApply(tmp2, path='a/@href')[[1]])

downLoadLoc <- dirname(tmpRef)
figDownLoad <- file.path(downLoadLoc, fullFig)

writeDir <- "extraFiles"
dir.create(writeDir)
fullFile <- file.path(writeDir, fullFig)
download.file(url=figDownLoad, destfile=fullFile)

chNodes <- xpathApply(tmpDat, "*")
removeChildren(tmpDat, kids=chNodes)
fig <- newXMLNode("img", attrs=c("source"=fullFile, "width"=800))
addChildren(tmpDat, kids=list(fig))