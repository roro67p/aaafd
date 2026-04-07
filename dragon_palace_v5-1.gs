// =====================================================
// DRAGON PALACE V2 — Restaurant Chinois a Emporter
// Google Apps Script — Version Premium Noir/Or
// =====================================================

var CONFIG = {
  NOM: "Dragon Palace",
  SOUS_TITRE: "Cuisine Chinoise Authentique",
  TEL: "04 72 00 00 00",
  ADRESSE: "12 rue de la Paix, Lyon",
  HORAIRES: "Lun-Dim 11h30 - 14h30 | 18h30 - 22h30",
  MOT_DE_PASSE: "resto2026",
  EMAIL: "contact@dragonpalace.fr"
};

var MENU_DATA = [
  { id:"ne1", cat:"Entrees",   nom:"Nems au porc (x3)",         prix:5.50,  emoji:"🥟", desc:"Rouleaux croustillants sauce nuoc-mam" },
  { id:"ne2", cat:"Entrees",   nom:"Nems aux crevettes (x3)",   prix:6.00,  emoji:"🥟", desc:"Crevettes legumes sauce aigre-douce" },
  { id:"ne3", cat:"Entrees",   nom:"Raviolis vapeur (x6)",      prix:7.00,  emoji:"🥟", desc:"Dim sum maison sauce soja gingembre" },
  { id:"ne4", cat:"Entrees",   nom:"Soupe wonton",              prix:6.50,  emoji:"🍜", desc:"Bouillon clair raviolis ciboule" },
  { id:"ne5", cat:"Entrees",   nom:"Soupe pekino ise",          prix:5.50,  emoji:"🍜", desc:"Epicee oeuf champignons noirs" },
  { id:"ne6", cat:"Entrees",   nom:"Salade de concombre",       prix:4.50,  emoji:"🥗", desc:"Ail sesame huile pimentee" },
  { id:"ne7", cat:"Entrees",   nom:"Bouchees vapeur (x4)",      prix:6.00,  emoji:"🥢", desc:"Porc chou sauce ponzu" },
  { id:"pc1", cat:"Poulet",    nom:"Poulet aigre-doux",         prix:10.50, emoji:"🍗", desc:"Sauce ananas poivrons carottes" },
  { id:"pc2", cat:"Poulet",    nom:"Poulet general Tao",        prix:11.00, emoji:"🍗", desc:"Sauce legerement epicee et sucree" },
  { id:"pc3", cat:"Poulet",    nom:"Poulet au citron",          prix:10.50, emoji:"🍗", desc:"Sauce citronnee legere et doree" },
  { id:"pc4", cat:"Poulet",    nom:"Poulet kung pao",           prix:11.50, emoji:"🌶️", desc:"Cacahuetes piments sauce epicee" },
  { id:"pc5", cat:"Poulet",    nom:"Poulet saute aux legumes",  prix:10.00, emoji:"🥦", desc:"Wok legumes croquants sauce huitre" },
  { id:"bo1", cat:"Boeuf",     nom:"Boeuf aux oignons",         prix:12.50, emoji:"🥩", desc:"Emince de boeuf oignons caramelises" },
  { id:"bo2", cat:"Boeuf",     nom:"Boeuf a la citronnelle",    prix:13.00, emoji:"🥩", desc:"Parfume legerement epicee" },
  { id:"bo3", cat:"Boeuf",     nom:"Boeuf au brocoli",          prix:12.50, emoji:"🥦", desc:"Sauce soja gingembre sesame" },
  { id:"bo4", cat:"Boeuf",     nom:"Boeuf mongolien",           prix:13.50, emoji:"🥩", desc:"Sauce hoisin echalotes frites" },
  { id:"po1", cat:"Porc",      nom:"Porc laque",                prix:12.00, emoji:"🐷", desc:"Sauce barbecue pekinoise miel" },
  { id:"po2", cat:"Porc",      nom:"Porc au caramel",           prix:11.50, emoji:"🍬", desc:"Sauce caramelisee notes de gingembre" },
  { id:"po3", cat:"Porc",      nom:"Travers de porc (x4)",      prix:13.00, emoji:"🍖", desc:"Marines laques sauce hoisin" },
  { id:"me1", cat:"Mer",       nom:"Crevettes vapeur",          prix:14.50, emoji:"🦐", desc:"Sauce gingembre ciboule delicates" },
  { id:"me2", cat:"Mer",       nom:"Crevettes sautees epicees", prix:15.00, emoji:"🌶️", desc:"Wok ail piments coriandre" },
  { id:"me3", cat:"Mer",       nom:"Saumon teriyaki",           prix:15.50, emoji:"🐟", desc:"Sauce teriyaki maison sesame" },
  { id:"me4", cat:"Mer",       nom:"Calamars sautes",           prix:13.50, emoji:"🦑", desc:"Legumes croquants sauce aux haricots" },
  { id:"ve1", cat:"Vege",      nom:"Tofu mapo",                 prix:9.50,  emoji:"🌱", desc:"Sauce epicee sichuanaise champignons" },
  { id:"ve2", cat:"Vege",      nom:"Legumes sautes wok",        prix:9.00,  emoji:"🥦", desc:"Brocoli champignons poivrons wok" },
  { id:"ve3", cat:"Vege",      nom:"Aubergines a l ail",        prix:9.50,  emoji:"🍆", desc:"Sauce epicee douce basilic thai" },
  { id:"rn1", cat:"Riz",       nom:"Riz blanc",                 prix:2.50,  emoji:"🍚", desc:"Riz jasmin nature" },
  { id:"rn2", cat:"Riz",       nom:"Riz cantonais",             prix:4.50,  emoji:"🍳", desc:"Oeuf petits pois jambon wok" },
  { id:"rn3", cat:"Riz",       nom:"Riz frit poulet",           prix:8.50,  emoji:"🍗", desc:"Wok legumes sauce soja" },
  { id:"rn4", cat:"Riz",       nom:"Nouilles sautees legumes",  prix:8.00,  emoji:"🍜", desc:"Chow mein legumes sauce huitre" },
  { id:"rn5", cat:"Riz",       nom:"Nouilles sautees poulet",   prix:9.50,  emoji:"🍜", desc:"Chow mein poulet wok flambe" },
  { id:"de1", cat:"Desserts",  nom:"Beignets bananes",          prix:5.50,  emoji:"🍌", desc:"Caramelises sesame croustillants" },
  { id:"de2", cat:"Desserts",  nom:"Beignets pommes",           prix:5.50,  emoji:"🍎", desc:"Sauce caramel graines de sesame" },
  { id:"de3", cat:"Desserts",  nom:"Glace au sesame",           prix:4.50,  emoji:"🍨", desc:"Artisanale notes de sesame noir" },
  { id:"de4", cat:"Desserts",  nom:"Creme de mangue",           prix:5.00,  emoji:"🥭", desc:"Fraiche legere mangue Alphonso" },
  { id:"de5", cat:"Desserts",  nom:"Fortune cookies (x3)",      prix:3.00,  emoji:"🥠", desc:"Tradition maison" },
  { id:"bv1", cat:"Boissons",  nom:"The au jasmin",             prix:2.50,  emoji:"🍵", desc:"Chaud ou glace" },
  { id:"bv2", cat:"Boissons",  nom:"The vert glace",            prix:3.00,  emoji:"🧋", desc:"Sucre rafraichissant" },
  { id:"bv3", cat:"Boissons",  nom:"Bubble tea taro",           prix:5.00,  emoji:"🧋", desc:"Lait de taro perles tapioca" },
  { id:"bv4", cat:"Boissons",  nom:"Coca-Cola",                 prix:2.50,  emoji:"🥤", desc:"33cl" },
  { id:"bv5", cat:"Boissons",  nom:"Eau minerale",              prix:1.50,  emoji:"💧", desc:"50cl" }
];

