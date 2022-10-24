//Map dimensions (in pixels)
var width = window.innerWidth,
    height = window.innerHeight;

//Map projection
var projection = d3.geo.mercator()
    // .scale(1926.150530455163)
    .scale(2000)
    .center([69.356282245, 30.623220608220056]) //projection center
    .translate([width / 4, height / 2 - 80]) //translate to center the map in view

var projection2 = d3.geo.mercator()
    // .scale(1926.150530455163)
    .scale(2000)
    .center([69.356282245, 30.623220608220056]) //projection center
    .translate([width / 4 * 3, height / 2 - 80]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Generate paths based on projection
var path2 = d3.geo.path()
    .projection(projection2);

//Create an SVG
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class", "features");

var features2 = svg2.append("g")
    .attr("class", "features2");

//Create choropleth scale
var color = d3.scale.quantize()
    .domain([1, 3])
    .range(d3.range(4).map(function (i) { return "q" + i + "-4"; }));

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom", zoomed);

svg.call(zoom);
svg2.call(zoom);

//Create a tooltip, hidden at the start
var tooltip = d3.select("body").append("div").attr("class", "tooltip");

d3.json("cleaned_flood_data.json", function (error, geodata) {
    if (error) return console.log(error); //unknown error, check the console

    //Create a path for each map feature in the data
    features.selectAll("path")
        .data(geodata.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function (d) { return (typeof color(d.properties.Flood_CL) == "string" ? color(d.properties.Flood_CL) : ""); })
        .on("mouseover", showTooltip)
        // .on("mouseover", function(d) {console.log(d.attr(path));})
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", clicked);
    
    features2.selectAll("path2")
        .data(geodata.features)
        .enter()
        .append("path2")
        .attr("d", path2)
        .attr("class", function (d) { return (typeof color(d.properties.Flood_CL) == "string" ? color(d.properties.Flood_CL) : ""); })
        .on("mouseover", showTooltip)
        // .on("mouseover", function(d) {console.log(d.attr(path));})
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip)
        .on("click", clicked);

    // d3.selectAll("path").on('mouseover', function (thisData) {
    //     path
    //         .filter(function (d) { return d.properties === thisData.pathNumber; })
    //         .attr('fill', 'black');
    // });

    // var d_select = features.selectAll('path').on("mouseover", function(path) {document.path.stroke("red")});
    // console.log(d_select);

});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d, i) {

}


//Update map on zoom/pan
function zoomed() {
    features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
        .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px");

    features2.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
    .selectAll("path2").style("stroke-width", 1 / zoom.scale() + "px");
}


//Position of the tooltip relative to the cursor
var tooltipOffset = { x: 5, y: -25 };

//Create a tooltip, hidden at the start
function showTooltip(d) {
    moveTooltip();

    tooltip.style("display", "block")
        .html("District: " + d.properties.Districts + ", <br> Province: " + d.properties.Province + ", <br> Flood Hazard: " + d.properties.Flood_Haza + ", <br> Affected Population: " + d.properties.affected_population);
}

//Move the tooltip to track the mouse
function moveTooltip() {
    tooltip.style("top", (d3.event.pageY + tooltipOffset.y) + "px")
        .style("left", (d3.event.pageX + tooltipOffset.x) + "px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
    tooltip.style("display", "none");
}