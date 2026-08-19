declare module "*.glb" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "meshline" {
  import { BufferGeometry, Material } from "three";
  export class MeshLineGeometry extends BufferGeometry {
    setPoints(points: import("three").Vector3[]): void;
  }
  export class MeshLineMaterial extends Material {
    [key: string]: unknown;
  }
}
