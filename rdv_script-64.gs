// APP RESERVATION PRO — Chez Romu — Version finale complète

var CONFIG = {
  NOM: "Chez Romu",
  ADRESSE: "Route de chez Romu",
  TEL: "04 72 00 00 00",
  EMAIL_PRO: "",
  EMOJI: "💈",
  DUREE: 30,
  HEURE_DEBUT: "09:00",
  HEURE_FIN: "19:00",
  MOT_DE_PASSE: "salon2026",
  SERVICES: [
    { nom: "Coupe homme", duree: 30, prix: 20, isNew: false },
    { nom: "Coupe femme", duree: 45, prix: 35, isNew: false },
    { nom: "Barbe", duree: 20, prix: 15, isNew: false },
    { nom: "Coupe et Barbe", duree: 50, prix: 30, isNew: false },
    { nom: "Coloration", duree: 90, prix: 65, isNew: false },
    { nom: "Brushing", duree: 30, prix: 25, isNew: false },
    { nom: "Massage", duree: 60, prix: 45, isNew: true }
  ]
};

// ═══ SHEETS ═══
function getSheetRDV() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("RDV");
  if (!ws) {
    ws = ss.insertSheet("RDV");
    ws.getRange(1,1,1,11).setValues([["ID","Date","Heure","Client","Tel","Email","Service","Prix","Duree","Statut","Coiffeuse"]]);
  }
  return ws;
}

function getSheetCoiff() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Coiffeuses");
  if (!ws) {
    ws = ss.insertSheet("Coiffeuses");
    ws.getRange(1,1,1,6).setValues([["Nom","Debut","Fin","Conges","Prime","Couleur"]]);
    ws.appendRow(["Biniouf","09:00","19:00","",0,"#CCE5FF"]);
    ws.appendRow(["Remilienne","09:00","19:00","",0,"#FFF176"]);
  }
  return ws;
}

function getSheetFourn() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Fournisseurs");
  if (!ws) {
    ws = ss.insertSheet("Fournisseurs");
    ws.getRange(1,1,1,5).setValues([["Nom","Produits","Tel","Email","Notes"]]);
  }
  return ws;
}

function getSheetCmd() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Commandes");
  if (!ws) {
    ws = ss.insertSheet("Commandes");
    ws.getRange(1,1,1,6).setValues([["Date","Fournisseur","Produit","Quantite","Prix","Statut"]]);
  }
  return ws;
}

function getSheetSalaires() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Salaires");
  if (!ws) {
    ws = ss.insertSheet("Salaires");
    ws.getRange(1,1,1,6).setValues([["Mois","Coiffeuse","Salaire base","Prime","Total","Statut"]]);
  }
  return ws;
}

function getSheetConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Config");
  if (!ws) {
    ws = ss.insertSheet("Config");
    ws.getRange(1,1,1,2).setValues([["Cle","Valeur"]]);
    ws.appendRow(["message_email", "C est avec plaisir que nous confirmons votre rendez-vous !"]);
  }
  return ws;
}

function getConfig(cle) {
  var ws = getSheetConfig();
  if (ws.getLastRow() < 2) return "";
  var vals = ws.getRange(2,1,ws.getLastRow()-1,2).getValues();
  for (var i=0; i<vals.length; i++) {
    if (vals[i][0] === cle) return vals[i][1];
  }
  return "";
}

function setConfig(cle, valeur) {
  var ws = getSheetConfig();
  if (ws.getLastRow() > 1) {
    var vals = ws.getRange(2,1,ws.getLastRow()-1,2).getValues();
    for (var i=0; i<vals.length; i++) {
      if (vals[i][0] === cle) { ws.getRange(i+2,2).setValue(valeur); return; }
    }
  }
  ws.appendRow([cle, valeur]);
}

function getSheetPromos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Promos");
  if (!ws) {
    ws = ss.insertSheet("Promos");
    ws.getRange(1,1,1,4).setValues([["Code","Reduction","Type","Actif"]]);
  }
  return ws;
}

function getSheetAvis() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName("Avis");
  if (!ws) {
    ws = ss.insertSheet("Avis");
    ws.getRange(1,1,1,5).setValues([["Date","Nom","Note","Commentaire","Service"]]);
  }
  return ws;
}

// ═══ HELPERS ═══
function toMin(t) { var p=t.split(":"); return parseInt(p[0])*60+parseInt(p[1]); }
function toTime(m) { var h=Math.floor(m/60),mn=m%60; return (h<10?"0":"")+h+":"+(mn<10?"0":"")+mn; }
function tomorrow() { var d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; }
function maxDate() { var d=new Date(); d.setDate(d.getDate()+60); return d.toISOString().split("T")[0]; }
function svcColor(svc) {
  var s=String(svc).toLowerCase();
  if(s.indexOf("coupe et barbe")>-1) return "#8B5CF6";
  if(s.indexOf("coupe homme")>-1) return "#3B82F6";
  if(s.indexOf("coupe femme")>-1) return "#EC4899";
  if(s.indexOf("barbe")>-1) return "#F59E0B";
  if(s.indexOf("coloration")>-1) return "#EF4444";
  if(s.indexOf("massage")>-1) return "#10B981";
  if(s.indexOf("brushing")>-1) return "#06B6D4";
  return "#6366F1";
}

function getRDVs() {
  var ws = getSheetRDV();
  if (ws.getLastRow()<2) return [];
  return ws.getRange(2,1,ws.getLastRow()-1,11).getValues().map(function(r) {
    if (r[1] instanceof Date) r[1]=Utilities.formatDate(r[1],"Europe/Paris","yyyy-MM-dd");
    else r[1]=String(r[1]).substring(0,10);
    if (r[2] instanceof Date) r[2]=Utilities.formatDate(r[2],"Europe/Paris","HH:mm");
    else r[2]=String(r[2]).substring(0,5);
    return r;
  });
}

function getCoiffs() {
  var ws = getSheetCoiff();
  var data = {};
  if (ws.getLastRow()>1) {
    ws.getRange(2,1,ws.getLastRow()-1,6).getValues().forEach(function(r){
      data[r[0]]={debut:r[1],fin:r[2],conges:r[3],prime:r[4],couleur:r[5]||"#E8E8E8"};
    });
  }
  return data;
}

// ═══ ROUTING ═══
function doGet(e) {
  var p = e.parameter.page || "home";
  if (p==="creneaux") return apiCreneaux(e);
  if (p==="confirmer") return pageConfirmer(e);
  if (p==="admin") return pageAdmin(e);
  if (p==="annuler") return pageAnnuler(e);
  if (p==="saveajout") return pageSaveAjout(e);
  if (p==="editcoiff") return pageEditCoiff(e);
  if (p==="savecoiff") return pageSaveCoiff(e);
  if (p==="ajoutcoiff") return pageAjoutCoiff(e);
  if (p==="saveajoutcoiff") return pageSaveAjoutCoiff(e);
  if (p==="fournisseurs") return pageFournisseurs(e);
  if (p==="savefournisseur") return pageSaveFournisseur(e);
  if (p==="commandes") return pageCommandes(e);
  if (p==="savecommande") return pageSaveCommande(e);
  if (p==="planning") return pagePlanning(e);
  if (p==="salaires") return pageSalaires(e);
  if (p==="savesalaire") return pageSaveSalaire(e);
  if (p==="avis") return pageAvis(e);
  if (p==="saveavis") return pageSaveAvis(e);
  if (p==="qrcode") return pageQRCode(e);
  if (p==="colorier") return pageColorier(e);
  if (p==="recherche") return pageRecherche(e);
  if (p==="historique") return pageHistorique(e);
  if (p==="promos") return pagePromos(e);
  if (p==="savepromo") return pageSavePromo(e);
  if (p==="deletepromo") return pageDeletePromo(e);
  if (p==="message") return pageMessage(e);
  if (p==="savemessage") return pageSaveMessage(e);
  return pageHome();
}

// ═══ API CRENEAUX ═══
function apiCreneaux(e) {
  var date=e.parameter.date, duree=parseInt(e.parameter.duree)||CONFIG.DUREE;
  var pris=[];
  getRDVs().forEach(function(r){ if(r[1]===date&&r[9]!=="Annule") pris.push({h:r[2],d:parseInt(r[8])||30}); });
  var ok=[], debut=toMin(CONFIG.HEURE_DEBUT), fin=toMin(CONFIG.HEURE_FIN);
  for(var t=debut;t+duree<=fin;t+=CONFIG.DUREE){
    var h=toTime(t), libre=true;
    pris.forEach(function(p){ var ps=toMin(p.h),pe=ps+p.d; if(t<pe&&t+duree>ps) libre=false; });
    if(libre) ok.push(h);
  }
  return ContentService.createTextOutput(JSON.stringify({creneaux:ok})).setMimeType(ContentService.MimeType.JSON);
}

// ═══ CONFIRMER RDV ═══
function pageConfirmer(e) {
  var ws=getSheetRDV();
  var id="RDV-"+ws.getLastRow().toString().padStart(4,"0");
  var cf=e.parameter.coiffeuse||"Pas de preference";
  ws.appendRow([id,e.parameter.date,e.parameter.heure,e.parameter.nom,e.parameter.tel,
    e.parameter.email||"",e.parameter.service,e.parameter.prix,e.parameter.duree,"Confirme",cf]);
  // Couleur statut et coiffeuse
  var lastRow = ws.getLastRow();
  var coiffData2 = getCoiffs();
  var coiffColors2 = {"Pas de preference":"#E8E8E8"};
  Object.keys(coiffData2).forEach(function(n){coiffColors2[n]=coiffData2[n].couleur||"#E8E8E8";});
  ws.getRange(lastRow, 10).setBackground("#d4edda").setFontColor("#27ae60");
  ws.getRange(lastRow, 11).setBackground(coiffColors2[cf] || "#E8E8E8");
  if(e.parameter.email&&e.parameter.email.indexOf("@")>0){
    try{
      var msgPerso = getConfig("message_email") || "C est avec plaisir que nous confirmons votre rendez-vous !";
      MailApp.sendEmail(e.parameter.email,"RDV confirme - "+CONFIG.NOM,
      "Bonjour "+e.parameter.nom+",\n\n"+msgPerso+"\n\n"+
      "Date      : "+e.parameter.date+"\nHeure     : "+e.parameter.heure+"\nService   : "+
      e.parameter.service+"\nCoiffeuse : "+cf+"\nPrix      : "+e.parameter.prix+" EU\n\n"+
      "A bientot !\nL equipe "+CONFIG.NOM+"\n"+CONFIG.TEL); }catch(err){}
  }
  var url=ScriptApp.getService().getUrl();
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0F0F1A;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center}'
    +'.card{background:#161622;border:1.5px solid rgba(99,102,241,.3);border-radius:14px;padding:16px;width:100%;max-width:340px;text-align:left;margin-bottom:16px}'
    +'.row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #21213A;font-size:14px}'
    +'.row:last-child{border-bottom:none;font-weight:700;color:#6366F1;font-size:16px}.lbl{color:#666}'
    +'.btn{display:block;width:100%;max-width:340px;padding:14px;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;text-align:center;margin-bottom:8px}'
    +'</style></head><body>'
    +'<div style="font-size:72px;margin-bottom:16px">✅</div>'
    +'<div style="font-size:22px;font-weight:800;color:#10B981;margin-bottom:6px">RDV Confirme !</div>'
    +'<div style="font-size:13px;color:#666;margin-bottom:20px">Votre reservation est enregistree</div>'
    +'<div class="card">'
    +'<div class="row"><span class="lbl">Service</span><span>'+e.parameter.service+'</span></div>'
    +'<div class="row"><span class="lbl">Date</span><span>'+e.parameter.date+'</span></div>'
    +'<div class="row"><span class="lbl">Heure</span><span>'+e.parameter.heure+'</span></div>'
    +'<div class="row"><span class="lbl">Coiffeuse</span><span>'+cf+'</span></div>'
    +'<div class="row"><span class="lbl">Client</span><span>'+e.parameter.nom+'</span></div>'
    +'<div class="row"><span class="lbl">Prix</span><span>'+e.parameter.prix+' EU</span></div>'
    +'</div>'
    +'<div style="color:#333;font-size:11px;margin-bottom:16px">Ref : '+id+'</div>'
    +'<a href="'+url+'" style="background:#6366F1;color:#fff" class="btn">Nouveau RDV</a>'
    +'<a href="tel:'+CONFIG.TEL+'" style="background:#161622;color:#666;border:1.5px solid #21213A" class="btn">Appeler</a>'
    +'</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ ANNULER ═══
