const signup=document.getElementById('signup');
const db=window.supabase.createClient('https://edvwyvprlmvfbiwnsmsy.supabase.co','sb_publishable_INttCaXkOGNLNegRdrLIIQ_B4K-lF2n');

function openSignup(){signup.showModal()}

function answer(el,ok){
  el.closest('.answers').querySelectorAll('button').forEach(b=>b.className='');
  el.className=ok?'ok':'no';
  const feedback=el.closest('.math-card').querySelector('.feedback');
  feedback.textContent=ok?'სწორია! შესანიშნავი პასუხია 🎉':'კიდევ ვცადოთ — შემდეგი კითხვა უფრო მარტივი იქნება 💡';
}

function toggleGrade(button){
  const card=button.closest('.grade-card');
  const details=card.querySelector('.grade-details');
  const willOpen=!card.classList.contains('expanded');
  document.querySelectorAll('.grade-card.expanded').forEach(openCard=>{
    if(openCard===card)return;
    openCard.classList.remove('expanded');
    openCard.querySelector('.grade-details').hidden=true;
    openCard.querySelector('.expand-btn').setAttribute('aria-expanded','false');
    openCard.querySelector('.button-label').textContent='მეტის ნახვა';
  });
  card.classList.toggle('expanded',willOpen);
  details.hidden=!willOpen;
  button.setAttribute('aria-expanded',String(willOpen));
  button.querySelector('.button-label').textContent=willOpen?'დახურვა':'მეტის ნახვა';
}

const roman=['','I','II','III','IV'];
const placementBank={
  1:[['რომელი რიცხვი მოდის 8-ის შემდეგ?',['7','9','10','6'],'9'],['რამდენია 6 + 3?',['8','9','10','7'],'9'],['რომელია მეტი: 12 თუ 9?',['9','12','ტოლია','არცერთი'],'12']],
  2:[['რამდენია 34 + 12?',['44','46','48','45'],'46'],['რამდენია 70 − 25?',['35','45','55','40'],'45'],['თუ საათია 9:00, 2 საათის შემდეგ იქნება…',['10:00','11:00','12:00','13:00'],'11:00']],
  3:[['რამდენია 7 × 8?',['48','54','56','64'],'56'],['რამდენია 72 ÷ 8?',['8','9','10','7'],'9'],['3 მეტრი რამდენი სანტიმეტრია?',['30','300','3000','3'],'300']],
  4:[['რამდენია 125 × 4?',['400','450','500','520'],'500'],['რამდენია 840 ÷ 7?',['110','120','130','140'],'120'],['რომელია ერთი მეოთხედი?',['1/2','1/3','1/4','2/4'],'1/4']]
};
let placementState={};

function startPlacement(){
  document.getElementById('placementIntro').hidden=false;
  document.getElementById('placementQuiz').hidden=true;
  document.getElementById('placementResult').hidden=true;
  document.getElementById('placement').showModal();
}
function closeTest(id){document.getElementById(id).close()}
function runPlacement(){
  placementState={step:0,level:1,correct:0,streak:0,used:{1:0,2:0,3:0,4:0},levelWins:{1:0,2:0,3:0,4:0}};
  document.getElementById('placementIntro').hidden=true;
  document.getElementById('placementQuiz').hidden=false;
  showPlacementQuestion();
}
function showPlacementQuestion(){
  const s=placementState;
  if(s.step>=12){showPlacementResult();return}
  const bucket=placementBank[s.level],idx=s.used[s.level]%bucket.length,q=bucket[idx];
  s.used[s.level]++;
  document.getElementById('placementCount').textContent=`კითხვა ${s.step+1} / 12`;
  document.getElementById('placementLevel').textContent=`${roman[s.level]} კლასის დონე`;
  document.getElementById('placementBar').style.width=`${s.step/12*100}%`;
  document.getElementById('placementPrompt').textContent=q[0];
  const box=document.getElementById('placementOptions');box.innerHTML='';
  q[1].forEach(option=>{const b=document.createElement('button');b.textContent=option;b.onclick=()=>gradePlacementAnswer(b,option===q[2]);box.appendChild(b)});
  document.getElementById('placementHint').textContent='აირჩიე ერთი პასუხი';
}
function gradePlacementAnswer(button,ok){
  const s=placementState;
  button.parentElement.querySelectorAll('button').forEach(b=>b.disabled=true);
  button.classList.add(ok?'correct':'wrong');
  if(ok){s.correct++;s.streak++;s.levelWins[s.level]++;if(s.streak>=2&&s.level<4){s.level++;s.streak=0}}
  else{s.streak--;if(s.streak<=-2&&s.level>1){s.level--;s.streak=0}}
  document.getElementById('placementHint').textContent=ok?'სწორია — შემდეგი კითხვა შეიძლება გართულდეს ✓':'არაუშავს — შემდეგი კითხვა დონეს მოერგება';
  s.step++;setTimeout(showPlacementQuestion,650);
}
function showPlacementResult(){
  const s=placementState;
  let recommended=1;
  if(s.levelWins[4]>=2)recommended=4;else if(s.levelWins[3]>=2)recommended=3;else if(s.levelWins[2]>=2)recommended=2;
  document.getElementById('placementQuiz').hidden=true;
  const result=document.getElementById('placementResult');result.hidden=false;
  result.innerHTML=`<span class="eyebrow">ტესტი დასრულდა</span><div class="result-grade">${roman[recommended]}</div><h2>რეკომენდაცია: ${roman[recommended]} კლასი</h2><p>${s.correct} სწორი პასუხი 12-დან. პროგრამა დაიწყება ბავშვისთვის კომფორტული დონით და შემდეგ პასუხების მიხედვით შეიცვლება.</p><div class="result-actions"><button class="primary" onclick="closeTest('placement');chooseGrade(${recommended})">პროგრამის ნახვა</button><button class="secondary" onclick="closeTest('placement');openSignup()">შედეგის შენახვა</button></div>`;
}
function chooseGrade(grade){
  document.getElementById('program').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{const card=document.querySelectorAll('.grade-card')[grade-1];const button=card.querySelector('.expand-btn');if(!card.classList.contains('expanded'))toggleGrade(button);card.style.boxShadow='0 0 0 4px var(--soft),0 20px 46px #21385f18';setTimeout(()=>card.style.boxShadow='',1800)},450);
}

