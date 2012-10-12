
# work with the bioinformatics example
urlTest <- "http://bioinformatics.oxfordjournals.org/content/28/18/i311.long"
dir.create("fullTest")
setwd("fullTest")

download.file(urlTest, "test1.html")

hDoc <- htmlParse(file="test1.html")

writeDir <- "extraFiles"
baseURL <- dirname(urlTest)
figDivs <- xpathApply(hDoc, path='//*[@class="fig-inline"]', replaceFigure, baseURL)

tableDivs <- xpathApply(hDoc, path='//*[@class="table-inline"]', replaceTable, baseURL)

saveXML(hDoc, file="test1.html")

zip("test1.zip", c("test1.html", "extraFiles"))

system("calibre ")