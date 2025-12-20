const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HUDMaterial.glsl-CCYLL6Dh.js","assets/index-DvqY5DcZ.js","assets/index-St1ymWg2.css","assets/OutputColorHighlightOID.glsl-BTohu0Mc.js","assets/videoUtils-C93dpQdL.js","assets/requestImageUtils-M9wRQWJo.js","assets/basicInterfaces-N86vRvDz.js","assets/TextureFormat-1mYWTFa-.js","assets/BufferView-C-rpJ2Kn.js","assets/mat4f64-q_b6UJoq.js","assets/Indices-BH9AOIGH.js","assets/triangle-Du--Kusq.js","assets/sphere-CbEFZ8WS.js","assets/mat3f64-B5o_lm6j.js","assets/vectorStacks-lr-QDI74.js","assets/quatf64-aQ5IuZRd.js","assets/lineSegment-B1pfeH38.js","assets/VertexAttribute-BfkzOMLV.js","assets/glsl-Cj7KC756.js","assets/BindType-BBwFZqyN.js","assets/ShaderOutput-Bdd80V3g.js","assets/renderState-DFJZfIPo.js","assets/orientedBoundingBox-D60u22oc.js","assets/quat-BBrpx8Rj.js","assets/spatialReferenceEllipsoidUtils-DKvM3C5f.js","assets/computeTranslationToOriginAndRotation-bBk3nI6n.js","assets/plane-D9zGW4Gw.js","assets/boundedPlane-DpXFuTJP.js","assets/projectVectorToVector-zM2XZovJ.js","assets/projectPointToVector-4pb1Kh04.js","assets/ShaderBuilder-DJ8LTgmF.js","assets/DefaultMaterial-BvtIp4E_.js","assets/InterleavedLayout-D0oyLxlC.js","assets/types-BKo2foNY.js","assets/NormalAttribute.glsl-DVIJUq4J.js","assets/dehydratedFeatureUtils-DNjntDhK.js","assets/meshVertexSpaceUtils-C7BNzHsG.js","assets/MeshLocalVertexSpace-DBfWSJ7v.js","assets/hydratedFeatures-COl87xYR.js","assets/vec3f32-WCVSSNPR.js"])))=>i.map(i=>d[i]);
import{nT as Se,S as Re,gg as Pe,nU as ut,jr as Ae,nV as dt,ax as ft,ho as pt,_ as ht,jg as Fe,jx as gt,v as P,mj as Ie,hk as Xe,ez as le,cO as G,ex as Z,cM as xe,eh as We,ek as q,jD as pe,nW as ke,cT as Qe,cE as X,ev as te,eA as Ze,aX as vt,ej as Ee,f8 as mt,b6 as St,hg as xt,c_ as bt,cQ as Ct,nX as Ot,cG as $t}from"./index-DvqY5DcZ.js";import{o as Tt}from"./floatRGBA-5ytwTbG7.js";import{i as Pt,L as At,a as Et,m as yt,s as zt,b as Rt,e as Ft,c as It,o as wt,d as we,f as ge,g as _e,h as De,w as _t,t as Dt,j as Mt,k as H,l as jt,q as Lt,r as Nt,u as K,v as Ut,x as Bt,F as Vt,y as qt,z as Ht,A as Gt,B as Xt,C as A,D as Wt,E as Q,G as kt,H as Ye,I as Je,J as Qt,K as Zt,M as Yt,N as Jt,O as Kt,R as eo,S as to,P as oo,Q as io,T as Me,U as je,V as ao,W as so,X as Le}from"./OutputColorHighlightOID.glsl-BTohu0Mc.js";import{e as Ke}from"./mat3f64-B5o_lm6j.js";import{e as ro}from"./mat4f64-q_b6UJoq.js";import{s as no,g as lo,o as Ne,f as co,y as uo,T as Ue}from"./BufferView-C-rpJ2Kn.js";import{O as fo}from"./InterleavedLayout-D0oyLxlC.js";import{n as N,u as et,w as ve}from"./ShaderOutput-Bdd80V3g.js";import{l as tt,u as po,n as ho,t as go,d as vo}from"./dehydratedFeatureUtils-DNjntDhK.js";import{e as d}from"./VertexAttribute-BfkzOMLV.js";import{n as f,t as y}from"./glsl-Cj7KC756.js";import{a as mo}from"./BindType-BBwFZqyN.js";import{i as So}from"./ShaderBuilder-DJ8LTgmF.js";import{B as xo,o as bo,g as Co,p as Oo}from"./renderState-DFJZfIPo.js";let $o=class extends Pt{constructor(e,t){super(e,"vec4",mo.Draw,((i,a,s)=>i.setUniform4fv(e,t(a,s))))}};const ye=128,k=.5,pi=Se(k/2,k/2,1-k/2,1-k/2);function hi(o){return o==="cross"||o==="x"}function gi(o,e=ye,t=e*k,i=0){const{data:a,parameters:s}=To(o,e,t,i);return new At(a,s)}function To(o,e=ye,t=e*k,i=0){return{data:Po(o,e,t,i),parameters:{mipmap:!1,wrap:{s:Re.CLAMP_TO_EDGE,t:Re.CLAMP_TO_EDGE},width:e,height:e,components:4,noUnpackFlip:!0,reloadable:!0}}}function Po(o,e=ye,t=e*k,i=0){switch(o){case"circle":default:return Ao(e,t);case"square":return Eo(e,t);case"cross":return zo(e,t,i);case"x":return Ro(e,t,i);case"kite":return yo(e,t);case"triangle":return Fo(e,t);case"arrow":return Io(e,t)}}function Ao(o,e){const t=o/2-.5;return ie(o,at(t,t,e/2))}function Eo(o,e){return ot(o,e,!1)}function yo(o,e){return ot(o,e,!0)}function zo(o,e,t=0){return it(o,e,!1,t)}function Ro(o,e,t=0){return it(o,e,!0,t)}function Fo(o,e){return ie(o,st(o/2,e,e/2))}function Io(o,e){const t=e,i=e/2,a=o/2,s=.8*t,r=at(a,(o-e)/2-s,Math.sqrt(s*s+i*i)),l=st(a,t,i);return ie(o,((u,n)=>Math.max(l(u,n),-r(u,n))))}function ot(o,e,t){return t&&(e/=Math.SQRT2),ie(o,((i,a)=>{let s=i-.5*o+.25,r=.5*o-a-.75;if(t){const l=(s+r)/Math.SQRT2;r=(r-s)/Math.SQRT2,s=l}return Math.max(Math.abs(s),Math.abs(r))-.5*e}))}function it(o,e,t,i=0){e-=i,t&&(e*=Math.SQRT2);const a=.5*e;return ie(o,((s,r)=>{let l,u=s-.5*o,n=.5*o-r-1;if(t){const S=(u+n)/Math.SQRT2;n=(n-u)/Math.SQRT2,u=S}return u=Math.abs(u),n=Math.abs(n),l=u>n?u>a?Math.sqrt((u-a)*(u-a)+n*n):n:n>a?Math.sqrt(u*u+(n-a)*(n-a)):u,l-=i/2,l}))}function at(o,e,t){return(i,a)=>{const s=i-o,r=a-e;return Math.sqrt(s*s+r*r)-t}}function st(o,e,t){const i=Math.sqrt(e*e+t*t);return(a,s)=>{const r=Math.abs(a-o)-t,l=s-o+e/2+.75,u=(e*r+t*l)/i,n=-l;return Math.max(u,n)}}function ie(o,e){const t=new Uint8Array(4*o*o);for(let i=0;i<o;i++)for(let a=0;a<o;a++){const s=a+o*i;let r=e(a,i);r=r/o+.5,Tt(r,t,4*s)}return t}function wo(o){return o instanceof Float32Array&&o.length>=16}function _o(o){return Array.isArray(o)&&o.length>=16}function Do(o){return wo(o)||_o(o)}class Mo{constructor(){this.factor=new Be,this.factorAlignment=new Be}}class Be{constructor(){this.scale=0,this.factor=0,this.minScaleFactor=0}}function jo(o,e){const{vertex:t,fragment:i}=o;o.include(Et,e),t.include(tt),t.main.add(f`vec4 posProjCenter;
if (dot(position, position) > 0.0) {
ProjectHUDAux projectAux;
vec4 posProj = projectPositionHUD(projectAux);
posProjCenter = alignToPixelCenter(posProj, viewport.zw);
forwardViewPosDepth(projectAux.posView);
vec3 vpos = projectAux.posModel;
if (rejectBySlice(vpos)) {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
} else {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
gl_Position = posProjCenter;
gl_PointSize = 1.0;`),i.main.add(f`fragColor = vec4(1);
if(discardByTerrainDepth()) {
fragColor.g = 0.5;
}`)}function Lo(o){const e=new So,{signedDistanceFieldEnabled:t,occlusionTestEnabled:i,horizonCullingEnabled:a,pixelSnappingEnabled:s,hasScreenSizePerspective:r,debugDrawLabelBorder:l,vvSize:u,vvColor:n,hasRotation:S,occludedFragmentFade:p,sampleSignedDistanceFieldTexelCenter:h}=o;e.include(po,o),e.vertex.include(yt,o);const{occlusionPass:O,output:R,oitPass:F}=o;if(O)return e.include(jo,o),e;const{vertex:b,fragment:x}=e;e.include(zt),e.include(Rt,o),e.include(Ft,o),i&&e.include(ho),x.include(go),x.include(It),e.varyings.add("vcolor","vec4"),e.varyings.add("vtc","vec2"),e.varyings.add("vsize","vec2");const T=R===N.Highlight,z=T&&i;z&&e.varyings.add("voccluded","float"),b.uniforms.add(new wt("viewport",(c=>c.camera.fullViewport)),new we("screenOffset",((c,M)=>Ae(ce,2*c.screenOffset[0]*M.camera.pixelRatio,2*c.screenOffset[1]*M.camera.pixelRatio))),new we("anchorPosition",(c=>oe(c))),new ge("materialColor",(c=>c.color)),new _e("materialRotation",(c=>c.rotation)),new De("tex",(c=>c.texture))),_t(b),t&&(b.uniforms.add(new ge("outlineColor",(c=>c.outlineColor))),x.uniforms.add(new ge("outlineColor",(c=>Ve(c)?c.outlineColor:dt)),new _e("outlineSize",(c=>Ve(c)?c.outlineSize:0)))),a&&b.uniforms.add(new $o("pointDistanceSphere",((c,M)=>{const w=M.camera.eye,_=c.origin;return ft(_[0]-w[0],_[1]-w[1],_[2]-w[2],pt.radius)}))),s&&b.include(tt),r&&(Dt(b),Mt(b)),l&&e.varyings.add("debugBorderCoords","vec4"),e.attributes.add(d.UVI,"vec2"),e.attributes.add(d.COLOR,"vec4"),e.attributes.add(d.SIZE,"vec2"),e.attributes.add(d.ROTATION,"float"),(u||n)&&e.attributes.add(d.FEATUREATTRIBUTE,"vec4"),b.code.add(a?f`bool behindHorizon(vec3 posModel) {
vec3 camToEarthCenter = pointDistanceSphere.xyz - localOrigin;
vec3 camToPos = pointDistanceSphere.xyz + posModel;
float earthRadius = pointDistanceSphere.w;
float a = dot(camToPos, camToPos);
float b = dot(camToPos, camToEarthCenter);
float c = dot(camToEarthCenter, camToEarthCenter) - earthRadius * earthRadius;
return b > 0.0 && b < a && b * b  > a * c;
}`:f`bool behindHorizon(vec3 posModel) { return false; }`),b.main.add(f`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    if (behindHorizon(projectAux.posModel)) {
      // Project outside of clip plane
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
      return;
    }

    vec2 inputSize;
    ${y(r,f`
        inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,f`
        inputSize = size;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${y(u,f`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);

    ${y(i,f`
    bool visible = testHUDVisibility(posProj);
    if (!visible) {
      vtc = vec2(0.0);
      ${y(l,"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);")}
      return;
    }`)}
    ${y(z,f`voccluded = visible ? 0.0 : 1.0;`)}
  `);const I=f`
      vec2 uvi1 = vec2(uvi.x < 0.0 ? 1.0 : 0.0, uvi.y < 0.0 ? 1.0 : 0.0);
      vec2 uv = abs(uvi + uvi1);
      vec2 texSize = vec2(textureSize(tex, 0));
      uv.x = uv.x >= ${qe} ? 1.0 : uv.x / texSize.x;
      uv.y = uv.y >= ${qe} ? 1.0 : uv.y / texSize.y;
      quadOffset.xy = (uvi1 - anchorPosition) * 2.0 * combinedSize;

      ${y(S,f`
          float angle = radians(materialRotation + rotation);
          float cosAngle = cos(angle);
          float sinAngle = sin(angle);
          mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

          quadOffset.xy = rotate * quadOffset.xy;
        `)}

      quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,g=s?t?f`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:f`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:f`posProj += quadOffset;`;b.main.add(f`
    ${I}
    ${n?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${y(R===N.ObjectAndLayerIdColor,f`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < ${f.float(H)};
    ${y(t,`alphaDiscard = alphaDiscard && outlineColor.a < ${f.float(H)};`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${g}
      gl_Position = posProj;
    }

    vtc = uv;

    ${y(l,f`debugBorderCoords = vec4(uv01, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `),x.uniforms.add(new De("tex",(c=>c.texture))),p&&!T&&x.uniforms.add(new jt("depthMap",(c=>c.mainDepth)),new Lt("occludedOpacity",(c=>c.hudOccludedFragmentOpacity)));const L=l?f`(isBorder > 0.0 ? 0.0 : ${f.float(H)})`:f.float(H),D=f`
    ${y(l,f`float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`)}

    vec2 samplePos = vtc;

    ${y(h,f`
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`)}

    ${t?f`
      vec4 fillPixelColor = vcolor;

      // Get distance and map it into [-0.5, 0.5]
      float d = rgbaTofloat(texture(tex, samplePos)) - 0.5;

      // Distance in output units (i.e. pixels)
      float dist = d * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - dist, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(dist) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${L} ||
          fillPixelColor.a + outlinePixelColor.a < ${f.float(H)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${y(!T,f`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < ${L}) {
          discard;
        }

        ${y(!T,f`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-dist/vsize.x*2.0, 0.0, 1.0), clamp(dist/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:f`
          vec4 texColor = texture(tex, samplePos, -0.5);
          if (texColor.a < ${L}) {
            discard;
          }
          ${y(!T,f`fragColor = texColor * premultiplyAlpha(vcolor);`)}
          `}

    ${y(p&&!T,f`
        float zSample = texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x;
        if (zSample < gl_FragCoord.z) {
          fragColor *= occludedOpacity;
        }
        `)}

    ${y(!T&&l,f`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`)}
  `;switch(R){case N.Color:case N.ColorEmission:e.outputs.add("fragColor","vec4",0),R===N.ColorEmission&&e.outputs.add("fragEmission","vec4",1),F===K.ColorAlpha&&e.outputs.add("fragAlpha","float",R===N.ColorEmission?2:1),x.main.add(f`
        ${D}
        ${y(F===K.FrontFace,f`fragColor.rgb /= fragColor.a;`)}
        ${y(R===N.ColorEmission,f`fragEmission = vec4(0.0);`)}
        ${y(F===K.ColorAlpha,f`fragAlpha = fragColor.a;`)}`);break;case N.ObjectAndLayerIdColor:x.main.add(f`
        ${D}
        outputObjectAndLayerIdColor();`);break;case N.Highlight:e.include(Nt,o),x.main.add(f`
        ${D}
        outputHighlight(${y(z,f`voccluded == 1.0`,f`false`)});`)}return e}function Ve(o){return o.outlineColor[3]>0&&o.outlineSize>0}function oe(o){return o.textureIsSignedDistanceField?No(o.anchorPosition,o.distanceFieldBoundingBox,ce):ut(ce,o.anchorPosition),ce}function No(o,e,t){Ae(t,o[0]*(e[2]-e[0])+e[0],o[1]*(e[3]-e[1])+e[1])}const ce=Pe(),de=32e3,qe=f.float(de),Uo=Object.freeze(Object.defineProperty({__proto__:null,build:Lo,calculateAnchorPosition:oe,fullUV:de},Symbol.toStringTag,{value:"Module"}));class Bo extends Ut{constructor(e,t){super(e,t,new Bt(Uo,(()=>ht(()=>import("./HUDMaterial.glsl-CCYLL6Dh.js").then(i=>i.H),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]))))),this.primitiveType=t.occlusionPass?Fe.POINTS:Fe.TRIANGLES}initializePipeline(e){const{oitPass:t,hasPolygonOffset:i,draped:a,output:s,depthTestEnabled:r,occlusionPass:l}=e,u=t===K.NONE,n=t===K.ColorAlpha,S=s===N.Highlight,p=r&&!a&&!n&&!l&&!S;return xo({blending:et(s)?u?bo:qt(t):null,depthTest:r&&!a?{func:gt.LEQUAL}:null,depthWrite:p?Oo:null,drawBuffers:Vt(t,s),colorWrite:Co,polygonOffset:i?Vo:null})}}const Vo={factor:0,units:-4};class $ extends Ht{constructor(e){super(),this.spherical=e,this.screenCenterOffsetUnitsEnabled=!1,this.occlusionTestEnabled=!0,this.signedDistanceFieldEnabled=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.vvSize=!1,this.vvColor=!1,this.hasVerticalOffset=!1,this.hasScreenSizePerspective=!1,this.hasRotation=!1,this.debugDrawLabelBorder=!1,this.hasPolygonOffset=!1,this.depthTestEnabled=!0,this.pixelSnappingEnabled=!0,this.draped=!1,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.occlusionPass=!1,this.occludedFragmentFade=!1,this.objectAndLayerIdColorInstanced=!1,this.horizonCullingEnabled=!0,this.isFocused=!0,this.textureCoordinateType=Gt.None,this.emissionSource=Xt.None,this.discardInvisibleFragments=!0,this.hasVvInstancing=!1,this.snowCover=!1}}P([A()],$.prototype,"screenCenterOffsetUnitsEnabled",void 0),P([A()],$.prototype,"occlusionTestEnabled",void 0),P([A()],$.prototype,"signedDistanceFieldEnabled",void 0),P([A()],$.prototype,"sampleSignedDistanceFieldTexelCenter",void 0),P([A()],$.prototype,"vvSize",void 0),P([A()],$.prototype,"vvColor",void 0),P([A()],$.prototype,"hasVerticalOffset",void 0),P([A()],$.prototype,"hasScreenSizePerspective",void 0),P([A()],$.prototype,"hasRotation",void 0),P([A()],$.prototype,"debugDrawLabelBorder",void 0),P([A()],$.prototype,"hasPolygonOffset",void 0),P([A()],$.prototype,"depthTestEnabled",void 0),P([A()],$.prototype,"pixelSnappingEnabled",void 0),P([A()],$.prototype,"draped",void 0),P([A()],$.prototype,"terrainDepthTest",void 0),P([A()],$.prototype,"cullAboveTerrain",void 0),P([A()],$.prototype,"occlusionPass",void 0),P([A()],$.prototype,"occludedFragmentFade",void 0),P([A()],$.prototype,"objectAndLayerIdColorInstanced",void 0),P([A()],$.prototype,"horizonCullingEnabled",void 0),P([A()],$.prototype,"isFocused",void 0);let vi=class extends Wt{constructor(e,t){super(e,Qo),this.produces=new Map([[Q.HUD_MATERIAL,i=>ve(i)&&!this.parameters.drawAsLabel],[Q.LABEL_MATERIAL,i=>ve(i)&&this.parameters.drawAsLabel],[Q.OCCLUSION_PIXELS,()=>this.parameters.occlusionTest],[Q.DRAPED_MATERIAL,i=>this.parameters.draped&&ve(i)]]),this._visible=!0,this._configuration=new $(t)}getConfiguration(e,t){const i=this.parameters.draped;return super.getConfiguration(e,t,this._configuration),this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasVerticalOffset=!!this.parameters.verticalOffset,this._configuration.hasScreenSizePerspective=!!this.parameters.screenSizePerspective,this._configuration.screenCenterOffsetUnitsEnabled=this.parameters.centerOffsetUnits==="screen",this._configuration.hasPolygonOffset=this.parameters.polygonOffset,this._configuration.draped=i,this._configuration.occlusionTestEnabled=this.parameters.occlusionTest,this._configuration.pixelSnappingEnabled=this.parameters.pixelSnappingEnabled,this._configuration.signedDistanceFieldEnabled=this.parameters.textureIsSignedDistanceField,this._configuration.sampleSignedDistanceFieldTexelCenter=this.parameters.sampleSignedDistanceFieldTexelCenter,this._configuration.hasRotation=this.parameters.hasRotation,this._configuration.vvSize=!!this.parameters.vvSize,this._configuration.vvColor=!!this.parameters.vvColor,this._configuration.occlusionPass=t.slot===Q.OCCLUSION_PIXELS,this._configuration.occludedFragmentFade=!i&&this.parameters.occludedFragmentFade,this._configuration.horizonCullingEnabled=this.parameters.horizonCullingEnabled,this._configuration.isFocused=this.parameters.isFocused,this._configuration.depthTestEnabled=this.parameters.depthEnabled||t.slot===Q.OCCLUSION_PIXELS,et(e)&&(this._configuration.debugDrawLabelBorder=!!kt.LABELS_SHOW_BORDER),this._configuration.oitPass=t.oitPass,this._configuration.terrainDepthTest=t.terrainDepthTest,this._configuration.cullAboveTerrain=t.cullAboveTerrain,this._configuration}intersect(e,t,i,a,s,r){const{options:{selectionMode:l,hud:u,excludeLabels:n},point:S,camera:p}=i,{parameters:h}=this;if(!l||!u||n&&h.isLabel||!e.visible||!S||!p)return;const O=e.attributes.get(d.FEATUREATTRIBUTE),R=O==null?null:Ie(O.data,Oe),{scaleX:F,scaleY:b}=$e(R,h,p.pixelRatio);Xe(ue,t),e.attributes.has(d.FEATUREATTRIBUTE)&&Go(ue);const x=e.attributes.get(d.POSITION),T=e.attributes.get(d.SIZE),z=e.attributes.get(d.NORMAL),I=e.attributes.get(d.ROTATION),g=e.attributes.get(d.CENTEROFFSETANDDISTANCE);no(x.size>=3);const L=oe(h),D=this.parameters.centerOffsetUnits==="screen";for(let c=0;c<x.data.length/x.size;c++){const M=c*x.size;le(v,x.data[M],x.data[M+1],x.data[M+2]),Z(v,v,t),Z(v,v,p.viewMatrix);const w=c*g.size;if(le(C,g.data[w],g.data[w+1],g.data[w+2]),!D&&(v[0]+=C[0],v[1]+=C[1],C[2]!==0)){const U=C[2];xe(C,v),We(v,v,q(C,C,U))}const _=c*z.size;if(le(W,z.data[_],z.data[_+1],z.data[_+2]),be(W,ue,p,ee),Te(this.parameters,v,ee,p,Y),p.applyProjection(v,m),m[0]>-1){D&&(C[0]||C[1])&&(m[0]+=C[0]*p.pixelRatio,C[1]!==0&&(m[1]+=Ye(C[1],Y.factorAlignment)*p.pixelRatio),p.unapplyProjection(m,v)),m[0]+=this.parameters.screenOffset[0]*p.pixelRatio,m[1]+=this.parameters.screenOffset[1]*p.pixelRatio,m[0]=Math.floor(m[0]),m[1]=Math.floor(m[1]);const U=c*T.size;E[0]=T.data[U],E[1]=T.data[U+1],Je(E,Y.factor,E);const ae=lt*p.pixelRatio;let se=0;h.textureIsSignedDistanceField&&(se=Math.min(h.outlineSize,.5*E[0])*p.pixelRatio/2),E[0]*=F,E[1]*=b;const he=c*I.size,re=h.rotation+I.data[he];if(Ce(S,m[0],m[1],E,ae,se,re,h,L)){const B=i.ray;if(Z(fe,v,Qe(nt,p.viewMatrix)),m[0]=S[0],m[1]=S[1],p.unprojectFromRenderScreen(m,v)){const V=G();X(V,B.direction);const ze=1/te(V);q(V,V,ze),r(Ze(B.origin,v)*ze,V,-1,fe)}}}}}intersectDraped(e,t,i,a,s){const r=e.attributes.get(d.POSITION),l=e.attributes.get(d.SIZE),u=e.attributes.get(d.ROTATION),n=this.parameters,S=oe(n),p=e.attributes.get(d.FEATUREATTRIBUTE),h=p==null?null:Ie(p.data,Oe),{scaleX:O,scaleY:R}=$e(h,n,e.screenToWorldRatio),F=Wo*e.screenToWorldRatio;for(let b=0;b<r.data.length/r.size;b++){const x=b*r.size,T=r.data[x],z=r.data[x+1],I=b*l.size;E[0]=l.data[I],E[1]=l.data[I+1];let g=0;n.textureIsSignedDistanceField&&(g=Math.min(n.outlineSize,.5*E[0])*e.screenToWorldRatio/2),E[0]*=O,E[1]*=R;const L=b*u.size,D=n.rotation+u.data[L];Ce(i,T,z,E,F,g,D,n,S)&&a(s.distance,s.normal,-1)}}createBufferWriter(){return new Yo}applyShaderOffsetsView(e,t,i,a,s,r,l){const u=be(t,i,s,ee);return this._applyVerticalGroundOffsetView(e,u,s,l),Te(this.parameters,l,u,s,r),this._applyPolygonOffsetView(l,u,a[3],s,l),this._applyCenterOffsetView(l,a,l),l}applyShaderOffsetsNDC(e,t,i,a,s){return this._applyCenterOffsetNDC(e,t,i,a),s!=null&&X(s,a),this._applyPolygonOffsetNDC(a,t,i,a),a}_applyPolygonOffsetView(e,t,i,a,s){const r=a.aboveGround?1:-1;let l=Math.sign(i);l===0&&(l=r);const u=r*l;if(this.parameters.shaderPolygonOffset<=0)return X(s,e);const n=vt(Math.abs(t.cosAngle),.01,1),S=1-Math.sqrt(1-n*n)/n/a.viewport[2];return q(s,e,u>0?S:1/S),s}_applyVerticalGroundOffsetView(e,t,i,a){const s=te(e),r=i.aboveGround?1:-1,l=i.computeRenderPixelSizeAtDist(s)*vo,u=q(v,t.normal,r*l);return Ee(a,e,u),a}_applyCenterOffsetView(e,t,i){const a=this.parameters.centerOffsetUnits!=="screen";return i!==e&&X(i,e),a&&(i[0]+=t[0],i[1]+=t[1],t[2]&&(xe(W,i),mt(i,i,q(W,W,t[2])))),i}_applyCenterOffsetNDC(e,t,i,a){const s=this.parameters.centerOffsetUnits!=="screen";return a!==e&&X(a,e),s||(a[0]+=t[0]/i.fullWidth*2,a[1]+=t[1]/i.fullHeight*2),a}_applyPolygonOffsetNDC(e,t,i,a){const s=this.parameters.shaderPolygonOffset;if(e!==a&&X(a,e),s){const r=i.aboveGround?1:-1,l=r*Math.sign(t[3]);a[2]-=(l||r)*s}return a}set visible(e){this._visible=e}get visible(){const{color:e,outlineSize:t,outlineColor:i}=this.parameters,a=e[3]>=H||t>=H&&i[3]>=H;return this._visible&&a}createGLMaterial(e){return new qo(e)}calculateRelativeScreenBounds(e,t,i=St()){return Ho(this.parameters,e,t,i),i[2]=i[0]+e[0],i[3]=i[1]+e[1],i}};class qo extends so{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){return this.updateTexture(this._material.parameters.textureId),this._material.setParameters(this.textureBindParameters),this.getTechnique(Bo,e)}}function Ho(o,e,t,i){i[0]=o.anchorPosition[0]*-e[0]+o.screenOffset[0]*t,i[1]=o.anchorPosition[1]*-e[1]+o.screenOffset[1]*t}function be(o,e,t,i){return Do(e)&&(e=Xe(Xo,e)),xt(i.normal,o,e),Z(i.normal,i.normal,t.viewInverseTransposeMatrix),i.cosAngle=bt(rt,ko),i}function Go(o){const e=o[0],t=o[1],i=o[2],a=o[3],s=o[4],r=o[5],l=o[6],u=o[7],n=o[8],S=1/Math.sqrt(e*e+t*t+i*i),p=1/Math.sqrt(a*a+s*s+r*r),h=1/Math.sqrt(l*l+u*u+n*n);return o[0]=e*S,o[1]=t*S,o[2]=i*S,o[3]=a*p,o[4]=s*p,o[5]=r*p,o[6]=l*h,o[7]=u*h,o[8]=n*h,o}function Ce(o,e,t,i,a,s,r,l,u){let n=e-a-i[0]*u[0],S=n+i[0]+2*a,p=t-a-i[1]*u[1],h=p+i[1]+2*a;const O=l.distanceFieldBoundingBox;return l.textureIsSignedDistanceField&&O!=null&&(n+=i[0]*O[0],p+=i[1]*O[1],S-=i[0]*(1-O[2]),h-=i[1]*(1-O[3]),n-=s,S+=s,p-=s,h+=s),Ae(He,e,t),Ot(J,o,He,$t(r)),J[0]>n&&J[0]<S&&J[1]>p&&J[1]<h}const Y=new Mo,v=G(),W=G(),m=pe(),rt=G(),fe=G(),J=Pe(),He=Pe(),ue=Ke(),Xo=Ke(),nt=ro(),ne=pe(),C=G(),me=G(),Oe=pe(),ee={normal:rt,cosAngle:0},lt=1,Wo=2,E=ke(0,0),j=6,ko=Ct(0,0,1);class Qo extends Qt{constructor(){super(...arguments),this.renderOccluded=Zt.Occlude,this.isDecoration=!1,this.color=Se(1,1,1,1),this.polygonOffset=!1,this.anchorPosition=ke(.5,.5),this.screenOffset=[0,0],this.shaderPolygonOffset=1e-5,this.textureIsSignedDistanceField=!1,this.sampleSignedDistanceFieldTexelCenter=!1,this.outlineColor=Se(1,1,1,1),this.outlineSize=0,this.distanceFieldBoundingBox=pe(),this.rotation=0,this.hasRotation=!1,this.vvSizeEnabled=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.hasSlicePlane=!1,this.pixelSnappingEnabled=!0,this.occlusionTest=!0,this.occludedFragmentFade=!1,this.horizonCullingEnabled=!1,this.centerOffsetUnits="world",this.drawAsLabel=!1,this.depthEnabled=!0,this.isFocused=!0,this.focusStyle="bright",this.draped=!1,this.isLabel=!1}}const ct=fo().vec3f(d.POSITION).vec3f(d.NORMAL).vec2i16(d.UVI).vec4u8(d.COLOR).vec2f(d.SIZE).f32(d.ROTATION).vec4f(d.CENTEROFFSETANDDISTANCE).vec4f(d.FEATUREATTRIBUTE),Zo=ct.clone().vec4u8(d.OLIDCOLOR);class Yo{constructor(){this.vertexBufferLayout=Kt()?Zo:ct}elementCount(e){return e.get(d.POSITION).indices.length*j}write(e,t,i,a,s,r){const{position:l,normal:u,uvi:n,color:S,size:p,rotation:h,centerOffsetAndDistance:O,featureAttribute:R}=s;eo(i.get(d.POSITION),e,l,r,j),to(i.get(d.NORMAL),t,u,r,j);const F=i.get(d.UVI)?.data;let b=0,x=0,T=-1-de,z=-1-de;F&&F.length>=4&&(b=F[0],x=F[1],T=-1-F[2],z=-1-F[3]);let I=i.get(d.POSITION).indices.length,g=r;for(let c=0;c<I;++c)n.set(g,0,b),n.set(g,1,x),g++,n.set(g,0,T),n.set(g,1,x),g++,n.set(g,0,T),n.set(g,1,z),g++,n.set(g,0,T),n.set(g,1,z),g++,n.set(g,0,b),n.set(g,1,z),g++,n.set(g,0,b),n.set(g,1,x),g++;oo(i.get(d.COLOR),4,S,r,j);const{data:L,indices:D}=i.get(d.SIZE);I=D.length,g=r;for(let c=0;c<I;++c){const M=L[2*D[c]],w=L[2*D[c]+1];for(let _=0;_<j;++_)p.set(g,0,M),p.set(g,1,w),g++}if(io(i.get(d.ROTATION),h,r,j),i.get(d.CENTEROFFSETANDDISTANCE)?Me(i.get(d.CENTEROFFSETANDDISTANCE),O,r,j):je(O,r,I*j),i.get(d.FEATUREATTRIBUTE)?Me(i.get(d.FEATUREATTRIBUTE),R,r,j):je(R,r,I*j),a!=null){const c=i.get(d.POSITION)?.indices;if(c){const M=c.length,w=s.getField(d.OLIDCOLOR,lo);ao(a,w,M,r,j)}}return{numVerticesPerItem:j,numItems:I}}intersect(e,t,i,a,s,r,l){const{options:{selectionMode:u,hud:n,excludeLabels:S},point:p,camera:h}=a;if(!u||!n||S&&t.isLabel||!p)return;const O=this.vertexBufferLayout.createView(e),R=O.getField(d.POSITION,Ne),F=O.getField(d.NORMAL,Ne),b=O.getField(d.ROTATION,co),x=O.getField(d.SIZE,uo),T=O.getField(d.FEATUREATTRIBUTE,Ue),z=O.getField(d.CENTEROFFSETANDDISTANCE,Ue),I=t.centerOffsetUnits==="screen",g=oe(t);if(R==null||F==null||b==null||x==null||z==null||h==null)return;const L=T==null?null:T.getVec(0,Oe),{scaleX:D,scaleY:c}=$e(L,t,h.pixelRatio),M=R.count/j;for(let w=0;w<M;w++){const _=w*j;if(R.getVec(_,v),i!=null&&Ee(v,v,i),Z(v,v,h.viewMatrix),z.getVec(_,ne),le(C,ne[0],ne[1],ne[2]),!I&&(v[0]+=C[0],v[1]+=C[1],C[2]!==0)){const U=C[2];xe(C,v),We(v,v,q(C,C,U))}if(F.getVec(_,W),be(W,ue,h,ee),Te(t,v,ee,h,Y),h.applyProjection(v,m),m[0]>-1){I&&(C[0]||C[1])&&(m[0]+=C[0]*h.pixelRatio,C[1]!==0&&(m[1]+=Ye(C[1],Y.factorAlignment)*h.pixelRatio),h.unapplyProjection(m,v)),m[0]+=t.screenOffset[0]*h.pixelRatio,m[1]+=t.screenOffset[1]*h.pixelRatio,m[0]=Math.floor(m[0]),m[1]=Math.floor(m[1]),x.getVec(_,E),Je(E,Y.factor,E);const U=lt*h.pixelRatio;let ae=0;t.textureIsSignedDistanceField&&(ae=Math.min(t.outlineSize,.5*E[0])*h.pixelRatio/2),E[0]*=D,E[1]*=c;const se=b.get(_),he=t.rotation+se;if(Ce(p,m[0],m[1],E,U,ae,he,t,g)){const re=a.ray;if(Z(fe,v,Qe(nt,h.viewMatrix)),m[0]=p[0],m[1]=p[1],h.unprojectFromRenderScreen(m,v)){const B=G();X(B,re.direction);const V=1/te(B);q(B,B,V),l(Ze(re.origin,v)*V,B,w,fe)}}}}}}function $e(o,e,t){return o==null||e.vvSize==null?{scaleX:t,scaleY:t}:(Yt(me,e,o),{scaleX:me[0]*t,scaleY:me[1]*t})}function Te(o,e,t,i,a){if(!o.verticalOffset?.screenLength)return o.screenSizePerspective||o.screenSizePerspectiveAlignment?Ge(o,a,te(e),t.cosAngle):(a.factor.scale=1,a.factorAlignment.scale=1),e;const s=te(e),r=o.screenSizePerspectiveAlignment??o.screenSizePerspective,l=Jt(i,s,o.verticalOffset,t.cosAngle,r);return Ge(o,a,s,t.cosAngle),q(t.normal,t.normal,l),Ee(e,e,t.normal)}function Ge(o,e,t,i){o.screenSizePerspective!=null?Le(i,t,o.screenSizePerspective,e.factor):(e.factor.scale=1,e.factor.factor=0,e.factor.minScaleFactor=0),o.screenSizePerspectiveAlignment!=null?Le(i,t,o.screenSizePerspectiveAlignment,e.factorAlignment):(e.factorAlignment.factor=e.factor.factor,e.factorAlignment.scale=e.factor.scale,e.factorAlignment.minScaleFactor=e.factor.minScaleFactor)}export{Lo as B,oe as M,de as V,gi as a,ye as b,hi as c,To as i,k as o,pi as s,vi as u};
