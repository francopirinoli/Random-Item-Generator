/**
 * js/generators/axe_generator.js
 * Contains the logic for procedurally generating axes.
 */

import { getRandomInt, getRandomElement, drawScaledRect, getRandomInRange } from '../utils.js';
import { getPalette, MATERIAL_PALETTES } from '../palettes/material_palettes.js'; // MATERIAL_PALETTES is imported but SHARED_MATERIALS is not

// --- Constants specific to axe generation or drawing ---
const LOGICAL_GRID_WIDTH = 64;
const LOGICAL_GRID_HEIGHT = 64;
const DISPLAY_SCALE = 4;
const CANVAS_WIDTH = LOGICAL_GRID_WIDTH * DISPLAY_SCALE;   // 256
const CANVAS_HEIGHT = LOGICAL_GRID_HEIGHT * DISPLAY_SCALE; // 256
const CANVAS_PADDING_X = 8;
const CANVAS_PADDING_Y = 4;
const MIN_SHAFT_LENGTH = 20;
const MAX_SHAFT_LENGTH = LOGICAL_GRID_HEIGHT - CANVAS_PADDING_Y * 2 - 10; // Max height for shaft considering head and padding
const MIN_BLADE_CONNECTION_WIDTH = 3; // New constant for minimum blade width at connection

// --- Internal helper functions for drawing axe components ---

