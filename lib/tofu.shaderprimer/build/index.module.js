import { PlaneBufferGeometry, ShaderMaterial, UniformsUtils } from 'three';
import { Primer } from 'tofu.js';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var ShaderPrimer = function (_Primer) {
  inherits(ShaderPrimer, _Primer);

  function ShaderPrimer(shader) {
    classCallCheck(this, ShaderPrimer);


    /**
     * geometry for this 2D context
     * @member {PlaneBufferGeometry}
     * @private
     */
    var geo = new PlaneBufferGeometry(2, 2);

    var uniforms = UniformsUtils.clone(shader.uniforms);

    /**
     * material for this 2D context
     * @member {MeshBasicMaterial}
     * @private
     */
    var mat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    var _this = possibleConstructorReturn(this, (ShaderPrimer.__proto__ || Object.getPrototypeOf(ShaderPrimer)).call(this, geo, mat, {}));

    _this.uniforms = uniforms;
    return _this;
  }

  return ShaderPrimer;
}(Primer);

export { ShaderPrimer };
//# sourceMappingURL=index.module.js.map