// =====================================================
// CSS GLOBAL PREMIUM
// =====================================================

function getCss() {
  return "<style>" +
  "*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}" +
  "body{font-family:'Inter',sans-serif;background:#080808;color:#f0e6c8;min-height:100vh}" +
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');" +
  ":root{--or:#c9a84c;--or2:#e8c97a;--dark:#080808;--card:#111;--card2:#181818;--border:rgba(201,168,76,0.15);--text:#f0e6c8;--muted:rgba(240,230,200,0.45)}" +
  "a{color:inherit;text-decoration:none}" +
  ".page{max-width:480px;margin:0 auto;padding:0 0 80px}" +

  /* NAV */
  ".nav{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;z-index:100;background:rgba(8,8,8,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);padding:14px 20px;display:flex;align-items:center;justify-content:space-between}" +
  ".nav-logo{font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:var(--or);letter-spacing:0.05em}" +
  ".nav-btn{padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:rgba(201,168,76,0.08);color:var(--or);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}" +
  ".nav-panier{position:relative;width:40px;height:40px;border-radius:10px;border:1px solid var(--or);background:rgba(201,168,76,0.1);color:var(--or);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
  ".badge{position:absolute;top:-6px;right:-6px;background:var(--or);color:#080808;border-radius:50%;width:18px;height:18px;font-size:11px;font-weight:900;display:none;align-items:center;justify-content:center}" +

  /* HERO */
  ".hero{margin-top:60px;padding:40px 20px 32px;text-align:center;background:linear-gradient(180deg,rgba(201,168,76,0.06) 0%,transparent 100%)}" +
  ".hero-emoji{font-size:64px;margin-bottom:12px;filter:drop-shadow(0 0 30px rgba(201,168,76,0.4))}" +
  ".hero-titre{font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:var(--or);margin-bottom:6px;line-height:1.1}" +
  ".hero-sous{font-size:13px;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:24px}" +
  ".hero-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}" +
  ".btn-or{padding:13px 24px;border-radius:10px;border:none;background:linear-gradient(135deg,#c9a84c,#e8c97a);color:#080808;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}" +
  ".btn-outline{padding:13px 24px;border-radius:10px;border:1px solid var(--or);background:transparent;color:var(--or);font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}" +

  /* INFOS */
  ".infos{display:flex;gap:8px;padding:0 20px;margin-bottom:8px;overflow-x:auto}" +
  ".info-chip{padding:8px 14px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:12px;color:var(--muted);white-space:nowrap;flex-shrink:0}" +
  ".info-chip span{color:var(--or);font-weight:700}" +

  /* CATS */
  ".cats{display:flex;gap:8px;padding:16px 20px;overflow-x:auto;flex-shrink:0;border-bottom:1px solid var(--border)}" +
  ".cat-btn{padding:8px 16px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all 0.15s}" +
  ".cat-btn.actif{background:linear-gradient(135deg,#c9a84c,#e8c97a);border-color:var(--or);color:#080808}" +

  /* PLATS */
  ".section-titre{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;padding:16px 20px 8px}" +
  ".plats{padding:0 20px;display:flex;flex-direction:column;gap:8px}" +
  ".plat{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px}" +
  ".p-emoji{font-size:30px;flex-shrink:0;width:40px;text-align:center}" +
  ".p-info{flex:1;min-width:0}" +
  ".p-nom{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}" +
  ".p-desc{font-size:11px;color:var(--muted);margin-bottom:4px;line-height:1.4}" +
  ".p-prix{font-size:15px;font-weight:800;color:var(--or)}" +
  ".btn-add{width:34px;height:34px;border-radius:8px;border:1px solid var(--or);background:rgba(201,168,76,0.1);color:var(--or);font-size:20px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700}" +
  ".qte-ctrl{display:flex;align-items:center;gap:6px;flex-shrink:0}" +
  ".btn-qte{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);background:var(--card2);color:var(--or);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:inherit}" +
  ".qte-n{font-size:15px;font-weight:800;min-width:18px;text-align:center}" +

  /* FOOTER PANIER */
  ".sticky-footer{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:12px 20px;background:rgba(8,8,8,0.97);border-top:1px solid var(--border);display:none}" +
  ".sf-inner{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#c9a84c,#e8c97a);border-radius:12px;padding:14px 18px;cursor:pointer}" +
  ".sf-label{font-size:15px;font-weight:800;color:#080808}" +
  ".sf-prix{font-size:15px;font-weight:900;color:#080808}" +

  /* PANIER PAGE */
  ".pan-page{padding:74px 20px 100px}" +
  ".pan-titre{font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:var(--or);margin-bottom:20px}" +
  ".pan-item{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:8px}" +
  ".pan-info{flex:1}.pan-nom{font-size:14px;font-weight:700;margin-bottom:2px}.pan-prix{font-size:14px;font-weight:800;color:var(--or)}" +
  ".total-bloc{background:var(--card);border:1px solid var(--or);border-radius:12px;padding:16px;margin:16px 0}" +
  ".total-row{display:flex;justify-content:space-between;font-size:14px;color:var(--muted);margin-bottom:6px}" +
  ".total-final{display:flex;justify-content:space-between;font-size:18px;font-weight:900;color:var(--or);border-top:1px solid var(--border);padding-top:10px;margin-top:6px}" +

  /* NOM PAGE */
  ".nom-page{padding:74px 20px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh}" +
  ".nom-box{width:100%;max-width:380px;text-align:center}" +
  ".nom-titre{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:var(--or);margin-bottom:8px}" +
  ".nom-sous{font-size:14px;color:var(--muted);margin-bottom:28px}" +
  "input[type=text],input[type=password],input[type=tel],input[type=email]{width:100%;padding:14px 16px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text);font-size:16px;font-weight:600;font-family:inherit;outline:none;margin-bottom:12px}" +
  "input:focus{border-color:var(--or)}" +

  /* CONFIRMATION */
  ".conf-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}" +
  ".conf-box{text-align:center;width:100%;max-width:380px}" +
  ".conf-num{font-size:64px;font-weight:900;color:var(--or);font-family:'Playfair Display',serif}" +

  /* CONTACT */
  ".contact-page{padding:74px 20px 40px}" +
  ".contact-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:12px}" +
  ".contact-titre{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px}" +
  ".contact-ligne{display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:15px}" +
  ".contact-icone{font-size:20px;flex-shrink:0;width:28px;text-align:center}" +

  /* ADMIN */
  ".admin-page{padding:74px 20px 40px}" +
  ".admin-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--card);border-radius:10px;padding:4px}" +
  ".tab-btn{flex:1;padding:8px;border-radius:7px;border:none;background:transparent;color:var(--muted);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s}" +
  ".tab-btn.actif{background:linear-gradient(135deg,#c9a84c,#e8c97a);color:#080808}" +
  ".kpi-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}" +
  ".kpi{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center}" +
  ".kpi.full{grid-column:span 2}" +
  ".kpi-val{font-size:22px;font-weight:900;color:var(--or);margin-bottom:4px}" +
  ".kpi-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em}" +
  ".cmd-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:8px}" +
  ".cmd-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}" +
  ".cmd-num{font-size:16px;font-weight:900;color:var(--or)}" +
  ".cmd-nom{flex:1;font-size:15px;font-weight:700}" +
  ".cmd-badge{font-size:11px;font-weight:700;border:1px solid;border-radius:6px;padding:2px 8px}" +
  ".cmd-meta{font-size:11px;color:var(--muted);margin-bottom:6px}" +
  ".cmd-articles{font-size:12px;color:rgba(240,230,200,0.6);line-height:1.6;margin-bottom:8px}" +
  ".action-btn{display:inline-block;padding:7px 16px;border-radius:8px;border:1px solid;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;background:transparent;text-decoration:none}" +
  ".form-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px}" +
  ".form-titre{font-size:14px;font-weight:800;color:var(--or);margin-bottom:14px}" +
  ".form-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;display:block}" +
  ".form-input{width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:#0d0d0d;color:var(--text);font-size:14px;font-family:inherit;outline:none;margin-bottom:10px}" +
  ".form-input:focus{border-color:var(--or)}" +
  "select.form-input{cursor:pointer}" +
  ".empty{text-align:center;color:var(--muted);font-size:15px;padding:40px 0}" +
  ".separator{height:1px;background:var(--border);margin:16px 0}" +
  ".tag{display:inline-block;padding:3px 10px;border-radius:6px;border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--muted);margin:2px}" +
  ".row-item{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)}" +
  ".row-item:last-child{border-bottom:none}" +
  "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.2);border-radius:2px}" +
  "</style>" +
  "<link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap' rel='stylesheet'>";
}