function pageAnnuler(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Mot de passe incorrect",url,e.parameter.pwd);
  var ws=getSheetRDV(), vals=ws.getDataRange().getValues();
  for(var i=1;i<vals.length;i++){
    if(vals[i][0]===e.parameter.id){ ws.getRange(i+1,10).setValue("Annule");
      return redirect(url+"?page=admin&pwd="+e.parameter.pwd,"RDV annule !"); }
  }
  return err("RDV introuvable",url,e.parameter.pwd);
}

// ═══ SAVE AJOUT RDV ═══
function pageSaveAjout(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  var ws=getSheetRDV();
  var id="RDV-"+ws.getLastRow().toString().padStart(4,"0");
  ws.appendRow([id,e.parameter.date,e.parameter.heure,e.parameter.nom,e.parameter.tel,"",
    e.parameter.service,e.parameter.prix||0,30,"Confirme",e.parameter.coiffeuse||"Pas de preference"]);
  return redirect(url+"?page=admin&pwd="+e.parameter.pwd,"RDV "+id+" ajoute !");
}

// ═══ EDIT COIFF ═══
function pageEditCoiff(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var nom = e.parameter.nom;
  var coiffs = getCoiffs();
  var d = coiffs[nom] || {debut:"09:00", fin:"19:00", conges:"", prime:0};
  var emojis = {"Biniouf":"💇","Remilienne":"💅"};
  var emoji = emojis[nom] || "💇";
  var jours = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  var joursHTML = "";
  jours.forEach(function(j) {
    joursHTML += '<label style="display:flex;align-items:center;gap:10px;padding:10px;background:#111;border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:14px;font-weight:600;color:#fff">'
      + '<input type="checkbox" name="jour_' + j + '" value="' + j + '" style="width:20px;height:20px;accent-color:#6366F1"> ' + j
      + '</label>';
  });

  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<base target="_top">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;align-items:center;gap:12px}'
    + '.av{width:44px;height:44px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px}'
    + '.hdr h1{font-size:17px;font-weight:700}'
    + '.ct{padding:16px}'
    + '.sec{background:#1a1a2e;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #21213A}'
    + '.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}'
    + '.lbl{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:12px}'
    + '.lbl:first-child{margin-top:0}'
    + 'input[type=time],input[type=date],input[type=number],input[type=text]{width:100%;padding:13px;background:#111;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    + '.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px}'
    + '.sbtn{width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:6px;font-family:sans-serif}'
    + '.rbtn{display:block;text-align:center;padding:13px;background:#1a1a2e;color:#888;border-radius:10px;font-size:14px;text-decoration:none;margin-top:10px;border:1px solid #21213A}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><div class="av">' + emoji + '</div><h1>Modifier ' + nom + '</h1></div>'
    + '<div class="ct">'
    + '<form id="f" action="' + url + '" method="get">'
    + '<input type="hidden" name="page" value="savecoiff">'
    + '<input type="hidden" name="pwd" value="' + e.parameter.pwd + '">'
    + '<input type="hidden" name="nom" value="' + nom + '">'
    + '<input type="hidden" name="joff" id="joff" value="">'
    + '<div class="sec"><div class="st">Horaires</div>'
    + '<div class="r2">'
    + '<div><span class="lbl">Debut</span><input type="time" name="debut" value="' + d.debut + '"></div>'
    + '<div><span class="lbl">Fin</span><input type="time" name="fin" value="' + d.fin + '"></div>'
    + '</div></div>'
    + '<div class="sec"><div class="st">Jours de repos</div>'
    + joursHTML
    + '</div>'
    + '<div class="sec"><div class="st">Conges et vacances</div>'
    + '<span class="lbl">Jours specifiques</span>'
    + '<input type="text" name="conges" placeholder="2026-04-15, 2026-04-20">'
    + '<div class="r2" style="margin-top:12px">'
    + '<div><span class="lbl">Vacances du</span><input type="date" name="vdebut"></div>'
    + '<div><span class="lbl">Au</span><input type="date" name="vfin"></div>'
    + '</div></div>'
    + '<div class="sec"><div class="st">Prime EU</div>'
    + '<input type="number" name="prime" value="' + d.prime + '" placeholder="0">'
    + '</div>'
    + '<button type="button" class="sbtn" onclick="sv()">Enregistrer</button>'
    + '</form>'
    + '<a href="' + url + '?page=admin&pwd=' + e.parameter.pwd + '" class="rbtn">Retour</a>'
    + '<div class="safe"></div>'
    + '</div>'
    + '<script>'
    + 'function sv(){'
    + '  var o=[];'
    + '  document.querySelectorAll("input[type=checkbox]").forEach(function(c){if(c.checked)o.push(c.value);});'
    + '  document.getElementById("joff").value=o.join(",");'
    + '  document.getElementById("f").submit();'
    + '}'
    + '</script>'
    + '</body></html>';

  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ SAVE COIFF ═══
function pageSaveCoiff(e) {
  var url = ScriptApp.getService().getUrl();
  var adminUrl = url + "?page=admin&pwd=" + e.parameter.pwd;
  
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) {
    return HtmlService.createHtmlOutput("<p>Erreur</p><a href='" + adminUrl + "'>Retour</a>")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  try {
    var nom = e.parameter.nom || "";
    var debut = e.parameter.debut || "09:00";
    var fin = e.parameter.fin || "19:00";
    var prime = e.parameter.prime || "0";
    var conges = "";
    var jours = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
    var joursOff = [];
    jours.forEach(function(j) { if (e.parameter["jour_"+j]) joursOff.push(j); });
    if (joursOff.length > 0) conges += "Repos:" + joursOff.join(",") + " ";
    if (e.parameter.conges) conges += e.parameter.conges + " ";
    if (e.parameter.vdebut && e.parameter.vfin) conges += e.parameter.vdebut + " au " + e.parameter.vfin;
    conges = conges.trim();

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var wsName = "Coiffeuses";
    var ws = ss.getSheetByName(wsName);
    
    if (!ws) {
      ws = ss.insertSheet(wsName);
      ws.appendRow(["Nom","Debut","Fin","Conges","Prime"]);
      ws.appendRow(["Biniouf","09:00","19:00","",0]);
      ws.appendRow(["Remilienne","09:00","19:00","",0]);
    }
    
    var lastRow = ws.getLastRow();
    var found = false;
    
    if (lastRow > 1) {
      var data = ws.getRange(2, 1, lastRow - 1, 5).getValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]) === nom) {
          ws.getRange(i + 2, 1).setValue(nom);
          ws.getRange(i + 2, 2).setValue(debut);
          ws.getRange(i + 2, 3).setValue(fin);
          ws.getRange(i + 2, 4).setValue(conges);
          ws.getRange(i + 2, 5).setValue(prime);
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      ws.appendRow([nom, debut, fin, conges, prime]);
    }
    
    return HtmlService.createHtmlOutput(
      '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
      + '<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">'
      + '<div style="font-size:64px;margin-bottom:16px">✅</div>'
      + '<div style="font-size:20px;font-weight:800;color:#10B981;margin-bottom:8px">Sauvegarde OK !</div>'
      + '<a href="' + adminUrl + '" style="display:block;padding:14px 28px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;margin-top:16px">Retour admin</a>'
      + '</body></html>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  } catch(error) {
    return HtmlService.createHtmlOutput(
      '<p style="color:red">Erreur: ' + error.message + '</p>'
      + '<a href="' + adminUrl + '">Retour</a>'
    ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// ═══ AJOUT COIFF ═══
function pageAjoutCoiff(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);

  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<base target="_top">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;margin-bottom:0}.hdr h1{font-size:17px;font-weight:700}'
    + '.ct{padding:16px}'
    + 'label{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:14px}'
    + 'label:first-child{margin-top:0}'
    + 'input[type=text],input[type=time],select{width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    + '.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px}'
    + '.cc{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer}'
    + '.cc input{width:18px;height:18px;cursor:pointer}'
    + '.cs{width:40px;height:40px;border-radius:8px;display:block;border:2px solid #333}'
    + '.cl{font-size:10px;color:#888}'
    + '.sbtn{width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:20px;font-family:sans-serif}'
    + '.rbtn{display:block;text-align:center;padding:12px;background:#1a1a2e;color:#888;border-radius:10px;font-size:14px;text-decoration:none;margin-top:10px;border:1px solid #21213A}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>Ajouter un coiffeur</h1></div>'
    + '<div class="ct">'
    + '<form id="acf" action="' + url + '" method="get">'
    + '<input type="hidden" name="page" value="saveajoutcoiff">'
    + '<input type="hidden" name="pwd" value="' + e.parameter.pwd + '">'
    + '<label>Prenom *</label>'
    + '<input type="text" name="nom" placeholder="Prenom" required>'
    + '<label>Emoji</label>'
    + '<select name="emoji">'
    + '<option value="💇">💇 Coiffeuse</option>'
    + '<option value="💈">💈 Coiffeur</option>'
    + '<option value="💅">💅 Estheticienne</option>'
    + '<option value="💆">💆 Masseur</option>'
    + '</select>'
    + '<label>Heure debut</label>'
    + '<input type="time" name="debut" value="09:00">'
    + '<label>Heure fin</label>'
    + '<input type="time" name="fin" value="19:00">'
    + '<label>Couleur dans le Sheets</label>'
    + '<div class="cgrid">'
    + '<label class="cc"><input type="radio" name="couleur" value="#CCE5FF" checked><span class="cs" style="background:#CCE5FF"></span><span class="cl">Bleu</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#FFF176"><span class="cs" style="background:#FFF176"></span><span class="cl">Jaune</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#FFD6EC"><span class="cs" style="background:#FFD6EC"></span><span class="cl">Rose</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#D5F5E3"><span class="cs" style="background:#D5F5E3"></span><span class="cl">Vert</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#F9E4B7"><span class="cs" style="background:#F9E4B7"></span><span class="cl">Orange</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#E8DAEF"><span class="cs" style="background:#E8DAEF"></span><span class="cl">Violet</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#FDEBD0"><span class="cs" style="background:#FDEBD0"></span><span class="cl">Peche</span></label>'
    + '<label class="cc"><input type="radio" name="couleur" value="#E8E8E8"><span class="cs" style="background:#E8E8E8"></span><span class="cl">Gris</span></label>'
    + '</div>'
    + '<input type="submit" value="Ajouter" style="width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:20px;font-family:sans-serif">'
    + '</form>'
    + '<a href="' + url + '?page=admin&pwd=' + e.parameter.pwd + '" class="rbtn">Retour</a>'
    + '<div class="safe"></div>'
    + '</div>'
    + '</body></html>';

  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveAjoutCoiff(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  getSheetCoiff().appendRow([e.parameter.nom,e.parameter.debut||"09:00",e.parameter.fin||"19:00","",0,e.parameter.couleur||"#E8E8E8"]);
  return redirect(url+"?page=admin&pwd="+e.parameter.pwd,e.parameter.nom+" ajoute !");
}

