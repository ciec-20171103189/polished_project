cc.Class({
    extends: cc.Component,

    properties: {

        pickRadius: 0,
    },

    onLoad: function () {
        this.enabled = false;
    },

    init: function (game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },

    reuse (game) {
        this.init(game);
    },

    getPlayerDistance: function () {

        var playerPos = this.game.player.getCenterPos();

        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function() {
        var pos = this.node.getPosition();

        this.game.gainScore(pos);

        this.game.despawnStar(this.node);
    },

    update: function (dt) {

        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }

        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