function getAdminCss() {
  return "<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#080808;color:#f0e6c8}a{color:inherit;text-decoration:none}.page{max-width:480px;margin:0 auto;padding:0 0 60px}.nav{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;z-index:100;background:#0d0d0d;border-bottom:1px solid rgba(201,168,76,0.15);padding:12px 16px;display:flex;align-items:center;justify-content:space-between}.nav-logo{font-size:15px;font-weight:800;color:#c9a84c}.nav-back{font-size:13px;color:rgba(240,230,200,0.5);background:none;border:none;cursor:pointer;font-family:inherit}.tabs{display:flex;gap:3px;padding:4px;background:#111;border-radius:10px;margin-bottom:16px}.tab{flex:1;padding:7px 4px;border-radius:7px;border:none;background:transparent;color:rgba(240,230,200,0.4);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;text-align:center;text-decoration:none;display:block}.tab.on{background:linear-gradient(135deg,#c9a84c,#e8c97a);color:#080808}.kgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}.kpi{background:#111;border:1px solid rgba(201,168,76,0.12);border-radius:10px;padding:12px;text-align:center}.kpi.full{grid-column:span 2}.kv{font-size:20px;font-weight:900;color:#c9a84c;margin-bottom:2px}.kl{font-size:10px;color:rgba(240,230,200,0.4);text-transform:uppercase}.card{background:#111;border:1px solid rgba(201,168,76,0.1);border-radius:10px;padding:12px;margin-bottom:8px}.row{display:flex;align-items:center;gap:8px;margin-bottom:4px}.num{font-size:15px;font-weight:900;color:#c9a84c}.nom{flex:1;font-size:14px;font-weight:700}.badge{font-size:10px;font-weight:700;border:1px solid;border-radius:6px;padding:2px 7px}.meta{font-size:11px;color:rgba(240,230,200,0.4);margin-bottom:6px}.arts{font-size:12px;color:rgba(240,230,200,0.55);line-height:1.6;margin-bottom:8px}.abtn{display:inline-block;padding:6px 14px;border-radius:7px;border:1px solid;font-size:12px;font-weight:700;background:transparent;text-decoration:none}.fcard{background:#111;border:1px solid rgba(201,168,76,0.12);border-radius:10px;padding:14px;margin-bottom:12px}.ft{font-size:13px;font-weight:800;color:#c9a84c;margin-bottom:12px}.fl{font-size:10px;font-weight:700;color:rgba(240,230,200,0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;display:block}input,select{width:100%;padding:9px 11px;border-radius:7px;border:1px solid rgba(201,168,76,0.2);background:#0d0d0d;color:#f0e6c8;font-size:13px;font-family:inherit;outline:none;margin-bottom:8px}input:focus,select:focus{border-color:#c9a84c}.btn{width:100%;padding:12px;border-radius:8px;border:none;background:linear-gradient(135deg,#c9a84c,#e8c97a);color:#080808;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit}.empty{text-align:center;color:rgba(240,230,200,0.3);font-size:14px;padding:32px 0}.wrap{padding:70px 16px 40px}</style>";
}

// =====================================================
// POINT ENTREE
// =====================================================

function doGet(e) {
  var action = (e.parameter.action || "accueil");
  if (action === "menu")      return showMenuPage(e);
  if (action === "contact")   return showContact(e);
  if (action === "commande")  return passerCommande(e);
  if (action === "cuisine")   return showCuisine(e);
  if (action === "majstatut") return majStatut(e);
  if (action === "admin")     return showAdmin(e);
  if (action === "save_plat") return savePlat(e);
  if (action === "save_salarie") return saveSalarie(e);
  if (action === "save_fournisseur") return saveFournisseur(e);
  if (action === "save_commande_manuel") return saveCommandeManuel(e);
  return showAccueil(e);
}

// =====================================================
// INIT SHEETS
// =====================================================

function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = {
    "Commandes": ["ID","Heure","Client","Articles","Total EUR","Statut","Date","Notes"],
    "Plats": ["ID","Categorie","Nom","Prix EUR","Description","Actif"],
    "Salaries": ["ID","Nom","Poste","Tel","Email","Date embauche","Salaire EUR","Notes"],
    "Fournisseurs": ["ID","Nom","Contact","Tel","Email","Produits","Notes"]
  };
  Object.keys(sheets).forEach(function(name) {
    if (!ss.getSheetByName(name)) {
      var ws = ss.insertSheet(name);
      ws.getRange(1,1,1,sheets[name].length).setValues([sheets[name]]);
      ws.getRange(1,1,1,sheets[name].length).setFontWeight("bold").setBackground("#c9a84c").setFontColor("#080808");
    }
  });
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ws = ss.getSheetByName(name);
  if (!ws) { initSheets(); ws = ss.getSheetByName(name); }
  return ws;
}

function genId() { return Math.floor(Math.random() * 9000) + 1000; }

// =====================================================
// PAGE ACCUEIL
// =====================================================

