export class VizDynamicSpiral extends HTMLElement {
    canvas;
    context;

    width;
    height;

    layers = [];

    constructor() {
        super();
    }

    connectedCallback() {
    }

    initialize() {
        const layerSize = this.layerSize();
        const radius = this.radius();
        const quantity = this.quantity
        const twoPi = 2 * Math.PI;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        this.layers = new Array(quantity);

        for (let i = 0; i < quantity; i++) {
            const angle = (i / quantity) * twoPi;
            const x = centerX + Math.sin(angle) * (radius - layerSize);
            const y = centerY + Math.cos(angle) * (radius - layerSize);
        
            this.layers[i] = { x, y, r: angle };
        }
        this.resize();
        this.update();
    }
}