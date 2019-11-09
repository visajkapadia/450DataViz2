var additionalData;
var minTime, maxTime, minSuccess, maxSuccess;
// TODO: get below values dynamically svg height and width
var svgWidth =  700;
var svgHeight = 600;

//  TODO: Fix the legends
//  TODO: add all participant data in the details section


d3.csv("../data/additional_data.csv").then(function(data){
    data.forEach(function(d) {
        d.id = d.id;
        d.viz = +d.viz;
        d.domain = +d.domain;
        d.success = +d.success;
        d.time = +d.time;
    });
    additionalData = data;
    setScales(additionalData);
    plotData(additionalData);
    // addLegends();
    generateStatistics();
});

function setScales(data) {

    const timeValue = d => d.time;
    const successValue = d => d.success;

    maxTime = d3.max(data, timeValue);
    minTime = d3.min(data, timeValue);

    maxSuccess = d3.max(data, successValue);
    minSuccess = d3.min(data, successValue);

    xScale = d3.scaleLinear()
        .domain([0, maxTime])
        .range([20, svgWidth - 50])
        .nice();

    yScale = d3.scaleLinear()
        .domain([0, maxSuccess])
        .range([20, svgHeight - 50])
        .nice();

    x_axis = d3.axisBottom()
        .scale(xScale);

    y_axis = d3.axisLeft()
        .scale(yScale);

}

function plotData(d) {

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltipDiv")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("");

    var svg = d3.select("#mySvg");

    svg.append("text")
        .attr("x", 150)
        .attr("y", 470)
        .attr("opacity", 0.06)
        .attr("font-family", "sans-serif")
        .attr("font-size", 150)
        .html("PASS");

    svg.append("text")
        .attr("x", 180)
        .attr("y", 210)
        .attr("opacity", 0.06)
        .attr("font-family", "sans-serif")
        .attr("font-size", 150)
        .html("FAIL");

    svg.selectAll(".dot")
        .data(d)
        .enter()
        .append(function(d) {
            var type = d.viz == 1 ? "circle" : "rect";
            return document.createElementNS("http://www.w3.org/2000/svg", type);
        });

    svg.selectAll("circle")
        .attr("cx", d => xScale(d.time))
        .attr("cy", d => yScale(d.success))
        .attr("r", 5)
        .attr("fill", function(d){
            if(d.domain == 1){
                return "#2196f3";
            }
            else {
                return "#d81b60";
            }
        })
        .attr("participant", d => d.id)
        .attr("fill-opacity", 0.8)
        .attr("class", function(d){
            var domain = d.domain == 1 ?  "general" : "expert";
            return "tree" + " " + domain;
        })
        .on('mouseover', function(d, i) {
            msg = "<b>Participant: </b>" + d.id + "<br>" +
                  "<b>Success Rate: </b>" + d.success;
            tooltip.html(msg);
            tooltip.style("visibility", "visible");

            d3.select(this)
                .attr("stroke-width", "3px")
                .attr("stroke", "#3F1414");

            var currentParticipant = d3.select(this).attr("participant");
            d3.select("rect[participant='"+currentParticipant+"']")
                .attr("stroke-width", "3px")
                .attr("stroke", "#3F1414");

            d3.select('#details').html(msg);
        })
        .on("mousemove", function(d, i) {
            return tooltip.style("top",
                (d3.event.pageY-10)+"px")
                .style("left",(d3.event.pageX+10)+"px");
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .attr("stroke-width", "0px");

            var currentParticipant = d3.select(this).attr("participant");
            d3.select("rect[participant='"+currentParticipant+"']")
                .attr("stroke-width", "0px");

            tooltip.style("visibility", "hidden");
            d3.select('#details').html('');
        });

    svg.selectAll("rect")
        .attr("x", d => xScale(d.time))
        .attr("y", d => yScale(d.success))
        .attr("width", 10)
        .attr("height", 10)
        .attr("participant", d => d.id)
        .attr("fill", function(d){
            if(d.domain == 1){
                return "#2196f3";
            }
            else {
                return "#d81b60";
            }
        })
        .attr("fill-opacity", 0.8)
        .attr("class", function(d){
            var domain = d.domain == 1 ?  "general" : "expert";
            return "graph" + " " + domain;
        })
        .on('mouseover', function(d, i) {

            d3.select(this)
                .attr("stroke-width", "3px")
                .attr("stroke", "#3F1414");

            var currentParticipant = d3.select(this).attr("participant");
            d3.select("circle[participant='"+currentParticipant+"']")
                .attr("stroke-width", "3px")
                .attr("stroke", "#3F1414");

            msg = "<b>Participant: </b>" + d.id + "<br>" +
                "<b>Success Rate: </b>" + d.success;
            tooltip.html(msg);
            tooltip.style("visibility", "visible");
            d3.select('#details').html(msg);
        })
        .on("mousemove", function(d, i) {
            return tooltip.style("top",
                (d3.event.pageY-10)+"px")
                .style("left",(d3.event.pageX+10)+"px");
        })
        .on('mouseout', function(d, i){
            d3.select(this)
                .attr("stroke-width", "0px");
            var currentParticipant = d3.select(this).attr("participant");
            d3.select("circle[participant='"+currentParticipant+"']")
                .attr("stroke-width", "0px");

            tooltip.style("visibility", "hidden");
            d3.select('#details').html('');
        });

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


}

// TODO: Smooth transition when data is hidden
function filterByViz() {
        // For each check box:
    var svg = d3.select("#mySvg");

        d3.selectAll(".vizCheckbox").each(function(d){
            cb = d3.select(this);
            grp = cb.property("value");

            if(cb.property("checked")){
                svg.selectAll("."+grp).transition().duration(500).style("opacity", 1).attr("r", 5).attr('visibility', 'visible');
            }else{
                svg.selectAll("."+grp).transition().duration(500).style("opacity", 0).attr("r", 0).attr('visibility', 'hidden');
            }
        });
        generateStatistics();
}

function filterByDomain() {

    var svg = d3.select("#mySvg");

    d3.selectAll(".domainCheckbox").each(function(d){
        cb = d3.select(this);
        grp = cb.property("value");

        if(cb.property("checked")){
            svg.selectAll("."+grp).transition().duration(500).style("opacity", 1).attr("r", 5).attr('visibility', 'visible');
        }else{
            svg.selectAll("."+grp).transition().duration(500).style("opacity", 0).attr("r", 0).attr('visibility', 'hidden');
        }
    });
}

function addLegends() {
    var legendWidth = 100;
    var legendHeight = 100;
    var legendRectangleSize = 100;

    var svg = d3.select("#mySvg");
    svg.append("g")
        .attr("class", "legend");
    var legend = d3.select(".legend");

    legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text('Graph');
}

// generate matrix for total number of tree, graph, general, specific domain
function generateStatistics() {
    d3.select("#graphPointCount").html(d3.selectAll("rect[visibility=visible]").size());
    d3.select("#treePointCount").html(d3.selectAll("circle[visibility=visible]").size());
}
