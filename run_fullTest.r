
# work with the bioinformatics example
urlTest <- "http://www.biomedcentral.com/1471-2105/13/79"
useDir <- "bmcTest"
htmlFile <- paste(useDir, ".html", sep="", collapse="")
dir.create(useDir)
setwd(useDir)

download.file(urlTest, htmlFile)

hDoc <- htmlParse(file=htmlFile)

writeDir <- "extraFiles"
baseURL <- dirname(urlTest)
figDivs <- xpathApply(hDoc, path='//*[@class="fig-inline"]', replaceFigure, baseURL)

tableDivs <- xpathApply(hDoc, path='//*[@class="table-inline"]', replaceTable, baseURL)



graphicDivs <- xpathApply(hDoc, path='//*[@class="inline-graphic"]', changeGraphic, baseURL)
graphicDivs2 <- xpathApply(hDoc, path='//*[@class="graphic"]', changeGraphic, baseURL)



saveXML(hDoc, file="test2.html")

#zip("test1.zip", c("test2.html", "extraFiles"))

system("ebook-convert test2.html test2.mobi")