import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useState } from "react";
import React from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

function CookImgCrop() {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 500,
    height: 300,
    unit: "px",
    disabled: true,
  });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const selectImage = (file) => {
    console.log(file);
    setSrc(URL.createObjectURL(file));
    console.log(src);
  };

  const cropImageNow = () => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Converting to base64
    const base64Image = canvas.toDataURL("image/jpeg");
    setOutput(base64Image);
  };

  return (
    <>
      <span className="p-float-label mt-3">
        <FileUpload
          id="crop"
          name="crop"
          mode="basic"
          url="/api/upload"
          accept="image/*"
          maxFileSize={1000000}
          onSelect={(e) => {
            selectImage(e.files[0]);
          }}
          chooseLabel="Nahrát"
        />
      </span>
      <br />
      <div>
        {src && (
          <div>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <img src={src} />
            </ReactCrop>
            <br />
            <Button label="Crop" onClick={cropImageNow} />
            <br />
            <br />
          </div>
        )}
      </div>
      <div>{output && <img src={output} />}</div>
    </>
  );
}

export default CookImgCrop;