function drawShaftComponent(ctx, shaftDetails, shaftTopX, shaftTopY) {
    const {
        logicalLength,
        logicalThickness,
        palette, // This palette is now determined by options.haftMaterial
        materialName, // This is shaftPalette.name or shaftPaletteKey from the calling function
        hasPommel,
        pommelPalette,
        pommelShape,
        shaftStyle,
        gripPalette
    } = shaftDetails;

    const shaftDrawX = shaftTopX - Math.floor(logicalThickness / 2);

    // Draw the main shaft
    for (let i = 0; i < logicalLength; i++) {
        const y = shaftTopY + i;
        drawScaledRect(ctx, shaftDrawX, y, logicalThickness, 1, palette.base, DISPLAY_SCALE);
        if (logicalThickness > 1) {
            drawScaledRect(ctx, shaftDrawX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
            drawScaledRect(ctx, shaftDrawX + logicalThickness - 1, y, 1, 1, palette.shadow, DISPLAY_SCALE);
        } else {
            drawScaledRect(ctx, shaftDrawX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
        }
        // Corrected line: Use palette.name directly for checking material type
        const actualMaterialName = (palette?.name || materialName || "").toUpperCase();
        if (actualMaterialName === 'WOOD' && i % getRandomInt(4, 7) === 0 && logicalThickness > 0) {
            const grainX = shaftDrawX + getRandomInt(0, logicalThickness - 1);
            drawScaledRect(ctx, grainX, y, 1, 1, palette.shadow, DISPLAY_SCALE);
        }
    }

    // Apply shaft styles
    if (shaftStyle === 'wrapped_grip' && gripPalette) {
        const gripStartOffset = Math.floor(logicalLength * 0.5);
        const gripLength = logicalLength - gripStartOffset;
        for (let i = 0; i < gripLength; i++) {
            const y = shaftTopY + gripStartOffset + i;
            drawScaledRect(ctx, shaftDrawX, y, logicalThickness, 1, gripPalette.base, DISPLAY_SCALE);
            if (i % 3 === 0) {
                drawScaledRect(ctx, shaftDrawX, y, logicalThickness, 1, gripPalette.shadow, DISPLAY_SCALE);
            } else {
                 if (logicalThickness > 1) {
                    drawScaledRect(ctx, shaftDrawX, y, 1, 1, gripPalette.highlight, DISPLAY_SCALE);
                    drawScaledRect(ctx, shaftDrawX + logicalThickness - 1, y, 1, 1, gripPalette.shadow, DISPLAY_SCALE);
                } else {
                    drawScaledRect(ctx, shaftDrawX, y, 1, 1, gripPalette.highlight, DISPLAY_SCALE);
                }
            }
        }
    } else if (shaftStyle === 'ringed_shaft') {
        const ringPalette = getPalette(getRandomElement(['IRON', 'STEEL', 'BRONZE', 'GOLD']));
        const numRings = getRandomInt(1, 2);
        for (let r = 0; r < numRings; r++) {
            const ringY = shaftTopY + Math.floor(logicalLength * (r === 0 ? 0.25 : 0.75)) -1;
            const ringHeight = getRandomInt(1,2);
            const ringThickness = logicalThickness + 2;
            const ringX = shaftTopX - Math.floor(ringThickness / 2);
            for (let rh = 0; rh < ringHeight; rh++){
                drawScaledRect(ctx, ringX, ringY + rh, ringThickness, 1, ringPalette.base, DISPLAY_SCALE);
                if(rh === 0) drawScaledRect(ctx, ringX, ringY + rh, ringThickness, 1, ringPalette.highlight, DISPLAY_SCALE);
                else drawScaledRect(ctx, ringX, ringY + rh, ringThickness, 1, ringPalette.shadow, DISPLAY_SCALE);
            }
        }
    }

    const shaftBottomY = shaftTopY + logicalLength;
    if (hasPommel && pommelPalette && pommelShape) {
        let pommelHeight = Math.max(1, Math.floor(logicalThickness * 1.5));
        let pommelWidth = logicalThickness + getRandomInt(0,2);
        let pommelX = shaftTopX - Math.floor(pommelWidth / 2);
        const pommelY = shaftBottomY;

        if (pommelShape === 'pointed_pommel') {
            pommelHeight = getRandomInt(3, 5);
            pommelWidth = Math.max(logicalThickness, getRandomInt(logicalThickness, logicalThickness +1));
            for (let i = 0; i < pommelHeight; i++) {
                const targetPointWidth = 1;
                const widthReduction = (pommelWidth - targetPointWidth) * (i / (pommelHeight -1 || 1));
                const currentWidth = Math.max(targetPointWidth, Math.ceil(pommelWidth - widthReduction));
                const currentX = shaftTopX - Math.floor(currentWidth / 2);
                drawScaledRect(ctx, currentX, pommelY + i, currentWidth, 1, pommelPalette.base, DISPLAY_SCALE);
                if(currentWidth > 0) {
                    drawScaledRect(ctx, currentX, pommelY + i, 1,1, pommelPalette.highlight, DISPLAY_SCALE);
                    if(currentWidth > 1) {
                         drawScaledRect(ctx, currentX + currentWidth -1, pommelY + i, 1,1, pommelPalette.shadow, DISPLAY_SCALE);
                    }
                }
            }
        } else if (pommelShape === 'flared_pommel') {
            pommelHeight = getRandomInt(2,3);
            const flareAmount = getRandomInt(1,2);
            for (let i=0; i<pommelHeight; i++) {
                const currentWidth = logicalThickness + (i === pommelHeight -1 ? flareAmount * 2 : flareAmount);
                const currentX = shaftTopX - Math.floor(currentWidth / 2);
                drawScaledRect(ctx, currentX, pommelY + i, currentWidth, 1, pommelPalette.base, DISPLAY_SCALE);
                if(i === 0 && pommelHeight > 1) drawScaledRect(ctx, currentX, pommelY+i, currentWidth, 1, pommelPalette.highlight, DISPLAY_SCALE);
                else if (i > 0 || pommelHeight === 1) drawScaledRect(ctx, currentX, pommelY+i, currentWidth, 1, pommelPalette.shadow, DISPLAY_SCALE);
            }
        } else if (pommelShape === 'round' || pommelShape === 'disc') {
             pommelHeight = pommelWidth = Math.max(MIN_BLADE_CONNECTION_WIDTH, logicalThickness + getRandomInt(1,3));
             pommelX = shaftTopX - Math.floor(pommelWidth / 2);
             const radius = Math.floor(pommelWidth / 2);
             for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    if (dx * dx + dy * dy <= radius * radius) {
                        drawScaledRect(ctx, pommelX + radius + dx, pommelY + radius + dy, 1, 1, pommelPalette.base, DISPLAY_SCALE);
                         if (dx*dx + dy*dy > (radius-1)*(radius-1) ) {
                            if (dy < 0 || (dy===0 && dx <0)) drawScaledRect(ctx, pommelX + radius + dx, pommelY + radius + dy, 1, 1, pommelPalette.highlight, DISPLAY_SCALE);
                            else drawScaledRect(ctx, pommelX + radius + dx, pommelY + radius + dy, 1, 1, pommelPalette.shadow, DISPLAY_SCALE);
                        }
                    }
                }
            }
        } else { // square, finial (treated as square)
            pommelWidth = Math.max(MIN_BLADE_CONNECTION_WIDTH, logicalThickness + getRandomInt(0,2));
            pommelHeight = Math.max(1, Math.floor(pommelWidth * getRandomInRange(0.5, 1.0)));
            pommelX = shaftTopX - Math.floor(pommelWidth / 2);

            drawScaledRect(ctx, pommelX, pommelY, pommelWidth, pommelHeight, pommelPalette.base, DISPLAY_SCALE);
            if (pommelHeight > 0) drawScaledRect(ctx, pommelX, pommelY + pommelHeight -1, pommelWidth, 1, pommelPalette.shadow, DISPLAY_SCALE);
            if (pommelWidth > 1 && pommelHeight > 1) {
                drawScaledRect(ctx, pommelX, pommelY, 1, pommelHeight -1, pommelPalette.highlight, DISPLAY_SCALE);
                drawScaledRect(ctx, pommelX + pommelWidth -1, pommelY, 1, pommelHeight-1, pommelPalette.shadow, DISPLAY_SCALE);
            }
             if (pommelHeight > 0) drawScaledRect(ctx, pommelX, pommelY, pommelWidth, 1, pommelPalette.highlight, DISPLAY_SCALE);
        }
    }
    return { bottomY: shaftBottomY, actualThickness: logicalThickness, pommelShapeUsed: pommelShape };
}

