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
        const svg = d3.select("#mySvg");

        let width = 960
        let height = 500
        let nodeSize = 20
        let arrowWidth = 8

        var nodes_data =  [
            {"name": "Travis", "sex": "M"},
            {"name": "Rake", "sex": "M"},
            {"name": "Diana", "sex": "F"},
            {"name": "Rachel", "sex": "F"},
            {"name": "Shawn", "sex": "M"},
            {"name": "Emerald", "sex": "F"}
            ]

            var links_data = [
                {"source": "Travis", "target": "Rake"},
                {"source": "Diana", "target": "Rake"},
                {"source": "Diana", "target": "Rachel"},
                {"source": "Rachel", "target": "Rake"},
                {"source": "Rachel", "target": "Shawn"},
                {"source": "Emerald", "target": "Rachel"}
            ]
            
            var link_force =  d3.forceLink(links_data)
            .id(function(d) { return d.name; })
        
        
        //set up the simulation 
        //nodes only for now 
        var simulation = d3.forceSimulation()
                            //add nodes
                            .nodes(nodes_data)
    .force("charge_force", d3.forceManyBody().strength(-2000))
    .force("center_force", d3.forceCenter(this.props.width / 2, this.props.height / 2))
    .on("tick", tickActions )
    .force("links",link_force);


    var defs = svg.append("defs");


		defs.append("marker")
				.attr("id","arrow")
                    .attr("viewBox","0 -5 10 10")
                    .attr("refX", 33)
                    .attr("refY", -0.5)
					.attr("markerWidth",4)
					.attr("markerHeight",4)
					.attr("orient","auto")
				
				.append("path")
					.attr("d", "M0,-5L10,0L0,5")
					.attr("class","arrowHead");


                        //draw circles for the nodes 

    //draw lines for the links 
var link = svg.append("g")
.attr("class", "links")
.attr('marker-end','url(#arrowhead)')
.selectAll("line")
.data(links_data)
.enter().append("line")
.attr("stroke-width", 2)
.attr("stroke", "gray")
.attr("marker-end", "url(#arrow)");

var node = svg.append("g")
.attr("class", "nodes")
.selectAll("circle")
.data(nodes_data)
.enter()
.append("circle")
.attr("r", 20)
.attr("fill", "red");


    


                
                
function tickActions() {
    //update circle positions each tick of the simulation 
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        
    //update link positions 
    //simply tells one end of the line to follow one node around
    //and the other end of the line to follow the other node around
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

  }                    
}
    render() {
        return <svg id = "mySvg" width = { this.props.width } height = { this.props.height } ></svg>
    }
}
export default BarChart