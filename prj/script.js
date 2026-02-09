const music = document.getElementById("bgMusic");
const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const petalsContainer = document.querySelector(".petals");
const letter = document.getElementById("letter");
const surprise = document.getElementById("surprise");

/* Falling petals */
const petals = ["🌸","🌹","💮"];
setInterval(()=>{
    const p=document.createElement("span");
    p.innerHTML=petals[Math.floor(Math.random()*petals.length)];
    p.style.left=Math.random()*100+"vw";
    p.style.animationDuration=Math.random()*3+6+"s";
    petalsContainer.appendChild(p);
    setTimeout(()=>p.remove(),9000);
},200);

/* Open letter */
function openLetter(){
    letter.classList.add("show");
    music.play();
}

/* Close letter */
function closeLetter(){
    letter.classList.remove("show");
    questionBox.style.display="block";
}

/* Surprise button */
function openSurprise(){
    surprise.style.display="block";
    music.play();
}
function closeSurprise(){
    surprise.style.display="none";
}

/* NO button moves anywhere */
noBtn.addEventListener("mouseenter", moveNo);
noBtn.addEventListener("touchstart", moveNo);
function moveNo(){
    const parentWidth = window.innerWidth - noBtn.offsetWidth;
    const parentHeight = window.innerHeight - noBtn.offsetHeight;
    noBtn.style.transition = "all 0.03s linear";
    noBtn.style.left = Math.random() * parentWidth + "px";
    noBtn.style.top = Math.random() * parentHeight + "px";
}

/* YES CLICK */
function sayYes(){
    questionText.innerHTML="YESSS 💖 FOREVER";
    questionBox.classList.add("yes-activated");
    yesBtn.style.display="none";
    noBtn.style.display="none";

    startFireworksFullScreen();
    spawnPetalsFullScreen();
}

/* Fireworks canvas setup */
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fireworks = [];
let particles = [];

class Firework {
    constructor(x, y, targetY) { this.x=x; this.y=y; this.targetY=targetY; this.speed=7+Math.random()*3; this.exploded=false; this.color=`hsl(${Math.random()*360},100%,60%)`; }
    update() { if(!this.exploded){ this.y-=this.speed; if(this.y<=this.targetY){this.explode();this.exploded=true;} } }
    explode() { for(let i=0;i<100;i++){ const angle=Math.random()*Math.PI*2; const speed=Math.random()*5+2; particles.push(new Particle(this.x,this.y,angle,speed,this.color)); } }
    draw(){ if(!this.exploded){ ctx.beginPath(); ctx.arc(this.x,this.y,3,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); } }
}
class Particle {
    constructor(x,y,angle,speed,color){ this.x=x; this.y=y; this.angle=angle; this.speed=speed; this.gravity=0.1; this.alpha=1; this.decay=0.02+Math.random()*0.02; this.color=color; }
    update(){ this.speed*=0.98; this.x+=Math.cos(this.angle)*this.speed; this.y+=Math.sin(this.angle)*this.speed+this.gravity; this.alpha-=this.decay; }
    draw(){ ctx.globalAlpha=this.alpha; ctx.beginPath(); ctx.arc(this.x,this.y,2,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); ctx.globalAlpha=1; }
}
function animateFireworks(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fireworks.forEach((fw,i)=>{ fw.update(); fw.draw(); if(fw.exploded) fireworks.splice(i,1); });
    particles.forEach((p,i)=>{ p.update(); if(p.alpha<=0) particles.splice(i,1); else p.draw(); });
    requestAnimationFrame(animateFireworks);
}
animateFireworks();

function startFireworksFullScreen(){
    for(let i=0;i<20;i++){ setTimeout(()=>{ const x=Math.random()*canvas.width*0.9+canvas.width*0.05; const y=canvas.height*0.3+Math.random()*50; fireworks.push(new Firework(x,canvas.height,y)); }, i*400); }
}
function spawnPetalsFullScreen(){
    for(let i=0;i<120;i++){ const p=document.createElement("span"); p.innerHTML=petals[Math.floor(Math.random()*petals.length)]; p.style.left=Math.random()*window.innerWidth+"px"; p.style.top=Math.random()*window.innerHeight+"px"; p.style.fontSize=Math.random()*28+16+"px"; petalsContainer.appendChild(p); p.animate([{transform:"scale(0)",opacity:0},{transform:"scale(1.3)",opacity:1},{transform:"scale(1)",opacity:0.8}],{duration:2000,easing:"ease-out"}); setTimeout(()=>p.remove(),5000); }
}