// ═══ FOURNISSEURS ═══
function pageFournisseurs(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  var ws=getSheetFourn();
  var list=ws.getLastRow()>1?ws.getRange(2,1,ws.getLastRow()-1,5).getValues():[];
  var listH=list.length===0?'<div style="text-align:center;color:#555;padding:30px">Aucun fournisseur</div>':
    list.map(function(f){return '<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #6366F1">'
      +'<div style="font-size:15px;font-weight:700;margin-bottom:6px">🏭 '+f[0]+'</div>'
      +'<div style="font-size:13px;color:#aaa;margin-bottom:3px">📦 '+(f[1]||"")+'</div>'
      +(f[2]?'<div style="font-size:13px">📞 <a href="tel:'+f[2]+'" style="color:#6366F1;text-decoration:none">'+f[2]+'</a></div>':"")
      +(f[3]?'<div style="font-size:12px;color:#888">📧 '+f[3]+'</div>':"")
      +'</div>';}).join("");
  var h='<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    +'.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    +'.hdr h1{font-size:17px;font-weight:700}.hdr a{color:rgba(255,255,255,.8);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:6px 12px;border-radius:20px}'
    +'.ct{padding:14px}label{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:12px}'
    +'input{width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    +'.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;margin-top:16px}'
    +'.sbtn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px;font-family:sans-serif}'
    +'.cbtn{display:block;padding:14px;background:#1a1a2e;color:#6366F1;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:14px;text-align:center;border:1.5px solid #6366F1}'
    +'.safe{height:40px}</style></head><body>'
    +'<div class="hdr"><h1>🏭 Fournisseurs</h1><a href="'+url+'?page=admin&pwd='+e.parameter.pwd+'">Retour</a></div>'
    +'<div class="ct">'
    +'<a href="'+url+'?page=commandes&pwd='+e.parameter.pwd+'" class="cbtn">📦 Voir les commandes</a>'
    +'<div class="st">Mes fournisseurs</div>'+listH
    +'<div class="st">Ajouter un fournisseur</div>'
    +'<form action="'+url+'" method="get">'
    +'<input type="hidden" name="page" value="savefournisseur">'
    +'<input type="hidden" name="pwd" value="'+e.parameter.pwd+'">'
    +'<label>Nom *</label><input type="text" name="nom" placeholder="Nom" required>'
    +'<label>Produits</label><input type="text" name="produits" placeholder="Shampoing, colorations...">'
    +'<label>Telephone</label><input type="tel" name="tel" placeholder="06 00 00 00 00">'
    +'<label>Email</label><input type="email" name="email" placeholder="contact@fournisseur.fr">'
    +'<button type="submit" class="sbtn">Ajouter</button>'
    +'</form><div class="safe"></div></div></body></html>';
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveFournisseur(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  getSheetFourn().appendRow([e.parameter.nom,e.parameter.produits||"",e.parameter.tel||"",e.parameter.email||"",""]);
  return redirect(url+"?page=fournisseurs&pwd="+e.parameter.pwd,"Fournisseur ajoute !");
}

// ═══ COMMANDES ═══
function pageCommandes(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  var ws=getSheetCmd();
  var cmds=ws.getLastRow()>1?ws.getRange(2,1,ws.getLastRow()-1,6).getValues():[];
  cmds=cmds.slice().reverse();
  var wsF=getSheetFourn();
  var fourns=wsF.getLastRow()>1?wsF.getRange(2,1,wsF.getLastRow()-1,1).getValues().map(function(r){return r[0];}):[];
  var foOpts=fourns.length===0?'<option>Aucun fournisseur</option>':fourns.map(function(f){return '<option value="'+f+'">'+f+'</option>';}).join("");
  var listH=cmds.length===0?'<div style="text-align:center;color:#555;padding:30px">Aucune commande</div>':
    cmds.map(function(c){var col=c[5]==="Livree"?"#10B981":c[5]==="En cours"?"#F59E0B":"#6366F1";
      return '<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:8px;border-left:4px solid '+col+'">'
        +'<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
        +'<span style="font-size:14px;font-weight:700">'+c[2]+'</span>'
        +'<span style="font-size:11px;color:'+col+';font-weight:700">'+c[5]+'</span></div>'
        +'<div style="font-size:12px;color:#aaa">🏭 '+c[1]+' · 📅 '+c[0]+'</div>'
        +'<div style="font-size:12px;color:#888">Qte: '+c[3]+' · '+c[4]+' EU</div></div>';}).join("");
  var h='<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    +'.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    +'.hdr h1{font-size:17px;font-weight:700}.hdr a{color:rgba(255,255,255,.8);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:6px 12px;border-radius:20px}'
    +'.ct{padding:14px}label{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:12px}'
    +'input,select{width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    +'.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}'
    +'.sbtn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px;font-family:sans-serif}'
    +'.safe{height:40px}</style></head><body>'
    +'<div class="hdr"><h1>📦 Commandes</h1><a href="'+url+'?page=fournisseurs&pwd='+e.parameter.pwd+'">Retour</a></div>'
    +'<div class="ct">'
    +'<div class="st">Passer une commande</div>'
    +'<form action="'+url+'" method="get">'
    +'<input type="hidden" name="page" value="savecommande">'
    +'<input type="hidden" name="pwd" value="'+e.parameter.pwd+'">'
    +'<label>Fournisseur</label><select name="fournisseur">'+foOpts+'</select>'
    +'<label>Produit *</label><input type="text" name="produit" placeholder="Shampoing..." required>'
    +'<label>Quantite</label><input type="number" name="quantite" placeholder="1">'
    +'<label>Prix EU</label><input type="number" name="prix" placeholder="0">'
    +'<label>Statut</label><select name="statut"><option>En attente</option><option>En cours</option><option>Livree</option></select>'
    +'<button type="submit" class="sbtn">Commander</button>'
    +'</form>'
    +'<div class="st" style="margin-top:20px">Historique</div>'+listH
    +'<div class="safe"></div></div></body></html>';
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveCommande(e) {
  var url=ScriptApp.getService().getUrl();
  if(e.parameter.pwd!==CONFIG.MOT_DE_PASSE) return err("Erreur",url,e.parameter.pwd);
  var today=Utilities.formatDate(new Date(),"Europe/Paris","yyyy-MM-dd");
  getSheetCmd().appendRow([today,e.parameter.fournisseur||"",e.parameter.produit||"",
    parseInt(e.parameter.quantite)||1,parseFloat(e.parameter.prix)||0,e.parameter.statut||"En attente"]);
  return redirect(url+"?page=commandes&pwd="+e.parameter.pwd,"Commande enregistree !");
}

// ═══ SALAIRES ═══
function pageSalaires(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var nom = e.parameter.nom;
  var mois = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM");
  var ws = getSheetSalaires();
  var base = 0, statut = "En attente";
  if (ws.getLastRow() > 1) {
    ws.getRange(2,1,ws.getLastRow()-1,6).getValues().forEach(function(r) {
      if (String(r[0])===mois && r[1]===nom) { base=r[2]; statut=r[5]; }
    });
  }
  var emojis = {"Biniouf":"💇","Remilienne":"💅"};
  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<base target="_top">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;align-items:center;gap:12px}'
    + '.av{width:44px;height:44px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px}'
    + '.hdr h1{font-size:17px;font-weight:700}.ct{padding:16px}'
    + '.sec{background:#1a1a2e;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #21213A}'
    + '.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px}'
    + '.lbl{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:12px}'
    + '.lbl:first-child{margin-top:0}'
    + 'input,select{width:100%;padding:13px;background:#111;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    + '.sbtn{width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:6px;font-family:sans-serif}'
    + '.rbtn{display:block;text-align:center;padding:13px;background:#1a1a2e;color:#888;border-radius:10px;font-size:14px;text-decoration:none;margin-top:10px;border:1px solid #21213A}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><div class="av">' + (emojis[nom]||"💇") + '</div><h1>Salaire ' + nom + '</h1></div>'
    + '<div class="ct">'
    + '<form id="sf" action="' + url + '" method="get">'
    + '<input type="hidden" name="page" value="savesalaire">'
    + '<input type="hidden" name="pwd" value="' + e.parameter.pwd + '">'
    + '<input type="hidden" name="nom" value="' + nom + '">'
    + '<input type="hidden" name="mois" value="' + mois + '">'
    + '<input type="hidden" name="joff" id="joff2" value="">'
    + '<div class="sec"><div class="st">Mois : ' + mois + '</div>'
    + '<span class="lbl">Salaire de base EU</span>'
    + '<input type="number" name="base" value="' + base + '" placeholder="0">'
    + '<span class="lbl">Statut</span>'
    + '<select name="statut"><option value="En attente"' + (statut==="En attente"?" selected":"") + '>En attente</option>'
    + '<option value="Paye"' + (statut==="Paye"?" selected":"") + '>Paye</option></select>'
    + '</div>'
    + '<input type="submit" value="Enregistrer" style="width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:6px;font-family:sans-serif">'
    + '</form>'
    + '<a href="' + url + '?page=admin&pwd=' + e.parameter.pwd + '" class="rbtn">Retour</a>'
    + '<div class="safe"></div></div>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveSalaire(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var ws = getSheetSalaires();
  var mois = e.parameter.mois;
  var nom = e.parameter.nom;
  var base = parseFloat(e.parameter.base) || 0;
  var statut = e.parameter.statut || "En attente";
  var coiffs = getCoiffs();
  var prime = coiffs[nom] ? parseFloat(coiffs[nom].prime)||0 : 0;
  var total = base + prime;
  // Supprimer toutes les lignes existantes pour ce mois/coiffeuse
  if (ws.getLastRow() > 1) {
    var vals = ws.getDataRange().getValues();
    for (var i = vals.length - 1; i >= 1; i--) {
      if (String(vals[i][0])===mois && vals[i][1]===nom) {
        ws.deleteRow(i+1);
      }
    }
  }
  // Ajouter la nouvelle ligne
  ws.appendRow([mois, nom, base, prime, total, statut]);
  var adminUrl = url + "?page=admin&pwd=" + e.parameter.pwd;
  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"></head>'
    + '<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">'
    + '<div style="font-size:64px;margin-bottom:16px">✅</div>'
    + '<div style="font-size:20px;font-weight:800;color:#10B981;margin-bottom:8px">Sauvegarde OK !</div>'
    + '<a href="' + adminUrl + '" style="display:block;padding:14px 28px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;margin-top:16px">Retour admin</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ AVIS CLIENTS ═══