function localQuestion(grade,day,i){
  let prompt,answer;
  if(grade===1){const a=i%9+1,b=i*2%8+1;if(day===1){prompt=`რომელი რიცხვი მოდის ${i*3%19}-ის შემდეგ?`;answer=String(i*3%19+1)}else if(day===2||day===6||day===7){prompt=`რამდენია ${a} + ${b}?`;answer=String(a+b)}else if(day===3){prompt=`რამდენია ${10+i%10} − ${i%8+1}?`;answer=String(9+i%10-i%8)}else if(day===4){const x=i*3%20,y=i*5%20;prompt=`რომელი ნიშანია სწორი: ${x} □ ${y}?`;answer=x>y?'>':x<y?'<':'='}else{prompt='რამდენი გვერდი აქვს სამკუთხედს?';answer='3'}}
  if(grade===2){const a=20+i*3%50,b=10+i*2%30;if(day===1){prompt=`რომელი რიცხვია ${a}-ის წინა?`;answer=String(a-1)}else if(day===3){prompt=`რამდენია ${a+40} − ${b}?`;answer=String(a+40-b)}else if(day===5){prompt=`თუ საათია ${7+i%10}:00, 2 საათის შემდეგ იქნება?`;answer=`${9+i%10}:00`}else if(day===6){prompt=`ნივთი ღირს ${5+i%10} ლარი. გადაიხადე 20 ლარი. ხურდა?`;answer=String(15-i%10)}else{prompt=`რამდენია ${a} + ${b}?`;answer=String(a+b)}}
  if(grade===3){const a=120+i*31%700,b=105+i*17%500;if(day===1){prompt=`რომელი რიცხვი მოდის ${a}-ის შემდეგ?`;answer=String(a+1)}else if(day===3){prompt=`რამდენია ${a+500} − ${b}?`;answer=String(a+500-b)}else if(day===4||day===7){prompt=`რამდენია ${i%8+2} × ${i*3%8+2}?`;answer=String((i%8+2)*(i*3%8+2))}else if(day===5){prompt=`რამდენია ${(i%8+2)*(i*3%8+2)} ÷ ${i%8+2}?`;answer=String(i*3%8+2)}else if(day===6){prompt=`${i%20+2} სმ რამდენი მმ-ია?`;answer=String((i%20+2)*10)}else{prompt=`რამდენია ${a} + ${b}?`;answer=String(a+b)}}
  if(grade===4){const a=1200+i*131%7000,b=1050+i*97%5000;if(day===1){prompt=`რომელი რიცხვი მოდის ${a}-ის შემდეგ?`;answer=String(a+1)}else if(day===3){prompt=`რამდენია ${a+7000} − ${b}?`;answer=String(a+7000-b)}else if(day===4||day===7){prompt=`რამდენია ${12+i*3%80} × ${i%8+2}?`;answer=String((12+i*3%80)*(i%8+2))}else if(day===5){prompt=`რამდენია ${(10+i*4%80)*(i%8+2)} ÷ ${i%8+2}?`;answer=String(10+i*4%80)}else if(day===6){prompt=`რომელი ჩანაწერია ერთი ${i%7+2}-ედი?`;answer=`1/${i%7+2}`}else{prompt=`რამდენია ${a} + ${b}?`;answer=String(a+b)}}
  let options;if(/^-?\d+$/.test(answer)){const n=Number(answer);options=[answer,String(n+1),String(Math.max(0,n-1)),String(n+2)]}else if(['>','<','='].includes(answer)){options=['>','<','=','არცერთი']}else{options=[answer,'1/2','1/3','1/4']}
  return{prompt,answer,options:[...new Set(options)].slice(0,4)};
}
let topicState={};
function openTopic(grade,day,title){
  topicState={grade,day,title,index:0,score:0,questions:Array.from({length:20},(_,i)=>localQuestion(grade,day,i+1))};
  document.getElementById('topicTest').showModal();showTopicQuestion();
}
function showTopicQuestion(){
  const s=topicState;if(s.index>=20){showTopicResult();return}const q=s.questions[s.index];
  document.getElementById('topicMeta').textContent=`${roman[s.grade]} კლასი · კითხვა ${s.index+1}/20`;
  document.getElementById('topicTitle').textContent=s.title;
  document.getElementById('topicBar').style.width=`${s.index/20*100}%`;
  document.getElementById('topicPrompt').textContent=q.prompt;
  const box=document.getElementById('topicOptions');box.innerHTML='';q.options.forEach(o=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>gradeTopicAnswer(b,o===q.answer);box.appendChild(b)});
  document.getElementById('topicHint').textContent='პასუხის მიხედვით შემდეგი დავალების დონე მოერგება';
}
function gradeTopicAnswer(button,ok){button.parentElement.querySelectorAll('button').forEach(b=>b.disabled=true);button.classList.add(ok?'correct':'wrong');if(ok)topicState.score++;topicState.index++;document.getElementById('topicHint').textContent=ok?'სწორია ✓':'სწორი პასუხი გამოჩნდება შედეგების მიმოხილვაში';setTimeout(showTopicQuestion,550)}
function showTopicResult(){document.getElementById('topicBar').style.width='100%';document.getElementById('topicPrompt').textContent=`შედეგი: ${topicState.score} / 20`;document.getElementById('topicOptions').innerHTML=`<button onclick="closeTest('topicTest');openSignup()">შედეგის შენახვა</button><button onclick="topicState.index=0;topicState.score=0;showTopicQuestion()">თავიდან გავლა</button>`;document.getElementById('topicHint').textContent=topicState.score>=16?'შესანიშნავია — შემდეგი თემა მზადაა!':'კარგი დასაწყისია — კიდევ ერთხელ ცდა დაგეხმარება.'}

