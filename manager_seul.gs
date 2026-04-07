// =====================================================
// DRAGON PALACE — MANAGER SEUL
// Colle ce fichier dans un NOUVEAU Google Sheets
// Mot de passe : resto2026
// =====================================================

var PWD = "resto2026";
var NOM = "Dragon Palace";

var PLATS_MENU = [
  "Nems au porc (x3) - 5.50 EUR",
  "Nems aux crevettes (x3) - 6.00 EUR",
  "Raviolis vapeur (x6) - 7.00 EUR",
  "Soupe wonton - 6.50 EUR",
  "Soupe pekino ise - 5.50 EUR",
  "Salade de concombre - 4.50 EUR",
  "Poulet aigre-doux - 10.50 EUR",
  "Poulet general Tao - 11.00 EUR",
  "Poulet au citron - 10.50 EUR",
  "Poulet kung pao - 11.50 EUR",
  "Poulet saute aux legumes - 10.00 EUR",
  "Boeuf aux oignons - 12.50 EUR",
  "Boeuf a la citronnelle - 13.00 EUR",
  "Boeuf au brocoli - 12.50 EUR",
  "Boeuf mongolien - 13.50 EUR",
  "Porc laque - 12.00 EUR",
  "Porc au caramel - 11.50 EUR",
  "Travers de porc (x4) - 13.00 EUR",
  "Crevettes vapeur - 14.50 EUR",
  "Crevettes sautees epicees - 15.00 EUR",
  "Saumon teriyaki - 15.50 EUR",
  "Calamars sautes - 13.50 EUR",
  "Tofu mapo - 9.50 EUR",
  "Legumes sautes wok - 9.00 EUR",
  "Aubergines a l ail - 9.50 EUR",
  "Riz blanc - 2.50 EUR",
  "Riz cantonais - 4.50 EUR",
  "Riz frit poulet - 8.50 EUR",
  "Nouilles sautees legumes - 8.00 EUR",
  "Nouilles sautees poulet - 9.50 EUR",
  "Beignets bananes - 5.50 EUR",
  "Beignets pommes - 5.50 EUR",
  "Glace au sesame - 4.50 EUR",
  "Creme de mangue - 5.00 EUR",
  "Fortune cookies (x3) - 3.00 EUR",
  "The au jasmin - 2.50 EUR",
  "The vert glace - 3.00 EUR",
  "Bubble tea taro - 5.00 EUR",
  "Coca-Cola - 2.50 EUR",
  "Eau minerale - 1.50 EUR"
];

function doGet(e) {
  var p = e.parameter;
  var action = p.action || "login";

  if (action === "login") return showLogin(e);
  if (action === "dashboard") return showDashboard(e);
  if (action === "commandes") return showCommandes(e);
  if (action === "plats") return showPlats(e);
  if (action === "salaries") return showSalaries(e);
  if (action === "fournisseurs") return showFournisseurs(e);
  if (action === "maj") return majStatut(e);
  if (action === "add_commande") return addCommande(e);
  if (action === "add_plat") return addPlat(e);
  if (action === "add_salarie") return addSalarie(e);
  if (action === "add_fournisseur") return addFournisseur(e);
  return showLogin(e);
}

function getUrl() {
  return ScriptApp.getService().getUrl();
}

function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName("Commandes")) {
    var w = ss.insertSheet("Commandes");
    w.appendRow(["ID","Heure","Client","Articles","Total","Statut","Date"]);
  }
  if (!ss.getSheetByName("Plats")) {
    var w2 = ss.insertSheet("Plats");
    w2.appendRow(["ID","Categorie","Nom","Prix","Description"]);
  }
  if (!ss.getSheetByName("Salaries")) {
    var w3 = ss.insertSheet("Salaries");
    w3.appendRow(["ID","Nom","Poste","Tel","Salaire"]);
  }
  if (!ss.getSheetByName("Fournisseurs")) {
    var w4 = ss.insertSheet("Fournisseurs");
    w4.appendRow(["ID","Nom","Contact","Tel","Produits"]);
  }
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName(name);
  if (!ws) {
    initSheets();
    ws = ss.getSheetByName(name);
  }
  return ws;
}

function genId() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

function checkPwd(e) {
  return (e.parameter.pwd || "") === PWD;
}

// =====================================================
// CSS
// =====================================================

