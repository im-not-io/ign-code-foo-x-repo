import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import p5 from 'p5';

const useStyles = makeStyles((theme) => ({
    h1Color: {
        color: theme.palette.secondary.dark
    }
}));

function preventBehavior(e) {
  e.preventDefault(); 
};


function DrawingBoard(props) {

  
    // const classes = useStyles();
    let lines = []; 

      useEffect(() => {
        document.addEventListener("touchmove", preventBehavior, {passive: false});
        let sketch = function(p) {
            let canvas;
            let lines = [];

            p.setup = function() {
              canvas = p.createCanvas(p.windowWidth, p.windowHeight);
              canvas.parent('myContainer');
              p.background(102);
              

            };

          
            p.draw = function() {
                    p.stroke(255);
                    p.strokeWeight(5);
                    p.background(102);
                    if (p.mouseIsPressed === true) {
                        lines.push({
                            startX: p.mouseX,
                            startY: p.mouseY,
                            endX: p.pmouseX,
                            endY: p.pmouseY
                        })
                      }
                    for (let i = 0; i < lines.length; i++) {
                        p.line(lines[i].startX, lines[i].startY, lines[i].endX, lines[i].endY);
                    }

            }

            p.windowResized = function() {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                
              }
              
              

        }
          
        let myp5 = new p5(sketch);

          

    
      }, []);

      return (
             <div id="myContainer" style={{
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
             }}></div>
      );
}

export default DrawingBoard;
      
      

