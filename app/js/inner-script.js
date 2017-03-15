(function(){  

  function appCatalogLinkClick(e){
    e.preventDefault();
    var currentLink = document.querySelector(".app-catalog__link_active"),
        targetId = e.target.getAttribute("data-app-id");
    if( targetId===currentLink.getAttribute("data-app-id") ) return;

    var catalogLinks = document.querySelectorAll(".app-catalog__link"),
        len= catalogLinks.length,
        i=0;
    while((catalogLinks[i].getAttribute("data-app-id") !== targetId)&& (i<len) ) i++;
    if(i<len) {
      currentLink.classList.remove("app-catalog__link_active");
      catalogLinks[i].classList.add("app-catalog__link_active");
      showAppInfo(catalogLinks[i].getAttribute("data-app-id"));
    }  
  }

  function showAppInfo(appId){
    var container = document.querySelector(".inner-content__right-column");
    container.innerHTML=appId;
  }

  function parseCatalogItems(items){
    var len = items.length,
        result = [];
    for(var i =0; i<len; i++){
      result.push(new Object);
      result[i].name = items[i].title;
      result[i].id= items[i].id;
    }
    return result;
  }

  function createAppCatalogItemNode(catalogItemData, parent, active){
    var template = document.querySelector(".app-catalog__item-template"),
        clone = document.importNode(template.content, true),
        link =clone.querySelector(".app-catalog__link");  
        if (active) link.classList.add("app-catalog__link_active")
    link.setAttribute("title", catalogItemData.name);
    link.setAttribute("data-app-id", catalogItemData.id);
    link.innerHTML = catalogItemData.name;
    link.addEventListener("click", appCatalogLinkClick)
    parent.appendChild(clone);
  }
  
  function  fillAppCatalog(itemsData) {
    var l= itemsData.length,
        appCatalog = document.querySelector(".app-catalog__list");
    for(var i=0; i<l; i++)
      createAppCatalogItemNode(itemsData[i], appCatalog) ;   
  }

  function displayAppCatalogs(){
      var xhr = new XMLHttpRequest(),
          firstLink;  
      xhr.open("GET", "api/app_catalog_packages.json", true);    
      xhr.onload = function(e){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
          fillAppCatalog( parseCatalogItems(JSON.parse(xhr.responseText)));
          firstLink=document.querySelector(".app-catalog__link");
          firstLink.classList.add("app-catalog__link_active");
          showAppInfo(firstLink.getAttribute("data-app-id")); 
        }else {/*здесь обработчик ошибки*/};
      }
      xhr.send();
    }

  displayAppCatalogs();
})();