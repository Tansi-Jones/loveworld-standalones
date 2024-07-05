/**
 * Avatar Creation Component for Ministry Programs
 *
 * This component facilitates the creation of avatars for ministry programs using a combination of Tailwind, TypeScript, and Next.js (version 14 and above).
 *
 * Dependencies:
 * - react-cropper: Used for cropping images.
 * - HTML Canvas: For rendering the cropped image onto a flyer.
 *
 * Installation:
 * Ensure you have the react-cropper library installed.
 * @see https://www.npmjs.com/package/react-cropper
 *
 * CSS Styling:
 * Add the following class to your CSS file to style the cropper:
 * .img-preview {
 *   overflow: hidden;
 * }
 *
 * Compatibility:
 * - Designed for Next.js >v14, TypeScript, and Tailwind CSS.
 * - Can be adapted for other frameworks (e.g., React). Replace Next.js-specific components and remove Tailwind classes if necessary.
 * - Keep the .img-preview class and IDs unchanged as they are utilized by the cropper and canvas.
 *
 * Images:
 *
 * 1. DEFAULT IMAGE:
 * - Displayed on initial load.
 * - Size should be less than 500KB for faster loading.
 *
 * 2. PREVIEW IMAGE:
 * - Displayed on the right side when the component is launched.
 * - Should be less than 1MB. Can be the same as the flyer image.
 *
 * 3. FLYER IMAGE:
 * - The target image where the avatar is drawn using the canvas.
 * - Should be less than 5MB for optimal quality and download speed.
 * - Hidden from the DOM, with an ID of "flyer" (do not change this ID).
 * - Dimensions should be set to 1x1. Maintain image quality at 100%.
 *
 * Usage Instructions:
 *
 * 1. Replace image sources with your own.
 * 2. (Optional) Adjust canvas width and height to fit your design.
 * 3. Make the canvas visible by removing the "hidden" attribute. Adjust avatar size and position (X, Y) on the flyer to match your design.
 * 4. (Optional) Change the avatar shape from a circle to a square using the ctx.rect() method.
 * 5. Reapply the "hidden" attribute to the canvas element after finalizing adjustments.
 * 6. Locate the preview image div element (ID: "preview") and adjust the avatar image position using Tailwind classes or vanilla CSS.
 * 7. (Optional) Modify component styling to match your design.
 *
 * Note: Replace the Next.js-specific components (e.g., Image component) with standard HTML img tags if not using Next.js. Remove the "use client" directive in such cases.
 */

"use client";

