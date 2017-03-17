(function(){  
  var  appInfoData = [];

  function parseMonth(m){
    switch (m) {
      case 0: return "января";
      case 1: return "февраля";
      case 2: return "марта";
      case 3: return "апреля";
      case 4: return "мая";
      case 5: return "июня";
      case 6: return "июля";
      case 7: return "августа";
      case 8: return "сентября";
      case 9: return "октября";
      case 10: return "ноября";
      case 11: return "декабря";
      default: return "неверные данные";
    }
  }

  function parseDate(myDate){
      return "".concat(myDate.getDate(), " ", parseMonth(myDate.getMonth()), " ", myDate.getFullYear() );
  }

  function showErrorMessage(container, message){
    var template=document.querySelector(".error-message-template"),
        clone = document.importNode(template.content, true);
    clone.querySelector(".error-message").innerHTML = message;
    container.innerHTML="";
    container.appendChild(clone);
  }

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
  
  function createAppInfoNode(container, appData){
    var template = document.querySelector(".inner-content__template"),
        clone = document.importNode(template.content, true),
        featuresCount = appData.features.length,
        featuresList = clone.querySelector(".custom-ul1"), 
        featureItem;
    clone.querySelector(".page-title").innerHTML = appData.title; 
    clone.querySelector(".app-presentation .pub-date").innerHTML = parseDate(new Date (appData.lastUpdate*1000) );
    clone.querySelector(".app-presentation__description").innerHTML = appData.description;
    clone.querySelector(".app-presentation__requirements").innerHTML = appData.requirements;
    featuresList.innerHTML = "";
    for(var i = 0; i<featuresCount; i++) {
      featureItem = document.createElement('li');
      featureItem.innerHTML=appData.features[i];
      featureItem.classList.add("custom-ul1__item");
      featuresList.appendChild(featureItem);
    }
    container.innerHTML="";
    container.appendChild(clone);
  }
  
  

  function showAppInfo(appId){
    var container = document.querySelector(".inner-content__right-column"),
        appDataLen = appInfoData.length;
    for(var appIndex= 0; appIndex<appDataLen; appIndex++) if (appInfoData[appIndex].id==appId) break;
    ( appDataLen && (appIndex<appDataLen) ) ?
      createAppInfoNode(container, appInfoData[appIndex]):
      showErrorMessage(container, "Данные приложения не загружены"); 
    
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

  function loadAppCatalogs(){
      var xhr = new XMLHttpRequest(),
          firstLink;  
      xhr.open("GET", "api/app_catalog_packages.json", true);    
      xhr.onload = function(e){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
          fillAppCatalog( parseCatalogItems(JSON.parse(xhr.responseText)));
          firstLink=document.querySelector(".app-catalog__link");
          firstLink.classList.add("app-catalog__link_active");
          loadAppInfo(firstLink.getAttribute("data-app-id")); 
        }else {/*здесь обработчик ошибки*/};
      }
      xhr.send();
  }

  function loadAppInfo(showId){
      var xhr = new XMLHttpRequest(); 
      xhr.open("GET", "api/app_info.json", true);    
      xhr.onload = function(e){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
          appInfoData = JSON.parse(xhr.responseText);
          console.log(appInfoData);
          showAppInfo(showId); 
        }else {/*здесь обработчик ошибки*/};
      }
      xhr.send();
  }

  loadAppCatalogs();

})();