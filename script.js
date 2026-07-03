function judge(){
  let results = [];
  for(let i=1; i<=3; i++){
    let o = +document.getElementById('o'+i).value;
    let co = +document.getElementById('co'+i).value;
    let co2 = +document.getElementById('co2_'+i).value;
    let h = +document.getElementById('h'+i).value;

    let ok = o>=18 && o<23.5 && co<30 && co2<1.5 && h<10;
    results.push(ok);
  }

  let allOk = results.every(r => r);
  let watcherName = document.getElementById('watcherName').value.trim();
  let managerName = document.getElementById('managerName').value.trim();

  let r = document.getElementById('r');
  if(allOk && watcherName && managerName){
    r.className = 'ok';
    r.textContent = '정상 - 작업 가능 (감시인: ' + watcherName + ', 관리책임자: ' + managerName + ')';
  } else if(allOk && (!watcherName || !managerName)){
    r.className = 'bad';
    r.textContent = '정상 조건이지만 감시인/관리책임자 성명 입력 필요';
  } else {
    r.className = 'bad';
    r.textContent = '위험 - 작업 금지';
  }
}
