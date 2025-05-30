/**
 * js/palettes/material_palettes.js
 * Defines color palettes for different materials.
 */

export const MATERIAL_PALETTES = {
    IRON: {
        name: 'Iron',
        base: '#8A8A8A',    
        shadow: '#6B6B6B',  
        highlight: '#A9A9A9', 
        outline: '#4D4D4D'   
    },
    WOOD: {
        name: 'Wood',
        base: '#8B4513',    
        shadow: '#5C2E0D',  
        highlight: '#A0522D', 
        outline: '#3E1F09'   
    },
    STEEL: {
        name: 'Steel',
        base: '#B0C4DE',    
        shadow: '#778899',  
        highlight: '#E6E6FA', 
        outline: '#46505A'   
    },
    DARK_STEEL: {
        name: 'Dark Steel',
        base: '#5A5A6A',    
        shadow: '#3E3E48',  
        highlight: '#7E7E8C', 
        outline: '#2C2C33'   
    },
    GOLD: {
        name: 'Gold',
        base: '#FFD700',    
        shadow: '#B8860B',  
        highlight: '#FFFACD', 
        outline: '#806000'   
    },
    LEATHER: { 
        name: 'Leather',
        base: '#A0522D',    
        shadow: '#5F341A',  
        highlight: '#CD853F', 
        outline: '#4A2914'   
    },
    BLACK_LEATHER: {
        name: 'Black Leather',
        base: '#3A3A3A',    
        shadow: '#202020',  
        highlight: '#555555', 
        outline: '#101010'   
    },
    WHITE_LEATHER: {
        name: 'White Leather',
        base: '#F0EBE0',    
        shadow: '#D4CCC0',  
        highlight: '#FFFFFF', 
        outline: '#B0A89F'   
    },
    DARK_BROWN_LEATHER: { 
        name: 'Dark Brown Leather',
        base: '#5D3A1A',    
        shadow: '#3E1F09',  
        highlight: '#7B4F2E', 
        outline: '#2C1505'   
    },
    DARK_LEATHER: { // Alias for DARK_BROWN_LEATHER for compatibility
        name: 'Dark Leather',
        base: '#5D3A1A',    
        shadow: '#3E1F09',  
        highlight: '#7B4F2E', 
        outline: '#2C1505'   
    },
    RED_LEATHER: {
        name: 'Red Leather',
        base: '#8B0000',    
        shadow: '#5E0000',  
        highlight: '#B22222', 
        outline: '#400000'   
    },
    GREEN_LEATHER: {
        name: 'Green Leather',
        base: '#006400',    
        shadow: '#004D00',  
        highlight: '#228B22', 
        outline: '#002A00'   
    },
    BLUE_LEATHER: {
        name: 'Blue Leather',
        base: '#00008B',    
        shadow: '#00005E',  
        highlight: '#4169E1', 
        outline: '#000040'   
    },
    BRONZE: {
        name: 'Bronze',
        base: '#CD7F32',    
        shadow: '#8C5A23',  
        highlight: '#D2A679', 
        outline: '#5D3A1A'   
    },
    SILVER: {
        name: 'Silver',
        base: '#C0C0C0',    
        shadow: '#A0A0A0',  
        highlight: '#E0E0E0', 
        outline: '#707070'   
    },
    OBSIDIAN: {
        name: 'Obsidian',
        base: '#201A23',    
        shadow: '#0D0C0F',  
        highlight: '#3A3042', 
        outline: '#000000'   
    },
    BONE: {
        name: 'Bone',
        base: '#F5F5DC',    
        shadow: '#D2B48C',  
        highlight: '#FFFFF0', 
        outline: '#A08C78'   
    },
    IVORY: {
        name: 'Ivory',
        base: '#FFFFF0',    
        shadow: '#E0E0D1',  
        highlight: '#FFFFFF', 
        outline: '#B0B0A1'   
    },
    STONE: {
        name: 'Stone',
        base: '#808080',    
        shadow: '#5A5A5A',  
        highlight: '#A9A9A9', 
        outline: '#404040'   
    },
    COPPER: {
        name: 'Copper',
        base: '#B87333',    
        shadow: '#8C5828',  
        highlight: '#D9904A', 
        outline: '#5A3A1A'   
    },
    GREEN_LEAF: {
        name: 'Green Leaf',
        base: '#2E8B57',    
        shadow: '#1E5638',  
        highlight: '#3CB371', 
        outline: '#143D24'   
    },
    PAPER: {
        name: 'Paper',
        base: '#FEFDF4',    
        shadow: '#EAE8D8',  
        highlight: '#FFFFFF', 
        outline: '#C0B8A8'   
    },
    PARCHMENT: {
        name: 'Parchment',
        base: '#F5EAAA',    
        shadow: '#D2B48C',  
        highlight: '#FFF8DC', 
        outline: '#A08C78'   
    },
    RED_PAINT: {
        name: 'Red Paint',
        base: '#B22222', shadow: '#800000', highlight: '#DC143C', outline: '#500000'
    },
    GREEN_PAINT: {
        name: 'Green Paint',
        base: '#228B22', shadow: '#006400', highlight: '#3CB371', outline: '#003300'
    },
    BLUE_PAINT: {
        name: 'Blue Paint',
        base: '#4682B4', shadow: '#000080', highlight: '#5F9EA0', outline: '#000050'
    },
    BLACK_PAINT: {
        name: 'Black Paint',
        base: '#2F4F4F', shadow: '#1C1C1C', highlight: '#696969', outline: '#000000' // Adjusted highlight
    },
    WHITE_PAINT: { 
        name: 'White Paint',
        base: '#F5F5F5', shadow: '#D3D3D3', highlight: '#FFFFFF', outline: '#A9A9A9'
    },
    YELLOW_PAINT: {
        name: 'Yellow Paint',
        base: '#FFD700', shadow: '#DAA520', highlight: '#FFFFE0', outline: '#B8860B'
    },
    PURPLE_PAINT: {
        name: 'Purple Paint',
        base: '#8A2BE2', shadow: '#4B0082', highlight: '#9932CC', outline: '#3A005A'
    },
    CLOTH: { // Changed to use CLOTH_FABRIC values
        name: 'Cloth',
        base: '#D2B48C',    // Tan / Undyed Linen
        shadow: '#A0522D',  // Sienna for folds
        highlight: '#F5DEB3', // Wheat for highlights
        outline: '#8B4513'   // SaddleBrown for outline
    },
    CLOTH_FABRIC: { 
        name: 'Cloth Fabric',
        base: '#D2B48C',    
        shadow: '#A0522D',  
        highlight: '#F5DEB3', 
        outline: '#8B4513'   
    },
    ENCHANTED_SILK: { // Changed to use SILK_MAGICAL values
        name: 'Enchanted Silk',
        base: '#E6E6FA',    // Lavender - soft, magical base
        shadow: '#9370DB',  // MediumPurple - for folds and depth
        highlight: '#FFFFFF', // Pure White - for shimmer
        outline: '#8A2BE2'   // BlueViolet - for a defined edge
    },
    SILK_MAGICAL: { 
        name: 'Magical Silk',
        base: '#E6E6FA',    
        shadow: '#9370DB',  
        highlight: '#FFFFFF', 
        outline: '#8A2BE2'   
    },
    GEM_RED: {
        name: 'Red Gem',
        base: '#FF0000', shadow: '#8B0000', highlight: '#FFC0CB', outline: '#4D0000'
    },
    GEM_BLUE: {
        name: 'Blue Gem',
        base: '#0000FF', shadow: '#00008B', highlight: '#ADD8E6', outline: '#00004D'
    },
    GEM_GREEN: {
        name: 'Green Gem',
        base: '#008000', shadow: '#006400', highlight: '#90EE90', outline: '#003300'
    },
    GEM_PURPLE: {
        name: 'Purple Gem',
        base: '#800080', shadow: '#4B0082', highlight: '#DA70D6', outline: '#300030'
    },
    GEM_YELLOW: {
        name: 'Yellow Gem',
        base: '#FFDB58', shadow: '#B8860B', highlight: '#FFFFE0', outline: '#A07400'
    },
    GEM_ORANGE: {
        name: 'Orange Gem',
        base: '#FFA500', shadow: '#CC8400', highlight: '#FFDAB9', outline: '#A66300'
    },
    GEM_CYAN: {
        name: 'Cyan Gem',
        base: '#00FFFF', shadow: '#008B8B', highlight: '#E0FFFF', outline: '#006060'
    },
    GEM_WHITE: { 
        name: 'White Gem',
        base: '#F0F8FF', shadow: '#B0C4DE', highlight: '#FFFFFF', outline: '#778899'
    },
    PEARL: {
        name: 'Pearl',
        base: '#FDF5E6', shadow: '#E0D8C9',highlight: '#FFFFFF',outline: '#C0B8AB'
    },
    OPAL: { 
        name: 'Opal',
        base: '#E6E6FA', shadow: '#B0C4DE', highlight: '#FFFFFF', outline: '#A0A0C0'
    },
    ENCHANTED: { 
        name: 'Enchanted',
        base: '#7B68EE', shadow: '#483D8B', highlight: '#AFEEEE', outline: '#2F2074'
    },
    SILK_STRING: {
        name: 'Silk String',
        base: '#F5F5F5', shadow: '#DCDCDC', highlight: '#FFFFFF', outline: '#B0B0B0'
    },
    GUT_STRING: {
        name: 'Gut String',
        base: '#F0E68C', shadow: '#BDB76B', highlight: '#FFFACD', outline: '#8B864E'
    },
    WIRE_STRING: {
        name: 'Wire String',
        base: '#A9A9A9', shadow: '#696969', highlight: '#D3D3D3', outline: '#404040'
    },
    ROPE: { 
        name: 'Rope',
        base: '#D2B48C', 
        shadow: '#8B7355', 
        highlight: '#E6CBA5', 
        outline: '#5D4A36'  
    },
    ROPE_BROWN: { // Added for explicit use by boots_generator if needed
        name: 'Brown Rope',
        base: '#8B4513',    // SaddleBrown
        shadow: '#5C2E0D',  // Darker brown
        highlight: '#A0522D', // Sienna
        outline: '#3E1F09'
    },
    FUR_WHITE: { 
        name: 'White Fur',
        base: '#FFFFFF', shadow: '#E0E0E0', highlight: '#F8F8F8', outline: '#D0D0D0'
    },
    FUR_BROWN: { 
        name: 'Brown Fur',
        base: '#A0522D', shadow: '#5F341A', highlight: '#CD853F', outline: '#4A2914'
    },
    STRAW: {
        name: 'Straw',
        base: '#F0E68C', shadow: '#DAA520', highlight: '#FFFFE0', outline: '#B8860B'
    }
};

/**
 * Gets a specific palette by name.
 * @param {string} name - The name of the material (e.g., "IRON", "WOOD").
 * @returns {object | undefined} The palette object or undefined if not found.
 */
export function getPalette(name) {
    if (!name) {
        console.warn(`Palette name is undefined. Using IRON as default.`);
        return MATERIAL_PALETTES.IRON;
    }
    const upperName = name.toUpperCase();
    if (MATERIAL_PALETTES[upperName]) {
        return MATERIAL_PALETTES[upperName];
    }
    console.warn(`Palette "${name}" not found. Using IRON as default.`);
    return MATERIAL_PALETTES.IRON; // Default fallback
}

console.log("js/palettes/material_palettes.js (Footwear Palette Fixes & Additions) loaded.");
