"use strict";
cc._RF.push(module, '0486fOqHrJN+6c5PQg5FHh9', 'Game');
// scripts/Game.js

'use strict';

var Player = require('Player');
var ScoreFX = require('ScoreFX');
var Star = require('Star');

var Game = cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
            default: null,
            type: cc.Node
        },

        player: {
            default: null,
            type: Player
        },

        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        btnNode: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        controlHintLabel: {
            default: null,
            type: cc.Label
        },
        keyboardHint: {
            default: '',
            multiline: true
        },
        touchHint: {
            default: '',
            multiline: true
        }
    },

    onLoad: function onLoad() {

        this.groundY = this.ground.y + this.ground.height / 2;

        this.currentStar = null;
        this.currentStarX = 0;

        this.timer = 0;
        this.starDuration = 0;

        this.enabled = false;

        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');
    },

    onStartGame: function onStartGame() {

        this.resetScore();
        this.enabled = true;
        this.btnNode.x = 3000;
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.v2(0, this.groundY));

        this.spawnNewStar();
    },

    spawnNewStar: function spawnNewStar() {
        var newStar = null;

        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        } else {
            newStar = cc.instantiate(this.starPrefab);
        }

        this.node.addChild(newStar);

        newStar.setPosition(this.getNewStarPosition());

        newStar.getComponent('Star').init(this);

        this.startTimer();
        this.currentStar = newStar;
    },

    despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },


    startTimer: function startTimer() {

        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {

        if (!this.currentStar) {
            this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width / 2;
        }
        var randX = 0;

        var randY = this.groundY + Math.random() * this.player.jumpHeight + 50;

        var maxX = this.node.width / 2;
        if (this.currentStarX >= 0) {
            randX = -Math.random() * maxX;
        } else {
            randX = Math.random() * maxX;
        }
        this.currentStarX = randX;

        return cc.v2(randX, randY);
    },

    gainScore: function gainScore(pos) {
        this.score += 1;

        this.scoreDisplay.string = 'Score: ' + this.score.toString();

        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();

        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnScoreFX: function spawnScoreFX() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    },

    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },


    update: function update(dt) {

        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    },

    gameOver: function gameOver() {
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.btnNode.x = 0;
    }
});

cc._RF.pop();