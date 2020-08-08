// import { AnimationClip } from "three/src/animation/AnimationClip";
import { FileLoader } from "three/src/loaders/FileLoader";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute";
import { Loader } from "three/src/loaders/Loader";
import { Vector3 } from "three/src/math/Vector3";

type ParsedGeometry = {
  // frames: Array<{
  //   name: string;
  //   normals: Array<number> | Float32Array;
  //   vertices: Array<number> | Float32Array;
  // }>;
  normals: Float32Array;
  uvs: Float32Array;
  vertices: Float32Array;
};

const headerNames: [
  "ident",
  "version",
  "skinwidth",
  "skinheight",
  "framesize",
  "num_skins",
  "num_vertices",
  "num_st",
  "num_tris",
  "num_glcmds",
  "num_frames",
  "offset_skins",
  "offset_st",
  "offset_tris",
  "offset_frames",
  "offset_glcmds",
  "offset_end"
] = [
  "ident",
  "version",
  "skinwidth",
  "skinheight",
  "framesize",
  "num_skins",
  "num_vertices",
  "num_st",
  "num_tris",
  "num_glcmds",
  "num_frames",
  "offset_skins",
  "offset_st",
  "offset_tris",
  "offset_frames",
  "offset_glcmds",
  "offset_end",
];

