// Simulation and Double Q-learning agent for the kart lab. Mirrors the
// SuperTuxKart controller in MikeTerekhov/reinforcement-learning:
// same 18 aim-point states, 10 actions and Double Q update.
const STATES=["L4G","L3G","L2G","L1G","F1G","L4L","L3L","L2L","L1L","F1L","R1G","R2G","R3G","R4G","R1L","R2L","R3L","R4L"];
const ACTIONS=["F25","F50","F75","F100","SN10","SN5","SP5","SP10","SP10D","SN10D"];
const ACT={F25:[.25,0,0],F50:[.5,0,0],F75:[.75,0,0],F100:[1,0,0],SN10:[.25,-1,0],SN5:[.25,-.5,0],SP5:[.25,.5,0],SP10:[.25,1,0],SP10D:[.25,1,1],SN10D:[.25,-1,1]};
const TRACKS={
lakeside:[[150,120],[520,90],[860,140],[920,330],[800,520],[560,470],[420,560],[160,520],[90,330]],
hairpins:[[130,95],[870,95],[905,175],[840,240],[330,250],[300,320],[360,370],[860,375],[910,460],[860,540],[140,540],[85,320]],
oval:Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2;return[500+400*Math.cos(a),315+225*Math.sin(a)]})};
const HALFW=32,DS=4,DT=1/60,REPEAT=6,MAXDEC=700;
function makeTrack(cp){const n=cp.length,raw=[];
for(let i=0;i<n;i++){const p0=cp[(i-1+n)%n],p1=cp[i],p2=cp[(i+1)%n],p3=cp[(i+2)%n];
for(let k=0;k<40;k++){const t=k/40,t2=t*t,t3=t2*t;raw.push([0,1].map(j=>.5*(2*p1[j]+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)))}}
const pts=[raw[0]];let acc=0;
for(let i=1;i<=raw.length;i++){const a=raw[i-1],b=raw[i%raw.length];let seg=Math.hypot(b[0]-a[0],b[1]-a[1]);
while(acc+seg>=DS){const f=(DS-acc)/seg;const p=[a[0]+(b[0]-a[0])*f*1,a[1]+(b[1]-a[1])*f];pts.push(p);a[0]=p[0];a[1]=p[1];seg=Math.hypot(b[0]-a[0],b[1]-a[1]);acc=0}acc+=seg}
pts.pop();const N=pts.length;const tan=pts.map((p,i)=>{const q=pts[(i+1)%N];return Math.atan2(q[1]-p[1],q[0]-p[0])});
return{pts,tan,N,len:N*DS}}
function binOf(x){const e=[-.8,-.6,-.4,-.2,.2,.4,.6,.8];let b=0;while(b<8&&x>=e[b])b++;return b}
function stateName(aim,prev){const b=binOf(aim),g=aim>prev?"G":"L";return(b<4?"L"+(4-b):b==4?"F1":"R"+(b-4))+g}
class Sim{constructor(track){this.alpha=.1;this.gamma=.75;this.epsilon=.99;this.decay=.99;
this.QA=STATES.map(()=>ACTIONS.map(()=>0));this.QB=STATES.map(()=>ACTIONS.map(()=>0));
this.episode=0;this.history=[];this.best=null;this.setTrack(track)}
setTrack(t){this.track=t;this.reset()}
reset(){const T=this.track;this.idx=0;const p=T.pts[0],th=T.tan[0];const off=(Math.random()-.5)*20;
this.x=p[0]-Math.sin(th)*off;this.y=p[1]+Math.cos(th)*off;this.th=th+(Math.random()-.5)*.3;this.v=0;
this.prog=0;this.ticks=0;this.dec=0;this.off=0;this.epR=0;this.rescues=0;this.trail=[];
this.aim=this.aimX();this.prevAim=this.aim;this.s=STATES.indexOf(stateName(this.aim,this.aim));this.a=null;this.lat=0}
nearest(){const T=this.track;let bi=this.idx,bd=1e9;for(let k=-25;k<=45;k++){const i=(this.idx+k+T.N)%T.N,p=T.pts[i],d=(p[0]-this.x)**2+(p[1]-this.y)**2;if(d<bd){bd=d;bi=i}}return[bi,Math.sqrt(bd)]}
aimX(){const T=this.track,p=T.pts[(this.idx+16)%T.N],dx=p[0]-this.x,dy=p[1]-this.y,hx=Math.cos(this.th),hy=Math.sin(this.th);
const ang=Math.atan2(hx*dy-hy*dx,hx*dx+hy*dy);return Math.max(-1,Math.min(1,ang/(Math.PI/2)))}
q(s,a){return this.QA[s][a]+this.QB[s][a]}
choose(s,greedy){if(!greedy&&Math.random()<this.epsilon)return Math.floor(Math.random()*ACTIONS.length);
let b=0;for(let a=1;a<ACTIONS.length;a++)if(this.q(s,a)>this.q(s,b))b=a;return b}
tick(){const[acc,st,dr]=ACT[ACTIONS[this.a]];const T=this.track;let r=0;
this.v+=(acc*320-this.v*1.3)*DT;const turn=st*(dr?4.2:2.8)*Math.min(1,this.v/70);this.th+=turn*DT;if(dr)this.v*=.996;
this.x+=Math.cos(this.th)*this.v*DT;this.y+=Math.sin(this.th)*this.v*DT;
const[ni,d]=this.nearest();let di=ni-this.idx;if(di>T.N/2)di-=T.N;if(di<-T.N/2)di+=T.N;this.idx=ni;this.lat=d;
this.prog+=di*DS;r+=di*DS/10;
if(d>HALFW){this.v*=.94;this.off++;r-=.6}else this.off=0;
if(this.off>90){const p=T.pts[ni];this.x=p[0];this.y=p[1];this.th=T.tan[ni];this.v=30;this.off=0;r-=15;this.rescues++}
this.ticks++;if(this.ticks%4==0){this.trail.push([this.x,this.y]);if(this.trail.length>60)this.trail.shift()}
return r}
decide(greedy){this.a=this.choose(this.s,greedy);this.r=0;this.sub=0}
// one physics tick; performs learning on decision boundaries. returns true if episode ended
step(greedy){if(this.a===null)this.decide(greedy);
this.r+=this.tick();this.sub++;
if(this.sub<REPEAT)return false;
this.dec++;const lap=this.prog>=this.track.len,done=lap||this.dec>=MAXDEC;
if(lap)this.r+=30;
const na=this.aimX(),ns=STATES.indexOf(stateName(na,this.aim));this.prevAim=this.aim;this.aim=na;
if(!greedy)this.learn(this.s,this.a,this.r,ns,done);
this.epR+=this.r;this.lastR=this.r;this.s=ns;
if(done){const lt=lap?this.ticks*DT:null;this.history.push({r:this.epR,eps:this.epsilon,lap:lt,greedy:!!greedy});
if(lt&&(!this.best||lt<this.best))this.best=lt;this.episode++;if(!greedy)this.epsilon*=this.decay;this.reset();this.a=null;return true}
this.decide(greedy);return false}
learn(s,a,r,ns,done){const[X,Y]=Math.random()<.5?[this.QA,this.QB]:[this.QB,this.QA];
let b=0;for(let k=1;k<ACTIONS.length;k++)if(X[ns][k]>X[ns][b])b=k;
const target=r+(done?0:this.gamma*Y[ns][b]);X[s][a]+=this.alpha*(target-X[s][a])}}
export{Sim,makeTrack,TRACKS,STATES,ACTIONS,binOf,HALFW,DT};
