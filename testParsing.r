# after downloading a paper, we need to parse the html, find the figures, and insert them
# directly into the body of the html.

require(XML)

# this function replaces the figures for bioinformatics journal
replaceFigure <- function(inDiv, baseURL){
  tmpRef <- as.character(xpathApply(inDiv, path='a/@href')[[1]])
  figDoc <- htmlParse(file=paste(baseURL, tmpRef, sep="/", collapse="/"))
  figfigDivs <- getNodeSet(figDoc, path='//*[@class="fig-expansion"]')
  tmp2 <- figfigDivs[[1]]
  fullFig <- as.character(xpathApply(tmp2, path='a/@href')[[1]])
  
  downLoadLoc <- dirname(tmpRef)
  figDownLoad <- paste(baseURL, downLoadLoc, fullFig, sep="/", collapse="/")
  
  
  dir.create(writeDir)
  fullFile <- file.path(writeDir, fullFig)
  download.file(url=figDownLoad, destfile=fullFile, mode="wb")
  
  chNodes <- xpathApply(inDiv, "*")
  invisible(removeChildren(inDiv, kids=chNodes))
  fig <- newXMLNode("img", attrs=c("src"=fullFile, "width"=800))
  invisible(addChildren(inDiv, kids=list(fig)))
}

replaceTable <- function(inDiv, baseURL){
  tmpRef <- as.character(xpathApply(inDiv, path='div/ul/li/a/@href')[[1]])
  tableDoc <- htmlParse(file=paste(baseURL, tmpRef, sep="/", collapse="/"))
  tableDivs <- getNodeSet(tableDoc, path='//*[@class="table-expansion"]/table')
  
  chNodes <- xpathApply(inDiv, "*")
  invisible(removeChildren(inDiv, kids=chNodes))
  invisible(addChildren(inDiv, kids=tableDivs))
}

replaceFormulas <- function(inDiv, baseURL){
	tmpRef <- as.character()
}

