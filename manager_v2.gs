// =====================================================
// DRAGON PALACE — MANAGER
// Sans aucune redirection
// Mot de passe : resto2026
// =====================================================

var PWD = "resto2026";
var NOM = "Dragon Palace";

function doGet(e) {
  var action = e.parameter.action || "login";
  var pwd = e.parameter.pwd || "";

  // Verif mot de passe sauf login
  if (action !== "login" && pwd !== PWD) {
    return showLogin("Mot de passe incorrect");
  }

  if (action === "login") {
    if (pwd === PWD) return showDashboard(pwd);
    return showLogin("");
  }
  if (action === "dashboard") return showDashboard(pwd);
  if (action === "commandes") return showCommandes(pwd, e);
  if (action === "plats")     return showPlats(pwd, e);
  if (action === "salaries")  return showSalaries(pwd, e);
  if (action === "fournisseurs") return showFournisseurs(pwd, e);
  return showLogin("");
}

// =====================================================
// SHEETS
// =====================================================

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName(name);
  if (!ws) {
    ws = ss.insertSheet(name);
    if (name === "Commandes") ws.appendRow(["ID","Heure","Client","Articles","Total","Statut","Date"]);
    if (name === "Plats")     ws.appendRow(["ID","Cat","Nom","Prix","Desc"]);
    if (name === "Salaries")  ws.appendRow(["ID","Nom","Poste","Tel","Salaire"]);
    if (name === "Fournisseurs") ws.appendRow(["ID","Nom","Contact","Tel","Produits"]);
  }
  return ws;
}

function genId() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

function getUrl() {
  return ScriptApp.getService().getUrl();
}

// =====================================================
// CSS
// =====================================================

function S() {
  return "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#0a0a0a;color:#f0e6c8}a{color:inherit;text-decoration:none}.wrap{max-width:460px;margin:0 auto;padding:12px 14px 60px}.top{background:#111;border-bottom:1px solid #222;padding:11px 14px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}.tit{font-size:15px;font-weight:800;color:#c9a84c}.tabs{display:flex;gap:3px;background:#181818;border-radius:8px;padding:3px;margin:12px 0}.tab{flex:1;padding:7px 2px;border-radius:6px;border:none;background:transparent;color:#555;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;text-align:center;display:block}.tab.on{background:#c9a84c;color:#0a0a0a}.kg{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:14px}.k{background:#181818;border-radius:8px;padding:11px;text-align:center}.k2{grid-column:span 2}.kv{font-size:20px;font-weight:900;color:#c9a84c}.kl{font-size:9px;color:#555;text-transform:uppercase;margin-top:2px}.card{background:#181818;border-radius:8px;padding:11px;margin-bottom:7px}.crow{display:flex;align-items:center;gap:7px;margin-bottom:3px}.cid{font-size:14px;font-weight:900;color:#c9a84c;min-width:48px}.cnom{flex:1;font-size:13px;font-weight:700}.cbdg{font-size:10px;font-weight:700;border:1px solid;border-radius:5px;padding:2px 6px}.cmeta{font-size:11px;color:#555;margin-bottom:5px}.carts{font-size:11px;color:#999;line-height:1.5;margin-bottom:7px}.abtn{display:inline-block;padding:5px 12px;border-radius:6px;border:1px solid;font-size:11px;font-weight:700;background:transparent;cursor:pointer}.fc{background:#181818;border-radius:8px;padding:13px;margin-bottom:12px}.ft{font-size:13px;font-weight:800;color:#c9a84c;margin-bottom:11px}label{font-size:10px;font-weight:700;color:#555;text-transform:uppercase;display:block;margin-bottom:3px}input,select{width:100%;padding:8px 10px;border-radius:7px;border:1px solid #222;background:#0d0d0d;color:#f0e6c8;font-size:13px;font-family:inherit;outline:none;margin-bottom:7px}input:focus,select:focus{border-color:#c9a84c}.btn{width:100%;padding:11px;border-radius:8px;border:none;background:#c9a84c;color:#0a0a0a;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}.btn2{background:transparent;border:1px solid #c9a84c;color:#c9a84c;margin-bottom:7px}.empty{text-align:center;color:#333;font-size:13px;padding:28px 0}.msg{background:#1a2a1a;border:1px solid #27ae60;border-radius:8px;padding:10px 12px;color:#27ae60;font-size:13px;font-weight:700;margin-bottom:12px}.ptag{display:inline-block;padding:2px 7px;border-radius:4px;background:#181818;border:1px solid #222;font-size:10px;color:#666;margin:2px}</style>";
}