function css() {
  return "<style>" +
    "*{margin:0;padding:0;box-sizing:border-box}" +
    "body{font-family:sans-serif;background:#0a0a0a;color:#f0e6c8;padding:0}" +
    "a{color:inherit;text-decoration:none}" +
    ".wrap{max-width:460px;margin:0 auto;padding:12px}" +
    ".top{background:#111;border-bottom:1px solid #2a2a2a;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}" +
    ".top-titre{font-size:16px;font-weight:800;color:#c9a84c}" +
    ".top-back{font-size:13px;color:#888;background:none;border:none;cursor:pointer;font-family:inherit}" +
    ".tabs{display:flex;gap:4px;background:#1a1a1a;border-radius:8px;padding:4px;margin-bottom:14px}" +
    ".tab{flex:1;padding:8px 2px;border-radius:6px;border:none;background:transparent;color:#666;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;text-align:center;display:block}" +
    ".tab.on{background:#c9a84c;color:#0a0a0a}" +
    ".kgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}" +
    ".k{background:#1a1a1a;border-radius:8px;padding:12px;text-align:center}" +
    ".k2{grid-column:span 2}" +
    ".kv{font-size:22px;font-weight:900;color:#c9a84c}" +
    ".kl{font-size:10px;color:#666;text-transform:uppercase;margin-top:2px}" +
    ".card{background:#1a1a1a;border-radius:8px;padding:12px;margin-bottom:8px}" +
    ".crow{display:flex;align-items:center;gap:8px;margin-bottom:4px}" +
    ".cid{font-size:15px;font-weight:900;color:#c9a84c;min-width:50px}" +
    ".cnom{flex:1;font-size:14px;font-weight:700}" +
    ".cbadge{font-size:10px;font-weight:700;border:1px solid;border-radius:5px;padding:2px 7px}" +
    ".cmeta{font-size:11px;color:#666;margin-bottom:6px}" +
    ".carts{font-size:12px;color:#aaa;line-height:1.6;margin-bottom:8px}" +
    ".abtn{display:inline-block;padding:6px 14px;border-radius:6px;border:1px solid;font-size:12px;font-weight:700;background:transparent;cursor:pointer;font-family:inherit}" +
    ".fcard{background:#1a1a1a;border-radius:8px;padding:14px;margin-bottom:12px}" +
    ".ft{font-size:14px;font-weight:800;color:#c9a84c;margin-bottom:12px}" +
    "label{font-size:10px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:3px}" +
    "input,select,textarea{width:100%;padding:9px 11px;border-radius:7px;border:1px solid #2a2a2a;background:#0d0d0d;color:#f0e6c8;font-size:13px;font-family:inherit;outline:none;margin-bottom:8px}" +
    "input:focus,select:focus{border-color:#c9a84c}" +
    ".btn{width:100%;padding:12px;border-radius:8px;border:none;background:#c9a84c;color:#0a0a0a;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}" +
    ".btn2{background:transparent;border:1px solid #c9a84c;color:#c9a84c}" +
    ".empty{text-align:center;color:#444;font-size:14px;padding:32px 0}" +
    ".sep{height:1px;background:#2a2a2a;margin:12px 0}" +
    ".ptag{display:inline-block;padding:2px 8px;border-radius:4px;background:#1a1a1a;border:1px solid #2a2a2a;font-size:11px;color:#888;margin:2px}" +
    "</style>";
}

