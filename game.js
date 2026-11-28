import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
const canvas=document.querySelector("#world");
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x08090a,.018);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,160);camera.position.set(0,1.4,17);
scene.add(new THREE.HemisphereLight(0x9bb6bd,0x08090a,1.4));
const key=new THREE.DirectionalLight(0xe5c58d,2.3);key.position.set(-6,9,8);scene.add(key);
const cyan=new THREE.PointLight(0x3b9aa8,38,55,2);cyan.position.set(8,1,-12);scene.add(cyan);
const amber=new THREE.PointLight(0xc28d4d,42,55,2);amber.position.set(-8,3,-30);scene.add(amber);
const world=new THREE.Group();scene.add(world);
const darkMetal=new THREE.MeshStandardMaterial({color:0x151a1b,metalness:.86,roughness:.24});
const gold=new THREE.MeshStandardMaterial({color:0xb69a65,metalness:.82,roughness:.22,emissive:0x38250e,emissiveIntensity:.25});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,130),new THREE.MeshStandardMaterial({color:0x0a0d0e,metalness:.65,roughness:.36}));floor.rotation.x=-Math.PI/2;floor.position.set(0,-4,-28);world.add(floor);
// Sound architecture: concentric sub-bass ripples and a sculptural equalizer.
const bassWaves=[];for(let i=0;i<6;i++){const wave=new THREE.Mesh(new THREE.TorusGeometry(2.2+i*.72,.025,7,128),new THREE.MeshBasicMaterial({color:i%2?0x568b91:0xc4a46c,transparent:true,opacity:.3-i*.025}));wave.position.set(0,-.8,-7-i*8);wave.rotation.x=Math.PI/2;world.add(wave);bassWaves.push(wave)}
const eqBars=[];const eqMat=[new THREE.MeshStandardMaterial({color:0xb79a65,metalness:.75,roughness:.25,emissive:0x4b3214,emissiveIntensity:.25}),new THREE.MeshStandardMaterial({color:0x477b82,metalness:.65,roughness:.28,emissive:0x173d43,emissiveIntensity:.3})];
for(let row=0;row<3;row++){for(let i=0;i<31;i++){const x=(i-15)*.43;const h=.25+Math.abs(Math.sin(i*.73+row*1.7))*1.5;const bar=new THREE.Mesh(new THREE.BoxGeometry(.075,h,.075),eqMat[(i+row)%2]);bar.position.set(x,-2.8+h/2,-15-row*15);world.add(bar);eqBars.push({mesh:bar,x,base:h,phase:i*.51+row*1.9})}}
const speakerStacks=[];for(const x of [-7.2,7.2]){const stack=new THREE.Group();stack.position.set(x,-1.8,-24);world.add(stack);for(let j=0;j<3;j++){const box=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.35,.8),darkMetal);box.position.y=j*1.42;stack.add(box);const cone=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.13,48),new THREE.MeshStandardMaterial({color:0x090c0e,metalness:.7,roughness:.3}));cone.rotation.x=Math.PI/2;cone.position.set(0,j*1.42,.47);stack.add(cone);const surround=new THREE.Mesh(new THREE.TorusGeometry(.49,.055,8,48),gold);surround.position.set(0,j*1.42,.55);stack.add(surround);const dustcap=new THREE.Mesh(new THREE.SphereGeometry(.13,20,12),eqMat[1]);dustcap.position.set(0,j*1.42,.57);stack.add(dustcap)}speakerStacks.push(stack)}
// Artist atlas: six original photographs, each mapped to its own physical gallery frame.
const crops=[[0,0,.333,.5],[.333,0,.333,.5],[.666,0,.334,.5],[0,.5,.333,.5],[.333,.5,.333,.5],[.666,.5,.334,.5]];
const photoPositions=[[-4.6,1.3,-8],[4.4,1.8,-14],[-4.2,.6,-21],[4.6,1.2,-28],[-4.6,1.6,-35],[4.4,.7,-42]];
const photoNames=["THE MASK","THE COURT","THE CREW","VILLAIN IN A CAPE","NAMANJE","STILL HIM"];
const photoGroups=[];
const loader=new THREE.TextureLoader();loader.setCrossOrigin("anonymous");
const atlas=loader.load("/assets/artist-atlas-small.jpg",texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();photoGroups.forEach((g,i)=>{const map=texture.clone();map.needsUpdate=true;map.repeat.set(crops[i][2],crops[i][3]);map.offset.set(crops[i][0],1-crops[i][1]-crops[i][3]);g.userData.image.material.map=map;g.userData.image.material.needsUpdate=true;});},undefined,error=>console.error("Artist photo atlas failed",error));
photoPositions.forEach((pos,i)=>{const g=new THREE.Group();g.position.set(...pos);g.rotation.y=pos[0]<0?.18:-.18;world.add(g);const frame=new THREE.Mesh(new THREE.BoxGeometry(2.75,3.65,.16),darkMetal);g.add(frame);const image=new THREE.Mesh(new THREE.PlaneGeometry(2.58,3.48),new THREE.MeshBasicMaterial({color:0x293034,side:THREE.DoubleSide}));image.position.z=.095;g.add(image);const edge=new THREE.Mesh(new THREE.BoxGeometry(2.83,3.73,.035),new THREE.MeshBasicMaterial({color:i%2?0x568e91:0xb89b64,wireframe:true,transparent:true,opacity:.38}));edge.position.z=.13;g.add(edge);g.userData={image,index:i,base:pos.slice(),name:photoNames[i]};photoGroups.push(g)});
const records=[];for(let i=0;i<5;i++){const g=new THREE.Group();g.position.set(i%2?4.6:-4.5,-1.2,-11-i*8);const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,.09,96),new THREE.MeshStandardMaterial({color:0x090b0c,metalness:.82,roughness:.25}));disc.rotation.x=Math.PI/2;g.add(disc);for(let k=0;k<7;k++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.38+k*.105,.008,5,80),new THREE.MeshBasicMaterial({color:0x687476,transparent:true,opacity:.32}));g.add(ring)}const label=new THREE.Mesh(new THREE.CircleGeometry(.31,48),new THREE.MeshStandardMaterial({color:[0x9e7951,0x698f91,0x8f5c62,0xb69a65,0x71868b][i],roughness:.5}));label.position.z=.06;g.add(label);const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.65,.17,64),gold);plinth.position.y=-1.3;g.add(plinth);world.add(g);records.push(g)}
// A sparse field of slow, light-catching particles gives the environment depth without visual clutter.
const particlePositions=[];for(let i=0;i<520;i++)particlePositions.push((Math.random()-.5)*28,Math.random()*12-5,-Math.random()*65);
const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute("position",new THREE.Float32BufferAttribute(particlePositions,3));
const dust=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0xcab17c,size:.035,transparent:true,opacity:.58}));world.add(dust);
const pointer={x:0,y:0,targetX:0,targetY:0};addEventListener("pointermove",e=>{pointer.targetX=(e.clientX/innerWidth-.5)*2;pointer.targetY=(e.clientY/innerHeight-.5)*2});
let scroll=0,scrollTarget=0;addEventListener("scroll",()=>{scrollTarget=scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)},{passive:true});
const clock=new THREE.Clock();let activePhoto=0;
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();scroll+=(scrollTarget-scroll)*.055;pointer.x+=(pointer.targetX-pointer.x)*.035;pointer.y+=(pointer.targetY-pointer.y)*.035;
const travel=scroll*42;camera.position.x=pointer.x*.55+Math.sin(scroll*Math.PI*2)*.35;camera.position.y=1.25+pointer.y*.32+Math.sin(t*.35)*.08;camera.position.z=17-travel;camera.lookAt(pointer.x*.85,1.0+pointer.y*.4,-10-travel*.88);
world.position.y=Math.sin(t*.22)*.14;world.rotation.y=pointer.x*.018+Math.sin(t*.12)*.012;
photoGroups.forEach((g,i)=>{g.rotation.y=(g.userData.base[0]<0?.18:-.18)+Math.sin(t*.38+i)*.025+pointer.x*.012;g.position.y=g.userData.base[1]+Math.sin(t*.48+i*1.2)*.13});
records.forEach((g,i)=>{g.rotation.z=t*(i%2?.11:-.09);g.position.y=-1.2+Math.sin(t*.5+i)*.13});
// Boom-bap visual pulse at 92 BPM. This is a visual tempo, not audio playback.
const beatPhase=t*(92/60)*Math.PI*2;const kick=Math.pow(Math.max(0,Math.sin(beatPhase)),10);const snare=Math.pow(Math.max(0,Math.sin(beatPhase+Math.PI)),14);
bassWaves.forEach((w,i)=>{const pulse=1+kick*.13+Math.sin(t*1.3-i*.5)*.018;w.scale.setScalar(pulse);w.material.opacity=.16+kick*.18+Math.sin(t*1.2+i)*.025});
eqBars.forEach(({mesh,x,base,phase})=>{const groove=.5+.5*Math.sin(beatPhase+phase);const sync=.5+.5*Math.sin(beatPhase*.5+phase*.65);const h=base*(.28+groove*.62+sync*.22)+kick*.22;mesh.scale.y=h/base;mesh.position.y=-2.8+h/2;mesh.position.x=x+Math.sin(t*.7+phase)*.018});
speakerStacks.forEach(stack=>{stack.children.forEach((part,j)=>{if(j%4===2||j%4===3){const thump=1+kick*.11+snare*.035;part.scale.set(thump,thump,1)}})});
dust.rotation.y=t*.009;cyan.intensity=34+Math.sin(t*.55)*7;amber.intensity=38+Math.sin(t*.4+1)*8;
renderer.render(scene,camera)}
animate();
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.65))}addEventListener("resize",resize);
const viewer=document.querySelector("#photo-viewer"),viewerImg=document.querySelector("#viewer-image");
function showPhoto(i){activePhoto=i;const x=crops[i],img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=img.width*x[2];c.height=img.height*x[3];const ctx=c.getContext("2d");ctx.drawImage(img,img.width*x[0],img.height*x[1],img.width*x[2],img.height*x[3],0,0,c.width,c.height);viewerImg.src=c.toDataURL("image/jpeg",.92);viewer.classList.add("open");viewer.setAttribute("aria-hidden","false");document.querySelector("#photo-number").textContent=String(i+1).padStart(2,"0")+" — 06";document.querySelector("#photo-title").textContent=photoNames[i]};img.src="/assets/artist-atlas-small.jpg"}
function closePhoto(){viewer.classList.remove("open");viewer.setAttribute("aria-hidden","true")}document.querySelector("#close-viewer").addEventListener("click",closePhoto);viewer.addEventListener("click",e=>{if(e.target===viewer)closePhoto()});addEventListener("keydown",e=>{if(e.key==="Escape")closePhoto()});
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();let down=null;canvas.style.pointerEvents="none";addEventListener("pointerdown",e=>{down={x:e.clientX,y:e.clientY}});addEventListener("pointerup",e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>8){down=null;return}down=null;if(e.target.closest?.("a,button,nav"))return;mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight)*2+1;ray.setFromCamera(mouse,camera);const hit=ray.intersectObjects(photoGroups,true)[0];if(hit){const group=photoGroups.find(g=>g===hit.object||g.children.includes(hit.object));if(group)showPhoto(group.userData.index)}});