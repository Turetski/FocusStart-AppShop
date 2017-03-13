function getAppCatalogItems(){
  return [
    { link: "#",
      name: "Стандартный пакет"},
    { link: "new-bank.html",
      name: "Новый ЦФТ-Банк"},
    { link: "#",
      name: "Cash management"},
    { link: "#",
      name: "Аренда сейфов"},
    { link: "#",
      name: "Банковские гарантии"},
    { link: "#",
      name: "Казначейство"},
    { link: "#",
      name: "Страхование"},
    { link: "#",
      name: "Факторинговое обслуживание"},
    { link: "#",
      name: "Переводы средств"},
    { link: "#",
      name: "Расчетный центр"},
    { link: "#",
      name: "Пластиковые карты"},
    { link: "#",
      name: "Финансовый мониторинг"},
    { link: "#",
      name: "Депозиты и вклады"},
    { link: "#",
      name: "Инвестиции"}
  ]
}

function createAppCatalogItemNode(catalogItemData, parent, template){
  var clone = document.importNode(template.content, true),
      link =clone.querySelector(".app-catalog__link");
  link.setAttribute("href", catalogItemData.link);
  link.setAttribute("title", catalogItemData.name);
  link.innerHTML = catalogItemData.name;
  parent.appendChild(clone);
}

function  fillAppCatalog() {
  var itemsData = getAppCatalogItems(),
      l= itemsData.length,
      appCatalog = document.querySelector(".app-catalog__list"),
      template = document.querySelector(".app-catalog__item-template");
  for(var i=0; i<l; i++)
    createAppCatalogItemNode(itemsData[i], appCatalog, template) ;    
}

fillAppCatalog();