function drawSingleBlade(ctx, bladeDetails, socketCenterX, socketCenterY, shaftThickness, side) {
    const {
        bladeShape,
        cuttingEdgeProfile,
        cuttingEdgeCurveIntensity,
        bladeLength, // Max reach of cutting edge from shaft centerline
        bladeHeight,
        palette, // This is the headPalette
        hasSpikePoll, spikeLength
    } = bladeDetails;

    const bladeBaseColor = palette.base;
    const bladeHighlightColor = palette.highlight;
    const bladeShadowColor = palette.shadow;

    const bladeMinY = socketCenterY - Math.floor(bladeHeight / 2);
    const bladeMaxY = socketCenterY + Math.ceil(bladeHeight / 2) - 1;
    const bladeStartWidthAtShaftConnection = getRandomInt(MIN_BLADE_CONNECTION_WIDTH, MIN_BLADE_CONNECTION_WIDTH + 1);


    for (let y = bladeMinY; y <= bladeMaxY; y++) {
        const verticalProgress = (bladeHeight <= 1) ? 0.5 : (y - bladeMinY) / (bladeHeight - 1);
        const distanceFromCenter = Math.abs(verticalProgress - 0.5) * 2; // 0 at center, 1 at ends

        let taperExponent;
        if (bladeShape === 'flared') {
            taperExponent = 0.6; // Less tapering, wider at ends
        } else if (bladeShape === 'pointed_taper') {
            taperExponent = 1.7; // More tapering, narrower at ends
        } else { // 'expanding_straight'
            taperExponent = 1.0; // Linear expansion
        }

        const expansionProgress = 1.0 - Math.pow(distanceFromCenter, taperExponent);
        let horizontalReachProfile = bladeStartWidthAtShaftConnection + (bladeLength - bladeStartWidthAtShaftConnection) * expansionProgress;

        let modifiedHorizontalReach = horizontalReachProfile;
        if (cuttingEdgeProfile === 'convex_edge') {
            const curveFactor = 1.0 - distanceFromCenter;
            const convexity = Math.floor(bladeLength * 0.15 * curveFactor * cuttingEdgeCurveIntensity);
            modifiedHorizontalReach += convexity;
        } else if (cuttingEdgeProfile === 'concave_edge') {
            const curveFactor = 1.0 - distanceFromCenter;
            const concavity = Math.floor(bladeLength * 0.20 * curveFactor * cuttingEdgeCurveIntensity);
            modifiedHorizontalReach -= concavity;
        }
        modifiedHorizontalReach = Math.max(bladeStartWidthAtShaftConnection, Math.floor(modifiedHorizontalReach));

        if (bladeShape === 'bearded' && verticalProgress > 0.5) { // Beard on the "bottom" half
            const beardProgress = (verticalProgress - 0.5) / (0.5 || 0.01);
            const beardBonus = Math.floor(bladeLength * 0.30 * Math.sin(beardProgress * Math.PI * 0.9));
            modifiedHorizontalReach = Math.min(bladeLength * 1.25, modifiedHorizontalReach + beardBonus);
            modifiedHorizontalReach = Math.max(bladeStartWidthAtShaftConnection, Math.floor(modifiedHorizontalReach));
        }

        const currentSegmentLength = Math.max(MIN_BLADE_CONNECTION_WIDTH, Math.floor(modifiedHorizontalReach));

        for (let x_on_segment = 0; x_on_segment < currentSegmentLength; x_on_segment++) {
            const x_offset_from_shaft_edge = (bladeLength - currentSegmentLength) + x_on_segment;
            const currentX = socketCenterX + (side * (Math.floor(shaftThickness / 2) + x_offset_from_shaft_edge));

            if (currentX < 0 || currentX >= LOGICAL_GRID_WIDTH || y < 0 || y >= LOGICAL_GRID_HEIGHT) continue;

            let color = bladeBaseColor;
            const isCuttingEdgePixel = x_on_segment >= currentSegmentLength - 1 && currentSegmentLength > 0;

            if (isCuttingEdgePixel) {
                color = bladeHighlightColor;
            } else if (y === bladeMinY && x_on_segment < currentSegmentLength * 0.85) { // Top edge
                color = bladeHighlightColor;
            } else if (y === bladeMaxY && bladeHeight > 1 && x_on_segment < currentSegmentLength * 0.85) { // Bottom edge
                color = bladeShadowColor;
            } else if (x_on_segment < Math.max(MIN_BLADE_CONNECTION_WIDTH, Math.floor(currentSegmentLength * 0.2))) { // Near shaft
                 color = palette.shadow;
            }
            drawScaledRect(ctx, currentX, y, 1, 1, color, DISPLAY_SCALE);
        }
    }

    // Spike Poll
    if (hasSpikePoll && spikeLength > 0) {
        const pollSide = -side; // Opposite side of the main blade
        const pollSocketEdgeX = socketCenterX + (pollSide * Math.floor(shaftThickness / 2));
        const pollHeight = Math.max(1, Math.floor(shaftThickness * 1.2)); // Height of the spike base

        for (let l = 0; l < spikeLength; l++) {
            const spikeX = (pollSide === -1) ? pollSocketEdgeX - 1 - l : pollSocketEdgeX + 1 + l;
            const taperProgressPoll = l / (spikeLength -1 || 1);
            const currentSpikeHeight = Math.max(1, Math.round(pollHeight * (1 - taperProgressPoll * 0.5))); // Spike tapers
            const currentSpikeY = socketCenterY - Math.floor(currentSpikeHeight / 2);

            for(let h_off = 0; h_off < currentSpikeHeight; h_off++){
                 drawScaledRect(ctx, spikeX, currentSpikeY + h_off, 1, 1, palette.base, DISPLAY_SCALE);
                 if (h_off === 0) drawScaledRect(ctx, spikeX, currentSpikeY + h_off, 1, 1, palette.highlight, DISPLAY_SCALE);
                 if (h_off === currentSpikeHeight -1 && currentSpikeHeight > 1) drawScaledRect(ctx, spikeX, currentSpikeY + h_off, 1, 1, palette.shadow, DISPLAY_SCALE);
            }
        }
    }
}


