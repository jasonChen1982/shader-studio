import {
  PlaneBufferGeometry,
  UniformsUtils,
  ShaderMaterial,
} from 'three';
import { Primer } from 'tofu.js';

class ShaderPrimer extends Primer {
  constructor(shader) {

    /**
     * geometry for this 2D context
     * @member {PlaneBufferGeometry}
     * @private
     */
    const geo = new PlaneBufferGeometry(2, 2);

    const uniforms = UniformsUtils.clone(shader.uniforms);

    /**
     * material for this 2D context
     * @member {MeshBasicMaterial}
     * @private
     */
    const mat = new ShaderMaterial({
      uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    super(geo, mat, {});

    this.uniforms = uniforms;
  }
}

export { ShaderPrimer };