function layout(titre, contenu, pwd) {
  var url = getUrl();
  var tabs = [
    {id:"dashboard",   emoji:"📊", label:"Stats"},
    {id:"commandes",   emoji:"🧾", label:"Cmdes"},
    {id:"plats",       emoji:"🍜", label:"Plats"},
    {id:"salaries",    emoji:"👥", label:"Equipe"},
    {id:"fournisseurs",emoji:"🚚", label:"Fourn"}
  ];
  var h = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'><title>" + titre + "</title>" + S() + "</head><body>";
  h += "<div class='top'><a href='" + url + "?action=dashboard&pwd=" + pwd + "' style='font-size:12px;color:#555;font-weight:700'>← Home</a><div class='tit'>🏮 " + NOM + "</div><div style='width:50px'></div></div>";
  h += "<div class='wrap'><div class='tabs'>";
  tabs.forEach(function(t) {
    var on = titre === t.id ? " on" : "";
    h += "<a href='" + url + "?action=" + t.id + "&pwd=" + pwd + "' class='tab" + on + "'>" + t.emoji + "</a>";
  });
  h += "</div>" + contenu + "</div></body></html>";
  return HtmlService.createHtmlOutput(h).setTitle(titre).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// LOGIN
// =====================================================

function showLogin(err) {
  var url = getUrl();
  var h = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Manager</title>" + S() + "</head><body>";
  h += "<div style='min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px'><div style='width:100%;max-width:300px;text-align:center'>";
  h += "<div style='font-size:52px;margin-bottom:12px'>🔐</div>";
  h += "<div style='font-size:20px;font-weight:900;color:#c9a84c;margin-bottom:6px'>Manager</div>";
  h += "<div style='font-size:12px;color:#555;margin-bottom:20px'>" + NOM + "</div>";
  if (err) h += "<div style='color:#e74c3c;font-size:12px;margin-bottom:12px'>" + err + "</div>";
  h += "<form method='GET' action='" + url + "'><input type='hidden' name='action' value='login' /><input type='password' name='pwd' placeholder='Mot de passe' style='text-align:center;margin-bottom:10px' autofocus /><button type='submit' class='btn'>Entrer</button></form>";
  h += "</div></div></body></html>";
  return HtmlService.createHtmlOutput(h).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// DASHBOARD
// =====================================================

function showDashboard(pwd) {
  var ws = getSheet("Commandes");
  var data = ws.getDataRange().getValues();
  var ca = 0; var nbLiv = 0; var nbTot = data.length - 1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][5] === "Livre") { ca += parseFloat(data[i][4]) || 0; nbLiv++; }
  }
  var moy = nbLiv > 0 ? ca / nbLiv : 0;
  var nbSal = getSheet("Salaries").getDataRange().getValues().length - 1;
  var nbFou = getSheet("Fournisseurs").getDataRange().getValues().length - 1;
  var url = getUrl();

  var c = "<div class='kg'>";
  c += "<div class='k k2'><div class='kv'>" + ca.toFixed(2) + " EUR</div><div class='kl'>Chiffre d affaires</div></div>";
  c += "<div class='k'><div class='kv'>" + nbTot + "</div><div class='kl'>Commandes</div></div>";
  c += "<div class='k'><div class='kv' style='color:#27ae60'>" + nbLiv + "</div><div class='kl'>Livrees</div></div>";
  c += "<div class='k'><div class='kv' style='color:#e67e22'>" + (nbTot - nbLiv) + "</div><div class='kl'>En cours</div></div>";
  c += "<div class='k'><div class='kv' style='color:#3498db'>" + moy.toFixed(2) + "</div><div class='kl'>Panier moy</div></div>";
  c += "<div class='k'><div class='kv'>" + nbSal + "</div><div class='kl'>Salaries</div></div>";
  c += "<div class='k'><div class='kv'>" + nbFou + "</div><div class='kl'>Fournisseurs</div></div>";
  c += "<div class='k k2'><a href='" + url + "?action=commandes&pwd=" + pwd + "'><button class='btn btn2'>🧾 Voir les commandes</button></a></div>";
  c += "</div>";
  return layout("dashboard", c, pwd);
}

// =====================================================
// COMMANDES
// =====================================================

