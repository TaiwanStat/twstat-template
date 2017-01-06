library(shiny)
library(readr)
library(Rcpp)
library(RColorBrewer)
library(wordcloud)

# Define server logic required to draw a histogram
function(input, output) {

  output$plot1 <- renderPlot({
    data<-read.csv("~/R/DataVision/A3.csv")
    newdata<-t(data)
    rc=brewer.pal(9,"Set1")
    newdata<-newdata[-1,]
    newdata<-newdata[-1,]
    newdata<-as.data.frame(newdata)
    newdata$V2<-as.numeric(as.character(newdata$V2))
    newdata<-na.omit(newdata)
    wordcloud(newdata$V1,newdata$V2,scale=c(5,0.5),mim.freq=input$bins,max.words=Inf,colors=rc,random.order=F,random.color=T)
  })


}
