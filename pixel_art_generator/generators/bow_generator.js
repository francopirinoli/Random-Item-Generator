import { getRandomInt, getRandomElement, drawScaledRect, getRandomInRange } from '../utils.js';
import { getPalette, MATERIAL_PALETTES } from '../palettes/material_palettes.js';

// --- Constants specific to bow generation or drawing ---
const LOGICAL_GRID_WIDTH = 64;
const LOGICAL_GRID_HEIGHT = 64;
const DISPLAY_SCALE = 4;
const CANVAS_WIDTH = LOGICAL_GRID_WIDTH * DISPLAY_SCALE;   // 256
const CANVAS_HEIGHT = LOGICAL_GRID_HEIGHT * DISPLAY_SCALE; // 256
const CANVAS_PADDING = 4;
const ARROW_OFFSET_X = 10; // How far to the right of the bow to draw the arrow

// --- Internal helper functions for drawing bow components ---

function drawBowLimbs(ctx, limbDetails, centerX, centerY, orientation = 'vertical') {
    const {
        type, // 'longbow', 'shortbow', 'recurve'
        logicalLength,
        maxCurve,
        limbThickness,
        palette, // This is now the mainPalette for limbs, passed in
        tipStyle // 'simple', 'nocked'
    } = limbDetails;

    const halfLength = Math.floor(logicalLength / 2);
    if (halfLength <= 0) return; 

    const limbBaseColor = palette.base;
    const limbHighlightColor = palette.highlight;
    const limbShadowColor = palette.shadow;

    for (let yCurrent = centerY - halfLength; yCurrent <= centerY + halfLength; yCurrent++) {
        const normalizedYDistFromCenter = Math.abs(yCurrent - centerY) / halfLength; 
        let curveFactor = Math.sqrt(1 - Math.pow(normalizedYDistFromCenter, 2)); 
        let xOffset = Math.floor(maxCurve * curveFactor);
        
        if (type === 'recurve') {
            const recurveStartProgress = 0.7; 
            if (normalizedYDistFromCenter > recurveStartProgress) {
                const recurveProgress = (normalizedYDistFromCenter - recurveStartProgress) / (1 - recurveStartProgress);
                xOffset -= Math.floor(maxCurve * 0.5 * Math.sin(recurveProgress * Math.PI)); 
            }
        }
        
        let currentThickness = limbThickness;
        if (type !== 'longbow_straight') { 
             currentThickness = Math.max(1, Math.ceil(limbThickness * (1 - normalizedYDistFromCenter * 0.85))); 
        }

        if (normalizedYDistFromCenter > 0.95) { 
            xOffset = Math.max(0, xOffset -1); 
            if (type !== 'recurve') { 
                 xOffset = Math.floor(currentThickness / 2); 
            }
        }
        
        const startX = centerX - xOffset - Math.floor(currentThickness / 2);

        if (currentThickness === 1) {
            drawScaledRect(ctx, startX, yCurrent, 1, 1, limbBaseColor, DISPLAY_SCALE);
        } else { 
            drawScaledRect(ctx, startX, yCurrent, 1, 1, limbHighlightColor, DISPLAY_SCALE); 
            drawScaledRect(ctx, startX + currentThickness - 1, yCurrent, 1, 1, limbShadowColor, DISPLAY_SCALE); 
            if (currentThickness > 2) { 
                drawScaledRect(ctx, startX + 1, yCurrent, currentThickness - 2, 1, limbBaseColor, DISPLAY_SCALE);
            }
        }
    }
    
    const tipBaseThickness = Math.max(1, Math.ceil(limbThickness * (1 - 1.0 * 0.85))); 
    const tipVisualWidth = tipBaseThickness + (tipStyle === 'nocked' ? 2 : 1); 
    const tipVisualHeight = tipStyle === 'nocked' ? 3 : 2; 

    const topTipY = centerY - halfLength;
    const topTipDrawX = centerX - Math.floor(tipVisualWidth / 2); 
    const topTipDrawY = topTipY - Math.floor(tipVisualHeight / 2);

    if (tipStyle === 'nocked') {
        drawScaledRect(ctx, topTipDrawX, topTipDrawY, 1, tipVisualHeight, palette.outline || limbShadowColor, DISPLAY_SCALE); 
        drawScaledRect(ctx, topTipDrawX + tipVisualWidth - 1, topTipDrawY, 1, tipVisualHeight, palette.outline || limbShadowColor, DISPLAY_SCALE); 
        if (tipVisualWidth > 2) { 
             drawScaledRect(ctx, topTipDrawX + 1, topTipDrawY, tipVisualWidth - 2, 1, palette.base, DISPLAY_SCALE); 
             drawScaledRect(ctx, topTipDrawX + 1, topTipDrawY + tipVisualHeight -1 , tipVisualWidth - 2, 1, palette.base, DISPLAY_SCALE); 
        }
    } else { 
        drawScaledRect(ctx, topTipDrawX, topTipDrawY, tipVisualWidth, tipVisualHeight, palette.shadow, DISPLAY_SCALE);
    }

    const bottomTipY = centerY + halfLength;
    const bottomTipDrawX = centerX - Math.floor(tipVisualWidth / 2);
    const bottomTipDrawY = bottomTipY - Math.floor(tipVisualHeight / 2) + (tipVisualHeight > 1 && tipStyle !== 'nocked' ? 1:0); 

    if (tipStyle === 'nocked') {
        drawScaledRect(ctx, bottomTipDrawX, bottomTipDrawY, 1, tipVisualHeight, palette.outline || limbShadowColor, DISPLAY_SCALE);
        drawScaledRect(ctx, bottomTipDrawX + tipVisualWidth - 1, bottomTipDrawY, 1, tipVisualHeight, palette.outline || limbShadowColor, DISPLAY_SCALE);
        if (tipVisualWidth > 2) {
            drawScaledRect(ctx, bottomTipDrawX + 1, bottomTipDrawY, tipVisualWidth - 2, 1, palette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, bottomTipDrawX + 1, bottomTipDrawY + tipVisualHeight -1, tipVisualWidth - 2, 1, palette.base, DISPLAY_SCALE);
        }
    } else { 
        drawScaledRect(ctx, bottomTipDrawX, bottomTipDrawY, tipVisualWidth, tipVisualHeight, palette.shadow, DISPLAY_SCALE);
    }
}