function showCommandes(pwd, e) {
  var url = getUrl();
  var msg = "";

  // Traiter formulaire si soumis
  if (e && e.parameter.do === "add_cmd") {
    var ws2 = getSheet("Commandes");
    var h = Utilities.formatDate(new Date(), "Europe/Paris", "HH:mm");
    var d = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
    ws2.appendRow([genId(), h, e.parameter.client||"", e.parameter.articles||"", parseFloat(e.parameter.total)||0, "En attente", d]);
    msg = "<div class='msg'>✅ Commande ajoutee !</div>";
  }
  if (e && e.parameter.do === "maj" && e.parameter.row && e.parameter.ns) {
    var ws3 = getSheet("Commandes");
    ws3.getRange(parseInt(e.parameter.row), 6).setValue(e.parameter.ns);
    msg = "<div class='msg'>✅ Statut mis a jour !</div>";
  }

  var ws = getSheet("Commandes");
  var data = ws.getDataRange().getValues();
  var cmds = [];
  for (var i = 1; i < data.length; i++) {
    cmds.push({id:data[i][0],heure:data[i][1],client:data[i][2],articles:data[i][3],total:parseFloat(data[i][4])||0,statut:data[i][5],row:i+1});
  }
  cmds.reverse();

  var c = msg;
  c += "<div class='fc'><div class='ft'>+ Nouvelle commande</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='commandes' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<input type='hidden' name='do' value='add_cmd' />";
  c += "<label>Client</label><input type='text' name='client' placeholder='Prenom' />";
  c += "<label>Articles</label><input type='text' name='articles' placeholder='Nems x2, Poulet x1...' />";
  c += "<label>Total (EUR)</label><input type='text' name='total' placeholder='24.50' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (cmds.length === 0) {
    c += "<div class='empty'>Aucune commande</div>";
  }
  cmds.forEach(function(cmd) {
    var col = cmd.statut === "En attente" ? "#e67e22" : cmd.statut === "En preparation" ? "#3498db" : cmd.statut === "Pret" ? "#27ae60" : "#444";
    c += "<div class='card'><div class='crow'><div class='cid'>N" + String(cmd.id).padStart(3,"0") + "</div><div class='cnom'>" + cmd.client + "</div><div class='cbdg' style='color:" + col + ";border-color:" + col + "'>" + cmd.statut + "</div></div>";
    c += "<div class='cmeta'>" + cmd.heure + " · " + cmd.total.toFixed(2) + " EUR</div>";
    if (cmd.articles) c += "<div class='carts'>" + cmd.articles + "</div>";
    if (cmd.statut !== "Livre") {
      var ns = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
      var bl = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Pret !" : "Livre";
      c += "<a href='" + url + "?action=commandes&pwd=" + pwd + "&do=maj&row=" + cmd.row + "&ns=" + encodeURIComponent(ns) + "' class='abtn' style='color:" + col + ";border-color:" + col + "'>▶ " + bl + "</a>";
    }
    c += "</div>";
  });
  return layout("commandes", c, pwd);
}

// =====================================================
// PLATS
// =====================================================

function showPlats(pwd, e) {
  var url = getUrl();
  var msg = "";

  if (e && e.parameter.do === "add_plat") {
    var ws2 = getSheet("Plats");
    ws2.appendRow([genId(), e.parameter.cat||"", e.parameter.nom||"", parseFloat(e.parameter.prix)||0, e.parameter.desc||""]);
    msg = "<div class='msg'>✅ Plat ajoute !</div>";
  }

  var ws = getSheet("Plats");
  var data = ws.getDataRange().getValues();

  var c = msg;
  c += "<div class='fc'><div class='ft'>+ Ajouter un plat</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='plats' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<input type='hidden' name='do' value='add_plat' />";
  c += "<label>Categorie</label><select name='cat'><option>Entrees</option><option>Poulet</option><option>Boeuf</option><option>Porc</option><option>Mer</option><option>Vege</option><option>Riz</option><option>Desserts</option><option>Boissons</option></select>";
  c += "<label>Nom</label><input type='text' name='nom' placeholder='Ex: Boeuf sechuan' />";
  c += "<label>Prix</label><input type='text' name='prix' placeholder='12.50' />";
  c += "<label>Description</label><input type='text' name='desc' placeholder='Wok sauce sechuan' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (data.length > 1) {
    c += "<div style='font-size:11px;font-weight:700;color:#c9a84c;margin-bottom:7px;text-transform:uppercase'>Plats ajoutes (" + (data.length-1) + ")</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'><div style='flex:1;font-size:13px;font-weight:700'>" + data[i][2] + "</div><div style='font-size:13px;font-weight:800;color:#c9a84c'>" + parseFloat(data[i][3]).toFixed(2) + " EUR</div></div>";
      c += "<div style='font-size:11px;color:#555'>" + data[i][1] + " · " + data[i][4] + "</div></div>";
    }
  } else {
    c += "<div class='empty'>Aucun plat ajoute</div>";
  }
  return layout("plats", c, pwd);
}

