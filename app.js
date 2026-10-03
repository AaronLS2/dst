import {CITIES,isDST,sun,lightAt,remainingMinutes,timeHours,formatTime,duration} from './solar.js';
const $=s=>document.querySelector(s);
const slider=$('#date'),city=$('#city'),morning=$('#morning'),evening=$('#evening'),play=$('#play');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
if(Object.hasOwn(CITIES,params.get('city'))) city.value=params.get('city');
if(/^\d+$/.test(params.get('day')||'') && +params.get('day')>=1 && +params.get('day')<=365) slider.value=params.get('day');
for(const input of [morning,evening]) if(timeHours(params.get(input.id)||'')!==null) input.value=params.get(input.id);
let playing=false,frame=0,lastStep=0,lastMorning=7.5,lastEvening=17.5;
function update(){
  const day=+slider.value,c=CITIES[city.value];
  const date=new Date(Date.UTC(2026,0,day));
  const label=date.toLocaleDateString('en-US',{month:'long',day:'numeric',timeZone:'UTC'});
  $('#date-label').textContent=label;
  slider.setAttribute('aria-valuetext',label+', 2026');
  document.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.day===day)));
  const am=timeHours(morning.value),pm=timeHours(evening.value);
  if(am!==null) lastMorning=am;
  if(pm!==null) lastEvening=pm;
  const results={};
  document.querySelectorAll('.clock-card').forEach(card=>{
    const mode=card.dataset.mode,tz=c.std+(mode==='dst'?1:0),daylight=sun(day,c,tz),twilight=sun(day,c,tz,96);
    const a=lightAt(lastMorning,daylight,twilight),b=lightAt(lastEvening,daylight,twilight),minutes=remainingMinutes(lastEvening,daylight);
    results[mode]={daylight,a,b,minutes};
    card.querySelector('.rise').textContent=formatTime(daylight[0]);
    card.querySelector('.set').textContent=formatTime(daylight[1]);
    for(const [klass,times] of [['daylight',daylight],['twilight',twilight]]){
      const el=card.querySelector('.'+klass);el.style.left=times[0]/24*100+'%';el.style.width=(times[1]-times[0])/24*100+'%';
    }
    for(const [klass,hour] of [['am',lastMorning],['pm',lastEvening]]) card.querySelector('.'+klass).style.left=Math.min(98,hour/24*100)+'%';
    card.querySelector('.morning strong').textContent=a;
    card.querySelector('.evening strong').textContent=b;
    card.querySelector('.remaining').innerHTML=`<b>${duration(minutes)}</b> of daylight after ${formatTime(lastEvening)}`;
  });
  $('#current-law').textContent=`Today’s law in ${c.name} matches ${isDST(day)?'daylight':'standard'} time on ${label}.`;
  const {std,dst}=results;
  const morningText=std.a===dst.a?`At ${formatTime(lastMorning)}, both options give you ${std.a.toLowerCase()}.`:`At ${formatTime(lastMorning)}: ${std.a.toLowerCase()} on standard time, ${dst.a.toLowerCase()} on daylight time.`;
  const extra=dst.minutes-std.minutes;
  $('#takeaway').textContent=`${morningText} ${extra>0?`Permanent DST gives you ${duration(extra)} more daylight after ${formatTime(lastEvening)}.`:`Neither option adds daylight after your chosen evening time.`} ${day<80||day>300?'Try Indianapolis or Sioux Falls to see how later winter sunrises change the trade-off.':'Try winter to see what permanent DST asks of your mornings.'}`;
}
function stop(){playing=false;cancelAnimationFrame(frame);play.textContent='▶ Play the year';play.setAttribute('aria-pressed','false');}
function tick(ts){if(!playing)return;if(ts-lastStep>=35){lastStep=ts;slider.value=+slider.value+1;update();if(+slider.value>=365){stop();return;}}frame=requestAnimationFrame(tick);}
play.setAttribute('aria-pressed','false');
play.addEventListener('click',()=>{if(playing){stop();return;}if(motion.matches)return;slider.value=1;playing=true;lastStep=0;play.textContent='Ⅱ Pause the year';play.setAttribute('aria-pressed','true');update();frame=requestAnimationFrame(tick);});
function motionUpdate(){if(motion.matches)stop();play.disabled=motion.matches;play.textContent=motion.matches?'Use date slider':'▶ Play the year';}
motion.addEventListener('change',motionUpdate);motionUpdate();
for(const input of [slider,city,morning,evening]) input.addEventListener('input',()=>{stop();motionUpdate();update();$('#share-status').textContent='';});
for(const input of [morning,evening]) input.addEventListener('change',()=>{if(timeHours(input.value)===null)input.value=input===morning?'07:30':'17:30';update();});
document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>{stop();motionUpdate();slider.value=b.dataset.day;update();$('#share-status').textContent='';}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();motionUpdate();}});
$('#share').addEventListener('click',async()=>{
  const url=new URL(location.href);url.search='';url.hash='planner';url.searchParams.set('city',city.value);url.searchParams.set('day',slider.value);url.searchParams.set('morning',morning.value||'07:30');url.searchParams.set('evening',evening.value||'17:30');
  const status=$('#share-status');
  try{await navigator.clipboard.writeText(url.href);status.textContent='Matchup link copied. Send it to your group chat.';}
  catch{status.textContent='Copy this link: ';const input=document.createElement('input');input.readOnly=true;input.value=url.href;input.setAttribute('aria-label','Matchup link');status.appendChild(input);input.focus();input.select();}
});
let comebackTimer=0;
$('#comeback').addEventListener('click',()=>{
  clearTimeout(comebackTimer);const button=$('#comeback');button.disabled=true;
  function score(label,record,caption){$('#record-label').textContent=label;$('#record').textContent=record;$('#record-caption').textContent=caption;}
  function finish(){score('OCT 30 · WORLD SERIES','4–3','World Series champions.');button.disabled=false;button.textContent='↻ Replay the comeback';}
  if(motion.matches){finish();return;}
  score('MAY 23 · REGULAR SEASON','19–31','Stay in the fight.');
  comebackTimer=setTimeout(()=>{score('SEPT 29 · REGULAR SEASON','93–69','From 19–31 to the postseason.');comebackTimer=setTimeout(finish,1200);},1100);
});
$('#clang').addEventListener('click',()=>{
  const section=$('.verdict'),button=$('#clang');button.disabled=true;section.classList.add('celebrate');$('#clang-result').textContent='Off the foul pole! Kendrick puts Washington ahead in Game 7.';
  if(!motion.matches)for(let i=0;i<22;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.setProperty('--x',`${-40-Math.random()*340}px`);piece.style.setProperty('--y',`${-70+Math.random()*300}px`);piece.style.background=['#f2bd42','#e95555','#fff'][i%3];section.appendChild(piece);}
  setTimeout(()=>{section.classList.remove('celebrate');section.querySelectorAll('.confetti').forEach(p=>p.remove());button.disabled=false;},motion.matches?1800:2800);
});
update();
