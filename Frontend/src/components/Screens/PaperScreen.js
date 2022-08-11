import React, { useEffect, useState } from "react";
import "./PaperScreen.css";
import { dia, elementTools, shapes, ui, util } from "@clientio/rappid";
import axios from "../../util/axiosConfig.js";
import { useParams } from "react-router-dom";

const PaperScreen = () => {
  //STATES FOR PAPER
  const [paper, setPaper] = useState();
  const [graph, setGraph] = useState(
    new dia.Graph({}, { cellNamespace: shapes })
  );
  const params = useParams();
  const [jsonData, setJsonData] = useState();

  useEffect(() => {
    setPaper(
      new dia.Paper({
        el: $("#paper"),
        width: "100%",
        height: "1000px",
        model: graph,
        cellViewNamespace: shapes,
        // background: {
        //   color: "white",
        //   image: "/images/d.png",
        //   // image: 'https://healthcoach-fitness.s3.amazonaws.com/image3-1656269937815.png',
        //   position: { x: 0, y: 0 },
        //   size: { width: 1200, height: 1000 },
        // },
        defaultLink: () =>
          new dia.Link({
            attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } },
          }),
      })
    );


    const fetchData = async () => {
   
      const {data} = await axios.get(`/paper/${params.id}`);
      console.log("dataaaaaaaa",data.jsondata);
      if(data.jsondata){
        setJsonData(JSON.parse(data.jsondata));

        // graph.fromJSON(JSON.parse(data.jsondata));
      }

      setSavedPaper(data);
    };
    fetchData();
 
    
    
  }, []);

  useEffect(() => {
    if (paper && jsonData) {
      let result = [];
      let paperWidth = Math.round(paper.$el.width());
      let shapesCount = jsonData.cells.filter((item) => {
        if (item.type !== "link") {
          return item;
        }
      });

      let ShapeWidth =
        Math.round(paperWidth / shapesCount.length) -
        (5 * shapesCount.length + 2);
      let space = paper.$el.width() - ShapeWidth * shapesCount.length;
      space = space / shapesCount.length + 2;
      let posX = space;
      let posY = 10;
      let targetPortsArray=[]
      let xValue=space+ShapeWidth/2
      let rectCout=1
      for (let i = 0; i < shapesCount.length; i++) {
        targetPortsArray.push({x:xValue,y:250})
        const rectangleShape = new shapes.basic.Rect({
          position: {
            x: posX,
            y: posY,
          },
          size: {
            width: ShapeWidth,
            height: 90,
          },
          attrs: {
            text: {
              text: `Rectangle${rectCout}`,
            },
          },
          
        });
        var subgroupPort1 = {
          label: {
            position: {
              name: "right",
            },
            markup: [
              {
                tagName: "text",
                selector: "label",
              },
            ],
          },
          attrs: {
            portBody: {
              magnet: true,
              width: 6,
              height: 6,
              x: ShapeWidth/2,
              y: 45,
              fill: "black",
            },
          },
          markup: [
            {
              tagName: "rect",
              selector: "portBody",
            },
          ],
        };

        rectangleShape.addPort(subgroupPort1);
        result.push(rectangleShape);
        rectCout++
        posX = posX + space + ShapeWidth;
        xValue=xValue+ShapeWidth+space
      }

      graph.addCell(result);
      var shadowLink = new shapes.standard.Link();
      shadowLink.prop("source", { x: space + ShapeWidth / 2, y: 250 });
      shadowLink.prop("target", { x: posX - ShapeWidth / 2-space, y: 250 });
      shadowLink.attr("line", { targetMarker: { type: "none" } });
      shadowLink.label(0, {
        markup: [
          {
            tagName: "rect",
            selector: "body",
          },
          {
            tagName: "text",
            selector: "label",
          },
        ],
        attrs: {
          body: {
            fill: "white", // white background
          },
          label: {
            text: "my label", // text to show
            fill: "black  ", // blue text
          },
        },
        position: {
          distance: 0, // midway on the connection path
          offset: {
            x: 0, // 10 local x units to the right
            y: 650, // 5 local y units above
          },

          args: {
            keepGradient: true, // auto-rotate by path slope at distance
            ensureLegibility: true, // auto-rotate label if upside-down
          },
        },
      });
      shadowLink.attr("line/stroke", "black");
      shadowLink.addTo(graph);

      let drawData = graph.toJSON();
      let cells=drawData.cells


      for (let i = 0; i < cells.length; i++) {
        if(cells[i].type!=="standard.Link"&&!cells[i].type.includes("link")){
          var shadowLink = new dia.Link();
          // shadowLink.source(cells[i].ports.items[0].id)
          shadowLink.prop("source",{id: cells[i].id, magnet: 'portBody', port:cells[i].ports.items[0].id});
          shadowLink.prop("target", targetPortsArray[i]);
          shadowLink.addTo(graph);
        }
      }



      // let newdata = [];
      // console.log("..........,............", drawData);
      // for (let i = 0; i < cells.length; i++) {
       
      //   if(!cells[i].type.includes("Link")||!cells[i].type.includes("link")){
      //     console.log(cells[i].type);
      //     if (cells[i].ports) {
      //       let ports = cells[i].ports.items;
      //       console.log(ports);
  
      //       for (let i = 0; i < ports.length; i++) {
  
      //         newdata.push({ shapeId: cells[i].id, portsId: ports[i].id });
      //       }
      //     }
      //   }
        
     
      // }

      // console.log("datataatat", newdata);

    
      // for(let i=0;i<newdata.length;i++){
       
      //   var shadowLink = new shapes.standard.Link();
      //   console.log("fff");
      // shadowLink.prop("source", newdata[i].id);
      // shadowLink.prop("target", { x: 300, y: 250 });
      // console.log(shadowLink);
      // // shadowLink.addTo(graph);
      // }
    }
  }, [paper, jsonData]);

  useEffect(() => {
    if (paper) {
      paper.on("change:position", async function (cell) {
      });
      paper.on("cell:pointerup", async function (cell) {
        let jsonObject = graph.toJSON();
        console.log(">>>>", jsonObject);
      });
    }
  }, [paper]);
  return (
    <div className="papermainDiv">
      <div className="paperleftDiv">
        <div className="paperhead">Neo Silica</div>
      </div>
      <div className="papermidtDiv">
        <div className="PaperTool">Toolbar</div>
        <div id="paper"></div>
      </div>

      {/* <div className="paperrightDiv"></div> */}
    </div>
  );
};

export default PaperScreen;