// =====================================================
// SALARIES
// =====================================================

function showSalaries(pwd, e) {
  var url = getUrl();
  var msg = "";

  if (e && e.parameter.do === "add_sal") {
    var ws2 = getSheet("Salaries");
    ws2.appendRow([genId(), e.parameter.nom||"", e.parameter.poste||"", e.parameter.tel||"", parseFloat(e.parameter.salaire)||0]);
    msg = "<div class='msg'>✅ Salarie ajoute !</div>";
  }

  var ws = getSheet("Salaries");
  var data = ws.getDataRange().getValues();

  var c = msg;
  c += "<div class='fc'><div class='ft'>+ Ajouter un salarie</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='salaries' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<input type='hidden' name='do' value='add_sal' />";
  c += "<label>Nom complet</label><input type='text' name='nom' placeholder='Jean Dupont' />";
  c += "<label>Poste</label><select name='poste'><option>Cuisinier</option><option>Serveur</option><option>Caissier</option><option>Manager</option><option>Livreur</option><option>Plongeur</option></select>";
  c += "<label>Telephone</label><input type='text' name='tel' placeholder='06 12 34 56 78' />";
  c += "<label>Salaire mensuel</label><input type='text' name='salaire' placeholder='1800' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (data.length <= 1) {
    c += "<div class='empty'>Aucun salarie</div>";
  } else {
    c += "<div style='font-size:11px;font-weight:700;color:#c9a84c;margin-bottom:7px;text-transform:uppercase'>Equipe (" + (data.length-1) + " personnes)</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'><div style='flex:1;font-size:13px;font-weight:700'>" + data[i][1] + "</div><div class='cbdg' style='color:#c9a84c;border-color:#c9a84c40'>" + data[i][2] + "</div></div>";
      c += "<div style='font-size:11px;color:#555'>" + (data[i][3]||"") + " · " + parseFloat(data[i][4]||0).toFixed(0) + " EUR/mois</div></div>";
    }
  }
  return layout("salaries", c, pwd);
}

// =====================================================
// FOURNISSEURS
// =====================================================

function showFournisseurs(pwd, e) {
  var url = getUrl();
  var msg = "";

  if (e && e.parameter.do === "add_fou") {
    var ws2 = getSheet("Fournisseurs");
    ws2.appendRow([genId(), e.parameter.nom||"", e.parameter.contact||"", e.parameter.tel||"", e.parameter.produits||""]);
    msg = "<div class='msg'>✅ Fournisseur ajoute !</div>";
  }

  var ws = getSheet("Fournisseurs");
  var data = ws.getDataRange().getValues();

  var c = msg;
  c += "<div class='fc'><div class='ft'>+ Ajouter un fournisseur</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='fournisseurs' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<input type='hidden' name='do' value='add_fou' />";
  c += "<label>Nom societe</label><input type='text' name='nom' placeholder='Metro Cash and Carry' />";
  c += "<label>Contact</label><input type='text' name='contact' placeholder='M. Martin' />";
  c += "<label>Telephone</label><input type='text' name='tel' placeholder='04 72 00 00 00' />";
  c += "<label>Produits fournis</label><input type='text' name='produits' placeholder='Viandes legumes epicerie' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (data.length <= 1) {
    c += "<div class='empty'>Aucun fournisseur</div>";
  } else {
    c += "<div style='font-size:11px;font-weight:700;color:#c9a84c;margin-bottom:7px;text-transform:uppercase'>Fournisseurs (" + (data.length-1) + ")</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'><div style='flex:1;font-size:13px;font-weight:700'>" + data[i][1] + "</div></div>";
      c += "<div style='font-size:11px;color:#555'>" + (data[i][2]||"") + " · " + (data[i][3]||"") + "</div>";
      c += "<div style='font-size:12px;color:#c9a84c;margin-top:4px'>" + (data[i][4]||"") + "</div></div>";
    }
  }
  return layout("fournisseurs", c, pwd);
}
