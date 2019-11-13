var minTime, maxTime, minSuccess, maxSuccess;
var tempData;
// TODO: get below values dynamically svg height and width
var svgWidth =  700;
var svgHeight = 600;
d3.csv("../data/excelData.csv").then(function(data) {
    data.forEach(function(d) {
        d.ID = d.ID;
        d.Ontologies = +d.Ontologies;
        d.Visualization = +d.Visualization;
        d.Task_Success = +d.Task_Success;
        d.Time_On_Task = +d.Time_On_Task;
    });
    tempData = data;
    setScales(tempData);
    // plotPoints(tempData);
});
//function plotPoints(data) {
//}
function setScales(data) {
    maxSuccess = d3.max(data,function(d) { return d.Task_Success; });
    minSuccess = d3.min(data,function(d) { return d.Task_Success; });
    maxTime = d3.max(data,function(d) { return d.Time_On_Task;});
    //Create SVG file for it
    var svg = d3.select("body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    //Create scale
    xScale = d3.scaleLinear()
        .domain([0, maxTime])
        .range([20, svgWidth - 50])
        .nice();
    yScale = d3.scaleLinear()
        .domain([1, 0])
        .range([20, svgHeight - 50])
        .nice();
    x_axis = d3.axisBottom()
        .scale(xScale);
    y_axis = d3.axisLeft()
        .scale(yScale);
    svg.append("g")
        .attr("transform", "translate(23, 0)")
        .call(y_axis);
    svg.append("g")
        .attr("transform", "translate(0, "+(560)+")")
        .call(x_axis);
    svg.append("line")          // attach a line
        .style("stroke", "black")  // colour the line
        .attr("x1", 20)     // x position of the first end of the line
        .attr("y1", 315)      // y position of the first end of the line
        .attr("x2", svgWidth - 50)     // x position of the second end of the line
        .attr("y2", 315);
//---------------------------------------------------
//Words pass or fail
    svg.append("text")
        .attr("x", 150)
        .attr("y", 470)
        .attr("opacity", 0.06)
        .attr("font-family", "sans-serif")
        .attr("font-size", 150)
        .html("FAIL");
    svg.append("text")
        .attr("x", 150)
        .attr("y", 210)
        .attr("opacity", 0.06)
        .attr("font-family", "sans-serif")
        .attr("font-size", 150)
        .html("PASS");
    var rightBoxes = d3.select("body").append("svg")
        .attr("x", 700)
        .attr("y", 0)
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    //////////////////////////////
    //For the Tree Pass
    //////////////////////////////
    rightBoxes.append("rect")
        .attr("x", 10)
        .attr("y", 5)
        .attr("width", 200)
        .attr("height", 150)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "6");
    rightBoxes.append("text")
        .attr("x", 30)
        .attr("y", 30)
        .attr("font-family", "sans-serif")
        .attr("font-size", 30)
        .style("fill", "green")
        .html("Tree Pass");
    //////////////////////////////
    //For the Graph Pass
    //////////////////////////////
    rightBoxes.append("rect")
        .attr("x", 12)
        .attr("y", 200)
        .attr("width", 200)
        .attr("height", 150)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "6");
    rightBoxes.append("text")
        .text("Graph Pass")
        .attr("x", 25)
        .attr("y", 230)
        .attr("font-family", "sans-serif")
        .attr("font-size", 30)
        .style("fill", "blue")
}
function changeOnto()
{
    var svgButton = d3.select("body").select("#myButton")
    if(svgButton.text() == "General")
    {
        svgButton.text("Expert");
    }
    else
    {
        svgButton.text("General");
    }
}