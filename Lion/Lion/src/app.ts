module Castlevania {

    export class Game extends Phaser.Game {

        constructor() {

            super(800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Boot, false);

            this.state.start('Boot');

        }

    }

    class Boot extends Phaser.State {
        create() {
            var text = "Hello Phaser";
            var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
            this.game.add.text(0, 0, text, style);
        }
    }

} 

window.onload = () => {
    new Castlevania.Game();
};