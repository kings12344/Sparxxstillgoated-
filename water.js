import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#water-scene");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canvas && !reduceMotion) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, .1, 100);
    camera.position.z = 7;

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(.5, .5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const waterMaterial = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uScroll;
        void main(){
          vUv = uv;
          vec3 p = position;
          float wave = sin(p.x * 2.2 + uTime * .45 + uScroll * 8.0) * .055;
          wave += cos(p.y * 3.0 - uTime * .32 + uScroll * 5.0) * .04;
          p.z += wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform vec2 uResolution;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
        }
        void main(){
          vec2 uv=vUv;
          float aspect=uResolution.x/uResolution.y;
          vec2 p=(uv-.5)*vec2(aspect,1.0);
          float t=uTime*.16;
          float scroll=uScroll*8.0;
          vec2 pointer=(uPointer-.5)*vec2(aspect,1.0);
          float d=length(p-pointer);
          float ripple=sin(d*24.0-t*3.2-scroll)*exp(-d*2.8);
          float a=sin(p.x*4.0+t+sin(p.y*3.0-t*.6))*0.035;
          float b=cos(p.y*5.0-t*.8+scroll*.3)*0.025;
          float n=noise(p*3.0+vec2(t,-t*.7))*.08;
          float wave=ripple*.035+a+b+n;
          vec2 warped=uv+vec2(wave, wave*.7);
          float lines=sin((warped.y*1.8+warped.x*.45+wave*2.0)*48.0-scroll*1.8);
          float caustic=pow(max(0.0,lines),12.0)*.16;
          float depth=smoothstep(.15,.85,noise(warped*vec2(5.0,8.0)+t));
          vec3 deep=vec3(.012,.045,.060);
          vec3 teal=vec3(.055,.27,.31);
          vec3 red=vec3(.30,.035,.045);
          float light=smoothstep(.2,.95,noise(warped*4.0+vec2(t*.4,-t)));
          vec3 color=mix(deep,teal,depth*.8+caustic);
          color=mix(color,red,smoothstep(.72,1.0,uv.x+sin(uv.y*5.0+t)*.08)*.34);
          color+=vec3(.30,.72,.78)*(caustic+max(0.0,wave)*1.5)*.42;
          color+=vec3(.13,.025,.035)*light*.22;
          float vignette=smoothstep(1.05,.18,length((uv-.5)*vec2(aspect*.65,1.0)));
          float alpha=(.12+depth*.22+caustic*.8+abs(ripple)*.18)*vignette;
          gl_FragColor=vec4(color,alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(14, 9, 90, 60), waterMaterial);
    plane.position.z = -1.2;
    scene.add(plane);

    const orbGeometry = new THREE.IcosahedronGeometry(1.45, 5);
    const orbMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: uniforms.uTime, uScroll: uniforms.uScroll },
      transparent: true,
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main(){
          vNormal=normalize(normalMatrix*normal);
          vec3 p=position;
          float swell=sin(p.y*3.0+uTime*.5+uScroll*8.0)*.045+cos(p.x*4.0-uTime*.4)*.035;
          p+=normal*swell;
          vPosition=p;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main(){
          vec3 viewDir=normalize(cameraPosition-vPosition);
          float fresnel=pow(1.0-max(dot(normalize(vNormal),viewDir),0.0),2.2);
          float bands=sin(vPosition.y*5.0+vPosition.x*3.0)*.5+.5;
          vec3 base=mix(vec3(.018,.10,.13),vec3(.18,.46,.49),bands*.48);
          vec3 color=mix(base,vec3(.66,.91,.91),fresnel*.85);
          color=mix(color,vec3(.55,.055,.07),smoothstep(.6,1.0,vPosition.x)*.34);
          gl_FragColor=vec4(color,.18+fresnel*.55);
        }
      `
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(2.25, .05, -.1);
    orb.scale.set(1.12, 1.12, .58);
    scene.add(orb);

    const pointer = new THREE.Vector2(.68,.56);
    let targetX = pointer.x, targetY = pointer.y;
    window.addEventListener("pointermove", e => {
      targetX = e.clientX / window.innerWidth;
      targetY = 1 - e.clientY / window.innerHeight;
    }, { passive: true });

    let scrollTarget = 0;
    const setScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", setScroll, { passive: true });
    setScroll();

    const clock = new THREE.Clock();
    const resize = () => {
      const w=window.innerWidth, h=window.innerHeight;
      renderer.setSize(w,h,false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
      camera.aspect=w/h;
      camera.updateProjectionMatrix();
      uniforms.uResolution.value.set(w,h);
      if(w<760){orb.position.set(1.35,.05,-.25);orb.scale.set(.8,.8,.42);}
      else{orb.position.set(2.25,.05,-.1);orb.scale.set(1.12,1.12,.58);}
    };
    window.addEventListener("resize",resize,{passive:true});
    resize();

    let frame=0;
    const render=()=>{
      frame=requestAnimationFrame(render);
      const elapsed=clock.getElapsedTime();
      uniforms.uTime.value=elapsed;
      uniforms.uScroll.value=THREE.MathUtils.lerp(uniforms.uScroll.value,scrollTarget,.045);
      uniforms.uPointer.value.x=THREE.MathUtils.lerp(uniforms.uPointer.value.x,targetX,.035);
      uniforms.uPointer.value.y=THREE.MathUtils.lerp(uniforms.uPointer.value.y,targetY,.035);
      orb.rotation.y=elapsed*.12+uniforms.uScroll.value*2.4;
      orb.rotation.x=Math.sin(elapsed*.18)*.12+uniforms.uScroll.value*.35;
      orb.position.y=Math.sin(elapsed*.32)*.16-uniforms.uScroll.value*.32;
      renderer.render(scene,camera);
    };
    render();

    document.addEventListener("visibilitychange",()=>{
      if(document.hidden){cancelAnimationFrame(frame);}
      else{render();}
    });
  } catch (error) {
    console.warn("3D water scene unavailable; CSS motion remains active.", error);
  }
}
