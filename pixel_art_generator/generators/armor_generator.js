/**
 * js/generators/armor_generator.js
 * Contains the logic for procedurally generating armor.
 */

import { getRandomInt, getRandomElement, drawScaledRect, getRandomInRange } from '../utils.js';
import { getPalette } from '../palettes/material_palettes.js';

// --- Constants specific to armor generation or drawing ---
const LOGICAL_GRID_WIDTH = 64; // Increased for more detail
const LOGICAL_GRID_HEIGHT = 64; // Increased for more detail
const DISPLAY_SCALE = 4;      // Decreased to maintain 256x256 output
const CANVAS_WIDTH = LOGICAL_GRID_WIDTH * DISPLAY_SCALE;   // 256 (64 * 4)
const CANVAS_HEIGHT = LOGICAL_GRID_HEIGHT * DISPLAY_SCALE; // 256 (64 * 4)
const CANVAS_PADDING = 4; // Logical padding within the grid (increased slightly for larger grid)

// --- Internal helper functions for drawing armor components ---

/**
 * Checks if a point is within the torso bounds, considering the neckline.
 * @param {number} lx - Logical X coordinate.
 * @param {number} ly - Logical Y coordinate.
 * @param {object} torsoShapeInfo - Object containing pre-calculated torso shape data per Y-row.
 * Each entry torsoShapeInfo[y] = { xStart, width, isNeck, neckXStart, neckWidth }
 * @returns {boolean} True if the point is within the drawable torso area (not neck).
 */
function isPointInDrawableTorso(lx, ly, torsoShapeInfo) {
    if (torsoShapeInfo[ly]) {
        const rowInfo = torsoShapeInfo[ly];
        if (rowInfo.isNeck && lx >= rowInfo.neckXStart && lx < rowInfo.neckXStart + rowInfo.neckWidth) {
            return false; // Point is in the neck opening
        }
        return lx >= rowInfo.xStart && lx < rowInfo.xStart + rowInfo.width;
    }
    return false;
}


/**
 * Draws the main torso component of the armor.
 * @param {CanvasRenderingContext2D} ctx - The context of the offscreen canvas.
 * @param {object} torsoDetails - Properties like width, height, palette, style.
 * @param {number} centerX - Logical X center for the torso.
 * @param {number} startY - Logical Y for the top of the torso.
 * @param {object} generatorOptions - The options object passed to generateArmor, containing subType.
 * @returns {object} Object containing key dimensions and shape information.
 */
