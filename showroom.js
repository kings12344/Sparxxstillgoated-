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
    camera.rotation.x=-0.08;
    const ambient=new THREE.AmbientLight(0x9bcbd0,1.35);scene.add(ambient);
    const key=new THREE.PointLight(0x70d4df,42,36,1.8);key.position.set(-4,5,4);scene.add(key);
    const warm=new THREE.PointLight(0xb84c43,26,30,2);warm.position.set(5,1,-9);scene.add(warm);
    const back=new THREE.PointLight(0x397f94,34,38,2);back.position.set(0,4,-18);scene.add(back);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshStandardMaterial({color:0x071116,metalness:.68,roughness:.36}));
    floor.rotation.x=-Math.PI/2;floor.position.set(0,-3.2,-9);scene.add(floor);
    const grid=new THREE.GridHelper(70,42,0x28606a,0x15343b);grid.position.set(0,-3.17,-9);grid.material.transparent=true;grid.material.opacity=.34;scene.add(grid);
    const group=new THREE.Group();scene.add(group);
    const panelMeshes=[];
    const displayObjects=[];
    const makeTexture=(record,index)=>{
      const c=document.createElement("canvas");c.width=900;c.height=1100;
      const ctx=c.getContext("2d");
      const g=ctx.createLinearGradient(0,0,900,1100);g.addColorStop(0,"#1b3038");g.addColorStop(.48,record.tone);g.addColorStop(1,"#05090d");ctx.fillStyle=g;ctx.fillRect(0,0,900,1100);
      const glow=ctx.createRadialGradient(470,350,20,450,430,560);glow.addColorStop(0,record.accent+"bb");glow.addColorStop(.3,record.tone+"88");glow.addColorStop(1,"transparent");ctx.fillStyle=glow;ctx.fillRect(0,0,900,1100);
      ctx.save();ctx.translate(450,465);ctx.rotate(index%2 ? 0.25 : -0.2);
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
      // A physical vinyl record sits just behind each sleeve and slides out when selected.
      const vinylGroup=new THREE.Group();
      vinylGroup.position.set(x+(x<0?1.05:-1.05),y,z+.035);
      group.add(vinylGroup);
      const disc=new THREE.Mesh(new THREE.CircleGeometry(1.12,72),new THREE.MeshStandardMaterial({color:0x11171a,metalness:.72,roughness:.28,emissive:new THREE.Color(record.tone),emissiveIntensity:.08,side:THREE.DoubleSide}));
      vinylGroup.add(disc);
      for(let ring=0;ring<8;ring++){
        const groove=new THREE.Mesh(new THREE.TorusGeometry(.32+ring*.095,.006,5,72),new THREE.MeshBasicMaterial({color:ring%2?0x52646a:0x9aaeb0,transparent:true,opacity:.22}));
        vinylGroup.add(groove);
      }
      const label=new THREE.Mesh(new THREE.CircleGeometry(.27,40),new THREE.MeshStandardMaterial({color:new THREE.Color(record.tone),metalness:.18,roughness:.58,side:THREE.DoubleSide}));
      label.position.z=.012;vinylGroup.add(label);
      const spindle=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.025,16),new THREE.MeshStandardMaterial({color:0xe0d9c9,metalness:.8,roughness:.2}));
      spindle.rotation.x=Math.PI/2;spindle.position.z=.025;vinylGroup.add(spindle);
      const discLight=new THREE.PointLight(new THREE.Color(record.tone),1.8,4,2);discLight.position.set(0,.25,1);vinylGroup.add(discLight);
      displayObjects.push({frame,art,vinylGroup,glow:null,record,x,y,z});
      const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.08,3.75,.18)),new THREE.LineBasicMaterial({color:0x8ddce3,transparent:true,opacity:.54}));
      edge.position.copy(frame.position);edge.rotation.copy(frame.rotation);group.add(edge);
      const glow=new THREE.Mesh(new THREE.PlaneGeometry(3.6,4.25),new THREE.MeshBasicMaterial({color:0x287d8c,transparent:true,opacity:.075,side:THREE.DoubleSide,depthWrite:false}));
      glow.position.set(x,y,z-.11);glow.rotation.y=frame.rotation.y;group.add(glow);
      displayObjects[i].glow=glow;
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
    const makeLyric=(text,color,width)=>{const c=document.createElement("canvas");c.width=1800;c.height=360;const x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);x.textAlign="center";x.textBaseline="middle";x.font="900 154px Arial";x.shadowColor=color;x.shadowBlur=42;x.fillStyle=color;x.fillText(text,900,180);x.shadowBlur=0;x.lineWidth=3;x.strokeStyle="rgba(255,255,255,.7)";x.strokeText(text,900,180);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:0});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,width*.2),mat);return mesh;};
    const lyricHim=makeLyric("SPARXXSTILLGOATED IS STILL HIM","#f0c66e",8.6);lyricHim.position.set(0,2.65,-3.4);scene.add(lyricHim);
    const lyricNamanje=makeLyric("NAMANJE","#a7eaf0",5.8);lyricNamanje.position.set(0,-1.85,-11.5);scene.add(lyricNamanje);
    const lyricSparks=new THREE.Group();scene.add(lyricSparks);
    for(let i=0;i<48;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.018+Math.random()*.035,6,6),new THREE.MeshBasicMaterial({color:i%3?0x8de5eb:0xf1c66b,transparent:true,opacity:.8}));m.position.set((Math.random()-.5)*13,(Math.random()-.5)*8,-2-Math.random()*17);m.userData.phase=Math.random()*Math.PI*2;lyricSparks.add(m);}
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
    let progress=0,targetProgress=0,dragging=false,dragged=false,lastX=0,lastY=0,orbitX=0,orbitY=0,selected=-1,focusedX=0,cameraFocus=false;
    const reduced=false;
    const consoleRoot=document.querySelector("#showroom-console");
    const title=consoleRoot?.querySelector("h3"),copy=consoleRoot?.querySelector(".console-copy p"),kicker=consoleRoot?.querySelector(".console-kicker"),count=consoleRoot?.querySelector(".console-track-count"),listen=consoleRoot?.querySelector(".console-listen");
    const buttons=[...stage.querySelectorAll(".showroom-card")];
    const selectRecord=(index)=>{
      if(index<0||index>=records.length)return;
      selected=index;cameraFocus=true;const r=records[index];
      buttons.forEach((b,i)=>{b.classList.toggle("is-selected",i===index);b.setAttribute("aria-pressed",String(i===index));});
      if(kicker)kicker.textContent="NOW SELECTED / "+String(index+1).padStart(3,"0");
      if(title)title.innerHTML=r.name+"<br><span>IN THE SPOTLIGHT.</span>";
      if(copy)copy.textContent=r.description;
      if(count)count.textContent=r.kind.toUpperCase();
      if(listen)listen.innerHTML='LISTEN TO THE ARTIST <b>↗</b>';
      focusedX=[-1.8,1.9,-1.35,1.65,-1.8,1.35][index];
      if(listen)listen.setAttribute("aria-label","Open the official $parxx$tillGoated artist music catalogue in Apple Music");
      const active=displayObjects[index];
      displayObjects.forEach((item,i)=>{item.vinylGroup.userData.targetOffset=i===index?1.85:1.05;item.vinylGroup.userData.active=i===index;});
      if(active){active.vinylGroup.userData.active=true;active.art.userData.selectedAt=clock.getElapsedTime();}
      stage.dispatchEvent(new CustomEvent("recordselect",{detail:{index,name:r.name}}));
    };
    buttons.forEach((b,i)=>{b.setAttribute("aria-pressed","false");b.addEventListener("click",()=>selectRecord(i));});
    const setPointer=(e)=>{
      const rect=canvas.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
    };
    canvas.addEventListener("pointerdown",e=>{dragging=true;dragged=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener("pointermove",e=>{
      setPointer(e);
      if(dragging){const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)dragged=true;orbitX=THREE.MathUtils.clamp(orbitX+dx*.003,-.75,.75);orbitY=THREE.MathUtils.clamp(orbitY+dy*.002,-.32,.32);lastX=e.clientX;lastY=e.clientY;}
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
      const r=stage.getBoundingClientRect();const span=Math.max(1,r.height+window.innerHeight);
      targetProgress=THREE.MathUtils.clamp((window.innerHeight-r.top)/span,0,1);
    };
    window.addEventListener("scroll",()=>{cameraFocus=false;getProgress();},{passive:true});window.addEventListener("resize",getProgress,{passive:true});getProgress();
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
      const t=clock.getElapsedTime();lyricHim.material.opacity=.52+Math.sin(t*1.7)*.32;lyricHim.position.y=2.65+Math.sin(t*1.2)*.24;lyricHim.rotation.z=Math.sin(t*.55)*.018;lyricHim.scale.setScalar(1+Math.sin(t*1.45)*.035);lyricNamanje.material.opacity=.48+Math.sin(t*1.3+1.8)*.38;lyricNamanje.position.y=-1.85+Math.sin(t*.9+1)*.3;lyricNamanje.rotation.z=Math.sin(t*.42+1)*-.025;lyricSparks.children.forEach(p=>{p.position.y+=Math.sin(t*1.1+p.userData.phase)*.0018;p.position.x+=Math.cos(t*.7+p.userData.phase)*.0012;});progress=THREE.MathUtils.lerp(progress,targetProgress,.055);
      const travel=10-progress*25.2;
      const drift=Math.sin(t*.18)*.14;
      const targetX=orbitX*.9+drift+(cameraFocus&&selected>=0?focusedX*.38:0);
      const targetY=1.05-orbitY*.9;
      const focusedZ=selected>=0?displayObjects[selected].z+7.2:travel;
      const targetZ=cameraFocus&&selected>=0?THREE.MathUtils.lerp(travel,focusedZ,.82):travel;
      camera.position.x=THREE.MathUtils.lerp(camera.position.x,targetX,.045);
      camera.position.y=THREE.MathUtils.lerp(camera.position.y,targetY,.045);
      camera.position.z=THREE.MathUtils.lerp(camera.position.z,targetZ,.045);
      camera.rotation.y=THREE.MathUtils.lerp(camera.rotation.y,-orbitX*.09+Math.sin(t*.12)*.012,.04);
      camera.rotation.x=THREE.MathUtils.lerp(camera.rotation.x,-.08+orbitY*.06,.04);
      displayObjects.forEach((item,i)=>{
        const active=item.vinylGroup.userData.active===true;
        const targetOffset=active ? 1.85 : 1.05;
        item.vinylGroup.position.x=THREE.MathUtils.lerp(item.vinylGroup.position.x,item.x+(item.x<0?targetOffset:-targetOffset),.055);
        item.vinylGroup.rotation.z+=active ? 0.025 : 0.004;
        item.vinylGroup.scale.setScalar(THREE.MathUtils.lerp(item.vinylGroup.scale.x,active ? 1.12 : 0.94,.06));
        item.art.scale.setScalar(THREE.MathUtils.lerp(item.art.scale.x,active ? 1.045 : 1,.06));
        item.art.rotation.z=Math.sin(t*.35+i)*.012;
        item.art.position.y=item.y+Math.sin(t*.55+i*1.4)*.045;
        const near=Math.max(0,1-Math.abs(camera.position.z-(item.z+5.8))/8);
        item.frame.scale.setScalar(THREE.MathUtils.lerp(item.frame.scale.x,1+near*.035+(active ? 0.055 : 0),.07));
        if(item.glow)item.glow.material.opacity=.055+near*.09+(active ? .12 : 0);
      });
      key.intensity=39+Math.sin(t*.8)*3+(selected>=0?8:0);
      warm.intensity=24+Math.sin(t*.55+1)*4;
      stars.rotation.y=t*.006;grid.position.z=-9+Math.sin(t*.15)*.08;
      stars.rotation.y=t*.006;grid.position.z=-9+Math.sin(t*.15)*.08;
      renderer.render(scene,camera);
    };
    stage.classList.add("webgl-ready");render();
    document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else if(visible)render();});
  }catch(error){console.warn("3D showroom could not start; accessible catalogue fallback remains available.",error);}
}
