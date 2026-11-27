import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const stage=document.querySelector("#showroom-stage");
const canvas=document.querySelector("#showroom-webgl");
if(stage&&canvas&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  try{
    const records=[
      {name:"MOONLIGHT",sub:"DAY$ B4 / SPX — 03",tone:"#7ab4bd",accent:"#c8e8e8",kind:"DAY$ B4 · RELEASE",description:"A late-night chapter from the DAY$ B4 era. Step into the sound and explore the artist catalogue."},
      {name:"LONG ROAD",sub:"FT. MKP SUNNY / SPX — 01",tone:"#9b7056",accent:"#e5c6a7",kind:"WITH MKP SUNNY · SINGLE",description:"A collaboration with MKP Sunny. A record from the road that shaped the sound."},
      {name:"DEAR TWINN",sub:"FT. YTB ACE / SPX — 02",tone:"#a66d72",accent:"#f0c1bc",kind:"WITH YTB ACE · SINGLE",description:"A collaboration with YTB Ace. Open the record to find the artist's streaming catalogue."},
      {name:"GIVE ME THE LOOT",sub:"NO FILTER / NO FRONT / SPX — 04",tone:"#b68b42",accent:"#f0d38d",kind:"SINGLE",description:"A selected cut from the catalogue. Tap listen to continue to the official artist profile."},
      {name:"WANNA BE LOVED",sub:"AFTER HOURS / SPX — 05",tone:"#a75b6c",accent:"#f2c1ca",kind:"SINGLE",description:"A melodic, emotionally direct entry in the Sparxx catalogue."},
      {name:"DARK $TREETS",sub:"VILLAIN MUSIC / SPX — 06",tone:"#567f89",accent:"#b4e0e5",kind:"SINGLE",description:"A darker chapter in the catalogue. Select listen to visit the official artist profile."}
    ];
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(stage.clientWidth,window.innerHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.12;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x05090d);
    scene.fog=new THREE.FogExp2(0x05090d,.026);
    const camera=new THREE.PerspectiveCamera(48,stage.clientWidth/window.innerHeight,.1,120);
    camera.position.set(0,1.1,10);
    const ambient=new THREE.AmbientLight(0x9bcbd0,1.35);scene.add(ambient);
    const key=new THREE.PointLight(0x70d4df,42,36,1.8);key.position.set(-4,5,4);scene.add(key);
    const warm=new THREE.PointLight(0xb84c43,26,30,2);warm.position.set(5,1,-9);scene.add(warm);
    const back=new THREE.PointLight(0x397f94,34,38,2);back.position.set(0,4,-18);scene.add(back);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshStandardMaterial({color:0x071116,metalness:.68,roughness:.36}));
    floor.rotation.x=-Math.PI/2;floor.position.set(0,-3.2,-9);scene.add(floor);
    const grid=new THREE.GridHelper(70,42,0x28606a,0x15343b);grid.position.set(0,-3.17,-9);grid.material.transparent=true;grid.material.opacity=.34;scene.add(grid);
    const group=new THREE.Group();scene.add(group);
    const panelMeshes=[];
    const makeTexture=(record,index)=>{
      const c=document.createElement("canvas");c.width=900;c.height=1100;
      const ctx=c.getContext("2d");
      const g=ctx.createLinearGradient(0,0,900,1100);g.addColorStop(0,"#1b3038");g.addColorStop(.48,record.tone);g.addColorStop(1,"#05090d");ctx.fillStyle=g;ctx.fillRect(0,0,900,1100);
      const glow=ctx.createRadialGradient(470,350,20,450,430,560);glow.addColorStop(0,record.accent+"bb");glow.addColorStop(.3,record.tone+"88");glow.addColorStop(1,"transparent");ctx.fillStyle=glow;ctx.fillRect(0,0,900,1100);
      ctx.save();ctx.translate(450,465);ctx.rotate(index%2?.25:-.2);
      for(let r=110;r<590;r+=38){ctx.beginPath();ctx.ellipse(0,0,r,r*.68,0,0,Math.PI*2);ctx.strokeStyle=record.accent+(r%3?"28":"66");ctx.lineWidth=r%3?2:4;ctx.stroke();}
      ctx.restore();
      ctx.fillStyle="rgba(0,0,0,.24)";ctx.fillRect(0,0,900,1100);
      ctx.fillStyle="rgba(244,249,247,.72)";ctx.font="600 23px Arial";ctx.letterSpacing="7px";ctx.fillText("SPARXX STILL GOATED",66,88);
      ctx.fillStyle="#f2eee6";ctx.font="900 105px Arial";ctx.letterSpacing="-5px";
      const words=record.name.split(" ");words.forEach((word,i)=>ctx.fillText(word,66,760+i*105));
      ctx.fillStyle=record.accent;ctx.font="600 22px Arial";ctx.letterSpacing="5px";ctx.fillText(record.sub,68,1010);
      ctx.strokeStyle="rgba(235,249,249,.6)";ctx.lineWidth=2;ctx.strokeRect(30,30,840,1040);
      const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();return texture;
    };
    records.forEach((record,i)=>{
      const z=4-i*4.25;
      const x=[-1.8,1.9,-1.35,1.65,-1.8,1.35][i];
      const y=[.25,.55,.1,.48,.12,.42][i];
      const frame=new THREE.Mesh(new THREE.BoxGeometry(3.05,3.72,.16),new THREE.MeshStandardMaterial({color:0x18272d,metalness:.82,roughness:.24}));
      frame.position.set(x,y,z);frame.rotation.y=x*.045;group.add(frame);
      const art=new THREE.Mesh(new THREE.PlaneGeometry(2.88,3.55),new THREE.MeshStandardMaterial({map:makeTexture(record,i),metalness:.24,roughness:.42,emissive:0x14262a,emissiveIntensity:.22}));
      art.position.set(x,y,z+.091);art.rotation.y=frame.rotation.y;art.userData.recordIndex=i;group.add(art);panelMeshes.push(art);
      const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.08,3.75,.18)),new THREE.LineBasicMaterial({color:0x8ddce3,transparent:true,opacity:.54}));
      edge.position.copy(frame.position);edge.rotation.copy(frame.rotation);group.add(edge);
      const glow=new THREE.Mesh(new THREE.PlaneGeometry(3.6,4.25),new THREE.MeshBasicMaterial({color:0x287d8c,transparent:true,opacity:.075,side:THREE.DoubleSide,depthWrite:false}));
      glow.position.set(x,y,z-.11);glow.rotation.y=frame.rotation.y;group.add(glow);
      const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.95,.95,.12,48),new THREE.MeshStandardMaterial({color:0x183139,metalness:.85,roughness:.24,emissive:0x12323a,emissiveIntensity:.32}));
      pedestal.position.set(x,-2.15,z);group.add(pedestal);
      const halo=new THREE.Mesh(new THREE.TorusGeometry(1.03,.018,8,64),new THREE.MeshBasicMaterial({color:record.accent,transparent:true,opacity:.8}));
      halo.rotation.x=Math.PI/2;halo.position.set(x,-2.07,z);group.add(halo);
      const point=new THREE.PointLight(new THREE.Color(record.tone),5,7,2);point.position.set(x,y+1,z+1.4);group.add(point);
    });
    // Repeating architectural ribs make the catalogue feel like a physical gallery.
    for(let i=0;i<7;i++){
      const z=5-i*4.25;
      const arch=new THREE.Mesh(new THREE.TorusGeometry(5.4,.025,8,90,Math.PI),new THREE.MeshBasicMaterial({color:0x5b9ba5,transparent:true,opacity:.22}));
      arch.rotation.z=Math.PI;arch.position.set(0,1.1,z-1.6);group.add(arch);
      [-5.4,5.4].forEach(x=>{
        const rail=new THREE.Mesh(new THREE.BoxGeometry(.035,5,.035),new THREE.MeshBasicMaterial({color:0x39727c,transparent:true,opacity:.34}));
        rail.position.set(x,-.3,z-1.7);group.add(rail);
      });
    }
    const starsGeo=new THREE.BufferGeometry(),starPos=[];
    for(let i=0;i<240;i++)starPos.push((Math.random()-.5)*34,(Math.random()-.5)*16-1,-Math.random()*34);
    starsGeo.setAttribute("position",new THREE.Float32BufferAttribute(starPos,3));
    const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x9ddce1,size:.035,transparent:true,opacity:.55}));scene.add(stars);
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
    let progress=0,targetProgress=0,dragging=false,dragged=false,lastX=0,lastY=0,dragX=0,dragY=0,selected=-1,focusedX=0;
    const reduced=false;
    const consoleRoot=document.querySelector("#showroom-console");
    const title=consoleRoot?.querySelector("h3"),copy=consoleRoot?.querySelector(".console-copy p"),kicker=consoleRoot?.querySelector(".console-kicker"),count=consoleRoot?.querySelector(".console-track-count"),listen=consoleRoot?.querySelector(".console-listen");
    const buttons=[...stage.querySelectorAll(".showroom-card")];
    const selectRecord=(index)=>{
      if(index<0||index>=records.length)return;
      selected=index;const r=records[index];
      buttons.forEach((b,i)=>{b.classList.toggle("is-selected",i===index);b.setAttribute("aria-pressed",String(i===index));});
      if(kicker)kicker.textContent="NOW SELECTED / "+String(index+1).padStart(3,"0");
      if(title)title.innerHTML=r.name+"<br><span>IN THE SPOTLIGHT.</span>";
      if(copy)copy.textContent=r.description;
      if(count)count.textContent=r.kind.toUpperCase();
      if(listen)listen.innerHTML='LISTEN TO THE ARTIST <b>↗</b>';
      focusedX=[-1.8,1.9,-1.35,1.65,-1.8,1.35][index];
      stage.dispatchEvent(new CustomEvent("recordselect",{detail:{index,name:r.name}}));
    };
    buttons.forEach((b,i)=>{b.setAttribute("aria-pressed","false");b.addEventListener("click",()=>selectRecord(i));});
    const setPointer=(e)=>{
      const rect=canvas.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
    };
    canvas.addEventListener("pointerdown",e=>{dragging=true;dragged=false;lastX=e.clientX;lastY=e.clientY;dragX=0;dragY=0;canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener("pointermove",e=>{
      setPointer(e);
      if(dragging){const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)dragged=true;dragX+=dx;dragY+=dy;lastX=e.clientX;lastY=e.clientY;}
    });
    canvas.addEventListener("pointerup",e=>{
      if(!dragged){setPointer(e);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(panelMeshes,false);if(hits.length)selectRecord(hits[0].object.userData.recordIndex);}
      dragging=false;
    });
    canvas.addEventListener("pointercancel",()=>dragging=false);
    canvas.addEventListener("keydown",e=>{
      if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();selectRecord(Math.min(records.length-1,Math.max(0,selected+1)));}
      if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();selectRecord(Math.max(0,selected<0?0:selected-1));}
      if(e.key==="Enter"&&selected<0)selectRecord(0);
    });
    const getProgress=()=>{
      const r=stage.getBoundingClientRect();const span=Math.max(1,r.height-window.innerHeight);
      targetProgress=THREE.MathUtils.clamp(-r.top/span,0,1);
    };
    window.addEventListener("scroll",getProgress,{passive:true});window.addEventListener("resize",getProgress,{passive:true});getProgress();
    const resize=()=>{
      const w=Math.max(1,stage.clientWidth),h=window.innerHeight;
      renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      camera.aspect=w/h;camera.updateProjectionMatrix();getProgress();
    };
    window.addEventListener("resize",resize,{passive:true});resize();
    const clock=new THREE.Clock();let raf=0,visible=true;
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();else cancelAnimationFrame(raf);},{threshold:0});
    observer.observe(stage);
    const render=()=>{
      if(!visible)return;
      raf=requestAnimationFrame(render);
      const t=clock.getElapsedTime();progress=THREE.MathUtils.lerp(progress,targetProgress,.055);
      const travel=10-progress*25.2;
      const pointerX=dragging?THREE.MathUtils.clamp(dragX*.003,-1.3,1.3):0;
      const pointerY=dragging?THREE.MathUtils.clamp(dragY*.002,-.45,.45):0;
      const drift=Math.sin(t*.18)*.18;
      const targetX=pointerX+drift+(selected>=0?focusedX*.08:0);
      camera.position.x=THREE.MathUtils.lerp(camera.position.x,targetX,.045);
      camera.position.y=THREE.MathUtils.lerp(camera.position.y,1.05-pointerY,.045);
      camera.position.z=THREE.MathUtils.lerp(camera.position.z,travel,.065);
      camera.rotation.y=THREE.MathUtils.lerp(camera.rotation.y,-pointerX*.055+Math.sin(t*.12)*.012,.04);
      camera.rotation.x=THREE.MathUtils.lerp(camera.rotation.x,pointerY*.025,.04);
      group.children.forEach((obj,i)=>{if(obj.isMesh&&obj.geometry.type==="PlaneGeometry"&&obj.userData.recordIndex!==undefined){const k=obj.userData.recordIndex;obj.rotation.z=Math.sin(t*.35+k)*.012;obj.position.y=[.25,.55,.1,.48,.12,.42][k]+Math.sin(t*.55+k*1.4)*.045;}});
      stars.rotation.y=t*.006;grid.position.z=-9+Math.sin(t*.15)*.08;
      renderer.render(scene,camera);
    };
    stage.classList.add("webgl-ready");render();
    document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else if(visible)render();});
  }catch(error){console.warn("3D showroom could not start; accessible catalogue fallback remains available.",error);}
}