const normalData = [
  [-0.525731, 0.0, 0.850651],
  [-0.442863, 0.238856, 0.864188],
  [-0.295242, 0.0, 0.955423],
  [-0.309017, 0.5, 0.809017],
  [-0.16246, 0.262866, 0.951056],
  [0.0, 0.0, 1.0],
  [0.0, 0.850651, 0.525731],
  [-0.147621, 0.716567, 0.681718],
  [0.147621, 0.716567, 0.681718],
  [0.0, 0.525731, 0.850651],
  [0.309017, 0.5, 0.809017],
  [0.525731, 0.0, 0.850651],
  [0.295242, 0.0, 0.955423],
  [0.442863, 0.238856, 0.864188],
  [0.16246, 0.262866, 0.951056],
  [-0.681718, 0.147621, 0.716567],
  [-0.809017, 0.309017, 0.5],
  [-0.587785, 0.425325, 0.688191],
  [-0.850651, 0.525731, 0.0],
  [-0.864188, 0.442863, 0.238856],
  [-0.716567, 0.681718, 0.147621],
  [-0.688191, 0.587785, 0.425325],
  [-0.5, 0.809017, 0.309017],
  [-0.238856, 0.864188, 0.442863],
  [-0.425325, 0.688191, 0.587785],
  [-0.716567, 0.681718, -0.147621],
  [-0.5, 0.809017, -0.309017],
  [-0.525731, 0.850651, 0.0],
  [0.0, 0.850651, -0.525731],
  [-0.238856, 0.864188, -0.442863],
  [0.0, 0.955423, -0.295242],
  [-0.262866, 0.951056, -0.16246],
  [0.0, 1.0, 0.0],
  [0.0, 0.955423, 0.295242],
  [-0.262866, 0.951056, 0.16246],
  [0.238856, 0.864188, 0.442863],
  [0.262866, 0.951056, 0.16246],
  [0.5, 0.809017, 0.309017],
  [0.238856, 0.864188, -0.442863],
  [0.262866, 0.951056, -0.16246],
  [0.5, 0.809017, -0.309017],
  [0.850651, 0.525731, 0.0],
  [0.716567, 0.681718, 0.147621],
  [0.716567, 0.681718, -0.147621],
  [0.525731, 0.850651, 0.0],
  [0.425325, 0.688191, 0.587785],
  [0.864188, 0.442863, 0.238856],
  [0.688191, 0.587785, 0.425325],
  [0.809017, 0.309017, 0.5],
  [0.681718, 0.147621, 0.716567],
  [0.587785, 0.425325, 0.688191],
  [0.955423, 0.295242, 0.0],
  [1.0, 0.0, 0.0],
  [0.951056, 0.16246, 0.262866],
  [0.850651, -0.525731, 0.0],
  [0.955423, -0.295242, 0.0],
  [0.864188, -0.442863, 0.238856],
  [0.951056, -0.16246, 0.262866],
  [0.809017, -0.309017, 0.5],
  [0.681718, -0.147621, 0.716567],
  [0.850651, 0.0, 0.525731],
  [0.864188, 0.442863, -0.238856],
  [0.809017, 0.309017, -0.5],
  [0.951056, 0.16246, -0.262866],
  [0.525731, 0.0, -0.850651],
  [0.681718, 0.147621, -0.716567],
  [0.681718, -0.147621, -0.716567],
  [0.850651, 0.0, -0.525731],
  [0.809017, -0.309017, -0.5],
  [0.864188, -0.442863, -0.238856],
  [0.951056, -0.16246, -0.262866],
  [0.147621, 0.716567, -0.681718],
  [0.309017, 0.5, -0.809017],
  [0.425325, 0.688191, -0.587785],
  [0.442863, 0.238856, -0.864188],
  [0.587785, 0.425325, -0.688191],
  [0.688191, 0.587785, -0.425325],
  [-0.147621, 0.716567, -0.681718],
  [-0.309017, 0.5, -0.809017],
  [0.0, 0.525731, -0.850651],
  [-0.525731, 0.0, -0.850651],
  [-0.442863, 0.238856, -0.864188],
  [-0.295242, 0.0, -0.955423],
  [-0.16246, 0.262866, -0.951056],
  [0.0, 0.0, -1.0],
  [0.295242, 0.0, -0.955423],
  [0.16246, 0.262866, -0.951056],
  [-0.442863, -0.238856, -0.864188],
  [-0.309017, -0.5, -0.809017],
  [-0.16246, -0.262866, -0.951056],
  [0.0, -0.850651, -0.525731],
  [-0.147621, -0.716567, -0.681718],
  [0.147621, -0.716567, -0.681718],
  [0.0, -0.525731, -0.850651],
  [0.309017, -0.5, -0.809017],
  [0.442863, -0.238856, -0.864188],
  [0.16246, -0.262866, -0.951056],
  [0.238856, -0.864188, -0.442863],
  [0.5, -0.809017, -0.309017],
  [0.425325, -0.688191, -0.587785],
  [0.716567, -0.681718, -0.147621],
  [0.688191, -0.587785, -0.425325],
  [0.587785, -0.425325, -0.688191],
  [0.0, -0.955423, -0.295242],
  [0.0, -1.0, 0.0],
  [0.262866, -0.951056, -0.16246],
  [0.0, -0.850651, 0.525731],
  [0.0, -0.955423, 0.295242],
  [0.238856, -0.864188, 0.442863],
  [0.262866, -0.951056, 0.16246],
  [0.5, -0.809017, 0.309017],
  [0.716567, -0.681718, 0.147621],
  [0.525731, -0.850651, 0.0],
  [-0.238856, -0.864188, -0.442863],
  [-0.5, -0.809017, -0.309017],
  [-0.262866, -0.951056, -0.16246],
  [-0.850651, -0.525731, 0.0],
  [-0.716567, -0.681718, -0.147621],
  [-0.716567, -0.681718, 0.147621],
  [-0.525731, -0.850651, 0.0],
  [-0.5, -0.809017, 0.309017],
  [-0.238856, -0.864188, 0.442863],
  [-0.262866, -0.951056, 0.16246],
  [-0.864188, -0.442863, 0.238856],
  [-0.809017, -0.309017, 0.5],
  [-0.688191, -0.587785, 0.425325],
  [-0.681718, -0.147621, 0.716567],
  [-0.442863, -0.238856, 0.864188],
  [-0.587785, -0.425325, 0.688191],
  [-0.309017, -0.5, 0.809017],
  [-0.147621, -0.716567, 0.681718],
  [-0.425325, -0.688191, 0.587785],
  [-0.16246, -0.262866, 0.951056],
  [0.442863, -0.238856, 0.864188],
  [0.16246, -0.262866, 0.951056],
  [0.309017, -0.5, 0.809017],
  [0.147621, -0.716567, 0.681718],
  [0.0, -0.525731, 0.850651],
  [0.425325, -0.688191, 0.587785],
  [0.587785, -0.425325, 0.688191],
  [0.688191, -0.587785, 0.425325],
  [-0.955423, 0.295242, 0.0],
  [-0.951056, 0.16246, 0.262866],
  [-1.0, 0.0, 0.0],
  [-0.850651, 0.0, 0.525731],
  [-0.955423, -0.295242, 0.0],
  [-0.951056, -0.16246, 0.262866],
  [-0.864188, 0.442863, -0.238856],
  [-0.951056, 0.16246, -0.262866],
  [-0.809017, 0.309017, -0.5],
  [-0.864188, -0.442863, -0.238856],
  [-0.951056, -0.16246, -0.262866],
  [-0.809017, -0.309017, -0.5],
  [-0.681718, 0.147621, -0.716567],
  [-0.681718, -0.147621, -0.716567],
  [-0.850651, 0.0, -0.525731],
  [-0.688191, 0.587785, -0.425325],
  [-0.587785, 0.425325, -0.688191],
  [-0.425325, 0.688191, -0.587785],
  [-0.425325, -0.688191, -0.587785],
  [-0.587785, -0.425325, -0.688191],
  [-0.688191, -0.587785, -0.425325],
];

