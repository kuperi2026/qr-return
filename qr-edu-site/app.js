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