import React, { useState, createRef, useEffect, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";

/**
 * Default image sources for the component.
 * Replace these with your own images.
 */

const defaultSrc = "/img/default.png";
const previewSrc = "/img/preview.jpg";
const flyerSrc = "/img/flyer.png";

export const Avatar = () => {
  const [image, setImage] = useState(defaultSrc);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState("#");

  const cropperRef = createRef<ReactCropperElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);

  /**
   * Handles the image upload process.
   * Reads the uploaded file and sets it as the source image.
   */

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const files =
      event.target?.files ||
      (event.target as HTMLInputElement & { dataTransfer?: DataTransfer })
        ?.dataTransfer?.files ||
      [];

    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setImageSrc((reader?.result as string) || null);
      };
      reader.readAsDataURL(files[0]);
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setImageSrc((reader?.result as string) || null);
    };
    reader.readAsDataURL(files[0]);
  };

  /**
   * Handles the cropping process of the image.
   * Uses the cropper instance to get the cropped image data URL.
   */

  const handleImageCrop = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCroppedImage(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
      );
    }
  };

  /**
   * Effect hook to draw the image on the canvas whenever the image source changes.
   */

  useEffect(() => {
    if (imageSrc && avatarRef.current) {
      drawImageOnCanvas();
    }
  }, [imageSrc]);

  /**
   * Draws the cropped image onto the canvas.
   * Configures the canvas context and positions the image based on specified coordinates and size.
   */

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const flyer = document.getElementById("flyer") as HTMLImageElement;
    const avatar = avatarRef.current;

    if (flyer && avatar) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(flyer, 0, 0, canvas.width, canvas.height);

      /**
       *
       * Below are the avatar size and X,Y position on the flyer
       * Adjust by changing the values to match your design.
       *
       */

      const avatarSize = 575;
      const avatarX = 708;
      const avatarY = 763;

      ctx.beginPath();

      /**
       *
       * By default, the avatar is a circle.
       * You can change the shape by changing the ctx.arc() method.
       * For example, to make the avatar a square, use the ctx.rect() method.
       *
       */

      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();
    }
  };

  /**
   * Handles the download process of the final avatar image.
   * Creates a download link for the canvas content and resets the component state.
   */

  const handleAvatarDownload = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png", 1);
    link.download = "avatar.png";
    link.click();

    setCroppedImage("#");
    setImage(defaultSrc);
    setImageSrc(null);
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="bg-black/5 dark:bg-white/10 border-none rounded-lg sm:w-[45rem] mx-auto px-5 py-5 space-y-8">
        <div className="p-0 space-y-5">
          <div>
            <h2 className="text-xl font-medium ">Create your avatar</h2>
            <p className=" text-sm">
              Follow the steps below to create your avatar.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-4">
            <label className="text-center inline-flex items-center p-2 bg-stone-700 rounded-md text-sm space-x-1 shadow-sm hover:bg-stone-700/90 cursor-pointer">
              <input type="file" hidden onChange={handleImageUpload} />

              <span>1 Upload photo</span>
            </label>

            <button
              className="text-center inline-flex items-center space-x-1 p-2 bg-stone-700 rounded-md text-sm disabled:bg-stone-700/50 hover:bg-stone-700/90 disabled:cursor-not-allowed"
              onClick={handleImageCrop}
              disabled={image === defaultSrc}
            >
              2 Crop & Save
            </button>
            <button
              className="text-center inline-flex items-center space-x-1 p-2 bg-stone-700 rounded-md text-sm disabled:bg-stone-700/50 hover:bg-stone-700/90 disabled:cursor-not-allowed"
              onClick={handleAvatarDownload}
              disabled={croppedImage === "#"}
            >
              3 Download avatar
            </button>
          </div>
        </div>

        <div className="p-0 gap-5 flex flex-col sm:flex-row items-start justify-between">
          <div>
            <div className="border-2 border-stone-400 border-dashed rounded-md w-[300px] h-[300px]">
              {/**
               *
               * The cropper element is styled using the .img-preview class.
               * Add the class to a CSS file to style the cropper.
               * @see https://www.npmjs.com/package/react-cropper to learn more.
               * I advise you to use the default styles for the best experience.
               *
               */}

              <Cropper
                ref={cropperRef}
                zoomTo={0}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={true}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                cropBoxResizable={true}
              />
            </div>
          </div>

          <div className="object-none relative w-[300px] h-[300px] border-2 border-stone-400 border-dashed rounded">
            <Image
              src={previewSrc}
              alt="Flyer"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <Image
              id="flyer"
              src={flyerSrc}
              alt="Flyer"
              width={1}
              height={1}
              unoptimized
              quality={100}
              onLoad={drawImageOnCanvas}
            />

            <div
              className="img-preview rounded-full absolute left-[105px] right-0 bottom-0 top-[113px]"
              style={{ width: 85, height: 85 }}
              id="preview"
            />
            {croppedImage !== "#" && (
              <Image
                ref={avatarRef}
                src={croppedImage}
                alt="cropped avatar"
                width={1}
                height={1}
                unoptimized
                quality={100}
                onLoad={drawImageOnCanvas}
              />
            )}

            {/**
             * The canvas element is hidden from the DOM but is used to draw the avatar.
             * This canvas by default is 2000x2000 pixels. you can adjust the size to fit your design.
             * When adjusting the size, remember to adjust the avatar size and X,Y position on the flyer.
             */}

            <canvas ref={canvasRef} width={2000} height={2000} hidden />
          </div>
        </div>
      </div>
    </section>
  );
};