export class MD2Loader extends Loader {
  load(url: string, onLoad: (geometry: ParsedGeometry) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void {
    const scope = this;
    const loader = new FileLoader(scope.manager);

    loader.setPath(scope.path);
    loader.setResponseType("arraybuffer");
    loader.load(
      url,
      function (buffer) {
        if ("string" === typeof buffer) {
          throw new Error("Buffer was expected to be an array buffer.");
        }

        try {
          onLoad(scope.parse(buffer));
        } catch (e) {
          if (onError) {
            onError(e);
          }

          scope.manager.itemError(url);
          throw e;
        }
      },
      onProgress,
      onError
    );
  }

  parse(buffer: ArrayBuffer): ParsedGeometry {
    const data = new DataView(buffer);

    // http://tfc.duke.free.fr/coding/md2-specs-en.html

    const header: {
      ident: number;
      version: number;
      skinwidth: number;
      skinheight: number;
      framesize: number;
      num_skins: number;
      num_vertices: number;
      num_st: number;
      num_tris: number;
      num_glcmds: number;
      num_frames: number;
      offset_skins: number;
      offset_st: number;
      offset_tris: number;
      offset_frames: number;
      offset_glcmds: number;
      offset_end: number;
    } = {
      ident: 0,
      version: 0,
      skinwidth: 0,
      skinheight: 0,
      framesize: 0,
      num_skins: 0,
      num_vertices: 0,
      num_st: 0,
      num_tris: 0,
      num_glcmds: 0,
      num_frames: 0,
      offset_skins: 0,
      offset_st: 0,
      offset_tris: 0,
      offset_frames: 0,
      offset_glcmds: 0,
      offset_end: 0,
    };

    for (let i = 0; i < headerNames.length; i++) {
      header[headerNames[i]] = data.getInt32(i * 4, true);
    }

    if (header.ident !== 844121161 || header.version !== 8) {
      throw new Error("Not a valid MD2 file");
    }

    if (header.offset_end !== data.byteLength) {
      throw new Error("Corrupted MD2 file");
    }

    //

    // var geometry = new BufferGeometry();

    // uvs

    var uvsTemp = [];
    var offset = header.offset_st;

    for (let i = 0, l = header.num_st; i < l; i++) {
      var u = data.getInt16(offset + 0, true);
      var v = data.getInt16(offset + 2, true);

      uvsTemp.push(u / header.skinwidth, 1 - v / header.skinheight);

      offset += 4;
    }

    // triangles

    offset = header.offset_tris;

    var vertexIndices = [];
    var uvIndices = [];

    for (let i = 0, l = header.num_tris; i < l; i++) {
      vertexIndices.push(data.getUint16(offset + 0, true), data.getUint16(offset + 2, true), data.getUint16(offset + 4, true));

      uvIndices.push(data.getUint16(offset + 6, true), data.getUint16(offset + 8, true), data.getUint16(offset + 10, true));

      offset += 12;
    }

    // frames

    var translation = new Vector3();
    var scale = new Vector3();
    var string = [];

    var frames: Array<{
      name: string;
      normals: Array<number> | Float32Array;
      vertices: Array<number> | Float32Array;
    }> = [];

    offset = header.offset_frames;

    for (let i = 0, l = header.num_frames; i < l; i++) {
      scale.set(data.getFloat32(offset + 0, true), data.getFloat32(offset + 4, true), data.getFloat32(offset + 8, true));

      translation.set(data.getFloat32(offset + 12, true), data.getFloat32(offset + 16, true), data.getFloat32(offset + 20, true));

      offset += 24;

      for (let j = 0; j < 16; j++) {
        var character = data.getUint8(offset + j);
        if (character === 0) break;

        string[j] = character;
      }

      const frame: {
        name: string;
        vertices: Array<number>;
        normals: Array<number>;
      } = {
        name: String.fromCharCode.apply(null, string),
        vertices: [],
        normals: [],
      };

      offset += 16;

      for (let j = 0; j < header.num_vertices; j++) {
        let x = data.getUint8(offset++);
        let y = data.getUint8(offset++);
        let z = data.getUint8(offset++);
        const n = normalData[data.getUint8(offset++)];

        x = x * scale.x + translation.x;
        y = y * scale.y + translation.y;
        z = z * scale.z + translation.z;

        frame.vertices.push(x, z, y); // convert to Y-up
        frame.normals.push(n[0], n[2], n[1]); // convert to Y-up
      }

      frames.push(frame);
    }

    // static

    const positions: Array<number> = [];
    const normals: Array<number> = [];
    const uvs: Array<number> = [];

    var verticesTemp = frames[0].vertices;
    var normalsTemp = frames[0].normals;

    for (let i = 0, l = vertexIndices.length; i < l; i++) {
      const vertexIndex = vertexIndices[i];
      let stride = vertexIndex * 3;

      //

      const x = verticesTemp[stride];
      const y = verticesTemp[stride + 1];
      const z = verticesTemp[stride + 2];

      positions.push(x, y, z);

      //

      const nx = normalsTemp[stride];
      const ny = normalsTemp[stride + 1];
      const nz = normalsTemp[stride + 2];

      normals.push(nx, ny, nz);

      //

      const uvIndex = uvIndices[i];
      stride = uvIndex * 2;

      const u = uvsTemp[stride];
      const v = uvsTemp[stride + 1];

      uvs.push(u, v);
    }

    const normalsTypedArray = Float32Array.from(normals);
    const positionsTypedArray = Float32Array.from(positions);
    const uvsTypedArray = Float32Array.from(uvs);

    // animation

    const morphPositions = [];
    const morphNormals = [];

    for (let i = 0, l = frames.length; i < l; i++) {
      const frame = frames[i];
      const attributeName = frame.name;

      if (frame.vertices.length > 0) {
        const positions = [];

        for (let j = 0, jl = vertexIndices.length; j < jl; j++) {
          const vertexIndex = vertexIndices[j];
          const stride = vertexIndex * 3;

          const x = frame.vertices[stride];
          const y = frame.vertices[stride + 1];
          const z = frame.vertices[stride + 2];

          positions.push(x, y, z);
        }

        const positionAttribute = new Float32BufferAttribute(positions, 3);
        positionAttribute.name = attributeName;

        morphPositions.push(positionAttribute);
      }

      if (frame.normals.length > 0) {
        const normals: Array<number> = [];

        for (let j = 0, jl = vertexIndices.length; j < jl; j++) {
          const vertexIndex = vertexIndices[j];
          const stride = vertexIndex * 3;

          const nx = frame.normals[stride];
          const ny = frame.normals[stride + 1];
          const nz = frame.normals[stride + 2];

          normals.push(nx, ny, nz);
        }

        var normalAttribute = new Float32BufferAttribute(normals, 3);
        normalAttribute.name = attributeName;

        morphNormals.push(normalAttribute);
      }
    }

    for (let frame of frames) {
      frame.normals = Float32Array.from(frame.normals);
      frame.vertices = Float32Array.from(frame.vertices);

      // transferables.push(frame.normals.buffer);
      // transferables.push(frame.vertices.buffer);
    }

    // console.log(morphPositions);
    // console.log(morphNormals);

    // prettier-ignore
    return {
      // frames: frames,
      normals: normalsTypedArray,
      uvs: uvsTypedArray,
      vertices: positionsTypedArray,
    };

    // geometry.morphAttributes.position = morphPositions;
    // geometry.morphAttributes.normal = morphNormals;
    // geometry.morphTargetsRelative = false;

    // geometry.animations = AnimationClip.CreateClipsFromMorphTargetSequences( frames, 10 );

    // return geometry;
  }
}