function pageAvis(e) {
  var url = ScriptApp.getService().getUrl();
  var ws = getSheetAvis();
  var avis = ws.getLastRow() > 1 ? ws.getRange(2,1,ws.getLastRow()-1,5).getValues() : [];
  avis = avis.slice().reverse().slice(0,10);

  var avisHTML = avis.length === 0 ? '<div style="text-align:center;color:#888;padding:20px">Aucun avis pour le moment</div>' :
    avis.map(function(a) {
      var stars = "";
      for (var i=1;i<=5;i++) stars += i<=a[2] ? "⭐" : "☆";
      return '<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:10px;border-left:4px solid #F59E0B">'
        + '<div style="display:flex;justify-content:space-between;margin-bottom:6px">'
        + '<span style="font-size:14px;font-weight:700">' + a[1] + '</span>'
        + '<span style="font-size:11px;color:#888">' + String(a[0]).substring(0,10) + '</span>'
        + '</div>'
        + '<div style="font-size:16px;margin-bottom:6px">' + stars + '</div>'
        + '<div style="font-size:13px;color:#aaa">' + (a[3]||"") + '</div>'
        + '<div style="font-size:11px;color:#666;margin-top:4px">✂️ ' + (a[4]||"") + '</div>'
        + '</div>';
    }).join("");

  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0F0F1A;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:20px;text-align:center}'
    + '.hdr h1{font-size:18px;font-weight:800}.hdr p{font-size:12px;color:rgba(255,255,255,.6);margin-top:4px}'
    + '.ct{padding:16px}'
    + '.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}'
    + '.stars{display:flex;gap:8px;margin-bottom:16px}'
    + '.star{font-size:32px;cursor:pointer;opacity:.3;transition:.2s}'
    + '.star.on{opacity:1}'
    + 'textarea,input,select{width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif;margin-bottom:12px}'
    + 'textarea{height:100px;resize:none}'
    + '.sbtn{width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:sans-serif}'
    + '.rbtn{display:block;text-align:center;padding:13px;background:#1a1a2e;color:#888;border-radius:10px;font-size:14px;text-decoration:none;margin-top:10px;border:1px solid #21213A}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>⭐ Avis clients</h1><p>Partagez votre experience</p></div>'
    + '<div class="ct">'
    + '<div class="st">Laisser un avis</div>'
    + '<form id="af" action="' + url + '" method="get">'
    + '<input type="hidden" name="page" value="saveavis">'
    + '<input type="hidden" name="note" id="noteVal" value="5">'
    + '<input type="text" name="nom" placeholder="Votre prenom" required>'
    + '<select name="service">'
    + CONFIG.SERVICES.map(function(s){return '<option value="'+s.nom+'">'+s.nom+'</option>';}).join("")
    + '</select>'
    + '<div class="stars" id="stars">'
    + '<span class="star on" data-n="1">⭐</span>'
    + '<span class="star on" data-n="2">⭐</span>'
    + '<span class="star on" data-n="3">⭐</span>'
    + '<span class="star on" data-n="4">⭐</span>'
    + '<span class="star on" data-n="5">⭐</span>'
    + '</div>'
    + '<textarea name="commentaire" placeholder="Votre commentaire..."></textarea>'
    + '<input type="submit" value="Envoyer mon avis" style="width:100%;padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:sans-serif">'
    + '</form>'
    + '<div class="st" style="margin-top:20px">Derniers avis</div>'
    + avisHTML
    + '<a href="' + url + '" class="rbtn">Retour accueil</a>'
    + '<div class="safe"></div>'
    + '</div>'
    + '<script>'
    + 'var note=5;'
    + 'document.querySelectorAll(".star").forEach(function(s){'
    + '  s.addEventListener("click",function(){'
    + '    note=parseInt(this.getAttribute("data-n"));'
    + '    document.getElementById("noteVal").value=note;'
    + '    document.querySelectorAll(".star").forEach(function(st,i){st.className="star"+(i<note?" on":"");});'
    + '  });'
    + '});'
    + '</script>'
    + '</body></html>';

  return HtmlService.createHtmlOutput(h).setTitle("Avis - " + CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveAvis(e) {
  var url = ScriptApp.getService().getUrl();
  var today = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");
  getSheetAvis().appendRow([today, e.parameter.nom||"Anonyme", parseInt(e.parameter.note)||5, e.parameter.commentaire||"", e.parameter.service||""]);
  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
    + '<body style="font-family:sans-serif;background:#0F0F1A;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">'
    + '<div style="font-size:64px;margin-bottom:16px">⭐</div>'
    + '<div style="font-size:20px;font-weight:800;color:#F59E0B;margin-bottom:8px">Merci pour votre avis !</div>'
    + '<a href="' + url + '" style="display:block;padding:14px 28px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;margin-top:16px">Retour accueil</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ PROMOS ═══
function pagePromos(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var ws = getSheetPromos();
  var promos = ws.getLastRow() > 1 ? ws.getRange(2,1,ws.getLastRow()-1,4).getValues() : [];

  var listHTML = promos.length === 0 ? '<div style="text-align:center;color:#555;padding:20px">Aucun code promo</div>' :
    promos.map(function(p, idx) {
      var actif = p[3] === "Oui";
      return '<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:8px;border-left:4px solid '+(actif?"#10B981":"#555")+'">'
        + '<div style="display:flex;justify-content:space-between;align-items:center">'
        + '<div>'
        + '<div style="font-size:16px;font-weight:800;color:'+(actif?"#10B981":"#555")+'">'+p[0]+'</div>'
        + '<div style="font-size:13px;color:#aaa;margin-top:2px">'+p[1]+(p[2]==="pct"?"%":" EU")+' de reduction</div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;align-items:center">'
        + '<span style="font-size:11px;padding:3px 10px;background:'+(actif?"#10B98122":"#55555522")+';color:'+(actif?"#10B981":"#555")+';border-radius:20px">'+(actif?"Actif":"Inactif")+'</span>'
        + '<a href="'+url+'?page=deletepromo&idx='+(idx+2)+'&pwd='+e.parameter.pwd+'" style="font-size:11px;color:#EF4444;text-decoration:none;padding:3px 10px;background:#1a0505;border-radius:6px" target="_top">Suppr.</a>'
        + '</div></div></div>';
    }).join("");

  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<base target="_top">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    + '.hdr h1{font-size:17px;font-weight:700}.hdr a{color:rgba(255,255,255,.85);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:7px 14px;border-radius:20px}'
    + '.ct{padding:16px}.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}'
    + 'label{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px;margin-top:12px}label:first-child{margin-top:0}'
    + 'input,select{width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif}'
    + '.sbtn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:14px;font-family:sans-serif}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>🎁 Codes Promo</h1><a href="'+url+'?page=admin&pwd='+e.parameter.pwd+'">Retour</a></div>'
    + '<div class="ct">'
    + '<div class="st">Codes actifs</div>'
    + listHTML
    + '<div class="st" style="margin-top:16px">Creer un code</div>'
    + '<form id="pf" action="'+url+'" method="get">'
    + '<input type="hidden" name="page" value="savepromo">'
    + '<input type="hidden" name="pwd" value="'+e.parameter.pwd+'">'
    + '<label>Code promo</label><input type="text" name="code" placeholder="EX: PROMO10" required>'
    + '<label>Reduction</label><input type="number" name="reduction" placeholder="10">'
    + '<label>Type</label><select name="type"><option value="pct">Pourcentage (%)</option><option value="eu">Montant fixe (EU)</option></select>'
    + '<label>Statut</label><select name="actif"><option value="Oui">Actif</option><option value="Non">Inactif</option></select>'
    + '<button type="button" class="sbtn" onclick="document.getElementById(\'pf\').submit()">Creer le code</button>'
    + '</form>'
    + '<div class="safe"></div></div>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSavePromo(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  getSheetPromos().appendRow([
    (e.parameter.code||"").toUpperCase(),
    parseFloat(e.parameter.reduction)||0,
    e.parameter.type||"pct",
    e.parameter.actif||"Oui"
  ]);
  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"></head>'
    + '<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;padding:20px;text-align:center">'
    + '<div style="font-size:48px;margin-bottom:12px">✅</div>'
    + '<div style="font-size:18px;font-weight:700;color:#10B981;margin-bottom:16px">Code cree !</div>'
    + '<a href="'+url+'?page=promos&pwd='+e.parameter.pwd+'" style="padding:12px 24px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700">Retour promos</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageDeletePromo(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var ws = getSheetPromos();
  var idx = parseInt(e.parameter.idx);
  if (idx > 1 && idx <= ws.getLastRow()) ws.deleteRow(idx);
  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"></head><body>'
    + '<a href="'+url+'?page=promos&pwd='+e.parameter.pwd+'">Code supprime - Retour</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageRecherche(e) {
  return pageAdmin(e);
}

function pageHistorique(e) {
  return pageAdmin(e);
}