function drawBowGrip(ctx, gripDetails, centerX, centerY) {
    const {
        logicalLength,
        logicalThickness,
        palette, // This is now the gripPalette passed in
        hasWrapping, // This might be determined by RPG gen or internally if grip material implies wrapping
        wrappingPalette // This would be the same as palette if gripMaterial implies wrapping
    } = gripDetails;

    const gripStartY = centerY - Math.floor(logicalLength / 2);
    const gripDrawX = centerX - Math.floor(logicalThickness / 2);

    // Determine if the grip material inherently implies wrapping
    const actualHasWrapping = hasWrapping || (palette.name && (palette.name.toLowerCase().includes('leather') || palette.name.toLowerCase().includes('cloth')));
    const actualWrappingPalette = actualHasWrapping ? palette : null; // If it's a wrap material, use its own palette for wrap effect

    for (let i = 0; i < logicalLength; i++) {
        const y = gripStartY + i;
        let mainColor = palette.base;
        let highColor = palette.highlight;
        let shadColor = palette.shadow;

        if (actualHasWrapping && actualWrappingPalette) { // Use the grip's own palette for wrap effect
            mainColor = actualWrappingPalette.base;
            highColor = actualWrappingPalette.highlight;
            shadColor = actualWrappingPalette.shadow;
        }

        drawScaledRect(ctx, gripDrawX, y, logicalThickness, 1, mainColor, DISPLAY_SCALE);
        if (actualHasWrapping && i % 2 === 0) {
            drawScaledRect(ctx, gripDrawX, y, logicalThickness, 1, shadColor, DISPLAY_SCALE);
        } else {
            if (logicalThickness > 1) {
                drawScaledRect(ctx, gripDrawX, y, 1, 1, highColor, DISPLAY_SCALE);
                drawScaledRect(ctx, gripDrawX + logicalThickness - 1, y, 1, 1, shadColor, DISPLAY_SCALE);
            } else {
                 drawScaledRect(ctx, gripDrawX, y, 1, 1, highColor, DISPLAY_SCALE);
            }
        }
    }
}

