/**
 * js/generators/boots_generator.js
 * Contains the logic for procedurally generating boots.
 */

import { getRandomInt, getRandomElement, drawScaledRect, getRandomInRange } from '../utils.js';
import { getPalette, MATERIAL_PALETTES } from '../palettes/material_palettes.js';

// --- Constants specific to boot generation or drawing ---
const LOGICAL_GRID_WIDTH = 64; 
const LOGICAL_GRID_HEIGHT = 64; 
const DISPLAY_SCALE = 4;
const CANVAS_WIDTH = LOGICAL_GRID_WIDTH * DISPLAY_SCALE;
const CANVAS_HEIGHT = LOGICAL_GRID_HEIGHT * DISPLAY_SCALE;

const SINGLE_BOOT_LOGICAL_HEIGHT = 56; 
const SINGLE_BOOT_LOGICAL_WIDTH = 26;  

const PAIR_SPACING = 4; 
const CONTENT_LOGICAL_WIDTH = (SINGLE_BOOT_LOGICAL_WIDTH * 2) + PAIR_SPACING;

const CANVAS_PADDING_X = Math.floor((LOGICAL_GRID_WIDTH - CONTENT_LOGICAL_WIDTH) / 2); 
const CANVAS_PADDING_Y = Math.floor((LOGICAL_GRID_HEIGHT - SINGLE_BOOT_LOGICAL_HEIGHT) / 2);


/**
 * Draws a single boot.
 */
