import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodysegment = async () => {
    const net = await bodyPix.load();
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      let person = await net.segmentPersonParts(video);
      let targetSegmentation = person;

      targetSegmentation.data = person.data.map(val => {
        if (val !== 0 && val !== 1)
            return -1;
        else
            return val;
      });

      const faceThreshold = 0.9;
      const touchThreshold = 0.01;

      // const coloredPartImage = bodyPix.toMask(person);
      const coloredPartImage = bodyPix.toColoredPartMask(targetSegmentation);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;

      if(targetSegmentation.allPoses[0] !== undefined){
        let data = undefined
        data = {
          'Nose':{
            'X': targetSegmentation.allPoses[0].keypoints[0].position.x,
            'Y': targetSegmentation.allPoses[0].keypoints[0].position.y
          },
          'LeftEye':{
            'X': targetSegmentation.allPoses[0].keypoints[1].position.x,
            'Y': targetSegmentation.allPoses[0].keypoints[1].position.y
          },
          'RigthEye':{
            'X': targetSegmentation.allPoses[0].keypoints[2].position.x,
            'Y': targetSegmentation.allPoses[0].keypoints[2].position.y
          },
          'LeftEar':{
            'X': targetSegmentation.allPoses[0].keypoints[3].position.x,
            'Y': targetSegmentation.allPoses[0].keypoints[3].position.y
          },
          'RigthEar':{
            'X': targetSegmentation.allPoses[0].keypoints[4].position.x,
            'Y': targetSegmentation.allPoses[0].keypoints[4].position.y
          }
        }
      }
      
      bodyPix.drawMask(
        canvas,
        video,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flipHorizontal
      );
    }
  };

  runBodysegment();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;