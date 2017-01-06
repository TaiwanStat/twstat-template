library(shiny)
library(readr)
library(Rcpp)
library(RColorBrewer)
library(wordcloud)

# Define UI for application that draws a histogram
fluidPage(

  # Application title
  titlePanel("臺南市104年交通事故肇事原因"),

  # Sidebar with a slider input for the number of bins
  sidebarLayout(
    sidebarPanel(
      sliderInput("bins",
                  "最低頻率:",
                  min = 0,
                  max = 500,
                  value = 300)
    ),

    # Show a plot of the generated distribution
    mainPanel(
      plotOutput("plot1")
    )
  )
)