function drawSingleBoot(ctx, bootDetails, bootAreaStartX, bootAreaTopY, isMirrored = false) {
    const {
        bootType, mainPalette, solePalette, cuffPalette, bucklePalette, lacingPalette, toeCapPalette, heelCounterPalette,
        footTotalLength, footHeight, legHeight, legInitialWidth, legTopWidth,
        heelVisibleBehindShaft, toeVisibleInFrontOfShaft,
        hasCuff, cuffStyle, toeShape, heelStyle, heelHeightActual,
        hasBuckles, numBuckles,
        hasLacing, legStyle, hasToeCap, hasHeelCounter
    } = bootDetails;

    const soleVisualHeight = Math.max(1, Math.floor(footHeight / 7)) + 1;
    const footUpperHeight = footHeight - soleVisualHeight;
    
    const shaftHorizAreaCenter = bootAreaStartX + Math.floor(SINGLE_BOOT_LOGICAL_WIDTH / 2);
    const shaftShiftAmount = Math.floor(SINGLE_BOOT_LOGICAL_WIDTH * 0.20); 
    const legShaftDrawingCenterX = isMirrored ? shaftHorizAreaCenter - shaftShiftAmount : shaftHorizAreaCenter + shaftShiftAmount;

    const ankleY = bootAreaTopY + legHeight;

    // --- Leg Part ---
    for (let i = 0; i < legHeight; i++) {
        const y = bootAreaTopY + i;
        const taperProgress = (legHeight <= 1) ? 0 : i / (legHeight - 1);
        let curveOffset = 0;
        if (legStyle === 'subtle_curve' && legHeight > 8) {
            curveOffset = Math.floor(Math.sin(taperProgress * Math.PI * 0.8) * (isMirrored ? -1.0 : 1.0) * (1 - taperProgress * 0.5)); 
        }
        const currentLegWidth = Math.max(2, Math.round(legTopWidth + (legInitialWidth - legTopWidth) * (1 - taperProgress)));
        const legSegX = legShaftDrawingCenterX - Math.floor(currentLegWidth / 2) + curveOffset;

        drawScaledRect(ctx, legSegX, y, currentLegWidth, 1, mainPalette.base, DISPLAY_SCALE);
        if (currentLegWidth > 1) {
            const highlightX = isMirrored ? legSegX + currentLegWidth - 1 : legSegX;
            const shadowX = isMirrored ? legSegX : legSegX + currentLegWidth - 1;
            drawScaledRect(ctx, highlightX, y, 1, 1, mainPalette.highlight, DISPLAY_SCALE);
            drawScaledRect(ctx, shadowX, y, 1, 1, mainPalette.shadow, DISPLAY_SCALE);
        }
    }

    // --- Foot Part ---
    const instepLeftX = legShaftDrawingCenterX - Math.floor(legInitialWidth / 2);
    const instepRightX = instepLeftX + legInitialWidth - 1;

    for (let i = 0; i < footUpperHeight; i++) {
        const y = ankleY + i;
        const footProgress = i / (footUpperHeight - 1 || 1);
        const currentInstepWidth = Math.max(legInitialWidth -1, Math.round(legInitialWidth * (1 - footProgress * 0.05))); 
        const currentInstepX = legShaftDrawingCenterX - Math.floor(currentInstepWidth / 2);
        drawScaledRect(ctx, currentInstepX, y, currentInstepWidth, 1, mainPalette.base, DISPLAY_SCALE);
        if (i === 0 && currentInstepWidth > 1) { 
             drawScaledRect(ctx, currentInstepX, y, currentInstepWidth, 1, mainPalette.highlight, DISPLAY_SCALE);
        }
    }
    
    const heelUpperDrawStartY = ankleY + Math.floor(footUpperHeight * 0.05); 
    const heelUpperDrawHeight = footUpperHeight - Math.floor(footUpperHeight * 0.05);
    for (let i = 0; i < heelVisibleBehindShaft; i++) {
        const currentX = isMirrored ? instepLeftX - 1 - i : instepRightX + 1 + i;
        let h = heelUpperDrawHeight;
        if (i > heelVisibleBehindShaft * 0.2) { 
            h = Math.max(1, heelUpperDrawHeight - Math.floor(heelUpperDrawHeight * 0.50 * ((i - heelVisibleBehindShaft * 0.2) / (heelVisibleBehindShaft * 0.8 || 1))));
        }
        const yDraw = heelUpperDrawStartY + (heelUpperDrawHeight - h);
        const pal = hasHeelCounter && heelCounterPalette ? heelCounterPalette : mainPalette;
        drawScaledRect(ctx, currentX, yDraw, 1, h, pal.base, DISPLAY_SCALE);
        if (h > 0) drawScaledRect(ctx, currentX, yDraw, 1, 1, pal.highlight, DISPLAY_SCALE);
    }

    const toeBoxDrawStartY = ankleY;
    const toeBoxDrawHeight = footUpperHeight;
     for (let i = 0; i < toeVisibleInFrontOfShaft; i++) {
        const currentX = isMirrored ? instepRightX + 1 + i : instepLeftX - 1 - i;
        let h = toeBoxDrawHeight;
        const toeProgress = (toeVisibleInFrontOfShaft <= 1) ? 1 : i / (toeVisibleInFrontOfShaft - 1);

        if (toeShape === 'rounded') {
            h = Math.max(1, Math.floor(toeBoxDrawHeight * (1 - Math.pow(toeProgress, 1.5) * 0.60)));
        } else if (toeShape === 'pointed') {
            h = Math.max(1, Math.floor(toeBoxDrawHeight * (1 - Math.pow(toeProgress, 1.2) * 0.80)));
        } else { // square
            h = Math.floor(toeBoxDrawHeight * 0.95);
        }
        const yOffset = toeBoxDrawHeight - h; 
        const pal = hasToeCap && toeCapPalette ? toeCapPalette : mainPalette;
        drawScaledRect(ctx, currentX, toeBoxDrawStartY + yOffset, 1, h, pal.base, DISPLAY_SCALE);
        if (h > 0) drawScaledRect(ctx, currentX, toeBoxDrawStartY + yOffset, 1, 1, pal.highlight, DISPLAY_SCALE);
    }
    
    // --- Sole & Heel Block ---
    const soleDrawY = ankleY + footUpperHeight;
    const absToeTipX = isMirrored ? instepRightX + toeVisibleInFrontOfShaft : instepLeftX - toeVisibleInFrontOfShaft;
    const absHeelTipX = isMirrored ? instepLeftX - heelVisibleBehindShaft : instepRightX + heelVisibleBehindShaft;
    
    const soleMinXOverall = Math.min(absToeTipX, absHeelTipX, instepLeftX);
    const soleMaxXOverall = Math.max(absToeTipX, absHeelTipX, instepRightX);
    let soleDrawLength = soleMaxXOverall - soleMinXOverall + 1;
    let soleDrawStartX = soleMinXOverall;

    if (solePalette) {
        if (heelStyle !== 'none' && heelHeightActual > 0) { 
            const heelBlockWidth = Math.max(2, Math.floor(legInitialWidth * 0.65)); 
            const heelTopY = soleDrawY + soleVisualHeight - heelHeightActual;
            let heelBlockX = isMirrored ? absHeelTipX : absHeelTipX - heelBlockWidth + 1;
            heelBlockX = Math.max(soleMinXOverall, Math.min(heelBlockX, soleMaxXOverall - heelBlockWidth +1));

            drawScaledRect(ctx, heelBlockX, heelTopY, heelBlockWidth, heelHeightActual, solePalette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, heelBlockX, heelTopY + heelHeightActual - 1, heelBlockWidth, 1, solePalette.shadow, DISPLAY_SCALE);
            if (heelBlockWidth > 1) {
                drawScaledRect(ctx, isMirrored ? heelBlockX + heelBlockWidth -1 : heelBlockX, heelTopY, 1, heelHeightActual, solePalette.highlight, DISPLAY_SCALE); 
                drawScaledRect(ctx, isMirrored ? heelBlockX : heelBlockX + heelBlockWidth -1, heelTopY, 1, heelHeightActual, solePalette.shadow, DISPLAY_SCALE); 
            }
            if(!isMirrored) { 
                 soleDrawLength = Math.max(0, heelBlockX - soleDrawStartX);
            } else { 
                soleDrawStartX = heelBlockX + heelBlockWidth;
                soleDrawLength = Math.max(0, soleMaxXOverall - soleDrawStartX + 1);
            }
        }
        if (soleDrawLength > 0 ) { 
            drawScaledRect(ctx, soleDrawStartX, soleDrawY, soleDrawLength, soleVisualHeight, solePalette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, soleDrawStartX, soleDrawY + soleVisualHeight - 1, soleDrawLength, 1, solePalette.shadow, DISPLAY_SCALE);
             if (soleDrawLength > 1) { 
                const soleOuterEdgeX = isMirrored ? soleDrawStartX + soleDrawLength -1 : soleDrawStartX;
                const soleInnerEdgeX = isMirrored ? soleDrawStartX : soleDrawStartX + soleDrawLength -1;
                if(soleOuterEdgeX !== soleInnerEdgeX){ 
                    drawScaledRect(ctx, soleOuterEdgeX, soleDrawY, 1, soleVisualHeight -1, solePalette.highlight, DISPLAY_SCALE);
                    drawScaledRect(ctx, soleInnerEdgeX, soleDrawY, 1, soleVisualHeight -1, solePalette.shadow, DISPLAY_SCALE);
                }
            }
        }
    }

    // --- Cuff --- 
    if (hasCuff && cuffPalette) {
        const cuffDrawHeight = Math.max(2, Math.floor(legHeight * (cuffStyle === 'fur_trim' ? 0.20 : 0.15))) + (cuffStyle === 'fur_trim' ? 1:0);
        const legWidthAtCuffTop = Math.max(2, Math.round(legTopWidth + (legInitialWidth - legTopWidth) * (1 - 0))); 
        const cuffDrawWidth = legWidthAtCuffTop + (cuffStyle === 'simple_fold' ? 0 : (cuffStyle === 'fur_trim' ? 2 : 1) );
        
        let legCurveOffsetAtCuff = 0;
        if (legStyle === 'subtle_curve' && legHeight > 8) { 
             legCurveOffsetAtCuff = Math.floor(Math.sin(0 * Math.PI * 0.9) * (isMirrored ? -1.2 : 1.2) * (1 - 0 * 0.6)); 
        }
        // Corrected: Use legWidthAtCuffTop for both parts of the calculation
        const cuffDrawX = legShaftDrawingCenterX - Math.floor(legWidthAtCuffTop / 2) + legCurveOffsetAtCuff - Math.floor((cuffDrawWidth - legWidthAtCuffTop)/2) ;


        for(let ch=0; ch < cuffDrawHeight; ch++){
            let color = cuffPalette.base;
            if (ch === 0 && cuffDrawHeight > 1) color = cuffPalette.highlight;
            else if (ch === cuffDrawHeight -1 && cuffDrawHeight > 1 && cuffStyle !== 'fur_trim') color = cuffPalette.shadow;
            
            if (cuffStyle === 'fur_trim') {
                for(let fx=0; fx < cuffDrawWidth; fx++){
                    if(Math.random() < 0.75) { 
                         drawScaledRect(ctx, cuffDrawX + fx, bootAreaTopY + ch + getRandomInt(-1,0), 1, 1, getRandomElement([cuffPalette.base, cuffPalette.highlight, cuffPalette.shadow]), DISPLAY_SCALE);
                    }
                }
            } else if (cuffStyle === 'fold_over') {
                const foldThickness = Math.floor(cuffDrawHeight / 2);
                drawScaledRect(ctx, cuffDrawX, bootAreaTopY + ch, cuffDrawWidth, 1, (ch < foldThickness ? cuffPalette.shadow : cuffPalette.base), DISPLAY_SCALE);
                if (ch === foldThickness -1) drawScaledRect(ctx, cuffDrawX, bootAreaTopY + ch, cuffDrawWidth, 1, cuffPalette.highlight, DISPLAY_SCALE);
            }
            else { // simple_band
                drawScaledRect(ctx, cuffDrawX, bootAreaTopY + ch, cuffDrawWidth, 1, color, DISPLAY_SCALE);
            }
        }
    }
    
    // --- Lacing --- 
    if (hasLacing && lacingPalette) {
        const laceStartY = bootAreaTopY + Math.floor(legHeight * (hasCuff ? 0.25 : 0.1));
        const laceEndY = ankleY - Math.floor(footUpperHeight * 0.1);
        const numLaceSegments = Math.max(3, Math.floor((laceEndY - laceStartY) / 3));

        for (let i = 0; i < numLaceSegments; i++) {
            const yLace = laceStartY + i * 3;
            if (yLace >= laceEndY) break;
            const taperProgressLace = (yLace - bootAreaTopY) / (legHeight -1 || 1);
            const currentLegWidthAtLace = Math.max(3, Math.round(legTopWidth + (legInitialWidth - legTopWidth) * (1 - taperProgressLace)));
            let legSegXAtLace = legShaftDrawingCenterX - Math.floor(currentLegWidthAtLace / 2);
             if (legStyle === 'subtle_curve' && legHeight > 10) { 
                legSegXAtLace += Math.floor(Math.sin(taperProgressLace * Math.PI * 0.9) * (isMirrored ? -1.2 : 1.2) * (1 - taperProgressLace * 0.6));
            }

            const eyeletOffset = Math.max(1, Math.floor(currentLegWidthAtLace * 0.20)); 
            const xLeft = legSegXAtLace + eyeletOffset;
            const xRight = legSegXAtLace + currentLegWidthAtLace - 1 - eyeletOffset;

            if (xLeft < xRight -1) { 
                if (i < numLaceSegments -1) {
                    const yNextLace = laceStartY + (i+1) * 3;
                     if (yNextLace < laceEndY) {
                        drawLine(ctx, xLeft, yLace, xRight, yNextLace, lacingPalette.base, DISPLAY_SCALE);
                        drawLine(ctx, xRight, yLace, xLeft, yNextLace, lacingPalette.base, DISPLAY_SCALE);
                     }
                }
            }
        }
    }

    // --- Buckles --- 
    if (hasBuckles && bucklePalette && numBuckles > 0) {
        const buckleWidth = 3;
        const buckleHeight = 2;
        const strapHeight = 1;

        for (let i = 0; i < numBuckles; i++) {
            const buckleVerticalPositionRatio = (numBuckles === 1) ? 0.45 : (0.20 + (i * 0.55 / (numBuckles -1 || 1)) ); 
            let buckleCenterY = bootAreaTopY + Math.floor(legHeight * buckleVerticalPositionRatio);
            buckleCenterY = Math.max(bootAreaTopY + (hasCuff ? Math.floor(legHeight * 0.22) + 3 : 3) + buckleHeight, buckleCenterY);
            buckleCenterY = Math.min(buckleCenterY, ankleY - buckleHeight - 4);


            const taperProgressBuckle = (buckleCenterY - bootAreaTopY) / (legHeight -1 || 1);
            const currentLegWidthAtBuckleY = Math.max(3, Math.round(legTopWidth + (legInitialWidth - legTopWidth) * (1 - taperProgressBuckle)));
            let legSegXAtBuckle = legShaftDrawingCenterX - Math.floor(currentLegWidthAtBuckleY / 2);
            if (legStyle === 'subtle_curve' && legHeight > 10) {
                 legSegXAtBuckle += Math.floor(Math.sin(taperProgressBuckle * Math.PI * 0.9) * (isMirrored ? -1.2 : 1.2) * (1 - taperProgressBuckle * 0.6));
            }
            
            const strapStartX = legSegXAtBuckle; 
            drawScaledRect(ctx, strapStartX , buckleCenterY - Math.floor(strapHeight / 2) , currentLegWidthAtBuckleY, strapHeight, bucklePalette.shadow, DISPLAY_SCALE); 
            
            const buckleX = isMirrored ? legSegXAtBuckle - buckleWidth +1 : legSegXAtBuckle + currentLegWidthAtBuckleY -1 ;
            drawScaledRect(ctx, buckleX, buckleCenterY - Math.floor(buckleHeight / 2), buckleWidth, buckleHeight, bucklePalette.base, DISPLAY_SCALE);
            drawScaledRect(ctx, buckleX + (isMirrored ? buckleWidth-1:0), buckleCenterY - Math.floor(buckleHeight / 2), 1, buckleHeight, bucklePalette.highlight, DISPLAY_SCALE);
        }
    }
}

