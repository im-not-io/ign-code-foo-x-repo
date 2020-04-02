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
import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { colors } from '@material-ui/core';

const width = 1000;
const height = 600;
const linkDistance = 100;
const nodeRadius = 7;

function createBarChart(props) {
    {
        var dataset = {
    
        nodes: [
        {name: "Adam", fx: nodeRadius/2 + 4, fy: 50},
        {name: "Bob"},
        {name: "Carrie"},
        {name: "James"},
        {name: "Rolly"},
        {name: "End"},
        {name: "A"},
        {name: "B"},
        {name: "C"},
        {name: "D"},
        {name: "E", fx: width - 50, fy: height - 50},
    
        ],
        edges: [
        {source: "Adam", target: "Bob", label: "200"},
        {source: "Bob", target: "Carrie", label: "500"},
        {source: "Carrie", target: "James", label: "100"},
        {source: "Carrie", target: "Rolly", label: "200"},
        {source: "James", target: "Rolly", label: "2100"},
        {source: "Rolly", target: "End", label: "432"},
        {source: "End", target: "A", label: "200"},
        {source: "End", target: "B", label: "150"},
        {source: "B", target: "C", label: "220"},
        {source: "C", target: "D", label: "100"},
        {source: "D", target: "E", label: "50"}
    
        ]
        };
    
     
        var svg = d3.select("#mySvg")
        .attr("cursor", "grab")
        
        let g = svg.append("g")
        .attr("style", "border: solid 1px black;");
    
        svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));
    
        function zoomed() {
            g.attr("transform", d3.event.transform);
          }
    
    
        var force = d3.forceSimulation()
            .nodes(dataset.nodes)
            .force("link", d3.forceLink(dataset.edges).id(function(d) { return d.name; }).distance(linkDistance))
            .force("charge", d3.forceManyBody())
            .force("center_force", d3.forceCenter(width / 2, height / 2));
    
    
     
    
        var edges = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(dataset.edges)
            .enter()
            .append("line")
            .style("stroke","#adadad");
          
    
    
    
    
        var nodelabels = g.selectAll(".nodelabel") 
           .data(dataset.nodes)
           .enter()
           .append("text")
            .attr("x", function(d){return d.x; })
            .attr("y", function(d){return d.y; })
            .attr("class", "nodelabel")
           .text(function(d){return d.name;})
           .attr("font-size",15)
           .attr("fill", "#4a4a4a")
           .attr("font-family", "Verdana, sans-serif")
           .attr("font-weight", "bold");
    
           
    
        var edgepaths = g.append("g")
        .attr("class", "edgepath")
        .selectAll(".edgepath")
            .data(dataset.edges)
            .enter()
            .append('path')
            .attr('d', function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y})
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('marker-end','url(#arrowhead)')
            .attr('id', function(d,i) {return 'edgepath'+i})
            
    
        var edgelabels = g.selectAll(".edgelabel")
            .data(dataset.edges)
            .enter()
            .append('text')
            .attr("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("class","edgelabel")
            .attr("id", function(d,i){return 'edgelabel'+i})
            .attr("dx",0)
            .attr("dy", 0)
            .attr("font-size",10)
            .attr("fill", "#adadad")
            .attr("font-family", "Verdana, sans-serif")
            .attr("font-weight", "bold");
    
            var drag_handler = d3.drag()
            .on("drag", function(d) {
                  d3.select(this)
                    .attr("cx", d.x = d3.event.x  )
                    .attr("cy", d.y = d3.event.y  )
                    force.restart();
                    }); 
    
    
            var nodes = g.append("g")
            .attr("class", "nodes")
        .selectAll("circle")
          .data(dataset.nodes)
          .enter()
          .append("circle")
          .attr("r", nodeRadius)
          .attr("cx", 100)
          .attr("cy", 100)
          .attr("fill", "#adadad");
    
          drag_handler(nodes);   
    
    
    
        edgelabels.append('textPath')
            .attr('href',function(d,i) {return '#edgepath'+i})
            .style("pointer-events", "none")   
            .text(function(d,i){console.log("d", d); return d.label})
            .attr("class","edgelabel")
            .attr("startOffset", "50%")
    
    
    
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX',16)
            .attr('refY', 0)
            .attr('orient','auto')
            .attr('markerWidth',10)
            .attr('markerHeight',10)
            .attr('xoverflow','visible')
            .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#adadad')
                .attr('stroke','#adadad')
                .attr("font-family", "Verdana, sans-serif")
                .attr("font-weight", "bold");
         
    
                force.on("tick", function(){
    
    
    
                    nodes.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            
            
                    edges.attr("x1", function(d){return d.source.x;});
                    edges.attr("y1", function(d){return d.source.y;});
                    edges.attr("x2", function(d){return d.target.x;});
                    edges.attr("y2", function(d){return d.target.y;});
            
                    nodelabels.attr("x", function(d) { return d.x + 10; }) 
                              .attr("y", function(d) { return d.y + 5; });
            
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
}

function BestQuestsGraph(props) {

    useEffect(() => createBarChart(props));

    return (
        <svg id = "mySvg" width = { width } height = { height } ></svg>
    );

}
export default BestQuestsGraph