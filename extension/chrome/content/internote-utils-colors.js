// Internote Extension
// Color Utilities
// Copyright (C) 2010 Matthew Tuck
// Copyright (C) 2006 Tim Horton
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

// This file contains utilities for parsing, formatting and manipulating colors.

internoteSharedGlobal_e3631030_7c02_11da_a72b_0800200c9a66.utils.incorporate("ColorUtils", {

RED_COMP  : 0,
GREEN_COMP: 1,
BLUE_COMP : 2,
ALPHA_COMP: 3,

MAX_INTENSITY: 255,

// PUBLIC: Convert a CSS RGB color to a CSS hex color.
convertRGBToHex : function(color)
{
    var colorArray = this.parseRGBColor(color);
    return this.formatHexColor(colorArray);
},

// PUBLIC: Convert a CSS hex color to a CSS RGB color.
convertHexToRGB : function(color)
{
    var colorArray = this.parseHexColor(color);
    return this.formatRGBColor(colorArray);
},

// PUBLIC: Convert a CSS hex color and a given alpha value to a CSS RGBA color.
convertHexToRGBA : function(color, alpha)
{
    var colorArray = this.parseHexColor(color);
    colorArray = this.addAlpha(colorArray, alpha);
    return this.formatRGBAColor(colorArray);
},

// PUBLIC: Given an RGBA "front" color array & an RGB "back" color array, calculates the composited colour.
alphaBlend : function(frontColorArray, backColorArray)
{
    var translucency = frontColorArray[ALPHA_COMP];
    
    var r = Math.round(translucency       * frontColorArray[RED_COMP  ] +
                       (1 - translucency) * backColorArray [RED_COMP  ]);
    var g = Math.round(translucency       * frontColorArray[GREEN_COMP] +
                       (1 - translucency) * backColorArray [GREEN_COMP]);
    var b = Math.round(translucency       * frontColorArray[BLUE_COMP ] +
                       (1 - translucency) * backColorArray [BLUE_COMP ]);
    
    return [r, g, b];
},

// PUBLIC: Given an RGB color array and a given alpha value, returns an RGBA color array.
addAlpha : function(colorArray, alpha)
{
    this.assertError(colorArray.length == 3, "Not a proper RGB array when adding alpha.");
    this.assertError(typeof(alpha) == "number" && this.isBetween(alpha, 0, 1), "Trying to add invalid alpha.");
    return [colorArray[this.RED_COMP], colorArray[this.GREEN_COMP], colorArray[this.BLUE_COMP], alpha];
},

// PUBLIC: Given an RGB color array, returns a lighter version, given a proportion.
// 0.0 = No Change, 1.0 = White
lighten : function(colorArray, proportion)
{
    this.assertError(colorArray.length == 3, "Not a proper RGB array when lightening.");
    this.assertError(typeof(proportion) == "number" && this.isBetween(proportion, 0, 1), "Trying to lighten invalid proportion.");
    
    var rDistance = this.MAX_INTENSITY - colorArray[this.RED_COMP  ];
    var gDistance = this.MAX_INTENSITY - colorArray[this.GREEN_COMP];
    var bDistance = this.MAX_INTENSITY - colorArray[this.BLUE_COMP ];
    
    var r = Math.ceil(colorArray[this.RED_COMP  ] + proportion * rDistance);
    var g = Math.ceil(colorArray[this.GREEN_COMP] + proportion * gDistance);
    var b = Math.ceil(colorArray[this.BLUE_COMP ] + proportion * bDistance);
    
    return [r, g, b];
},

// PUBLIC: Given an RGB color array, returns a darker version, given a proportion.
// 0.0 = No Change, 1.0 = Black
darken : function(colorArray, proportion)
{
    this.assertError(colorArray.length == 3, "Not a proper RGB array when darkening.");
    this.assertError(typeof(proportion) == "number" && this.isBetween(proportion, 0, 1), "Trying to darken invalid proportion.");
    
    var rDistance = colorArray[this.RED_COMP  ];
    var gDistance = colorArray[this.GREEN_COMP];
    var bDistance = colorArray[this.BLUE_COMP ];
    
    var r = Math.floor((1 - proportion) * colorArray[this.RED_COMP  ]);
    var g = Math.floor((1 - proportion) * colorArray[this.GREEN_COMP]);
    var b = Math.floor((1 - proportion) * colorArray[this.BLUE_COMP ]);
    
    return [r, g, b];
},

// PUBLIC: Given an intensity between 0 and MAX_INTENSITY, formats it to a two-hex-digit string.
formatHexComponent : function(intensity)
{
    var roundedIntensity = Math.round(intensity);
    return this.hexDigit(Math.floor(roundedIntensity/16)) + this.hexDigit(roundedIntensity%16);
},

// PUBLIC: Given a CSS hex color, parses it to an RGB array.
parseHexColor : function(color)
{
    this.assertError(this.isHexColor(color), "Not a hex color when parsing.", color);
    var r = parseInt(color.substring(1,3), 16);
    var g = parseInt(color.substring(3,5), 16);
    var b = parseInt(color.substring(5,7), 16);
    return [r, g, b];
},

// PUBLIC: Given a CSS RGB color, parses it to an RGB array.
// XXX Should support percentages.
parseRGBColor : function(color)
{
    var numRegexp = "[0-9]+";
    var spaceRegexp = "\\s*";
    var spacedNumRegexp = spaceRegexp + "(" + numRegexp + ")" + spaceRegexp;
    var entireRegexp = "^" + spaceRegexp + "rgb" + spaceRegexp + "\\(" + spacedNumRegexp + "," +
                       spacedNumRegexp + "," + spacedNumRegexp + "\\)" + spaceRegexp + "$";
    
    var regexpResults = new RegExp(entireRegexp).exec(color);
    
    if (regexpResults == null)
    {
        this.assertWarnNotHere("Not a RGB color when parsing.", color);
        return null;
    }
    else
    {
        return [regexpResults[1], regexpResults[2], regexpResults[3]];
    }
},

// PUBLIC: Given a CSS RGBA color, parses it to an RGBA array.
// XXX Should support percentages.
parseRGBAColor : function(color)
{
    var numRegexp = "[0-9]+";
    var spaceRegexp = "\\s*";
    var spacedNumRegexp = spaceRegexp + "(" + numRegexp + ")" + spaceRegexp;
    var entireRegexp = "^" + spaceRegexp + "rgb" + spaceRegexp + "\\(" + spacedNumRegexp + "," +
                       spacedNumRegexp + "," + spacedNumRegexp + "," + spacedNumRegexp +
                       "\\)" + spaceRegexp + "$";
    
    var regexpResults = new RegExp(entireRegexp).exec(color);
    
    if (regexpResults == null)
    {
        this.assertWarnNotHere("Not a RGBA color when parsing.");
        return null;
    }
    else
    {
        return [regexpResults[1], regexpResults[2], regexpResults[3], regexpResults[4]];
    }
},

// PUBLIC: Given an RGB array, formats it to a CSS hex color.
formatHexColor : function(array)
{
    this.assertError(array.length == 3, "Not a proper RGB array when formatting hex color.");
    var [r, g, b] = array;
    return "#" + this.formatHexComponent(r) + this.formatHexComponent(g) + this.formatHexComponent(b);
},

// PUBLIC: Given an RGB array, formats it to a CSS RGB color.
formatRGBColor : function(array)
{
    this.assertError(array.length == 3, "Not a proper RGB array when formatting RGB color.");
    return "rgb(" + array[0] + ", " + array[1] + ", " + array[2] + ")";
},

// PUBLIC: Given an RGB array, formats it to a CSS RGBA color.
formatRGBAColor : function(array)
{
    this.assertError(array.length == 4, "Not a proper RGBA array when formatting RGB color.");
    return "rgba(" + array[0] + ", " + array[1] + ", " + array[2] + ", " + array[3] + ")";
},

// PUBLIC: Checks whether an object is a valid CSS hex color string.
isHexColor : function(color)
{
    if (typeof(color) == "string")
    {
        return color.match(/^#[0-9A-F]{6}$/i) ? true : false;
    }
    else
    {
        return false;
    }
},

// PUBLIC: Checks whether an object is a valid CSS RGB color string.
isRGBColor : function(color)
{
    if (typeof(color) == "string")
    {
        // XXX Allow spaces?
        return color.match(/^\s*rgb\s*\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*\)\s*$/) ? true : false;
    }
    else
    {
        return false;
    }
},

// PUBLIC: Checks whether an object is a valid CSS RGBA color string.
isRGBAColor : function(color)
{
    if (typeof(color) == "string")
    {
        // XXX Allow spaces?
        return color.match(/^\s*rgb\s*\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*\)\s*$/) ? true : false;
    }
    else
    {
        return false;
    }
},

// PUBLIC: Linear interpolator between two colors.
// proportion = 0.0 => color1, proportion = 1.0 => color2
interpolateColor: function(proportion, color1, color2)
{
    return [Math.round(this.interpolate(proportion, color1[0], color2[0])),
            Math.round(this.interpolate(proportion, color1[1], color2[1])),
            Math.round(this.interpolate(proportion, color1[2], color2[2]))];
},

});
