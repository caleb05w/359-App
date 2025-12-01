// Pixel fish -- this is the fish that gets generated.
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

//had help converting SVG's to JS code with:  https://react-svgr.com/playground/
// then used chat GPT to help me parse it into vectors that would fit my drawing
//because I didnt have enough time to manually plant each SVG anchor. That wouldve taken ages.
//but every thing is drawn by me originally. You can refer to our /images file, and you can find all the SVG files from figma that
//that compose the fish.

// Default body graphics configuration
const nullSchema = {
    pattern: "line", // "stripes", "dots", "gills", or "line"
    colorOverlay: true, // Controls both main body and left square overlays
    color: "#000000", // Color for both body overlays
    mainColor: "#000000", // Color for main body, face, and left square
    fin: "none", // "angled", "flat", "fat", "dorsal", "firstDorsal", "anal", "shark", "finlets", or "long"
    bottomFin: "none", // "angled", "flat", "fat", "dorsal", "firstDorsal", "anal", "shark", "finlets", or "long"
    tail: "none", // "clubbed", "emarginate", "forked", "lunate", or "truncate"
    snout: "terminal", // "overhanging", "slightlyProtruding", "terminal", "extended", "projecting", or "blunt"
    sideFin: false, // Boolean - side fin in the middle of body (30px long, 20px wide)
    size: "small", // "small" (10px), "medium" (20px), or "long" (30px) - controls secondary body width
    secondary: "#000000", // Color for both fins and tail
    tertiary: "#000000", // Color for gills, dots, and stripes
    eyeColor: "#FFFFFF" // Color for the eye
};

