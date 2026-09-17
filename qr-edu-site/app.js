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

const roman=['','I'];
const levelNames=['','საწყისი','საშუალო','გაძლიერებული'];
const placementBank={
  1:[['რომელი რიცხვი მოდის 4-ის შემდეგ?',['3','5','6','7'],'5'],['რამდენია 3 + 2?',['4','5','6','3'],'5'],['რომელია მეტი: 7 თუ 5?',['5','7','ტოლია','არცერთი'],'7'],['რამდენი გვერდი აქვს სამკუთხედს?',['2','3','4','5'],'3']],
  2:[['რომელი რიცხვი აკლია: 8, 9, __, 11?',['7','10','12','9'],'10'],['რამდენია 8 + 6?',['12','13','14','15'],'14'],['რამდენია 15 − 7?',['7','8','9','6'],'8'],['რომელი ნიშანია სწორი: 12 □ 16?',['>','<','=','+'],'<']],
  3:[['რამდენია 9 + 8 − 5?',['11','12','13','14'],'12'],['ნინოს ჰქონდა 7 ვაშლი და 6 მისცეს. რამდენი აქვს?',['12','13','14','11'],'13'],['რომელი რიცხვებია ზრდადობით?',['8, 5, 3','3, 5, 8','5, 3, 8','8, 3, 5'],'3, 5, 8'],['რამდენია 20 − 7 − 4?',['8','9','10','11'],'9']]
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
  placementState={step:0,level:1,correct:0,streak:0,used:{1:0,2:0,3:0},levelWins:{1:0,2:0,3:0}};
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
  document.getElementById('placementLevel').textContent=`${levelNames[s.level]} დონე`;
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
  if(ok){s.correct++;s.streak++;s.levelWins[s.level]++;if(s.streak>=2&&s.level<3){s.level++;s.streak=0}}
  else{s.streak--;if(s.streak<=-2&&s.level>1){s.level--;s.streak=0}}
  document.getElementById('placementHint').textContent=ok?'სწორია — შემდეგი კითხვა შეიძლება გართულდეს ✓':'არაუშავს — შემდეგი კითხვა დონეს მოერგება';
  s.step++;setTimeout(showPlacementQuestion,650);
}
function showPlacementResult(){
  const s=placementState;
  let recommended=1;
  if(s.levelWins[3]>=2)recommended=3;else if(s.levelWins[2]>=2)recommended=2;
  document.getElementById('placementQuiz').hidden=true;
  const result=document.getElementById('placementResult');result.hidden=false;
  result.innerHTML=`<span class="eyebrow">ტესტი დასრულდა</span><div class="result-grade">${recommended}</div><h2>რეკომენდაცია: ${levelNames[recommended]} დონე</h2><p>${s.correct} სწორი პასუხი 12-დან. ხვალინდელი და შემდგომი დავალებები ბავშვის ყოველდღიური შედეგების მიხედვით ავტომატურად მოერგება.</p><div class="result-actions"><button class="primary" onclick="closeTest('placement');chooseGrade()">I კლასის პროგრამა</button><button class="secondary" onclick="closeTest('placement');openSignup()">შედეგის შენახვა</button></div>`;
}
function chooseGrade(){
  document.getElementById('program').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>{const card=document.querySelector('.grade-card');const button=card.querySelector('.expand-btn');if(!card.classList.contains('expanded'))toggleGrade(button);card.style.boxShadow='0 0 0 4px var(--soft),0 20px 46px #21385f18';setTimeout(()=>card.style.boxShadow='',1800)},450);
}

function localQuestion(grade,day,i){
  let prompt,answer;
  if(grade===1){const a=i%9+1,b=i*2%8+1;if(day===1){prompt=`რომელი რიცხვი მოდის ${i*3%19}-ის შემდეგ?`;answer=String(i*3%19+1)}else if(day===2||day===6||day===7){prompt=`რამდენია ${a} + ${b}?`;answer=String(a+b)}else if(day===3){prompt=`რამდენია ${10+i%10} − ${i%8+1}?`;answer=String(9+i%10-i%8)}else if(day===4){const x=i*3%20,y=i*5%20;prompt=`რომელი ნიშანია სწორი: ${x} □ ${y}?`;answer=x>y?'>':x<y?'<':'='}else{prompt='რამდენი გვერდი აქვს სამკუთხედს?';answer='3'}}
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
