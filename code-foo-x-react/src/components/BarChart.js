import React, {
    Component
} from 'react'
import {
    scaleLinear
} from 'd3-scale'
import {
    max
} from 'd3-array'
import {
    select
} from 'd3-selection'
import * as d3 from 'd3';

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.createBarChart = this.createBarChart.bind(this)
    }
    componentDidMount() {
        this.createBarChart()
    }
    componentDidUpdate() {
        this.createBarChart()
    }
    createBarChart() {  
        
    var w = 1000;
    var h = 600;
    var linkDistance=200;


    var dataset = {

    nodes: [
    {name: "Adam", fx: 50, fy: 200},
    {name: "Bob"},
    {name: "Carrie"},
    {name: "James"},
    {name: "Rolly"},
    {name: "End"},
    {name: "A"},
    {name: "B"},
    {name: "C"},
    {name: "D", fx: 900, fy: 200}
    ],
    edges: [
    {source: "Adam", target: "Bob", label: "This is a label"},
    {source: "Bob", target: "Carrie", label: "This is another"},
    {source: "Carrie", target: "James", label: "This is another"},
    {source: "Carrie", target: "Rolly", label: "This is another"},
    {source: "James", target: "Rolly", label: "Test"},
    {source: "Rolly", target: "End", label: "Test"},
    {source: "End", target: "A", label: "Test"},
    {source: "End", target: "B", label: "Test"},
    {source: "A", target: "B", label: "Test"},
    {source: "B", target: "C", label: "Test"},
    {source: "C", target: "D", label: "Test"},
    ]
    };

 
    var svg = d3.select("#mySvg");

    var force = d3.forceSimulation()
        .nodes(dataset.nodes)
        .force("link", d3.forceLink(dataset.edges).id(function(d) { return d.name; }).distance(100))
        .force("charge", d3.forceManyBody())
        .force("center_force", d3.forceCenter(this.props.width / 2, this.props.height / 2));


 

    var edges = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke","black")
        .style("pointer-events", "none");
      

    
    var nodes = svg.append("g")
        .attr("class", "nodes")
    .selectAll("circle")
      .data(dataset.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", 100)
      .attr("cy", 100)
      .attr("fill", "red");
      //.call(force.drag)


    var nodelabels = svg.selectAll(".nodelabel") 
       .data(dataset.nodes)
       .enter()
       .append("text")
        .attr("x", function(d){return d.x; })
        .attr("y", function(d){return d.y;})
        .attr("class", "nodelabel")
       .text(function(d){return d.name;});

    var edgepaths = svg.selectAll(".edgepath")
        .data(dataset.edges)
        .enter()
        .append('path')
        .attr('class', 'edgepath')
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .attr('fill', 'blue')
        .attr('stroke','red')
        .attr('marker-end','url(#arrowhead)')
        .attr('id', function(d,i) {return 'edgepath'+i});

    var edgelabels = svg.selectAll(".edgelabel")
        .data(dataset.edges)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attr("class","edgelabel")
        .attr("id", function(d,i){return 'edgelabel'+i})
        .attr("dx",80)
        .attr("dy", 0)
        .attr("font-size",10)
        .attr("fill", "#aaa");

    edgelabels.append('textPath')
        .attr('xlink:href',function(d,i) {return '#edgepath'+i})
        .style("pointer-events", "none")
        .text(function(d,i){console.log("d", d); return d.label});


    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX',25)
        .attr('refY', 0)
        .attr('orient','auto')
        .attr('markerWidth',10)
        .attr('markerHeight',10)
        .attr('xoverflow','visible')
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#ccc')
            .attr('stroke','#ccc');
     

            force.on("tick", function(){



                nodes.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        
        
                edges.attr("x1", function(d){return d.source.x;});
                edges.attr("y1", function(d){return d.source.y;});
                edges.attr("x2", function(d){return d.target.x;});
                edges.attr("y2", function(d){return d.target.y;});
        
                nodelabels.attr("x", function(d) { return d.x; }) 
                          .attr("y", function(d) { return d.y; });
        
                edgepaths.attr('d', function(d) { 
                    var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                                   return path});       
        
                edgelabels.attr('transform',function(d,i){
                    if (d.target.x < d.source.x){
                        let bbox = this.getBBox();
                        let rx = bbox.x+bbox.width/2;
                        let ry = bbox.y+bbox.height/2;
                        return 'rotate(180 '+rx+' '+ry+')';
                        }
                    else {
                        return 'rotate(0)';
                        }
                });
            });
    }
    render() {
        
        return <svg id = "mySvg" width = { this.props.width } height = { this.props.height } ></svg>
    }
}
export default BarChart