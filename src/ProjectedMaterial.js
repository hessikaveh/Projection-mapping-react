import { extend } from "react-three-fiber"
import { shaderMaterial } from "drei"

const ProjectedMaterial = shaderMaterial(
  {
    color: undefined,
    textture: undefined,
    viewMatrixCamera: undefined,
    projectionMatrixCamera: undefined,
    modelMatrixCamera: undefined,
    projPosition: undefined
  },
  `
  uniform mat4 viewMatrixCamera;
  uniform mat4 projectionMatrixCamera;
  uniform mat4 modelMatrixCamera;
    
  varying vec4 vWorldPosition;
  varying vec3 vNormal;
  varying vec4 vTexCoords;
      
      
  void main() {
    vNormal = mat3(modelMatrix) * normal;
    vWorldPosition = modelMatrix * vec4(position, 1.0);
    vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  `uniform vec3 color;
  uniform sampler2D textture;
  uniform vec3 projPosition;

  varying vec3 vNormal;
  varying vec4 vWorldPosition;
  varying vec4 vTexCoords;
  
  void main() {
    vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

    vec4 outColor = texture(textture, uv);

    // this makes sure we don't render the textture also on the back of the object
    vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
    float dotProduct = dot(vNormal, projectorDirection);
    if (dotProduct < 0.0) {
      outColor = vec4(color, 1.0);
    }

    gl_FragColor = outColor;
  }
  `
)

extend({ ProjectedMaterial })