function drawLine(ctx, x1, y1, x2, y2, color, scale) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    let currentX = x1;
    let currentY = y1;

    while(true) {
        drawScaledRect(ctx, currentX, currentY, 1, 1, color, scale);
        if ((currentX === x2) && (currentY === y2)) break;
        const e2 = 2*err;
        if (e2 > -dy) { err -= dy; currentX += sx; }
        if (e2 < dx) { err += dx; currentY += sy; }
        if (currentX < 0 || currentX >= LOGICAL_GRID_WIDTH || currentY < 0 || currentY >= LOGICAL_GRID_HEIGHT) break; 
    }
}


/**
 * Generates a procedural pair of boots.
 */
export function generateBoots(options = {}) {
    console.log("generateBoots (Pixel Art) called with options:", options);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = CANVAS_WIDTH;
    offscreenCanvas.height = CANVAS_HEIGHT;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context for offscreen canvas in generateBoots.");
        return { type: 'boots', name: 'Error Boots', seed: Date.now(), itemData: { error: "Canvas context failed" }, imageDataUrl: createErrorDataURL("CTX Fail") };
    }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const bootType = getRandomElement(['ankle_boot', 'calf_high', 'knee_high']);
    const toeShape = getRandomElement(['rounded', 'square', 'pointed']);
    const heelStyles = ['none', 'low_block', 'medium_block']; 
    const heelStyle = getRandomElement(heelStyles);
    const legStyles = ['straight', 'subtle_curve'];
    const legStyle = getRandomElement(legStyles);

    const mainMaterials = ['LEATHER', 'DARK_LEATHER', 'CLOTH', 'STEEL', 'IRON', 'ENCHANTED_METAL', 'BONE'];
    const mainMaterialName = options.material || getRandomElement(mainMaterials);
    const mainPalette = getPalette(mainMaterialName);

    const soleMaterials = ['LEATHER', 'WOOD', 'IRON', 'BLACK_PAINT', 'DARK_STEEL', 'STONE'];
    const soleMaterialName = options.soleMaterial || getRandomElement(soleMaterials);
    const solePalette = getPalette(soleMaterialName);

    const cuffStyles = ['none', 'simple_fold', 'fur_trim', 'buckled_strap_cuff'];
    let cuffStyle = Math.random() < 0.6 ? getRandomElement(cuffStyles) : 'none';
    if (bootType === 'ankle_boot' && cuffStyle === 'buckled_strap_cuff') cuffStyle = 'simple_fold'; 
    
    let hasCuff = cuffStyle !== 'none';
    let cuffMaterialName = null, cuffPalette = null;
    if (hasCuff) {
        const cuffPossibleMaterials = ['LEATHER', 'FUR_WHITE', 'FUR_BROWN', 'CLOTH', 'ENCHANTED_SILK', 'GOLD', 'SILVER'];
        cuffMaterialName = options.cuffMaterial || getRandomElement(cuffPossibleMaterials.filter(m => m !== mainMaterialName));
        if (!cuffMaterialName && cuffPossibleMaterials.length > 0) cuffMaterialName = getRandomElement(cuffPossibleMaterials);
        if (cuffMaterialName) {
            if (cuffMaterialName === 'FUR_WHITE') cuffPalette = getPalette('BONE');
            else if (cuffMaterialName === 'FUR_BROWN') cuffPalette = getPalette('WOOD');
            else cuffPalette = getPalette(cuffMaterialName);
        } else { hasCuff = false; cuffStyle = 'none';}
    }
    
    const hasBuckles = Math.random() < 0.55 && cuffStyle !== 'buckled_strap_cuff';
    const numBuckles = hasBuckles ? getRandomInt(1, (bootType === 'knee_high' ? 3 : 2)) : 0;
    const buckleMaterials = ['IRON', 'STEEL', 'BRONZE', 'SILVER', 'GOLD'];
    const bucklePalette = hasBuckles ? getPalette(options.buckleMaterial || getRandomElement(buckleMaterials)) : null;

    const hasLacing = Math.random() < 0.4 && bootType !== 'knee_high';
    const lacingPalette = hasLacing ? getPalette(getRandomElement(['LEATHER', 'SILK_STRING', 'ROPE_BROWN'])) : null;
    if(hasLacing && !MATERIAL_PALETTES.ROPE_BROWN) MATERIAL_PALETTES.ROPE_BROWN = {name: 'Rope Brown', base: '#8B4513', shadow: '#5C2E0D', highlight: '#A0522D'};

    const hasToeCap = Math.random() < 0.3;
    const toeCapPalette = hasToeCap ? getPalette(getRandomElement(['STEEL', 'IRON', 'DARK_LEATHER', 'BRONZE'])) : null;
    const hasHeelCounter = Math.random() < 0.3;
    const heelCounterPalette = hasHeelCounter ? getPalette(getRandomElement(['STEEL', 'DARK_LEATHER', 'BRONZE', 'IRON'])) : null;

    let footTotalLength, footHeight, legHeight, legInitialWidth, legTopWidth, heelVisibleBehindShaft, toeVisibleInFrontOfShaft, heelHeightActual = 0;

    footTotalLength = getRandomInt(Math.floor(SINGLE_BOOT_LOGICAL_WIDTH * 0.80), SINGLE_BOOT_LOGICAL_WIDTH - 4); 
    if (heelStyle === 'low_block') heelHeightActual = getRandomInt(2, 3);
    else if (heelStyle === 'medium_block') heelHeightActual = getRandomInt(3, 4);
    
    footHeight = getRandomInt(6, 9) + Math.floor(heelHeightActual * 0.5); 
    legInitialWidth = Math.floor(footTotalLength * getRandomInRange(0.35, 0.45)); 
    legInitialWidth = Math.max(5, Math.min(legInitialWidth, SINGLE_BOOT_LOGICAL_WIDTH - 10));

    heelVisibleBehindShaft = Math.floor(footTotalLength * getRandomInRange(0.15, 0.25)); 
    heelVisibleBehindShaft = Math.max(2, heelVisibleBehindShaft);
    
    toeVisibleInFrontOfShaft = footTotalLength - legInitialWidth - heelVisibleBehindShaft;
    toeVisibleInFrontOfShaft = Math.max(Math.floor(footTotalLength * 0.50), toeVisibleInFrontOfShaft); 
    if (legInitialWidth + heelVisibleBehindShaft + toeVisibleInFrontOfShaft > footTotalLength) {
        const overflow = (legInitialWidth + heelVisibleBehindShaft + toeVisibleInFrontOfShaft) - footTotalLength;
        if (toeVisibleInFrontOfShaft - overflow >= Math.floor(footTotalLength * 0.45)) {
            toeVisibleInFrontOfShaft -= overflow;
        } else {
            heelVisibleBehindShaft = Math.max(2, heelVisibleBehindShaft - (overflow - (toeVisibleInFrontOfShaft - Math.floor(footTotalLength * 0.45))));
            toeVisibleInFrontOfShaft = Math.floor(footTotalLength * 0.45);
        }
    }
    
    const maxLegHeightPossible = SINGLE_BOOT_LOGICAL_HEIGHT - footHeight -1;


    if (bootType === 'ankle_boot') {
        legHeight = getRandomInt(Math.floor(footHeight * 0.9), footHeight + 6);
    } else if (bootType === 'calf_high') {
        legHeight = getRandomInt(Math.floor(maxLegHeightPossible * 0.40), Math.floor(maxLegHeightPossible * 0.65));
    } else { // knee_high
        legHeight = getRandomInt(Math.floor(maxLegHeightPossible * 0.60), maxLegHeightPossible -1);
    }
    legHeight = Math.max(5, Math.min(legHeight, maxLegHeightPossible)); 
    legTopWidth = Math.floor(legInitialWidth * getRandomInRange(0.90, 1.10)); 
    legTopWidth = Math.max(4, legTopWidth);

    const currentTotalBootHeight = legHeight + footHeight;
    const dynamicCanvasPaddingY = Math.floor((LOGICAL_GRID_HEIGHT - currentTotalBootHeight) / 2);
    const finalBootTopY = Math.max(2, dynamicCanvasPaddingY); 

    const leftBootAreaStartX = CANVAS_PADDING_X;
    const rightBootAreaStartX = CANVAS_PADDING_X + SINGLE_BOOT_LOGICAL_WIDTH + PAIR_SPACING;
    
    const bootDetails = {
        bootType, mainPalette, solePalette, cuffPalette, bucklePalette, lacingPalette, toeCapPalette, heelCounterPalette,
        footTotalLength, footHeight, legHeight, legInitialWidth, legTopWidth,
        heelVisibleBehindShaft, toeVisibleInFrontOfShaft, 
        hasCuff, cuffStyle, toeShape, heelStyle, heelHeightActual,
        hasBuckles, numBuckles,
        hasLacing, legStyle, hasToeCap, hasHeelCounter
    };

    drawSingleBoot(ctx, bootDetails, leftBootAreaStartX, finalBootTopY, false);
    drawSingleBoot(ctx, bootDetails, rightBootAreaStartX, finalBootTopY, true);

    let itemName = `${mainPalette.name} ${toeShape} ${bootType.replace('_', ' ')}`;
    if (heelStyle !== 'none') itemName += ` (${heelStyle.replace('_', ' ')} heel)`;
    if (hasCuff && cuffMaterialName) itemName += ` with ${cuffMaterialName.replace('FUR_', '')} ${cuffMaterialName.includes('FUR') ? 'Fur ' : ''}Cuff`;
    if (hasBuckles) itemName += ` with ${numBuckles} Buckle${numBuckles > 1 ? 's' : ''}`;
    if (hasLacing) itemName += ` (Laced)`;
    if (hasToeCap && toeCapPalette) itemName += ` with ${toeCapPalette.name.toLowerCase()} Toe Cap`;
    if (hasHeelCounter && heelCounterPalette) itemName += ` and ${heelCounterPalette.name.toLowerCase()} Heel Counter`;


    const itemSeed = options.seed || Date.now();
    const generatedItemData = {
        type: 'boots',
        name: itemName,
        seed: itemSeed,
        itemData: {
            style: bootType, 
            toeShape,
            heelStyle,
            mainMaterial: mainMaterialName.toLowerCase(),
            soleMaterial: soleMaterialName.toLowerCase(),
            hasCuff,
            cuffStyle,
            cuffMaterial: cuffMaterialName ? cuffMaterialName.toLowerCase().replace('FUR_', '') : null,
            hasBuckles,
            numBuckles,
            buckleMaterial: hasBuckles && bucklePalette ? bucklePalette.name.toLowerCase() : null,
            hasLacing,
            lacingMaterial: hasLacing && lacingPalette ? lacingPalette.name.toLowerCase() : null,
            hasToeCap,
            toeCapMaterial: hasToeCap && toeCapPalette ? toeCapPalette.name.toLowerCase() : null,
            hasHeelCounter,
            heelCounterMaterial: hasHeelCounter && heelCounterPalette ? heelCounterPalette.name.toLowerCase() : null,
            colors: { main: mainPalette, sole: solePalette, cuff: cuffPalette, buckle: bucklePalette, lacing: lacingPalette, toeCap: toeCapPalette, heelCounter: heelCounterPalette }
        },
        imageDataUrl: offscreenCanvas.toDataURL()
    };

    console.log("Boots generated:", generatedItemData.name);
    return generatedItemData;
}

function createErrorDataURL(message = "ERR") {
    const errorCanvas = document.createElement('canvas');
    errorCanvas.width = CANVAS_WIDTH; errorCanvas.height = CANVAS_HEIGHT;
    const ctx = errorCanvas.getContext('2d');
    if (ctx) {
        ctx.imageSmoothingEnabled = false; ctx.fillStyle = 'rgba(255,0,0,0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const fontSize = Math.floor(CANVAS_WIDTH / 16);
        ctx.font = `bold ${fontSize}px sans-serif`; ctx.fillStyle = 'white';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(message, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        try { return errorCanvas.toDataURL(); } catch (e) { console.error("Error converting error canvas to Data URL:", e); }
    }
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACNJREFUOI1jZGRgYPgPykCATQIKyMBKjEwM0AAGsAFJVMQvAgADqgH5kG3fXAAAAABJRU5ErkJggg==";
}

console.log("js/generators/boots_generator.js (Cuff Drawing Fix v2) loaded.");
