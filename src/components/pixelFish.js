// PixelFish.js
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { useState } from "react"


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

// Fin definitions based on images/fins SVG files
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
            { x: 40, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 50 10)
            { x: 30, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 40 10)
            { x: 20, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 30 10)
            { x: 30, y: 0, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 40 0)
            { x: 40, y: 0, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 50 0)
            { x: 50, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 60 10)
            { x: 60, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 70 10)
            { x: 20, y: 0, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 30 0)
            { x: 12, y: 0, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 22 0)
            { x: 10, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 10)
            { x: 0, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 10)
        ]
    }
};

// Tail definitions based on images/tails SVG files
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
            { x: 10, y: 70, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 70)
            { x: 20, y: 60, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 30 60)
            { x: 20, y: 70, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 30 70)
            { x: 0, y: 70, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 70)
            { x: 0, y: 80, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 80)
            { x: 0, y: 90, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 90)
            { x: 0, y: 99, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 99)
            { x: 10, y: 90, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 90)
            { x: 10, y: 10, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 10)
            { x: 0, y: 0, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 0)
            { x: 10, y: 60, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 60)
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
            { x: 10, y: 50, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 50)
            { x: 20, y: 40, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 30 40)
            { x: 0, y: 50, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 10 50)
            { x: 10, y: 40, width: 10, height: 10 }, // transformed: matrix(-1 0 0 1 20 40)
        ]
    }
};

