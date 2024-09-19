import scene1Img1 from "assets/sceneOne/Scene1-1.png";
import scene1Img2 from "assets/sceneOne/Scene1-2.png";

export default class SceneOne extends Phaser.Scene {
  constructor() {
    //scene key
    super("scene1");
  }

  preload() {
    this.load.image("scene1Img1", scene1Img1);
    this.load.image("scene1Img2", scene1Img2);
  }

  create() {
    this.cameras.main.setBackgroundColor("#223752");

    const scene1Img1 = this.add.image(400, 200, "scene1Img1");
    const scene1Img2 = this.add.image(1400, 800, "scene1Img2");

    this.tweens.add({
      targets: scene1Img1,
      y: 800,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });

    this.tweens.add({
      targets: scene1Img2,
      y: 880,
      duration: 1000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });

    this.input.keyboard?.addKey("F").on("down", () => {
      this.scale.toggleFullscreen();
    });

    this.input.keyboard?.addKey("ESC").on("down", () => {
      this.game.destroy(true);
      window.close();
    });

    this.input.keyboard?.addKey("SPACE").on("down", () => {
      this.scene.start("scene2");
    });

    const textZeo = new Phaser.GameObjects.Text(this, 200, 300, "no", {});
    this.add.existing(textZeo);

    scene1Img2.setInteractive();

    scene1Img2.on("pointerdown", () => {
      fetch("http://localhost:8000", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const text = new Phaser.GameObjects.Text(
            this,
            100,
            100,
            data ? data.message : "no",
            {}
          );
          this.add.existing(text);
        });
    });

    fetch("http://localhost:8000", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const text = new Phaser.GameObjects.Text(
          this,
          100,
          100,
          data ? data.message : "no",
          {}
        );
        this.add.existing(text);
      });
  }

  update(time: number, delta: number): void {
    fetch("http://localhost:8000", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const text = new Phaser.GameObjects.Text(
          this,
          100,
          100,
          data ? data.message : "no",
          {}
        );
        this.add.existing(text);
      });
  }
}
