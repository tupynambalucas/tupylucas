var servicoPixi = document.getElementById("servico-pixi")
let height = servicoPixi.offsetHeight
let width = servicoPixi.offsetWidth
let app = new PIXI.Application({backgroundColor: 0x0f0f0f, width: width, height: height});
servicoPixi.appendChild(app.view);

// holder to store the aliens
const aliens = [];
const totalDudes = 19;

for (let i = 0; i < totalDudes; i++) {
    var cloud = PIXI.Texture.from('../img/sprites/cloud.png');
    var docker = PIXI.Texture.from('../img/sprites/docker.png');
    var electron = PIXI.Texture.from('../img/sprites/electron.png');
    var express = PIXI.Texture.from('../img/sprites/express.png');
    var grafana = PIXI.Texture.from('../img/sprites/grafana.png');
    var kubernetes = PIXI.Texture.from('../img/sprites/kubernetes.png');
    var linux = PIXI.Texture.from('../img/sprites/linux.png');
    var mongo = PIXI.Texture.from('../img/sprites/mongo.png');
    var nextjs = PIXI.Texture.from('../img/sprites/nextjs.png');
    var node = PIXI.Texture.from('../img/sprites/node.png');
    var puppeteer = PIXI.Texture.from('../img/sprites/puppeteer.png');
    var react = PIXI.Texture.from('../img/sprites/react.png');
    var threejs = PIXI.Texture.from('../img/sprites/threejs.png');
    var vue = PIXI.Texture.from('../img/sprites/vue.png');
    const spritesArray = new Array(cloud,docker,electron,express,grafana,kubernetes,linux,mongo,puppeteer,react,threejs,vue)
    let randomValue = spritesArray[Math.floor(Math.random() * spritesArray.length)];
    // create a new Sprite that uses the image name that we just generated as its source
    const dude = new PIXI.Sprite(randomValue)

    // set the anchor point so the texture is centered on the sprite
    dude.anchor.set(0.5);

    // set a random scale for the dude - no point them all being the same size!
    dude.scale.set(0.1 + Math.random() * 0.1);

    // finally lets set the dude to be at a random position..
    dude.x = Math.random() * app.screen.width;
    dude.y = Math.random() * app.screen.height;

    dude.tint = 0xB373AA;

    // create some extra properties that will control movement :
    // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
    dude.direction = Math.random() * Math.PI * 2;

    // this number will be used to modify the direction of the dude over time
    dude.turningSpeed = Math.random() - 0.8;

    // create a random speed for the dude between 2 - 4
    dude.speed = 2 + Math.random() * 2;

    // finally we push the dude into the aliens array so it it can be easily accessed later
    aliens.push(dude);

    app.stage.addChild(dude);
}

// create a bounding box for the little dudes
const dudeBoundsPadding = 100;
const dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2);

app.ticker.add(() => {
    // iterate through the dudes and update their position
    for (let i = 0; i < aliens.length; i++) {
        const dude = aliens[i];
        dude.direction += dude.turningSpeed * 0.01;
        dude.x += Math.sin(dude.direction) * dude.speed;
        dude.y += Math.cos(dude.direction) * dude.speed;
        dude.rotation = -dude.direction - Math.PI / 2;

        // wrap the dudes by testing their bounds...
        if (dude.x < dudeBounds.x) {
            dude.x += dudeBounds.width;
        } else if (dude.x > dudeBounds.x + dudeBounds.width) {
            dude.x -= dudeBounds.width;
        }

        if (dude.y < dudeBounds.y) {
            dude.y += dudeBounds.height;
        } else if (dude.y > dudeBounds.y + dudeBounds.height) {
            dude.y -= dudeBounds.height;
        }
    }
});

