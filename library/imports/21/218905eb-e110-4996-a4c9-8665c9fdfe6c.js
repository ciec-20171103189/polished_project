"use strict";
cc._RF.push(module, '21890Xr4RBJlqTJhmXJ/f5s', 'Star');
// scripts/Star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        pickRadius: 0
    },

    onLoad: function onLoad() {
        this.enabled = false;
    },

    init: function init(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },

    reuse: function reuse(game) {
        this.init(game);
    },


    getPlayerDistance: function getPlayerDistance() {

        var playerPos = this.game.player.getCenterPos();

        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function onPicked() {
        var pos = this.node.getPosition();

        this.game.gainScore(pos);

        this.game.despawnStar(this.node);
    },

    update: function update(dt) {

        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
});

cc._RF.pop();