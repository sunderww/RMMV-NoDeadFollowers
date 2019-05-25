/*
==============================================================================
No Dead Followers
Written by Sunderww (Lucas BERGOGNON)
Started On: 23/05/2019

Put the dead characters at the end of the party, and, if present in the
followers, they are not drawn on the map.

==============================================================================
Terms of Use: MIT License
==============================================================================

Copyright (c) 2019 Lucas BERGOGNON

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

==============================================================================
*/


/*:
 * @plugindesc Allows you to put encounters on map and have information on
 * which troop it is (popup above the event)
 * @author Sunderww
 * @version 1.0
 *
 * @help
 * ===========================================================================
 * Description
 * ===========================================================================
 *
 * This plugin prevents the dead characters from following the player,
 * for more realism, and put them automatically at the end of the party.
 * It works by making dead characters not visible, and putting them at the end
 * of the followers (otherwise it leaves a blank between two characters).
 *
 * ===========================================================================
 * How to use this plugin
 * ===========================================================================
 *
 * Just add it to the plugin manager and it's done !
 *
 * ===========================================================================
 * Changelog
 * ===========================================================================
 *
 * version 1.0:
 *  - Initial release
 */


(function() {

  // This part puts the dead followers at the back of the party
  var _old_Game_Party_battleMembers = Game_Party.prototype.battleMembers;
  Game_Party.prototype.battleMembers = function() {
    return _old_Game_Party_battleMembers.call(this).sort(function(a, b) {
      return a.isDead() - b.isDead();
    });
  }

  // Put the dead characters at the end of the party
  Game_Party.prototype.putDeadCharactersAtEndOfParty = function() {
    // Just sort this._actors
    console.log(this);
    this._actors.sort(function(a, b) {
      // Documentation state that Game_Party._actors is an array of Game_Actor
      // but for some reason it's just the Ids for me.
      if (!(a instanceof Game_Actor))
        a = $gameActors._data[a];
      if (!(b instanceof Game_Actor))
        b = $gameActors._data[b];
      return a.isDead() - b.isDead();
    })
  };

  // While this part just does not draw the dead ones
  var _old_Game_Follower_isVisible = Game_Follower.prototype.isVisible;
  Game_Follower.prototype.isVisible = function() {
    var isVisible = _old_Game_Follower_isVisible.call(this);
    return isVisible && !this.actor().isDead();
  };

  // Refresh players after a fight otherwise dead followers are still there
  var _old_Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    _old_Scene_Battle_terminate.call(this);
    $gameParty.putDeadCharactersAtEndOfParty();
    $gamePlayer.refresh();
  };

})();
