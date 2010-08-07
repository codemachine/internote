// Internote Extension
// Platform Detection Utilities
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

internoteUtilities.incorporate({

getPlatform: function()
{
    var platform = new String(navigator.platform);
    var platString = "";
    if (!platform.search(/^Mac/))
    {
       return "mac";
    }
    else if (!platform.search(/^Win/))
    {
       return "win";
    }
    else
    {
       return "unix";
    }
},

supportsTranslucentPopups: function()
{
    var platform = this.getPlatform();
    if (platform == "win" || platform == "mac")
    {
        return true;
    }
    else if (platform == "unix")
    {
        return false;
    }
    else
    {
        this.assertWarnNotHere("Unknown platform when testing translucent popups.", platform);
        return false;
    }
},

supportsTransparentClickThru: function()
{
    var platform = this.getPlatform();
    if (platform == "win" || platform == "unix")
    {
        return true;
    }
    else if (platform == "mac")
    {
        return false;
    }
    else
    {
        this.assertWarnNotHere("Unknown platform when testing transparent clickthru.", platform);
        return false;
    }
},

hasCombinedScrollButtons: function()
{
    return this.getPlatform() == "mac";
},

hasLeftAlignedTopButtons: function()
{
    return this.getPlatform() == "mac";
},

});
