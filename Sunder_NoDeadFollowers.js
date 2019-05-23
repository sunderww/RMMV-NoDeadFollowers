//=============================================================================
// NoDeadFollowers
//=============================================================================


/*:
 * @plugindesc The dead characters from the party are not drawn anymore on screen
 * @author Sunderw
 * @help
 * This plugin prevents the dead characters from following the player,
 * for more realism.
 * It works by making dead characters not visible, and putting them at the end
 * of the followers (otherwise it leaves a blank between two characters).
 */

(function() {

  // This part puts the dead followers at the back of the party
  var _old_Game_Party_battleMembers = Game_Party.prototype.battleMembers;
  Game_Party.prototype.battleMembers = function() {
    return _old_Game_Party_battleMembers.call(this).sort(function(a, b) {
      return a.isDead() - b.isDead();
    });
  }

  // While this part just does not draw the dead ones
  var _old_Game_Follower_isVisible = Game_Follower.prototype.isVisible;
  Game_Follower.prototype.isVisible = function() {
    var isVisible = _old_Game_Follower_isVisible.call(this);
    return isVisible && !this.actor().isDead();
  };

  var _old_Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    console.log("TERMINATE SCENE BATTLE");
    $gamePlayer.refresh();
    _old_Scene_Battle_terminate.call(this);
  }

})();