function page(titre, contenu, pwd) {
  var url = getUrl();
  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'>";
  html += "<title>" + titre + " — " + NOM + "</title>" + css() + "</head><body>";
  html += "<div class='top'>";
  html += "<a href='" + url + "?action=dashboard&pwd=" + pwd + "'><button class='top-back'>← Accueil</button></a>";
  html += "<div class='top-titre'>🏮 " + NOM + "</div><div style='width:60px'></div></div>";
  html += "<div class='wrap'>";

  // TABS
  var tabs = [
    {id:"dashboard",label:"📊"},
    {id:"commandes",label:"🧾"},
    {id:"plats",label:"🍜"},
    {id:"salaries",label:"👥"},
    {id:"fournisseurs",label:"🚚"}
  ];
  html += "<div class='tabs' style='margin-top:12px'>";
  tabs.forEach(function(t) {
    var on = titre.toLowerCase().indexOf(t.id.substring(0,4)) >= 0 ? " on" : "";
    html += "<a href='" + url + "?action=" + t.id + "&pwd=" + pwd + "' class='tab" + on + "'>" + t.label + "</a>";
  });
  html += "</div>";

  html += contenu;
  html += "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle(titre).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// LOGIN
// =====================================================

function showLogin(e) {
  var url = getUrl();
  var err = e.parameter.err ? "<div style='color:#e74c3c;margin-bottom:12px;font-size:13px'>Mot de passe incorrect</div>" : "";
  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
  html += "<title>Manager</title>" + css() + "</head><body>";
  html += "<div style='min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px'>";
  html += "<div style='width:100%;max-width:320px;text-align:center'>";
  html += "<div style='font-size:56px;margin-bottom:12px'>🔐</div>";
  html += "<div style='font-size:22px;font-weight:900;color:#c9a84c;margin-bottom:6px'>Espace Manager</div>";
  html += "<div style='font-size:13px;color:#666;margin-bottom:24px'>" + NOM + "</div>";
  html += err;
  html += "<form method='GET' action='" + url + "'>";
  html += "<input type='hidden' name='action' value='dashboard' />";
  html += "<input type='password' name='pwd' placeholder='Mot de passe' style='text-align:center;margin-bottom:12px' autofocus />";
  html += "<button type='submit' class='btn'>Entrer</button>";
  html += "</form></div></div></body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// DASHBOARD
// =====================================================

function showDashboard(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var pwd = e.parameter.pwd;

  var ws = getSheet("Commandes");
  var data = ws.getDataRange().getValues();
  var total = 0;
  var nbLiv = 0;
  var nbTotal = data.length - 1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][5] === "Livre") { total += parseFloat(data[i][4]) || 0; nbLiv++; }
  }
  var panier = nbLiv > 0 ? total / nbLiv : 0;
  var nbSal = getSheet("Salaries").getDataRange().getValues().length - 1;
  var nbFou = getSheet("Fournisseurs").getDataRange().getValues().length - 1;
  var nbPlats = getSheet("Plats").getDataRange().getValues().length - 1;

  var c = "<div class='kgrid'>";
  c += "<div class='k k2'><div class='kv'>" + total.toFixed(2) + " EUR</div><div class='kl'>Chiffre d affaires</div></div>";
  c += "<div class='k'><div class='kv'>" + nbTotal + "</div><div class='kl'>Commandes</div></div>";
  c += "<div class='k'><div class='kv' style='color:#27ae60'>" + nbLiv + "</div><div class='kl'>Livrees</div></div>";
  c += "<div class='k'><div class='kv' style='color:#e67e22'>" + (nbTotal - nbLiv) + "</div><div class='kl'>En cours</div></div>";
  c += "<div class='k'><div class='kv' style='color:#3498db'>" + panier.toFixed(2) + " EUR</div><div class='kl'>Panier moyen</div></div>";
  c += "<div class='k'><div class='kv'>" + nbSal + "</div><div class='kl'>Salaries</div></div>";
  c += "<div class='k'><div class='kv'>" + nbFou + "</div><div class='kl'>Fournisseurs</div></div>";
  c += "<div class='k'><div class='kv'>" + nbPlats + "</div><div class='kl'>Plats ajoutes</div></div>";
  c += "</div>";
  c += "<a href='" + getUrl() + "?action=commandes&pwd=" + pwd + "'><button class='btn btn2' style='margin-bottom:8px'>🧾 Voir les commandes</button></a>";

  return page("Dashboard", c, pwd);
}

// =====================================================
// COMMANDES
// =====================================================

