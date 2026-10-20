const C=document.getElementById("canvas"),x=C.getContext("2d"),W=C.width,H=C.height;
const L=document.getElementById("labcanvas"),lx=L.getContext("2d");
const $=id=>document.getElementById(id),best=+localStorage.getItem("vectorVanguardBest")||0;
const S={screen:"menu",pause:false,score:0,wave:1,shield:100,time:0,spawn:0,stars:[],asteroids:[],shots:[],parts:[],keys:{},muted:false,shake:0};
const ship={x:W/2,y:H/2,a:-Math.PI/2,vx:0,vy:0,r:18,thrust:0};
for(let i=0;i<130;i++)S.stars.push({x:Math.random()*W,y:Math.random()*H,s:.3+Math.random()*1.6,r:Math.random()*1.5});
let last=0,ft=0,fc=0;

function screen(id){document.querySelectorAll(".screen").forEach(e=>e.classList.remove("active"));$(id).classList.add("active")}
function reset(){S.score=0;S.wave=1;S.shield=100;S.time=0;S.spawn=.5;S.asteroids=[];S.shots=[];S.parts=[];S.shake=0;Object.assign(ship,{x:W/2,y:H/2,a:-Math.PI/2,vx:0,vy:0});updateHud()}
function start(){reset();S.screen="game";S.pause=false;$("pause").classList.add("hidden");$("over").classList.add("hidden");screen("game")}
function updateHud(){$("score").textContent=String(Math.floor(S.score)).padStart(5,"0");$("wave").textContent=String(S.wave).padStart(2,"0");$("shield").textContent=Math.max(0,Math.ceil(S.shield))+"%";$("bestMenu").textContent=String(best).padStart(5,"0")}
function pause(){if(S.screen!=="game"||!$("over").classList.contains("hidden"))return;S.pause=!S.pause;$("pause").classList.toggle("hidden",!S.pause)}
function wrap(o){if(o.x<-30)o.x=W+30;if(o.x>W+30)o.x=-30;if(o.y<-30)o.y=H+30;if(o.y>H+30)o.y=-30}
function spawn(){let edge=Math.floor(Math.random()*4),px=edge===0?-20:edge===1?W+20:Math.random()*W,py=edge===2?-20:edge===3?H+20:Math.random()*H;let n=7+Math.min(9,S.wave),r=18+Math.random()*28;let a=Math.atan2(ship.y-py,ship.x-px),v=45+Math.random()*35+S.wave*4;let verts=[];for(let i=0;i<9;i++)verts.push({a:i*Math.PI*2/9,r:r*(.75+Math.random()*.35)});S.asteroids.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r,rot:Math.random()*7,spin:(Math.random()-.5)*1.8,verts})}
function shoot(){if(S.screen!=="game"||S.pause)return;let sx=ship.x+Math.cos(ship.a)*25,sy=ship.y+Math.sin(ship.a)*25;S.shots.push({x:sx,y:sy,vx:Math.cos(ship.a)*690,vy:Math.sin(ship.a)*690,life:1.3});burst(sx,sy,4,"#55e8ff");}
function burst(px,py,n,col){for(let i=0;i<n;i++)S.parts.push({x:px,y:py,vx:(Math.random()-.5)*220,vy:(Math.random()-.5)*220,life:.35+Math.random()*.55,c:col,s:1+Math.random()*3})}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function gameOver(){let score=Math.floor(S.score),nb=Math.max(best,score);localStorage.setItem("vectorVanguardBest",nb);$("bestMenu").textContent=String(nb).padStart(5,"0");$("final").textContent=String(score).padStart(5,"0");$("overText").textContent=`Wave ${S.wave} reached • ${score>best?"NEW HIGH SCORE":"Best score: "+best}`;$("over").classList.remove("hidden");S.screen="over"}
function update(dt){
 if(S.screen!=="game"||S.pause)return;dt=Math.min(dt,.033);S.time+=dt;S.wave=1+Math.floor(S.time/18);S.score+=dt*(10+S.wave*1.5);
 if(S.keys.a||S.keys.arrowleft)ship.a-=3.7*dt;if(S.keys.d||S.keys.arrowright)ship.a+=3.7*dt;
 if(S.keys.w||S.keys.arrowup){ship.vx+=Math.cos(ship.a)*280*dt;ship.vy+=Math.sin(ship.a)*280*dt;ship.thrust=1}else ship.thrust=0;
 ship.vx*=Math.pow(.20,dt);ship.vy*=Math.pow(.20,dt);ship.x+=ship.vx*dt;ship.y+=ship.vy*dt;wrap(ship);
 S.spawn-=dt;if(S.spawn<=0){spawn();S.spawn=Math.max(.25,.95-S.wave*.055)}
 for(let i=S.shots.length-1;i>=0;i--){let q=S.shots[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;wrap(q);if(q.life<=0)S.shots.splice(i,1)}
 for(const a of S.asteroids){a.x+=a.vx*dt;a.y+=a.vy*dt;a.rot+=a.spin*dt;wrap(a)}
 for(let i=S.asteroids.length-1;i>=0;i--){let a=S.asteroids[i];if(dist(ship,a)<ship.r+a.r*.75){S.shield-=22;burst(a.x,a.y,22,"#ff557a");S.asteroids.splice(i,1);S.shake=10;if(S.shield<=0){gameOver();return}}}
 for(let i=S.shots.length-1;i>=0;i--){let q=S.shots[i],hit=false;for(let j=S.asteroids.length-1;j>=0;j--){let a=S.asteroids[j];if(Math.hypot(q.x-a.x,q.y-a.y)<a.r+4){hit=true;S.score+=35+a.r;burst(a.x,a.y,15,"#a8ff6a");if(a.r>25){for(let k=0;k<2;k++)S.asteroids.push({x:a.x,y:a.y,vx:(Math.random()-.5)*150,vy:(Math.random()-.5)*150,r:a.r*.55,rot:0,spin:Math.random()*2,verts:a.verts})}S.asteroids.splice(j,1);break}}if(hit)S.shots.splice(i,1)}
 for(let i=S.parts.length-1;i>=0;i--){let p=S.parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)S.parts.splice(i,1)}
 if(S.shake>0)S.shake-=20*dt;updateHud()
}
function draw(){
 if(S.screen!=="game")return;x.save();if(S.shake>0)x.translate((Math.random()-.5)*S.shake,(Math.random()-.5)*S.shake);
 x.fillStyle="#03060d";x.fillRect(0,0,W,H);
 for(const s of S.stars){s.x-=s.s*.35;if(s.x<0)s.x=W;x.fillStyle="#b9d5ff";x.globalAlpha=.25+s.s*.25;x.fillRect(s.x,s.y,s.r,s.r)}x.globalAlpha=1;
 x.strokeStyle="#55e8ff0a";for(let gx=0;gx<W;gx+=80){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,H);x.stroke()}for(let gy=0;gy<H;gy+=80){x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke()}
 for(const a of S.asteroids){x.save();x.translate(a.x,a.y);x.rotate(a.rot);x.beginPath();a.verts.forEach((v,i)=>{let px=Math.cos(v.a)*v.r,py=Math.sin(v.a)*v.r;i?x.lineTo(px,py):x.moveTo(px,py)});x.closePath();x.fillStyle="#0e1828";x.strokeStyle="#ff557a";x.lineWidth=2;x.shadowBlur=12;x.shadowColor="#ff557a";x.fill();x.stroke();x.restore()}
 for(const q of S.shots){x.fillStyle="#55e8ff";x.shadowBlur=15;x.shadowColor="#55e8ff";x.fillRect(q.x-3,q.y-3,6,6)}x.shadowBlur=0;
 x.save();x.translate(ship.x,ship.y);x.rotate(ship.a);x.strokeStyle="#55e8ff";x.fillStyle="#0b1b2c";x.lineWidth=3;x.shadowBlur=18;x.shadowColor="#55e8ff";x.beginPath();x.moveTo(27,0);x.lineTo(-19,-15);x.lineTo(-12,0);x.lineTo(-19,15);x.closePath();x.fill();x.stroke();x.shadowBlur=0;x.fillStyle="#a8ff6a";x.fillRect(2,-4,9,8);if(ship.thrust){x.fillStyle="#ffc857";x.beginPath();x.moveTo(-16,-7);x.lineTo(-34,0);x.lineTo(-16,7);x.fill()}x.restore();
 for(const p of S.parts){x.globalAlpha=Math.max(0,p.life*2);x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s)}x.globalAlpha=1;x.restore();
}
function loop(t){let dt=last?(t-last)/1000:0;last=t;update(dt);draw();fc++;if(t-ft>500){$("fps").textContent="FPS "+Math.round(fc*1000/(t-ft));fc=0;ft=t}requestAnimationFrame(loop)}requestAnimationFrame(loop);

