# after downloading a paper, we need to parse the html, find the figures, and insert them
# directly into the body of the html.

require(XML)

# this function replaces the figures for bioinformatics journal
replaceFigure <- function(inDiv){
  tmpRef <- as.character(xpathApply(inDiv, path='a/@href')[[1]])
  figDoc <- htmlParse(file=tmpRef)
  figfigDivs <- getNodeSet(figDoc, path='//*[@class="fig-expansion"]')
  tmp2 <- figfigDivs[[1]]
  fullFig <- as.character(xpathApply(tmp2, path='a/@href')[[1]])
  
  downLoadLoc <- dirname(tmpRef)
  figDownLoad <- file.path(downLoadLoc, fullFig)
  
  
  dir.create(writeDir)
  fullFile <- file.path(writeDir, fullFig)
  download.file(url=figDownLoad, destfile=fullFile, mode="wb")
  
  chNodes <- xpathApply(inDiv, "*")
  invisible(removeChildren(inDiv, kids=chNodes))
  fig <- newXMLNode("img", attrs=c("src"=fullFile, "width"=800))
  invisible(addChildren(inDiv, kids=list(fig)))
}


# work with the bioinformatics example
hDoc <- htmlParse(file="testHTML/bioinformaticsTest.htm")
writeDir <- "extraFiles"

figDivs <- xpathApply(hDoc, path='//*[@class="fig-inline"]', replaceFigure)

saveXML(hDoc, file="test2.html")