document.querySelectorAll('.grade-card').forEach((card,gradeIndex)=>card.querySelectorAll('.day-list li').forEach((li,dayIndex)=>{
  li.tabIndex=0;li.setAttribute('role','button');li.setAttribute('aria-label',`${li.querySelector('b').textContent} — ტესტის დაწყება`);
  const launch=()=>openTopic(gradeIndex+1,dayIndex+1,li.querySelector('b').textContent);
  li.addEventListener('click',launch);li.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();launch()}});
}));

async function completeSignup(){
  const msg=document.getElementById('signupmsg');
  msg.textContent='ანგარიში იქმნება…';
  const email=document.getElementById('parentEmail').value.trim(),password=document.getElementById('parentPassword').value,fullName=document.getElementById('parentName').value.trim();
  if(!email||password.length<6||!fullName){msg.textContent='შეავსე სახელი, ელფოსტა და მინიმუმ 6-სიმბოლოიანი პაროლი.';return}
  const {data,error}=await db.auth.signUp({email,password});
  if(error){msg.textContent=error.message;return}
  if(data.user){
    await db.from('parent_profiles').upsert({id:data.user.id,full_name:fullName});
    await db.from('children').insert({parent_id:data.user.id,full_name:document.getElementById('childName').value.trim()||'ბავშვი',school:document.getElementById('childSchool').value.trim(),grade:Number(document.getElementById('childGrade').value)});
  }
  msg.textContent='ანგარიში შეიქმნა. შეამოწმე ელფოსტა დასადასტურებლად.';
}
