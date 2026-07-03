// ✅ 판정 및 폴더별 기록 저장
function judge(folderName="default"){
  let results = [];
  let record = {measurements:[], watcherName:"", managerName:"",  location:"", timestamp:new Date().toLocaleString()};

  for(let i=1; i<=3; i++){
    let o = +document.getElementById('o'+i).value;
    let co = +document.getElementById('co'+i).value;
    let co2 = +document.getElementById('co2_'+i).value;
    let h = +document.getElementById('h'+i).value;
    let ok = o>=18 && o<23.5 && co<30 && co2<1.5 && h<10;
    results.push(ok);
    record.measurements.push({o,co,co2,h});
  }

  let watcherName = document.getElementById('watcherName').value.trim();
  let managerName = document.getElementById('managerName').value.trim();
  let location = document.getElementById('location').value.trim();
  record.watcherName = watcherName;
  record.managerName = managerName;
  record.location = location;

  let allOk = results.every(r => r);
  let r = document.getElementById('r');
  if(allOk && watcherName && managerName){
    r.className = 'ok';
    r.textContent = '정상 - 작업 가능 (감시인: '+watcherName+', 관리책임자: '+managerName+')';
  } else if(allOk){
    r.className = 'bad';
    r.textContent = '정상 조건이지만 성명 입력 필요';
  } else {
    r.className = 'bad';
    r.textContent = '위험 - 작업 금지';
  }

  // ✅ 폴더별 저장
  let saved = localStorage.getItem("workSafetyFolders");
  let folders = saved ? JSON.parse(saved) : {};

  if(!folders[folderName]){
    folders[folderName] = [];
  }
  folders[folderName].push(record);

  localStorage.setItem("workSafetyFolders", JSON.stringify(folders));

  showFolders(); // 폴더 목록만 표시
}

// ✅ 폴더 목록 표시
function showFolders(){
  let saved = localStorage.getItem("workSafetyFolders");
  if(saved){
    let folders = JSON.parse(saved);
    let output = "<h3>저장된 폴더 목록</h3><ul>";
    for(let folder in folders){
      output += "<li><button onclick=\"toggleFolderContent('"+folder+"')\">📁 "+folder+"</button>";
      output += "<div id='folder_"+folder+"' style='display:none;'></div></li>";
    }
    output += "</ul>";
    document.getElementById('savedData').innerHTML = output;
  }
}

// ✅ 폴더 클릭 시 토글 (열기/숨기기)
function toggleFolderContent(folderName){
  let div = document.getElementById('folder_'+folderName);
  if(div.style.display === "none"){
    // 열기
    let saved = localStorage.getItem("workSafetyFolders");
    if(saved){
      let folders = JSON.parse(saved);
      if(folders[folderName]){
        let output = "<h4>폴더: "+folderName+"</h4>";
        folders[folderName].forEach((rec, idx)=>{
          output += "<p><b>기록 "+(idx+1)+"</b> ("+rec.timestamp+")</p>";
          output += "<p>작업장소: "+rec.location+"</p>";
          output += "<p>감시인: "+rec.watcherName+" / 관리책임자: "+rec.managerName+"</p>";
          output += "<table border='1'><tr><th>측정</th><th>O₂</th><th>CO</th><th>CO₂</th><th>H₂S</th></tr>";
          rec.measurements.forEach((m,i)=>{
            output += "<tr><td>"+(i+1)+"</td><td>"+m.o+"</td><td>"+m.co+"</td><td>"+m.co2+"</td><td>"+m.h+"</td></tr>";
          });
          output += "</table><hr>";
        });
        output += "<button onclick=\"saveFolderAsPDF('"+folderName+"')\">📄 PDF로 저장</button>";
        div.innerHTML = output;
        div.style.display = "block";
      }
    }
  } else {
    // 숨기기
    div.style.display = "none";
  }
}

// ✅ PDF 저장 기능 추가
function saveFolderAsPDF(folderName){
  let div = document.getElementById('folder_'+folderName);
  if(div){
    let doc = new jsPDF('p','pt','a4');
    doc.html(div, {
      callback: function(pdf){
        pdf.save(folderName + "_기록.pdf");
      },
      x: 20,
      y: 20
    });
  }
}

// ✅ 모든 폴더 초기화
function clearData(){
  localStorage.removeItem("workSafetyFolders");
  document.getElementById('savedData').innerHTML = "";
  alert("모든 폴더와 기록이 삭제되었습니다.");
}