$("start").onclick=start;$("again").onclick=start;$("resume").onclick=pause;$("quit1").onclick=()=>{S.screen="menu";screen("menu")};$("quit2").onclick=()=>{S.screen="menu";screen("menu")};
$("lab").onclick=()=>{screen("lab");selectDemo("transform")};$("back").onclick=()=>{S.screen="menu";screen("menu")};
$("sound").onclick=()=>{S.muted=!S.muted;$("sound").textContent=S.muted?"×":"♫"};$("help").onclick=()=>alert("W/UP = thrust\\nA/D or LEFT/RIGHT = rotate\\nSPACE = fire\\nP = pause\\nESC = menu");
addEventListener("keydown",e=>{S.keys[e.key.toLowerCase()]=true;if(e.key===" "){e.preventDefault();shoot()}if(e.key.toLowerCase()==="p")pause();if(e.key==="Escape"){S.screen="menu";screen("menu");$("pause").classList.add("hidden")}});
addEventListener("keyup",e=>S.keys[e.key.toLowerCase()]=false);

const info={
transform:["TRANSFORMATIONS","Affine transformation","Ship geometry is drawn in local coordinates, then translated to the player position and rotated by its heading.","x′ = x cosθ − y sinθ\ny′ = x sinθ + y cosθ"],
bres:["BRESENHAM","Integer line rasterization","The classic integer decision method is demonstrated as a laser-like vector line.","p₀ = 2Δy − Δx\nChoose E / NE using the error term"],
circle:["MIDPOINT CIRCLE","Symmetry-based circle","Collision visualization uses radial geometry; the lab shows eight-way midpoint circle symmetry.","d₀ = 1 − r\nReflect one octant across 8 regions"],
collision:["COLLISION","Circle intersection","Asteroids use a distance test between centers. It is O(1) and matches the circular collision envelope.","distance = √((x₂−x₁)² + (y₂−y₁)²)\ncollision if distance < r₁+r₂"],
clip:["CLIPPING","Screen boundary / wrap","The game keeps objects inside the logical toroidal world. The lab visualizes a viewport clipping region.","clip(region)\n→ only pixels inside region are retained\nrestore() → remove clip"]
};
let demo="transform";
function selectDemo(d){demo=d;document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.demo===d));let a=info[d];$("tag").textContent=a[0];$("title").textContent=a[1];$("desc").textContent=a[2];$("formula").textContent=a[3]}
function linePoints(x0,y0,x1,y1){let pts=[],dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,e=dx+dy;while(true){pts.push([x0,y0]);if(x0===x1&&y0===y1)break;let e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}return pts}
function circlePoints(cx,cy,r){let out=[],xx=r,yy=0,d=1-r;while(xx>=yy){out.push([cx+xx,cy+yy],[cx+yy,cy+xx],[cx-yy,cy+xx],[cx-xx,cy+yy],[cx-xx,cy-yy],[cx-yy,cy-xx],[cx+yy,cy-xx],[cx+xx,cy-yy]);yy++;if(d<=0)d+=2*yy+1;else{xx--;d+=2*(yy-xx)+1}}return out}
function labdraw(){lx.fillStyle="#040811";lx.fillRect(0,0,800,430);lx.strokeStyle="#122036";for(let i=20;i<800;i+=20){lx.beginPath();lx.moveTo(i,0);lx.lineTo(i,430);lx.stroke()}for(let i=20;i<430;i+=20){lx.beginPath();lx.moveTo(0,i);lx.lineTo(800,i);lx.stroke()}
 if(demo==="transform"){lx.save();lx.translate(400,215);lx.rotate(Math.sin(Date.now()/700)*.5);lx.scale(1.35,1);lx.strokeStyle="#55e8ff";lx.lineWidth=4;lx.beginPath();lx.moveTo(45,0);lx.lineTo(-35,-22);lx.lineTo(-20,0);lx.lineTo(-35,22);lx.closePath();lx.stroke();lx.restore()}
 if(demo==="bres"){for(const p of linePoints(100,340,700,80))lx.fillStyle="#55e8ff",lx.fillRect(p[0],p[1],3,3)}
 if(demo==="circle"){for(const p of circlePoints(400,215,130))lx.fillStyle="#a8ff6a",lx.fillRect(p[0],p[1],3,3)}
 if(demo==="collision"){lx.strokeStyle="#55e8ff";lx.lineWidth=3;lx.beginPath();lx.arc(330,210,100,0,Math.PI*2);lx.stroke();lx.strokeStyle="#ff557a";lx.beginPath();lx.arc(490,230,105,0,Math.PI*2);lx.stroke();lx.fillStyle="#a8ff6a";lx.font="14px Space Mono";lx.fillText("distance < r₁ + r₂ → COLLISION",270,380)}
 if(demo==="clip"){lx.save();lx.beginPath();lx.rect(220,95,360,240);lx.clip();for(let i=80;i<700;i+=25){lx.fillStyle=i%50?"#55e8ff":"#ff557a";lx.fillRect(i,55,13,330)}lx.restore();lx.strokeStyle="#a8ff6a";lx.strokeRect(220,95,360,240)}
 requestAnimationFrame(labdraw)}requestAnimationFrame(labdraw);
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>selectDemo(t.dataset.demo));updateHud();