function showCommandes(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var pwd = e.parameter.pwd;
  var url = getUrl();

  var ws = getSheet("Commandes");
  var data = ws.getDataRange().getValues();
  var cmds = [];
  for (var i = 1; i < data.length; i++) {
    cmds.push({id:data[i][0],heure:data[i][1],client:data[i][2],articles:data[i][3],total:parseFloat(data[i][4])||0,statut:data[i][5],row:i+1});
  }
  cmds.reverse();

  var c = "<div class='fcard'><div class='ft'>+ Ajouter une commande</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='add_commande' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<label>Client</label><input type='text' name='client' placeholder='Prenom du client' />";
  c += "<label>Articles</label><input type='text' name='articles' placeholder='Ex: Nems x2, Poulet x1' />";
  c += "<label>Total (EUR)</label><input type='text' name='total' placeholder='Ex: 24.50' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (cmds.length === 0) {
    c += "<div class='empty'>Aucune commande</div>";
  }

  cmds.forEach(function(cmd) {
    var col = cmd.statut === "En attente" ? "#e67e22" : cmd.statut === "En preparation" ? "#3498db" : cmd.statut === "Pret" ? "#27ae60" : "#555";
    c += "<div class='card'><div class='crow'>";
    c += "<div class='cid'>N " + String(cmd.id).padStart(3,"0") + "</div>";
    c += "<div class='cnom'>" + cmd.client + "</div>";
    c += "<div class='cbadge' style='color:" + col + ";border-color:" + col + "'>" + cmd.statut + "</div></div>";
    c += "<div class='cmeta'>" + cmd.heure + " · " + cmd.total.toFixed(2) + " EUR</div>";
    if (cmd.articles) c += "<div class='carts'>" + cmd.articles + "</div>";
    if (cmd.statut !== "Livre") {
      var ns = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
      var bl = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Pret !" : "Livre";
      c += "<a href='" + url + "?action=maj&row=" + cmd.row + "&statut=" + encodeURIComponent(ns) + "&pwd=" + pwd + "' class='abtn' style='color:" + col + ";border-color:" + col + "'>▶ " + bl + "</a>";
    }
    c += "</div>";
  });

  return page("Commandes", c, pwd);
}

function addCommande(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var ws = getSheet("Commandes");
  var heure = Utilities.formatDate(new Date(), "Europe/Paris", "HH:mm");
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
  ws.appendRow([genId(), heure, e.parameter.client||"", e.parameter.articles||"", parseFloat(e.parameter.total)||0, "En attente", date]);
  return redirect(getUrl() + "?action=commandes&pwd=" + (e.parameter.pwd || PWD));
}

function majStatut(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var ws = getSheet("Commandes");
  ws.getRange(parseInt(e.parameter.row), 6).setValue(e.parameter.statut || "En attente");
  return redirect(getUrl() + "?action=commandes&pwd=" + (e.parameter.pwd || PWD));
}

// =====================================================
// PLATS
// =====================================================

function showPlats(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var pwd = e.parameter.pwd;
  var url = getUrl();

  var ws = getSheet("Plats");
  var data = ws.getDataRange().getValues();

  var c = "<div class='fcard'><div class='ft'>+ Ajouter un plat</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='add_plat' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<label>Categorie</label>";
  c += "<select name='cat'><option>Entrees</option><option>Poulet</option><option>Boeuf</option><option>Porc</option><option>Mer</option><option>Vege</option><option>Riz</option><option>Desserts</option><option>Boissons</option></select>";
  c += "<label>Nom</label><input type='text' name='nom' placeholder='Ex: Boeuf sechuan' />";
  c += "<label>Prix (EUR)</label><input type='text' name='prix' placeholder='Ex: 12.50' />";
  c += "<label>Description</label><input type='text' name='desc' placeholder='Ex: Wok sauce sechuan' />";
  c += "<button type='submit' class='btn'>Ajouter le plat</button></form></div>";

  // Plats ajoutes
  if (data.length > 1) {
    c += "<div style='font-size:12px;font-weight:700;color:#c9a84c;margin-bottom:8px;text-transform:uppercase'>Plats ajoutes (" + (data.length-1) + ")</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'>";
      c += "<div style='flex:1;font-size:13px;font-weight:700'>" + data[i][2] + "</div>";
      c += "<div style='font-size:13px;font-weight:800;color:#c9a84c'>" + parseFloat(data[i][3]).toFixed(2) + " EUR</div></div>";
      c += "<div style='font-size:11px;color:#666'>" + data[i][1] + " · " + data[i][4] + "</div></div>";
    }
    c += "<div class='sep'></div>";
  }

  // Menu de base
  c += "<div style='font-size:12px;font-weight:700;color:#888;margin-bottom:8px;text-transform:uppercase'>Menu principal (" + PLATS_MENU.length + " plats)</div>";
  PLATS_MENU.forEach(function(p) {
    c += "<div class='ptag'>" + p + "</div>";
  });

  return page("Plats", c, pwd);
}

function addPlat(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var ws = getSheet("Plats");
  ws.appendRow([genId(), e.parameter.cat||"", e.parameter.nom||"", parseFloat(e.parameter.prix)||0, e.parameter.desc||""]);
  return redirect(getUrl() + "?action=plats&pwd=" + (e.parameter.pwd || PWD));
}

// =====================================================
// SALARIES
// =====================================================

