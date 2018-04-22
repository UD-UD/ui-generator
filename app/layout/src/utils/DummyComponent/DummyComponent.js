/* eslint-disable require-jsdoc */
class DummyComponent {
    constructor(seed, dimensions) {
        this.seed = seed;
        this.dimensions = dimensions;
        this.position = null;
    }

    getLogicalSpace() {
        return {
            width: this.dimensions.width - 1 * this.seed,
            height: this.dimensions.height - 1 * this.seed
        };
    }

    setSpatialConfig(x, y, width, height) {
        this.position = { top: y, left: x };
        this.dimensions = { width, height };
    }
}

export default DummyComponent;
