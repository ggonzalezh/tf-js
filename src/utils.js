// Use the bodyPix draw API's
export const draw = (personSegmentation) => {

    if (showMaskToggle.checked) {
        let targetSegmentation = personSegmentation;

        // Draw a mask of the body segments - useful for debugging

        // Just show the face and hand parts
        targetSegmentation.data = personSegmentation.data.map(val => {
            if (val !== 0 && val !== 1 && val !== 10 && val !== 11)
                return -1;
            else
                return val;
        });

        const coloredPartImage = bodyPix.toColoredPartMask(targetSegmentation);
        const opacity = 0.7;
        const maskBlurAmount = 0;
        bodyPix.drawMask(
            drawCanvas, sourceVideo, coloredPartImage, opacity, maskBlurAmount,
            flipHorizontal);

    }

    // drawMask clears the canvas, drawKeypoints doesn't
    if (showMaskToggle.checked === false) {
        // bodyPix.drawMask redraws the canvas. Clear with not
        drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }

    // Show dots from pose detection
    if (showPointsToggle.checked) {
        personSegmentation.allPoses.forEach(pose => {
            if (flipHorizontal) {
                pose = bodyPix.flipPoseHorizontal(pose, personSegmentation.width);
            }
            drawKeypoints(pose.keypoints, 0.9, drawCtx);
        });
    }

}

// Draw dots
export const drawKeypoints =(keypoints, minConfidence, ctx, color = 'aqua') => {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

    }
}