function showSalaries(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var pwd = e.parameter.pwd;
  var url = getUrl();

  var ws = getSheet("Salaries");
  var data = ws.getDataRange().getValues();

  var c = "<div class='fcard'><div class='ft'>+ Ajouter un salarie</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='add_salarie' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<label>Nom complet</label><input type='text' name='nom' placeholder='Ex: Jean Dupont' />";
  c += "<label>Poste</label><select name='poste'><option>Cuisinier</option><option>Serveur</option><option>Caissier</option><option>Manager</option><option>Livreur</option><option>Plongeur</option></select>";
  c += "<label>Telephone</label><input type='text' name='tel' placeholder='Ex: 06 12 34 56 78' />";
  c += "<label>Salaire mensuel (EUR)</label><input type='text' name='salaire' placeholder='Ex: 1800' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (data.length <= 1) {
    c += "<div class='empty'>Aucun salarie</div>";
  } else {
    c += "<div style='font-size:12px;font-weight:700;color:#c9a84c;margin-bottom:8px;text-transform:uppercase'>Equipe (" + (data.length-1) + " personnes)</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'>";
      c += "<div style='flex:1;font-size:14px;font-weight:700'>" + data[i][1] + "</div>";
      c += "<div class='cbadge' style='color:#c9a84c;border-color:#c9a84c40'>" + data[i][2] + "</div></div>";
      c += "<div style='font-size:11px;color:#666'>" + (data[i][3]||"") + " · " + parseFloat(data[i][4]||0).toFixed(0) + " EUR/mois</div></div>";
    }
  }

  return page("Salaries", c, pwd);
}

function addSalarie(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var ws = getSheet("Salaries");
  ws.appendRow([genId(), e.parameter.nom||"", e.parameter.poste||"", e.parameter.tel||"", parseFloat(e.parameter.salaire)||0]);
  return redirect(getUrl() + "?action=salaries&pwd=" + (e.parameter.pwd || PWD));
}

// =====================================================
// FOURNISSEURS
// =====================================================

function showFournisseurs(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var pwd = e.parameter.pwd;
  var url = getUrl();

  var ws = getSheet("Fournisseurs");
  var data = ws.getDataRange().getValues();

  var c = "<div class='fcard'><div class='ft'>+ Ajouter un fournisseur</div>";
  c += "<form method='GET' action='" + url + "'>";
  c += "<input type='hidden' name='action' value='add_fournisseur' />";
  c += "<input type='hidden' name='pwd' value='" + pwd + "' />";
  c += "<label>Nom societe</label><input type='text' name='nom' placeholder='Ex: Metro Cash and Carry' />";
  c += "<label>Contact</label><input type='text' name='contact' placeholder='Ex: M. Martin' />";
  c += "<label>Telephone</label><input type='text' name='tel' placeholder='Ex: 04 72 00 00 00' />";
  c += "<label>Produits fournis</label><input type='text' name='produits' placeholder='Ex: Viandes legumes epicerie' />";
  c += "<button type='submit' class='btn'>Ajouter</button></form></div>";

  if (data.length <= 1) {
    c += "<div class='empty'>Aucun fournisseur</div>";
  } else {
    c += "<div style='font-size:12px;font-weight:700;color:#c9a84c;margin-bottom:8px;text-transform:uppercase'>Fournisseurs (" + (data.length-1) + ")</div>";
    for (var i = 1; i < data.length; i++) {
      c += "<div class='card'><div class='crow'>";
      c += "<div style='flex:1;font-size:14px;font-weight:700'>" + data[i][1] + "</div></div>";
      c += "<div style='font-size:11px;color:#666'>" + (data[i][2]||"") + " · " + (data[i][3]||"") + "</div>";
      c += "<div style='font-size:12px;color:#c9a84c;margin-top:4px'>" + (data[i][4]||"") + "</div></div>";
    }
  }

  return page("Fournisseurs", c, pwd);
}

function addFournisseur(e) {
  if (!checkPwd(e)) return redirect(getUrl() + "?action=login&err=1");
  var ws = getSheet("Fournisseurs");
  ws.appendRow([genId(), e.parameter.nom||"", e.parameter.contact||"", e.parameter.tel||"", e.parameter.produits||""]);
  return redirect(getUrl() + "?action=fournisseurs&pwd=" + (e.parameter.pwd || PWD));
}

// =====================================================
// REDIRECT
// =====================================================

function redirect(url) {
  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta http-equiv='refresh' content='0;url=" + url + "'></head><body>Chargement...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