function drawTorsoComponent(ctx, torsoDetails, centerX, startY, generatorOptions) {
    const {
        logicalHeight,
        baseWidth,
        waistTaper,
        palette,
        style, // 'smooth_plate', 'muscled_plate', 'leather_vest', 'chainmail', 'scale_mail', 'padded_armor'
        necklineType,
        necklineDepth,
        necklineWidth
    } = torsoDetails;

    const rpgSubType = generatorOptions.subType;

    const dimensions = {
        topY: startY,
        bottomY: startY + logicalHeight -1,
        actualWidthAtShoulder: 0,
        actualWidthAtWaist: 0,
        necklineTopY: startY,
        necklineWidthAtTop: necklineWidth,
        necklineDepthActual: necklineDepth,
        torsoShapeInfo: {}
    };

    for (let i = 0; i < logicalHeight; i++) {
        const y = startY + i;
        const progress = (logicalHeight <= 1) ? 0 : i / (logicalHeight - 1);
        let currentSegmentWidth = Math.max(2, Math.round(baseWidth - (waistTaper * progress)));
        if (currentSegmentWidth > 1 && currentSegmentWidth % 2 !== 0) {
            currentSegmentWidth = Math.max(2, currentSegmentWidth -1)
        }

        if (i === 0) dimensions.actualWidthAtShoulder = currentSegmentWidth;
        if (i === logicalHeight - 1) dimensions.actualWidthAtWaist = currentSegmentWidth;

        const segmentX = centerX - Math.floor(currentSegmentWidth / 2);
        dimensions.torsoShapeInfo[y] = { xStart: segmentX, width: currentSegmentWidth, isNeck: false, neckXStart: 0, neckWidth: 0 };

        let neckOpeningWidth = 0;
        drawScaledRect(ctx, segmentX, y, currentSegmentWidth, 1, palette.base, DISPLAY_SCALE);

        if (i < necklineDepth) {
            const neckProgress = (necklineDepth <= 1) ? 1 : i / (necklineDepth - 1);
            if (necklineType === 'v_neck') {
                neckOpeningWidth = Math.max(0, Math.floor(necklineWidth * (1 - neckProgress)));
            } else if (necklineType === 'round_neck') {
                neckOpeningWidth = Math.max(0, Math.floor(necklineWidth * Math.sqrt(1 - neckProgress * neckProgress)));
            } else { // square_neck
                neckOpeningWidth = necklineWidth;
            }
            neckOpeningWidth = Math.min(neckOpeningWidth, currentSegmentWidth > 1 ? currentSegmentWidth - 2 : 0);
            if (neckOpeningWidth > 1 && neckOpeningWidth % 2 !== 0) neckOpeningWidth = Math.max(0, neckOpeningWidth-1);

            if (neckOpeningWidth > 0) {
                const neckStartX = centerX - Math.floor(neckOpeningWidth / 2);
                dimensions.torsoShapeInfo[y].isNeck = true;
                dimensions.torsoShapeInfo[y].neckXStart = neckStartX;
                dimensions.torsoShapeInfo[y].neckWidth = neckOpeningWidth;

                ctx.clearRect(
                    neckStartX * DISPLAY_SCALE, y * DISPLAY_SCALE,
                    neckOpeningWidth * DISPLAY_SCALE, 1 * DISPLAY_SCALE
                );
                if (segmentX < neckStartX) {
                     drawScaledRect(ctx, segmentX, y, neckStartX - segmentX, 1, palette.base, DISPLAY_SCALE);
                }
                if (neckStartX + neckOpeningWidth < segmentX + currentSegmentWidth) {
                     drawScaledRect(ctx, neckStartX + neckOpeningWidth, y, (segmentX + currentSegmentWidth) - (neckStartX + neckOpeningWidth), 1, palette.base, DISPLAY_SCALE);
                }
            }
        }

        if (currentSegmentWidth > 0) {
            if (i < necklineDepth && neckOpeningWidth > 0) {
                const neckPhysicalStartX = centerX - Math.floor(neckOpeningWidth / 2);
                const neckPhysicalEndX = centerX + Math.ceil(neckOpeningWidth / 2) -1;
                if (segmentX < neckPhysicalStartX) {
                    drawScaledRect(ctx, segmentX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                }
                if (segmentX + currentSegmentWidth -1 > neckPhysicalEndX) {
                     drawScaledRect(ctx, segmentX + currentSegmentWidth - 1, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                }
                if (neckOpeningWidth > 0) {
                    drawScaledRect(ctx, neckPhysicalStartX, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                    if (neckOpeningWidth > 1) {
                       drawScaledRect(ctx, neckPhysicalEndX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                    }
                }
            } else {
                drawScaledRect(ctx, segmentX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                if (currentSegmentWidth > 1) {
                    drawScaledRect(ctx, segmentX + currentSegmentWidth - 1, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                }
            }
        }

        if (style === 'muscled_plate' && i >= necklineDepth) {
            // ... (muscled plate logic remains the same)
            const pecsEndY = startY + Math.floor(logicalHeight / 1.8);
            const absStartY = pecsEndY + 1;
            const absEndY = startY + logicalHeight - Math.floor(logicalHeight / 6);

            if (y >= necklineDepth + 2 && y <= pecsEndY) { // Pecs area
                const pecOuterEdgeDist = Math.floor(currentSegmentWidth * 0.15);
                const pecInnerEdgeDist = Math.floor(currentSegmentWidth * 0.4);
                const pecEffectiveWidth = pecInnerEdgeDist - pecOuterEdgeDist;

                if (pecEffectiveWidth >= 1) {
                    const leftPecXStart = segmentX + pecOuterEdgeDist;
                    if (y === necklineDepth + 2 || y === pecsEndY) { // Top/bottom edge of pec
                         drawScaledRect(ctx, leftPecXStart, y, pecEffectiveWidth, 1, palette.highlight, DISPLAY_SCALE);
                    } else { // Side edges of pec
                        drawScaledRect(ctx, leftPecXStart, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                        drawScaledRect(ctx, leftPecXStart + pecEffectiveWidth -1, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                    }
                    const rightPecXStart = centerX + Math.floor( (currentSegmentWidth/2 - pecInnerEdgeDist) /2 ) ;
                     if (y === necklineDepth + 2 || y === pecsEndY) {
                         drawScaledRect(ctx, rightPecXStart, y, pecEffectiveWidth, 1, palette.highlight, DISPLAY_SCALE);
                    } else {
                        drawScaledRect(ctx, rightPecXStart, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                        drawScaledRect(ctx, rightPecXStart + pecEffectiveWidth -1, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                    }
                }
            }
            if (y >= absStartY && y <= absEndY) { // Abs area
                 const abSectionHeight = Math.floor((absEndY - absStartY +1) / 3);
                if ( (y - absStartY) % Math.max(2,Math.floor(abSectionHeight * 0.8)) === 0 && y < absEndY -1) {
                    drawScaledRect(ctx, segmentX + 2, y, currentSegmentWidth - 4, 1, palette.shadow, DISPLAY_SCALE);
                    if (y + 1 <= absEndY) {
                        drawScaledRect(ctx, segmentX + 2, y + 1, currentSegmentWidth - 4, 1, palette.highlight, DISPLAY_SCALE);
                    }
                }
                if (currentSegmentWidth > 4) { // Center line for abs
                    drawScaledRect(ctx, centerX -1, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                    drawScaledRect(ctx, centerX, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                }
            }
        } else if (style === 'chainmail' && i >= necklineDepth) {
            for (let tx = segmentX; tx < segmentX + currentSegmentWidth; tx++) {
                if ((tx + y * 2) % 5 === 0) { // Adjusted pattern for more link-like feel
                    drawScaledRect(ctx, tx, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                } else if ((tx + y * 2) % 5 === 1 && tx > segmentX) {
                     drawScaledRect(ctx, tx-1, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                } else if ((tx + y * 2) % 5 === 3) {
                     drawScaledRect(ctx, tx, y, 1, 1, palette.base, DISPLAY_SCALE); // More base color
                }
            }
        } else if (style === 'scale_mail' && i >= necklineDepth) {
            const scaleHeight = Math.max(2, Math.floor(currentSegmentWidth * 0.15));
            const scaleWidth = Math.max(2, Math.floor(scaleHeight * 1.2));
            const overlapY = Math.floor(scaleHeight * 0.4);
            const yOffsetForRow = y % (scaleHeight - overlapY);

            for (let tx = segmentX; tx < segmentX + currentSegmentWidth - scaleWidth + 1; tx += Math.floor(scaleWidth * 0.8)) {
                const scaleY = y - yOffsetForRow;
                if (scaleY + scaleHeight <= y + 1) { // Ensure scale fits within the current row or slightly below
                    // Draw a single scale
                    drawScaledRect(ctx, tx, scaleY, scaleWidth, scaleHeight, palette.base, DISPLAY_SCALE);
                    drawScaledRect(ctx, tx, scaleY, scaleWidth, 1, palette.highlight, DISPLAY_SCALE); // Top highlight
                    if (scaleWidth > 1) {
                        drawScaledRect(ctx, tx, scaleY + 1, 1, scaleHeight - 1, palette.highlight, DISPLAY_SCALE); // Left highlight
                        drawScaledRect(ctx, tx + scaleWidth - 1, scaleY + 1, 1, scaleHeight - 1, palette.shadow, DISPLAY_SCALE); // Right shadow
                    }
                     if (scaleHeight > 1) {
                        drawScaledRect(ctx, tx + 1, scaleY + scaleHeight - 1, scaleWidth - 2, 1, palette.shadow, DISPLAY_SCALE); // Bottom shadow
                    }
                }
            }
        } else if (style === 'leather_vest' && rpgSubType === 'studded_leather_armor' && i >= necklineDepth) {
            if (i % getRandomInt(4, 6) === 2 && currentSegmentWidth > 4) {
                for (let studX = segmentX + 2; studX < segmentX + currentSegmentWidth - 2; studX += getRandomInt(3, 5)) {
                    drawScaledRect(ctx, studX, y, 1, 1, getPalette('STEEL').highlight, DISPLAY_SCALE); // Steel studs
                }
            }
        } else if (style === 'padded_armor' && i >= necklineDepth) {
            if (i % getRandomInt(4,6) === 0 && i < logicalHeight - 2) { // Horizontal quilt lines
                 drawScaledRect(ctx, segmentX + 1, y, currentSegmentWidth - 2, 1, palette.shadow, DISPLAY_SCALE);
                 drawScaledRect(ctx, segmentX + 1, y+1, currentSegmentWidth - 2, 1, palette.highlight, DISPLAY_SCALE);
            }
            if (currentSegmentWidth > 6) { // Vertical quilt lines
                for (let qx = segmentX + Math.floor(currentSegmentWidth * 0.2); qx < segmentX + currentSegmentWidth * 0.8; qx += Math.floor(currentSegmentWidth * 0.3)) {
                    if ( (y + Math.floor(qx/2) ) % getRandomInt(4,6) === 0) {
                        drawScaledRect(ctx, qx, y, 1, 1, palette.shadow, DISPLAY_SCALE);
                        drawScaledRect(ctx, qx+1, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                    }
                }
            }
        }
    }
    return dimensions;
}

/**
 * Draws pauldron (shoulder guard) components.
 */
function drawPauldronsComponent(ctx, pauldronDetails, torsoDims, torsoCenterX) {
    if (!pauldronDetails || pauldronDetails.style === 'none') return;

    const { style, size, palette, spikeSize } = pauldronDetails;
    const pauldronHeight = Math.max(3, Math.floor(torsoDims.actualWidthAtShoulder * size * 0.8));
    const pauldronWidth = Math.max(4, Math.floor(pauldronHeight * 1.3));
    
    const pauldronEffectiveStartY = torsoDims.topY - Math.floor(pauldronHeight * 0.30);
    const overlapAmount = 1;
    const angleSlope = 0.55;

    for (let side = -1; side <= 1; side += 2) {
        let pauldronWorldBaseX;
        const torsoShoulderOuterX_Left = torsoCenterX - Math.floor(torsoDims.actualWidthAtShoulder / 2);
        const torsoShoulderOuterX_Right = torsoCenterX + Math.floor(torsoDims.actualWidthAtShoulder / 2) -1;

        if (side === -1) {
            pauldronWorldBaseX = torsoShoulderOuterX_Left - pauldronWidth + overlapAmount;
        } else {
            pauldronWorldBaseX = torsoShoulderOuterX_Right - overlapAmount + 1;
        }

        if (style === 'round_cap') {
            for (let y_local_nominal = 0; y_local_nominal < pauldronHeight; y_local_nominal++) {
                const progressY_nominal = (pauldronHeight <= 1) ? 0.5 : y_local_nominal / (pauldronHeight - 1);
                let segmentWidthAtY;
                if (progressY_nominal < 0.25) {
                    segmentWidthAtY = pauldronWidth;
                } else {
                    const taperProgress = (progressY_nominal - 0.25) / (0.75 || 0.01);
                    segmentWidthAtY = Math.floor(pauldronWidth * (1.0 - Math.pow(taperProgress,1.6) * 0.7));
                }
                segmentWidthAtY = Math.max(1, segmentWidthAtY);
                const segmentLocalStartXoffset = Math.floor((pauldronWidth - segmentWidthAtY) / 2);
                
                for (let lx_in_segment = 0; lx_in_segment < segmentWidthAtY; lx_in_segment++) {
                    const current_on_screen_X = pauldronWorldBaseX + segmentLocalStartXoffset + lx_in_segment;
                    let dist_from_pauldron_inner_edge;
                     if (side === -1) {
                        dist_from_pauldron_inner_edge = (pauldronWidth - 1) - (segmentLocalStartXoffset + lx_in_segment);
                    } else {
                        dist_from_pauldron_inner_edge = segmentLocalStartXoffset + lx_in_segment;
                    }
                    const y_drop_due_to_angle = Math.floor(dist_from_pauldron_inner_edge * angleSlope);
                    const final_Y = pauldronEffectiveStartY + y_local_nominal + y_drop_due_to_angle;

                    if (side === -1 && current_on_screen_X >= torsoCenterX - Math.floor(torsoDims.necklineWidthAtTop / 2) && final_Y < torsoDims.necklineTopY + torsoDims.necklineDepthActual + 1) continue;
                    if (side === 1 && current_on_screen_X <= torsoCenterX + Math.floor(torsoDims.necklineWidthAtTop / 2) - 1 && final_Y < torsoDims.necklineTopY + torsoDims.necklineDepthActual + 1) continue;

                    let color = palette.base;
                    if (progressY_nominal < 0.35) {
                        color = palette.highlight;
                        const x_progress_in_pauldron_width = (segmentLocalStartXoffset + lx_in_segment) / (pauldronWidth-1 || 1);
                        if ((side === -1 && x_progress_in_pauldron_width > 0.6) || (side === 1 && x_progress_in_pauldron_width < 0.4)) {
                            color = palette.base;
                        }
                    } else {
                        color = palette.base;
                        if (progressY_nominal > 0.8) {
                            color = palette.shadow;
                        }
                        if (segmentWidthAtY > 1) {
                            if (lx_in_segment < Math.floor(segmentWidthAtY * 0.2) ) color = palette.highlight;
                            else if (lx_in_segment > Math.floor(segmentWidthAtY * 0.8)) color = palette.shadow;
                        }
                    }
                    drawScaledRect(ctx, current_on_screen_X, final_Y, 1, 1, color, DISPLAY_SCALE);
                }
            }
        } else if (style === 'layered_plate' || style === 'spiked_plate') {
            const numLayers = style === 'layered_plate' ? getRandomInt(2,3) : 1;
            const layerHeight = Math.max(1,Math.floor(pauldronHeight / numLayers));
            const layerOverlap = Math.max(0, Math.floor(layerHeight * 0.15));

            for (let i = 0; i < numLayers; i++) {
                const layerWidthReduction = Math.floor(i * (pauldronWidth / (numLayers * 1.8)));
                const currentLayerWidth = Math.max(2, pauldronWidth - layerWidthReduction);
                const layerBaseX_currentLayer = pauldronWorldBaseX + (side === 1 ? layerWidthReduction : 0);
                const layerInnerTopY_currentLayer = pauldronEffectiveStartY + i * (layerHeight - layerOverlap);

                for (let lx_offset_in_layer = 0; lx_offset_in_layer < currentLayerWidth; lx_offset_in_layer++) {
                    const actual_on_screen_X = layerBaseX_currentLayer + lx_offset_in_layer;
                    let dist_from_pauldron_inner_edge;
                    if (side === -1) {
                        dist_from_pauldron_inner_edge = (pauldronWidth - 1) - ( (actual_on_screen_X - pauldronWorldBaseX) );
                    } else {
                        dist_from_pauldron_inner_edge = actual_on_screen_X - pauldronWorldBaseX;
                    }
                    dist_from_pauldron_inner_edge = Math.max(0, Math.min(dist_from_pauldron_inner_edge, pauldronWidth -1));
                    const y_drop_due_to_angle = Math.floor(dist_from_pauldron_inner_edge * angleSlope);
                    
                    for (let ly_in_strip = 0; ly_in_strip < layerHeight; ly_in_strip++) {
                        const final_Y = layerInnerTopY_currentLayer + ly_in_strip + y_drop_due_to_angle;
                        let color = palette.base;

                        if (ly_in_strip === 0) color = palette.highlight;
                        else if (ly_in_strip === layerHeight - 1 && layerHeight > 1) color = palette.shadow;
                        
                        if (currentLayerWidth > 1 && ly_in_strip > 0 && (layerHeight === 1 || ly_in_strip < layerHeight -1) ) {
                             const outerXCond = (side === -1 && lx_offset_in_layer === 0) || (side === 1 && lx_offset_in_layer === currentLayerWidth - 1);
                             const innerXCond = (side === -1 && lx_offset_in_layer === currentLayerWidth - 1) || (side === 1 && lx_offset_in_layer === 0);
                             if (outerXCond) color = palette.highlight;
                             else if (innerXCond) color = palette.shadow;
                        }
                        drawScaledRect(ctx, actual_on_screen_X, final_Y, 1, 1, color, DISPLAY_SCALE);
                    }
                }
            }

            if (style === 'spiked_plate' && spikeSize > 0) {
                const topLayerInnerY = pauldronEffectiveStartY;
                let dist_from_inner_for_spike_base;
                 if (side === -1) {
                     dist_from_inner_for_spike_base = (pauldronWidth -1) - (Math.floor(pauldronWidth/2));
                 } else {
                     dist_from_inner_for_spike_base = Math.floor(pauldronWidth/2);
                 }
                const spikeBaseYDrop = Math.floor(dist_from_inner_for_spike_base * angleSlope);
                const spikeBaseY = topLayerInnerY + spikeBaseYDrop;
                const spikeTipX = pauldronWorldBaseX + Math.floor(pauldronWidth / 2);

                for (let yOffset = 0; yOffset < spikeSize; yOffset++) {
                    const y = spikeBaseY - 1 - yOffset;
                    const progress = (spikeSize <= 1) ? 1 : yOffset / (spikeSize - 1);
                    const spikeCurrentWidth = Math.max(1, Math.round(1 + (Math.floor(pauldronWidth/5) -1) * (1 - progress)));
                    const x = spikeTipX - Math.floor(spikeCurrentWidth / 2);
                    drawScaledRect(ctx, x, y, spikeCurrentWidth, 1, palette.base, DISPLAY_SCALE);
                    if(spikeCurrentWidth > 0) drawScaledRect(ctx, x, y, 1, 1, palette.highlight, DISPLAY_SCALE);
                }
            }
        }
    }
}

/**
 * Draws decorations on the torso.
 */
function drawTorsoDecoration(ctx, torsoDims, torsoCenterX, decorationDetails, armorStyle) { // Added armorStyle
    if (!decorationDetails || decorationDetails.type === 'none') return;

    const { type, palette: decPalette, thickness } = decorationDetails;
    const torsoShape = torsoDims.torsoShapeInfo;

    if (type === 'border') {
        const borderWidth = Math.max(1, thickness || 2);
        for (let y = torsoDims.topY; y <= torsoDims.bottomY; y++) {
            if (!torsoShape[y]) continue;
            const rowInfo = torsoShape[y];

            for (let x = rowInfo.xStart; x < rowInfo.xStart + rowInfo.width; x++) {
                if (!isPointInDrawableTorso(x, y, torsoShape)) continue; // Skip neck pixels

                let isActualEdge = false;
                // Check N, S, E, W neighbors for non-torso pixels (respecting neckline)
                if (!isPointInDrawableTorso(x, y - 1, torsoShape)) isActualEdge = true;
                else if (!isPointInDrawableTorso(x, y + 1, torsoShape)) isActualEdge = true;
                else if (!isPointInDrawableTorso(x - 1, y, torsoShape)) isActualEdge = true;
                else if (!isPointInDrawableTorso(x + 1, y, torsoShape)) isActualEdge = true;

                if (isActualEdge) {
                    // Simple border: color the edge pixel
                    drawScaledRect(ctx, x, y, 1, 1, decPalette.base, DISPLAY_SCALE);
                    // For a thicker border, you'd need to draw inwards from this edge pixel
                    // This simplified version just colors the very edge.
                    // A more robust thick border would iterate 'b' from 0 to borderWidth-1
                    // and check if (x,y) is 'b' pixels away from a true non-torso pixel.
                }
            }
        }
    } else if (type === 'vertical_stripe') {
        // ... (vertical_stripe logic remains the same)
        const stripeWidth = Math.max(2, thickness || Math.floor(torsoDims.actualWidthAtShoulder * 0.15));
        const stripeX = torsoCenterX - Math.floor(stripeWidth / 2);
        for (let y = torsoDims.topY; y <= torsoDims.bottomY; y++) {
            if (!torsoShape[y] || torsoShape[y].isNeck) continue;
            for (let x_offset = 0; x_offset < stripeWidth; x_offset++) {
                const x = stripeX + x_offset;
                if (isPointInDrawableTorso(x, y, torsoShape)) {
                    drawScaledRect(ctx, x, y, 1, 1, decPalette.base, DISPLAY_SCALE);
                    if (x_offset === 0 && stripeWidth > 1) drawScaledRect(ctx, x, y, 1, 1, decPalette.highlight, DISPLAY_SCALE);
                    if (x_offset === stripeWidth -1 && stripeWidth > 1) drawScaledRect(ctx, x, y, 1, 1, decPalette.shadow, DISPLAY_SCALE);
                }
            }
        }
    } else if (type === 'horizontal_band') {
        // ... (horizontal_band logic remains the same)
        const bandHeight = Math.max(2, thickness || Math.floor((torsoDims.bottomY - torsoDims.topY) * 0.1));
        const bandY = torsoDims.topY + Math.floor(((torsoDims.bottomY - torsoDims.topY + 1) - bandHeight) / 2);
        for (let y_offset = 0; y_offset < bandHeight; y_offset++) {
            const y = bandY + y_offset;
            if (!torsoShape[y] || torsoShape[y].isNeck) continue;
            const rowInfo = torsoShape[y];
            for (let x = rowInfo.xStart; x < rowInfo.xStart + rowInfo.width; x++) {
                 if (isPointInDrawableTorso(x, y, torsoShape)) {
                    drawScaledRect(ctx, x, y, 1, 1, decPalette.base, DISPLAY_SCALE);
                    if (y_offset === 0 && bandHeight > 1) drawScaledRect(ctx, x, y, 1, 1, decPalette.highlight, DISPLAY_SCALE);
                    if (y_offset === bandHeight -1 && bandHeight > 1) drawScaledRect(ctx, x, y, 1, 1, decPalette.shadow, DISPLAY_SCALE);
                }
            }
        }
    } else if (type === 'cross') {
        // ... (cross logic remains the same)
        const armThickness = Math.max(2, thickness || Math.floor(torsoDims.actualWidthAtShoulder * 0.1));
        const verticalArmHeight = Math.floor((torsoDims.bottomY - torsoDims.topY) * 0.5);
        const horizontalArmWidth = Math.floor(torsoDims.actualWidthAtShoulder * 0.4);

        const vertArmX = torsoCenterX - Math.floor(armThickness / 2);
        const vertArmY = torsoDims.topY + Math.floor(((torsoDims.bottomY - torsoDims.topY + 1) - verticalArmHeight) / 2);
        for (let y_offset = 0; y_offset < verticalArmHeight; y_offset++) {
            for (let x_offset = 0; x_offset < armThickness; x_offset++) {
                if (isPointInDrawableTorso(vertArmX + x_offset, vertArmY + y_offset, torsoShape)) {
                    drawScaledRect(ctx, vertArmX + x_offset, vertArmY + y_offset, 1, 1, decPalette.base, DISPLAY_SCALE);
                }
            }
        }
        const horizArmY = torsoDims.topY + Math.floor(((torsoDims.bottomY - torsoDims.topY + 1) - armThickness) / 2);
        const horizArmX = torsoCenterX - Math.floor(horizontalArmWidth / 2);
        for (let x_offset = 0; x_offset < horizontalArmWidth; x_offset++) {
            for (let y_offset = 0; y_offset < armThickness; y_offset++) {
                 if (isPointInDrawableTorso(horizArmX + x_offset, horizArmY + y_offset, torsoShape)) {
                    drawScaledRect(ctx, horizArmX + x_offset, horizArmY + y_offset, 1, 1, decPalette.base, DISPLAY_SCALE);
                }
            }
        }
    } else if (type === 'leather_stitching' && (armorStyle === 'leather_vest' || armorStyle === 'studded_leather_armor')) {
        const stitchColor = decPalette.shadow; // Use shadow for contrast
        for (let y = torsoDims.topY + 1; y < torsoDims.bottomY -1; y += 3) {
            if (!torsoShape[y] || torsoShape[y].isNeck) continue;
            const rowInfo = torsoShape[y];
            // Stitch along left and right edges
            if (rowInfo.width > 2) {
                if(isPointInDrawableTorso(rowInfo.xStart + 1, y, torsoShape)) drawScaledRect(ctx, rowInfo.xStart + 1, y, 1, 1, stitchColor, DISPLAY_SCALE);
                if(isPointInDrawableTorso(rowInfo.xStart + rowInfo.width - 2, y, torsoShape)) drawScaledRect(ctx, rowInfo.xStart + rowInfo.width - 2, y, 1, 1, stitchColor, DISPLAY_SCALE);
            }
            // Random horizontal stitches
            if (Math.random() < 0.3 && rowInfo.width > 6) {
                const stitchLen = getRandomInt(2,4);
                const stitchX = rowInfo.xStart + getRandomInt(2, rowInfo.width - stitchLen - 2);
                 if(isPointInDrawableTorso(stitchX, y, torsoShape) && isPointInDrawableTorso(stitchX + stitchLen -1, y, torsoShape) )
                    drawScaledRect(ctx, stitchX, y, stitchLen, 1, stitchColor, DISPLAY_SCALE);
            }
        }
    } else if (type === 'plate_rivets' && (armorStyle === 'smooth_plate' || armorStyle === 'muscled_plate')) {
        const rivetColor = decPalette.highlight; // Use highlight for rivets
        for (let y = torsoDims.topY + 2; y < torsoDims.bottomY -2; y += getRandomInt(5,8)) {
            if (!torsoShape[y] || torsoShape[y].isNeck) continue;
            const rowInfo = torsoShape[y];
            if (rowInfo.width > 4) {
                if(isPointInDrawableTorso(rowInfo.xStart + 1, y, torsoShape)) drawScaledRect(ctx, rowInfo.xStart + 1, y, 1, 1, rivetColor, DISPLAY_SCALE);
                if(isPointInDrawableTorso(rowInfo.xStart + rowInfo.width - 2, y, torsoShape)) drawScaledRect(ctx, rowInfo.xStart + rowInfo.width - 2, y, 1, 1, rivetColor, DISPLAY_SCALE);
                if (Math.random() < 0.4 && rowInfo.width > 8) { // Central rivets
                    if(isPointInDrawableTorso(torsoCenterX, y, torsoShape)) drawScaledRect(ctx, torsoCenterX, y, 1, 1, rivetColor, DISPLAY_SCALE);
                }
            }
        }
    }
}


/**
 * Generates a procedural armor set.
 * @param {object} options - Options for generation, may include 'subType'.
 */
export function generateArmor(options = {}) {
    console.log("generateArmor (Pixel Art) called with options:", options);

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = CANVAS_WIDTH;
    offscreenCanvas.height = CANVAS_HEIGHT;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) {
        console.error("Failed to get 2D context for offscreen canvas in generateArmor.");
        return { type: 'armor', name: 'Error Armor', seed: Date.now(), itemData: { error: "Canvas context failed" }, imageDataUrl: createErrorDataURL("CTX Fail") };
    }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let armorStyle;
    const knownStyles = ['smooth_plate', 'muscled_plate', 'leather_vest', 'chainmail', 'scale_mail', 'studded_leather_armor', 'padded_armor'];

    if (options.subType && knownStyles.includes(options.subType)) {
        armorStyle = options.subType;
    } else {
        armorStyle = getRandomElement(['smooth_plate', 'muscled_plate', 'leather_vest']);
        console.warn(`Unknown or no subType provided for armor: '${options.subType}'. Defaulting to random style from defaults: ${armorStyle}`);
    }

    let mainMaterialName;
    if (armorStyle === 'leather_vest' || armorStyle === 'studded_leather_armor' || armorStyle === 'padded_armor') {
        const leatherMaterialOptions = ['LEATHER', 'BLACK_LEATHER', 'WHITE_LEATHER', 'DARK_BROWN_LEATHER', 'RED_LEATHER', 'GREEN_LEATHER', 'BLUE_LEATHER'];
        if (armorStyle === 'padded_armor' && Math.random() < 0.6) {
            mainMaterialName = getRandomElement(['CLOTH', 'WHITE_PAINT', 'BLACK_PAINT']);
        } else {
            mainMaterialName = getRandomElement(leatherMaterialOptions);
        }
    } else if (armorStyle === 'chainmail' || armorStyle === 'scale_mail') {
        mainMaterialName = getRandomElement(['IRON', 'STEEL', 'DARK_STEEL', 'BRONZE']);
    } else {
        const metalMaterials = ['STEEL', 'IRON', 'DARK_STEEL', 'BRONZE', 'SILVER', 'GOLD', 'ENCHANTED', 'OBSIDIAN'];
        mainMaterialName = getRandomElement(metalMaterials);
    }
    const mainPalette = getPalette(mainMaterialName);
    if (!mainPalette) {
        console.error(`Palette for ${mainMaterialName} not found! Defaulting to IRON.`);
        mainPalette = getPalette('IRON');
    }

    const necklineTypes = ['v_neck', 'round_neck', 'square_neck'];
    const necklineType = getRandomElement(necklineTypes);
    const necklineDepth = getRandomInt(Math.floor(LOGICAL_GRID_HEIGHT * 0.08), Math.floor(LOGICAL_GRID_HEIGHT * 0.15));
    const necklineWidth = getRandomInt(Math.floor(LOGICAL_GRID_WIDTH * 0.2), Math.floor(LOGICAL_GRID_WIDTH * 0.35));

    const torsoLogicalHeight = getRandomInt(Math.floor(LOGICAL_GRID_HEIGHT * 0.6), Math.floor(LOGICAL_GRID_HEIGHT * 0.85));
    const torsoBaseWidth = getRandomInt(Math.floor(LOGICAL_GRID_WIDTH * 0.45), Math.floor(LOGICAL_GRID_WIDTH * 0.65));
    const torsoWaistTaper = getRandomInt(Math.floor(torsoBaseWidth * 0.15), Math.floor(torsoBaseWidth * 0.30));

    const pauldronStyles = ['none', 'round_cap', 'layered_plate', 'spiked_plate'];
    let pauldronStyleToUse = (armorStyle === 'leather_vest' || armorStyle === 'padded_armor') ? 'none' : getRandomElement(pauldronStyles);
    if (armorStyle !== 'leather_vest' && armorStyle !== 'padded_armor' && pauldronStyleToUse === 'none' && Math.random() < 0.7) {
        pauldronStyleToUse = getRandomElement(pauldronStyles.filter(s => s !== 'none')) || pauldronStyleToUse;
    }

    let pauldronDetails = null;
    if (pauldronStyleToUse !== 'none') {
        const pauldronMaterials = [mainMaterialName, 'STEEL', 'IRON', 'DARK_STEEL', 'BRONZE'];
        let pauldronMaterialName = getRandomElement(pauldronMaterials);
        if (pauldronMaterialName === mainMaterialName && mainMaterialName !== 'LEATHER' && pauldronMaterials.length > 1) {
            pauldronMaterialName = getRandomElement(pauldronMaterials.filter(m => m !== mainMaterialName && m !== 'LEATHER')) || pauldronMaterialName;
        }
        const pauldronPalette = getPalette(pauldronMaterialName);
        if (pauldronPalette) {
            pauldronDetails = {
                style: pauldronStyleToUse,
                size: getRandomInRange(0.25, 0.40),
                palette: pauldronPalette,
                spikeSize: pauldronStyleToUse === 'spiked_plate' ? getRandomInt(Math.floor(LOGICAL_GRID_HEIGHT * 0.05), Math.floor(LOGICAL_GRID_HEIGHT * 0.10)) : 0
            };
        } else {
            pauldronStyleToUse = 'none';
        }
    }

    let decorationTypes = ['none', 'border', 'vertical_stripe', 'horizontal_band', 'cross'];
    if (armorStyle === 'leather_vest' || armorStyle === 'studded_leather_armor') {
        decorationTypes.push('leather_stitching');
    }
    if (armorStyle === 'smooth_plate' || armorStyle === 'muscled_plate') {
        decorationTypes.push('plate_rivets');
    }
    if (armorStyle === 'chainmail') {
        decorationTypes.push('chainmail_edging');
    }

    const torsoDecorationType = (armorStyle === 'muscled_plate') ? 'none' : getRandomElement(decorationTypes);
    let torsoDecorationDetails = null;
    if (torsoDecorationType !== 'none') {
        const decMaterials = [mainMaterialName, 'GOLD', 'SILVER', 'BRONZE', 'ENCHANTED', 'RED_PAINT', 'BLUE_PAINT', 'BLACK_PAINT', 'WHITE_PAINT'].filter(m => m !== mainMaterialName);
        const decMaterialName = getRandomElement(decMaterials.length > 0 ? decMaterials : [mainMaterialName]);
        const decPalette = getPalette(decMaterialName);
        if (decPalette) {
            torsoDecorationDetails = {
                type: torsoDecorationType,
                palette: decPalette,
                thickness: getRandomInt(2,4)
            };
        }
    }

    const armorCenterX = Math.floor(LOGICAL_GRID_WIDTH / 2);
    const armorTopY = Math.floor((LOGICAL_GRID_HEIGHT - torsoLogicalHeight) / 2) + CANVAS_PADDING;

    const torsoDetails = {
        logicalHeight: torsoLogicalHeight,
        baseWidth: torsoBaseWidth,
        waistTaper: torsoWaistTaper,
        palette: mainPalette,
        style: armorStyle,
        necklineType,
        necklineDepth,
        necklineWidth
    };
    const torsoDimensions = drawTorsoComponent(ctx, torsoDetails, armorCenterX, armorTopY, options);

    if (torsoDecorationDetails) {
        drawTorsoDecoration(ctx, torsoDimensions, armorCenterX, torsoDecorationDetails, armorStyle);
    }

    if (pauldronDetails) {
        drawPauldronsComponent(ctx, pauldronDetails, torsoDimensions, armorCenterX);
    }

    let subTypeNameForDisplay = options.subType ? options.subType.replace(/_/g, ' ') : armorStyle.replace(/_/g, ' ');
    subTypeNameForDisplay = subTypeNameForDisplay.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    let itemName = `${mainPalette.name} ${subTypeNameForDisplay}`;
     if (options.subType && options.subType.toLowerCase().replace(' ', '_') !== armorStyle && armorStyle !== subTypeNameForDisplay.toLowerCase().replace(' ', '_')) {
        itemName += ` (${armorStyle.replace(/_/g, ' ')})`;
    }


    if (torsoDecorationType !== 'none' && torsoDecorationDetails && torsoDecorationDetails.palette) {
        itemName += ` with ${torsoDecorationDetails.palette.name || ''} ${torsoDecorationType.replace(/_/g, ' ')}`;
    }
    if (pauldronStyleToUse !== 'none' && pauldronDetails && pauldronDetails.palette) {
        const pMatName = (pauldronDetails.palette && pauldronDetails.palette.name) ? pauldronDetails.palette.name : 'matching';
        itemName += ` and ${pMatName} ${pauldronDetails.style.replace(/_/g, ' ')} pauldrons`;
    }
    itemName += ` (${necklineType.replace('_',' ')})`;

    const itemSeed = options.seed || Date.now();

    const generatedItemData = {
        type: 'armor',
        name: itemName,
        seed: itemSeed,
        itemData: {
            subType: options.subType || armorStyle,
            style: armorStyle,
            material: mainMaterialName.toLowerCase(),
            colors: mainPalette,
            torso: {
                height: torsoLogicalHeight,
                baseWidth: torsoBaseWidth,
                waistTaper: torsoWaistTaper,
                neckline: necklineType,
                necklineDepth: necklineDepth,
                necklineWidth: necklineWidth,
                decoration: torsoDecorationDetails && torsoDecorationDetails.palette ? {
                    type: torsoDecorationDetails.type,
                    material: (torsoDecorationDetails.palette.name || '').toLowerCase(),
                    colors: torsoDecorationDetails.palette
                } : null
            },
            pauldrons: pauldronDetails && pauldronDetails.palette ? {
                style: pauldronDetails.style,
                material: ((pauldronDetails.palette && pauldronDetails.palette.name) || mainMaterialName).toLowerCase(),
                sizeRatio: pauldronDetails.size,
                spikeSize: pauldronDetails.spikeSize,
                colors: pauldronDetails.palette
            } : null,
        },
        imageDataUrl: offscreenCanvas.toDataURL()
    };

    console.log(`Armor generated: ${generatedItemData.name}, Input SubType: ${options.subType}, Used Style: ${armorStyle}`);
    return generatedItemData;
}

/** Helper to create a simple Data URL for error states */
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
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAACNJREFUOI1jZGRgYPgPykCATQIKyMBKjEwM0AAGsAF JVMQvAgADqgH5kG3fXAAAAABJRU5ErkJggg==";
}

console.log("js/generators/armor_generator.js (Enhanced Variations & Decorations) loaded.");