// Fin definitions
const FIN_DEFINITIONS = {
    angled: {
        width: 40,
        height: 20,
        rects: [
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
        ]
    },
    flat: {
        width: 30,
        height: 10,
        rects: [
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
        ]
    },
    fat: {
        width: 40,
        height: 20,
        rects: [
            { x: 0, y: 0, width: 40, height: 20 },
        ]
    },
    dorsal: {
        width: 40,
        height: 20,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
        ]
    },
    "firstDorsal": {
        width: 30,
        height: 10,
        rects: [
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
        ]
    },
    "anal": {
        width: 50,
        height: 20,
        rects: [
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
            { x: 40, y: 10, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 30, y: 0, width: 10, height: 10 },
        ]
    },
    "shark": {
        width: 69,
        height: 30,
        rects: [
            { x: 19, y: 20, width: 10, height: 10 },
            { x: 29, y: 20, width: 10, height: 10 },
            { x: 39, y: 20, width: 10, height: 10 },
            { x: 49, y: 20, width: 10, height: 10 },
            { x: 59, y: 20, width: 10, height: 10 },
            { x: 29, y: 10, width: 10, height: 10 },
            { x: 19, y: 10, width: 10, height: 10 },
            { x: 9, y: 10, width: 10, height: 10 },
            { x: 39, y: 10, width: 10, height: 10 },
            { x: 48, y: 10, width: 10, height: 10 },
            { x: 39, y: 0, width: 10, height: 10 },
            { x: 19, y: 0, width: 10, height: 10 },
            { x: 29, y: 0, width: 10, height: 10 },
            { x: 9, y: 0, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
        ]
    },
    "finlets": {
        width: 60,
        height: 20,
        rects: [
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
            { x: 40, y: 10, width: 10, height: 10 },
            { x: 50, y: 10, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 30, y: 0, width: 10, height: 10 },
            { x: 38, y: 0, width: 10, height: 10 },
        ]
    },
    "long": {
        width: 70,
        height: 20,
        rects: [
            { x: 40, y: 10, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 30, y: 0, width: 10, height: 10 },
            { x: 40, y: 0, width: 10, height: 10 },
            { x: 50, y: 10, width: 10, height: 10 },
            { x: 60, y: 10, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 12, y: 0, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
        ]
    }
};

// Tail definitions 
const TAIL_DEFINITIONS = {
    clubbed: {
        width: 50,
        height: 50,
        rects: [
            { x: 40, y: 10, width: 10, height: 10 },
            { x: 40, y: 20, width: 10, height: 10 },
            { x: 40, y: 30, width: 10, height: 10 },
            { x: 30, y: 20, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
            { x: 30, y: 10, width: 10, height: 10 },
            { x: 30, y: 30, width: 10, height: 10 },
            { x: 30, y: 40, width: 10, height: 10 },
            { x: 30, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 40, y: 40, width: 10, height: 10 },
            { x: 40, y: 0, width: 10, height: 10 },
        ]
    },
    emarginate: {
        width: 30,
        height: 109,
        rects: [
            { x: 20, y: 50, width: 10, height: 10 },
            { x: 20, y: 40, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 80, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
            { x: 10, y: 70, width: 10, height: 10 },
            { x: 20, y: 60, width: 10, height: 10 },
            { x: 20, y: 70, width: 10, height: 10 },
            { x: 0, y: 70, width: 10, height: 10 },
            { x: 0, y: 80, width: 10, height: 10 },
            { x: 0, y: 90, width: 10, height: 10 },
            { x: 0, y: 99, width: 10, height: 10 },
            { x: 10, y: 90, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 10, y: 60, width: 10, height: 10 },
        ]
    },
    forked: {
        width: 30,
        height: 59,
        rects: [
            { x: 20, y: 19, width: 10, height: 10 },
            { x: 10, y: 19, width: 10, height: 10 },
            { x: 0, y: 19, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 29, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 29, width: 10, height: 10 },
            { x: 0, y: 39, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 10, y: 39, width: 10, height: 10 },
            { x: 20, y: 29, width: 10, height: 10 },
            { x: 0, y: 49, width: 10, height: 10 },
        ]
    },
    lunate: {
        width: 30,
        height: 70,
        rects: [
            { x: 20, y: 30, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 50, width: 10, height: 10 },
            { x: 0, y: 60, width: 10, height: 10 },
            { x: 20, y: 40, width: 10, height: 10 },
            { x: 10, y: 50, width: 10, height: 10 },
        ]
    },
    truncate: {
        width: 30,
        height: 60,
        rects: [
            { x: 20, y: 30, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 10, y: 50, width: 10, height: 10 },
            { x: 20, y: 40, width: 10, height: 10 },
            { x: 0, y: 50, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
        ]
    }
};

// Snout definitions 
const SNOUT_DEFINITIONS = {
    overhanging: {
        width: 30,
        height: 50,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
        ]
    },
    slightlyProtruding: {
        width: 30,
        height: 60,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 50, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
        ]
    },
    terminal: {
        width: 30,
        height: 60,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 50, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 20, y: 0, width: 10, height: 10 },
            { x: 20, y: 50, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
            { x: 10, y: 50, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 20, y: 40, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
        ]
    },
    extended: {
        width: 30,
        height: 50,
        rects: [
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
        ]
    },
    projecting: {
        width: 30,
        height: 50,
        rects: [
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
        ]
    },
    blunt: {
        width: 30,
        height: 60,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 },
            { x: 0, y: 0, width: 10, height: 10 },
            { x: 0, y: 40, width: 10, height: 10 },
            { x: 0, y: 50, width: 10, height: 10 },
            { x: 0, y: 20, width: 10, height: 10 },
            { x: 0, y: 30, width: 10, height: 10 },
            { x: 10, y: 10, width: 10, height: 10 },
            { x: 10, y: 0, width: 10, height: 10 },
            { x: 10, y: 40, width: 10, height: 10 },
            { x: 10, y: 50, width: 10, height: 10 },
            { x: 10, y: 20, width: 10, height: 10 },
            { x: 10, y: 30, width: 10, height: 10 },
            { x: 20, y: 10, width: 10, height: 10 },
            { x: 20, y: 40, width: 10, height: 10 },
            { x: 20, y: 20, width: 10, height: 10 },
            { x: 20, y: 30, width: 10, height: 10 },
        ]
    }
};