// ═══ MESSAGE EMAIL ═══
function pageMessage(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var msgActuel = getConfig("message_email") || "C est avec plaisir que nous confirmons votre rendez-vous !";

  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<base target="_top">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    + '.hdr h1{font-size:17px;font-weight:700}.hdr a{color:rgba(255,255,255,.85);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:7px 14px;border-radius:20px}'
    + '.ct{padding:16px}'
    + '.sec{background:#1a1a2e;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #21213A}'
    + '.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}'
    + 'label{display:block;font-size:11px;color:#888;text-transform:uppercase;margin-bottom:6px}'
    + 'textarea{width:100%;padding:13px;background:#111;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif;height:120px;resize:none}'
    + '.sbtn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;margin-top:6px;font-family:sans-serif}'
    + '.rbtn{display:block;text-align:center;padding:12px;background:#1a1a2e;color:#888;border-radius:10px;font-size:14px;text-decoration:none;margin-top:10px;border:1px solid #21213A}'
    + '.preview{background:#111;border-radius:10px;padding:14px;margin-top:12px;font-size:13px;color:#aaa;line-height:1.8;white-space:pre-wrap}'
    + '.safe{height:30px}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>💌 Message email</h1><a href="'+url+'?page=admin&pwd='+e.parameter.pwd+'">Retour</a></div>'
    + '<div class="ct">'
    + '<div class="sec"><div class="st">Message de confirmation</div>'
    + '<label>Ce message est envoye au client apres sa reservation</label>'
    + '<form id="mf" action="'+url+'" method="get">'
    + '<input type="hidden" name="page" value="savemessage">'
    + '<input type="hidden" name="pwd" value="'+e.parameter.pwd+'">'
    + '<textarea name="message">'+msgActuel+'</textarea>'
    + '<button type="button" class="sbtn" onclick="document.getElementById(\'mf\').submit()">Enregistrer</button>'
    + '</form></div>'
    + '<div class="sec"><div class="st">Apercu de l email</div>'
    + '<div class="preview">'
    + '<div style="font-size:12px;color:#aaa;line-height:1.8">Apercu: Bonjour [Prenom],<br><br>[Votre message]<br><br>Date, Heure, Service...<br><br>A bientot !</div>'
    + '</div></div>'
    + '<a href="'+url+'?page=admin&pwd='+e.parameter.pwd+'" class="rbtn">Retour sans sauvegarder</a>'
    + '<div class="safe"></div>'
    + '</div></body></html>';

  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function pageSaveMessage(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  setConfig("message_email", e.parameter.message || "C est avec plaisir que nous confirmons votre rendez-vous !");
  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"></head>'
    + '<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">'
    + '<div style="font-size:64px;margin-bottom:16px">✅</div>'
    + '<div style="font-size:20px;font-weight:800;color:#10B981;margin-bottom:16px">Message sauvegarde !</div>'
    + '<a href="'+url+'?page=admin&pwd='+e.parameter.pwd+'" style="display:block;padding:14px 28px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px">Retour admin</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ COLORIER SHEETS ═══
function pageColorier(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);

  var ws = getSheetRDV();
  if (ws.getLastRow() < 2) return redirect(url+"?page=admin&pwd="+e.parameter.pwd, "Aucun RDV a colorier");

  var vals = ws.getRange(2, 1, ws.getLastRow()-1, 11).getValues();

  // Couleurs par coiffeuse
  var coiffDataColors = getCoiffs();
  var coiffColors = {"Pas de preference": "#E8E8E8"};
  Object.keys(coiffDataColors).forEach(function(n) {
    coiffColors[n] = coiffDataColors[n].couleur || "#E8E8E8";
  });

  for (var i = 0; i < vals.length; i++) {
    var statut = vals[i][9];
    var coiff = String(vals[i][10]) || "Pas de preference";
    var row = i + 2;
    // Colonne statut (10) en vert ou rouge
    if (statut === "Annule") {
      ws.getRange(row, 10).setBackground("#f8d7da").setFontColor("#c0392b");
    } else if (statut === "Confirme") {
      ws.getRange(row, 10).setBackground("#d4edda").setFontColor("#27ae60");
    }
    // Colonne coiffeuse (11) avec couleur par coiffeuse
    var coiffCol = coiffColors[coiff] || "#e8e8e8";
    ws.getRange(row, 11).setBackground(coiffCol);
  }

  return HtmlService.createHtmlOutput(
    '<html><head><base target="_top"></head>'
    + '<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">'
    + '<div style="font-size:64px;margin-bottom:16px">🎨</div>'
    + '<div style="font-size:20px;font-weight:800;color:#10B981;margin-bottom:8px">Google Sheets colorie !</div>'
    + '<div style="font-size:13px;color:#888;margin-bottom:8px">Bleu = Biniouf · Rose = Remilienne · Rouge = Annule</div>'
    + '<a href="' + url + '?page=admin&pwd=' + e.parameter.pwd + '" style="display:block;padding:14px 28px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;margin-top:16px">Retour admin</a>'
    + '</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ QR CODE ═══
function pageQRCode(e) {
  var url = ScriptApp.getService().getUrl();
  if (e.parameter.pwd !== CONFIG.MOT_DE_PASSE) return err("Erreur", url, e.parameter.pwd);
  var clientUrl = url;
  var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(clientUrl);
  var h = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    + '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    + '.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    + '.hdr h1{font-size:17px;font-weight:700}'
    + '.hdr a{color:rgba(255,255,255,.85);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:7px 14px;border-radius:20px}'
    + '.ct{padding:20px;text-align:center}'
    + '.qr{background:#fff;padding:20px;border-radius:16px;display:inline-block;margin:20px auto}'
    + '.info{background:#1a1a2e;border-radius:12px;padding:16px;margin-top:16px;text-align:left;border:1px solid #21213A}'
    + '.st{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}'
    + '.url{font-size:11px;color:#888;word-break:break-all;margin-bottom:12px}'
    + '.btn{display:block;width:100%;padding:14px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;text-align:center;margin-bottom:10px}'
    + '.btn2{display:block;width:100%;padding:14px;background:#1a1a2e;color:#888;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;text-align:center;border:1px solid #21213A}'
    + '</style></head><body>'
    + '<div class="hdr"><h1>🔗 QR Code</h1><a href="' + url + '?page=admin&pwd=' + e.parameter.pwd + '" target="_top">Retour</a></div>'
    + '<div class="ct">'
    + '<div style="font-size:13px;color:#888;margin-bottom:16px">Imprimez ce QR code et affichez-le dans votre salon</div>'
    + '<div class="qr"><img src="' + qrUrl + '" width="260" height="260" alt="QR Code"></div>'
    + '<div class="info">'
    + '<div class="st">Lien du site client</div>'
    + '<div class="url">' + clientUrl + '</div>'
    + '<a href="' + clientUrl + '" class="btn" target="_top">Voir le site client</a>'
    + '<a href="' + qrUrl + '" class="btn2" target="_blank" download>Telecharger le QR Code</a>'
    + '</div>'
    + '<div style="font-size:12px;color:#555;margin-top:16px">Les clients scannent le QR code avec leur telephone et reservent directement en ligne</div>'
    + '</div>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ HELPERS PAGE ═══
function redirect(url, msg) {
  return HtmlService.createHtmlOutput(
    '<html><head><meta http-equiv="refresh" content="0;url='+url+'"></head>'
    +'<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;padding:20px">'
    +'<p>'+msg+' <a href="'+url+'" style="color:#6366F1">Cliquez ici</a></p>'
    +'</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function err(msg, url, pwd) {
  var back = url+(pwd?"?page=admin&pwd="+pwd:"");
  return HtmlService.createHtmlOutput(
    '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
    +'<body style="font-family:sans-serif;background:#0A0A0F;color:#fff;padding:20px">'
    +'<p style="color:#EF4444">Erreur: '+msg+'</p>'
    +'<a href="'+back+'" style="color:#6366F1">Retour</a>'
    +'</body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getLoginPage(url) {
  return '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8">'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0F0F1A;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}'
    +'.card{background:#161622;border:1.5px solid #21213A;border-radius:16px;padding:28px;width:100%;max-width:340px;text-align:center}'
    +'.logo{font-size:48px;margin-bottom:12px}.t{font-size:20px;font-weight:800;margin-bottom:4px}.s{font-size:13px;color:#666;margin-bottom:24px}'
    +'input{width:100%;padding:14px;background:#0F0F1A;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:16px;font-family:sans-serif;text-align:center;letter-spacing:4px;margin-bottom:14px}'
    +'.btn{width:100%;padding:14px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:sans-serif}'
    +'</style></head><body><div class="card"><div class="logo">🔒</div><div class="t">Acces Pro</div>'
    +'<div class="s">Mot de passe</div>'
    +'<form action="'+url+'" method="get">'
    +'<input type="hidden" name="page" value="admin">'
    +'<input type="password" name="pwd" placeholder="••••••••" autofocus>'
    +'<button type="submit" class="btn">Connexion</button>'
    +'</form></div></body></html>';
}

// ═══ ESPACE PRO ═══
function pageAdmin(e) {
  var url=ScriptApp.getService().getUrl();
  var pwd=e.parameter.pwd||"";
  if(pwd!==CONFIG.MOT_DE_PASSE) return HtmlService.createHtmlOutput(getLoginPage(url)).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  var rdvs=getRDVs();
  var coiffs=getCoiffs();
  var ca=0,confirmes=0,annules=0;
  rdvs.forEach(function(r){ if(r[9]==="Confirme"){confirmes++;ca+=parseFloat(r[7])||0;} if(r[9]==="Annule")annules++; });

  var aVenir=rdvs.filter(function(r){return r[9]==="Confirme";});
  var todayStr = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM-dd");
  aVenir.sort(function(a,b){return a[1]<b[1]?-1:a[1]>b[1]?1:a[2]<b[2]?-1:1;});
  // Mettre les RDV du jour en premier
  var rdvAujourd = aVenir.filter(function(r){return r[1]===todayStr;});
  var rdvReste = aVenir.filter(function(r){return r[1]!==todayStr;});
  aVenir = rdvAujourd.concat(rdvReste);

  var byDate={},dates=[];
  aVenir.forEach(function(r){var d=String(r[1]); if(!byDate[d]){byDate[d]=[];dates.push(d);} byDate[d].push(r);});

  var rdvHTML="";
  if(dates.length===0){rdvHTML='<div style="text-align:center;color:#555;padding:40px">Aucun RDV confirme</div>';}
  else{dates.forEach(function(d){
    var isToday = d===todayStr;
    var bgColor = isToday ? "#10B981" : "#6366F1";
    var dateLabel = isToday ? "📅 AUJOURD HUI — "+d : "📅 "+d;
    rdvHTML+='<div style="background:'+bgColor+';padding:10px 14px;font-size:13px;font-weight:700;color:#fff;display:flex;justify-content:space-between;margin-top:8px">'
      +'<span>'+dateLabel+'</span><span style="background:rgba(255,255,255,.2);padding:2px 10px;border-radius:20px">'+byDate[d].length+' RDV</span></div>';
    byDate[d].forEach(function(r){
      var col=svcColor(r[6]);
      rdvHTML+='<div style="background:#1a1a2e;padding:12px 14px;border-left:4px solid '+col+';margin-bottom:2px">'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'
        +'<span style="font-size:14px;font-weight:700">⏰ '+r[2]+' &nbsp; '+r[3]+'</span>'
        +'<a href="'+url+'?page=annuler&id='+r[0]+'&pwd='+pwd+'" style="font-size:11px;color:#EF4444;text-decoration:none;padding:3px 10px;background:#1a0505;border-radius:6px">Annuler</a></div>'
        +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">'
        +'<span style="font-size:12px;padding:3px 10px;background:'+col+'22;color:'+col+';border-radius:20px;font-weight:600">✂️ '+r[6]+' · 💰 '+r[7]+' EU</span>'
        +'<a href="tel:'+r[4]+'" style="color:#6366F1;font-size:13px;text-decoration:none;font-weight:600">📞 '+r[4]+'</a></div>'
        +'<div style="font-size:12px;color:#888">💇 '+(r[10]||"Pas de preference")+'</div></div>';
    });
  });}

  var svcMap={};
  rdvs.forEach(function(r){if(r[9]==="Confirme"){var k=r[6]||"Autre";if(!svcMap[k])svcMap[k]={nb:0,ca:0};svcMap[k].nb++;svcMap[k].ca+=parseFloat(r[7])||0;}});
  var statsHTML="";
  Object.keys(svcMap).sort(function(a,b){return svcMap[b].ca-svcMap[a].ca;}).forEach(function(k){
    var s=svcMap[k],pct=ca>0?Math.round(s.ca/ca*100):0,col=svcColor(k);
    statsHTML+='<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:10px">'
      +'<div style="display:flex;justify-content:space-between;margin-bottom:8px">'
      +'<div><div style="font-size:14px;font-weight:700;color:'+col+'">'+k+'</div>'
      +'<div style="font-size:11px;color:#888;margin-top:2px">'+s.nb+' RDV · '+pct+'% du CA</div></div>'
      +'<div style="font-size:18px;font-weight:800;color:'+col+'">'+s.ca.toFixed(0)+' EU</div></div>'
      +'<div style="height:6px;background:#21213A;border-radius:3px">'
      +'<div style="height:6px;background:'+col+';border-radius:3px;width:'+pct+'%"></div></div></div>';
  });
  if(!statsHTML) statsHTML='<div style="text-align:center;color:#555;padding:30px">Aucune donnee</div>';

  var coiffStats={};
  var rdvs = getRDVs();
  rdvs.forEach(function(r){if(r[9]==="Confirme"){var k=r[10]||"Pas de preference";if(!coiffStats[k])coiffStats[k]={nb:0,ca:0};coiffStats[k].nb++;coiffStats[k].ca+=parseFloat(r[7])||0;}});
  var emojis={"Biniouf":"💇","Remilienne":"💅"};
  var coiffHTML="";
  var coiffNames=Object.keys(coiffs).length>0?Object.keys(coiffs):["Biniouf","Remilienne"];
  coiffNames.forEach(function(nom){
    var d=coiffs[nom]||{debut:"09:00",fin:"19:00",conges:"",prime:0};
    var st=coiffStats[nom]||{nb:0,ca:0};
    var emoji=emojis[nom]||"💇";
    coiffHTML+='<div style="background:#1a1a2e;border-radius:14px;padding:16px;margin-bottom:14px;border:1.5px solid #21213A">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
      +'<div style="display:flex;align-items:center;gap:10px">'
      +'<div style="width:48px;height:48px;background:#6366F122;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px">'+emoji+'</div>'
      +'<div><div style="font-size:16px;font-weight:800">'+nom+'</div><div style="font-size:11px;color:#10B981">Active</div></div></div>'
      +'<div style="text-align:right"><div style="font-size:18px;font-weight:800;color:#F59E0B">'+st.ca.toFixed(0)+' EU</div>'
      +'<div style="font-size:11px;color:#888">'+st.nb+' RDV</div></div></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">'
      +'<div style="background:#111;border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:#888;margin-bottom:3px">HORAIRES</div><div style="font-size:13px;font-weight:700">'+d.debut+' - '+d.fin+'</div></div>'
      +'<div style="background:#111;border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:#888;margin-bottom:3px">PRIME</div><div style="font-size:13px;font-weight:700;color:#F59E0B">'+d.prime+' EU</div></div></div>'
      +(d.conges?'<div style="background:#111;border-radius:8px;padding:10px;margin-bottom:10px;font-size:12px;color:#888">'+d.conges+'</div>':"")
      +'<a href="'+url+'?page=editcoiff&nom='+nom+'&pwd='+pwd+'" style="display:block;text-align:center;padding:10px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700" target="_top">Modifier</a></div>';
  });

  var servOpts=CONFIG.SERVICES.map(function(s){return '<option value="'+s.nom+'">'+s.nom+' ('+s.prix+' EU)</option>';}).join("");
  var cfOpts='<option value="Pas de preference">Pas de preference</option>'+coiffNames.map(function(n){return '<option value="'+n+'">'+n+'</option>';}).join("");

  // Planning de la semaine
  var today2 = new Date();
  var weekDays = [];
  for (var wd = 0; wd < 7; wd++) {
    var wday = new Date(today2);
    wday.setDate(today2.getDate() + wd);
    weekDays.push(Utilities.formatDate(wday, "Europe/Paris", "yyyy-MM-dd"));
  }
  var coiffNames2 = Object.keys(coiffs).length > 0 ? Object.keys(coiffs) : ["Biniouf","Remilienne"];
  var cfEmojis2 = {"Biniouf":"💇","Remilienne":"💅"};
  var planHTML = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">'
    + '<tr style="background:#1a1a2e"><th style="padding:8px;font-size:11px;color:#6366F1;border:1px solid #21213A;white-space:nowrap">Coiffeuse</th>';
  weekDays.forEach(function(d) {
    var p = d.split("-");
    planHTML += '<th style="padding:8px;font-size:11px;color:#888;border:1px solid #21213A;white-space:nowrap">' + p[2] + "/" + p[1] + '</th>';
  });
  planHTML += '</tr>';
  coiffNames2.forEach(function(cn) {
    planHTML += '<tr><td style="padding:8px;font-size:12px;font-weight:700;border:1px solid #21213A;background:#1a1a2e;white-space:nowrap">' + (cfEmojis2[cn]||"💇") + " " + cn + '</td>';
    weekDays.forEach(function(d) {
      var rdvDay = aVenir.filter(function(r){ return r[1]===d && r[10]===cn; });
      var cell = '<td style="padding:4px;border:1px solid #21213A;vertical-align:top">';
      if (rdvDay.length === 0) {
        cell += '<div style="color:#333;font-size:10px;text-align:center;padding:6px">-</div>';
      } else {
        rdvDay.forEach(function(r) {
          var col = svcColor(r[6]);
          cell += '<div style="background:' + col + '22;border-left:2px solid ' + col + ';padding:3px 5px;border-radius:3px;margin-bottom:2px">'
            + '<div style="font-size:10px;font-weight:700;color:' + col + '">' + r[2] + '</div>'
            + '<div style="font-size:9px;color:#aaa">' + r[3] + '</div>'
            + '</div>';
        });
      }
      cell += '</td>';
      planHTML += cell;
    });
    planHTML += '</tr>';
  });
  planHTML += '</table></div>';
  if (aVenir.length === 0) planHTML = '<div style="text-align:center;color:#555;padding:30px">Aucun RDV a venir</div>';

  // Salaires du mois
  var moisActuel = Utilities.formatDate(new Date(), "Europe/Paris", "yyyy-MM");
  var wsSal = getSheetSalaires();
  var salData = {};
  if (wsSal.getLastRow() > 1) {
    wsSal.getRange(2,1,wsSal.getLastRow()-1,6).getValues().forEach(function(r) {
      if (String(r[0]) === moisActuel) salData[r[1]] = {base:parseFloat(r[2])||0,prime:parseFloat(r[3])||0,statut:r[5]||"En attente"};
    });
  }
  var salaireHTML = '<div style="font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px">Mois en cours : ' + moisActuel + '</div>';
  coiffNames2.forEach(function(cn) {
    var s = salData[cn] || {base:0, prime:coiffs[cn]?parseFloat(coiffs[cn].prime)||0:0, statut:"En attente"};
    var primeCoiff = coiffs[cn] ? parseFloat(coiffs[cn].prime)||0 : 0;
    var rdvNom = rdvs.filter(function(r){return r[9]==="Confirme"&&r[10]===cn&&String(r[1]).substring(0,7)===moisActuel;});
    var caNom = rdvNom.reduce(function(acc,r){return acc+(parseFloat(r[7])||0);},0);
    var total = s.base + primeCoiff;
    var statCol = s.statut==="Paye" ? "#10B981" : "#F59E0B";
    salaireHTML += '<div style="background:#1a1a2e;border-radius:14px;padding:16px;margin-bottom:12px;border:1px solid #21213A">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
      + '<div style="font-size:16px;font-weight:800">' + (cfEmojis2[cn]||"💇") + " " + cn + '</div>'
      + '<span style="font-size:11px;color:' + statCol + ';font-weight:700;padding:3px 10px;background:' + statCol + '22;border-radius:20px">' + s.statut + '</span>'
      + '</div>'
      + '<div style="font-size:12px;color:#aaa;margin-bottom:10px">' + rdvNom.length + ' RDV ce mois · CA: ' + caNom.toFixed(0) + ' EU</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">'
      + '<div style="background:#111;border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:#888;margin-bottom:3px">SALAIRE BASE</div><div style="font-size:14px;font-weight:700">' + s.base + ' EU</div></div>'
      + '<div style="background:#111;border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:#888;margin-bottom:3px">PRIME</div><div style="font-size:14px;font-weight:700;color:#F59E0B">' + primeCoiff + ' EU</div></div>'
      + '<div style="background:#111;border-radius:8px;padding:10px;text-align:center"><div style="font-size:10px;color:#888;margin-bottom:3px">TOTAL</div><div style="font-size:15px;font-weight:800;color:#10B981">' + total + ' EU</div></div>'
      + '</div>'
      + '<a href="' + url + '?page=salaires&nom=' + encodeURIComponent(cn) + '&pwd=' + pwd + '" style="display:block;text-align:center;padding:10px;background:#6366F1;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px" target="_top">Modifier</a>'
      + '</div>';
  });


  var rdvs = getRDVs();
  // Graphique CA par mois
  var caParMois = {};
  rdvs.forEach(function(r) {
    if (r[9]==="Confirme" && r[1]) {
      var m = String(r[1]).substring(0,7);
      if (!caParMois[m]) caParMois[m] = 0;
      caParMois[m] += parseFloat(r[7]) || 0;
    }
  });
  var moisKeys = Object.keys(caParMois).sort();
  var maxCA = 0;
  moisKeys.forEach(function(m){ if(caParMois[m]>maxCA) maxCA=caParMois[m]; });
  var graphHTML = "";
  if (moisKeys.length === 0) {
    graphHTML = '<div style="text-align:center;color:#555;padding:30px">Pas encore de donnees</div>';
  } else {
    graphHTML = '<div style="display:flex;align-items:flex-end;gap:8px;height:160px;padding:0 4px;margin-bottom:8px">';
    moisKeys.forEach(function(m) {
      var pct = maxCA > 0 ? Math.round(caParMois[m]/maxCA*100) : 0;
      var h2 = Math.max(pct * 1.4, 8);
      var parts = m.split("-");
      var label = parts[1]+"/"+parts[0].substring(2);
      graphHTML += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">'
        + '<div style="font-size:9px;color:#6366F1;font-weight:700">' + caParMois[m].toFixed(0) + '</div>'
        + '<div style="width:100%;background:#6366F1;border-radius:4px 4px 0 0;height:' + h2 + 'px;min-height:8px"></div>'
        + '<div style="font-size:9px;color:#888;white-space:nowrap">' + label + '</div>'
        + '</div>';
    });
    graphHTML += '</div>';
  }

  var ajoutHTML='<form action="'+url+'" method="get" style="display:flex;flex-direction:column;gap:10px">'
    +'<input type="hidden" name="page" value="saveajout">'
    +'<input type="hidden" name="pwd" value="'+pwd+'">'
    +'<input type="text" name="nom" placeholder="Nom du client" required style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'
    +'<input type="tel" name="tel" placeholder="Telephone" required style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'
    +'<input type="date" name="date" required style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'
    +'<input type="time" name="heure" required style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'
    +'<select name="service" style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'+servOpts+'</select>'
    +'<select name="coiffeuse" style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'+cfOpts+'</select>'
    +'<input type="number" name="prix" placeholder="Prix EU" style="padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif">'
    +'<button type="submit" style="padding:15px;background:#6366F1;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer">Ajouter le RDV</button></form>';


  // Recherche clients - grouper par client
  var clientMap = {};
  rdvs.forEach(function(r) {
    var k = r[3] + "||" + r[4];
    if (!clientMap[k]) clientMap[k] = {nom:r[3],tel:r[4],email:r[5],rdvs:[],ca:0};
    clientMap[k].rdvs.push(r);
    if (r[9]==="Confirme") clientMap[k].ca += parseFloat(r[7])||0;
  });
  var clientKeys = Object.keys(clientMap).sort();
  var clientHTML = '<div style="margin-bottom:12px"><input type="text" id="srch" placeholder="Rechercher un client..." onkeyup="filterClients()" style="width:100%;padding:13px;background:#1a1a2e;border:1.5px solid #21213A;border-radius:10px;color:#fff;font-size:15px;font-family:sans-serif"></div>'
    + '<div id="clientList">';
  clientKeys.forEach(function(k) {
    var c = clientMap[k];
    var nbConfirmes = c.rdvs.filter(function(r){return r[9]==="Confirme";}).length;
    clientHTML += '<div class="citem" data-nom="'+c.nom.toLowerCase()+'" data-tel="'+c.tel+'" style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:8px;border-left:4px solid #6366F1">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
      + '<span style="font-size:15px;font-weight:700">'+c.nom+'</span>'
      + '<span style="font-size:13px;color:#F59E0B;font-weight:700">'+c.ca.toFixed(0)+' EU</span>'
      + '</div>'
      + '<div style="display:flex;justify-content:space-between;align-items:center">'
      + '<a href="tel:'+c.tel+'" style="font-size:13px;color:#6366F1;text-decoration:none;font-weight:600">📞 '+c.tel+'</a>'
      + '<span style="font-size:12px;color:#888">'+nbConfirmes+' RDV</span>'
      + '</div>'
      + (c.email?'<div style="font-size:11px;color:#555;margin-top:3px">'+c.email+'</div>':"")
      + '</div>';
  });
  clientHTML += '</div>';
  if (clientKeys.length === 0) clientHTML = '<div style="text-align:center;color:#555;padding:30px">Aucun client</div>';

  // Historique annulés
  var annules = rdvs.filter(function(r){return r[9]==="Annule";});
  annules.sort(function(a,b){return a[1]>b[1]?-1:1;});
  var histHTML = annules.length === 0 ? '<div style="text-align:center;color:#555;padding:30px">Aucun RDV annule</div>' :
    annules.map(function(r) {
      var col = svcColor(r[6]);
      return '<div style="background:#1a1a2e;border-radius:12px;padding:12px 14px;margin-bottom:8px;border-left:4px solid #EF4444;opacity:0.8">'
        + '<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
        + '<span style="font-size:14px;font-weight:700">'+r[3]+'</span>'
        + '<span style="font-size:11px;color:#EF4444;font-weight:700">Annule</span>'
        + '</div>'
        + '<div style="font-size:12px;color:#aaa">📅 '+r[1]+' ⏰ '+r[2]+'</div>'
        + '<div style="font-size:12px;padding:3px 10px;background:'+col+'22;color:'+col+';border-radius:20px;display:inline-block;margin-top:4px;font-weight:600">✂️ '+r[6]+' · 💰 '+r[7]+' EU</div>'
        + '</div>';
    }).join("");

  var html='<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="UTF-8"><title>Admin</title>'
    +'<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0A0A0F;color:#fff}'
    +'.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:16px;display:flex;justify-content:space-between;align-items:center}'
    +'.hdr h1{font-size:17px;font-weight:700}.hdr a{color:rgba(255,255,255,.85);font-size:12px;text-decoration:none;background:rgba(255,255,255,.2);padding:7px 14px;border-radius:20px}'
    +'.kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px}'
    +'.kpi{background:#1a1a2e;border-radius:14px;padding:16px;text-align:center}'
    +'.kv{font-size:22px;font-weight:800;margin-bottom:3px}.kl{font-size:11px;color:#888}'
    +'.tabs{display:flex;overflow-x:auto;gap:8px;padding:0 14px 14px;scrollbar-width:none}'
    +'.tab{flex-shrink:0;padding:9px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:sans-serif}'
    +'.tab.on{background:#6366F1;color:#fff}.tab.off{background:#1a1a2e;color:#888;border:1px solid #21213A}'
    +'.pane{display:none}.pane.show{display:block}'
    +'.pt{font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin:14px 14px 10px}'
    +'.safe{height:40px}</style></head><body>'
    +'<div class="hdr"><h1>'+CONFIG.EMOJI+' '+CONFIG.NOM+'</h1><a href="'+url+'">Site client</a></div>'
    +'<div class="kpis">'
    +'<div class="kpi"><div class="kv" style="color:#F59E0B">'+ca.toFixed(0)+' EU</div><div class="kl">CA Total</div></div>'
    +'<div class="kpi"><div class="kv" style="color:#10B981">'+confirmes+'</div><div class="kl">Confirmes</div></div>'
    +'<div class="kpi"><div class="kv" style="color:#6366F1">'+aVenir.length+'</div><div class="kl">RDV actifs</div></div>'
    +'<div class="kpi"><div class="kv" style="color:#EF4444">'+annules.length+'</div><div class="kl">Annules</div></div></div>'
    +'<div class="tabs">'
    +'<button class="tab on" onclick="sw(0,this)">📅 RDV ('+aVenir.length+')</button>'
    +'<button class="tab off" onclick="sw(1,this)">🗓 Planning</button>'
    +'<button class="tab off" onclick="sw(2,this)">💇 Equipe</button>'
    +'<button class="tab off" onclick="sw(3,this)">💰 Salaires</button>'
    +'<button class="tab off" onclick="sw(4,this)">📊 Stats</button>'
    +'<button class="tab off" onclick="sw(5,this)">➕ Ajouter</button>'
    +'<button class="tab off" onclick="sw(6,this)">🏭 Pro</button>'
    +'<button class="tab off" onclick="sw(7,this)">🔍 Clients</button>'
    +'<button class="tab off" onclick="sw(8,this)">📋 Annules</button>'
    +'</div>'
    +'<div class="pane show" id="p0">'+rdvHTML+'</div>'
    +'<div class="pane" id="p1"><div class="pt">Planning</div><div style="padding:0 14px">'+planHTML+'</div></div>'
    +'<div class="pane" id="p2"><div class="pt">Equipe</div><div style="padding:0 14px">'+coiffHTML
    +'<a href="'+url+'?page=ajoutcoiff&pwd='+pwd+'" style="display:block;text-align:center;padding:12px;background:#1a1a2e;color:#6366F1;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;border:1.5px solid #6366F1;margin-top:4px" target="_top">➕ Ajouter un coiffeur</a></div></div>'
    +'<div class="pane" id="p3"><div class="pt">Salaires</div><div style="padding:0 14px">'+salaireHTML+'</div></div>'
    +'<div class="pane" id="p4"><div class="pt">Stats</div><div style="padding:0 14px">'
    +'<div style="font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">CA par mois</div>'
    +'<div style="background:#1a1a2e;border-radius:12px;padding:14px;margin-bottom:16px">'+graphHTML+'</div>'
    +'<div style="font-size:11px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Par service</div>'
    +statsHTML+'</div></div>'
    +'<div class="pane" id="p5"><div class="pt">Ajouter un RDV</div><div style="padding:0 14px">'+ajoutHTML+'</div></div>'
    +'<div class="pane" id="p6"><div class="pt">Espace Pro</div><div style="padding:0 14px">'
    +'<a href="'+url+'?page=fournisseurs&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #21213A;font-size:15px;font-weight:600" target="_top">🏭 Fournisseurs</a>'
    +'<a href="'+url+'?page=commandes&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #21213A;font-size:15px;font-weight:600" target="_top">📦 Commander des produits</a>'
    +'<a href="'+url+'?page=qrcode&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #6366F1;font-size:15px;font-weight:600" target="_top">🔗 QR Code du salon</a>'
    +'<a href="'+url+'?page=promos&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #10B981;font-size:15px;font-weight:600" target="_top">🎁 Codes Promo</a>'
    +'<a href="'+url+'?page=message&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #EC4899;font-size:15px;font-weight:600" target="_top">💌 Message email</a>'
    +'<a href="'+url+'?page=colorier&pwd='+pwd+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #F59E0B;font-size:15px;font-weight:600" target="_top">🎨 Colorier le Sheets</a>'
    +'<a href="https://wa.me/'+CONFIG.TEL.replace(/ /g,"")+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;margin-bottom:10px;text-decoration:none;color:#fff;border:1.5px solid #25D366;font-size:15px;font-weight:600" target="_top">💬 WhatsApp</a>'
    +'<a href="https://www.google.com/maps/search/'+encodeURIComponent(CONFIG.ADRESSE)+'" style="display:block;padding:16px;background:#1a1a2e;border-radius:12px;text-decoration:none;color:#fff;border:1.5px solid #EA4335;font-size:15px;font-weight:600" target="_top">🗺️ Google Maps</a>'
    +'</div></div>'
    +'<div class="pane" id="p7"><div class="pt">Clients ('+clientKeys.length+')</div><div style="padding:0 14px">'+clientHTML+'</div></div>'
    +'<div class="pane" id="p8"><div class="pt">RDV Annules ('+annules.length+')</div><div style="padding:0 14px">'+histHTML+'</div></div>'
    +'<div class="safe"></div>'
    +'<script>function sw(n,el){for(var i=0;i<9;i++){var p=document.getElementById("p"+i);if(p)p.className="pane"+(i===n?" show":"");}document.querySelectorAll(".tab").forEach(function(t,i){t.className="tab "+(i===n?"on":"off");})}function filterClients(){var v=document.getElementById("srch").value.toLowerCase();document.querySelectorAll(".citem").forEach(function(el){var n=el.getAttribute("data-nom")||"";var t=el.getAttribute("data-tel")||"";el.style.display=(n.indexOf(v)>-1||t.indexOf(v)>-1)?"block":"none";});}</script>'
    +'</body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ═══ PAGE CLIENT ═══
function pageHome() {
  var url=ScriptApp.getService().getUrl();
  var svcsJSON=JSON.stringify(CONFIG.SERVICES);
  var coiffNames=Object.keys(getCoiffs());
  if(coiffNames.length===0) coiffNames=["Biniouf","Remilienne"];
  var coiffJSON=JSON.stringify(coiffNames);


  var rdvs = getRDVs();
  var html='<!DOCTYPE html><html><head>'
    +'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">'
    +'<meta charset="UTF-8"><title>'+CONFIG.NOM+'</title>'
    +'<style>'
    +'*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}'
    +'body{font-family:sans-serif;background:#0F0F1A;color:#fff;min-height:100vh}'
    +'.hdr{background:linear-gradient(135deg,#6366F1,#4F46E5);padding:28px 20px 20px;text-align:center}'
    +'.logo{font-size:48px;margin-bottom:8px}.ht{font-size:22px;font-weight:800}'
    +'.hs{font-size:13px;color:rgba(255,255,255,.6);margin-top:4px}'
    +'.ha{font-size:11px;color:rgba(255,255,255,.4);margin-top:8px}'
    +'.steps{display:flex;justify-content:center;align-items:center;gap:4px;padding:12px 16px;background:#161622}'
    +'.step{font-size:10px;font-weight:600;color:#555;display:flex;align-items:center;gap:3px}'
    +'.step.on{color:#6366F1}.step.ok{color:#10B981}'
    +'.sn{width:18px;height:18px;border-radius:50%;background:#21213A;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700}'
    +'.step.on .sn{background:#6366F1;color:#fff}.step.ok .sn{background:#10B981;color:#fff}'
    +'.sep{flex:1;height:1px;background:#21213A;max-width:12px}'
    +'.ct{padding:16px}'
    +'.stl{font-size:10px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}'
    +'.sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}'
    +'.cg{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px}'
    +'.sc{background:#161622;border:2px solid #21213A;border-radius:14px;padding:14px 12px;cursor:pointer;display:block;width:100%;text-align:left;color:#fff;font-family:sans-serif}'
    +'.sc.sel{border-color:#6366F1;background:rgba(99,102,241,.15)}'
    +'.sn2{font-size:13px;font-weight:600;margin-bottom:8px}'
    +'.si{display:flex;justify-content:space-between;align-items:center}'
    +'.sp{font-size:15px;font-weight:800;color:#6366F1}'
    +'.sd{font-size:10px;color:#555;background:#21213A;padding:2px 6px;border-radius:6px}'
    +'.new{background:#EF4444;color:#fff;font-size:9px;font-weight:700;padding:2px 5px;border-radius:8px;margin-left:5px;vertical-align:middle}'
    +'.field{margin-bottom:14px}'
    +'.field label{display:block;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}'
    +'.field input{width:100%;padding:14px;background:#161622;border:2px solid #21213A;border-radius:12px;color:#fff;font-size:15px;font-family:sans-serif}'
    +'.field input:focus{outline:none;border-color:#6366F1}'
    +'.iw{position:relative;margin-bottom:14px}'
    +'.iw label{display:block;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}'
    +'.iw input{width:100%;padding:14px 14px 14px 40px;background:#161622;border:2px solid #21213A;border-radius:12px;color:#fff;font-size:15px;font-family:sans-serif}'
    +'.iw input:focus{outline:none;border-color:#6366F1}'
    +'.ii{position:absolute;left:12px;bottom:14px;font-size:15px}'
    +'.cl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}'
    +'.ci{background:#161622;border:2px solid #21213A;border-radius:10px;padding:10px 4px;text-align:center;font-size:13px;font-weight:600;cursor:pointer;display:block;width:100%;color:#fff;font-family:sans-serif}'
    +'.ci.sel{background:#6366F1;border-color:#6366F1;color:#fff}'
    +'.recap{background:#161622;border:2px solid rgba(99,102,241,.3);border-radius:14px;padding:16px;margin-bottom:14px}'
    +'.rr{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #21213A;font-size:14px}'
    +'.rr:last-child{border-bottom:none;font-weight:700;color:#6366F1;font-size:16px}'
    +'.rl{color:#666}'
    +'.btn{display:block;width:100%;padding:15px;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;font-family:sans-serif;margin-bottom:10px}'
    +'.bp{background:#6366F1;color:#fff}.bs{background:#21213A;color:#666}'
    +'.ni{background:#161622;border:1px solid #21213A;border-radius:12px;padding:14px;font-size:12px;color:#666;margin-bottom:14px;line-height:1.9}'
    +'.cf-e{font-size:26px;margin-bottom:5px}'
    +'.cf-n{font-size:13px;font-weight:700;text-align:center}'
    +'.safe{height:50px}.adm{text-align:center;padding:12px;color:#333;font-size:11px}.adm a{color:#333;text-decoration:none}'
    +'.et{display:none}.et.show{display:block}'
    +'.nc{text-align:center;color:#555;font-size:13px;padding:20px;background:#161622;border-radius:12px}'
    +'.ld{text-align:center;padding:20px;color:#6366F1;font-size:13px}'
    +'</style></head><body>'
    +'<div class="hdr"><div class="logo">'+CONFIG.EMOJI+'</div>'
    +'<div class="ht">'+CONFIG.NOM+'</div>'
    +'<div class="hs">Reservez en ligne</div>'
    +'<div class="ha">📍 '+CONFIG.ADRESSE+' · 📞 '+CONFIG.TEL+'</div></div>'
    +'<div class="steps">'
    +'<div class="step on" id="st1"><div class="sn">1</div><span>Service</span></div><div class="sep"></div>'
    +'<div class="step" id="st2"><div class="sn">2</div><span>Coiff.</span></div><div class="sep"></div>'
    +'<div class="step" id="st3"><div class="sn">3</div><span>Creneau</span></div><div class="sep"></div>'
    +'<div class="step" id="st4"><div class="sn">4</div><span>Infos</span></div><div class="sep"></div>'
    +'<div class="step" id="st5"><div class="sn">5</div><span>OK</span></div>'
    +'</div>'
    +'<div class="ct">'
    +'<div class="et show" id="e1">'
    +'<div class="stl">Choisissez votre service</div>'
    +'<div class="sg" id="sg"></div>'
    +'<div class="ni">⏰ '+CONFIG.HEURE_DEBUT+' - '+CONFIG.HEURE_FIN+'<br>📍 '+CONFIG.ADRESSE+'<br>📞 '+CONFIG.TEL+'</div>'
    +'<a href="'+url+'?page=avis" style="display:flex;align-items:center;gap:10px;background:#1a1a2e;border-radius:12px;padding:14px;text-decoration:none;color:#fff;border:1px solid #21213A;margin-bottom:10px"><span style="font-size:24px">⭐</span><div><div style="font-size:14px;font-weight:700">Avis clients</div><div style="font-size:12px;color:#888">Voir et laisser un avis</div></div><span style="margin-left:auto;color:#6366F1">›</span></a>'
    +'<a href="https://wa.me/'+CONFIG.TEL.replace(/ /g,"")+'" style="display:flex;align-items:center;gap:10px;background:#1a1a2e;border-radius:12px;padding:14px;text-decoration:none;color:#fff;border:1px solid #25D366;margin-bottom:10px"><span style="font-size:24px">💬</span><div><div style="font-size:14px;font-weight:700">WhatsApp</div><div style="font-size:12px;color:#888">Contactez-nous</div></div><span style="margin-left:auto;color:#25D366">›</span></a>'
    +'<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(CONFIG.ADRESSE)+'" style="display:flex;align-items:center;gap:10px;background:#1a1a2e;border-radius:12px;padding:14px;text-decoration:none;color:#fff;border:1px solid #EA4335;margin-bottom:12px"><span style="font-size:24px">🗺️</span><div><div style="font-size:14px;font-weight:700">Nous trouver</div><div style="font-size:12px;color:#888">'+CONFIG.ADRESSE+'</div></div><span style="margin-left:auto;color:#EA4335">›</span></a>'
    +'<button class="btn bp" onclick="go(2)">Continuer</button>'
    +'</div>'
    +'<div class="et" id="e2">'
    +'<div class="stl">Choisissez votre coiffeuse</div>'
    +'<div class="cg" id="cg"></div>'
    +'<button class="btn bs" onclick="go(1)">Retour</button>'
    +'</div>'
    +'<div class="et" id="e3">'
    +'<div class="stl">Choisissez une date</div>'
    +'<div class="field"><label>Date</label><input type="date" id="di" min="'+tomorrow()+'" max="'+maxDate()+'" onchange="loadC()"></div>'
    +'<div class="stl" style="margin-top:12px">Creneaux disponibles</div>'
    +'<div id="cz"><div class="nc">Selectionnez une date</div></div>'
    +'<button class="btn bs" onclick="go(2)" style="margin-top:12px">Retour</button>'
    +'</div>'
    +'<div class="et" id="e4">'
    +'<div class="stl">Vos coordonnees</div>'
    +'<div class="iw"><label>Nom *</label><span class="ii">👤</span><input type="text" id="nom" placeholder="Jean Martin"></div>'
    +'<div class="iw"><label>Telephone *</label><span class="ii">📞</span><input type="tel" id="tel" placeholder="06 00 00 00 00"></div>'
    +'<div class="iw"><label>Email</label><span class="ii">📧</span><input type="email" id="email" placeholder="jean@email.fr"></div>'
    +'<div class="iw"><label>Code promo</label><span class="ii">🎁</span><input type="text" id="promo" placeholder="Code promo (optionnel)"></div>'
    +'<button class="btn bp" onclick="go(5)">Continuer</button>'
    +'<button class="btn bs" onclick="go(3)">Retour</button>'
    +'</div>'
    +'<div class="et" id="e5">'
    +'<div class="stl">Recapitulatif</div>'
    +'<div class="recap" id="recap"></div>'
    +'<button class="btn bp" id="bc" onclick="conf()">Confirmer mon RDV</button>'
    +'<button class="btn bs" onclick="go(4)">Modifier</button>'
    +'</div>'
    +'<div class="safe"></div></div>'
    +'<div class="adm"><a href="'+url+'?page=admin">Acces pro</a></div>'
    +'<script>'
    +'var SV='+svcsJSON+';var CF='+coiffJSON+';var URL="'+url+'";'
    +'var sel=null,cf=null,date=null,heure=null;'
    +'var sg=document.getElementById("sg");'
    +'for(var i=0;i<SV.length;i++){'
    +'  var b=document.createElement("button");b.type="button";b.className="sc";'
    +'  var badge=SV[i].isNew?"<span class=\'new\'>NEW</span>":"";'
    +'  b.innerHTML="<div class=\'sn2\'>"+SV[i].nom+badge+"</div><div class=\'si\'><span class=\'sp\'>"+SV[i].prix+" EU</span><span class=\'sd\'>"+SV[i].duree+" min</span></div>";'
    +'  (function(s,el){el.addEventListener("click",function(){sel=s;document.querySelectorAll(".sc").forEach(function(c){c.classList.remove("sel");});el.classList.add("sel");});})(SV[i],b);'
    +'  sg.appendChild(b);'
    +'}'
    +'var cg=document.getElementById("cg");'
    +'var cfE=["💇","💅","🎲"];'
    +'var cfV=CF.concat(["Pas de preference"]);'
    +'var cfL=CF.concat(["Au hasard"]);'
    +'for(var i=0;i<cfL.length;i++){'
    +'  var b=document.createElement("button");b.type="button";b.className="sc";'
    +'  b.innerHTML="<div class=\'cf-e\'>"+(cfE[i]||"💇")+"</div><div class=\'cf-n\'>"+cfL[i]+"</div>";'
    +'  (function(v,el){el.addEventListener("click",function(){cf=v;document.querySelectorAll(".sc").forEach(function(c){c.classList.remove("sel");});el.classList.add("sel");go(3);});})(cfV[i],b);'
    +'  cg.appendChild(b);'
    +'}'
    +'function go(n){'
    +'  if(n===2&&!sel){alert("Choisissez un service");return;}'
    +'  if(n===5){var nm=document.getElementById("nom").value.trim(),tl=document.getElementById("tel").value.trim();'
    +'    if(!nm||!tl){alert("Nom et telephone obligatoires");return;}'
    +'    if(!heure){alert("Choisissez un creneau");go(3);return;}'
    +'    showR();}'
    +'  for(var i=1;i<=5;i++){'
    +'    document.getElementById("e"+i).className="et"+(i===n?" show":"");'
    +'    document.getElementById("st"+i).className="step"+(i===n?" on":i<n?" ok":"");}'
    +'  window.scrollTo(0,0);'
    +'}'
    +'function loadC(){'
    +'  date=document.getElementById("di").value;if(!date)return;heure=null;'
    +'  var z=document.getElementById("cz");z.innerHTML="<div class=\'ld\'>Chargement...</div>";'
    +'  fetch(URL+"?page=creneaux&date="+date+"&duree="+(sel?sel.duree:30))'
    +'  .then(function(r){return r.json();})'
    +'  .then(function(d){'
    +'    if(!d.creneaux||!d.creneaux.length){z.innerHTML="<div class=\'nc\'>Aucun creneau disponible</div>";return;}'
    +'    var div=document.createElement("div");div.className="cl";'
    +'    for(var i=0;i<d.creneaux.length;i++){'
    +'      var btn=document.createElement("button");btn.type="button";btn.className="ci";btn.textContent=d.creneaux[i];'
    +'      (function(h,el){el.addEventListener("click",function(){heure=h;document.querySelectorAll(".ci").forEach(function(c){c.classList.remove("sel");});el.classList.add("sel");});})(d.creneaux[i],btn);'
    +'      div.appendChild(btn);}'
    +'    z.innerHTML="";z.appendChild(div);'
    +'    var nb=document.createElement("button");nb.type="button";nb.className="btn bp";nb.style.marginTop="12px";nb.textContent="Continuer";'
    +'    nb.addEventListener("click",function(){go(4);});z.appendChild(nb);})'
    +'  .catch(function(){z.innerHTML="<div class=\'nc\'>Erreur</div>";});'
    +'}'
    +'function showR(){'
    +'  var nm=document.getElementById("nom").value.trim();'
    +'  document.getElementById("recap").innerHTML='
    +'    "<div class=\'rr\'><span class=\'rl\'>Service</span><span>"+sel.nom+"</span></div>"'
    +'    +"<div class=\'rr\'><span class=\'rl\'>Coiffeuse</span><span>"+(cf||"Pas de preference")+"</span></div>"'
    +'    +"<div class=\'rr\'><span class=\'rl\'>Date</span><span>"+date+"</span></div>"'
    +'    +"<div class=\'rr\'><span class=\'rl\'>Heure</span><span>"+heure+"</span></div>"'
    +'    +"<div class=\'rr\'><span class=\'rl\'>Client</span><span>"+nm+"</span></div>"'
    +'    +"<div class=\'rr\'><span class=\'rl\'>Prix</span><span>"+sel.prix+" EU</span></div>";'
    +'}'
    +'function conf(){'
    +'  var btn=document.getElementById("bc");btn.disabled=true;btn.textContent="En cours...";'
    +'  var nm=document.getElementById("nom").value.trim();'
    +'  var tl=document.getElementById("tel").value.trim();'
    +'  var em=document.getElementById("email").value.trim();'
    +'  var c=cf||"Pas de preference";'
    +'  window.location.href=URL+"?page=confirmer&nom="+encodeURIComponent(nm)+"&tel="+encodeURIComponent(tl)+"&email="+encodeURIComponent(em)+"&date="+date+"&heure="+heure+"&service="+encodeURIComponent(sel.nom)+"&prix="+sel.prix+"&duree="+sel.duree+"&coiffeuse="+encodeURIComponent(c);'
    +'}'
    +'</script></body></html>';

  return HtmlService.createHtmlOutput(html).setTitle(CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