// Snout definitions based on images/snout SVG files
const SNOUT_DEFINITIONS = {
    overhanging: {
        width: 30,
        height: 50,
        rects: [
            { x: 0, y: 10, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 40)
            { x: 10, y: 10, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 40)
            { x: 10, y: 0, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 50)
            { x: 20, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 20 30)
            { x: 20, y: 30, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 20 20)
            { x: 0, y: 0, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 50)
            { x: 0, y: 40, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 10)
            { x: 0, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 30)
            { x: 0, y: 30, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 20)
            { x: 10, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 30)
            { x: 10, y: 30, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 20)
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
            { x: 0, y: 0, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 50)
            { x: 0, y: 30, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 20)
            { x: 0, y: 40, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 10)
            { x: 0, y: 10, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 40)
            { x: 0, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 0 30)
            { x: 10, y: 0, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 50)
            { x: 10, y: 30, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 20)
            { x: 10, y: 10, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 40)
            { x: 10, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 10 30)
            { x: 20, y: 10, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 20 40)
            { x: 20, y: 20, width: 10, height: 10 }, // transformed: matrix(1 0 0 -1 20 30)
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

    // Main body box (80x70)
    const bodyWidth = 80;
    const bodyHeight = 70;

    // Gray face box (10x60), vertically centered, on the right side
    const faceWidth = 10;
    const faceHeight = 60;
    const faceX = bodyWidth; // 80 (outside the body, on the right)
    const faceY = (bodyHeight - faceHeight) / 2; // 5 (centered vertically)

    // Eye definition based on images/eye/eye.svg (18x18)
    const eyeDefinition = {
        width: 18,
        height: 18,
        rects: [
            { x: 0, y: 0, width: 18, height: 18, fill: "#181818" }, // Black background
            { x: 2, y: 3, width: 4, height: 4, fill: "white" }, // White highlight (rounded from 2.3, 2.7, 4.2, 4.2)
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

    // Top fin - based on fin parameter
    const selectedFin = FIN_DEFINITIONS[bodyGraphics.fin] || FIN_DEFINITIONS.flat;
    const topFinX = (bodyWidth - selectedFin.width) / 2; // Centered horizontally
    const topFinY = -selectedFin.height; // Above body

    // Bottom fin - based on bottomFin parameter
    const selectedBottomFin = FIN_DEFINITIONS[bodyGraphics.bottomFin] || FIN_DEFINITIONS.flat;
    const bottomFinX = (bodyWidth - selectedBottomFin.width) / 2; // Centered horizontally
    const bottomFinY = bodyHeight; // Below body

    // Secondary body width based on size parameter
    const sizeWidthMap = {
        small: 10,
        medium: 30,
        long: 50
    };
    const leftSquareWidth = sizeWidthMap[bodyGraphics.size] || sizeWidthMap.medium;
    const leftSquareHeight = 60;
    const leftSquareX = -leftSquareWidth; // Left of body
    const leftSquareY = (bodyHeight - leftSquareHeight) / 2; // Vertically centered

    // Tail - based on tail parameter
    const selectedTail = TAIL_DEFINITIONS[bodyGraphics.tail] || TAIL_DEFINITIONS.truncate;
    const tailX = leftSquareX - selectedTail.width; // Left of left square
    const tailY = (bodyHeight - selectedTail.height) / 2; // Vertically centered

    // Snout - based on snout parameter
    const selectedSnout = SNOUT_DEFINITIONS[bodyGraphics.snout] || SNOUT_DEFINITIONS.slightlyProtruding;
    const snoutX = faceX + faceWidth; // Right of face box
    const snoutY = faceY + (faceHeight - selectedSnout.height) / 2; // Vertically centered with face

    // Side fin - in the middle of body (30px long, 20px tall)
    const sideFinWidth = 30; // 30px long
    const sideFinHeight = 20; // 20px tall
    const sideFinX = bodyWidth - sideFinWidth - 5; // Right aligned inside body, 5px to the left
    const sideFinY = (bodyHeight - sideFinHeight) / 2 + 20; // Vertically centered, 20px lower

    // Calculate viewBox to include face, mouth, snout, side fin, top/bottom fins, left square, and tail
    // Body is always 80x70px, viewBox max is 240x240px


    // Scale SVG dimensions to match viewBox to preserve body size (80x70)





    // ----- BOUNDING BOX CALCULATION -----
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

    // True pixel size of the fish
    const viewBoxWidth = maxX - minX;
    const viewBoxHeight = maxY - minY;

    // If consumer passes width/height, treat them as *display size* (scaled);
    // otherwise use the true pixel size of the fish.
    // Apply scale factor to the final dimensions
    const baseWidth = width ?? viewBoxWidth;
    const baseHeight = height ?? viewBoxHeight;
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

            {/* Body graphics overlay - only in body area (0,0 to 80,70) */}
            {/* Main body overlay (80px wide, 35px tall) - renders underneath stripes, top-aligned */}
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
                    {/* Vertical stripes (15px wide, 70px tall, 20px spacing) */}
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
                    {/* Dots (10x10px) - sporadic pattern with at least 20px spacing, mimicking fish speckles */}
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
                    {/* Single horizontal line through the body (10px tall) */}
                    <Path
                        d="M 0 30 L 80 30 L 80 40 L 0 40 Z"
                        fill={bodyGraphics.tertiary || "black"}
                    />
                </>
            )}


            {/* Snout - based on snout parameter */}
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

            {/* Snout overlay - top half, full width, uses color parameter */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d={`M ${snoutX} ${snoutY} L ${snoutX + selectedSnout.width} ${snoutY} L ${snoutX + selectedSnout.width} ${snoutY + selectedSnout.height / 2} L ${snoutX} ${snoutY + selectedSnout.height / 2} Z`}
                    fill={bodyGraphics.color}
                />
            )}

            {/* Gray face box */}
            <Path
                d={`M ${faceX} ${faceY} L ${faceX + faceWidth} ${faceY} L ${faceX + faceWidth} ${faceY + faceHeight} L ${faceX} ${faceY + faceHeight} Z`}
                fill={bodyGraphics.mainColor || "gray"}
            />

            {/* Face overlay - top half, full width, uses color parameter */}
            {bodyGraphics.colorOverlay && (
                <Path
                    d={`M ${faceX} ${faceY} L ${faceX + faceWidth} ${faceY} L ${faceX + faceWidth} ${faceY + faceHeight / 2} L ${faceX} ${faceY + faceHeight / 2} Z`}
                    fill={bodyGraphics.color}
                />
            )}

            {/* Eye - based on images/eye/Frame 33.svg */}
            {eyeDefinition.rects.map((rect, index) => {
                // First rect (background) uses eyeColor, second rect (highlight) stays white
                const fillColor = index === 0
                    ? (bodyGraphics.eyeColor || "#181818")
                    : rect.fill; // Keep white highlight as white
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

            {/* Mouth (black) */}
            <Path
                d={`M ${mouthX} ${mouthY} L ${mouthX + mouthWidth} ${mouthY} L ${mouthX + mouthWidth} ${mouthY + mouthHeight} L ${mouthX} ${mouthY + mouthHeight} Z`}
                fill="black"
            />

            {/* Side fin - in the middle of body (renders on top) */}
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

