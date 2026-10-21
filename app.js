
(function(){
"use strict";

/* ================= DATA ================= */
var TEAMS = [
  { id:"research",  name:"Research",  count:4, color:"#5B9BD5", side:-1, slot:0,
    role:"Finds topics, hooks and what's working right now.",
    tools:"YouTube · GitHub · Trends", skills:"topic mining, hook research, competitor scans",
    model:"Thinking Machines Inkling (free)",
    agents:[["Aarav","Topic Scout",1],["Meera","Trend Analyst",0],["Kabir","Comment Miner",0],["Sana","Fact Checker",0]],
    tasks:["Scanning GitHub for trending AI repos","Mining YouTube comments for pain points","Tracking 12 rival channels for new formats","Pulling search trends for this week's topics","Fact-checking claims for Thursday's script"] },
  { id:"scripts",   name:"Scripts",   count:4, color:"#F2C230", side:-1, slot:1,
    role:"Turns research into scripts in your voice.",
    tools:"Docs · Data Center", skills:"hooks, story arcs, retention beats",
    model:"Poolside Laguna S 2.1 (free)",
    agents:[["Rohan","Head Writer",1],["Isha","Hook Writer",0],["Dev","Story Editor",0],["Tara","CTA Writer",0]],
    tasks:["Drafting hook variants for the next reel","Rewriting the cold open — retention dip at 0:04","Punching up the CTA for the blueprint video","Outlining a 3-part series from research notes"] },
  { id:"creative",  name:"Creative",  count:6, color:"#9B7EDE", side:-1, slot:2,
    role:"Edits the raw clips into finished videos.",
    tools:"Google Drive · CapCut · Canva", skills:"rough cuts, captions, thumbnails, hooks",
    model:"Google Gemma 4 31B (free)",
    agents:[["Vikram","Edit Director",1],["Anaya","Cutter",0],["Neil","Captioner",0],["Riya","Thumbnailer",0],["Arjun","B-roll Editor",0],["Zara","Sound Designer",0]],
    tasks:["Cutting yesterday's raw footage","Burning captions on reel #14","Testing 3 thumbnail concepts","Syncing B-roll to the voiceover"] },
  { id:"social",    name:"Social",    count:4, color:"#E563B8", side:-1, slot:3,
    role:"Posts, schedules and replies across platforms.",
    tools:"Instagram · Threads · YouTube", skills:"scheduling, captions, first-hour replies",
    model:"MiniMax M3.1 Flash (free)",
    agents:[["Maya","Scheduler",1],["Omar","Threads Writer",0],["Lily","Caption Writer",0],["Ken","Community Poster",0]],
    tasks:["Scheduling tomorrow's post for 7 PM","Drafting the Threads version of today's reel","Queuing the community post","Pinning the best comment from yesterday"] },
  { id:"design",    name:"Design",    count:3, color:"#F08A3C", side:1, slot:0,
    role:"Covers, carousels and brand visuals.",
    tools:"Canva · Figma", skills:"covers, templates, brand kits",
    model:"NVIDIA Nemotron 3 Super 120B (free)",
    agents:[["Nina","Visual Designer",1],["Raj","Template Maker",0],["Eva","Brand Keeper",0]],
    tasks:["Designing the ebook story templates","Refreshing the highlight covers","Building a carousel frame set","Exporting the new banner in 3 sizes"] },
  { id:"publishing",name:"Publishing",count:3, color:"#5FBF6E", side:1, slot:1,
    role:"Ships finished work to every platform, on time.",
    tools:"YouTube Studio · Scheduler", skills:"uploads, metadata, premiere setup",
    model:"Google Gemma 4 26B (free)",
    agents:[["Leo","Release Manager",1],["Mia","Metadata Writer",0],["Sam","Premiere Tech",0]],
    tasks:["Uploading the long video with chapters","Writing descriptions + pinned links","Setting the premiere for Friday 6 PM","Checking every scheduled post fired"] },
  { id:"analytics", name:"Analytics", count:4, color:"#3FBFB2", side:1, slot:2,
    role:"Reads the numbers and tells the office what to do next.",
    tools:"Studio Analytics · Sheets", skills:"retention reads, A/B verdicts, weekly reports",
    model:"NVIDIA Nemotron 3.5 Lightning (free)",
    agents:[["Ian","Data Reader",1],["Uma","Retention Analyst",0],["Jay","A/B Tester",0],["Kim","Report Builder",0]],
    tasks:["Reading retention on the last 5 reels","Verdict on the thumbnail A/B test","Building the weekly numbers sheet","Flagging the best-performing hook pattern"] },
  { id:"community", name:"Community", count:3, color:"#F2788C", side:1, slot:3,
    role:"Keeps comments, DMs and followers warm.",
    tools:"Instagram · WhatsApp", skills:"replies, DM triage, shout-outs",
    model:"Inkling Small (free)",
    agents:[["Ana","Community Manager",1],["Ben","DM Responder",0],["Zoe","Testimonial Hunter",0]],
    tasks:["Clearing the comment backlog","Answering buyer DMs about the blueprint","Collecting testimonial screenshots","Welcoming today's new followers"] }
];
var teamById = {};
TEAMS.forEach(function(t, ti2){
  teamById[t.id]=t;
  t.doneSeed=4+((ti2*29)%7);
  t.turn=(3+((ti2*37)%5))+"m "+(10+((ti2*53)%45))+"s";
  var pts=[]; for(var i=0;i<8;i++){ pts.push((i*9)+","+(13-((ti2*7+i*3)%9))); }
  t.spark=pts.join(" ");
});

var CONNECTIONS = [
  { name:"OpenRouter", what:"One key powers all 31 agents — every team on its own free model, Boss on the smartest.", model:"BOSS — NVIDIA Nemotron 3 Ultra 550B (free)" },
  { name:"Google Drive", what:"Raw clips land here; Creative pulls them straight into the edit bay.", model:"USED BY — Creative · Publishing" },
  { name:"CapCut", what:"Cuts, captions and sound design for every reel.", model:"USED BY — Creative" },
  { name:"Canva", what:"Thumbnails, covers and story templates.", model:"USED BY — Creative · Design" },
  { name:"YouTube", what:"Research scans it, Publishing ships to it, Analytics reads it back.", model:"USED BY — Research · Publishing · Analytics" },
  { name:"Instagram + Threads", what:"Reels, threads and first-hour replies.", model:"USED BY — Social · Community" },
  { name:"Figma", what:"Brand kits and frame sets with Design.", model:"USED BY — Design" },
  { name:"WhatsApp", what:"Buyer DMs and community check-ins.", model:"USED BY — Community" }
];

var FEED_LINES = [
  ["research","scanning GitHub — 3 repos trending in AI video"],
  ["research","found 14 fresh hook angles from comments"],
  ["scripts","hook v3 beats v1 in the read-through test"],
  ["scripts","sent the cold open to Creative"],
  ["creative","caption pass finished on reel #14"],
  ["creative","pulled 3 new clips from Drive"],
  ["social","scheduled tomorrow's post for 7:00 PM"],
  ["social","Threads version queued behind the reel"],
  ["design","story template pack exported"],
  ["design","new highlight covers are live"],
  ["publishing","premiere set for Friday 6:00 PM"],
  ["publishing","description links double-checked"],
  ["analytics","retention up 9% on the last two reels"],
  ["analytics","thumbnail B test has a clear winner"],
  ["community","12 DMs answered, 2 buyers helped"],
  ["community","testimonial saved to the proof folder"]
];

/* ================= STATE ================= */
var state = {
  doneToday: 47, clips: 12, online: 31,
  running: [], pending: [], done: [], teamDone: {},
  seq: 0, orderBusy: false, night: false
};
var teamLog = {};   /* per-team step history for the detail panel */
TEAMS.forEach(function(t){ teamLog[t.id]=[]; });
var lastFinishTeam = null;

/* ================= HELPERS ================= */
function $(id){ return document.getElementById(id); }
function nowTime(){
  var d=new Date(); var h=d.getHours(), m=d.getMinutes();
  var ap = h>=12 ? "PM":"AM"; h = h%12 || 12;
  return h+":"+(m<10?"0":"")+m+" "+ap;
}
function toast(msg){
  var t=$("toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(t._h); t._h=setTimeout(function(){ t.classList.remove("show"); },2600);
}
function feed(teamId, text){
  var team = teamById[teamId];
  var el=document.createElement("div");
  el.className="feed-item"; el.style.setProperty("--fc", team?team.color:"#B8923E");
  el.innerHTML="<b>"+(team?team.name:"Office")+"</b>: "+text+"<span class='t'>"+nowTime()+"</span>";
  var list=$("feedList"); list.prepend(el);
  while(list.children.length>14) list.removeChild(list.lastChild);
  if(team){ teamLog[teamId].unshift({ text:text, time:nowTime() }); if(teamLog[teamId].length>8) teamLog[teamId].pop(); }
}
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function activeTeams(){
  var s={}; state.running.forEach(function(t){ s[t.team]=true; }); return s;
}
function pendingTeams(){
  var s={}; state.pending.forEach(function(t){ s[t.team]=true; }); return s;
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function relTime(ts){ var m=Math.max(0, Math.round((Date.now()-ts)/60000)); return m<1 ? "just now" : m<60 ? m+"m ago" : Math.round(m/60)+"h ago"; }

/* minimap cells */
var mm=$("mmGrid");
TEAMS.forEach(function(t){
  var c=document.createElement("div");
  c.className="mm-cell"; c.id="mm-"+t.id; c.title=t.name;
  c.style.borderColor=t.color; c.style.background=t.color+"33";
  mm.appendChild(c);
});

/* ================= CLOCK ================= */
function tickClock(){
  var d=new Date();
  $("clockTime").textContent=nowTime();
  $("clockDate").textContent=d.toLocaleDateString(undefined,{weekday:"short", day:"numeric", month:"short"});
}
setInterval(tickClock, 15000); tickClock();

/* ================= BOARDS ================= */
function renderBoards(){
  var rb=$("boardRun"), ob=$("boardOk"), db=$("boardDone");
  rb.innerHTML=""; ob.innerHTML=""; db.innerHTML="";
  if(!state.running.length) rb.innerHTML='<div class="empty-note">All quiet — new work lands in seconds.</div>';
  state.running.slice(0,4).forEach(function(t){
    var team=teamById[t.team];
    var el=document.createElement("div"); el.className="task";
    el.style.setProperty("--tc", team.color);
    var circ=97.4;
    el.innerHTML='<div class="task-flex"><svg class="ring" viewBox="0 0 36 36"><circle class="ring-bg" cx="18" cy="18" r="15.5"/><circle class="ring-fg" cx="18" cy="18" r="15.5" style="stroke:'+team.color+';stroke-dashoffset:'+(circ*(1-t.prog/100)).toFixed(1)+'"/></svg><div class="task-main"><div class="tt">'+esc(t.title)+'</div><div class="tm">'+team.name.toUpperCase()+' TEAM · RUNNING</div></div><div class="ring-pct">'+Math.round(t.prog)+'%</div></div>';
    rb.appendChild(el);
  });
  if(!state.pending.length) ob.innerHTML='<div class="empty-note">Nothing waiting on you right now.</div>';
  state.pending.forEach(function(t){
    var team=teamById[t.team];
    var el=document.createElement("div"); el.className="task"; el.id="pending-"+t.id;
    el.style.setProperty("--tc", team.color);
    el.innerHTML='<div class="tt">'+esc(t.title)+'</div><div class="tm">'+team.name.toUpperCase()+' TEAM · WAITING FOR YOUR CALL</div>';
    var acts=document.createElement("div"); acts.className="task-actions";
    var ap=document.createElement("button"); ap.className="btn btn-approve"; ap.textContent="Approve";
    var rj=document.createElement("button"); rj.className="btn btn-reject"; rj.textContent="Reject";
    ap.addEventListener("click", function(){ decide(t.id, true); });
    rj.addEventListener("click", function(){ decide(t.id, false); });
    acts.appendChild(ap); acts.appendChild(rj); el.appendChild(acts);
    ob.appendChild(el);
  });
  state.done.slice(0,4).forEach(function(t){
    var team=teamById[t.team];
    var el=document.createElement("div"); el.className="task done-item";
    el.style.setProperty("--tc", team.color);
    el.innerHTML='<div class="tt"><span class="check">✓</span> '+esc(t.title)+'</div><div class="tm">'+team.name.toUpperCase()+' · '+(t.ts?relTime(t.ts):t.when)+'</div>';
    db.appendChild(el);
  });
  $("runCount").textContent=state.running.length+" active";
  $("okCount").textContent=state.pending.length+" waiting";
  $("doneCount").textContent=state.doneToday+" today";
  $("stDone").textContent=state.doneToday;
  $("stPending").textContent=state.pending.length;
  $("stClips").textContent=state.clips;
  $("stOnline").textContent=state.online+" / 31";
  var act=activeTeams();
  TEAMS.forEach(function(t){
    var cell=$("mm-"+t.id), on=!!act[t.id];
    cell.style.background = on ? t.color+"aa" : t.color+"33";
    cell.style.boxShadow = on ? "0 0 9px "+t.color : "none";
  });
  var badge=$("avatarBadge");
  badge.textContent=state.pending.length;
  badge.classList.toggle("show", state.pending.length>0);
  var rp=$("runPillTxt"); if(rp) rp.textContent="31 agents · "+state.running.length+" running";
  var bb=$("bellBadge"); if(bb){ bb.textContent=state.pending.length; bb.classList.toggle("show", state.pending.length>0); }
  var tb=$("tabBadge"); if(tb){ tb.textContent=state.pending.length; tb.classList.toggle("show", state.pending.length>0); }
  var bd=$("boardBadge"); if(bd){ bd.textContent=state.pending.length; bd.classList.toggle("show", state.pending.length>0); }
  var tkb=$("tasksBadge"); if(tkb){ tkb.textContent=state.pending.length; tkb.classList.toggle("show", state.pending.length>0); }
  if(typeof applyBoardFilter==="function") applyBoardFilter();
  if(typeof refreshChatHead==="function") refreshChatHead();
  if(typeof updateFloor==="function") updateFloor();
  if(typeof updateCabinBadge==="function") updateCabinBadge();
}

/* ================= TASK ENGINE ================= */
function spawnTask(teamId, opts){
  opts=opts||{};
  var team=teamById[teamId||pick(TEAMS).id];
  var title=opts.title||pick(team.tasks);
  if(state.running.some(function(x){return x.title===title;})) return null;
  var wasActive = !!activeTeams()[team.id];
  var task={ id:++state.seq, team:team.id, title:title, prog:8+Math.floor(Math.random()*20) };
  state.running.push(task);
  if(!wasActive && typeof teamWalkIn==="function") teamWalkIn(team.id);
  if(!opts.silent && typeof flyPlane==="function"){
    if(lastFinishTeam && lastFinishTeam!==team.id) flyPlane(lastFinishTeam, team.id);
    else flyPlane("dc", team.id);
    lastFinishTeam=null;
  }
  renderBoards();
  return task;
}
function finishTask(task, approved){
  state.running=state.running.filter(function(x){return x!==task;});
  state.pending=state.pending.filter(function(x){return x!==task;});
  state.doneToday++;
  state.teamDone[task.team]=(state.teamDone[task.team]||0)+1;
  state.done.unshift({ title:task.title, team:task.team, ts:Date.now(), when: approved?"approved by you · "+nowTime() : "done · "+nowTime() });
  if(typeof flyPlane==="function") flyPlane(task.team, "dc");
  if(typeof roomToast==="function") roomToast(task.team, "✓ Done — "+task.title);
  if(state.done.length>8) state.done.pop();
  lastFinishTeam=task.team;
  if(typeof teamDoneFlash==="function") teamDoneFlash(task.team);
  renderBoards();
}
function decide(id, ok){
  var task=state.pending.filter(function(x){return x.id===id;})[0];
  if(!task) return;
  var team=teamById[task.team];
  if(typeof flyPlane==="function") flyPlane("cabin", task.team);
  if(ok){
    feed(task.team, "you approved: “"+task.title+"” — shipping it now");
    toast("Approved — "+team.name+" team is shipping it.");
    finishTask(task, true);
  } else {
    state.pending=state.pending.filter(function(x){return x!==task;});
    if(typeof teamErrorFlash==="function") teamErrorFlash(task.team);
    feed(task.team, "you sent it back: “"+task.title+"” — reworking");
    toast("Sent back to "+team.name+" for a rework.");
    setTimeout(function(){
      state.running.push({ id:++state.seq, team:task.team, title:task.title+" (v2)", prog:15 });
      renderBoards();
    }, 3500);
    renderBoards();
  }
  if($("sheet").classList.contains("open") && sheetMode==="director") openSheet("director");
  if(detailCtx && detailCtx.type==="agent") renderAgentDetail(detailCtx.teamId, detailCtx.agentIdx);
}
setInterval(function(){
  state.running.forEach(function(t){ t.prog=Math.min(100, t.prog + 4+Math.random()*9); });
  var finished=state.running.filter(function(t){return t.prog>=100;});
  finished.forEach(function(t){
    state.running=state.running.filter(function(x){return x!==t;});
    if(Math.random()<0.45 && state.pending.length<3){
      t.prog=100; state.pending.push(t);
      feed(t.team, "“"+t.title+"” is ready — hand up, needs your OK");
      if(typeof roomToast==="function") roomToast(t.team, "✋ Hand up — “"+t.title+"” needs your OK");
    } else {
      finishTask(t,false);
      feed(t.team, "finished: “"+t.title+"”");
    }
  });
  if(state.running.length<4 && Math.random()<0.8) spawnTask();
  if(state.running.length<2) spawnTask();
  renderBoards();
}, 2600);
var lastChatter="";
setInterval(function(){
  var line=pick(FEED_LINES), guard=0;
  while(line[1]===lastChatter && guard++<6) line=pick(FEED_LINES);
  lastChatter=line[1];
  feed(line[0], line[1]);
  if(line[1].indexOf("sent the cold open")>-1 && typeof flyPlane==="function") flyPlane("scripts","creative");
}, 4200);
setInterval(function(){
  state.online = 29 + Math.floor(Math.random()*3);
  if(Math.random()<0.25) state.online=31;
  $("stOnline").textContent=state.online+" / 31";
}, 9000);

/* ================= TEXT ORDERS ================= */
var SUBS=[
  { name:"Anaya", job:"Rough cuts — 3 clips", dur:5200 },
  { name:"Neil", job:"Captions + on-screen hooks", dur:6800 },
  { name:"Riya", job:"Thumbnails in Canva", dur:4600 }
];
var DEFAULT_ORDER="Grab the three new clips from Drive and edit them in parallel.";
function runOrder(text){
  if(state.orderBusy) return;
  state.orderBusy=true;
  text=(text||"").trim()||DEFAULT_ORDER;
  var btn=$("orderBtn"); var oldBtn=btn.innerHTML;
  btn.disabled=true; btn.textContent="Working…";
  var st=$("orderState"); if(st) st.textContent="ON IT — BRIEFING CREATIVE";
  $("orderPanel").classList.add("open"); if(typeof syncScrim==="function") syncScrim();
  if(typeof roomToast==="function") roomToast("creative", "Vikram has your order — briefing the team");
  feed("creative","text order received from the Director: “"+text+"”");
  if(typeof flyPlane==="function"){ flyPlane("cabin","creative"); setTimeout(function(){ flyPlane("dc","creative"); },450); }
  if(typeof teamWalkIn==="function") teamWalkIn("creative");
  if(typeof spawnSubs==="function") spawnSubs();
  setBayStatus("SUB-AGENT BAY · 3 WORKING");

  var bay=$("subbay"); bay.classList.add("show");
  var wrap=$("subCards"); wrap.innerHTML="";
  var cards=SUBS.map(function(sx){
    var el=document.createElement("div"); el.className="sub-card";
    el.innerHTML='<div class="row"><span><b>'+sx.name+'</b> · '+sx.job+'</span><span class="st">WORKING</span></div><div class="bar"><i></i></div>';
    wrap.appendChild(el);
    return { el:el, bar:el.querySelector(".bar i"), st:el.querySelector(".st"), prog:0, rate:100/(sx.dur/200), name:sx.name, done:false };
  });
  feed("creative","sub-agent bay opened — Anaya, Neil and Riya walked in, briefed by paper plane");
  var iv=setInterval(function(){
    var allDone=true;
    cards.forEach(function(c){
      if(!c.done){
        c.prog=Math.min(100, c.prog + c.rate*(0.7+Math.random()*0.6));
        c.bar.style.width=c.prog+"%";
        if(c.prog>=100){ c.done=true; c.el.classList.add("done"); c.st.textContent="DONE ✓"; feed("creative", c.name+" finished its piece and reported back"); }
      }
      if(!c.done) allDone=false;
    });
    if(allDone){
      clearInterval(iv);
      state.orderBusy=false;
      state.clips+=3; state.doneToday+=3;
      state.done.unshift({ title:"3 clips edited in parallel (text order)", team:"creative", ts:Date.now(), when:"done · "+nowTime() });
      feed("creative","all 3 clips edited — rough cut, captions and thumbnails ready for your OK");
      state.pending.push({ id:++state.seq, team:"creative", title:"Review the 3 edited clips from Drive", prog:100 });
      if(typeof subReportBack==="function") subReportBack();
      if(typeof teamDoneFlash==="function") teamDoneFlash("creative");
      if(st) st.textContent="READY — TYPE AN ORDER";
      btn.disabled=false; btn.innerHTML=oldBtn;
      toast("3 clips edited in parallel — waiting on your OK.");
      setTimeout(function(){ bay.classList.remove("show"); }, 5000);
      setTimeout(function(){ setBayStatus("SUB-AGENT BAY · READY"); }, 5000);
      renderBoards();
    }
  },200);
}
$("orderForm").addEventListener("submit", function(e){ e.preventDefault(); runOrder($("orderText").value); $("orderText").value=""; });
$("orderFormPanel").addEventListener("submit", function(e){ e.preventDefault(); runOrder($("orderTextPanel").value); });

/* ================= BOARD FILTERS + ROOM TOASTS + SCRIM ================= */
var boardFilter="all";
function applyBoardFilter(){
  var f=boardFilter;
  var rc=$("boardRunCard"), oc=$("boardOkCard"), dc2=$("boardDoneCard");
  if(rc) rc.style.display=(f==="all"||f==="running")?"":"none";
  if(oc) oc.style.display=(f==="all"||f==="waiting")?"":"none";
  if(dc2) dc2.style.display=(f==="all"||f==="done")?"":"none";
  var a=$("fcAll"), r=$("fcRun"), w=$("fcWait"), d=$("fcDone");
  if(a) a.textContent=state.running.length+state.pending.length+state.doneToday;
  if(r) r.textContent=state.running.length;
  if(w) w.textContent=state.pending.length;
  if(d) d.textContent=state.doneToday;
}
Array.prototype.forEach.call(document.querySelectorAll(".bfilter"), function(b){
  b.addEventListener("click", function(){
    boardFilter=b.getAttribute("data-filter");
    Array.prototype.forEach.call(document.querySelectorAll(".bfilter"), function(x){ x.classList.toggle("active", x===b); });
    applyBoardFilter();
  });
});
var roomToasts=[];
function cleanupToast(L){
  var i=labels.indexOf(L); if(i>-1) labels.splice(i,1);
  var j=roomToasts.indexOf(L); if(j>-1) roomToasts.splice(j,1);
  if(L.el.parentNode) L.el.parentNode.removeChild(L.el);
}
function roomToast(teamId, text){
  if(!floorOK || typeof makeLabel!=="function"){ toast(text); return; }
  while(roomToasts.length>=3) cleanupToast(roomToasts[0]);
  var team=teamById[teamId];
  var L=makeLabel("lbl", '<span class="room-toast" style="--pc:'+(team?team.color:"#64D8FF")+'">'+esc(text)+'</span>',
    function(){ var a=anchorPos(teamId); return new THREE.Vector3(a.x, a.y+1.7, a.z); }, "translate(-50%,-130%)");
  L.el.style.display=""; L.el.style.pointerEvents="auto"; L.el.style.cursor="pointer"; L.el.style.zIndex="130";
  L.el.addEventListener("click", function(){ $("boardSheet").classList.add("open"); syncScrim(); cleanupToast(L); });
  roomToasts.push(L);
  setTimeout(function(){ cleanupToast(L); }, 3800);
}
function syncScrim(){
  var sc=$("scrim"); if(!sc) return;
  var on=$("boardSheet").classList.contains("open")||$("detailPanel").classList.contains("open")||$("chatPanel").classList.contains("open")||$("orderPanel").classList.contains("open");
  sc.classList.toggle("on", on);
}

/* ================= SHEETS / TABS ================= */
var sheet=$("sheet"), sheetMode=null;
function rosterHTML(t){
  var rows=t.agents.map(function(a, i){
    return '<button class="r-line" data-chat="'+t.id+':'+i+'" title="Chat with '+a[0]+'"><b>'+a[0]+'</b><span>'+a[1]+'</span>'+(a[2]?' <span class="lead-chip">LEAD</span>':'')+'<span class="r-chat">CHAT →</span></button>';
  }).join("");
  return '<div class="roster">'+rows+'</div>';
}
function officeSummaryRows(){
  return [["Agents online", state.online+" / 31"],
    ["Tasks running", state.running.length],
    ["Approvals waiting on you", state.pending.length],
    ["Tasks done today", state.doneToday],
    ["Clips shipped", state.clips],
    ["Teams", "8"],
    ["Data Center", "1 — every team reads and writes to it"]];
}
function openSheet(tab, focusTeam){
  sheetMode=tab;
  var mbn=$("moreMenu"); if(mbn) mbn.classList.remove("open");
  var bsh=$("boardSheet"); if(bsh) bsh.classList.remove("open");
  var title=$("sheetTitle"), sub=$("sheetSub"), body=$("sheetBody");
  body.innerHTML="";
  if(tab==="teams"){
    title.textContent="The 8 Teams";
    sub.textContent="31 named agents, one Data Center. Tap any office or agent on the floor for its live panel.";
    var grid=document.createElement("div"); grid.className="team-grid";
    TEAMS.forEach(function(t){
      var c=document.createElement("div"); c.className="team-cell";
      c.style.borderColor=t.color+"66";
      if(focusTeam===t.id) c.style.boxShadow="0 0 0 2px "+t.color;
      c.innerHTML="<h5 style='color:"+t.color+"'>"+t.name+" · "+t.count+" agents</h5><p>"+t.role+"</p>"+
        "<div class='tools'>TOOLS — "+t.tools+"<br>SKILLS — "+t.skills+"<br>MODEL — "+t.model+"</div>"+rosterHTML(t);
      grid.appendChild(c);
    });
    body.appendChild(grid);
  }
  if(tab==="director"){
    title.textContent="Director's Cabin";
    sub.textContent="Your seat above the floor: give the order, clear the approvals, see the whole office at a glance.";
    var grid=document.createElement("div"); grid.className="dir-grid";
    [["Agents online", state.online+" / 31", 0],
     ["Running now", state.running.length, 0],
     ["Hands up — waiting on you", state.pending.length, state.pending.length>0],
     ["Done today", state.doneToday, 0],
     ["Clips shipped", state.clips, 0]
    ].forEach(function(r){
      var d=document.createElement("div"); d.className="dir-stat";
      d.innerHTML='<div class="k">'+r[0]+'</div><div class="v'+(r[2]?" hot":"")+'">'+r[1]+'</div>';
      grid.appendChild(d);
    });
    body.appendChild(grid);

    var sec1=document.createElement("div"); sec1.className="dir-sec"; sec1.textContent="ORDER DESK";
    body.appendChild(sec1);
    var q=document.createElement("div"); q.className="order-quote"; q.style.marginTop="0";
    q.innerHTML="Your standing order: <b>“Grab the three new clips from Drive and edit them in parallel.”</b>";
    body.appendChild(q);
    var vb=document.createElement("button"); vb.className="send-btn"; vb.textContent="Send this order";
    vb.addEventListener("click", function(){ sheet.classList.remove("open"); runOrder(DEFAULT_ORDER); });
    body.appendChild(vb);

    var sec2=document.createElement("div"); sec2.className="dir-sec"; sec2.textContent="RAISED HANDS — ALERTS";
    body.appendChild(sec2);
    if(!state.pending.length){
      var none=document.createElement("div"); none.className="empty-note"; none.textContent="No hands up. The floor is clear.";
      body.appendChild(none);
    }
    state.pending.forEach(function(t){
      var team=teamById[t.team];
      var row=document.createElement("button"); row.className="alert-row";
      row.innerHTML='<span class="a-hand">✋</span><span><b>'+team.name+' team</b> is waiting on you — “'+esc(t.title)+'”</span><span class="a-go">JUMP TO IT →</span>';
      row.addEventListener("click", function(){
        sheet.classList.remove("open");
        $("boardSheet").classList.add("open");
        var el=$("pending-"+t.id);
        if(el){ el.classList.add("flash"); setTimeout(function(){ el.classList.remove("flash"); },2200); }
        if(typeof focusTeam==="function") focusTeam(t.team);
      });
      body.appendChild(row);
    });

    var sec3=document.createElement("div"); sec3.className="dir-sec"; sec3.textContent="APPROVALS INBOX — NEEDS YOUR OK";
    body.appendChild(sec3);
    if(!state.pending.length){
      var none2=document.createElement("div"); none2.className="empty-note"; none2.textContent="Inbox zero. Nothing waiting on your call.";
      body.appendChild(none2);
    }
    state.pending.forEach(function(t){
      var team=teamById[t.team];
      var el=document.createElement("div"); el.className="task"; el.style.setProperty("--tc", team.color);
      el.innerHTML='<div class="tt">'+esc(t.title)+'</div><div class="tm">'+team.name.toUpperCase()+' TEAM · WAITING FOR YOUR CALL</div>';
      var acts=document.createElement("div"); acts.className="task-actions";
      var ap=document.createElement("button"); ap.className="btn btn-approve"; ap.textContent="Approve";
      var rj=document.createElement("button"); rj.className="btn btn-reject"; rj.textContent="Reject";
      ap.addEventListener("click", function(){ decide(t.id, true); });
      rj.addEventListener("click", function(){ decide(t.id, false); });
      acts.appendChild(ap); acts.appendChild(rj); el.appendChild(acts);
      body.appendChild(el);
    });

    var sec4=document.createElement("div"); sec4.className="dir-sec"; sec4.textContent="WHOLE-OFFICE STATUS";
    body.appendChild(sec4);
    officeSummaryRows().forEach(function(r){
      var el=document.createElement("div"); el.className="kv";
      el.innerHTML="<span>"+r[0]+"</span><b>"+r[1]+"</b>";
      body.appendChild(el);
    });
  }
  if(tab==="hr"){
    title.textContent="HR — Agent Roster";
    sub.textContent="All 31 agents, named, with their roles. The Lead sits at the head of each desk pod.";
    TEAMS.forEach(function(t){
      var head=document.createElement("div"); head.className="kv";
      head.innerHTML="<span style='color:"+t.color+";font-weight:700'>"+t.name+" team</span><b>"+(activeTeams()[t.id]?"on task":"standing by")+"</b>";
      body.appendChild(head);
      var wrap=document.createElement("div"); wrap.style.padding="2px 0 8px";
      wrap.innerHTML=rosterHTML(t);
      body.appendChild(wrap);
    });
    var tot=document.createElement("div"); tot.className="kv";
    tot.innerHTML="<span>Total headcount</span><b>31 agents · 1 Director (you)</b>";
    body.appendChild(tot);
  }
  if(tab==="calendar"){
    title.textContent="Today's Calendar";
    sub.textContent="The office runs on this rhythm every day.";
    [["7:00 AM","Research scan","Trends, comments and rival channels — Research team"],
     ["9:00 AM","Script lock","Hooks approved, scripts handed to Creative"],
     ["12:00 PM","Edit block","Creative cuts, captions and thumbnails"],
     ["4:00 PM","Design pass","Covers and story templates — Design team"],
     ["6:00 PM","Premiere","Long video goes live — Publishing team"],
     ["7:00 PM","Prime post","Reel + Threads drop — Social team"],
     ["9:30 PM","Numbers review","Analytics reads the day, plans tomorrow"]
    ].forEach(function(r){
      var el=document.createElement("div"); el.className="cal-row";
      el.innerHTML="<span class='when'>"+r[0]+"</span><div><b>"+r[1]+"</b><small>"+r[2]+"</small></div>";
      body.appendChild(el);
    });
  }
  if(tab==="stats"){
    title.textContent="Office Stats";
    sub.textContent="Live numbers from the floor right now.";
    officeSummaryRows().forEach(function(r){
      var el=document.createElement("div"); el.className="kv";
      el.innerHTML="<span>"+r[0]+"</span><b>"+r[1]+"</b>";
      body.appendChild(el);
    });
  }
  if(tab==="connect"){
    title.textContent="Connect Your Agents";
    sub.textContent="The office's connection desk. One OpenRouter key runs the whole floor — each team on its own free model, the Boss on the smartest free one.";
    var grid2=document.createElement("div"); grid2.className="conn-grid";
    CONNECTIONS.forEach(function(c){
      var cell=document.createElement("div"); cell.className="conn-cell";
      cell.innerHTML="<h5>"+c.name+"<span class='chip-on'>LINKED</span></h5><p>"+c.what+"</p><div class='model'>"+c.model+"</div>";
      grid2.appendChild(cell);
    });
    body.appendChild(grid2);
    var sec=document.createElement("div"); sec.className="dir-sec"; sec.textContent="MODEL PER TEAM — ALL FREE, ALL DIFFERENT";
    body.appendChild(sec);
    TEAMS.forEach(function(t){
      var el=document.createElement("div"); el.className="kv";
      el.innerHTML="<span style='color:"+t.color+";font-weight:700'>"+t.name+"</span><b>"+t.model+"</b>";
      body.appendChild(el);
    });
    var boss=document.createElement("div"); boss.className="kv";
    boss.innerHTML="<span style='font-weight:700'>Director / Boss router</span><b>NVIDIA Nemotron 3 Ultra 550B (free)</b>";
    body.appendChild(boss);
  }
  Array.prototype.forEach.call(body.querySelectorAll("[data-chat]"), function(el){
    el.addEventListener("click", function(){
      var parts=el.getAttribute("data-chat").split(":");
      closeSheet(); openChat(parts[0], parseInt(parts[1],10));
    });
  });
  sheet.classList.add("open");
  document.querySelectorAll(".tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab===tab); });
  var mb2=$("moreBtn"); if(mb2) mb2.classList.toggle("active", ["teams","director","hr","calendar","stats","connect"].indexOf(tab)>-1);
}
Array.prototype.forEach.call(document.querySelectorAll("#moreMenu button"), function(mb){
  mb.addEventListener("click", function(){ openSheet(mb.getAttribute("data-sheet")); });
});
document.querySelectorAll(".tab").forEach(function(btn){
  btn.addEventListener("click", function(){
    if(btn.dataset.tab==="more"){ $("moreMenu").classList.toggle("open"); return; }
    $("moreMenu").classList.remove("open");
    if(btn.dataset.tab==="tasks"){
      sheet.classList.remove("open"); sheetMode=null;
      $("boardSheet").classList.toggle("open");
      document.querySelectorAll(".tab").forEach(function(x){ x.classList.toggle("active", x===btn); });
      if(typeof syncScrim==="function") syncScrim();
      return;
    }
    if(btn.dataset.tab==="dc"){
      sheet.classList.remove("open"); sheetMode=null;
      document.querySelectorAll(".tab").forEach(function(x){ x.classList.toggle("active", x===btn); });
      renderDCDetail();
      return;
    }
    if(btn.dataset.tab==="office"){
      sheet.classList.remove("open"); sheetMode=null;
      document.querySelectorAll(".tab").forEach(function(x){ x.classList.toggle("active", x===btn); });
    } else openSheet(btn.dataset.tab);
  });
});
function closeSheet(){
  sheet.classList.remove("open"); sheetMode=null;
  document.querySelectorAll(".tab").forEach(function(x){ x.classList.toggle("active", x.dataset.tab==="office"); });
}
$("sheetClose").addEventListener("click", closeSheet);
sheet.addEventListener("click", function(e){ if(e.target===sheet) closeSheet(); });
$("connectBtn").addEventListener("click", function(){ openSheet("connect"); });
$("avatarBtn").addEventListener("click", function(){ openSheet("director"); });
$("cabinBtn").addEventListener("click", function(){ openSheet("director"); });

/* ================= DETAIL PANEL ================= */
var detailCtx=null;
var STATUS_META={
  working:{ label:"WORKING — typing at the desk", color:"#3ED97E" },
  thinking:{ label:"THINKING — hand on chin, weighing options", color:"#F5A623" },
  waiting:{ label:"WAITING — hand up, needs the Director", color:"#F5A623" },
  error:{ label:"ERROR — needs a rework", color:"#FF6B5E" },
  done:{ label:"DONE — shipped", color:"#3ED97E" },
  walking:{ label:"WALKING IN — heading to the desk", color:"#6B8CAE" },
  idle:{ label:"IDLE — leaning back, screensaver on", color:"#7C8DB0" },
  seated:{ label:"AT DESK — Director's cabin", color:"#B8923E" }
};
function agentStatus(teamId, idx){
  if(typeof agentStateOf==="function") return agentStateOf(teamId, idx);
  return activeTeams()[teamId] ? "working" : "idle";
}
function stepsFor(team, task){
  var steps=[
    { txt:"Brief received — paper plane from the Data Center", done:true },
    { txt:"Context pulled from the Data Center", done:true }
  ];
  if(task){
    steps.push({ txt:"Working: "+task.title, done:task.prog>=100, now:task.prog<100 });
    steps.push({ txt:"Self-check against the team's playbook", done:task.prog>=70, now:task.prog>=40&&task.prog<70 });
    steps.push({ txt:"Hand up — Director's OK to ship", done:false, now:task.prog>=100 });
  } else if(pendingTeams()[team.id]){
    var pt=state.pending.filter(function(x){return x.team===team.id;})[0];
    steps.push({ txt:"Finished: "+pt.title, done:true });
    steps.push({ txt:"Hand up — waiting on the Director right now", done:false, now:true });
  } else {
    steps.push({ txt:"Standing by for the next brief", done:false, now:true });
  }
  return steps;
}
function stepsHTML(steps){
  return steps.map(function(s){
    return '<div class="step '+(s.done?"done":s.now?"now":"")+'"><span class="box">'+(s.done?"✓":"")+'</span><span>'+esc(s.txt)+'</span></div>';
  }).join("");
}
function histHTML(teamId){
  var log=teamLog[teamId]||[];
  if(!log.length) return '<div class="empty-note">No activity yet today.</div>';
  return log.slice(0,5).map(function(h){
    return '<div class="hist-item" style="--hc:'+teamById[teamId].color+'">'+esc(h.text)+'<span class="t">'+h.time+'</span></div>';
  }).join("");
}
function openDetail(){ if(typeof closeChat==="function") closeChat(); $("detailPanel").classList.add("open"); if(typeof syncScrim==="function") syncScrim(); }
function closeDetail(){ $("detailPanel").classList.remove("open"); detailCtx=null; if(typeof syncScrim==="function") syncScrim(); }
$("detailClose").addEventListener("click", closeDetail);

function renderAgentDetail(teamId, idx){
  var team=teamById[teamId]; if(!team) return;
  var a=team.agents[idx]; if(!a) return;
  detailCtx={ type:"agent", teamId:teamId, agentIdx:idx };
  var st=agentStatus(teamId, idx), meta=STATUS_META[st]||STATUS_META.idle;
  var task=state.running.filter(function(x){return x.team===teamId;})[0];
  var html='<div class="d-kicker" style="color:'+team.color+'">'+team.name.toUpperCase()+' TEAM'+(a[2]?' · TEAM LEAD':'')+'</div>'+
    '<h3>'+a[0]+'</h3><div class="d-role">'+a[1]+' · runs on '+team.model+'</div>'+
    '<div class="d-status" style="--sc:'+meta.color+'"><i></i>'+meta.label+'</div>'+
    '<div class="d-sec">STEP BY STEP — LIVE</div>'+stepsHTML(stepsFor(team, task));
  if(st==="waiting"){
    var pt=state.pending.filter(function(x){return x.team===teamId;})[0];
    if(pt){
      html+='<div class="d-actions"><button class="btn btn-approve" id="dApprove">Approve</button><button class="btn btn-reject" id="dReject">Reject</button></div>';
    }
  }
  html+='<div class="d-sec">TEAM HISTORY</div>'+histHTML(teamId)+
    '<div class="d-actions"><button class="btn" id="dTeam" style="background:#1B2A4D;border:1px solid var(--panel-line);color:#9BE8FF">Open the whole '+team.name+' team</button></div>';
  $("detailBody").innerHTML=html;
  var ap=$("dApprove"), rj=$("dReject");
  if(ap) ap.addEventListener("click", function(){ decide(pt.id, true); });
  if(rj) rj.addEventListener("click", function(){ decide(pt.id, false); });
  $("dTeam").addEventListener("click", function(){ renderTeamDetail(teamId); });
  openDetail();
}
function renderTeamDetail(teamId){
  var team=teamById[teamId]; if(!team) return;
  detailCtx={ type:"team", teamId:teamId };
  var task=state.running.filter(function(x){return x.team===teamId;})[0];
  var pend=state.pending.filter(function(x){return x.team===teamId;})[0];
  var waiting=!!pend;
  var lead=team.agents[0];
  var doneN=(team.doneSeed||0)+(state.teamDone[teamId]||0);
  var runN=state.running.filter(function(x){return x.team===teamId;}).length;
  function actLine(idx){
    var st=agentStatus(teamId, idx);
    if(st==="working") return task ? task.title : "at the desk, typing";
    if(st==="thinking") return "weighing the options";
    if(st==="waiting") return pend ? "hand up — “"+pend.title+"”" : "hand up, needs you";
    if(st==="walking") return "walking in";
    if(st==="error") return "hit a snag — reworking";
    if(st==="done") return "just shipped";
    return "standing by";
  }
  var html='<div class="d-kicker" style="color:'+team.color+'">TEAM PANEL</div>'+
    '<h3>'+team.name+'</h3><div class="d-role">'+team.count+' agents · Lead: '+lead[0]+' — '+lead[1]+'</div>'+
    '<div class="d-status" style="--sc:'+(waiting?"#F5A623":task?"#3ED97E":"#7C8DB0")+'"><i></i>'+
    (waiting?"A HAND IS UP — waiting on you":task?"ON TASK — "+esc(task.title):"STANDING BY")+'</div>'+
    '<div class="dtabs"><button class="dtab active" data-dtab="overview">OVERVIEW</button><button class="dtab" data-dtab="tasks">TASKS</button><button class="dtab" data-dtab="calendar">CALENDAR</button><button class="dtab" data-dtab="settings">SETTINGS</button></div>';

  /* OVERVIEW */
  html+='<div class="dpane on" data-pane="overview">'+
    '<div class="tile-grid">'+
      '<div class="tile"><div class="tk">TASKS TODAY</div><div class="tv">'+doneN+'</div><svg width="54" height="16" viewBox="0 0 63 16"><polyline points="'+team.spark+'" fill="none" stroke="'+team.color+'" stroke-width="1.6"/></svg></div>'+
      '<div class="tile"><div class="tk">RUNNING</div><div class="tv">'+runN+'</div><svg width="54" height="16" viewBox="0 0 63 16"><polyline points="'+team.spark+'" fill="none" stroke="'+team.color+'" stroke-width="1.6" opacity=".55"/></svg></div>'+
      '<div class="tile"><div class="tk">AVG TURNAROUND</div><div class="tv">'+team.turn+'</div><svg width="54" height="16" viewBox="0 0 63 16"><polyline points="'+team.spark+'" fill="none" stroke="'+team.color+'" stroke-width="1.6" opacity=".3"/></svg></div>'+
    '</div>'+
    '<div class="d-sec">CONNECTED TOOLS</div><div>'+
    team.tools.split("·").map(function(x){ return '<span class="tool-chip">'+x.trim()+'</span>'; }).join("")+
    '</div><div class="d-sec">SKILLS — '+(task?"LIVE":"READY")+'</div>'+
    team.skills.split(",").map(function(sk, si){
      var pct=35+(((team.id.charCodeAt(0)*7)+(si*23))%55);
      return '<div class="skill-row"><div class="sk-top"><b>'+sk.trim()+'</b><span>'+(task?pct+"% · working":"ready")+'</span></div><div class="sk-bar"><i class="'+(task?"anim":"")+'" style="--w:'+pct+'%;background:'+team.color+'"></i></div></div>';
    }).join("")+
    '<div class="d-sec">AGENTS — TAP A NAME TO CHAT</div>';
  team.agents.forEach(function(a, i){
    var st=agentStatus(teamId, i);
    html+='<button class="member-row" data-agent="'+i+'"><span class="m-av" style="background:'+team.color+'">'+a[0][0]+'</span><span class="m-main"><span class="mn">'+a[0]+(a[2]?' <span class="lead-chip">LEAD</span>':'')+'</span><span class="m-act">'+esc(actLine(i))+'</span></span><span class="ms st-'+st+'">'+st.toUpperCase()+'</span></button>';
  });
  html+='</div>';

  /* TASKS */
  html+='<div class="dpane" data-pane="tasks"><div class="d-sec">FOR THIS TEAM</div>';
  if(task) html+='<div class="step now"><span class="box"></span><span>Running: '+esc(task.title)+' — '+Math.round(task.prog)+'%</span></div>';
  if(pend){
    html+='<div class="step now"><span class="box"></span><span>Waiting on you: '+esc(pend.title)+'</span></div>'+
      '<div class="d-actions"><button class="btn btn-approve" id="dApprove">Approve</button><button class="btn btn-reject" id="dReject">Reject</button></div>';
  }
  state.done.filter(function(d){return d.team===teamId;}).slice(0,4).forEach(function(d){
    html+='<div class="step done"><span class="box">✓</span><span>'+esc(d.title)+' · '+(d.ts?relTime(d.ts):"")+'</span></div>';
  });
  if(!task && !pend) html+='<div class="empty-note">Nothing in flight — the whiteboard is clear.</div>';
  html+='<div class="d-sec">ON THE WHITEBOARD</div><div class="step done"><span class="box">✓</span><span>'+(task?esc(task.title):pend?"Finished — waiting for the Director's OK":"Standing by for the next brief")+'</span></div></div>';

  /* CALENDAR */
  html+='<div class="dpane" data-pane="calendar"><div class="d-sec">'+team.name.toUpperCase()+' RHYTHM — TODAY</div>'+
    [["7:00 AM","Scan & brief","The team pulls fresh context from the Data Center"],
     ["12:00 PM","Deep work block","Heads down — the island lights up"],
     ["4:00 PM","Review pass","Work is checked before it ships"],
     ["7:00 PM","Ship & report","Finished pieces go out, numbers come back"]
    ].map(function(r){ return '<div class="cal-row"><span class="when">'+r[0]+'</span><div><b>'+r[1]+'</b><small>'+r[2]+'</small></div></div>'; }).join("")+'</div>';

  /* SETTINGS */
  html+='<div class="dpane" data-pane="settings"><div class="d-sec">HOW THIS TEAM RUNS</div>'+
    '<div class="kv"><span>Model</span><b>'+team.model+'</b></div>'+
    '<div class="kv"><span>Tools</span><b>'+team.tools+'</b></div>'+
    '<div class="kv"><span>Text orders</span><b>On — dock + order panel</b></div>'+
    '<div class="kv"><span>Approvals</span><b>Director OK before shipping</b></div>'+
    '<div class="kv"><span>Data Center</span><b>Reads + writes the note store</b></div></div>';

  $("detailBody").innerHTML=html;
  Array.prototype.forEach.call($("detailBody").querySelectorAll(".member-row"), function(btn){
    btn.addEventListener("click", function(){ openChat(teamId, parseInt(btn.getAttribute("data-agent"),10)); });
  });
  Array.prototype.forEach.call($("detailBody").querySelectorAll(".dtab"), function(tb){
    tb.addEventListener("click", function(){
      Array.prototype.forEach.call($("detailBody").querySelectorAll(".dtab"), function(x){ x.classList.toggle("active", x===tb); });
      Array.prototype.forEach.call($("detailBody").querySelectorAll(".dpane"), function(p){ p.classList.toggle("on", p.getAttribute("data-pane")===tb.getAttribute("data-dtab")); });
    });
  });
  var ap=$("dApprove"), rj=$("dReject");
  if(ap && pend) ap.addEventListener("click", function(){ decide(pend.id, true); });
  if(rj && pend) rj.addEventListener("click", function(){ decide(pend.id, false); });
  openDetail();
}
function renderDCDetail(){
  detailCtx={ type:"dc" };
  var html='<div class="d-kicker">GLASS SERVER ROOM</div><h3>Data Center</h3>'+
    '<div class="d-role">The one note store every agent reads and writes — nothing learned in one office is lost to the others.</div>'+
    '<div class="d-status" style="--sc:#6E9A72"><i></i>SYNCED — all 8 teams connected</div>'+
    '<div class="d-sec">RIGHT NOW</div>'+stepsHTML([
      { txt:state.running.length+" live tasks being tracked across the floor", done:true },
      { txt:state.doneToday+" finished pieces stored today", done:true },
      { txt:state.pending.length+" pieces held for the Director's OK", done:false, now:state.pending.length>0 },
      { txt:"Nightly backup to the Director's cabin", done:false, now:state.pending.length===0 }
    ])+
    '<div class="d-sec">STATS</div>'+officeSummaryRows().map(function(r){ return '<div class="kv"><span>'+r[0]+'</span><b>'+r[1]+'</b></div>'; }).join("");
  $("detailBody").innerHTML=html;
  openDetail();
}
function renderRoomDetail(name, desc){
  detailCtx={ type:"room" };
  $("detailBody").innerHTML='<div class="d-kicker">SHARED SPACE</div><h3>'+name+'</h3><div class="d-role">'+desc+'</div>'+
    '<div class="d-status" style="--sc:#6E9A72"><i></i>OPEN — shared by all 8 teams</div>';
  openDetail();
}


/* ================= AGENT CHAT + BAY STATUS ================= */
var chats={}, chatCtx=null, chatTimer=null;
function setBayStatus(txt){
  var el=document.getElementById("bayLabel");
  if(el) el.textContent=txt;
}
function chatKey(teamId, idx){ return teamId+":"+idx; }
function currentTaskLine(teamId){
  var tk=state.running.filter(function(x){return x.team===teamId;})[0];
  if(tk) return "working on \u201C"+tk.title+"\u201D ("+Math.round(tk.prog)+"% in)";
  var pt=state.pending.filter(function(x){return x.team===teamId;})[0];
  if(pt) return "done with \u201C"+pt.title+"\u201D — hand up, waiting on your OK on the board";
  return "between tasks, watching the Data Center for the next brief";
}
function openChat(teamId, idx){
  var team=teamById[teamId]; if(!team||!team.agents[idx]) return;
  chatCtx={ teamId:teamId, idx:idx };
  closeDetail();
  var a=team.agents[idx];
  $("chatAv").textContent=a[0][0];
  $("chatAv").style.background=team.color;
  $("chatName").textContent=a[0];
  $("chatMeta").textContent=(team.name+" team · "+a[1]+(a[2]?" · Lead":"")).toUpperCase();
  refreshChatHead();
  var key=chatKey(teamId, idx);
  if(!chats[key]){
    chats[key]=[];
    pushChat(key, "agent", "Director — "+a[0]+" here, "+a[1]+" with the "+team.name+" team. Right now I'm "+currentTaskLine(teamId)+". What do you need?");
  } else renderChatMsgs();
  $("chatPanel").classList.add("open");
  if(typeof syncScrim==="function") syncScrim();
  var inp=$("chatInput");
  if(inp && window.innerWidth>860) inp.focus();
}
function closeChat(){
  var p=$("chatPanel"); if(p) p.classList.remove("open");
  if(typeof syncScrim==="function") syncScrim();
  chatCtx=null;
  if(chatTimer){ clearTimeout(chatTimer); chatTimer=null; }
}
function refreshChatHead(){
  if(!chatCtx) return;
  var st=agentStatus(chatCtx.teamId, chatCtx.idx), meta=STATUS_META[st]||STATUS_META.idle;
  var el=$("chatStatus");
  if(el) el.innerHTML='<i style="background:'+meta.color+'"></i><span>'+meta.label.charAt(0)+meta.label.slice(1).toLowerCase()+" — "+currentTaskLine(chatCtx.teamId)+"</span>";
}
function renderChatMsgs(){
  if(!chatCtx) return;
  var key=chatKey(chatCtx.teamId, chatCtx.idx), wrap=$("chatMsgs");
  wrap.innerHTML="";
  (chats[key]||[]).forEach(function(m){
    var d=document.createElement("div");
    d.className="msg "+m.from;
    d.textContent=m.text;
    wrap.appendChild(d);
  });
  wrap.scrollTop=wrap.scrollHeight;
}
function pushChat(key, from, text){
  chats[key]=chats[key]||[];
  chats[key].push({ from:from, text:text });
  if(chatCtx && chatKey(chatCtx.teamId, chatCtx.idx)===key) renderChatMsgs();
}
function agentReplyText(teamId, idx, userText){
  var team=teamById[teamId], a=team.agents[idx];
  var low=userText.toLowerCase();
  var tk=state.running.filter(function(x){return x.team===teamId;})[0];
  var pt=state.pending.filter(function(x){return x.team===teamId;})[0];
  var latest=(teamLog[teamId]||[])[0];
  if(/(^|\b)(hi|hello|hey)\b/.test(low))
    return "Hey Director. "+a[0]+" here — I'm "+currentTaskLine(teamId)+". Fire away.";
  if(low.indexOf("status")>-1||low.indexOf("doing")>-1||low.indexOf("working on")>-1)
    return "Right now I'm "+currentTaskLine(teamId)+"."+(latest?" Latest from our floor: "+latest.text+".":"");
  if(low.indexOf("when")>-1||low.indexOf("eta")>-1||low.indexOf("how long")>-1)
    return tk ? "\u201C"+tk.title+"\u201D is at "+Math.round(tk.prog)+"% — at this pace it lands in the next few minutes, then it comes to you for the OK." : "Nothing of mine is mid-flight right now — give me a brief and I start immediately.";
  if(low.indexOf("approve")>-1)
    return pt ? "\u201C"+pt.title+"\u201D is sitting under WAITING FOR YOU on the board — one tap on Approve and we ship it." : "Nothing from the "+team.name+" team is waiting on approval right now.";
  if(low.indexOf("thank")>-1)
    return "Anytime, Director. That's what the "+team.name+" desk is for.";
  var pool=[
    "On it. I'll fold that into "+(tk?"\u201C"+tk.title+"\u201D":"my next piece")+" and keep the board updated.",
    "Copy that, Director. Pulling the context from the Data Center now — I'll report back on the feed.",
    "Got it. "+(latest?"Last thing our team logged: "+latest.text+". ":"")+"I'll take it from here.",
    "Understood. If it needs a hand from another team, I'll send a paper plane their way.",
    "Done thinking about it — doing it. Watch the "+team.name+" office, I'm at the desk."
  ];
  return pick(pool);
}
function sendChat(){
  if(!chatCtx) return;
  var inp=$("chatInput"), text=inp.value.trim(); if(!text) return;
  var key=chatKey(chatCtx.teamId, chatCtx.idx), teamId=chatCtx.teamId, idx=chatCtx.idx;
  pushChat(key, "me", text);
  inp.value="";
  var wrap=$("chatMsgs");
  var typing=document.createElement("div");
  typing.className="msg agent typing"; typing.textContent="···";
  wrap.appendChild(typing); wrap.scrollTop=wrap.scrollHeight;
  if(chatTimer) clearTimeout(chatTimer);
  chatTimer=setTimeout(function(){
    if(typing.parentNode) typing.parentNode.removeChild(typing);
    pushChat(key, "agent", agentReplyText(teamId, idx, text));
    refreshChatHead();
  }, 800+Math.random()*700);
}
$("chatClose").addEventListener("click", closeChat);
$("chatForm").addEventListener("submit", function(e){ e.preventDefault(); sendChat(); });
$("chatSteps").addEventListener("click", function(){
  if(!chatCtx) return;
  var t=chatCtx.teamId, i=chatCtx.idx;
  closeChat(); renderAgentDetail(t, i);
});

/* ================= SEARCH ================= */
var sIn=$("searchInput");
$("searchBtn").addEventListener("click", function(){ sIn.focus(); });
sIn.addEventListener("input", function(){
  var q=sIn.value.trim().toLowerCase();
  TEAMS.forEach(function(t){
    var match = !q || t.name.toLowerCase().indexOf(q)>-1 || t.agents.some(function(a){ return a[0].toLowerCase().indexOf(q)>-1; });
    if(typeof setTeamDim==="function") setTeamDim(t.id, !match);
  });
});
window.addEventListener("keydown", function(e){
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); sIn.focus(); }
});
sIn.addEventListener("keydown", function(e){
  if(e.key==="Enter"){
    var t=TEAMS.filter(function(x){ return x.name.toLowerCase().indexOf(sIn.value.trim().toLowerCase())>-1; })[0];
    if(t){ renderTeamDetail(t.id); if(typeof focusTeam==="function") focusTeam(t.id); }
  }
});

/* ================= SHIFT TOGGLE ================= */
$("shiftToggle").addEventListener("click", function(){
  state.night=!state.night;
  document.body.classList.toggle("night", state.night);
  $("shiftLabel").textContent = state.night ? "DAY SHIFT" : "NIGHT SHIFT";
  $("shiftIcon").innerHTML = state.night
    ? '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/>'
    : '<path d="M20 13.2A8.5 8.5 0 0 1 10.8 4 8.5 8.5 0 1 0 20 13.2Z"/>';
  $("shiftInd").textContent = state.night ? "NIGHT SHIFT · LAMPS ON, FLOOR STILL LIVE" : "DAY SHIFT · THE WHOLE OFFICE, LIVE";
  if(typeof applyShift==="function") applyShift(state.night);
  toast(state.night ? "Night shift — lamps on, screens glowing amber." : "Day shift — bright and cozy again.");
});

/* ================= 3D OFFICE FLOOR (Agent-Floor style) ================= */
var floorOK = typeof THREE!=="undefined";
var teamRT = {}, labels = [], planesAnim = [], subAgents = [];
var scene, camera, renderer, wrapEl, raycaster;
var camTheta=0.785, camPhi=0.955, viewSize=54, camTarget=null, userMoved=false;
var hemiLight, dirLight, lampLights=[], dcDotMat, monitorTex, cabinBeacon, directorChar, dcRing, dcCore, beamMats=[], dcSpin, dcOrbit, beamDots=[], beamBoost={}, wanderers=[], rackFaces=[], rackBlinkAt=0, dcLabelObj=null, cabinLabelObj=null, bayLabelObj=null;
var tintables=[]; /* {mat, day, night} */
var STATUS_COLORS={ working:"#3ED97E", thinking:"#F5B53F", waiting:"#F5A623", error:"#FF6B5E", done:"#3ED97E", idle:"#5B6B8C", walking:"#5B9BD5", seated:"#E8C37A" };
var SKINS=["#F2C29B","#E0AC82","#C68863","#A96B4F","#8A5138"];
var HAIRS=["#241A12","#3B2A1A","#101010","#5A3A22","#6E6E6E"];

function regTint(mat, dayHex, nightHex){ tintables.push({ mat:mat, day:new THREE.Color(dayHex), night:new THREE.Color(nightHex) }); return mat; }
function stdMat(color, opts){ var m=new THREE.MeshStandardMaterial(Object.assign({ color:color, roughness:.85, metalness:.02 }, opts||{})); return m; }
function box(w,h,d,mat,x,y,z,parent,shadow){
  var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
  m.position.set(x,y,z); if(shadow!==false){ m.castShadow=true; m.receiveShadow=true; }
  (parent||scene).add(m); return m;
}
function makeLabel(cls, html, getPos, base){
  var el=document.createElement("div");
  el.className=cls; if(html!=null) el.innerHTML=html;
  el.style.display="none";
  $("labelLayer").appendChild(el);
  var L={ el:el, getPos:getPos, base:base||"translate(-50%,-100%)" };
  labels.push(L); return L;
}
var RING_ANG={ research:3.927, scripts:4.712, social:5.498, creative:0, analytics:0.785, community:1.571, design:2.356, publishing:3.142 };
var CABIN_ANG=0.96, CABIN_R=30;
function officeCenter(t){ var a=RING_ANG[t.id]; return { x:21*Math.cos(a), z:21*Math.sin(a) }; }
function cabinWorld(){ return { x:CABIN_R*Math.cos(CABIN_ANG), z:CABIN_R*Math.sin(CABIN_ANG) }; }
function anchorPos(teamId){
  if(teamId==="cabin"){ var cw=cabinWorld(); return new THREE.Vector3(cw.x,5.6,cw.z); }
  if(teamId==="dc") return new THREE.Vector3(0,5.4,0);
  var rt=teamRT[teamId]; if(!rt) return new THREE.Vector3(0,4,0);
  return new THREE.Vector3(rt.cx,5.2,rt.cz);
}

/* ---------- floor integration hooks (called by the sim engine) ---------- */
function updateFloor(){
  if(!floorOK) return;
  TEAMS.forEach(function(t){
    var rt=teamRT[t.id]; if(!rt) return;
    var active=!!activeTeams()[t.id], waiting=!!pendingTeams()[t.id];
    var sig=(active?"A":"-")+(waiting?"W":"-")+"|"+(state.running.filter(function(x){return x.team===t.id;})[0]||{title:""}).title+"|"+(state.pending.filter(function(x){return x.team===t.id;})[0]||{title:""}).title;
    if(sig!==rt.boardSig){ rt.boardSig=sig; drawBoard(rt); }
    var wantMap = active||waiting;
    if(rt.screenOn!==wantMap){
      rt.screenOn=wantMap;
      rt.screenMat.map = wantMap ? monitorTex : null;
      rt.screenMat.color.set(wantMap?0xffffff:0x46545C);
      rt.screenMat.needsUpdate=true;
    }
    /* the plate carries the live status line — no separate bubble (they collided) */
    rt.bubbleEl.style.display="none";
    if(rt.cardCountEl){
      var rc=state.running.filter(function(x){return x.team===t.id;}).length;
      var cntTxt=t.count+" agents · "+rc+" running";
      if(rt.cardCountEl.textContent!==cntTxt) rt.cardCountEl.textContent=cntTxt;
      var sl = waiting ? "✋ Hand up — needs your OK"
        : active ? state.running.filter(function(x){return x.team===t.id;})[0].title
        : ((teamLog[t.id]||[])[0] ? teamLog[t.id][0].text : "Standing by for the next brief");
      if(rt.cardStatusEl.textContent!==sl) rt.cardStatusEl.textContent=sl;
    }
    rt.handEl.style.display = waiting ? "" : "none";
  });
  var dn=document.getElementById("dcNotes");
  if(dn) dn.textContent=(112+state.doneToday)+" NOTES";
}
function updateCabinBadge(){
  var n=state.pending.length;
  var el=$("cabinHandCount");
  if(el){ el.textContent="✋ "+n+" WAITING"; el.classList.toggle("show", n>0); }
  if(cabinBeacon) cabinBeacon.visible = n>0;
}
function agentStateOf(teamId, idx){
  var rt=teamRT[teamId]; if(!rt||!rt.agents[idx]) return "idle";
  var a=rt.agents[idx], now=performance.now();
  if(a.walk) return "walking";
  if(rt.errorUntil>now) return "error";
  if(rt.doneUntil>now) return "done";
  var lead = idx===0;
  if(pendingTeams()[teamId]) return lead ? "waiting" : "idle";
  if(activeTeams()[teamId]){
    if(lead) return "working";
    return (idx%3===2) ? "thinking" : "working";
  }
  return "idle";
}
function teamWalkIn(teamId){
  if(!floorOK) return;
  var rt=teamRT[teamId]; if(!rt) return;
  rt.agents.forEach(function(a, i){
    if(!a.walk) startWalk(a, rt, i*280);
  });
}
function teamDoneFlash(teamId){ var rt=teamRT[teamId]; if(rt){ rt.doneUntil=performance.now()+2400; rt.doneStart=performance.now(); rt.flashUntil=performance.now()+1200; } }
function teamErrorFlash(teamId){ var rt=teamRT[teamId]; if(rt){ rt.errorUntil=performance.now()+2600; } }
function setTeamDim(teamId, dim){
  var rt=teamRT[teamId]; if(!rt) return;
  rt.dimPlane.visible=dim;
  rt.doorLabelEl.style.opacity = dim ? ".25" : "";
  if(dim) rt.bubbleEl.style.display="none";
}
function focusTeam(teamId){
  var rt=teamRT[teamId]; if(!rt||!camTarget) return;
  camTarget.set(rt.cx*0.55, 0, rt.cz*0.55);
  viewSize=42; updateCamera();
}
function frameAll(){
  if(!camTarget||!wrapEl) return;
  userMoved=false;
  var aspect=(wrapEl.clientWidth||800)/Math.max(1,(wrapEl.clientHeight||500));
  camTarget.set(0,0, aspect<0.8 ? 4.5 : 1.5); camTheta=0.785;
  camPhi = aspect<0.8 ? 0.72 : 0.955;
  viewSize=Math.max(56, Math.min(150, 84/Math.max(0.6,aspect)));
  updateCamera();
}

/* ---------- walking ---------- */
function buildPath(rt, home){
  var pts=[ new THREE.Vector3(0,0.06,5.4), new THREE.Vector3(0,0.06,3.2) ];
  if(Math.abs(home.x)>0.4) pts.push(new THREE.Vector3(home.x,0.06,3.2));
  pts.push(home.clone());
  return pts;
}
function startWalk(a, rt, delay){
  a.walk={ pts:buildPath(rt, a.home), seg:0, delay:delay||0, started:performance.now() };
  a.g.position.copy(a.walk.pts[0]);
  a.g.visible=true;
}
function updateWalk(a, dt, now){
  var w=a.walk; if(!w) return;
  if(now-w.started < w.delay){ a.g.visible=false; return; }
  a.g.visible=true;
  var target=w.pts[w.seg+1];
  if(!target){ a.walk=null; a.g.position.copy(a.home); a.g.rotation.y=a.homeRotY; return; }
  var dx=target.x-a.g.position.x, dz=target.z-a.g.position.z;
  var dist=Math.sqrt(dx*dx+dz*dz), step=8.5*dt;
  if(dist<=step){
    a.g.position.x=target.x; a.g.position.z=target.z; w.seg++;
    if(w.seg>=w.pts.length-1){ a.walk=null; a.g.position.copy(a.home); a.g.rotation.y=a.homeRotY; }
  } else {
    a.g.position.x+=dx/dist*step; a.g.position.z+=dz/dist*step;
    a.g.rotation.y=Math.atan2(dx,dz);
  }
}

/* ---------- characters ---------- */
var torsoGeo=null, headGeo=null, hairGeo=null, armGeo=null;
function ensureGeos(){
  if(torsoGeo) return;
  torsoGeo=new THREE.CylinderGeometry(0.28,0.34,0.66,10);
  headGeo=new THREE.SphereGeometry(0.3,16,12);
  hairGeo=new THREE.SphereGeometry(0.315,16,10,0,Math.PI*2,0,Math.PI*0.55);
  armGeo=new THREE.CylinderGeometry(0.07,0.065,0.52,8);
}
function makeCharacter(colorHex, skin, hair, name){
  ensureGeos();
  var g=new THREE.Group();
  var rig=new THREE.Group(); g.add(rig);
  var torso=new THREE.Mesh(torsoGeo, stdMat(new THREE.Color(colorHex),{roughness:.65}));
  torso.position.y=0.97; torso.castShadow=true; rig.add(torso);
  var pantsMat=stdMat(0x2A3350,{roughness:.9});
  var legGeo=new THREE.CylinderGeometry(0.075,0.07,0.36,8);
  function makeLeg(side){
    var pivot=new THREE.Group(); pivot.position.set(0.12*side,0.66,0);
    var lm=new THREE.Mesh(legGeo, pantsMat); lm.position.y=-0.18; lm.castShadow=true;
    pivot.add(lm); rig.add(pivot); return pivot;
  }
  var legL=makeLeg(-1), legR=makeLeg(1);
  var head=new THREE.Mesh(headGeo, stdMat(new THREE.Color(skin),{roughness:.55}));
  head.position.y=1.6; head.castShadow=true; rig.add(head);
  var faceMat=new THREE.MeshBasicMaterial({ color:0x191411 });
  [-0.11,0.11].forEach(function(off){
    var eye=new THREE.Mesh(new THREE.SphereGeometry(0.038,8,8), faceMat);
    eye.position.set(off,0.03,0.27); head.add(eye);
  });
  var smile=new THREE.Mesh(new THREE.TorusGeometry(0.085,0.016,6,14,Math.PI), faceMat);
  smile.position.set(0,-0.05,0.26); smile.rotation.z=Math.PI; head.add(smile);
  var hairM=new THREE.Mesh(hairGeo, stdMat(new THREE.Color(hair),{roughness:.9}));
  hairM.position.y=1.65; hairM.castShadow=true; rig.add(hairM);
  function arm(sideSign){
    var pivot=new THREE.Group(); pivot.position.set(0.36*sideSign,1.22,0.02);
    var mm2=new THREE.Mesh(armGeo, torso.material); mm2.position.y=-0.22; mm2.castShadow=true;
    pivot.add(mm2); rig.add(pivot); return pivot;
  }
  var contactShadow=new THREE.Mesh(new THREE.CircleGeometry(0.46,20), new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.25, depthWrite:false }));
  contactShadow.rotation.x=-Math.PI/2; contactShadow.position.y=0.02; g.add(contactShadow);
  var dotMat=new THREE.MeshBasicMaterial({ color:0x8A97B5 });
  var dot=new THREE.Mesh(new THREE.SphereGeometry(0.085,10,8), dotMat);
  dot.position.set(0,2.16,0); g.add(dot);
  return { g:g, rig:rig, head:head, armR:arm(1), armL:arm(-1), legL:legL, legR:legR, dotMat:dotMat, home:null, homeRotY:0, walk:null, phase:Math.random()*6.28, name:name };
}
function animateCharacter(a, st, t, now){
  var rig=a.rig, head=a.head, armR=a.armR, armL=a.armL;
  rig.rotation.x=0; rig.rotation.z=0; rig.position.y=0;
  head.rotation.set(0,0,0);
  var seatedPose = st!=="walking";
  if(a.legL && a.legR){
    if(seatedPose){ a.legL.rotation.x=-1.45; a.legR.rotation.x=-1.45; }
    else { a.legL.rotation.x=Math.sin(t*9+a.phase)*0.55; a.legR.rotation.x=-Math.sin(t*9+a.phase)*0.55; }
  }
  if(seatedPose) rig.position.y=-0.18 + Math.sin(t*1.6+a.phase)*0.008;
  if(st==="working") rig.rotation.z=Math.sin(t*2.2+a.phase)*0.03;
  armR.rotation.set(-0.3,0,0.12); armL.rotation.set(-0.3,0,-0.12);
  if(st==="working"){
    rig.position.y=-0.18+Math.abs(Math.sin(t*10+a.phase))*0.03;
    armR.rotation.x=-1.15+Math.sin(t*11+a.phase)*0.16;
    armL.rotation.x=-1.15+Math.cos(t*10.3+a.phase)*0.16;
    head.rotation.x=0.16;
  } else if(st==="thinking"){
    armR.rotation.x=-2.35; armR.rotation.z=-0.35;
    armL.rotation.x=-0.5;
    head.rotation.z=0.13; head.rotation.x=0.04;
  } else if(st==="waiting"){
    armR.rotation.z=2.55+Math.sin(t*7+a.phase)*0.38; armR.rotation.x=-0.15;
    armL.rotation.x=-0.4;
    head.rotation.x=-0.06;
    rig.position.y=-0.18+Math.abs(Math.sin(t*3.2+a.phase))*0.02;
  } else if(st==="error"){
    head.rotation.z=Math.sin(t*22)*0.17;
    armR.rotation.x=-0.5; armL.rotation.x=-0.5;
  } else if(st==="done"){
    var p=Math.min(1,(now-(a.doneRef||now))/650);
    rig.position.y=-0.18+Math.abs(Math.sin(p*Math.PI))*0.3*(1-p*0.4);
    armR.rotation.z=2.4; armL.rotation.z=-2.4;
  } else if(st==="walking"){
    rig.position.y=Math.abs(Math.sin(t*9+a.phase))*0.06;
    armR.rotation.x=Math.sin(t*9+a.phase)*0.55;
    armL.rotation.x=-Math.sin(t*9+a.phase)*0.55;
  } else if(st==="seated"){
    armR.rotation.x=-1.0+Math.sin(t*8+a.phase)*0.1;
    armL.rotation.x=-1.0+Math.cos(t*7.4+a.phase)*0.1;
    head.rotation.x=0.1;
  } else { /* idle — leaning back, screensaver */
    rig.rotation.x=-0.08;
    armR.rotation.x=-0.18; armL.rotation.x=-0.18;
    head.rotation.x=-0.04; head.rotation.y=Math.sin(t*0.5+a.phase)*0.14;
  }
}

/* ---------- whiteboards ---------- */
function drawBoard(rt){
  var ctx=rt.boardCtx, W=512, H=288;
  ctx.fillStyle="#EDF2FB"; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle="#8FA8D8"; ctx.lineWidth=6; ctx.strokeRect(3,3,W-6,H-6);
  ctx.fillStyle="#3D5A99"; ctx.font="700 21px Manrope, sans-serif";
  ctx.fillText(rt.def.name.toUpperCase()+" — ON THE BOARD", 22, 38);
  var task=state.running.filter(function(x){return x.team===rt.def.id;})[0];
  var pend=state.pending.filter(function(x){return x.team===rt.def.id;})[0];
  ctx.fillStyle="#16233F"; ctx.font="600 27px Manrope, sans-serif";
  var line = task ? task.title : pend ? "Done — waiting for the Director" : "Standing by for the next brief";
  var words=line.split(" "), lines=[], cur="";
  words.forEach(function(w){ if((cur+" "+w).length>30){ lines.push(cur); cur=w; } else cur=cur?cur+" "+w:w; });
  if(cur) lines.push(cur);
  lines.slice(0,3).forEach(function(l,i){ ctx.fillText(l, 22, 84+i*36); });
  if(task){
    ctx.fillStyle="#C9D6EE"; ctx.fillRect(22,196,300,14);
    ctx.fillStyle=rt.def.color; ctx.fillRect(22,196,300*task.prog/100,14);
    ctx.fillStyle="#5A6B8C"; ctx.font="600 19px Manrope, sans-serif";
    ctx.fillText(Math.round(task.prog)+"%", 336, 210);
  }
  /* status magnets */
  rt.def.agents.forEach(function(ag, i){
    var st=agentStateOf(rt.def.id, i);
    var x=44+i*52, y=248;
    ctx.beginPath(); ctx.arc(x,y,17,0,6.283);
    ctx.fillStyle=STATUS_COLORS[st]||"#B9AE97"; ctx.fill();
    ctx.strokeStyle="#fff"; ctx.lineWidth=3; ctx.stroke();
    ctx.fillStyle="#fff"; ctx.font="700 15px Manrope, sans-serif"; ctx.textAlign="center";
    ctx.fillText(ag[0][0], x, y+5); ctx.textAlign="left";
  });
  rt.boardTex.needsUpdate=true;
}

/* ---------- paper planes ---------- */
var planeGeo=null;
function getPlaneGeo(){
  if(planeGeo) return planeGeo;
  var verts=new Float32Array([
    0,0,0.95,  -0.55,0.14,-0.7,  0,0.3,-0.42,
    0,0,0.95,   0,0.3,-0.42,     0.55,0.14,-0.7,
    0,0,0.95,   0,-0.08,-0.6,   -0.55,0.14,-0.7,
    0,0,0.95,   0.55,0.14,-0.7,  0,-0.08,-0.6
  ]);
  planeGeo=new THREE.BufferGeometry();
  planeGeo.setAttribute("position", new THREE.BufferAttribute(verts,3));
  planeGeo.computeVertexNormals();
  return planeGeo;
}
function flyPlane(fromKey, toKey){
  if(!floorOK || fromKey===toKey) return;
  var fromTeam=teamById[fromKey];
  var color = fromTeam ? fromTeam.color : "#D4AF6A";
  var p0=anchorPos(fromKey), p2=anchorPos(toKey);
  var p1=p0.clone().add(p2).multiplyScalar(0.5); p1.y=Math.max(p0.y,p2.y)+4.5;
  beamBoost[fromKey]=1; beamBoost[toKey]=1;
  var mesh=new THREE.Mesh(getPlaneGeo(), new THREE.MeshStandardMaterial({ color:new THREE.Color(color), side:THREE.DoubleSide, roughness:.5, emissive:new THREE.Color(color), emissiveIntensity:.25 }));
  mesh.scale.setScalar(1.5); mesh.castShadow=true;
  scene.add(mesh);
  planesAnim.push({ mesh:mesh, p0:p0, p1:p1, p2:p2, t:0, dur:1.5, target:toKey });
}
function updatePlanes(dt){
  for(var i=planesAnim.length-1;i>=0;i--){
    var p=planesAnim[i]; p.t+=dt/p.dur;
    if(p.t>=1){
      scene.remove(p.mesh);
      var rt=teamRT[p.target]; if(rt) rt.flashUntil=performance.now()+900;
      planesAnim.splice(i,1); continue;
    }
    var a=p.p0.clone().multiplyScalar((1-p.t)*(1-p.t)).add(p.p1.clone().multiplyScalar(2*(1-p.t)*p.t)).add(p.p2.clone().multiplyScalar(p.t*p.t));
    var b=p.p0.clone().multiplyScalar((1-Math.min(1,p.t+0.03))*(1-Math.min(1,p.t+0.03))).add(p.p1.clone().multiplyScalar(2*(1-Math.min(1,p.t+0.03))*Math.min(1,p.t+0.03))).add(p.p2.clone().multiplyScalar(Math.min(1,p.t+0.03)*Math.min(1,p.t+0.03)));
    p.mesh.position.copy(a);
    p.mesh.lookAt(b); p.mesh.rotateX(Math.PI/2);
  }
}

/* ---------- sub-agents (order flow) ---------- */
function spawnSubs(){
  if(!floorOK) return;
  var rt=teamRT.creative; if(!rt||!rt.group) return;
  var names=["Anaya · Cutter","Neil · Captioner","Riya · Thumbnailer"];
  var homes=[[-1.7,2.9],[0,3.5],[1.7,2.9]];
  names.forEach(function(nm, i){
    var c=makeCharacter("#9B7EDE", SKINS[i%SKINS.length], HAIRS[(i+2)%HAIRS.length], nm);
    var home=new THREE.Vector3(homes[i][0], 0.06, homes[i][1]);
    c.home=home; c.homeRotY=0;
    c.g.position.copy(home);
    rt.group.add(c.g);
    c.rt=rt;
    startWalk(c, rt, i*350);
    subAgents.push(c);
  });
}
function subReportBack(){
  subAgents.forEach(function(c, i){
    setTimeout(function(){
      var pts=buildPath(c.rt, c.home).slice().reverse();
      c.walk={ pts:pts, seg:0, delay:0, started:performance.now(), out:true };
      c.home=pts[pts.length-1];
    }, i*300);
  });
  setTimeout(function(){
    subAgents.forEach(function(c){ if(c.g.parent) c.g.parent.remove(c.g); });
    subAgents=[];
  }, 7000);
}

/* ---------- scene build ---------- */
function buildScene(){
  wrapEl=$("floorWrap");
  renderer=new THREE.WebGLRenderer({ antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  wrapEl.insertBefore(renderer.domElement, $("labelLayer"));
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x0A1428);
  camera=new THREE.OrthographicCamera(-1,1,1,-1,1,400);
  camTarget=new THREE.Vector3(0,0,1.5);
  raycaster=new THREE.Raycaster();

  hemiLight=new THREE.HemisphereLight(0xBFD6FF, 0x1B2745, 0.85); scene.add(hemiLight);
  dirLight=new THREE.DirectionalLight(0xDCE8FF, 0.75);
  dirLight.position.set(35,55,25); dirLight.castShadow=true;
  dirLight.shadow.mapSize.set(2048,2048);
  dirLight.shadow.camera.left=-58; dirLight.shadow.camera.right=58;
  dirLight.shadow.camera.top=58; dirLight.shadow.camera.bottom=-58;
  dirLight.shadow.bias=-0.0006;
  scene.add(dirLight);

  /* deep-space backdrop: star field + void disc */
  (function(){
    var n=420, pos=new Float32Array(n*3);
    for(var i=0;i<n;i++){
      var r=150+Math.random()*90, th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI*0.9;
      pos[i*3]=r*Math.sin(ph)*Math.cos(th); pos[i*3+1]=Math.abs(r*Math.cos(ph))*0.7-14; pos[i*3+2]=r*Math.sin(ph)*Math.sin(th);
    }
    var sg=new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(pos,3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color:0xCFE6FF, size:1.7, sizeAttenuation:false, transparent:true, opacity:0.7 })));
    var disc=new THREE.Mesh(new THREE.CircleGeometry(280, 48), stdMat(0x0B1730,{roughness:1}));
    disc.rotation.x=-Math.PI/2; disc.position.y=-1.35; scene.add(disc);
  })();

  var goldMat=stdMat(0xC79A3F,{roughness:.4, metalness:.45});
  var woodMat=regTint(stdMat(0xC8A06A,{roughness:.8}), 0xC8A06A, 0x7A5C38);
  var darkWoodMat=regTint(stdMat(0x9A7448,{roughness:.8}), 0x9A7448, 0x5A4228);
  var leafMat=regTint(stdMat(0x2E9A67,{roughness:1}), 0x2E9A67, 0x1D5A40);

  /* monitor texture — shared activity screen */
  (function(){
    var cv=document.createElement("canvas"); cv.width=256; cv.height=160;
    var c2=cv.getContext("2d");
    c2.fillStyle="#20303A"; c2.fillRect(0,0,256,160);
    var cols=["#8FD0A0","#F5D98B","#9FC6E8","#E8E3D5","#D98E6A"];
    for(var r=0;r<9;r++){
      var x=14+((r*37)%3)*16, w=60+((r*53)%150);
      c2.fillStyle=cols[r%cols.length];
      c2.fillRect(x, 14+r*16, w, 6);
    }
    monitorTex=new THREE.CanvasTexture(cv);
    monitorTex.wrapS=monitorTex.wrapT=THREE.RepeatWrapping;
  })();

  /* ----- team islands on the ring ----- */
  var DESK_SLOTS=[[0,-3.6],[-3.2,-1.2],[0,-1.2],[3.2,-1.2],[-3.2,1.3],[3.2,1.3]];
  TEAMS.forEach(function(t, ti){
    var c=officeCenter(t), cx=c.x, cz=c.z, ang=RING_ANG[t.id];
    var grp=new THREE.Group();
    grp.position.set(cx,0.55,cz); grp.rotation.y=Math.PI/2-ang;
    scene.add(grp);
    var floorColor=new THREE.Color(t.color).lerp(new THREE.Color(0xFFFFFF), 0.5);
    var floorNight=new THREE.Color(t.color).lerp(new THREE.Color(0x131C33), 0.45);
    var floorMat=stdMat(floorColor,{roughness:.9});
    tintables.push({ mat:floorMat, day:floorColor, night:floorNight });
    var wallColor=new THREE.Color(t.color).lerp(new THREE.Color(0xFFFFFF), 0.16);
    var wallNight=new THREE.Color(t.color).lerp(new THREE.Color(0x131C33), 0.55);
    var wallMat=stdMat(wallColor,{roughness:.85});
    tintables.push({ mat:wallMat, day:wallColor, night:wallNight });
    var base=box(13,1.0,12, stdMat(0x202C4E,{roughness:.9}), 0,-0.57,0, grp, false); base.receiveShadow=true;
    var slab=box(12.4,0.16,11.4, floorMat, 0,0,0, grp, false); slab.receiveShadow=true;
    var glow=new THREE.Mesh(new THREE.CircleGeometry(8.8,32), new THREE.MeshBasicMaterial({ color:new THREE.Color(t.color), transparent:true, opacity:0.26, depthWrite:false }));
    glow.rotation.x=-Math.PI/2; glow.position.set(cx,-0.32,cz); scene.add(glow);
    var dimPlane=new THREE.Mesh(new THREE.PlaneGeometry(12.4,11.4), new THREE.MeshBasicMaterial({ color:0x05080F, transparent:true, opacity:.55, depthWrite:false }));
    dimPlane.rotation.x=-Math.PI/2; dimPlane.position.set(0,0.12,0); dimPlane.visible=false; grp.add(dimPlane);
    /* low walls: back + part-sides, pale trim on top */
    var trimMat=stdMat(0xE8EEF9,{roughness:.5});
    box(12.4,2.1,0.18, wallMat, 0,1.05,-5.6, grp);
    box(12.4,0.14,0.26, trimMat, 0,2.17,-5.6, grp, false);
    box(0.18,2.1,6.0, wallMat, -6.2,1.05,-2.6, grp);
    box(0.18,2.1,6.0, wallMat, 6.2,1.05,-2.6, grp);
    box(0.26,0.14,6.0, trimMat, -6.2,2.17,-2.6, grp, false);
    box(0.26,0.14,6.0, trimMat, 6.2,2.17,-2.6, grp, false);
    /* whiteboard on the back wall */
    var bCan=document.createElement("canvas"); bCan.width=512; bCan.height=288;
    var bTex=new THREE.CanvasTexture(bCan);
    var board=new THREE.Mesh(new THREE.PlaneGeometry(4.8,2.3), new THREE.MeshBasicMaterial({ map:bTex }));
    board.position.set(0,1.45,-5.47); grp.add(board);
    box(5.0,2.5,0.07, darkWoodMat, 0,1.45,-5.53, grp, false);
    var screenMat=new THREE.MeshBasicMaterial({ color:0x46545C });
    var rt={ def:t, cx:cx, cz:cz, group:grp, floorMat:floorMat, dimPlane:dimPlane, screenMat:screenMat,
             boardCtx:bCan.getContext("2d"), boardTex:bTex, boardSig:"", agents:[], screenOn:false,
             flashUntil:0, doneUntil:0, doneStart:0, errorUntil:0 };
    teamRT[t.id]=rt;
    t.agents.forEach(function(a, idx){
      var slot=DESK_SLOTS[idx];
      var dx=slot[0], dz=slot[1];
      /* workstation — desk, chair, monitor standing ON the desk, laptop slab */
      box(2.3,0.1,1.15, woodMat, dx,0.82,dz, grp);
      box(2.1,0.68,0.95, darkWoodMat, dx,0.44,dz, grp, false);
      box(0.62,0.09,0.6, darkWoodMat, dx,0.52,dz-1.02, grp, false);
      box(0.62,0.66,0.09, darkWoodMat, dx,0.92,dz-1.34, grp, false);
      box(0.09,0.48,0.09, darkWoodMat, dx,0.24,dz-1.02, grp, false);
      box(0.07,0.16,0.07, stdMat(0x232A3A), dx,0.95,dz+0.18, grp, false);
      box(1.02,0.6,0.05, stdMat(0x232A3A,{roughness:.4}), dx,1.28,dz+0.18, grp, false);
      var scr=new THREE.Mesh(new THREE.PlaneGeometry(0.94,0.52), screenMat);
      scr.position.set(dx,1.28,dz+0.15); scr.rotation.y=Math.PI; grp.add(scr);
      box(0.72,0.04,0.46, stdMat(0x1B2334,{roughness:.5}), dx,0.89,dz-0.28, grp, false);
      var ch=makeCharacter(t.color, SKINS[(ti+idx)%SKINS.length], HAIRS[(ti*2+idx)%HAIRS.length], a[0]);
      var home=new THREE.Vector3(dx, 0.06, dz-0.95);
      ch.home=home; ch.homeRotY=0;
      ch.g.position.copy(home); ch.g.rotation.y=0;
      ch.doneRef=0;
      grp.add(ch.g);
      ch.g.traverse(function(o){ o.userData.pick={ type:"agent", teamId:t.id, idx:idx }; });
      rt.agents.push(ch);
    });
    /* props: plant + lamp */
    box(0.5,0.6,0.5, darkWoodMat, -5.3,0.36,-4.7, grp, false);
    var bush=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,8), leafMat);
    bush.position.set(-5.3,1.0,-4.7); bush.castShadow=true; grp.add(bush);
    box(0.07,1.7,0.07, stdMat(0x39466B), 5.3,0.9,-4.7, grp, false);
    var shade=new THREE.Mesh(new THREE.SphereGeometry(0.3,10,8), new THREE.MeshBasicMaterial({ color:0xFFE1A0 }));
    shade.position.set(5.3,1.85,-4.7); grp.add(shade);
    if(t.id==="creative"){
      var dpts=[];
      for(var di2=0;di2<=40;di2++){ var da=di2/40*Math.PI*2; dpts.push(new THREE.Vector3(Math.cos(da)*2.3, 0, Math.sin(da)*2.3)); }
      var dring=new THREE.Line(new THREE.BufferGeometry().setFromPoints(dpts),
        new THREE.LineDashedMaterial({ color:0x64D8FF, dashSize:0.45, gapSize:0.3, transparent:true, opacity:0.85 }));
      dring.computeLineDistances();
      dring.position.set(0,0.14,3.4); grp.add(dring);
      [[-1.7,2.9],[0,3.5],[1.7,2.9]].forEach(function(hp){
        box(1.25,0.08,0.66, woodMat, hp[0],0.8,hp[1]+0.62, grp, false);
        box(1.1,0.6,0.5, darkWoodMat, hp[0],0.42,hp[1]+0.62, grp, false);
        box(0.5,0.08,0.48, darkWoodMat, hp[0],0.5,hp[1]-0.42, grp, false);
        box(0.5,0.52,0.08, darkWoodMat, hp[0],0.82,hp[1]-0.68, grp, false);
        box(0.05,0.12,0.05, stdMat(0x232A3A), hp[0],0.9,hp[1]+0.72, grp, false);
        box(0.78,0.44,0.04, stdMat(0x232A3A,{roughness:.4}), hp[0],1.16,hp[1]+0.72, grp, false);
      });
    }
    grp.traverse(function(o){ if(!o.userData.pick) o.userData.pick={ type:"team", teamId:t.id }; });
    /* labels */
    rt.doorLabelEl=makeLabel("lbl", '<span class="lbl-card" style="--pc:'+t.color+'"><span class="lc-top"><span class="sdot"></span><span class="lc-name">'+t.name+'</span></span><span class="lc-mid"><span class="lc-avs">'+t.agents.map(function(a){return "<i>"+a[0][0]+"</i>";}).join("")+'</span><span class="lc-count">'+t.count+' agents · 0 running</span></span><span class="lc-status">Standing by for the next brief</span></span>',
      (function(cx2,cz2,py2){ return function(){ return new THREE.Vector3(cx2, py2, cz2); }; })(cx+Math.cos(ang)*(Math.sin(ang)>0.5?4.9:3.4), cz+Math.sin(ang)*(Math.sin(ang)>0.5?4.9:3.4), Math.sin(ang)>0.5?6.1:5.3)).el.firstChild;
    rt.plateLabel=labels[labels.length-1];
    rt.cardCountEl=rt.doorLabelEl.querySelector(".lc-count");
    rt.cardStatusEl=rt.doorLabelEl.querySelector(".lc-status");
    labels[labels.length-1].mobileDy = cz<-8 ? -14 : cz>8 ? 18 : 0;
    labels[labels.length-1].el.style.display="";
    makeLabel("lbl", null, (function(rt2){ return function(){ var a2=RING_ANG[rt2.def.id]; var nr2=Math.sin(a2)>0.5; return nr2 ? new THREE.Vector3(rt2.cx*0.84, 4.4, rt2.cz*0.84) : new THREE.Vector3(rt2.cx*0.78, 6.3, rt2.cz*0.78); }; })(rt));
    rt.bubbleEl=labels[labels.length-1].el;
    rt.bubbleEl.className="lbl lbl-bubble"; rt.bubbleEl.style.setProperty("--pc", t.color); rt.bubbleEl.style.display="none";
    rt.bubbleLabel=labels[labels.length-1];
    labels[labels.length-1].base="translate(-50%,-100%)";
    rt.handEl=makeLabel("lbl", '<span class="lbl-badge hand">✋</span>',
      (function(rt2){ return function(){ var a=rt2.agents[0]; return a ? a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,2.85,0)) : new THREE.Vector3(rt2.cx,3,rt2.cz); }; })(rt), "translate(-50%,-50%)").el;
    rt.handEl.style.display="none";
    rt.errEl=makeLabel("lbl", '<span class="lbl-badge err">!</span>',
      (function(rt2){ return function(){ var a=rt2.agents[0]; return a ? a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,2.85,0)) : new THREE.Vector3(rt2.cx,3,rt2.cz); }; })(rt), "translate(-50%,-50%)").el;
    rt.doneEl=makeLabel("lbl", '<span class="lbl-badge done">✓</span>',
      (function(rt2){ return function(){ var a=rt2.agents[0]; return a ? a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,2.85,0)) : new THREE.Vector3(rt2.cx,3,rt2.cz); }; })(rt), "translate(-50%,-50%)").el;
    rt.thinkEl=makeLabel("lbl", '<span class="lbl-think">···</span>',
      (function(rt2){ return function(){
        for(var i=0;i<rt2.agents.length;i++){ if(agentStateOf(rt2.def.id,i)==="thinking") return rt2.agents[i].g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,2.6,0)); }
        return new THREE.Vector3(rt2.cx,-10,rt2.cz);
      }; })(rt), "translate(-50%,-100%)").el;
    rt.handLabel=labels[labels.length-4]; rt.errLabel=labels[labels.length-3]; rt.doneLabel=labels[labels.length-2]; rt.thinkLabel=labels[labels.length-1];
    var lead=t.agents[0];
    makeLabel("lbl", '<span class="lbl-lead" style="--pc:'+t.color+'">'+lead[0]+' <em>· '+lead[1]+' · Lead</em></span>',
      (function(rt2){ return function(){ var a=rt2.agents[0]; return a ? a.g.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,2.35,0)) : new THREE.Vector3(rt2.cx,2.4,rt2.cz); }; })(rt));
    labels[labels.length-1].el.style.display="";
    (function(lblEl, tid){ lblEl.style.pointerEvents="auto"; lblEl.style.cursor="pointer"; lblEl.title="Chat with the team lead"; lblEl.addEventListener("click", function(){ openChat(tid, 0); }); })(labels[labels.length-1].el, t.id);
    drawBoard(rt);
  });

  /* ----- Data Center core ----- */
  (function(){
    var dc=new THREE.Group(); scene.add(dc);
    var plat=new THREE.Mesh(new THREE.CylinderGeometry(8.2,8.8,0.5,40), stdMat(0x14264A,{roughness:.7}));
    plat.position.y=-0.25; plat.receiveShadow=true; dc.add(plat);
    var platRing=new THREE.Mesh(new THREE.TorusGeometry(8.2,0.07,8,64), new THREE.MeshBasicMaterial({ color:0x64D8FF }));
    platRing.rotation.x=Math.PI/2; platRing.position.y=0.02; dc.add(platRing);
    /* server hall — two aisles of tall racks with blinking status lights */
    var hallFloor=box(10.4,0.18,7.6, stdMat(0x0E1730,{roughness:.6}), 0,0.09,0, dc, false); hallFloor.receiveShadow=true;
    var underGlow=new THREE.Mesh(new THREE.CircleGeometry(7.4,36), new THREE.MeshBasicMaterial({ color:0x2E7CF6, transparent:true, opacity:0.16, depthWrite:false }));
    underGlow.rotation.x=-Math.PI/2; underGlow.position.y=0.06; dc.add(underGlow);
    function rackFace(seed){
      var cv=document.createElement("canvas"); cv.width=64; cv.height=160;
      var g2=cv.getContext("2d");
      function draw(){
        g2.fillStyle="#0D1526"; g2.fillRect(0,0,64,160);
        g2.fillStyle="#131F3A"; g2.fillRect(5,5,54,150);
        for(var r2=0;r2<12;r2++){
          var y=10+r2*12.5;
          g2.fillStyle="#0A1120"; g2.fillRect(8,y,48,9);
          for(var d2=0;d2<4;d2++){
            if(Math.random()<0.24) continue;
            g2.fillStyle=["#3ED97E","#64D8FF","#F5A623","#3ED97E"][Math.floor(Math.random()*4)];
            g2.globalAlpha=0.45+Math.random()*0.55;
            g2.fillRect(11+d2*7, y+2.5, 4, 4);
          }
          g2.globalAlpha=1;
          g2.fillStyle="#22345E"; g2.fillRect(42,y+3,11,2.5);
        }
      }
      draw();
      var tex=new THREE.CanvasTexture(cv);
      var mat=new THREE.MeshBasicMaterial({ map:tex });
      rackFaces.push({ ctx:g2, tex:tex, draw:draw, mat:mat, seed:seed, phase:Math.random()*6.28, speed:1.2+Math.random()*1.6 });
      return mat;
    }
    var cabinetMat=stdMat(0x182238,{roughness:.45,metalness:.25});
    [-2.45,2.45].forEach(function(rz, ri){
      for(var rx=-4.4; rx<=4.41; rx+=2.2){
        var rack=box(1.8,3.6,1.05, cabinetMat, rx,1.98,rz, dc);
        rack.castShadow=true;
        var face=new THREE.Mesh(new THREE.PlaneGeometry(1.62,3.35), rackFace(rx*3+ri*7));
        face.position.set(rx,1.98, rz + (rz<0?-0.54:0.54));
        if(rz<0) face.rotation.y=Math.PI;
        dc.add(face);
        box(1.86,0.1,1.11, stdMat(0x232F52,{roughness:.4}), rx,3.83,rz, dc, false);
      }
    });
    /* glass sheen cage around the server block */
    var glass=new THREE.Mesh(new THREE.BoxGeometry(11.2,4.1,7.9), new THREE.MeshBasicMaterial({ color:0x9BD8FF, transparent:true, opacity:0.045, depthWrite:false }));
    glass.position.y=2.05; dc.add(glass);
    var cage=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(11.2,4.1,7.9)), new THREE.LineBasicMaterial({ color:0x64D8FF, transparent:true, opacity:0.22 }));
    cage.position.y=2.05; dc.add(cage);
    var dcGlow=new THREE.PointLight(0x64B8FF, 1.0, 34, 1.8); dcGlow.position.set(0,3.4,0); dc.add(dcGlow);
    TEAMS.forEach(function(tm2){
      var c2=officeCenter(tm2);
      var bg2=new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(0,3.9,0), new THREE.Vector3(c2.x,2.6,c2.z) ]);
      var bm2=new THREE.LineBasicMaterial({ color:new THREE.Color(tm2.color), transparent:true, opacity:0.35 });
      scene.add(new THREE.Line(bg2, bm2)); beamMats.push(bm2);
      var dot=new THREE.Mesh(new THREE.SphereGeometry(0.15,8,8), new THREE.MeshBasicMaterial({ color:new THREE.Color(tm2.color) }));
      scene.add(dot); beamDots.push({ m:dot, team:tm2 });
    });
    /* glowing ground trails: ring path + spokes */
    var ringPts=[];
    for(var ti3=0;ti3<=72;ti3++){ var aa=ti3/72*Math.PI*2; ringPts.push(new THREE.Vector3(Math.cos(aa)*21,0.03,Math.sin(aa)*21)); }
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color:0x64D8FF, transparent:true, opacity:0.13 })));
    TEAMS.forEach(function(tm3){
      var c3=officeCenter(tm3);
      var sp=new THREE.BufferGeometry().setFromPoints([ new THREE.Vector3(c3.x*0.42,0.03,c3.z*0.42), new THREE.Vector3(c3.x*0.68,0.03,c3.z*0.68) ]);
      scene.add(new THREE.Line(sp, new THREE.LineBasicMaterial({ color:new THREE.Color(tm3.color), transparent:true, opacity:0.3 })));
    });
    dc.traverse(function(o){ o.userData.pick={ type:"dc" }; });
    makeLabel("lbl", '<span class="lbl-dc">DATA CENTER<small id="dcNotes">159 NOTES</small></span>', function(){ return new THREE.Vector3(0,5.6,0); });
    dcLabelObj=labels[labels.length-1];
    labels[labels.length-1].el.style.display="";
    labels[labels.length-1].mobileDy=-24;
  })();

  /* ----- Sub-Agent Bay (inner ring pad, near Creative) ----- */
  (function(){
    var bx=13.5*Math.cos(-0.35), bz=13.5*Math.sin(-0.35);
    var bay=new THREE.Group(); bay.position.set(bx,0.1,bz); scene.add(bay);
    var pad=new THREE.Mesh(new THREE.CircleGeometry(2.7,28), regTint(stdMat(0x27385C,{roughness:.9}), 0x27385C, 0x1A2742));
    pad.rotation.x=-Math.PI/2; pad.receiveShadow=true; bay.add(pad);
    var edge=new THREE.Mesh(new THREE.RingGeometry(2.45,2.68,40), new THREE.MeshBasicMaterial({ color:0x64D8FF, transparent:true, opacity:.55, side:THREE.DoubleSide }));
    edge.rotation.x=-Math.PI/2; edge.position.y=0.02; bay.add(edge);
    bay.traverse(function(o){ o.userData.pick={ type:"room", name:"Sub-Agent Bay", desc:"Where extra hands spin up on the Director's word — a typed order sends them in three at a time, and they report back when the work is done." }; });
    makeLabel("lbl", '<span class="lbl-bay" id="bayLabel">SUB-AGENT BAY · READY</span>', function(){ return new THREE.Vector3(24.4,1.5,0); });
    bayLabelObj=labels[labels.length-1];
    labels[labels.length-1].el.style.display="";
  })();

  /* ----- Director's cabin island (outer ring, overlooking the floor) ----- */
  (function(){
    var cw=cabinWorld();
    var cab=new THREE.Group(); cab.position.set(cw.x,0.55,cw.z); cab.rotation.y=Math.PI/2-CABIN_ANG; scene.add(cab);
    var cabGlass=new THREE.MeshStandardMaterial({ color:0xFFD9A0, transparent:true, opacity:.16, roughness:.08, side:THREE.DoubleSide, depthWrite:false });
    box(9,1.0,12, stdMat(0x2A2118,{roughness:.9}), 0,-0.57,0, cab, false);
    var fl3=box(8.4,0.16,11.4, regTint(stdMat(0x8A6538,{roughness:.8}), 0x8A6538, 0x4A3826), 0,0,0, cab, false); fl3.receiveShadow=true;
    var rug=new THREE.Mesh(new THREE.CircleGeometry(2.2,24), regTint(stdMat(0x8A2F2A,{roughness:1}), 0x8A2F2A, 0x571F1C));
    rug.rotation.x=-Math.PI/2; rug.position.set(-0.4,0.1,0); cab.add(rug);
    function cabWall(cx,cz,len,horiz){
      var w=new THREE.Mesh(new THREE.BoxGeometry(horiz?len:0.09, 3.1, horiz?0.09:len), cabGlass);
      w.position.set(cx,1.55,cz); cab.add(w);
      var rail=new THREE.Mesh(new THREE.BoxGeometry(horiz?len:0.2, 0.14, horiz?0.2:len), goldMat);
      rail.position.set(cx,3.16,cz); cab.add(rail);
      var sill=new THREE.Mesh(new THREE.BoxGeometry(horiz?len:0.2, 0.14, horiz?0.2:len), goldMat);
      sill.position.set(cx,0.08,cz); cab.add(sill);
    }
    cabWall(0,-5.6,8.4,true); cabWall(-4.2,0,11.4,false); cabWall(4.2,0,11.4,false);
    cabWall(2.7,5.6,3.0,true); cabWall(-2.7,5.6,3.0,true);
    box(1.3,0.12,3.0, darkWoodMat, -0.8,1.0,0, cab);
    box(1.1,0.85,2.8, regTint(stdMat(0x6E4F2C,{roughness:.7}), 0x6E4F2C, 0x402D18), -0.8,0.5,0, cab, false);
    box(0.06,0.66,1.1, stdMat(0x232A3A), -0.75,1.42,-0.9, cab, false);
    directorChar=makeCharacter("#2A2118", SKINS[1], HAIRS[0], "Director");
    directorChar.g.position.set(0.9,0.06,0); directorChar.g.rotation.y=-Math.PI/2;
    cab.add(directorChar.g);
    box(0.5,0.7,0.5, stdMat(0xB98D5F), 3.4,0.35,-4.6, cab, false);
    var bush2=new THREE.Mesh(new THREE.SphereGeometry(0.55,10,8), leafMat);
    bush2.position.set(3.4,1.05,-4.6); bush2.castShadow=true; cab.add(bush2);
    box(0.4,2.2,3.4, darkWoodMat, 3.9,1.1,3.4, cab, false);
    var cl=new THREE.PointLight(0xFFB45E, 0, 30, 1.6); cl.position.set(0,3.2,0); cab.add(cl); lampLights.push(cl);
    cabinBeacon=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10), new THREE.MeshBasicMaterial({ color:0xE8A33D }));
    cabinBeacon.position.set(0,3.9,0); cabinBeacon.visible=false; cab.add(cabinBeacon);
    cab.traverse(function(o){ o.userData.pick={ type:"director" }; });
    makeLabel("lbl", '<span class="lbl-cabin">DIRECTOR<small>THE DIRECTOR\'S CABIN — TAP TO ENTER</small><span class="hand-count" id="cabinHandCount"></span></span>',
      function(){ return new THREE.Vector3(cw.x+Math.cos(CABIN_ANG)*4.5, 5.9, cw.z+Math.sin(CABIN_ANG)*4.5); });
    cabinLabelObj=labels[labels.length-1];
    labels[labels.length-1].el.style.display="";
    labels[labels.length-1].mobileDy=34;
  })();

  /* camera + controls */
  sizeRenderer();
  updateCamera();
  bindControls();
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("orientationchange", function(){ setTimeout(onViewportChange, 250); });
  /* walkway ring + ambient wanderers — gentle motion even when nothing runs */
  var walkway=new THREE.Mesh(new THREE.RingGeometry(13.1,16.1,56), new THREE.MeshBasicMaterial({ color:0x14264E, transparent:true, opacity:0.5, depthWrite:false }));
  walkway.rotation.x=-Math.PI/2; walkway.position.y=0.0; scene.add(walkway);
  ["#5B9BD5","#F2C230","#E563B8"].forEach(function(wc2, wi){
    var wch=makeCharacter(wc2, SKINS[wi%SKINS.length], HAIRS[(wi+1)%HAIRS.length], "Courier");
    wch.g.traverse(function(o){ o.userData.pick={ type:"dc" }; });
    scene.add(wch.g);
    wanderers.push({ ch:wch, ang:wi*2.1+0.6, rad: wi===1?15.3:13.8, spd:(wi===1?-1:1)*(0.055+wi*0.014) });
  });
  frameAll();
  requestAnimationFrame(animateLoop);
}
function sizeRenderer(){
  if(!renderer||!wrapEl) return;
  var w=wrapEl.clientWidth||800, h=wrapEl.clientHeight||500;
  renderer.setSize(w,h);
  camera.aspect=w/h; updateCamera();
}
function onViewportChange(){
  sizeRenderer();
  /* Rotating or resizing re-fits the whole office — unless the user has
     already panned/zoomed by hand, in which case leave their view alone. */
  if(!userMoved) frameAll();
}
function updateCamera(){
  if(!camera||!camTarget) return;
  var w=(wrapEl?wrapEl.clientWidth:800)||800, h=(wrapEl?wrapEl.clientHeight:500)||500;
  var aspect=w/h;
  camera.left=-viewSize*aspect/2; camera.right=viewSize*aspect/2;
  camera.top=viewSize/2; camera.bottom=-viewSize/2;
  var R=120;
  var pos=new THREE.Vector3(
    camTarget.x + R*Math.sin(camPhi)*Math.sin(camTheta),
    R*Math.cos(camPhi),
    camTarget.z + R*Math.sin(camPhi)*Math.cos(camTheta)
  );
  camera.position.copy(pos);
  camera.lookAt(camTarget.x, 0, camTarget.z);
  camera.updateProjectionMatrix();
  var mv=$("mmView");
  if(mv){
    var vw2=viewSize*aspect, vh2=viewSize;
    mv.style.left=Math.max(0,Math.min(96,(camTarget.x-vw2/2+58)/116*100))+"%";
    mv.style.width=Math.min(100,vw2/116*100)+"%";
    mv.style.top=Math.max(0,Math.min(96,(camTarget.z-vh2/2+42)/84*100))+"%";
    mv.style.height=Math.min(100,vh2/84*100)+"%";
  }
  var mz=$("mmZoom"); if(mz) mz.textContent=Math.round(5600/viewSize)+"%";
}
function bindControls(){
  var el=renderer.domElement;
  var pointers={}, pinchDist=0, downAt=0, moved=0, downX=0, downY=0;
  el.addEventListener("contextmenu", function(e){ e.preventDefault(); });
  el.addEventListener("pointerdown", function(e){
    el.setPointerCapture(e.pointerId);
    pointers[e.pointerId]={ x:e.clientX, y:e.clientY };
    if(Object.keys(pointers).length===2){
      var ps=Object.values(pointers);
      pinchDist=Math.hypot(ps[0].x-ps[1].x, ps[0].y-ps[1].y);
    }
    downAt=performance.now(); moved=0; downX=e.clientX; downY=e.clientY;
  });
  el.addEventListener("pointermove", function(e){
    if(!pointers[e.pointerId]) return;
    var dx=e.clientX-pointers[e.pointerId].x, dy=e.clientY-pointers[e.pointerId].y;
    pointers[e.pointerId]={ x:e.clientX, y:e.clientY };
    moved+=Math.abs(dx)+Math.abs(dy);
    if(moved>7 || Object.keys(pointers).length===2) userMoved=true;
    if(Object.keys(pointers).length===2){
      var ps=Object.values(pointers);
      var nd=Math.hypot(ps[0].x-ps[1].x, ps[0].y-ps[1].y);
      if(pinchDist>0){ viewSize=Math.max(24, Math.min(190, viewSize*pinchDist/Math.max(20,nd))); updateCamera(); }
      pinchDist=nd; return;
    }
    if(e.buttons===2 || e.altKey || e.shiftKey){
      camTheta-=dx*0.005;
      camPhi=Math.max(0.5, Math.min(1.25, camPhi-dy*0.005));
    } else if(e.buttons===1){
      var scale=viewSize/((wrapEl.clientHeight||500));
      var right=new THREE.Vector3(Math.cos(camTheta),0,-Math.sin(camTheta));
      var fwd=new THREE.Vector3(Math.sin(camTheta),0,Math.cos(camTheta));
      camTarget.addScaledVector(right, -dx*scale);
      camTarget.addScaledVector(fwd, dy*scale);
      camTarget.x=Math.max(-30, Math.min(30, camTarget.x));
      camTarget.z=Math.max(-18, Math.min(18, camTarget.z));
    }
    updateCamera();
  });
  function endPointer(e){
    var wasClick = (performance.now()-downAt<500) && moved<7 && Object.keys(pointers).length<=1;
    delete pointers[e.pointerId];
    if(wasClick) handlePick(e);
  }
  el.addEventListener("pointerup", endPointer);
  el.addEventListener("pointercancel", function(e){ delete pointers[e.pointerId]; });
  el.addEventListener("wheel", function(e){
    e.preventDefault();
    userMoved=true;
    viewSize=Math.max(24, Math.min(190, viewSize*(e.deltaY>0?1.09:0.92)));
    updateCamera();
  }, { passive:false });
}
function handlePick(e){
  if(!renderer||!scene) return;
  var rect=renderer.domElement.getBoundingClientRect();
  var nx=((e.clientX-rect.left)/rect.width)*2-1;
  var ny=-((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera({ x:nx, y:ny }, camera);
  var hits=raycaster.intersectObjects(scene.children, true);
  for(var i=0;i<hits.length;i++){
    var o=hits[i].object, pick=null;
    while(o){ if(o.userData && o.userData.pick){ pick=o.userData.pick; break; } o=o.parent; }
    if(!pick) continue;
    if(pick.type==="agent"){ openChat(pick.teamId, pick.idx); return; }
    if(pick.type==="team"){ renderTeamDetail(pick.teamId); return; }
    if(pick.type==="director"){ openSheet("director"); return; }
    if(pick.type==="dc"){ renderDCDetail(); return; }
    if(pick.type==="room"){ renderRoomDetail(pick.name, pick.desc); return; }
  }
}

/* ---------- labels projection ---------- */
var projV=null;
function updateLabels(){
  if(!projV) projV=new THREE.Vector3();
  var w=wrapEl.clientWidth, h=wrapEl.clientHeight;
  labels.forEach(function(L){
    if(L.el.style.display==="none" && !L.always) { /* still may need pos when shown */ }
    var p=L.getPos();
    projV.copy(p).project(camera);
    if(projV.z>1 || projV.z<-1){ L.el.style.visibility="hidden"; return; }
    L.el.style.visibility="";
    var x=(projV.x*0.5+0.5)*w, y=(-projV.y*0.5+0.5)*h;
    if(w<560 && L.mobileDy) y+=L.mobileDy;
    var hw=(L.el.offsetWidth||80)/2;
    x=Math.max(hw+4, Math.min(w-hw-4, x));
    y=Math.max(18, Math.min(h-6, y));
    L._sx=x; L._sy=y;
    L.el.style.transform="translate("+x.toFixed(1)+"px,"+y.toFixed(1)+"px) "+L.base;
  });
  /* screen-space de-collision: agent badges never sit on a name plate */
  var blockers=[];
  TEAMS.forEach(function(t){ var r2=teamRT[t.id]; if(r2 && r2.plateLabel && r2.plateLabel.el.style.display!=="none") blockers.push(r2.plateLabel); });
  if(cabinLabelObj && cabinLabelObj.el.style.display!=="none") blockers.push(cabinLabelObj);
  if(dcLabelObj && dcLabelObj.el.style.display!=="none") blockers.push(dcLabelObj);
  function rectOf(L){
    var w2=L.el.offsetWidth||60, h2=L.el.offsetHeight||24;
    var mm=L.base.match(/-([0-9]+)%\)/), frac=mm?parseInt(mm[1],10)/100:1;
    var top=L._sy-h2*frac;
    return { l:L._sx-w2/2, r:L._sx+w2/2, t:top, b:top+h2, h:h2 };
  }
  function pushOffPlates(B2){
    if(!B2 || B2.el.style.display==="none" || B2._sy==null) return;
    var br=rectOf(B2);
    blockers.forEach(function(P2){
      if(P2._sy==null) return;
      var pr=rectOf(P2);
      if(br.l < pr.r-4 && br.r > pr.l+4 && br.t < pr.b+4 && br.b > pr.t-4){
        B2._sy += ((pr.b+6)-br.t);
        br=rectOf(B2);
        B2.el.style.transform="translate("+B2._sx.toFixed(1)+"px,"+B2._sy.toFixed(1)+"px) "+B2.base;
      }
    });
  }
  TEAMS.forEach(function(t){
    var rt=teamRT[t.id]; if(!rt) return;
    var movers=[rt.handLabel, rt.errLabel, rt.doneLabel, rt.thinkLabel];
    if(rt===teamRT.creative && bayLabelObj) movers.push(bayLabelObj);
    if(rt===teamRT.creative) roomToasts.forEach(function(tz){ movers.push(tz); });
    movers.forEach(function(B2){ pushOffPlates(B2); });
  });
  roomToasts.forEach(function(tz){ pushOffPlates(tz); });
  TEAMS.forEach(function(t){
    var rt=teamRT[t.id]; if(!rt) return;
    var now=performance.now();
    rt.errEl.style.display = rt.errorUntil>now ? "" : "none";
    rt.doneEl.style.display = (rt.doneUntil>now && !pendingTeams()[t.id]) ? "" : "none";
    var anyThink=false;
    for(var i=0;i<rt.agents.length;i++) if(agentStateOf(t.id,i)==="thinking"){ anyThink=true; break; }
    rt.thinkEl.style.display = anyThink ? "" : "none";
  });
}

/* ---------- day / night ---------- */
function applyShift(night){
  if(!floorOK) return;
  tintables.forEach(function(tb){ tb.mat.color.copy(night?tb.night:tb.day); });
  scene.background.set(night?0x05090F:0x0A1428);
  hemiLight.color.set(night?0x3A4A68:0xBFD6FF);
  hemiLight.groundColor.set(night?0x141021:0x2A3550);
  hemiLight.intensity=night?0.5:0.9;
  dirLight.color.set(night?0x8FA5CC:0xDCE8FF);
  dirLight.intensity=night?0.3:0.8;
  lampLights.forEach(function(l){ l.intensity=night?1.35:0; });
  if(dcDotMat) dcDotMat.color.set(night?0xFFFFFF:0xCCCCCC);
}

/* ---------- main loop ---------- */
var lastT=performance.now();
function animateLoop(){
  requestAnimationFrame(animateLoop);
  var now=performance.now();
  var dt=Math.min(0.05,(now-lastT)/1000); lastT=now;
  var t=now/1000;
  TEAMS.forEach(function(tm){
    var rt=teamRT[tm.id]; if(!rt) return;
    rt.agents.forEach(function(a, idx){
      if(a.walk) updateWalk(a, dt, now);
      var st=agentStateOf(tm.id, idx);
      if(st==="done") a.doneRef=rt.doneStart;
      animateCharacter(a, st, t, now);
      if(a.dotMat) a.dotMat.color.set(STATUS_COLORS[st]||"#5B6B8C");
      a.g.visible = a.walk ? a.g.visible : true;
    });
    /* office flash on plane arrival */
    if(rt.flashUntil>now) rt.floorMat.emissive=new THREE.Color(tm.color);
    else if(rt.floorMat.emissive) rt.floorMat.emissive=new THREE.Color(0x000000);
  });
  for(var i=subAgents.length-1;i>=0;i--){
    var c=subAgents[i];
    if(c.walk) updateWalk(c, dt, now);
    animateCharacter(c, c.walk?"walking":"working", t, now);
    if(c.dotMat) c.dotMat.color.set(c.walk?"#5B9BD5":"#3ED97E");
  }
  if(directorChar){ animateCharacter(directorChar, "seated", t, now); if(directorChar.dotMat) directorChar.dotMat.color.set("#E8C37A"); }
  wanderers.forEach(function(w){
    w.ang+=w.spd*dt;
    var sgn=w.spd>0?1:-1;
    w.ch.g.position.set(Math.cos(w.ang)*w.rad, 0.04, Math.sin(w.ang)*w.rad);
    w.ch.g.rotation.y=Math.atan2(-Math.sin(w.ang)*sgn, Math.cos(w.ang)*sgn);
    animateCharacter(w.ch, "walking", t, now);
    if(w.ch.dotMat) w.ch.dotMat.color.set("#3ED97E");
  });
  if(cabinBeacon && cabinBeacon.visible){ var s=1+Math.sin(t*5)*0.25; cabinBeacon.scale.setScalar(s); }
  rackFaces.forEach(function(rf){ rf.mat.color.setScalar(0.78+0.22*Math.sin(t*rf.speed+rf.phase)); });
  if(now-rackBlinkAt>420 && rackFaces.length){ rackBlinkAt=now; var rfb=rackFaces[Math.floor(Math.random()*rackFaces.length)]; rfb.draw(); rfb.tex.needsUpdate=true; }
  if(monitorTex) monitorTex.offset.y-=0.0016;
  beamMats.forEach(function(bm3, bi){
    var bst=beamBoost[TEAMS[bi].id]||0;
    bm3.opacity=0.24+0.14*Math.sin(t*2+bi*0.9)+0.55*bst;
    beamBoost[TEAMS[bi].id]=Math.max(0, bst-dt*0.7);
  });
  beamDots.forEach(function(d, di){
    var c4=officeCenter(d.team), f=(t*0.22+di*0.17)%1;
    d.m.position.set(c4.x*(1-f), 2.6+1.3*f, c4.z*(1-f));
  });
  updatePlanes(dt);
  updateLabels();
  renderer.render(scene, camera);
}

/* ================= INIT ================= */
if(floorOK){
  try { buildScene(); }
  catch(err){ floorOK=false; $("floorFallback").style.display="grid"; }
} else {
  $("floorFallback").style.display="grid";
}
$("frameBtn").addEventListener("click", function(){ frameAll(); toast("Whole office in frame — all 8 teams, Data Center and your cabin."); });
$("mmExpand").addEventListener("click", function(){ frameAll(); });
$("boardBtn").addEventListener("click", function(){ $("boardSheet").classList.toggle("open"); syncScrim(); });
$("dockCabinBtn").addEventListener("click", function(){ openSheet("director"); });
$("mmIn").addEventListener("click", function(){ userMoved=true; viewSize=Math.max(24, viewSize*0.78); updateCamera(); });
$("mmOut").addEventListener("click", function(){ userMoved=true; viewSize=Math.min(190, viewSize*1.28); updateCamera(); });
$("bellBtn").addEventListener("click", function(){ $("boardSheet").classList.add("open"); syncScrim(); });
$("scrim").addEventListener("click", function(){
  $("boardSheet").classList.remove("open");
  $("orderPanel").classList.remove("open");
  closeDetail(); closeChat();
  syncScrim();
});
$("opClose").addEventListener("click", function(){ $("orderPanel").classList.remove("open"); syncScrim(); });
$("ordersBtn").addEventListener("click", function(){ $("orderPanel").classList.add("open"); syncScrim(); var ot=$("orderTextPanel"); if(ot) ot.focus(); });

/* seed the office */
["research","creative","social","analytics"].forEach(function(id){ spawnTask(id, { silent:true }); });
feed("research","morning scan started — 31 agents walked in");
feed("creative","3 new clips landed in Drive overnight");
feed("publishing","today's queue locked: 1 reel, 1 thread, 1 story");
renderBoards();
if(floorOK){
  TEAMS.forEach(function(t){
    if(activeTeams()[t.id]) teamWalkIn(t.id);
  });
  updateFloor();
}
})();