function drawBowString(ctx, stringDetails, bowCenterY, bowHalfLength, stringDrawX) {
    const { palette, thickness } = stringDetails; // Palette is now passed in
    const stringColor = palette.base;

    const topStringY = bowCenterY - bowHalfLength;
    const bottomStringY = bowCenterY + bowHalfLength;

    for (let y = topStringY; y <= bottomStringY; y++) {
        drawScaledRect(ctx, stringDrawX - Math.floor(thickness / 2), y, thickness, 1, stringColor, DISPLAY_SCALE);
    }

    const nockingPointY = bowCenterY;
    const nockWidth = thickness + 2; 
    const nockX = stringDrawX - Math.floor(nockWidth / 2);
    drawScaledRect(ctx, nockX, nockingPointY - 1, nockWidth, 3, palette.shadow, DISPLAY_SCALE);
}

function drawArrow(ctx, arrowDetails, startX, startY) {
    const { shaftLength, shaftPalette, arrowheadShape, arrowheadPalette, fletchingStyle, fletchingPalette } = arrowDetails;
    const shaftThickness = 1;

    for (let i = 0; i < shaftLength; i++) {
        drawScaledRect(ctx, startX, startY + i, shaftThickness, 1, shaftPalette.base, DISPLAY_SCALE);
        if (i % 5 === 0) { 
             drawScaledRect(ctx, startX, startY + i, shaftThickness, 1, shaftPalette.highlight, DISPLAY_SCALE);
        }
    }

    const arrowheadLength = getRandomInt(3, 5);
    const arrowheadWidth = getRandomInt(2, 3); 
    const arrowheadBaseY = startY;

    if (arrowheadShape === 'triangle') {
        for (let i = 0; i < arrowheadLength; i++) {
            const currentWidth = Math.max(1, Math.ceil(arrowheadWidth * (1 - i / (arrowheadLength -1 || 1) ) ) );
            const currentX = startX + Math.floor(shaftThickness/2) - Math.floor(currentWidth / 2);
            drawScaledRect(ctx, currentX, arrowheadBaseY - arrowheadLength + i, currentWidth, 1, arrowheadPalette.base, DISPLAY_SCALE);
            if (i === 0 && currentWidth > 0) { 
                 drawScaledRect(ctx, currentX + Math.floor(currentWidth/2), arrowheadBaseY - arrowheadLength + i, 1, 1, arrowheadPalette.highlight, DISPLAY_SCALE);
            }
        }
    } else if (arrowheadShape === 'leaf') {
        for (let i = 0; i < arrowheadLength; i++) {
            const progress = i / (arrowheadLength -1 || 1);
            const currentWidth = Math.max(1, Math.ceil(arrowheadWidth * Math.sin(progress * Math.PI))); 
            const currentX = startX + Math.floor(shaftThickness/2) - Math.floor(currentWidth / 2);
            drawScaledRect(ctx, currentX, arrowheadBaseY - arrowheadLength + i, currentWidth, 1, arrowheadPalette.base, DISPLAY_SCALE);
             if (i < Math.floor(arrowheadLength/2) && currentWidth > 0) {
                 drawScaledRect(ctx, currentX, arrowheadBaseY - arrowheadLength + i, 1, 1, arrowheadPalette.highlight, DISPLAY_SCALE);
             }
        }
    } 

    const fletchingLength = getRandomInt(5, 8);
    const fletchingStartY = startY + shaftLength - fletchingLength;
    const fletchingWidthPerSide = getRandomInt(1, 2); 

    if (fletchingStyle === 'classic_angled') {
        for (let i = 0; i < fletchingLength; i++) {
            const angleOffset = Math.floor(i * 0.3); 
            drawScaledRect(ctx, startX - fletchingWidthPerSide + angleOffset, fletchingStartY + i, fletchingWidthPerSide, 1, fletchingPalette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, startX + shaftThickness - angleOffset, fletchingStartY + i, fletchingWidthPerSide, 1, fletchingPalette.base, DISPLAY_SCALE);
        }
    } else { 
         for (let i = 0; i < fletchingLength; i++) {
            drawScaledRect(ctx, startX - fletchingWidthPerSide, fletchingStartY + i, fletchingWidthPerSide, 1, fletchingPalette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, startX + shaftThickness, fletchingStartY + i, fletchingWidthPerSide, 1, fletchingPalette.base, DISPLAY_SCALE);
        }
    }
}

