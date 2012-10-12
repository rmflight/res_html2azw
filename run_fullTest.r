
# work with the bioinformatics example
urlTest <- "http://bioinformatics.oxfordjournals.org/content/28/20/2584.full"
dir.create("fullTest2")
setwd("fullTest2")

download.file(urlTest, "test2.html")

hDoc <- htmlParse(file="test2.html")

writeDir <- "extraFiles"
baseURL <- dirname(urlTest)
figDivs <- xpathApply(hDoc, path='//*[@class="fig-inline"]', replaceFigure, baseURL)

tableDivs <- xpathApply(hDoc, path='//*[@class="table-inline"]', replaceTable, baseURL)

graphicDivs <- xpathApply(hDoc, path='//*[@class="inline-graphic"]')

changeGraphic <- function(inDiv, baseURL){
	nodeAtts <- xmlAttrs(inDiv)
	fileSave <- paste(writeDir, basename(nodeAtts["src"], sep="/", collapse="/")
}

saveXML(hDoc, file="test2.html")

#zip("test1.zip", c("test2.html", "extraFiles"))

system("ebook-convert test2.html test2.mobi")