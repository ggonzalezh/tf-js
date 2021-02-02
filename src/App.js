import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { drawMesh } from "./meshUtilities.js";
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

const App = () => {
  const webcamReference = useRef(null);
  const canvasReference = useRef(null);

  const loadFacemesh = async () => {
    const model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh)
    setInterval(() => {
      detectFace(model);
    }, 150);
  };

  const detectFace = async (model) => {
    if (
      typeof webcamReference.current !== "undefined" &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
      const video = webcamReference.current.video;
      const videoWidth = webcamReference.current.video.videoWidth;
      const videoHeight = webcamReference.current.video.videoHeight;
      canvasReference.current.width = videoWidth;
      canvasReference.current.height = videoHeight;
      await model.estimateFaces({input: video}).then(predictions => {
        console.log({predictions})
        for (let i = 0; i < predictions.length; i++) {
          const keypoints = predictions[i].scaledMesh
          for (let i = 0; i < keypoints.length; i++) {
            const [x, y, z] = keypoints[i]
    
            console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`)
          }
        }
        const ctx = canvasReference.current.getContext("2d");
        drawMesh(predictions, ctx);
      })
    }
  };

  loadFacemesh();

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />

      <canvas
        ref={canvasReference}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 720,
          height: 500
        }}
      />
    </div>
  );
}

export default App;
