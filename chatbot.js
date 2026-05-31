(function () {
  /* ================================================================
     ASK BASA — BDI Chatbot  |  chatbot.js
     - Custom closed-state launcher image
     - Attention-grabbing ripple + tooltip animation
     - Back-to-top: 90% scroll threshold, repositioned, mix-blend-mode
     - Expanded knowledge base with donation CTAs
  ================================================================ */

  // ── Resolve base path from script tag ───────────────
  var basePath = "";
  var scripts = document.querySelectorAll("script[src]");
  for (var s = 0; s < scripts.length; s++) {
    if (scripts[s].src.indexOf("chatbot.js") > -1) {
      basePath = scripts[s].src.replace("chatbot.js", "");
      break;
    }
  }
  var closedIcon = basePath + "img/60x60 - bdi chatbot  - Closed State - Launcher Bubble.png";
  var headerIcon = basePath + "img/bdi_chatbot_icon.png";
  var paypalURL  = "https://www.paypal.com/donate/?hosted_button_id=JX22EPUQZZNH6";

  // ── CSS ─────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = `
    /* ===================== BACK-TO-TOP ===================== */
    .back-to-top {
      position: fixed !important;
      bottom: 100px !important;
      right: 28px !important;
      width: 40px !important; height: 40px !important;
      border-radius: 50% !important;
      background: white !important;
      color: black !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      mix-blend-mode: difference !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.35s ease !important;
      z-index: 9980 !important;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
      text-decoration: none !important;
      font-size: 15px !important;
    }
    .back-to-top.btt-visible {
      opacity: 1 !important;
      pointer-events: all !important;
    }
    .back-to-top:hover {
      transform: translateY(-3px) !important;
    }

    /* ===================== LAUNCHER ===================== */
    #ask-basa-launcher {
      position: fixed; bottom: 28px; right: 28px;
      width: 60px; height: 60px;
      border-radius: 50%;
      background: transparent;
      box-shadow: none;
      cursor: pointer; border: none; z-index: 9990;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s;
      padding: 0; overflow: visible;
    }
    #ask-basa-launcher:hover { transform: scale(1.08); }

    /* Ripple rings for attention */
    #ask-basa-launcher::before,
    #ask-basa-launcher::after {
      content: ''; position: absolute;
      width: 100%; height: 100%; border-radius: 50%;
      background: rgba(11,95,87,0.35);
      opacity: 0; pointer-events: none;
      animation: basaRipple 2.8s ease-out infinite;
    }
    #ask-basa-launcher::after { animation-delay: 1.4s; }
    @keyframes basaRipple {
      0%   { transform: scale(1);   opacity: 0.5; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    /* Stop ripple once chat is open */
    #ask-basa-launcher.basa-launcher-open::before,
    #ask-basa-launcher.basa-launcher-open::after { animation: none; opacity: 0; }

    /* Closed-state: full image fills the button */
    #ask-basa-launcher .icon-state-closed {
      width: 60px; height: 60px;
      object-fit: cover; border-radius: 50%;
      display: block;
    }
    /* Open-state: red circle + white X */
    #ask-basa-launcher .icon-state-open {
      display: none; font-size: 28px; color: #fff; line-height: 1;
      font-family: Arial, sans-serif; font-weight: 300;
    }
    #ask-basa-launcher.basa-launcher-open {
      background: #990033;
      box-shadow: 0 6px 24px rgba(153,0,51,0.5);
    }
    #ask-basa-launcher.basa-launcher-open .icon-state-closed { display: none; }
    #ask-basa-launcher.basa-launcher-open .icon-state-open   { display: block; }

    /* Online badge */
    #ask-basa-badge {
      position: absolute; top: 1px; right: 1px;
      width: 15px; height: 15px; background: #22c4a9;
      border-radius: 50%; border: 2px solid #fff; z-index: 2;
      animation: basaBadgePulse 2.2s ease-in-out infinite;
    }
    @keyframes basaBadgePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.35)} }

    /* ===================== TOOLTIP BUBBLE ===================== */
    #ask-basa-tooltip {
      position: fixed; bottom: 38px; right: 98px;
      background: #fff; border-radius: 14px;
      padding: 11px 16px; font-size: 13px; line-height: 1.45;
      font-family: 'Poppins', sans-serif; color: #222;
      box-shadow: 0 6px 24px rgba(0,0,0,0.14);
      white-space: nowrap; pointer-events: none; z-index: 9989;
      opacity: 0; transform: translateX(12px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    #ask-basa-tooltip.basa-tip-show { opacity: 1; transform: translateX(0); }
    #ask-basa-tooltip::after {
      content: ''; position: absolute;
      right: -8px; top: 50%; transform: translateY(-50%);
      border: 8px solid transparent;
      border-right-width: 0; border-left-color: #fff;
    }

    /* ===================== CHAT WINDOW ===================== */
    #ask-basa-window {
      position: fixed; bottom: 100px; right: 28px;
      width: 365px; max-height: 540px;
      background: #fff; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.18);
      z-index: 9990; display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.88) translateY(20px); opacity: 0; pointer-events: none;
      transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      transform-origin: bottom right;
    }
    #ask-basa-window.basa-open {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
    }

    /* ---- Header ---- */
    #ask-basa-header {
      background: #073934;
      padding: 13px 15px; display: flex; align-items: center; gap: 11px; flex-shrink: 0;
    }
    .basa-avatar {
      width: 32px; height: 32px; border-radius: 4px;
      background: #fff; padding: 2px; box-sizing: border-box;
      flex-shrink: 0; overflow: hidden;
    }
    .basa-avatar img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .basa-hname  { color:#fff; font-weight:700; font-size:14.5px; font-family:'Poppins',sans-serif; line-height:1.3; }
    .basa-hstatus { color:rgba(255,255,255,0.78); font-size:11px; font-family:'Poppins',sans-serif; display:flex; align-items:center; gap:5px; margin-top:2px; }
    .basa-hdot { width:7px; height:7px; background:#22c4a9; border-radius:50%; flex-shrink:0; }
    #ask-basa-close-win {
      margin-left:auto; background:rgba(255,255,255,0.18); border:none;
      color:#fff; width:28px; height:28px; border-radius:50%; cursor:pointer;
      font-size:17px; display:flex; align-items:center; justify-content:center;
      transition:background 0.2s; flex-shrink:0;
    }
    #ask-basa-close-win:hover { background:rgba(255,255,255,0.35); }

    /* ---- Messages ---- */
    #ask-basa-messages {
      flex:1; overflow-y:auto; padding:14px 14px 8px;
      display:flex; flex-direction:column; gap:10px; background:#fdf5f5;
    }
    #ask-basa-messages::-webkit-scrollbar { width:4px; }
    #ask-basa-messages::-webkit-scrollbar-thumb { background:#f0c0c0; border-radius:4px; }

    .basa-row { display:flex; flex-direction:column; }
    .basa-row.basa-bot  { align-items:flex-start; }
    .basa-row.basa-user { align-items:flex-end; }
    .basa-bubble { max-width:88%; padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.58; font-family:'Poppins',sans-serif; }
    .basa-row.basa-bot .basa-bubble  { background:#fff; color:#222; border-bottom-left-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.07); }
    .basa-row.basa-user .basa-bubble { background:#B40000; color:#fff; border-bottom-right-radius:4px; }
    .basa-time { font-size:10px; color:#bbb; margin-top:3px; font-family:'Poppins',sans-serif; }
    .basa-row.basa-user .basa-time { text-align:right; }

    /* Typing */
    .basa-typing-row { display:flex; }
    .basa-typing { display:flex; align-items:center; gap:4px; background:#fff; border-radius:16px; border-bottom-left-radius:4px; padding:11px 16px; box-shadow:0 2px 8px rgba(0,0,0,0.07); }
    .basa-typing span { width:7px; height:7px; background:#B40000; border-radius:50%; display:inline-block; animation:basaBounce 1.3s infinite; }
    .basa-typing span:nth-child(2){ animation-delay:0.2s; }
    .basa-typing span:nth-child(3){ animation-delay:0.4s; }
    @keyframes basaBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }

    /* Chips */
    .basa-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:7px; }
    .basa-chip { background:#fdf0f0; color:#B40000; border:1.5px solid #f0b0b0; border-radius:20px; padding:5px 13px; font-size:11.5px; font-family:'Poppins',sans-serif; font-weight:600; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
    .basa-chip:hover { background:#B40000; color:#fff; border-color:#B40000; }

    /* Donation CTA buttons inside chat */
    .basa-donate-btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:9px 16px; border-radius:10px;
      font-size:12.5px; font-weight:700; font-family:'Poppins',sans-serif;
      text-decoration:none; margin-top:4px; margin-right:6px; margin-bottom:4px;
      transition:transform 0.15s, opacity 0.2s;
    }
    .basa-donate-btn:hover { transform:translateY(-2px); opacity:0.9; }
    .basa-donate-btn.primary { background:#B40000; color:#fff; }
    .basa-donate-btn.secondary { background:#073934; color:#fff; }
    .basa-donate-btn.outline { background:transparent; color:#B40000; border:2px solid #B40000; }
    .basa-btn-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }

    /* Input */
    #ask-basa-inputarea { padding:11px 12px; border-top:1px solid #eee; display:flex; gap:8px; align-items:center; background:#fff; flex-shrink:0; }
    #ask-basa-input { flex:1; border:1.5px solid #ddd; border-radius:24px; padding:9px 15px; font-size:13px; font-family:'Poppins',sans-serif; outline:none; transition:border-color 0.2s; background:#fafafa; }
    #ask-basa-input:focus { border-color:#B40000; background:#fff; }
    #ask-basa-input::placeholder { color:#bbb; }
    #ask-basa-send { width:38px; height:38px; background:#B40000; border:none; border-radius:50%; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s, transform 0.15s; flex-shrink:0; }
    #ask-basa-send:hover { background:#8C0000; transform:scale(1.06); }
    #ask-basa-powered { text-align:center; font-size:10px; color:#ccc; font-family:'Poppins',sans-serif; padding:4px 0 8px; background:#fff; }
    #ask-basa-powered a { color:#B40000; text-decoration:none; font-weight:600; }

    /* Mobile */
    @media(max-width:480px){
      #ask-basa-window { bottom:0;right:0;left:0;width:100%;max-height:86vh;border-radius:20px 20px 0 0; }
      #ask-basa-launcher { bottom:18px;right:18px; }
      .back-to-top { right:18px !important; bottom:90px !important; }
      #ask-basa-tooltip { right:86px; bottom:28px; }
    }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────
  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<div id="ask-basa-tooltip">👋 Have a question about BDI?</div>' +
    '<button id="ask-basa-launcher" aria-label="Ask BASA">' +
      '<div id="ask-basa-badge"></div>' +
      '<img src="' + closedIcon + '" class="icon-state-closed" alt="Ask BASA">' +
      '<span class="icon-state-open">&times;</span>' +
    '</button>' +
    '<div id="ask-basa-window" role="dialog" aria-label="Ask BASA">' +
      '<div id="ask-basa-header">' +
        '<div class="basa-avatar"><img src="' + headerIcon + '" alt="BDI"></div>' +
        '<div><div class="basa-hname">Ask BASA</div>' +
        '<div class="basa-hstatus"><span class="basa-hdot"></span>Online · BASA Development Initiatives</div></div>' +
        '<button id="ask-basa-close-win" aria-label="Close">&#10005;</button>' +
      '</div>' +
      '<div id="ask-basa-messages"></div>' +
      '<div id="ask-basa-inputarea">' +
        '<input type="text" id="ask-basa-input" placeholder="Ask me anything about BDI..." autocomplete="off" maxlength="220">' +
        '<button id="ask-basa-send" aria-label="Send"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>' +
      '</div>' +
      '<div id="ask-basa-powered">Powered by <a href="index.html">BASA Development Initiatives</a></div>' +
    '</div>';
  document.body.appendChild(wrap);

  // ── Soft chime ───────────────────────────────────────
  function playTone() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      [[1046.5,0,0.12],[880,0.14,0.12]].forEach(function(n){
        var o=ctx.createOscillator(), g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type="sine"; o.frequency.setValueAtTime(n[0],ctx.currentTime+n[1]);
        g.gain.setValueAtTime(0,ctx.currentTime+n[1]);
        g.gain.linearRampToValueAtTime(0.11,ctx.currentTime+n[1]+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+n[1]+0.28);
        o.start(ctx.currentTime+n[1]); o.stop(ctx.currentTime+n[1]+0.3);
      });
    } catch(e){}
  }

  // ── Knowledge base ───────────────────────────────────
  var PAYPAL = paypalURL;
  var kb = [
    {
      p:["hello","hi ","hi!","hey ","hey!","good morning","good afternoon","good evening","greet","start","howdy","sup ","anyone there","are you there","can you help","can i ask","i need help","i have a question","tell me something","what can you do"],
      r:"Hello! 👋 I can help you learn about our work, how to donate, volunteer, partner with us, and more. What would you like to know?",
      c:["What does BDI do?","How can I donate?","Where do you work?","How to get involved?"]
    },
    {
      p:["what is bdi","what is basa","about bdi","about basa","who are you","what do you do","mission","vision","tell me about","overview","organisation","organization","ngo","bdi mean","what does bdi stand","what does basa stand","explain bdi","explain basa","describe bdi","describe basa","bdi work","basa work","bdi do","basa do","what kind of","tell me more","more about bdi","more about basa","what type","registered","history of bdi","history of basa","bdi history","bdi background","background of bdi"],
      r:"🌍 <strong>BASA Development Initiatives (BDI)</strong> is a Liberian-led NGO founded in 2022, operating in Liberia and Ghana, with a US fundraising office in Minnesota.\n\n<strong>Our Mission:</strong> To bridge institutional gaps, empower women and youth, and champion inclusive community development across Africa — through agriculture, health, education, climate action, and more.\n\n💡 BASA stands for <em>Born African, Stay African</em> — African challenges deserve African-led solutions.",
      c:["Our programmes","Our impact","How was BDI founded?","Contact BDI"]
    },
    {
      p:["programme","program","sector","focus area","activities","what you do","all programme","list programme","what bdi does","what areas","which programme","list of program","8 program","eight program"],
      r:"BDI runs <strong>8 programme areas</strong> across Africa:\n\n🌾 Agriculture & Agribusiness\n❤️ Health & Nutrition\n📚 Education\n🌿 Environment & Climate\n👩 Gender & Youth Empowerment\n🐟 Fisheries & Aquaculture\n♿ Disability Inclusion\n🤝 Research & Partnership\n\nWhich area would you like to explore?",
      c:["Agriculture","Health & Nutrition","Education","Environment & Climate"]
    },
    {
      p:["agricult","farm","agribusiness","crop","food security","farmer","market access","cooperative","rice","cassava","harvest","seed","soil","smallholder","food produc","rural livelihood","what does bdi do for farmer"],
      r:"🌾 <strong>Agriculture & Agribusiness</strong>\n\nBDI has trained over <strong>1,200 farmers</strong> in sustainable practices across Liberia:\n• Climate-smart farming techniques\n• Cooperative formation and market access\n• Women-led agribusiness development\n• Youth entrepreneurship in agriculture\n• Supported <strong>20+ women and youth-led agribusinesses</strong>\n\nWe work closely with farming communities in Sinoe and Bong counties — turning subsistence farming into a driver of economic growth.",
      c:["Support agriculture","Impact numbers","Gender & Youth","Donate to BDI"]
    },
    {
      p:["health","nutrition","medical","clinic","hospital","menstrual","period poverty","hygiene","drug","safe drug"],
      r:"❤️ <strong>Health & Nutrition</strong>\n\nBDI promotes healthy communities through:\n• Menstrual hygiene education — reaching <strong>500+ school girls</strong> across Liberia\n• Community health outreach and nutrition literacy\n• Safe drug victim support programmes\n• Partnerships with Liberian health institutions\n\nHealthy communities are the foundation of sustainable development. Your support helps us reach more girls and communities.",
      c:["End Period Poverty","Donate to health work","Other programmes","Contact BDI"]
    },
    {
      p:["education","school","student","learning","classroom","climate club","literacy","dropout","feeding","school feeding"],
      r:"📚 <strong>Education</strong>\n\nBDI has reached over <strong>1,600 students</strong> through education and climate literacy:\n• <strong>10</strong> school-based climate clubs established in Sinoe County\n• Climate resilience curriculum developed and deployed\n• School feeding initiatives to reduce dropout rates\n• Education outreach across coastal communities of Liberia\n\nEvery child in school is a step toward a stronger Africa.",
      c:["School Feeding Initiative","Support education","Donate","Other programmes"]
    },
    {
      p:["environment","climate","tree","green","sustainab","waste","coastal","carbon","resilience","greenville","sinoe","pollution"],
      r:"🌿 <strong>Environment & Climate</strong>\n\nBDI has planted over <strong>5,000 trees</strong> and leads community environmental programmes:\n• <strong>Building Climate Resilience Project (SBCRP)</strong> in Sinoe County — funded through Conservation International and GEF\n• Community waste management in Greenville City — partnering with local government and businesses\n• Coastal ecosystem protection and restoration\n• Training youth as climate leaders and advocates\n\nOur Greenville Rising project has directly improved sanitation for thousands of residents.",
      c:["Greenville Story","Support climate work","Donate","Partners"]
    },
    {
      p:["gender","youth","women","girl","female","young","empower","girl child","agribusiness women","period"],
      r:"👩 <strong>Gender & Youth Empowerment</strong>\n\nEmpowering women and youth is central to BDI's mission:\n• Women-led agribusiness training and market linkages\n• Youth leadership and entrepreneurship programmes\n• Menstrual health education for school girls\n• <strong>500+ girls</strong> reached through period poverty outreach\n• <strong>20+</strong> women and youth-led agribusinesses supported\n\nBDI believes Africa's future is being built by its women and young people — right now.",
      c:["End Period Poverty","Support women's work","Donate","Other programmes"]
    },
    {
      p:["fisher","fish","aquacultur","coastal","ocean","pond","nafaa","opec","lwsfili"],
      r:"🐟 <strong>Fisheries & Aquaculture</strong>\n\nBDI supports Liberia's coastal fishing communities through:\n• Technical training for smallholder fish farmers\n• Sustainable pond management practices\n• <strong>NaFAA partnership</strong> — National Fisheries & Aquaculture Authority\n• Shortlisted for the <strong>NaFAA/OPEC Fund LWSFILI fisheries programme</strong> — a major milestone\n• Consortium partner: Elitrust Finecon Limited\n\nOur goal: strengthen fisheries as a reliable source of nutrition and income.",
      c:["Our partners","Donate","Other programmes","Contact BDI"]
    },
    {
      p:["disabilit","inclusion","accessib","person with disabilit","differently abled","pwd"],
      r:"♿ <strong>Disability Inclusion</strong>\n\nBDI champions rights and full inclusion of persons with disabilities:\n• Accessible programme design across all sectors\n• Community advocacy for disability rights\n• Inclusive leadership and participation frameworks\n• Partnerships with disability-focused organizations\n\nWe believe development only succeeds when it reaches everyone.",
      c:["Donate","Volunteer","Contact BDI","Other programmes"]
    },
    {
      p:["donate","donation","give","support","fund","contribute","payment","paypal","financial support","how to help","money","how do i give","ways to give","one-off","monthly","recurring","make a gift","send money","help bdi","help basa","support the work","support bdi","support basa","make a donation","give to bdi","give to basa","charity","raise fund","how much","how to give","how can i give","how can i support","can i donate","i want to donate","i want to give","i want to help","i'd like to donate","i'd like to help"],
      r:"💚 <strong>Thank you for wanting to support BDI!</strong>\n\nHere are all the ways you can give:\n\n💳 <strong>One-off or monthly donation</strong> via PayPal — secure & instant\n🏢 <strong>Corporate donation</strong> — partner with BDI as a company\n💰 <strong>Payroll giving</strong> — regular contribution via salary\n🌹 <strong>Donate in memory</strong> — honour a loved one\n📜 <strong>Leave a gift in your will</strong> — a lasting legacy\n🧾 <strong>Donate your tax refund</strong> — put it to work\n\nEvery contribution, large or small, directly funds our programmes in Liberia and Ghana.",
      c:["Corporate giving","Volunteer instead","Fundraise for BDI","Contact BDI"],
      links:[
        {text:"💳 Donate via PayPal", url: "https://www.paypal.com/donate/?hosted_button_id=JX22EPUQZZNH6", cls:"primary"},
        {text:"View All Ways to Give", url:"all-donate.html", cls:"secondary"},
        {text:"Corporate Donations", url:"Corporate-Donations.html", cls:"outline"}
      ]
    },
    {
      p:["campaign","fundrais","current campaign","active campaign","appeal","drive","end period","safe drug","agribusiness women","school feeding"],
      r:"🎯 <strong>BDI's Active Fundraising Campaigns</strong>\n\nYou can give directly to any of our live campaigns:\n\n🎀 <strong>End Period Poverty</strong> — menstrual health for Liberian school girls\n🛡️ <strong>Safe Drug Victims</strong> — supporting victims of substance abuse\n👩‍🌾 <strong>Women in Agribusiness</strong> — empowering women-led enterprises\n🍽️ <strong>School Feeding</strong> — keeping children in school and nourished\n\nAll donations are processed securely via PayPal.",
      c:["Donate via PayPal","All ways to donate","Volunteer","Contact BDI"],
      links:[
        {text:"💳 Donate Now via PayPal", url:"https://www.paypal.com/donate/?hosted_button_id=JX22EPUQZZNH6", cls:"primary"},
        {text:"End Period Poverty", url:"End-Period-Poverty.html", cls:"secondary"},
        {text:"Women in Agribusiness", url:"Women-and-Youth-in-Agribusiness.html", cls:"secondary"},
        {text:"Safe Drug Victims", url:"safe-drug-victims.html", cls:"outline"}
      ]
    },
    {
      p:["volunteer","volunteering","give time","give skills","remote volunteer","online help","skill-based","pro bono"],
      r:"🙌 <strong>Volunteer with BDI</strong>\n\nVolunteer remotely from anywhere in the world! We welcome skills in:\n• Communications & content writing\n• Graphic design & web development\n• Research & data analysis\n• Fundraising & grant writing\n• Agriculture, health, or environmental expertise\n\nEmail <strong>info@basadev.org</strong> with your skills and availability — we'd love to hear from you.",
      c:["Contact BDI","Donate instead","Fundraise for BDI","Career opportunities"]
    },
    {
      p:["partner","partnership","corporate","business","company","sponsor","collaborate","staff fundrais","payroll","csr"],
      r:"🤝 <strong>Partner with BDI</strong>\n\nWe welcome partnerships that share our vision:\n\n🏢 <strong>Corporate</strong> — Staff fundraising, payroll giving, CSR partnerships\n🌐 <strong>NGO / INGO</strong> — Joint programmes and co-funding\n🏛️ <strong>Government</strong> — Policy engagement and programme alignment\n🔬 <strong>Research</strong> — Joint studies and evaluations\n\n<strong>Current partners:</strong> Conservation International, NaFAA, NCSCL, WACSI, Elitrust Finecon, CERATH Development Organization, COULDYOU?, BASA Africa, Peace Corps, and DARA.",
      c:["Become a corporate partner","Donate","Contact BDI","About BDI"],
      links:[
        {text:"Partner With Us", url:"Partner-With-Us.html", cls:"primary"},
        {text:"Corporate Donations", url:"Corporate-Donations.html", cls:"secondary"}
      ]
    },
    {
      p:["fundrais","own fundraiser","campaign","raise money","friend sponsor","marathon","bake sale","peer"],
      r:"🎯 <strong>Fundraise for BDI</strong>\n\nCreate your own campaign to support our work:\n• Start a marathon, bake sale, sports event, or online campaign\n• Find a friend to sponsor\n• Share our PayPal link in your community\n\nEvery campaign matters — contact us at <strong>info@basadev.org</strong> and we'll promote your campaign too!",
      c:["Donate directly","Volunteer","Contact BDI","About BDI"],
      links:[
        {text:"Start a Fundraiser", url:"Start-your-own-fundraiser.html", cls:"primary"},
        {text:"Find a Friend to Sponsor", url:"Find-a-Friend-to-Sponsor.html", cls:"secondary"}
      ]
    },
    {
      p:["impact","result","achievement","number","statistic","how many","accomplish","outcome","what have you done","success","proof"],
      r:"📊 <strong>BDI Impact to Date (2022–2025)</strong>\n\nOn an average annual budget of just $50,000–$60,000:\n\n🌾 <strong>1,200+</strong> farmers trained in sustainable agribusiness\n🎓 <strong>1,600+</strong> students reached through climate literacy\n🌳 <strong>5,000+</strong> trees planted across coastal communities\n🏫 <strong>10</strong> school-based climate clubs established\n👩‍💼 <strong>20+</strong> women and youth-led agribusinesses supported\n🎀 <strong>500+</strong> girls reached through menstrual health education\n🤝 <strong>6+</strong> active strategic institutional partnerships\n\nAll of this since 2022 — and we are just getting started.",
      c:["Annual Reports","How to donate","Our programmes","Where do you work?"]
    },
    {
      p:["where","location","country","liberia","ghana","operate","county","africa","sinoe","bong","monrovia","accra","paynesville","montserrado"],
      r:"🗺️ <strong>Where BDI Works</strong>\n\n🇱🇷 <strong>Liberia</strong> — HQ at Gausi Apartments, BASA Ave, Paynesville, Monrovia\n• Active in Sinoe, Bong & Montserrado Counties\n• Goal: all <strong>15 Liberian counties</strong> by 2029\n\n🇬🇭 <strong>Ghana</strong> — Accra Office\n• GE-350-4105, Westland Haasto, Accra\n\n🇺🇸 <strong>United States</strong> — Fundraising office only\n• 984 Kettle Creek Road, Eagan, MN 55123",
      c:["Contact BDI","Our programmes","About BDI","Donate"]
    },
    {
      p:["found","history","start","origin","nairobi","born african","stay african","basa mean","2019","2022","seroni","july 14","restaurant"],
      r:"📖 <strong>The Founding Story</strong>\n\nOn <strong>July 14, 2019</strong> at <em>Seroni Restaurant, Nairobi, Kenya</em>, Founder <strong>Katherina M. Hopkins</strong> had a defining moment. A conversation sparked the mantra: <em>\"Born African, Stay African\"</em> — BASA.\n\nThe insight: Africans with global experience often look down on their roots instead of using that experience to build up their continent. BDI was born from a commitment to reverse this.\n\nFormally registered as an NGO in Liberia in <strong>2022</strong>, BDI is now active across Liberia and Ghana.",
      c:["Meet our CEO","Our programmes","Our impact","Donate"]
    },
    {
      p:["team","staff","board","director","leadership","who leads","who heads","who head","who run","who is in charge","in charge","head of bdi","head of basa","heads bdi","heads basa","leads bdi","leads basa","management","governance","katherina","hopkins","morris","estell","josephine","ceo","founder","chairperson","treasurer","executive","who is the","who's the","who are the","bdi led by","basa led by","bdi run by","who founded","who started bdi","who started basa"],
      r:"👥 <strong>BDI Leadership</strong>\n\n🎯 <strong>CEO & Founder:</strong> Katherina M. Hopkins\n🏛️ <strong>Board Chairperson:</strong> Elvis G. Morris\n📋 <strong>Co-Chairperson:</strong> Estell D. Johnson\n💼 <strong>Board Treasurer:</strong> Josephine Musa\n\nBDI has <strong>17 dedicated team members</strong> across 8 programme areas, plus a full Board of Directors providing strategic oversight.\n\nRegistered NGO in Liberia (2022) and 501(c)(3) nonprofit in the United States.",
      c:["Full team page","Governance structure","Annual Reports","Contact BDI"]
    },
    {
      p:["contact","email","phone","address","reach","get in touch","call","office","where are you","telephone","speak to someone","human","person","talk to someone","talk to bdi","talk to basa","i want to speak","how do i reach","how do i contact","reach bdi","reach basa","contact details","contact information","how to contact","where is bdi","where is basa","location of bdi","bdi location","bdi number","bdi email","basa email","basa number","info@","basadev.org"],
      r:"📞 <strong>Contact BDI</strong>\n\n📧 <strong>Email:</strong> info@basadev.org\n📱 <strong>Phone:</strong> +231 770 457 572 / +231 886 757 435\n\n🇱🇷 <strong>HQ — Liberia:</strong>\n1st Floor, Gausi Apartments, Apt. 5,\nBASA Avenue LBS-ELWA Community,\nPaynesville, Liberia\n\n🇬🇭 <strong>Ghana:</strong> GE-350-4105, Westland Haasto, Accra\n\n🇺🇸 <strong>US (Fundraising):</strong> 984 Kettle Creek Road, Eagan, MN 55123\n📞 +1 (651) 235-9896",
      c:["Visit Contact page","Donate","Volunteer","About BDI"],
      links:[{text:"📬 Visit Contact Page", url:"contact.html", cls:"primary"}]
    },
    {
      p:["career","job","vacancy","employment","hire","work for","opportunity","apply","position","internship","opening"],
      r:"💼 <strong>Careers at BDI</strong>\n\nBDI periodically hires across:\n• Programme officers (agriculture, health, education, environment)\n• Communications and partnerships\n• Finance and administration\n• Research, monitoring & evaluation\n\nVisit our Career Portal or email your CV to <strong>info@basadev.org</strong> with the position you're interested in.",
      c:["Career Portal","Volunteer instead","Contact BDI","About BDI"],
      links:[{text:"View Career Portal", url:"career-portal.html", cls:"primary"}]
    },
    {
      p:["newsletter","subscribe","update","news","quarterly","mailing","email list","stay connected","story","blog","latest"],
      r:"📰 <strong>Stay Connected</strong>\n\nSubscribe to BDI's quarterly newsletter for:\n• Impact stories from the field\n• Programme updates and milestones\n• Funding & partnership news\n• Events and campaigns\n\nUse the newsletter form on any page, or email <strong>info@basadev.org</strong> to subscribe.",
      c:["Read latest news","Donate","Contact BDI","About BDI"],
      links:[{text:"View All News", url:"all-news.html", cls:"primary"}]
    },
    {
      p:["annual report","report","transparency","audit","how money spent","accountability","how donations used","financial statement","pdf"],
      r:"📋 <strong>Transparency & Accountability</strong>\n\nBDI publishes a full annual impact report every year:\n• 📄 2025 Annual Report — request by email\n• 📄 2024 Annual Report — request by email\n• 📄 2023 Annual Report — request by email\n• 📄 2022 Founding Year Report — request by email\n\nEmail <strong>info@basadev.org</strong> to request any report.",
      c:["Annual Reports page","How donations are spent","Donate","Contact BDI"],
      links:[{text:"Annual Reports Page", url:"annual-reports.html", cls:"primary"}]
    },
    {
      p:["501c","501(c)","tax deductible","registered","legal","nonprofit","ngo registration","compliance","dual registration"],
      r:"✅ <strong>Legal Registration</strong>\n\nBDI holds dual registration:\n\n🇱🇷 <strong>Registered NGO in Liberia (2022)</strong>\n🇺🇸 <strong>501(c)(3) nonprofit in the United States</strong>\n\nUS donors may be eligible for tax deductions. This dual status makes BDI a credible partner for African and international institutional funders including UNICEF-level agencies.",
      c:["Annual Reports","How to donate","Institutional donors","Contact BDI"]
    },
    {
      p:["strategic plan","2029","growth","scale","expand","future","ambition","target","goal","vision 2029","$2 million","two million"],
      r:"🚀 <strong>Strategic Plan 2025–2029</strong>\n\nBDI's five-year plan targets:\n• Growth to <strong>$2 million</strong> in annual funding\n• Expansion to all <strong>15 Liberian counties</strong>\n• All 8 programme areas fully operational\n• Deeper UN and institutional partnerships (UNICEF, NaFAA/OPEC Fund)\n• BDI established as a leading West African development institution\n\nCurrently shortlisted for the NaFAA/OPEC Fund fisheries programme — a major milestone.",
      c:["How to donate","Partner with BDI","About BDI","Impact numbers"]
    },
    {
      p:["greenville","waste","clean","city","sanitation","coastal city","sinoe county"],
      r:"🌿 <strong>Greenville Rising</strong>\n\nIn Greenville, Sinoe County, BDI has partnered with local government and businesses to tackle the city's waste management crisis:\n• Structured waste collection systems introduced\n• Community clean-up campaigns organized\n• Local youth trained as environmental stewards\n• Waste-to-enterprise opportunities being explored\n\nGreenville is becoming a model for community-led environmental action in Liberia.",
      c:["Read the full story","Support climate work","Donate","Other programmes"],
      links:[{text:"Read Greenville Story", url:"BDI-Greenville-Rising-news.html", cls:"primary"}]
    },
    {
      p:["crs","catholic relief","menstrual hygiene research","bong","grand bassa","montserrado research"],
      r:"🤝 <strong>BDI × CRS Partnership</strong>\n\nIn July 2023, BDI partnered with <strong>Catholic Relief Services (CRS)</strong> and other organizations to conduct research into menstrual hygiene across:\n• Montserrado County\n• Bong County\n• Grand Bassa County\n\nThis research directly informs BDI's period poverty programmes and helps identify the most underserved communities.",
      c:["End Period Poverty","Read the story","Donate","Contact BDI"],
      links:[{text:"Read CRS Partnership Story", url:"BDI-partners-with-CRS-news.html", cls:"primary"}]
    },
    // ── STRATEGIC PLAN 2025–2029 ───────────────────────
    {
      p:["vision","mission","value","core value","bdi value","what bdi believe","who bdi is","essence"],
      r:"🌟 <strong>BDI Vision, Mission & Core Values</strong>\n\n🎯 <strong>Vision:</strong> A Liberia without poverty, where development is impactful, owned, and implemented by Liberians.\n\n🌍 <strong>Mission:</strong> To empower the youth and women of Liberia and Africa by creating sustainable opportunities and resources that lift them out of poverty and drive impactful, community-owned development.\n\n<strong>BDI's 8 Core Values:</strong>\n🔹 <strong>Integrity</strong> — honesty, transparency, accountability in all actions\n🔹 <strong>Empowerment</strong> — fostering self-reliance and community capacity\n🔹 <strong>Inclusiveness</strong> — all voices heard, especially marginalized groups\n🔹 <strong>Love for People & Country</strong> — genuine passion for humanity and Liberia\n🔹 <strong>Sustainability</strong> — long-term environmental, social, and economic viability\n🔹 <strong>Collaboration</strong> — strong partnerships multiplying impact\n🔹 <strong>Innovation</strong> — creative, evidence-based solutions to complex challenges\n🔹 <strong>Professionalism</strong> — highest standards in all activities",
      c:["Strategic goals","Theory of change","Our programmes","About BDI"]
    },
    {
      p:["ceo foreword","message from ceo","ceo message","katherina message","founder message","what does ceo say","quote","statement from bdi"],
      r:"✍️ <strong>Message from the CEO — Katherina M. Hopkins</strong>\n\n<em>\"When we founded BASA Development Initiatives, we did so with a simple but unshakeable conviction: that Liberians have the capacity, the creativity, and the courage to build the country they deserve. What they often lack are the resources, the systems, and the partners who truly believe in them.\"</em>\n\n<em>\"A Liberia without poverty is not a dream. It is a destination.\"</em>\n\nThis updated strategic plan (2025–2029) expands BDI's scope to include fisheries and aquaculture, strengthens disability inclusion, deepens gender and youth empowerment, and aligns all efforts with Liberia's ARREST Agenda and the UN SDGs.",
      c:["Strategic Plan 2025-2029","About BDI","Our founding story","Donate to BDI"]
    },
    {
      p:["strategic goal","four goal","institutional goal","goal one","goal two","goal three","goal four","plan goal","2025 2029 goal"],
      r:"🎯 <strong>BDI's 4 Strategic Goals (2025–2029)</strong>\n\n<strong>Goal 1:</strong> Empower Youth, Women & Communities to Overcome Poverty Through Integrated Programming — across agriculture, health, education, environment, fisheries, gender, and disability.\n\n<strong>Goal 2:</strong> Ensure Resource Mobilization & Financial Sustainability — through diversified funding, social enterprise, and multi-year donor partnerships.\n\n<strong>Goal 3:</strong> Strengthen Organizational Systems & Institutional Capacity — governance, HR, data management, MEAL.\n\n<strong>Goal 4:</strong> Deepen Community Engagement & Strategic Partnerships — with government, civil society, private sector, and international organizations.",
      c:["Financial trajectory","Programme targets","Theory of change","Donate to BDI"]
    },
    {
      p:["theory of change","how bdi works","approach","pillars","methodology","integrated","community led","evidence based","how change happen"],
      r:"🔄 <strong>BDI's Theory of Change — 3 Pillars</strong>\n\n<strong>Pillar 1: Integrated, Multi-Sector Programming</strong>\nNo single intervention lifts a community out of poverty. BDI's programmes are intentionally interconnected — agriculture links to nutrition, education links to youth employment, environment links to food security, disability inclusion links to everything. We address the whole person, not just the presenting problem.\n\n<strong>Pillar 2: Community-Led Design & Implementation</strong>\nEvery programme begins with scoping assessments and community consultations. BDI does not arrive with pre-packaged solutions — we listen, co-design, and implement with communities as partners, not beneficiaries.\n\n<strong>Pillar 3: Evidence-Based Action & Adaptive Learning</strong>\nBDI invests in research, monitoring, evaluation, and learning to continuously improve programming. Our data-driven approach ensures resources go where they produce the greatest impact.",
      c:["Strategic goals","Our programmes","MEAL framework","Impact numbers"]
    },
    {
      p:["liberia context","liberia development","liberia economy","liberia poverty","liberia gdp","why liberia","liberia challenge","development context","arrest agenda"],
      r:"🇱🇷 <strong>Liberia Development Context (2025)</strong>\n\nLiberia's landscape is one of paradox — rich in resources, resilient in people, yet burdened by structural inequality:\n\n📊 <strong>Economy:</strong> GDP grew 4.0% in 2024; extreme poverty fell to <strong>26.4%</strong> (down from 40.9% in 2022) but 55.6% remain in multidimensional poverty; rural poverty is 81%.\n\n🌾 <strong>Agriculture:</strong> 30% of GDP, 70% of workforce — yet trapped in subsistence farming.\n\n🏥 <strong>Health:</strong> Only 5,000 health workers and ~51 Liberian doctors for 5M+ people.\n\n📚 <strong>Education:</strong> 15–20% of children remain out of school; mean schooling below 5 years.\n\n🌿 <strong>Climate:</strong> Could shrink Liberia's economy by <strong>15%</strong> and push 1.3M into poverty by 2050.\n\nBDI aligns with Liberia's <strong>ARREST Agenda</strong> (Agriculture, Roads, Rule of Law, Education, Sanitation, Tourism), the UN SDGs, AU Agenda 2063, and the World Bank Country Partnership Framework.",
      c:["Our programmes","Strategic goals","Donate to BDI","About BDI"]
    },
    {
      p:["agriculture target","agriculture indicator","agriculture goal","ag objective","crop yield","farmer cooperative","ag programme target","1500 farmer","smallholder target"],
      r:"🌾 <strong>Agriculture Programme Targets (2025–2029)</strong>\n\n<strong>Overall objective:</strong> +20% increase in average crop yields by end of plan period.\n\nKey annual targets:\n• <strong>1,500 farmers</strong> trained in climate-smart agriculture each year\n• <strong>1,000 farmers</strong> receiving improved seeds, tools, and inputs annually\n• <strong>20 cooperatives</strong> strengthened and linked to markets\n• <strong>50% minimum</strong> women and youth participation in agribusiness\n• 6 funding proposals submitted + 8 concept notes annually\n\nApproach includes farmer field schools, cooperative strengthening, post-harvest management, agriculture financing research, and market linkage facilitation.\n\n<em>SDG alignment: SDG 2, SDG 8, SDG 13</em>",
      c:["Agriculture programme","Health targets","Education targets","Our impact"]
    },
    {
      p:["health target","health indicator","health objective","hlth","maternal health","choice heal","menstrual target","health programme target","5000 health","2000 mother"],
      r:"❤️ <strong>Health & Nutrition Programme Targets (2025–2029)</strong>\n\nBDI runs three health sub-programmes: <strong>CHOICE</strong> (maternal & child health), <strong>HEAL-P</strong> (health policy & advocacy), <strong>PREVENT</strong> (preventive health campaigns).\n\n<strong>Overall objective:</strong> 15% improvement in access to health services by end of plan.\n\nKey annual targets:\n• <strong>2,000</strong> mothers and children served through CHOICE annually\n• <strong>5,000</strong> people reached through health education and menstrual health outreach\n• <strong>4</strong> policy briefs/advocacy events for equitable health access\n• -10% reduction in preventable diseases through campaigns\n• 100% of health initiatives integrating gender/youth components\n\n<em>SDG alignment: SDG 3, SDG 2, SDG 5, SDG 17</em>",
      c:["Health programme","Agriculture targets","Education targets","Donate to BDI"]
    },
    {
      p:["education target","education indicator","edu objective","school enrollment","vocational training target","800 youth","digital literacy","500 digital","literacy target"],
      r:"📚 <strong>Education Programme Targets (2025–2029)</strong>\n\n<strong>Overall objective:</strong> 15% increase in enrollment and attendance annually.\n\nKey annual targets:\n• +15% school enrollment increase in underserved communities\n• +20% improvement in literacy and numeracy outcomes\n• <strong>800 youth</strong> trained in vocational and technical skills annually\n• <strong>500 learners/teachers</strong> trained in digital skills annually\n• 50% minimum girls and women benefiting from education programmes\n\nApproach: scholarships, teacher training, vocational centres, digital literacy, disability-inclusive classrooms.\n\n<em>SDG alignment: SDG 4, SDG 5, SDG 8, SDG 9, SDG 10</em>",
      c:["Education programme","Agriculture targets","Health targets","Donate to BDI"]
    },
    {
      p:["environment target","climate target","env objective","500 household","clean energy","5000 campaign","renewable energy","natural resource","25 community group"],
      r:"🌿 <strong>Environment & Climate Programme Targets (2025–2029)</strong>\n\n<strong>Overall objective:</strong> 20% increase in adoption of climate-resilient practices among target groups.\n\nKey annual targets:\n• <strong>25 community groups</strong> trained/engaged in natural resource management\n• <strong>500 households</strong> adopting renewable energy or clean cooking solutions\n• <strong>5,000 people</strong> reached through waste management and sanitation campaigns\n• 50% minimum women/youth leading environmental initiatives\n• 6 funding proposals + 8 concept notes annually\n\nLiberia holds ~40% of the Upper Guinea Forest region's remaining tree cover — BDI is committed to protecting it.\n\n<em>SDG alignment: SDG 6, SDG 7, SDG 12, SDG 13, SDG 15</em>",
      c:["Environment programme","Agriculture targets","Disability targets","Donate to BDI"]
    },
    {
      p:["gender target","youth target","gye objective","1200 participant","100 business","500 youth leadership","entrepreneurship target","gender indicator","microfinance"],
      r:"👩 <strong>Gender & Youth Empowerment Targets (2025–2029)</strong>\n\n<strong>Overall objective:</strong> 20% annual increase in income or leadership roles among participants.\n\nKey annual targets:\n• <strong>1,200 women and youth</strong> trained in vocational, entrepreneurship, and financial literacy\n• <strong>100 businesses</strong> strengthened through access to finance and mentorship\n• <strong>500 youth</strong> engaged in leadership and civic initiatives\n• 100% of BDI programmes integrating women and youth empowerment\n\nApproach: entrepreneurship boot camps, microfinance facilitation, youth leadership clubs, shifting harmful gender norms.\n\nWomen and youth represent over <strong>60% of Liberia's population</strong> yet face systematic exclusion.\n\n<em>SDG alignment: SDG 4, SDG 5, SDG 8, SDG 10</em>",
      c:["Gender programme","Fisheries targets","Disability targets","Donate to BDI"]
    },
    {
      p:["fisheries target","fish target","fish indicator","600 fisher","aquaculture enterprise","50 enterprise","fish income","blue economy","coastal target"],
      r:"🐟 <strong>Fisheries & Aquaculture Targets (2025–2029)</strong>\n\nLiberia's <strong>570km coastline</strong> offers immense untapped potential. Women dominate fish processing and trade but are largely excluded from formal support.\n\n<strong>Overall objective:</strong> 20% increase in sustainable fishing practices annually.\n\nKey annual targets:\n• <strong>600 artisanal fishers</strong> trained in sustainable methods and safety\n• <strong>50 aquaculture enterprises</strong> established or supported for women and youth\n• +15% increase in fisher incomes through value-added products and markets\n• 100% of fisheries projects integrating sustainability and gender/youth inclusion\n\nApproach: responsible fishing training, aquaculture start-up grants, market linkages, marine resource management.\n\n<em>SDG alignment: SDG 2, SDG 5, SDG 8, SDG 13, SDG 14</em>",
      c:["Fisheries programme","Gender targets","Disability targets","Donate to BDI"]
    },
    {
      p:["disability target","pwd target","disability indicator","300 pwd","200 pwd","assistive device","wheelchair","crpd","inclusive school","disability right"],
      r:"♿ <strong>Disability Inclusion Targets (2025–2029)</strong>\n\nPersons with disabilities in Liberia face systematic exclusion from education, employment, healthcare, and public spaces. BDI's commitment to 'leaving no one behind' demands explicit inclusion.\n\n<strong>Overall objective:</strong> +30% increase in PWDs accessing at least one BDI service annually.\n\nKey annual targets:\n• <strong>300 PWDs</strong> receiving assistive devices and rehabilitation support\n• <strong>200 PWDs</strong> completing vocational training and employment support\n• <strong>15 schools</strong> supported with inclusive education infrastructure\n• 4 policy briefs submitted on disability rights (CRPD implementation)\n• By 2027: <strong>100% of BDI programmes</strong> incorporating disability-inclusive design\n\n4 pillars: Direct Services, Inclusive Education, Vocational Training, Policy Advocacy.\n\n<em>SDG alignment: SDG 3, SDG 4, SDG 8, SDG 10, SDG 11</em>",
      c:["Disability programme","Gender targets","Financial trajectory","Donate to BDI"]
    },
    {
      p:["financial trajectory","budget target","$2 million","2 million","funding target","500000","growth phase","scale phase","financial sustainability","funding plan","financial plan"],
      r:"💰 <strong>BDI Financial Trajectory (2025–2029)</strong>\n\n| Period | Annual Budget Target | Key Milestones |\n\n📍 <strong>2022–2024 (Baseline):</strong> $50K–$60K — established operations, trained 600+ farmers, formed core partnerships\n\n📈 <strong>2025–2026 (Growth Phase):</strong> $500,000 — expand all 8 programme areas, secure first multi-year grant, launch social enterprise\n\n🚀 <strong>2027–2029 (Scale Phase):</strong> $1.5M–$2.0M — expand across West Africa, strengthen reserves, achieve donor diversity\n\n<strong>Funding diversification rule:</strong> No single donor to exceed <strong>35% of annual income</strong> by 2027.\n\n<strong>Funding streams:</strong> Institutional grants, INGO consortium grants, individual/corporate philanthropy, diaspora giving, crowdfunding, and social enterprise income from research, web design, and data services.",
      c:["Donate to BDI","Partner with BDI","Strategic goals","Contact BDI"],
      links:[{text:"💳 Support BDI's Growth", url:"https://www.paypal.com/donate/?hosted_button_id=JX22EPUQZZNH6", cls:"primary"},{text:"Partner With BDI", url:"Partner-With-Us.html", cls:"secondary"}]
    },
    {
      p:["cross cutting","theme","gender mainstreaming","climate mainstreaming","localization","community ownership","sdg","sustainable development goal","sdg alignment","agenda 2063","arrest agenda"],
      r:"🔗 <strong>BDI Cross-Cutting Themes</strong>\n\nAcross all 8 programme areas, BDI applies 4 cross-cutting themes:\n\n🟣 <strong>Gender Equality & Social Inclusion</strong> — minimum 50% women and youth in all programmes; disability mainstreamed by 2027; GBV prevention integrated.\n\n🟢 <strong>Climate Resilience</strong> — climate-smart approaches in agriculture, fisheries, and environment; community vulnerability assessments inform all design.\n\n🟡 <strong>Localization & Community Ownership</strong> — all programmes begin with community consultations; local leadership development as a long-term sustainability strategy.\n\n🔵 <strong>Data, Evidence & Learning</strong> — robust MEAL systems; research findings drive programming; annual reviews ensure strategic relevance.\n\n<strong>SDG alignment:</strong> SDG 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17\n<strong>Also aligned with:</strong> Liberia's ARREST Agenda, AU Agenda 2063, World Bank Country Partnership Framework",
      c:["Strategic goals","Theory of change","Our impact","About BDI"]
    },
    {
      p:["where we work","sinoe office","bong office","southeast","greenville office","southeast liberia","target population","who bdi serve","primary beneficiary"],
      r:"🗺️ <strong>Where BDI Works & Who We Serve</strong>\n\n<strong>Office locations:</strong>\n🏢 <strong>HQ:</strong> Monrovia (national & international coordination)\n🏢 <strong>Southeast Office:</strong> Greenville, Sinoe County (least developed region)\n🏢 <strong>Satellite Office:</strong> Bong County (central & northern coverage)\n🇬🇭 <strong>Ghana Office:</strong> Accra, Westland Haasto\n🇺🇸 <strong>US Fundraising Office:</strong> Eagan, Minnesota\n\n<strong>Primary target populations:</strong>\n• Youth below age 35 — agribusiness, vocational training, entrepreneurship\n• Women and girls — entrepreneurship, maternal health, menstrual hygiene, GBV protection\n• Smallholder farmers and cooperatives — subsistence to commercial transition\n• Artisanal fishers and fish processors in coastal communities\n• Persons with disabilities — education, employment, healthcare\n• Marginalized and remote communities in the Southeast, urban slums, and environmentally vulnerable areas",
      c:["Contact BDI","Our programmes","Strategic goals","Donate to BDI"]
    },
    // ── Policies & Safeguarding ───────────────────
    {
      p:["policy","policies","code of conduct","safeguard","psea","sexual exploitation","abuse","protection","document","procedure","manual","compliance"],
      r:"📋 <strong>BDI Policies & Governance Documents</strong>\n\nBDI operates under a comprehensive set of board-approved policies:\n\n🛡️ <strong>Code of Conduct</strong> — zero-tolerance on sexual exploitation and abuse (PSEA), effective Jan 2026\n👧 <strong>Child Protection Policy</strong> — protecting all child beneficiaries across every programme\n⚖️ <strong>Fraud & Corruption Policy</strong> — zero-tolerance, approved June 2023\n🔒 <strong>Conflict of Interest Policy</strong> — full disclosure standards, June 2023\n🤝 <strong>Protection from SHEA Policy</strong> — sexual harassment, exploitation and abuse prevention\n💚 <strong>Gender & Social Inclusion Policy</strong> — February 2022\n🌿 <strong>Environmental Policy</strong> — November 2023\n🏥 <strong>Health & Safety Policy</strong> — all staff, volunteers, and beneficiaries\n📊 <strong>MEAL Policy</strong> — Monitoring, Evaluation, Accountability & Learning, effective Jan 2026\n\nAll policies are approved by BDI's Board of Directors.",
      c:["MEAL framework","PSEA & safeguarding","Child protection","Governance structure"]
    },
    {
      p:["psea","sexual exploitation","abuse","harassment","exploitation","gender-based violence","gbv","sexual abuse","shea"],
      r:"🛡️ <strong>PSEA — Prevention of Sexual Exploitation & Abuse</strong>\n\nBDI has a <strong>zero-tolerance policy</strong> on all forms of sexual exploitation and abuse. This is embedded in:\n• The Code of Conduct (effective Jan 2026, Board-approved)\n• Protection from SHEA Policy (June 2023)\n• PSEA-specific reference checks on all new hires\n• Victim assistance and referral pathways\n• Mandatory PSEA training and certification for all staff\n• Donor compliance crosswalk with PSEA standards\n\nAny reports of SHEA are handled with full confidentiality, whistleblower protections, and reported to appropriate authorities. Contact <strong>info@basadev.org</strong> to report a concern.",
      c:["Child protection","Code of conduct","Our governance","Contact BDI"]
    },
    {
      p:["child protection","child abuse","children","beneficiary protection","safeguarding children","student safety"],
      r:"👧 <strong>Child Protection Policy</strong>\n\nBDI fully recognizes its responsibility to protect every child beneficiary in its programmes:\n• <strong>Zero tolerance</strong> for any form of child abuse\n• All allegations are investigated thoroughly\n• Incidents reported to appropriate authorities immediately\n• Child/student: any direct beneficiary of a BASA programme (not age-restricted)\n• Child-sensitive reporting channels in place (approved Jan 2026)\n\nBDI's child protection standards apply to all staff, volunteers, partners, and contractors — no exceptions.",
      c:["PSEA safeguarding","Our governance","Contact BDI","Volunteer with BDI"]
    },
    {
      p:["meal","monitoring","evaluation","accountability","learning","results","data","evidence","impact measurement","performance"],
      r:"📊 <strong>MEAL — Monitoring, Evaluation, Accountability & Learning</strong>\n\nBDI's MEAL Policy (effective January 2026, Board-approved) governs how we:\n• <strong>Monitor</strong> — track programme performance continuously against indicators\n• <strong>Evaluate</strong> — measure change and programme outcomes\n• <strong>Ensure accountability</strong> — to donors, communities, and partners\n• <strong>Learn</strong> — integrate findings into programme improvement\n\nAll interventions — donor-funded, government-supported, or internally financed — are guided by evidence, implemented with integrity, and evaluated against defined objectives.\n\nBDI reviews its MEAL framework every three years.",
      c:["Annual Reports","Transparency","Our impact","Contact BDI"]
    },
    {
      p:["hr","human resource","employment","staff","recruitment","apply","hiring","onboarding","leave","salary","benefits","workplace","personnel"],
      r:"💼 <strong>HR & Employment at BDI</strong>\n\nBDI operates under a comprehensive HR Employee Manual (February 2022) covering:\n• Non-discrimination and equal opportunity\n• Confidentiality obligations for all staff\n• Performance review and planning cycles\n• Employee orientation and onboarding\n• Leave policies, personnel files, and data management\n• Corrective action and employment separation procedures\n\nBDI is committed to investing in its workforce through the <strong>Training & Development Policy</strong> (November 2023) — recognizing staff growth as both a strategic priority and a moral responsibility.",
      c:["Career opportunities","Volunteer with BDI","Contact BDI","About BDI"]
    },
    {
      p:["procurement","tender","bid","contract","supplier","vendor","purchase","buy","purchase process"],
      r:"📦 <strong>Procurement at BDI</strong>\n\nBDI's Procurement Policy (February 2022) ensures transparent and fair purchasing:\n\n🔹 <strong>Small purchases</strong> — simplified process for low-value items\n🔹 <strong>Medium purchases</strong> — structured comparison and approval\n🔹 <strong>Competitive sealed bids</strong> — for larger contracts\n🔹 <strong>Competitive negotiations</strong> — for complex or specialized services\n🔹 <strong>Noncompetitive negotiations</strong> — for sole-source situations only\n\nBDI gives priority to <strong>locally owned, minority-owned, female-owned, and small businesses</strong> — reflecting our commitment to community economic development.",
      c:["Partner with BDI","Contact BDI","About BDI","Governance structure"]
    },
    {
      p:["financial","finance","accounting","budget","expenditure","income","audit","fiscal","fund management","fund use"],
      r:"💰 <strong>Financial Management at BDI</strong>\n\nBDI operates under a rigorous Financial Manual (February 2022, updated August 2024) covering:\n• Accounting policies and general ledger management\n• Income tracking and expenditure controls\n• Currency of account and multi-office reconciliation\n• Taxation compliance under Liberian law\n• Transparent donor fund management\n\nAll finances are governed by BDI's Board of Directors and subject to independent audit. BDI maintains a <strong>zero-tolerance policy on fraud and corruption</strong> with full whistleblower protections for any reporting.",
      c:["Annual Reports","How donations are spent","Audited financials","Contact BDI"],
      links:[{text:"How Donations Are Spent", url:"how-donations-are-spent.html", cls:"primary"},{text:"Audited Financials", url:"audited-financials.html", cls:"secondary"}]
    },
    {
      p:["gender policy","social inclusion","inclusion policy","gender equality","women policy","diversity"],
      r:"👩 <strong>Gender & Social Inclusion Policy</strong>\n\nBDI's Gender and Social Inclusion Policy (February 2022) is built on:\n\n<strong>Vision:</strong> A Liberia where women, youth, and marginalized groups lead and benefit equally from development.\n\n<strong>Strategic pillars:</strong>\n• Enabling environment for gender equality within BDI itself\n• HR policies that promote equal opportunity\n• Gender-responsive programme design across all 8 areas\n• Inclusive leadership at all levels\n\nThis policy directly shapes how BDI designs and delivers every programme — from agriculture to health to climate action.",
      c:["Gender & Youth programme","Women in agribusiness","Donate","Our governance"]
    },
    {
      p:["training","capacity","staff development","professional development","learning","skills","workshop","coaching"],
      r:"📚 <strong>Training & Development at BDI</strong>\n\nBDI's Training & Development Policy (November 2023) reflects the belief that:\n<em>\"Staff development is not only a strategic priority but also a moral responsibility.\"</em>\n\nBDI invests in:\n• Continuous learning and professional development for all staff\n• Capacity building to respond to evolving development challenges\n• Skills development for volunteers and partners\n• PSEA mandatory training and certification\n\nIn Liberia's rapidly changing context, a skilled and motivated team is how BDI delivers impact.",
      c:["Career opportunities","Volunteer with BDI","Contact BDI","About BDI"]
    },
    {
      p:["health safety","workplace safety","fieldwork","risk","accident","emergency","staff wellbeing","occupational"],
      r:"🏥 <strong>Health & Safety at BDI</strong>\n\nBDI's Health & Safety Policy (November 2023, Board-approved) covers:\n• Safe working environments for all employees, volunteers, consultants, beneficiaries, and partners\n• Risk management for fieldwork in rural and remote communities\n• Travel safety protocols on challenging roads\n• Health-related hazard identification and mitigation\n• Post-conflict environment sensitivities specific to Liberia\n\nThe safety and wellbeing of everyone involved in BDI's work is treated as non-negotiable.",
      c:["Career opportunities","Volunteer with BDI","Contact BDI","About BDI"]
    },
    {
      p:["whistleblow","report concern","misconduct","complaint","grievance","bully","harassment","report issue","raise concern"],
      r:"📢 <strong>Reporting Concerns at BDI</strong>\n\nBDI takes all concerns seriously with full whistleblower protections:\n\n🔒 All reports are handled <strong>confidentially</strong>\n🛡️ <strong>No retaliation</strong> against anyone raising a genuine concern\n📋 Defined investigation processes for all allegations\n⚖️ Consequences for proven violations up to and including termination\n\n<strong>What you can report:</strong>\n• Fraud, corruption, or financial misconduct\n• Sexual harassment, exploitation, or abuse\n• Child abuse or safeguarding violations\n• Harassment, bullying, or grievances\n• Conflict of interest violations\n\nContact: <strong>info@basadev.org</strong>",
      c:["PSEA safeguarding","Child protection","Governance structure","Contact BDI"]
    },
    {
      p:["newsletter","latest news","quarterly","update from field","bdi news","bdi update","what's new"],
      r:"📰 <strong>BDI Latest Newsletter</strong>\n\nBDI publishes a quarterly newsletter packed with:\n• Impact stories from the field in Liberia and Ghana\n• Programme milestones and community voices\n• New partnerships and funding achievements\n• Upcoming events and volunteer opportunities\n\nThe latest edition is available in our <strong>Resource Centre</strong> on the website. Subscribe to receive future editions directly to your inbox — use the newsletter form on any page or email <strong>info@basadev.org</strong>.",
      c:["Subscribe to newsletter","Read all news","Donate","Contact BDI"],
      links:[{text:"View Newsletter", url:"newsletter.html", cls:"primary"},{text:"All News & Stories", url:"all-news.html", cls:"secondary"}]
    },
    {
      p:["job","vacancy","gender youth coordinator","coordinator","officer","position available","current opening","job opening"],
      r:"💼 <strong>Current Job Openings at BDI</strong>\n\nBDI is currently advertising the following position:\n\n👩‍💼 <strong>Gender & Youth Coordinator</strong>\nThis role leads BDI's gender and youth empowerment programme — supporting women in agribusiness, menstrual health outreach, and youth leadership initiatives across Liberia.\n\n<strong>How to apply:</strong> Download the full job description from our Career Portal and email your CV and cover letter to <strong>info@basadev.org</strong>.\n\nBDI is an equal opportunity employer committed to gender equality and inclusion.",
      c:["Career Portal","Volunteer instead","Contact BDI","About BDI"],
      links:[{text:"Visit Career Portal", url:"career-portal.html", cls:"primary"}]
    },
    {
      // fallback — always last
      p:[],
      r:"That's a great question — I don't have a specific answer for that right now. Here's how to get direct help:\n\n📧 <strong>Email:</strong> info@basadev.org\n📱 <strong>Phone:</strong> +231 770 457 572\n🌐 Use the navigation menu to browse our website\n\nOur team usually responds within one business day.",
      c:["What does BDI do?","How can I donate?","Contact BDI","Volunteer with BDI"],
      links:[{text:"📬 Contact BDI", url:"contact.html", cls:"primary"}]
    }
  ];

  // ── Helpers ──────────────────────────────────────────
  function getTime(){var d=new Date(),h=d.getHours(),m=d.getMinutes(),ap=h>=12?"PM":"AM";h=h%12||12;return h+":"+(m<10?"0"+m:m)+" "+ap;}
  function renderText(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");}
  function matchKb(input) {
    var q = input.toLowerCase().trim();
    var bestScore = 0;
    var bestEntry = kb[kb.length - 1]; // default fallback

    for (var i = 0; i < kb.length - 1; i++) {
      var score = 0;
      for (var j = 0; j < kb[i].p.length; j++) {
        var pat = kb[i].p[j];
        if (q.indexOf(pat) > -1) {
          // Longer patterns = more specific = higher score
          // Exact word boundary bonus: multiply by 1.5 if pattern is a whole word
          var bonus = (new RegExp('\\b' + pat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b')).test(q) ? 1.5 : 1;
          score += pat.length * bonus;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestEntry = kb[i];
      }
    }
    return bestEntry;
  }

  // ── Render ───────────────────────────────────────────
  var msgEl=document.getElementById("ask-basa-messages");
  function addMsg(text,role,chips,links){
    var row=document.createElement("div");
    row.className="basa-row "+(role==="bot"?"basa-bot":"basa-user");
    var bubble=document.createElement("div");
    bubble.className="basa-bubble";
    bubble.innerHTML=renderText(text);
    row.appendChild(bubble);
    if(links&&links.length){
      var btnRow=document.createElement("div");
      btnRow.className="basa-btn-row";
      links.forEach(function(l){
        var a=document.createElement("a");
        a.className="basa-donate-btn "+(l.cls||"primary");
        a.href=l.url; a.textContent=l.text;
        if(l.url.startsWith("http")){a.target="_blank";a.rel="noopener";}
        btnRow.appendChild(a);
      });
      row.appendChild(btnRow);
    }
    if(chips&&chips.length){
      var ch=document.createElement("div"); ch.className="basa-chips";
      chips.forEach(function(c){var b=document.createElement("button");b.className="basa-chip";b.textContent=c;b.addEventListener("click",function(){sendMsg(c);});ch.appendChild(b);});
      row.appendChild(ch);
    }
    var t=document.createElement("div"); t.className="basa-time"; t.textContent=getTime(); row.appendChild(t);
    msgEl.appendChild(row); msgEl.scrollTop=msgEl.scrollHeight;
  }
  function showTyping(){var r=document.createElement("div");r.className="basa-typing-row";r.id="basa-typing";r.innerHTML="<div class='basa-typing'><span></span><span></span><span></span></div>";msgEl.appendChild(r);msgEl.scrollTop=msgEl.scrollHeight;}
  function hideTyping(){var t=document.getElementById("basa-typing");if(t)t.remove();}
  function sendMsg(text){
    if(!text.trim())return;
    addMsg(text,"user"); document.getElementById("ask-basa-input").value="";
    showTyping();
    setTimeout(function(){hideTyping();var res=matchKb(text);addMsg(res.r,"bot",res.c,res.links);playTone();},750+Math.random()*550);
  }

  // ── Open / Close ─────────────────────────────────────
  var win=document.getElementById("ask-basa-window");
  var launcher=document.getElementById("ask-basa-launcher");
  var badge=document.getElementById("ask-basa-badge");
  var tooltip=document.getElementById("ask-basa-tooltip");
  var opened=false;

  function openChat(){
    win.classList.add("basa-open");
    launcher.classList.add("basa-launcher-open");
    if(badge)badge.style.display="none";
    if(tooltip)tooltip.classList.remove("basa-tip-show");
    if(!opened){
      opened=true;
      setTimeout(function(){
        addMsg("Hello! 👋 I can help you learn about our work, how to donate, volunteer, partner with us, and more. What would you like to know?","bot",
          ["What does BDI do?","How can I donate?","Where do you work?","How to get involved?"]);
        playTone();
      },400);
    }
    setTimeout(function(){var i=document.getElementById("ask-basa-input");if(i)i.focus();},350);
  }
  function closeChat(){win.classList.remove("basa-open");launcher.classList.remove("basa-launcher-open");}

  launcher.addEventListener("click",function(e){e.stopPropagation();win.classList.contains("basa-open")?closeChat():openChat();});
  document.getElementById("ask-basa-close-win").addEventListener("click",closeChat);
  document.getElementById("ask-basa-send").addEventListener("click",function(){sendMsg(document.getElementById("ask-basa-input").value);});
  document.getElementById("ask-basa-input").addEventListener("keydown",function(e){if(e.key==="Enter")sendMsg(this.value);});
  document.addEventListener("click",function(e){if(win.classList.contains("basa-open")&&!win.contains(e.target)&&!launcher.contains(e.target))closeChat();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeChat();});

  // ── Attention tooltip (after 4s if not opened) ──────
  setTimeout(function(){
    if(!opened&&tooltip){
      tooltip.classList.add("basa-tip-show");
      setTimeout(function(){tooltip.classList.remove("basa-tip-show");},5000);
    }
  },4000);

  // ── Back-to-top: 90% threshold + mix-blend-mode ─────
  document.addEventListener("DOMContentLoaded",function(){
    var btt=document.querySelector(".back-to-top");
    if(!btt)return;
    btt.style.cssText=[
      "position:fixed!important","bottom:100px!important","right:28px!important",
      "width:42px!important","height:42px!important","border-radius:50%!important",
      "background:#ffffff!important","color:#000000!important",
      "display:flex!important","align-items:center!important","justify-content:center!important",
      "mix-blend-mode:difference!important",
      "opacity:0!important","pointer-events:none!important",
      "transition:opacity 0.35s ease, transform 0.2s ease!important",
      "z-index:9980!important","box-shadow:0 2px 12px rgba(0,0,0,0.18)!important",
      "text-decoration:none!important","font-size:14px!important"
    ].join(";");
    window.addEventListener("scroll",function(){
      var pct=window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
      if(pct>=90){btt.style.setProperty("opacity","1","important");btt.style.setProperty("pointer-events","all","important");}
      else{btt.style.setProperty("opacity","0","important");btt.style.setProperty("pointer-events","none","important");}
    });
  });

})();