function showAccueil(e) {
  var url = ScriptApp.getService().getUrl();
  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'>";
  html += "<title>" + CONFIG.NOM + "</title>" + getCss();
  html += "</head><body><div class='page'>";

  // NAV
  html += "<div class='nav'><div class='nav-logo'>🏮 " + CONFIG.NOM + "</div>";
  html += "<a href='" + url + "?action=menu' class='nav-btn'>Commander</a></div>";

  // HERO
  html += "<div class='hero'>";
  html += "<div class='hero-emoji'>🥡</div>";
  html += "<div class='hero-titre'>" + CONFIG.NOM + "</div>";
  html += "<div class='hero-sous'>" + CONFIG.SOUS_TITRE + "</div>";
  html += "<div class='hero-btns'>";
  html += "<a href='" + url + "?action=menu'><button class='btn-or'>🍜 Commander maintenant</button></a>";
  html += "<a href='" + url + "?action=contact'><button class='btn' style='background:transparent;border:1px solid #c9a84c;color:#c9a84c'>📞 Nous contacter</button></a>";
  html += "</div></div>";

  // INFOS
  html += "<div class='infos'>";
  html += "<div class='info-chip'>⏰ <span>" + CONFIG.HORAIRES + "</span></div>";
  html += "<div class='info-chip'>📍 <span>" + CONFIG.ADRESSE + "</span></div>";
  html += "<div class='info-chip'>📞 <span>" + CONFIG.TEL + "</span></div>";
  html += "</div>";

  // CATEGORIES VISUELLES
  html += "<div style='padding:24px 20px 0'>";
  html += "<div style='font-family:Playfair Display,serif;font-size:20px;font-weight:900;color:var(--or);margin-bottom:16px'>Notre carte</div>";
  html += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:8px'>";
  var cats = [
    {emoji:"🥟",nom:"Entrees"},
    {emoji:"🍗",nom:"Poulet"},
    {emoji:"🥩",nom:"Boeuf et Porc"},
    {emoji:"🦐",nom:"Fruits de Mer"},
    {emoji:"🌱",nom:"Vegetarien"},
    {emoji:"🍜",nom:"Riz et Nouilles"},
    {emoji:"🍮",nom:"Desserts"},
    {emoji:"🍵",nom:"Boissons"}
  ];
  cats.forEach(function(c) {
    html += "<a href='" + url + "?action=menu' style='display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-size:14px;font-weight:600;color:var(--text)'>";
    html += "<span style='font-size:22px'>" + c.emoji + "</span>" + c.nom + "</a>";
  });
  html += "</div></div>";
  html += "<div style='text-align:center;padding:32px 20px 20px'>";
  html += "<a href='" + url + "?action=admin&pwd=" + CONFIG.MOT_DE_PASSE + "' style='font-size:12px;color:rgba(201,168,76,0.3);text-decoration:none;padding:8px 16px;border:1px solid rgba(201,168,76,0.1);border-radius:8px'>🔒 Espace Manager</a>";
  html += "</div>";
  html += "</div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle(CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE MENU CLIENT
// =====================================================

function showMenuPage(e) {
  var url = ScriptApp.getService().getUrl();
  var cats = [];
  MENU_DATA.forEach(function(p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1'>";
  html += "<title>Menu — " + CONFIG.NOM + "</title>" + getCss();
  html += "<style>body{padding-bottom:80px}#ecran-menu{display:block}#ecran-panier,#ecran-nom{display:none}.sticky-cats{position:sticky;top:60px;z-index:90;background:#080808;border-bottom:1px solid var(--border)}</style>";
  html += "</head><body>";

  // ECRAN MENU
  html += "<div id='ecran-menu'>";
  html += "<div class='nav'><a href='" + url + "' style='font-size:14px;color:var(--muted);font-weight:600'>← Accueil</a>";
  html += "<div class='nav-logo'>🏮 " + CONFIG.NOM + "</div>";
  html += "<button class='nav-panier' onclick='voirPanier()'>🛒<span class='badge' id='badge'></span></button></div>";

  html += "<div class='sticky-cats'><div class='cats'>";
  cats.forEach(function(cat) {
    html += "<button class='cat-btn' onclick='filtrer(this,\"" + cat + "\")'>" + cat + "</button>";
  });
  html += "</div></div>";
  html += "<div id='liste' style='padding:12px 20px;display:flex;flex-direction:column;gap:8px'></div>";
  html += "<div class='sticky-footer' id='sticky-footer' onclick='voirPanier()'><div class='sf-inner'><span class='sf-label' id='sf-label'>Voir le panier</span><span class='sf-prix' id='sf-prix'>0.00 EUR</span></div></div>";
  html += "</div>";

  // ECRAN PANIER
  html += "<div id='ecran-panier'>";
  html += "<div class='nav'><button style='font-size:14px;color:var(--muted);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit' onclick='retourMenu()'>← Menu</button>";
  html += "<div class='nav-logo'>Mon Panier</div><div style='width:60px'></div></div>";
  html += "<div class='pan-page'><div class='pan-titre'>Votre commande</div>";
  html += "<div id='liste-panier'></div>";
  html += "<div class='total-bloc'><div id='total-lignes'></div><div class='total-final'><span>Total</span><span id='pan-total'>0.00 EUR</span></div></div>";
  html += "<button class='btn-or' style='width:100%;margin-top:8px' onclick='allerNom()'>Confirmer →</button>";
  html += "</div></div>";

  // ECRAN NOM
  html += "<div id='ecran-nom'>";
  html += "<div class='nav'><button style='font-size:14px;color:var(--muted);font-weight:600;background:none;border:none;cursor:pointer;font-family:inherit' onclick='retourPanier()'>← Panier</button>";
  html += "<div class='nav-logo'>" + CONFIG.NOM + "</div><div style='width:60px'></div></div>";
  html += "<div class='nom-page'><div class='nom-box'>";
  html += "<div style='font-size:48px;margin-bottom:16px'>📝</div>";
  html += "<div class='nom-titre'>Votre prenom</div>";
  html += "<div class='nom-sous'>Pour appeler votre commande au comptoir</div>";
  html += "<input type='text' id='input-nom' placeholder='Ex: Marie, Thomas...' />";
  html += "<button class='btn-or' style='width:100%;margin-top:8px' onclick='validerCommande()' id='btn-valider'>Valider la commande</button>";
  html += "</div></div></div>";

  // JS
  html += "<script>";
  html += "var MENU=" + JSON.stringify(MENU_DATA) + ";";
  html += "var catActive=null;";
  html += "var panier={};";

  html += "function init(){var cats=document.querySelectorAll('.cat-btn');if(cats.length>0)cats[0].click();}";

  html += "function filtrer(btn,cat){catActive=cat;document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('actif');});btn.classList.add('actif');afficherPlats(cat);}";

  html += "function afficherPlats(cat){" +
    "var liste=document.getElementById('liste');" +
    "var html='';" +
    "MENU.filter(function(p){return p.cat===cat;}).forEach(function(p){" +
    "  var q=panier[p.id]?panier[p.id].qte:0;" +
    "  html+='<div class=\"plat\">';" +
    "  html+='<div class=\"p-emoji\">'+p.emoji+'</div>';" +
    "  html+='<div class=\"p-info\"><div class=\"p-nom\">'+p.nom+'</div><div class=\"p-desc\">'+p.desc+'</div><div class=\"p-prix\">'+p.prix.toFixed(2)+' EUR</div></div>';" +
    "  if(q>0){" +
    "    html+='<div class=\"qte-ctrl\">';" +
    "    html+='<button class=\"btn-qte\" onclick=\"modQte(\\'' + p.id + '\\',-1)\">−</button>';" +
    "    html+='<span class=\"qte-n\">'+q+'</span>';" +
    "    html+='<button class=\"btn-qte\" onclick=\"modQte(\\'' + p.id + '\\',1)\">+</button>';" +
    "    html+='</div>';" +
    "  } else {" +
    "    html+='<button class=\"btn-add\" onclick=\"ajouterAuPanier(\\'' + p.id + '\\')\">+</button>';" +
    "  }" +
    "  html+='</div>';" +
    "});" +
    "liste.innerHTML=html||'<div class=\"empty\">Aucun plat</div>';" +
    "}";

  html += "function ajouterAuPanier(id){" +
    "var p=MENU.find(function(x){return x.id===id;});" +
    "if(!p)return;" +
    "if(panier[id]){panier[id].qte++;}else{panier[id]={nom:p.nom,prix:p.prix,emoji:p.emoji,qte:1};}" +
    "majUI();" +
    "afficherPlats(catActive);" +
    "}";

  html += "function modQte(id,delta){" +
    "if(!panier[id])return;" +
    "panier[id].qte+=delta;" +
    "if(panier[id].qte<=0)delete panier[id];" +
    "majUI();" +
    "afficherPlats(catActive);" +
    "}";

  html += "function modQtePan(id,delta){modQte(id,delta);afficherListePanier();}";

  html += "function majUI(){" +
    "var total=0;var nb=0;" +
    "Object.values(panier).forEach(function(i){total+=i.prix*i.qte;nb+=i.qte;});" +
    "var footer=document.getElementById('sticky-footer');" +
    "if(nb>0){footer.style.display='block';document.getElementById('sf-label').textContent=nb+' article'+(nb>1?'s':'');document.getElementById('sf-prix').textContent=total.toFixed(2)+' EUR';}else{footer.style.display='none';}" +
    "var badge=document.getElementById('badge');" +
    "if(nb>0){badge.style.display='flex';badge.textContent=nb;}else{badge.style.display='none';}" +
    "}";

  html += "function voirPanier(){" +
    "document.getElementById('ecran-menu').style.display='none';" +
    "document.getElementById('ecran-panier').style.display='block';" +
    "afficherListePanier();" +
    "}";

  html += "function afficherListePanier(){" +
    "var div=document.getElementById('liste-panier');" +
    "var html='';var total=0;" +
    "Object.entries(panier).forEach(function(e){" +
    "  var id=e[0];var i=e[1];" +
    "  total+=i.prix*i.qte;" +
    "  html+='<div class=\"pan-item\">';" +
    "  html+='<div style=\"font-size:26px\">'+i.emoji+'</div>';" +
    "  html+='<div class=\"pan-info\"><div class=\"pan-nom\">'+i.nom+'</div><div class=\"pan-prix\">'+(i.prix*i.qte).toFixed(2)+' EUR</div></div>';" +
    "  html+='<div class=\"qte-ctrl\">';" +
    "  html+='<button class=\"btn-qte\" onclick=\"modQtePan(\\'' + id + '\\',-1)\">−</button>';" +
    "  html+='<span class=\"qte-n\">'+i.qte+'</span>';" +
    "  html+='<button class=\"btn-qte\" onclick=\"modQtePan(\\'' + id + '\\',1)\">+</button>';" +
    "  html+='</div></div>';" +
    "});" +
    "div.innerHTML=html||'<div class=\"empty\">Panier vide</div>';" +
    "document.getElementById('pan-total').textContent=total.toFixed(2)+' EUR';" +
    "}";

  html += "function retourMenu(){document.getElementById('ecran-panier').style.display='none';document.getElementById('ecran-menu').style.display='block';}";
  html += "function retourPanier(){document.getElementById('ecran-nom').style.display='none';document.getElementById('ecran-panier').style.display='block';}";

  html += "function allerNom(){" +
    "if(Object.keys(panier).length===0)return;" +
    "document.getElementById('ecran-panier').style.display='none';" +
    "document.getElementById('ecran-nom').style.display='block';" +
    "}";

  html += "function validerCommande(){" +
    "var nom=document.getElementById('input-nom').value.trim();" +
    "if(!nom)return;" +
    "var items=[];var total=0;" +
    "Object.entries(panier).forEach(function(e){var i=e[1];items.push(i.emoji+' '+i.nom+' x'+i.qte);total+=i.prix*i.qte;});" +
    "var url='" + url + "?action=commande&client='+encodeURIComponent(nom)+'&items='+encodeURIComponent(items.join(' | '))+'&total='+total.toFixed(2);" +
    "window.location.href=url;" +
    "}";

  html += "window.onload=init;";
  html += "</script></body></html>";

  return HtmlService.createHtmlOutput(html).setTitle("Menu — " + CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PASSER COMMANDE
// =====================================================

function passerCommande(e) {
  var client = e.parameter.client || "Client";
  var itemsStr = e.parameter.items || "";
  var total = parseFloat(e.parameter.total || "0");
  var ws = getSheet("Commandes");
  var id = genId();
  var heure = Utilities.formatDate(new Date(), "Europe/Paris", "HH:mm");
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
  ws.appendRow([id, heure, client, itemsStr, total, "En attente", date, ""]);
  var url = ScriptApp.getService().getUrl();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Confirmation</title>" + getCss() + "</head>";
  html += "<body><div class='conf-page'><div class='conf-box'>";
  html += "<div style='font-size:64px;margin-bottom:16px'>🥡</div>";
  html += "<div style='font-size:14px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em'>Commande confirmee</div>";
  html += "<div class='conf-num'>N° " + String(id).padStart(3,"0") + "</div>";
  html += "<div style='font-size:22px;font-weight:800;margin-bottom:8px'>" + client + "</div>";
  html += "<div style='font-size:14px;color:var(--muted);margin-bottom:28px;line-height:1.6'>Votre commande est en preparation.<br>Merci de votre confiance !</div>";
  html += "<div style='background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px;text-align:left'>";
  itemsStr.split(" | ").forEach(function(item) {
    html += "<div style='font-size:13px;color:rgba(240,230,200,0.7);padding:4px 0'>" + item + "</div>";
  });
  html += "<div style='border-top:1px solid var(--border);margin-top:8px;padding-top:8px;font-size:16px;font-weight:900;color:var(--or);display:flex;justify-content:space-between'><span>Total</span><span>" + total.toFixed(2) + " EUR</span></div>";
  html += "</div>";
  html += "<a href='" + url + "'><button class='btn-or' style='width:100%'>Nouvelle commande</button></a>";
  html += "</div></div></body></html>";

  return HtmlService.createHtmlOutput(html).setTitle("Confirmation").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE CONTACT
// =====================================================

function showContact(e) {
  var url = ScriptApp.getService().getUrl();
  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Contact — " + CONFIG.NOM + "</title>" + getCss() + "</head><body><div class='page'>";
  html += "<div class='nav'><a href='" + url + "' style='font-size:14px;color:var(--muted);font-weight:600'>← Accueil</a><div class='nav-logo'>Contact</div><div style='width:60px'></div></div>";
  html += "<div class='contact-page'>";
  html += "<div style='font-family:Playfair Display,serif;font-size:24px;font-weight:900;color:var(--or);margin-bottom:20px'>Nous contacter</div>";

  html += "<div class='contact-card'><div class='contact-titre'>Coordonnees</div>";
  html += "<div class='contact-ligne'><div class='contact-icone'>📍</div><div>" + CONFIG.ADRESSE + "</div></div>";
  html += "<div class='contact-ligne'><div class='contact-icone'>📞</div><div>" + CONFIG.TEL + "</div></div>";
  html += "<div class='contact-ligne'><div class='contact-icone'>✉️</div><div>" + CONFIG.EMAIL + "</div></div>";
  html += "</div>";

  html += "<div class='contact-card'><div class='contact-titre'>Horaires</div>";
  html += "<div class='contact-ligne'><div class='contact-icone'>⏰</div><div>" + CONFIG.HORAIRES + "</div></div>";
  html += "</div>";

  html += "<div class='contact-card'><div class='contact-titre'>Commander</div>";
  html += "<a href='" + url + "?action=menu'><button class='btn-or' style='width:100%'>🍜 Commander en ligne</button></a>";
  html += "</div>";

  html += "</div></div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Contact").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE CUISINE
// =====================================================

function showCuisine(e) {
  var url = ScriptApp.getService().getUrl();
  var ws = getSheet("Commandes");
  var data = ws.getDataRange().getValues();
  var commandes = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][5] !== "Livre") {
      commandes.push({id:data[i][0],heure:data[i][1],client:data[i][2],articles:data[i][3],total:parseFloat(data[i][4])||0,statut:data[i][5],row:i+1});
    }
  }
  commandes.reverse();

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Cuisine</title>" + getAdminCss() + "</head><body><div class='page'>";
  html += "<div class='nav'><a href='" + url + "' style='font-size:14px;color:var(--muted);font-weight:600'>← Accueil</a><div class='nav-logo'>🍳 Cuisine</div><div style='width:60px'></div></div>";
  html += "<div style='padding:74px 20px 20px'>";

  if (commandes.length === 0) html += "<div class='empty'>Aucune commande en cours 🎉</div>";

  commandes.forEach(function(cmd) {
    var colMap = {"En attente":"#e67e22","En preparation":"#3498db","Pret":"#27ae60"};
    var col = colMap[cmd.statut] || "#e67e22";
    var prochainStatut = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
    var btnLabel = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Marquer pret" : "Livre";
    html += "<div class='card' style='border-color:" + col + "40'>";
    html += "<div class='row'><div class='num'>N deg " + String(cmd.id).padStart(3,"0") + "</div>";
    html += "<div class='nom'>" + cmd.client + "</div>";
    html += "<div class='badge' style='color:" + col + ";border-color:" + col + "50'>" + cmd.statut + "</div></div>";
    html += "<div class='meta'>" + cmd.heure + " · " + cmd.total.toFixed(2) + " EUR</div>";
    html += "<div class='arts'>" + (cmd.articles||"").split(" | ").join("<br>") + "</div>";
    html += "<a href='" + url + "?action=majstatut&row=" + cmd.row + "&statut=" + encodeURIComponent(prochainStatut) + "&from=cuisine' class='abtn' style='color:" + col + ";border-color:" + col + "50'>▶ " + btnLabel + "</a>";
    html += "</div>";
  });

  html += "</div></div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Cuisine").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// MAJ STATUT
// =====================================================

function majStatut(e) {
  var row = parseInt(e.parameter.row);
  var statut = e.parameter.statut;
  var from = e.parameter.from || "cuisine";
  var ws = getSheet("Commandes");
  ws.getRange(row, 6).setValue(statut);
  var url = ScriptApp.getService().getUrl();
  var redirect = from === "admin" ? url + "?action=admin&pwd=" + CONFIG.MOT_DE_PASSE + "&tab=commandes" : url + "?action=cuisine";
  var html = "<html><head><meta http-equiv='refresh' content='0;url=" + redirect + "'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// PAGE ADMIN
// =====================================================

function showAdmin(e) {
  var pwd = e.parameter.pwd || "";
  var url = ScriptApp.getService().getUrl();
  var tab = e.parameter.tab || "dashboard";

  // LOGIN
  if (pwd !== CONFIG.MOT_DE_PASSE) {
    var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Manager</title>" + getAdminCss() + "</head><body>";
    html += "<div style='min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px'><div style='width:100%;max-width:340px;text-align:center'>";
    html += "<div style='font-size:56px;margin-bottom:16px'>🔐</div>";
    html += "<div style='font-family:Playfair Display,serif;font-size:26px;font-weight:900;color:var(--or);margin-bottom:8px'>Espace Manager</div>";
    html += "<div style='font-size:14px;color:var(--muted);margin-bottom:28px'>Entrez le mot de passe</div>";
    html += "<form method='GET' action='" + url + "'><input type='hidden' name='action' value='admin'><input type='password' name='pwd' class='form-input' placeholder='Mot de passe' style='text-align:center' autofocus /><button type='submit' class='btn-or' style='width:100%;margin-top:4px'>Entrer →</button></form>";
    html += "</div></div></body></html>";
    return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // DONNEES
  var wsCmd = getSheet("Commandes");
  var dataCmd = wsCmd.getDataRange().getValues();
  var commandes = [];
  var totalCA = 0; var nbLivrees = 0;
  for (var i = 1; i < dataCmd.length; i++) {
    var cmd = {id:dataCmd[i][0],heure:dataCmd[i][1],client:dataCmd[i][2],articles:dataCmd[i][3],total:parseFloat(dataCmd[i][4])||0,statut:dataCmd[i][5],date:dataCmd[i][6],row:i+1};
    commandes.push(cmd);
    if (cmd.statut === "Livre") { totalCA += cmd.total; nbLivrees++; }
  }
  commandes.reverse();

  var wsSal = getSheet("Salaries");
  var dataSal = wsSal.getDataRange().getValues();
  var salaries = [];
  for (var j = 1; j < dataSal.length; j++) {
    salaries.push({id:dataSal[j][0],nom:dataSal[j][1],poste:dataSal[j][2],tel:dataSal[j][3],email:dataSal[j][4],salaire:parseFloat(dataSal[j][6])||0});
  }

  var wsFou = getSheet("Fournisseurs");
  var dataFou = wsFou.getDataRange().getValues();
  var fournisseurs = [];
  for (var k = 1; k < dataFou.length; k++) {
    fournisseurs.push({id:dataFou[k][0],nom:dataFou[k][1],contact:dataFou[k][2],tel:dataFou[k][3],produits:dataFou[k][5]});
  }

  var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Manager — " + CONFIG.NOM + "</title>" + getAdminCss() + "</head><body><div class='page'>";

  // NAV
  html += "<div class='nav'><a href='" + url + "' style='font-size:14px;color:var(--muted);font-weight:600'>← Accueil</a><div class='nav-logo'>📊 Manager</div><div style='width:60px'></div></div>";

  html += "<div class='wrap'>";

  // TABS
  var tabs = [{id:"dashboard",label:"Dashboard"},{id:"commandes",label:"Commandes"},{id:"plats",label:"Plats"},{id:"salaries",label:"Salaries"},{id:"fournisseurs",label:"Fournisseurs"}];
  html += "<div class='tabs'>";
  tabs.forEach(function(t) {
    var actif = tab === t.id ? " actif" : "";
    html += "<a href='" + url + "?action=admin&pwd=" + pwd + "&tab=" + t.id + "'><button class='tab" + actif + "'>" + t.label + "</button></a>";
  });
  html += "</div>";

  // ── DASHBOARD
  if (tab === "dashboard") {
    var panier = nbLivrees > 0 ? totalCA / nbLivrees : 0;
    var masseSal = salaries.reduce(function(s,sal){return s+sal.salaire;},0);
    html += "<div class='kgrid'>";
    html += "<div class='kpi full'><div class='kv'>" + totalCA.toFixed(2) + " EUR</div><div class='kl'>Chiffre d affaires</div></div>";
    html += "<div class='kpi'><div class='kv'>" + commandes.length + "</div><div class='kl'>Total commandes</div></div>";
    html += "<div class='kpi'><div class='kv' style='color:#27ae60'>" + nbLivrees + "</div><div class='kl'>Livrees</div></div>";
    html += "<div class='kpi'><div class='kv' style='color:#e67e22'>" + (commandes.length - nbLivrees) + "</div><div class='kl'>En cours</div></div>";
    html += "<div class='kpi'><div class='kv' style='color:#3498db'>" + panier.toFixed(2) + " EUR</div><div class='kl'>Panier moyen</div></div>";
    html += "<div class='kpi'><div class='kv' style='color:#e74c3c'>" + masseSal.toFixed(0) + " EUR</div><div class='kl'>Masse salariale</div></div>";
    html += "<div class='kpi'><div class='kv'>" + salaries.length + "</div><div class='kl'>Salaries</div></div>";
    html += "<div class='kpi'><div class='kv'>" + fournisseurs.length + "</div><div class='kl'>Fournisseurs</div></div>";
    html += "</div>";

    // Liens rapides
    html += "<div style='display:flex;flex-direction:column;gap:8px'>";
    html += "<a href='" + url + "?action=cuisine'><button class='btn' style='background:transparent;border:1px solid #c9a84c;color:#c9a84c' style='width:100%'>🍳 Ecran Cuisine</button></a>";
    html += "<a href='" + url + "?action=admin&pwd=" + pwd + "&tab=commandes'><button class='btn' style='background:transparent;border:1px solid #c9a84c;color:#c9a84c' style='width:100%'>🧾 Voir les commandes</button></a>";
    html += "</div>";
  }

  // ── COMMANDES
  if (tab === "commandes") {
    // Formulaire ajout manuel
    html += "<div class='fcard'><div class='ft'>+ Ajouter une commande</div>";
    html += "<form method='GET' action='" + url + "'>";
    html += "<input type='hidden' name='action' value='save_commande_manuel'><input type='hidden' name='pwd' value='" + pwd + "'>";
    html += "<label class='fl'>Client</label><input type='text' name='client' class='form-input' placeholder='Nom du client' />";
    html += "<label class='fl'>Articles</label><input type='text' name='articles' class='form-input' placeholder='Ex: 🥟 Nems x2 | 🍗 Poulet x1' />";
    html += "<label class='fl'>Total (EUR)</label><input type='text' name='total' class='form-input' placeholder='Ex: 24.50' />";
    html += "<button type='submit' class='btn-or' style='width:100%'>Ajouter</button></form></div>";

    if (commandes.length === 0) html += "<div class='empty'>Aucune commande</div>";
    commandes.forEach(function(cmd) {
      var colMap = {"En attente":"#e67e22","En preparation":"#3498db","Pret":"#27ae60","Livre":"rgba(240,230,200,0.3)"};
      var col = colMap[cmd.statut] || "#e67e22";
      html += "<div class='card'><div class='row'>";
      html += "<div class='num'>N deg " + String(cmd.id).padStart(3,"0") + "</div>";
      html += "<div class='nom'>" + cmd.client + "</div>";
      html += "<div class='badge' style='color:" + col + ";border-color:" + col + "50'>" + cmd.statut + "</div></div>";
      html += "<div class='meta'>" + cmd.heure + " · " + cmd.total.toFixed(2) + " EUR · " + (cmd.date||"") + "</div>";
      html += "<div class='arts'>" + (cmd.articles||"").split(" | ").join("<br>") + "</div>";
      if (cmd.statut !== "Livre") {
        var ps = cmd.statut === "En attente" ? "En preparation" : cmd.statut === "En preparation" ? "Pret" : "Livre";
        var bl = cmd.statut === "En attente" ? "Demarrer" : cmd.statut === "En preparation" ? "Pret" : "Livre";
        html += "<a href='" + url + "?action=majstatut&row=" + cmd.row + "&statut=" + encodeURIComponent(ps) + "&from=admin&pwd=" + pwd + "' class='abtn' style='color:" + col + ";border-color:" + col + "50'>▶ " + bl + "</a>";
      }
      html += "</div>";
    });
  }

  // ── PLATS
  if (tab === "plats") {
    html += "<div class='fcard'><div class='ft'>+ Ajouter un plat</div>";
    html += "<form method='GET' action='" + url + "'>";
    html += "<input type='hidden' name='action' value='save_plat'><input type='hidden' name='pwd' value='" + pwd + "'>";
    html += "<label class='fl'>Categorie</label>";
    html += "<select name='categorie' class='form-input'><option>Entrees</option><option>Poulet</option><option>Boeuf</option><option>Porc</option><option>Mer</option><option>Vege</option><option>Riz</option><option>Desserts</option><option>Boissons</option></select>";
    html += "<label class='fl'>Nom du plat</label><input type='text' name='nom' class='form-input' placeholder='Ex: Boeuf sechuan' />";
    html += "<label class='fl'>Prix (EUR)</label><input type='text' name='prix' class='form-input' placeholder='Ex: 12.50' />";
    html += "<label class='fl'>Description</label><input type='text' name='desc' class='form-input' placeholder='Ex: Legumes wok sauce sechuan' />";
    html += "<button type='submit' class='btn-or' style='width:100%'>Ajouter le plat</button></form></div>";

    // Tous les plats du menu groupes par categorie
    var cats = [];
    MENU_DATA.forEach(function(p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });
    cats.forEach(function(cat) {
      html += "<div style='font-size:12px;font-weight:800;color:var(--or);text-transform:uppercase;letter-spacing:0.08em;margin:16px 0 8px;padding:8px 12px;background:rgba(201,168,76,0.08);border-radius:8px;border-left:3px solid var(--or)'>" + cat + "</div>";
      MENU_DATA.filter(function(p) { return p.cat === cat; }).forEach(function(p) {
        html += "<div class='card' style='margin-bottom:6px'><div class='row'>";
        html += "<div style='font-size:22px;width:32px;text-align:center'>" + p.emoji + "</div>";
        html += "<div style='flex:1;font-size:14px;font-weight:700;margin-left:8px'>" + p.nom + "</div>";
        html += "<div style='font-size:15px;font-weight:900;color:var(--or)'>" + p.prix.toFixed(2) + " EUR</div></div>";
        html += "<div style='font-size:11px;color:var(--muted);padding-left:40px'>" + p.desc + "</div></div>";
      });
    });

    // Plats ajoutes manuellement
    var wsPlats = getSheet("Plats");
    var dataPlats = wsPlats.getDataRange().getValues();
    if (dataPlats.length > 1) {
      html += "<div style='font-size:12px;font-weight:800;color:#27ae60;text-transform:uppercase;letter-spacing:0.08em;margin:16px 0 8px;padding:8px 12px;background:rgba(39,174,96,0.08);border-radius:8px;border-left:3px solid #27ae60'>Plats ajoutes manuellement</div>";
      for (var p = 1; p < dataPlats.length; p++) {
        html += "<div class='card' style='margin-bottom:6px'><div class='row'>";
        html += "<div style='flex:1;font-size:14px;font-weight:700'>" + dataPlats[p][2] + "</div>";
        html += "<div style='font-size:15px;font-weight:900;color:var(--or)'>" + parseFloat(dataPlats[p][3]).toFixed(2) + " EUR</div></div>";
        html += "<div style='font-size:11px;color:var(--muted)'>" + dataPlats[p][1] + " · " + dataPlats[p][4] + "</div></div>";
      }
    }
  }

  // ── SALARIES
  if (tab === "salaries") {
    html += "<div class='fcard'><div class='ft'>+ Ajouter un salarie</div>";
    html += "<form method='GET' action='" + url + "'>";
    html += "<input type='hidden' name='action' value='save_salarie'><input type='hidden' name='pwd' value='" + pwd + "'>";
    html += "<label class='fl'>Nom complet</label><input type='text' name='nom' class='form-input' placeholder='Ex: Jean Dupont' />";
    html += "<label class='fl'>Poste</label><select name='poste' class='form-input'><option>Cuisinier</option><option>Serveur</option><option>Caissier</option><option>Manager</option><option>Livreur</option><option>Plongeur</option></select>";
    html += "<label class='fl'>Telephone</label><input type='tel' name='tel' class='form-input' placeholder='Ex: 06 12 34 56 78' />";
    html += "<label class='fl'>Email</label><input type='email' name='email' class='form-input' placeholder='Ex: jean@email.com' />";
    html += "<label class='fl'>Salaire mensuel (EUR)</label><input type='text' name='salaire' class='form-input' placeholder='Ex: 1800' />";
    html += "<button type='submit' class='btn-or' style='width:100%'>Ajouter</button></form></div>";

    if (salaries.length === 0) html += "<div class='empty'>Aucun salarie enregistre</div>";
    salaries.forEach(function(s) {
      html += "<div class='card'><div class='row'>";
      html += "<div style='font-size:14px;font-weight:700'>" + s.nom + "</div>";
      html += "<div class='badge' style='color:var(--or);border-color:var(--border)'>" + s.poste + "</div></div>";
      html += "<div style='font-size:12px;color:var(--muted)'>" + (s.tel||"") + " · " + s.salaire.toFixed(0) + " EUR/mois</div></div>";
    });
  }

  // ── FOURNISSEURS
  if (tab === "fournisseurs") {
    html += "<div class='fcard'><div class='ft'>+ Ajouter un fournisseur</div>";
    html += "<form method='GET' action='" + url + "'>";
    html += "<input type='hidden' name='action' value='save_fournisseur'><input type='hidden' name='pwd' value='" + pwd + "'>";
    html += "<label class='fl'>Nom de la societe</label><input type='text' name='nom' class='form-input' placeholder='Ex: Metro Cash and Carry' />";
    html += "<label class='fl'>Contact</label><input type='text' name='contact' class='form-input' placeholder='Ex: M. Martin' />";
    html += "<label class='fl'>Telephone</label><input type='tel' name='tel' class='form-input' placeholder='Ex: 04 72 00 00 00' />";
    html += "<label class='fl'>Email</label><input type='email' name='email' class='form-input' placeholder='Ex: contact@metro.fr' />";
    html += "<label class='fl'>Produits fournis</label><input type='text' name='produits' class='form-input' placeholder='Ex: Viandes legumes epicerie' />";
    html += "<button type='submit' class='btn-or' style='width:100%'>Ajouter</button></form></div>";

    if (fournisseurs.length === 0) html += "<div class='empty'>Aucun fournisseur enregistre</div>";
    fournisseurs.forEach(function(f) {
      html += "<div class='card'><div class='row'>";
      html += "<div style='font-size:14px;font-weight:700;flex:1'>" + f.nom + "</div></div>";
      html += "<div style='font-size:12px;color:var(--muted)'>" + (f.contact||"") + " · " + (f.tel||"") + "</div>";
      html += "<div style='font-size:12px;color:var(--or);margin-top:4px'>" + (f.produits||"") + "</div></div>";
    });
  }

  html += "</div></div></body></html>";
  return HtmlService.createHtmlOutput(html).setTitle("Manager — " + CONFIG.NOM).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =====================================================
// SAVE FONCTIONS
// =====================================================

function savePlat(e) {
  var ws = getSheet("Plats");
  ws.appendRow([genId(), e.parameter.categorie||"", e.parameter.nom||"", parseFloat(e.parameter.prix)||0, e.parameter.desc||"", "Oui"]);
  var url = ScriptApp.getService().getUrl();
  var pwd = e.parameter.pwd || CONFIG.MOT_DE_PASSE;
  var html = "<html><head><meta charset='UTF-8'><meta http-equiv='refresh' content='0;url=" + url + "?action=admin&pwd=" + pwd + "&tab=plats'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveSalarie(e) {
  var ws = getSheet("Salaries");
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
  ws.appendRow([genId(), e.parameter.nom||"", e.parameter.poste||"", e.parameter.tel||"", e.parameter.email||"", date, parseFloat(e.parameter.salaire)||0, ""]);
  var url = ScriptApp.getService().getUrl();
  var pwd = e.parameter.pwd || CONFIG.MOT_DE_PASSE;
  var html = "<html><head><meta charset='UTF-8'><meta http-equiv='refresh' content='0;url=" + url + "?action=admin&pwd=" + pwd + "&tab=salaries'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveFournisseur(e) {
  var ws = getSheet("Fournisseurs");
  ws.appendRow([genId(), e.parameter.nom||"", e.parameter.contact||"", e.parameter.tel||"", e.parameter.email||"", e.parameter.produits||"", ""]);
  var url = ScriptApp.getService().getUrl();
  var pwd = e.parameter.pwd || CONFIG.MOT_DE_PASSE;
  var html = "<html><head><meta charset='UTF-8'><meta http-equiv='refresh' content='0;url=" + url + "?action=admin&pwd=" + pwd + "&tab=fournisseurs'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveCommandeManuel(e) {
  var ws = getSheet("Commandes");
  var id = genId();
  var heure = Utilities.formatDate(new Date(), "Europe/Paris", "HH:mm");
  var date = Utilities.formatDate(new Date(), "Europe/Paris", "dd/MM/yyyy");
  ws.appendRow([id, heure, e.parameter.client||"", e.parameter.articles||"", parseFloat(e.parameter.total)||0, "En attente", date, "Manuel"]);
  var url = ScriptApp.getService().getUrl();
  var pwd = e.parameter.pwd || CONFIG.MOT_DE_PASSE;
  var html = "<html><head><meta charset='UTF-8'><meta http-equiv='refresh' content='0;url=" + url + "?action=admin&pwd=" + pwd + "&tab=commandes'></head><body>Redirection...</body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
