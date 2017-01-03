# Hello, world!
#
# This is an example function named 'hello'
# which prints 'Hello, world!'.
#
# You can learn more about package authoring with RStudio at:
#
#   http://r-pkgs.had.co.nz/
#
# Some useful keyboard shortcuts for package authoring:
#
#   Build and Reload Package:  'Ctrl + Shift + B'
#   Check Package:             'Ctrl + Shift + E'
#   Test Package:              'Ctrl + Shift + T'
library(readr)
library(Rcpp)
library(RColorBrewer)
library(wordcloud)

hello<- function() {
  data<-read.csv("~/R/DataVision/A3.csv")
  newdata<-t(data)
  rc=brewer.pal(9,"Set1")
  newdata<-newdata[-1,]
  newdata<-newdata[-1,]
  newdata<-as.data.frame(newdata)
  newdata$V2<-as.numeric(as.character(newdata$V2))
  newdata<-na.omit(newdata)
  wordcloud(newdata$V1,newdata$V2,scale=c(5,0.5),mim.freq=1000,max.words=Inf,colors=rc,random.order=F,random.color=T)
}