export default function PixelFish({ schema, flip, angle, width, height, scale }) {
    const bodyGraphics = schema ?? nullSchema;

    // Main body 
    const bodyWidth = 80;
    const bodyHeight = 70;

    // Face Box
    const faceWidth = 10;
    const faceHeight = 60;
    const faceX = bodyWidth;
    const faceY = (bodyHeight - faceHeight) / 2;

    // Eyes
    const eyeDefinition = {
        width: 18,
        height: 18,
        rects: [
            { x: 0, y: 0, width: 18, height: 18, fill: "#181818" },
            { x: 2, y: 3, width: 4, height: 4, fill: "white" },
        ]
    };
    const eyeSize = eyeDefinition.width; // 30
    const eyeX = faceX; // Left-aligned with face box
    const eyeY = faceY + 10; // 10px from top of face box

    // Mouth (25x10), 10px under the eye, positioned at the end of the face
    const mouthWidth = 25;
    const mouthHeight = 7;
    const mouthX = faceX + faceWidth; // Start at the end of the face
    const mouthY = eyeY + eyeSize + 10; // 10px below eye

    // Top fin
    const selectedFin = FIN_DEFINITIONS[bodyGraphics.fin] || FIN_DEFINITIONS.flat;
    const topFinX = (bodyWidth - selectedFin.width) / 2; // Centered horizontally
    const topFinY = -selectedFin.height; // Above body

    // Bottom fin 
    const selectedBottomFin = FIN_DEFINITIONS[bodyGraphics.bottomFin] || FIN_DEFINITIONS.flat;
    const bottomFinX = (bodyWidth - selectedBottomFin.width) / 2; // Centered horizontally
    const bottomFinY = bodyHeight; // Below body

    // Secondary bod, helps maintain scale of the fish since main body cant really change lol
    const sizeWidthMap = {
        small: 10,
        medium: 30,
        long: 50
    };
    const leftSquareWidth = sizeWidthMap[bodyGraphics.size] || sizeWidthMap.medium;
    const leftSquareHeight = 60;
    const leftSquareX = -leftSquareWidth;
    const leftSquareY = (bodyHeight - leftSquareHeight) / 2;

    // Tail 
    const selectedTail = TAIL_DEFINITIONS[bodyGraphics.tail] || TAIL_DEFINITIONS.truncate;
    const tailX = leftSquareX - selectedTail.width; // Left of left square
    const tailY = (bodyHeight - selectedTail.height) / 2; // Vertically centered

    // Snout 
    const selectedSnout = SNOUT_DEFINITIONS[bodyGraphics.snout] || SNOUT_DEFINITIONS.slightlyProtruding;
    const snoutX = faceX + faceWidth; // Right of face box
    const snoutY = faceY + (faceHeight - selectedSnout.height) / 2; // Vertically centered with face

    // Side fin (center of body)
    const sideFinWidth = 30;
    const sideFinHeight = 20;
    const sideFinX = bodyWidth - sideFinWidth - 5;
    const sideFinY = (bodyHeight - sideFinHeight) / 2 + 20;


    //bounding box calculation for fish. Basically adds all the porportions up.
    //need this for collision
    const maxX = Math.max(
        bodyWidth,
        faceX + faceWidth,
        mouthX + mouthWidth,
        snoutX + selectedSnout.width,
        bodyGraphics.sideFin ? sideFinX + sideFinWidth : 0
    );

    const minX = Math.min(
        0,
        leftSquareX,
        tailX
    );

    const maxY = Math.max(
        bodyHeight,                                 // body bottom
        bottomFinY + selectedBottomFin.height,      // bottom fin
        faceY + faceHeight,                         // face
        mouthY + mouthHeight,                       // mouth
        tailY + selectedTail.height,                // tail
        snoutY + selectedSnout.height,              // snout
        bodyGraphics.sideFin ? sideFinY + sideFinHeight : 0
    );

    const minY = Math.min(
        0,                       // body top
        topFinY,                 // top fin
        faceY,
        tailY,
        leftSquareY,
        snoutY,
        bodyGraphics.sideFin ? sideFinY : 0
    );

    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;
    const baseWidth = width ?? viewBoxWidth;
    const baseHeight = height ?? viewBoxHeight;
    //scale factor of fish, allows us to rescale it.
    const scaleFactor = scale ?? 1;
    const svgWidth = baseWidth * scaleFactor;
    const svgHeight = baseHeight * scaleFactor;



    return (
        <Svg width={svgWidth} height={svgHeight} viewBox={`${minX} ${minY} ${viewBoxWidth} ${viewBoxHeight}`}>
            <Rect
                x={minX}
                y={minY}
                width={viewBoxWidth}
                height={viewBoxHeight}
                fill="none"
            //bounding box
            // stroke="green"
            // strokeWidth={2}
            />
            {/* Tail - based on tail parameter */}
            {selectedTail.rects.map((rect, index) => (
                <Rect
                    key={`tail-${index}`}
                    x={tailX + rect.x}
                    y={tailY + rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={bodyGraphics.secondary || "#D9D9D9"}
                />
            ))}

            {/* body 2 */}
            <Path
                d={`M ${leftSquareX} ${leftSquareY} L ${leftSquareX + leftSquareWidth} ${leftSquareY} L ${leftSquareX + leftSquareWidth} ${leftSquareY + leftSquareHeight} L ${leftSquareX} ${leftSquareY + leftSquareHeight} Z`}
                fill={bodyGraphics.mainColor || "gray"}
            />
            {/* Left square overlay - top-aligned, half height */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d={`M ${leftSquareX} ${leftSquareY} L ${leftSquareX + leftSquareWidth} ${leftSquareY} L ${leftSquareX + leftSquareWidth} ${leftSquareY + leftSquareHeight / 2} L ${leftSquareX} ${leftSquareY + leftSquareHeight / 2} Z`}
                    fill={bodyGraphics.color}
                />
            )}

            {/* Top fin */}
            {selectedFin.rects.map((rect, index) => (
                <Rect
                    key={`fin-top-${index}`}
                    x={topFinX + rect.x}
                    y={topFinY + rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={bodyGraphics.secondary || "gray"}
                />
            ))}

            {/* Bottom fin - flipped upside down (vertically only) */}
            {selectedBottomFin.rects.map((rect, index) => {
                // Flip vertically: mirror across the center of the fin
                const flippedY = selectedBottomFin.height - rect.y - rect.height;
                return (
                    <Rect
                        key={`fin-bottom-${index}`}
                        x={bottomFinX + rect.x}
                        y={bottomFinY + flippedY}
                        width={rect.width}
                        height={rect.height}
                        fill={bodyGraphics.secondary || "gray"}
                    />
                );
            })}

            {/* Main body box */}
            <Path
                d="M 0 0 L 80 0 L 80 70 L 0 70 Z"
                fill={bodyGraphics.mainColor || "gray"}
            />

            {/* Main body overlay */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d="M 0 0 L 80 0 L 80 35 L 0 35 Z"
                    fill={bodyGraphics.color}
                />
            )}
            {bodyGraphics.pattern === "gills" && (
                <>
                    {/* Gills (10px wide, 40px tall, 10px gap, 10px offset from right) */}
                    <Path
                        d="M 60 5 L 70 5 L 70 45 L 60 45 Z"
                        fill={bodyGraphics.tertiary || "pink"}
                    />
                    <Path
                        d="M 40 5 L 50 5 L 50 45 L 40 45 Z"
                        fill={bodyGraphics.tertiary || "pink"}
                    />
                    <Path
                        d="M 20 5 L 30 5 L 30 45 L 20 45 Z"
                        fill={bodyGraphics.tertiary || "pink"}
                    />
                </>
            )}
            {bodyGraphics.pattern === "stripes" && (
                <>
                    {/* patterns stripes */}
                    <Path
                        d="M 0 0 L 15 0 L 15 70 L 0 70 Z"
                        fill={bodyGraphics.tertiary || "black"}
                    />
                    <Path
                        d="M 35 0 L 50 0 L 50 70 L 35 70 Z"
                        fill={bodyGraphics.tertiary || "black"}
                    />
                    <Path
                        d="M 70 0 L 80 0 L 80 70 L 70 70 Z"
                        fill={bodyGraphics.tertiary || "black"}
                    />
                </>
            )}
            {bodyGraphics.pattern === "dots" && (
                <>
                    {/* Dots */}
                    {[
                        { x: 10, y: 10 },
                        { x: 50, y: 0 },
                        { x: 30, y: 25 },
                        { x: 60, y: 35 },
                        { x: 10, y: 45 },
                        { x: 45, y: 50 },
                    ].map((pos, index) => {
                        const dotSize = 10;
                        return (
                            <Path
                                key={`dot-${index}`}
                                d={`M ${pos.x} ${pos.y} L ${pos.x + dotSize} ${pos.y} L ${pos.x + dotSize} ${pos.y + dotSize} L ${pos.x} ${pos.y + dotSize} Z`}
                                fill={bodyGraphics.tertiary || "black"}
                            />
                        );
                    })}
                </>
            )}
            {bodyGraphics.pattern === "line" && (
                <>
                    {/* Stripe */}
                    <Path
                        d="M 0 30 L 80 30 L 80 40 L 0 40 Z"
                        fill={bodyGraphics.tertiary || "black"}
                    />
                </>
            )}


            {/* Snout*/}
            {selectedSnout.rects.map((rect, index) => (
                <Rect
                    key={`snout-${index}`}
                    x={snoutX + rect.x}
                    y={snoutY + rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={bodyGraphics.mainColor || "gray"}
                />
            ))}

            {/* Snout overlay */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d={`M ${snoutX} ${snoutY} L ${snoutX + selectedSnout.width} ${snoutY} L ${snoutX + selectedSnout.width} ${snoutY + selectedSnout.height / 2} L ${snoutX} ${snoutY + selectedSnout.height / 2} Z`}
                    fill={bodyGraphics.color}
                />
            )}

            {/* face */}
            <Path
                d={`M ${faceX} ${faceY} L ${faceX + faceWidth} ${faceY} L ${faceX + faceWidth} ${faceY + faceHeight} L ${faceX} ${faceY + faceHeight} Z`}
                fill={bodyGraphics.mainColor || "gray"}
            />

            {/* Face overlay */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d={`M ${faceX} ${faceY} L ${faceX + faceWidth} ${faceY} L ${faceX + faceWidth} ${faceY + faceHeight / 2} L ${faceX} ${faceY + faceHeight / 2} Z`}
                    fill={bodyGraphics.color}
                />
            )}

            {/* Eye*/}
            {eyeDefinition.rects.map((rect, index) => {
                const fillColor = index === 0
                    ? (bodyGraphics.eyeColor || "#181818")
                    : rect.fill;
                return (
                    <Rect
                        key={`eye-${index}`}
                        x={eyeX + rect.x}
                        y={eyeY + rect.y}
                        width={rect.width}
                        height={rect.height}
                        fill={fillColor}
                    />
                );
            })}

            {/* Mouth */}
            <Path
                d={`M ${mouthX} ${mouthY} L ${mouthX + mouthWidth} ${mouthY} L ${mouthX + mouthWidth} ${mouthY + mouthHeight} L ${mouthX} ${mouthY + mouthHeight} Z`}
                fill="black"
            />

            {/* Side fin, in the middle of body */}
            {bodyGraphics.sideFin && (
                <Path
                    d={`M ${sideFinX} ${sideFinY} L ${sideFinX + sideFinWidth} ${sideFinY} L ${sideFinX + sideFinWidth} ${sideFinY + sideFinHeight} L ${sideFinX} ${sideFinY + sideFinHeight} Z`}
                    fill={bodyGraphics.secondary || "#3471EC"}
                />
            )}
        </Svg>
    );
}


export function computeFishBounds(schema) {
    const bodyWidth = 80;
    const bodyHeight = 70;

    const sizeWidthMap = { small: 10, medium: 30, long: 50 };
    const leftSquareWidth = sizeWidthMap[schema.size] || 30;

    const fin = FIN_DEFINITIONS[schema.fin];
    const bottomFin = FIN_DEFINITIONS[schema.bottomFin];
    const tail = TAIL_DEFINITIONS[schema.tail];
    const snout = SNOUT_DEFINITIONS[schema.snout];

    const maxX = Math.max(
        bodyWidth,
        bodyWidth + 10,                   // face
        bodyWidth + 10 + 25,              // mouth
        bodyWidth + 10 + 25 + snout.width // snout
    );

    const minX = Math.min(
        0,
        -leftSquareWidth,
        -leftSquareWidth - tail.width
    );

    const maxY = Math.max(
        bodyHeight,
        bodyHeight + bottomFin.height,
        snout.height,
        fin.height
    );

    const minY = Math.min(
        -fin.height,
        0
    );

    return {
        width: maxX - minX,
        height: maxY - minY
    };
}

