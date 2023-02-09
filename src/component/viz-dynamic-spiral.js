class VizDynamicSpiral extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.layers = []
        this.width = this.getAttribute('width');
        this.height = this.getAttribute('height');
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<canvas id="canvas"></canvas>`;

        this.canvas = this.shadowRoot.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.interval = setTimeout(this.initialize.bind(this), 0);
    }

    disconnectedCallback() {
        clearTimeout(this.interval);
    }

    initialize() {

        const layerSize = this.layerSize();
        const radius = this.radius();
        const quantity = this.quantity();
        const twoPi = 2 * Math.PI;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        this.layers = new Array(quantity)

        for (let i = 0; i < quantity; i++) {
            const angle = (i / quantity) * twoPi;
            const x = centerX + Math.sin(angle) * (radius - layerSize);
            const y = centerY + Math.cos(angle) * (radius - layerSize);

            this.layers[i] = {x: x, y: y, r: angle};
        }
        this.resize();
        this.update();
    }

    radius() {
        return Math.min(this.width, this.height) * 0.55;
    }

    layerSize() {
        return this.radius() * 0.3;
    }

    layerOverlap() {
        return Math.round(this.quantity() * 0.1);
    }

    quantity() {
        return this.radius() > 300 ? 180 : 90;
    }

    step() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].r += 0.005;
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
        this.step();
        this.clear();
        this.paint();
    }

    paint() {
        for (let i = this.layers.length - this.layerOverlap(); i < this.layers.length; i++) {
            this.context.save();
            this.context.globalCompositeOperation = 'destination-over';
            this.paintLayer(this.layers[i]);
            this.context.restore();
        }
        this.context.save();
        this.context.globalCompositeOperation = 'destination-in';
        this.paintLayer(this.layers[0], true);
        this.context.restore();

        for (let i = 0; i < this.layers.length; i++) {
            this.context.save();
            this.context.globalCompositeOperation = 'destination-over';
            this.paintLayer(this.layers[i]);
            this.context.restore();
        }
    }

    paintLayer(layer, mask = false) {
        const wh = this.layerSize() + (mask ? 10 : 0);
        const xy = wh / 2;
        this.context.translate(layer.x, layer.y);
        this.context.rotate(layer.r);

        if (!mask) {
            this.context.strokeStyle = '#000';
            this.context.lineWidth = 1;
            this.context.strokeRect(-xy, -xy, wh, wh);
        }
        this.context.fillStyle = '#fff';
        this.context.fillRect(-xy, -xy, wh, wh);
    }
}

if (!customElements.get('viz-dynamic-spiral')) {
    customElements.define('viz-dynamic-spiral', VizDynamicSpiral);
}