function drawAxeHeadComponent(ctx, headDetails, shaftTopX, shaftTopY, shaftThickness) {
    const { axeType, bladeShape, bladeLength, bladeHeight, palette, hasSpikePoll, spikeLength, cuttingEdgeProfile, cuttingEdgeCurveIntensity } = headDetails;
    const socketCenterY = shaftTopY + Math.floor(bladeHeight * 0.1);

    const bladeSpecificDetails = { ...headDetails };

    if (axeType === 'single_blade_battleaxe' || axeType === 'hand_axe') {
        const side = getRandomElement([-1, 1]);
        drawSingleBlade(ctx, bladeSpecificDetails, shaftTopX, socketCenterY, shaftThickness, side);
    } else if (axeType === 'double_blade_axe') {
        drawSingleBlade(ctx, { ...bladeSpecificDetails, hasSpikePoll: false }, shaftTopX, socketCenterY, shaftThickness, -1);
        drawSingleBlade(ctx, { ...bladeSpecificDetails, hasSpikePoll: false }, shaftTopX, socketCenterY, shaftThickness, 1);
    }

    const visualSocketHeight = Math.max(3, Math.floor(shaftThickness * 1.7 + bladeHeight * 0.1));
    const visualSocketWidth = shaftThickness + 3;
    const visualSocketX = shaftTopX - Math.floor(visualSocketWidth/2);
    const visualSocketActualY = socketCenterY - Math.floor(visualSocketHeight/2);

    drawScaledRect(ctx, visualSocketX, visualSocketActualY, visualSocketWidth, visualSocketHeight, palette.shadow, DISPLAY_SCALE);
    drawScaledRect(ctx, visualSocketX, visualSocketActualY, visualSocketWidth, 1, palette.base, DISPLAY_SCALE);
    drawScaledRect(ctx, visualSocketX, visualSocketActualY + visualSocketHeight -1, visualSocketWidth, 1, palette.base, DISPLAY_SCALE);
    if(visualSocketWidth > 1){
        drawScaledRect(ctx, visualSocketX, visualSocketActualY + 1, 1, visualSocketHeight - 2, palette.highlight, DISPLAY_SCALE);
        drawScaledRect(ctx, visualSocketX + visualSocketWidth -1, visualSocketActualY + 1, 1, visualSocketHeight - 2, palette.base, DISPLAY_SCALE);
    }
    if (visualSocketWidth > 2 && visualSocketHeight > 2) {
        drawScaledRect(ctx, visualSocketX + 1, visualSocketActualY + 1, visualSocketWidth - 2, visualSocketHeight - 2, palette.base, DISPLAY_SCALE);
    }
}

