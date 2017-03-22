;var appShop = (function(){
  function loadAppPackages(){
    var PACK_VISIBLE=3, PACK_COUNT =7, 
        selectedPack;

    function parsePackages(packs){
      var len = packs.length,
          result = [];
      for(var i =0; i<len; i++){
        result.push(new Object);
        result[i].name = packs[i].title;
        result[i].date = new Date(packs[i].lastUpdate*1000);
        result[i].face = $$.getFaceByGuid(packs[i].guid);
        result[i].guid = packs[i].guid;
        result[i].id = packs[i].id;
      }
      return result;
    }

    function fillPackageSlider(count) {
      var slider = document.querySelector(".app-packages__slider"),
          sliderPoint;
      slider.innerHTML = "";    
      for(var i=0; i< count; i++){
        sliderPoint = document.createElement('div');
        sliderPoint.classList.add("slider__point");
        sliderPoint.setAttribute("data-num", i+1);
        sliderPoint.addEventListener("click", function(e){
          e.preventDefault();
          selectedPack = parseInt(e.target.getAttribute("data-num"),10);
          changePackageVisions(); 
        })
        slider.appendChild(sliderPoint);
      }
    }
   
    function setupPackageControls() {
      document.querySelector(".app-packages__controls").classList.add("app-packages__controls_show");
      document.querySelector(".app-packages .list-btn_prev").addEventListener("click" , movePacksLeft);
      document.querySelector(".app-packages .list-btn_next").addEventListener("click" , movePacksRight);
    }

    function addPackages(packs, count, parent) {
      if(count>packs.length) count=packs.length;
      var packsAdding = [],
          packageContainer = document.querySelector(".app-packages__content");

      if(count) {
        packageContainer.innerHTML= "";
        packsAdding = packs.slice(0, count);
        for(var i=0; i<count; i++){
          createPackageNode(packsAdding[i], packageContainer);
        }
        selectedPack = ((count / 2) | 0) + count % 2;
        fillPackageSlider(count);
        changePackageVisions();
        setupPackageControls();  
      }  
    }

    function changePackageVisions(){
      var packs = document.querySelectorAll(".app-packages__item"),
          points = document.querySelectorAll(".app-packages .slider__point"),
          first = true, k = 2,
          count = packs.length;

      if (selectedPack <= 1)  {
        selectedPack = 1;
        hideSliderBtn("prev");
      } else showSliderBtn("prev");

      if (selectedPack >= count)  {
        selectedPack = count;
        hideSliderBtn("next");
      } else showSliderBtn("next");

      if( (selectedPack === 1) || (selectedPack === count)) k = 3; 

      for(var i=0; i<count; i++){
        packs[i].classList.remove("app-packages__item_visible");
        packs[i].classList.remove("app-packages__item_first-visible");
        packs[i].classList.remove("app-packages__item_selected")
        points[i].classList.remove("slider__point_active");
        if (Math.abs(selectedPack-1-i) < k) { 
          packs[i].classList.add("app-packages__item_visible");
          if(first) {
            packs[i].classList.add("app-packages__item_first-visible");
            first = false;
          }  
        }      
      }
      packs[selectedPack-1].classList.add("app-packages__item_selected");
      points[selectedPack-1].classList.add("slider__point_active");
    }

    function movePacksLeft(e){
      e.preventDefault();
      selectedPack--;
      changePackageVisions();
    }

    function movePacksRight(e){
      e.preventDefault();
      selectedPack++;
      changePackageVisions();
    }
  
    function hideSliderBtn(btnType) {
      var btn=document.querySelector(".list-btn_" + btnType);
      btn.classList.add("btn-hidden");
    }

    function showSliderBtn(btnType) {
      var btn=document.querySelector(".list-btn_" + btnType);
      btn.classList.remove("btn-hidden");
    }

    function createPackageNode(package, parent) {
      var packBody = document.createElement('div'); 
      var packLink = document.createElement('a');
      var packName = document.createElement('div');
      var packDate = document.createElement('div');

      packLink.classList.add("app-packages__face");
      packLink.style.backgroundImage= "".concat("url(", $$.getFaceByGuid(package.guid),")");
      packLink.setAttribute("href", "#");
      packLink.setAttribute("data-app-id", package.id);
      packLink.addEventListener("click", function(e){
        e.preventDefault();
        inactiveMainMenuLinks();
        document.querySelector(".main-nav__link[data-destination='catalog'").classList.add("main-nav__link_active");
        showCatalog( e.target.getAttribute("data-app-id") );
      });

      packName.classList.add("app-packages__name");
      packName.innerHTML=$$.escapeHTML(package.name);

      packDate.classList.add("pub-date");
      packDate.innerHTML=$$.parseDate(package.date);

      packBody.classList.add("app-packages__item");
      packBody.appendChild(packLink);
      packBody.appendChild(packName);
      packBody.appendChild(packDate);
      parent.appendChild(packBody);
    }

    $$.loadData("api/app_packages.json").then(
      function(result){
        addPackages( parsePackages(result) , PACK_COUNT);
      },
      function(error){alert(error)/*сообщить об ошибке*/}
    );
  }

  function loadAppInfo(appId){
    var appInfoData,
        container = document.querySelector(".inner-content__right-column"); 

    function getInfoDataById(id, data){
      var len = data.length, 
          i=0;
      while( (i<len) && (data[i].id!=id) ) {i++;}
      if (i<len) return data[i];
    }
  
    function createAppInfoNode(container, appData){
      var clone = $$.createClone(".app-info-template"),
          featuresCount = appData.features.length,
          featuresList = clone.querySelector(".custom-ul1"), 
          buyBtn = clone.querySelector(".app-presentation_buy-btn"),
          featureItem;
      clone.querySelector(".page-title").innerHTML = $$.escapeHTML(appData.title); 
      clone.querySelector(".app-presentation .pub-date").innerHTML = $$.parseDate(new Date (appData.lastUpdate*1000) );
      clone.querySelector(".app-presentation__description").innerHTML = $$.escapeHTML(appData.description).replace(/[\n\r]/g, '<br>');
      clone.querySelector(".app-presentation__requirements").innerHTML = $$.escapeHTML(appData.requirements).replace(/[\n\r]/g, '<br>');
      clone.querySelector(".app-presentation__price").innerHTML = $$.escapeHTML(appData.price);
      clone.querySelector(".app-presentation__face").style.backgroundImage= "".concat("url(", $$.getFaceByGuid(appData.guid),")");
      featuresList.innerHTML = "";
      for(var i = 0; i<featuresCount; i++) {
        featureItem = document.createElement('li');
        featureItem.innerHTML= $$.escapeHTML(appData.features[i]).replace(/[\n\r]/g, '<br>');
        featureItem.classList.add("custom-ul1__item");
        featuresList.appendChild(featureItem);
      }
      buyBtn.addEventListener("click", appShopCart.addApp);
      container.innerHTML="";
      container.setAttribute("data-app-id", appData.id);
      container.appendChild(clone);
    }
    
    if(!appId){
      $$.showErrorMessage(container, "Данные приложения не загружены"); 
      return;
    }
    $$.loadData("api/app_info.json").then(
      function (result){ 
        appInfoData = getInfoDataById(appId, result );
        appInfoData ?
          createAppInfoNode(container, appInfoData):
          $$.showErrorMessage(container, "Данные приложения не загружены");},
      function (error){alert(error)/*сообщить об ошибке*/}
      );
  }

  function loadAppCatalogs(appId){
    var appCatalogItems;

    function  fillAppCatalog() {
      var l= appCatalogItems.length,
      appCatalog = document.querySelector(".app-catalog__list");
      for(var i=0; i<l; i++)
        createAppCatalogItemNode(appCatalogItems[i], appCatalog) ;   
    }

    function appCatalogLinkClick(e){
      e.preventDefault();
      var currentLink = document.querySelector(".app-catalog__link_active"),
          targetId = e.target.getAttribute("data-app-id");
      if (currentLink) if (targetId===currentLink.getAttribute("data-app-id") ) return;

      var catalogLinks = document.querySelectorAll(".app-catalog__link"),
          len= catalogLinks.length,
          i=0;
      while((catalogLinks[i].getAttribute("data-app-id") !== targetId)&& (i<len) ) i++;
      if(i<len) {
        if(currentLink) currentLink.classList.remove("app-catalog__link_active");
        catalogLinks[i].classList.add("app-catalog__link_active");
        loadAppInfo(catalogLinks[i].getAttribute("data-app-id"));
      }  
    }

    function createAppCatalogItemNode(catalogItemData, parent){
      var clone = $$.createClone(".app-catalog__item-template"),
          link =clone.querySelector(".app-catalog__link");  
      link.setAttribute("title", catalogItemData.name);
      link.setAttribute("data-app-id", catalogItemData.id);
      if(catalogItemData.id== appId) link.classList.add("app-catalog__link_active");
      link.innerHTML = $$.escapeHTML(catalogItemData.name);
      link.addEventListener("click", appCatalogLinkClick)
      parent.appendChild(clone);
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

    $$.loadData("api/app_catalog_packages.json").then(
      function(result){
        appCatalogItems = parseCatalogItems(result);
        if(!appId && appCatalogItems[0].id) appId=appCatalogItems[0].id;/*default id gets from first element of catalog list*/
        fillAppCatalog();
        loadAppInfo(appId);
      },
      function(error){alert(error)}
    );
  }

  function showAppContent(template){
    var container = document.querySelector(".app-content"),
        clone =  document.importNode(template.content, true);
    container.innerHTML="";
    container.appendChild(clone);
  }

  function showMainPage(){
    showAppContent(document.querySelector(".main-page-template"));
    loadAppPackages();
  }
  
  function showAboutUs(){
    var container = document.querySelector(".app-content"),
        div = document.createElement('div');
    div.innerHTML="Этот раздел в разработке.";
    div.classList.add("wrapper");
    container.innerHTML="";
    container.appendChild(div);     
  }

  function showCatalog(appId){
    showAppContent(document.querySelector(".catalog-template"));
    loadAppCatalogs(appId);
  }
  
  function inactiveMainMenuLinks(){
    var links=document.querySelectorAll(".main-nav__link"),
          len = links.length;
      for(var i = 0; i<len; i++) links[i].classList.remove("main-nav__link_active");
  }

  function initMainNav(){
    var links=document.querySelectorAll(".main-nav__link"),
        len = links.length;
    for(var i = 0; i<len; i++) links[i].addEventListener("click", function(e){
      e.preventDefault();
      if( e.target.classList.contains("main-nav__link_active") ) return;
      inactiveMainMenuLinks();
      e.target.classList.add("main-nav__link_active");
      switch (e.target.getAttribute("data-destination")) {
        case 'main': 
          showMainPage();
          break;
        case 'catalog': 
          showCatalog();        
          break;
        case 'about-us': 
          showAboutUs();
      }
    });    
  }

  return {init: function(){
    document.querySelector(".main-nav__cart-btn").addEventListener("click", function(e){
      e.preventDefault();
      appShopCart.init();
    });
    initMainNav();
    showMainPage();
    appShopCart.refreshEntryBtn();
    window.addEventListener("storage", function(e){
      var cart = document.querySelector(".cart");
      if(e.key.localeCompare('fs-appShop-cart')!==0) return;
      appShopCart.refreshEntryBtn();
      if(cart) appShopCart.init();
    },false);
  }

}
})();