/**
 * Generates a procedural bow.
 * @param {object} options - Options for generation.
 * options.subType: "longbow", "shortbow", "recurve"
 * options.material: Palette key for the bow LIMBS (e.g., "WOOD")
 * options.gripMaterial: Palette key for the GRIP (e.g., "LEATHER")
 * options.stringMaterial: Palette key for the STRING (e.g., "SILK_STRING")
 */
export function generateBow(options = {}) {
    console.log("generateBow (Pixel Art) called with options:", options);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = CANVAS_WIDTH;
    offscreenCanvas.height = CANVAS_HEIGHT;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context for offscreen canvas in generateBow.");
        return { type: 'bow', name: 'Error Bow', seed: Date.now(), itemData: { error: "Canvas context failed" }, imageDataUrl: createErrorDataURL("CTX Fail") };
    }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let bowType;
    const defaultBowTypes = ['longbow', 'shortbow', 'recurve'];
    if (options.subType && defaultBowTypes.includes(options.subType)) {
        bowType = options.subType;
    } else {
        bowType = getRandomElement(defaultBowTypes);
        if (options.subType) console.warn(`Pixel Art Bow: Unknown subType '${options.subType}'. Defaulting to random: ${bowType}`);
    }

    // Use provided materials or pick random ones as fallback
    const limbPaletteKey = options.material || getRandomElement(['WOOD', 'BONE', 'DARK_STEEL']);
    let mainPalette = getPalette(limbPaletteKey);
    if (!mainPalette) { mainPalette = getPalette("WOOD"); console.warn(`Limb palette for ${limbPaletteKey} not found, used WOOD.`);}

    const gripPaletteKey = options.gripMaterial || getRandomElement(['LEATHER', 'CLOTH']);
    let gripPalette = getPalette(gripPaletteKey);
    if (!gripPalette) { gripPalette = getPalette("LEATHER"); console.warn(`Grip palette for ${gripPaletteKey} not found, used LEATHER.`);}
    
    const stringPaletteKey = options.stringMaterial || getRandomElement(['SILK_STRING', 'GUT_STRING']);
    let stringPalette = getPalette(stringPaletteKey);
    if (!stringPalette) { stringPalette = getPalette("SILK_STRING"); console.warn(`String palette for ${stringPaletteKey} not found, used SILK_STRING.`);}


    let bowLogicalLength, limbMaxCurve, limbBaseThickness;
    if (bowType === 'longbow') {
        bowLogicalLength = getRandomInt(LOGICAL_GRID_HEIGHT * 0.7, LOGICAL_GRID_HEIGHT - CANVAS_PADDING * 2.5);
        limbMaxCurve = getRandomInt(5, 8); 
        limbBaseThickness = getRandomInt(2, 3);
    } else if (bowType === 'shortbow') {
        bowLogicalLength = getRandomInt(LOGICAL_GRID_HEIGHT * 0.45, LOGICAL_GRID_HEIGHT * 0.65);
        limbMaxCurve = getRandomInt(7, 11); 
        limbBaseThickness = getRandomInt(2, 4);
    } else { // recurve
        bowLogicalLength = getRandomInt(LOGICAL_GRID_HEIGHT * 0.55, LOGICAL_GRID_HEIGHT * 0.75);
        limbMaxCurve = getRandomInt(8, 13); 
        limbBaseThickness = getRandomInt(2, 3);
    }

    const gripLogicalLength = Math.floor(bowLogicalLength * getRandomInRange(0.15, 0.25));
    const gripLogicalThickness = limbBaseThickness + getRandomInt(1, 2);
    const hasWrapping = gripPalette.name.toLowerCase().includes('leather') || gripPalette.name.toLowerCase().includes('cloth');


    const tipStyles = ['simple', 'nocked'];
    const limbTipStyle = getRandomElement(tipStyles);


    const bowCenterX = Math.floor(LOGICAL_GRID_WIDTH / 3); 
    const bowCenterY = Math.floor(LOGICAL_GRID_HEIGHT / 2);
    const bowHalfLength = Math.floor(bowLogicalLength / 2);
    
    const limbDetails = {
        type: bowType,
        logicalLength: bowLogicalLength,
        maxCurve: limbMaxCurve,
        limbThickness: limbBaseThickness,
        palette: mainPalette, // Use the resolved mainPalette for limbs
        tipStyle: limbTipStyle
    };
    
    const stringDetails = {
        palette: stringPalette, // Use the resolved stringPalette
        thickness: 1
    };
    drawBowString(ctx, stringDetails, bowCenterY, bowHalfLength, bowCenterX);

    drawBowLimbs(ctx, limbDetails, bowCenterX, bowCenterY, 'vertical');

    const gripDetails = {
        logicalLength: gripLogicalLength,
        logicalThickness: gripLogicalThickness,
        palette: gripPalette, // Use the resolved gripPalette
        hasWrapping,
        wrappingPalette: hasWrapping ? gripPalette : null // If grip implies wrapping, its own palette is the wrapping palette
    };
    drawBowGrip(ctx, gripDetails, bowCenterX, bowCenterY);

    const hasArrow = true; 
    let arrowData = null;
    if (hasArrow) {
        const arrowShaftMaterialName = getRandomElement(['WOOD', 'BONE']);
        const arrowShaftPalette = getPalette(arrowShaftMaterialName); 
        const arrowheadMaterialName = getRandomElement(['IRON', 'STEEL', 'OBSIDIAN', 'BRONZE']);
        const arrowheadPalette = getPalette(arrowheadMaterialName);
        const arrowheadShapes = ['triangle', 'leaf']; 
        const arrowheadShape = getRandomElement(arrowheadShapes);
        
        const fletchingMaterials = ['WHITE_PAINT', 'RED_PAINT', 'BLUE_PAINT', 'GREEN_PAINT', 'LEATHER']; 
        const fletchingMaterialName = getRandomElement(fletchingMaterials); 
        const fletchingPalette = getPalette(fletchingMaterialName);
        const fletchingStyles = ['classic_angled', 'straight'];
        const fletchingStyle = getRandomElement(fletchingStyles);

        const arrowShaftLength = Math.floor(bowLogicalLength * getRandomInRange(0.65, 0.75));
        const arrowDrawX = bowCenterX + limbMaxCurve + ARROW_OFFSET_X; 
        const arrowDrawY = bowCenterY - Math.floor(arrowShaftLength / 2); 

        const arrowDetailsToDraw = {
            shaftLength: arrowShaftLength,
            shaftPalette: arrowShaftPalette, 
            arrowheadShape,
            arrowheadPalette,
            fletchingStyle,
            fletchingPalette
        };
        drawArrow(ctx, arrowDetailsToDraw, arrowDrawX, arrowDrawY);
        arrowData = {
            shaftMaterial: arrowShaftMaterialName.toLowerCase(),
            arrowheadMaterial: arrowheadMaterialName.toLowerCase(),
            arrowheadShape,
            fletchingMaterial: fletchingMaterialName.toLowerCase(), 
            fletchingStyle
        };
    }

    let subTypeNameForDisplay = bowType.replace(/_/g, ' ');
    subTypeNameForDisplay = subTypeNameForDisplay.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    let itemName = `${mainPalette.name} ${subTypeNameForDisplay}`;
    if (limbTipStyle === 'nocked') itemName += ` (Nocked)`;
    if (gripPalette.name !== mainPalette.name) { // Only mention grip if different from limb material
        itemName += ` with ${gripPalette.name} Grip`;
    }
    itemName += ` & ${stringPalette.name} String`;
    
    const itemSeed = options.seed || Date.now();

    const generatedItemData = {
        type: 'bow',
        name: itemName,
        seed: itemSeed,
        itemData: { 
            visualTheme: `${mainPalette.name} ${bowType.replace(/_/g, ' ')}`,
            bowType, 
            subType: options.subType || bowType, 
            limbMaterial: limbPaletteKey, // Store the key
            limbTipStyle: limbTipStyle,
            gripMaterial: gripPaletteKey, // Store the key
            stringMaterial: stringPaletteKey, // Store the key
            arrow: arrowData 
        },
        imageDataUrl: offscreenCanvas.toDataURL()
    };

    console.log("Bow (Pixel Art) generated:", generatedItemData.name);
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

console.log("js/generators/bow_generator.js (Pixel Art - Material Fix) loaded.");
