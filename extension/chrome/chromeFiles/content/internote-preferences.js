// Internote Extension
// Preferences Back End
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

var internotePreferences = {

init: function(utils)
{
    this.utils = utils;
    this.prefs = this.utils.getCCService("@mozilla.org/preferences-service;1", "nsIPrefService").getBranch("internote.");
},

getBoolPref: function(prefName, defaultValue)
{
    if (this.prefs.getPrefType(prefName) != 0)
    {
        if (this.prefs.getBoolPref(prefName))
            return true;
        else
            return false;
    }
    else
    {
        return defaultValue;
    }
},                  

getCharPref: function(prefName, defaultValue)
{
    if (this.prefs.getPrefType(prefName) !=0)
    {
        return this.prefs.getCharPref(prefName);
    }
    else
    {
        return defaultValue;
    }
},
                                    
getEnumPref: function(prefName, defaultValue, maxValue)
{
    if (this.prefs.getPrefType(prefName) !=0)
    {
        var prefValue = this.prefs.getCharPref(prefName);
        if (prefValue.match(/^[0-9]+$/))
        {
            var num = parseInt(prefValue, 10);
            if (0 <= num && num <= maxValue)
            {
                return num;
            }
        }
    }
    return defaultValue;
},

getFontSize : function()
{
    if (this.prefs.getPrefType("fontsize") !=0)
    {
        var defaultFontSize = this.prefs.getCharPref("fontsize");
        if (defaultFontSize == "10") return 10;
        if (defaultFontSize == "12") return 12;
        if (defaultFontSize == "14") return 14;
        if (defaultFontSize == "16") return 16;
        if (defaultFontSize == "18") return 18;
        return this.prefs.getCharPref("fontsize");
    }
    else
    {
        return 12;
    }
},

shouldUseStatusbar      : function() { return this.getBoolPref("usestatusbar",    true ); },
shouldUseTransparency   : function() { return this.getBoolPref("transparency",    false); },
shouldAllowHighlighting : function() { return this.getBoolPref("highlightable",   false); },
shouldUseNativeScrollbar: function() { return this.getBoolPref("usenativescroll", false); },
shouldUseOtherSaveLoc   : function() { return this.getBoolPref("changelocation",  false); },
shouldAskBeforeDelete   : function() { return this.getBoolPref("askbeforedelete", false); },

// This is a hidden preference for the purpose of debugging.
isInDebugMode: function() { return this.getBoolPref("debugmode", false); },

setSaveLocationPref: function(path)
{
    if (path == null || path == "")
    {
        this.prefs.setBoolPref("changelocation", false)
        this.prefs.setCharPref("savelocation", "");
    }
    else
    {
        this.prefs.setBoolPref("changelocation", true);
        this.prefs.setCharPref("savelocation", path);
    }
},

getSaveLocationPref: function()
{
    if (this.shouldUseOtherSaveLoc())
    {
        return this.getCharPref("savelocation", "");
    }
    else
    {
        return "";
    }
},

getModifiedSaveLocation: function()
{
    var loc = this.getSaveLocationPref();
    
    if (loc == "")
    {
        return null;
    }
    else
    {
        return this.utils.getFile(loc);
    }
},

// XXX Demagic
getDefaultSize      : function() { return this.getEnumPref("defaultsize",      0, 3); },
getDefaultPosition  : function() { return this.getEnumPref("defaultposition",  0, 4); },
getDefaultNoteColor : function() { return this.getEnumPref("defaultnotecolor", 0, 5); },
getDefaultTextColor : function() { return this.getEnumPref("defaulttextcolor", 0, 5); },

detectFirstRun : function()
{
    if (this.prefs.getPrefType("firstrun") != 0)
    {
        if (!this.prefs.getBoolPref("firstrun"))
        {
            this.prefs.setBoolPref("firstrun", true);
            return true;
        }
        else
        {
            return false;
        }
    }
    
    this.prefs.setBoolPref("firstrun", true);
    return true;
},

};