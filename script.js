function check() {
  let loading = document.getElementById("loading");
  let popup = document.getElementById("popup");
  let textArea = document.getElementById("text");
  let originalText = textArea.value;
  loading.style.display = "flex";

  setTimeout(() => {
    let text = originalText.toLowerCase();
    let score = 50;
    let reasons = [];

    const scamStrong = ["pay", "registration fee", "get started immediately", "earn ₹", "no interview required"];
    const safeStrong = ["software engineering internship", "official email", "interview scheduled", "offer", "no payment required"];

    let scamDetected = false;
    let safeDetected = false;
    let highlightedText = originalText;

    scamStrong.forEach(word => {
      let regex = new RegExp(word,"gi");
      if(regex.test(highlightedText)){
        score -= 50;
        reasons.push(`Detected scam phrase: "${word}" (-50)`);
        highlightedText = highlightedText.replace(regex, match => `<mark class="scam">${match}</mark>`);
        scamDetected = true;
      }
    });

    safeStrong.forEach(word => {
      let regex = new RegExp(word,"gi");
      if(regex.test(highlightedText)){
        score += 35;
        reasons.push(`Detected safe phrase: "${word}" (+35)`);
        highlightedText = highlightedText.replace(regex, match => `<mark class="safe">${match}</mark>`);
        safeDetected = true;
      }
    });

    // Company detection
    const companyRegex = /\b([a-z\s]{2,20})\s+(tech|labs|solutions|systems|soft)\b/i;
    let companyMatch = text.match(companyRegex);
    let companyDetected = companyMatch ? companyMatch[0] : "";
    if(companyDetected && safeDetected){
      score += 10;
      reasons.push(`Company detected: "${companyDetected}" (+10)`);
    }

    if(score > 100) score = 100;
    if(score < 0) score = 0;

    textArea.innerHTML = highlightedText;

    loading.style.display = "none";
    popup.style.display = "flex";

    let bar = document.getElementById("progress-bar");
    setTimeout(()=>{ bar.style.width = score + "%"; }, 200);

    let popupText = "";
    if(scamDetected && !safeDetected){ popupText="Scam Detected 🚨"; bar.style.background="#ff6b6b"; }
    else if(safeDetected && !scamDetected){ popupText=`Looks Safe ✅${companyDetected ? " ("+companyDetected+")" : ""}`; bar.style.background="#00b894"; }
    else if(scamDetected && safeDetected){ popupText="Suspicious ⚠️ (mixed cues)"; bar.style.background="#ffd166"; }
    else { popupText="Neutral ⚪"; bar.style.background="#aaa"; }

    document.getElementById("popupText").innerText = popupText;
    document.getElementById("scoreText").innerText = score+"%";
    document.getElementById("reasonText").innerHTML = reasons.length>0? reasons.join("<br>") : "No strong cues detected, score is neutral.";
  }, 500);
}

function closePopup(){
  document.getElementById("popup").style.display = "none";
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("reasonText").innerHTML = "";
}