/**
 * Generates a procedural axe.
 * @param {object} options - Options for generation.
 * options.subType: "hand_axe", "battle_axe", "double_axe" (maps to internal axeType)
 * options.material: Palette key for the axe HEAD (e.g., "STEEL")
 * options.haftMaterial: Palette key for the axe HAFT (e.g., "WOOD")
 */
export function generateAxe(options = {}) {
    console.log("generateAxe (Pixel Art) called with options:", options);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = CANVAS_WIDTH;
    offscreenCanvas.height = CANVAS_HEIGHT;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context for offscreen canvas in generateAxe.");
        return { type: 'axe', name: 'Error Axe', seed: Date.now(), itemData: { error: "Canvas context failed" }, imageDataUrl: createErrorDataURL("CTX Fail") };
    }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Determine axeType based on options.subType (from RPG item generator)
    let axeType;
    if (options.subType === 'hand_axe') {
        axeType = 'hand_axe';
    } else if (options.subType === 'battle_axe') {
        axeType = 'single_blade_battleaxe';
    } else if (options.subType === 'double_axe' || options.subType === 'double_blade_axe') { // Accept both for flexibility
        axeType = 'double_blade_axe';
    } else {
        axeType = getRandomElement(['hand_axe', 'single_blade_battleaxe', 'double_blade_axe']);
        console.warn(`Pixel Art Axe: Unknown subType '${options.subType}'. Defaulting to random art type: ${axeType}`);
    }

    // Use provided materials or pick random ones as fallback
    const headPaletteKey = options.material || getRandomElement(['STEEL', 'IRON', 'DARK_STEEL']);
    const headPalette = getPalette(headPaletteKey);
    if (!headPalette) {
        console.error(`Pixel Art Axe: Head palette for key "${headPaletteKey}" not found. Defaulting.`);
        headPalette = getPalette("STEEL");
    }

    const shaftPaletteKey = options.haftMaterial || getRandomElement(['WOOD', 'DARK_STEEL']);
    const shaftPalette = getPalette(shaftPaletteKey);
     if (!shaftPalette) {
        console.error(`Pixel Art Axe: Shaft palette for key "${shaftPaletteKey}" not found. Defaulting.`);
        shaftPalette = getPalette("WOOD");
    }
    const shaftMaterialNameForArt = shaftPalette.name || shaftPaletteKey; // For grain effect


    const shaftLogicalThickness = getRandomInt(2, 3);

    const shaftStyles = ['plain', 'wrapped_grip', 'ringed_shaft'];
    const shaftStyle = getRandomElement(shaftStyles);
    let gripPalette = null;
    if (shaftStyle === 'wrapped_grip') {
        const gripMaterials = ['LEATHER', 'DARK_STEEL', 'IRON']; // These are palette keys
        gripPalette = getPalette(getRandomElement(gripMaterials));
    }

    const hasPommel = Math.random() < 0.75;
    const pommelShapes = ['round', 'square', 'disc', 'finial', 'pointed_pommel', 'flared_pommel'];
    const pommelShape = hasPommel ? getRandomElement(pommelShapes) : null;
    const pommelPalette = hasPommel ? getPalette(getRandomElement(['IRON', 'STEEL', 'BRONZE', shaftPaletteKey, 'GOLD'])) : null;


    const bladeShapes = ['expanding_straight', 'bearded', 'flared', 'pointed_taper'];
    const bladeShape = getRandomElement(bladeShapes);

    const cuttingEdgeProfiles = ['straight_edge', 'convex_edge', 'concave_edge'];
    const cuttingEdgeProfile = getRandomElement(cuttingEdgeProfiles);
    const cuttingEdgeCurveIntensity = getRandomInRange(0.25, 0.85);
    const socketWidthRatio = getRandomInRange(0.10, 0.25);

    let bladeLength, bladeHeight, shaftLogicalLength;
    let hasSpikePoll = false;
    let spikeLength = 0;

    if (axeType === 'hand_axe') {
        shaftLogicalLength = getRandomInt(MIN_SHAFT_LENGTH, Math.floor(MAX_SHAFT_LENGTH * 0.60));
        bladeLength = getRandomInt(Math.floor(LOGICAL_GRID_WIDTH * 0.18), Math.floor(LOGICAL_GRID_WIDTH * 0.25));
        bladeHeight = getRandomInt(Math.floor(bladeLength * 0.7), Math.floor(bladeLength * 1.2));
        if (Math.random() < 0.4) {
            hasSpikePoll = true;
            spikeLength = getRandomInt(Math.floor(bladeLength * 0.30), Math.floor(bladeLength * 0.60));
        }
    } else if (axeType === 'single_blade_battleaxe') {
        shaftLogicalLength = getRandomInt(Math.floor(MAX_SHAFT_LENGTH * 0.75), MAX_SHAFT_LENGTH);
        bladeLength = getRandomInt(Math.floor(LOGICAL_GRID_WIDTH * 0.25), Math.floor(LOGICAL_GRID_WIDTH * 0.4));
        bladeHeight = getRandomInt(Math.floor(bladeLength * 0.6), Math.floor(bladeLength * 1.10));
         if (Math.random() < 0.6) {
            hasSpikePoll = true;
            spikeLength = getRandomInt(Math.floor(bladeLength * 0.4), Math.floor(bladeLength * 0.8));
        }
    } else { // double_blade_axe
        shaftLogicalLength = getRandomInt(Math.floor(MAX_SHAFT_LENGTH * 0.70), MAX_SHAFT_LENGTH - 2);
        bladeLength = getRandomInt(Math.floor(LOGICAL_GRID_WIDTH * 0.22), Math.floor(LOGICAL_GRID_WIDTH * 0.35));
        bladeHeight = getRandomInt(Math.floor(bladeLength * 0.75), Math.floor(bladeLength * 1.20));
        hasSpikePoll = false;
    }
    bladeLength = Math.max(8, bladeLength);
    bladeHeight = Math.max(10, bladeHeight);


    const totalVisualHeight = shaftLogicalLength + bladeHeight * 0.15;
    const axeCenterY = Math.floor(LOGICAL_GRID_HEIGHT / 2);
    const axeTopVisualY = axeCenterY - Math.floor(totalVisualHeight / 2);

    const shaftTopActualY = axeTopVisualY + Math.floor(bladeHeight * 0.05);
    const shaftTopX = Math.floor(LOGICAL_GRID_WIDTH / 2);

    const shaftDetails = {
        logicalLength: shaftLogicalLength,
        logicalThickness: shaftLogicalThickness,
        palette: shaftPalette,
        materialName: shaftMaterialNameForArt, // Use the resolved name for art details
        hasPommel,
        pommelPalette,
        pommelShape,
        shaftStyle,
        gripPalette
    };
    const shaftRenderData = drawShaftComponent(ctx, shaftDetails, shaftTopX, shaftTopActualY);

    const headDetailsToDraw = {
        axeType,
        bladeShape,
        cuttingEdgeProfile,
        cuttingEdgeCurveIntensity,
        bladeLength,
        bladeHeight,
        socketWidthRatio,
        palette: headPalette,
        hasSpikePoll: axeType !== 'double_blade_axe' ? hasSpikePoll : false,
        spikeLength: axeType !== 'double_blade_axe' ? spikeLength : 0,
    };
    drawAxeHeadComponent(ctx, headDetailsToDraw, shaftTopX, shaftTopActualY, shaftLogicalThickness);

    let itemName = `${headPalette.name} ${bladeShape.replace('_', ' ')}`;
    if (cuttingEdgeProfile !== 'straight_edge') {
        itemName += ` (${cuttingEdgeProfile.replace('_','')} edge)`;
    }
    itemName += ` ${axeType.replace(/_/g, ' ')}`;

    if (shaftStyle !== 'plain') {
        itemName += ` with ${shaftStyle.replace('_', ' ')}`;
    }
    if (pommelShape) {
        itemName += ` and ${pommelShape.replace('_','')} pommel`;
    }
    if (headDetailsToDraw.hasSpikePoll && headDetailsToDraw.spikeLength > 0) itemName += ` with Spike Poll`;
    itemName += ` (Shaft: ${shaftPalette.name})`;


    const itemSeed = options.seed || Date.now();

    const generatedItemData = {
        type: 'axe', // This is the pixel art type, RPG item will use its own category
        name: itemName, // Name generated by pixel art generator
        seed: itemSeed,
        itemData: { // Data relevant for RPG item generator or description
            visualTheme: `${headPalette.name} ${axeType.replace(/_/g, ' ')}`,
            shaft: {
                material: shaftPaletteKey, // Store the key
                style: shaftStyle,
                pommelShape: shaftRenderData.pommelShapeUsed,
            },
            head: {
                material: headPaletteKey, // Store the key
                axeType: axeType, // The specific art style used
                bladeShape: bladeShape,
                cuttingEdgeProfile: cuttingEdgeProfile,
                hasSpikePoll: headDetailsToDraw.hasSpikePoll,
            }
        },
        imageDataUrl: offscreenCanvas.toDataURL()
    };

    console.log("Pixel Art Axe generated:", generatedItemData.name);
    return generatedItemData;
}

function createErrorDataURL(message = "ERR") {
    const errorCanvas = document.createElement('canvas');
    errorCanvas.width = CANVAS_WIDTH; errorCanvas.height = CANVAS_HEIGHT;
    const ctx = errorCanvas.getContext('2d');
    if (ctx) {
        ctx.imageSmoothingEnabled = false; ctx.fillStyle = 'rgba(255,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const fontSize = Math.floor(CANVAS_WIDTH / 12);
        ctx.font = `bold ${fontSize}px sans-serif`; ctx.fillStyle = 'white';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        try { return errorCanvas.toDataURL(); } catch (e) { console.error("Error converting error canvas to Data URL:", e); }
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACNJREFUOI1jZGRgYPgPykCATQIKyMBKjEwM0AAGsAFJVMQvAgADqgH5kG3fXAAAAABJRU5ErkJggg==";
}

console.log("js/generators/axe_generator.js (Pixel Art - Material Fix) loaded.");
