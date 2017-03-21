(function(){
  var sugarOop = {
    inherit: function(cls, superClass) {
      cls.prototype = Object.create(superClass.prototype);
      cls.prototype.constructor = cls;
     cls.SuperClass = superClass;
    },

    cls: function (parent, fn) {
      var c = function() { this.__init__ && this.__init__.apply(this, arguments); },
      key;
      parent && this.inherit(c, parent);
      fn.call(c.prototype);
      return c;
    },

    super: function(cls) {
      if (cls.SuperClass) return cls.SuperClass.prototype;
      if (cls.mixin) return cls;
      return cls.prototype;
    }
  };
  var Cart=sugarOop.cls(null, function(){
        this.__init__ = function() {
          var dataArr, len,
              cartGood,
              dataStr=localStorage.getItem("fs-appShop-cart");    
          this._data = [];
          dataArr=JSON.parse(dataStr);
          if (Array.isArray(dataArr)) {
            len = dataArr.length;
            for(var i = 0; i<len; i++) if (this.isCorrectData(dataArr[i])){
              cartGood = this.generateCorrectDataObj(dataArr[i]);
              this.put(cartGood);
            }
          }
        }

        this.isCorrectData =function(data){
          return data.hasOwnProperty("id") && 
                   data.hasOwnProperty("name") &&
                     data.hasOwnProperty("price") &&
                       isNumeric(data.price) && isNumeric(data.id);
        }

        this.generateCorrectDataObj = function(data){
          return new CartGood(data.id, escapeHTML(data.name), data.price);
        }

        this.put = function(appData){
          var len = this._data.length,
              i=0;
          if (!this.isCorrectData(appData)) return false;
          while(i<len && appData.id != this._data[i].id)i++;
          if(i>=len) {
            this._data.push(this.generateCorrectDataObj(appData));
            try{
              localStorage.setItem("fs-appShop-cart", JSON.stringify(this._data));
            } catch(e){
              if (e == QUOTA_EXCEEDED_ERR) {
                alert('Превышен лимит локального хранилища, необходимо очистить cookies');
              }
            }
            return true;
          } 
          return false;
        }

        this.count = function(){return this._data.length}

        this.calcPrice = function(){
          var total = 0,
              len = this.count();
          for(var i =0; i<len;i++ ) total+= parseFloat(this._data[i].price, 10);
          return total;  
        }

        this.isEmpty = function(){
          if(this.count()===0) return true;
          else return false;
        }

        this.getData = function(num){ return this._data[num]}

        this.remove = function(id){
          var i =0, len=this.count();
          while(i<len && this._data[i].id!=id) i++;
          if (i<len) {
            this._data.splice(i,1);
            localStorage.setItem("fs-appShop-cart", JSON.stringify(this._data));
          }  
        }
        this.clear = function(){this._data = []}
      }),

      CartGood =  function(id, name, price){
        this.name = name;
        this.price = price;
        this.id = id;
      };

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function escapeHTML(unsafe) {
    unsafe ="".concat(unsafe);
    return unsafe.replace(/[&<>"']/g, function(m) {
      switch (m) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';  
        case '"':
          return '&quot;';
        default:
          return '&#039;';
      }
    });
  };

  function refreshCartEntryBtn(){
    var i,
        icons = document.querySelectorAll(".cart-entry-btn__info-icon"), len = icons.length,
        myCart = new Cart();
    document.querySelector(".cart-entry-btn__count").innerHTML= myCart.count();
    document.querySelector(".cart-entry-btn__sum").innerHTML= floatRound(myCart.calcPrice(),2);
    if(myCart.isEmpty()){
      document.querySelector(".cart-entry-btn__icon").classList.remove("cart-entry-btn__icon_green");
      for(i=0; i< len; i++) icons[i].classList.remove("cart-entry-btn__info-icon_green");
    } else {
    for(i=0; i< len; i++) 
      document.querySelector(".cart-entry-btn__icon").classList.add("cart-entry-btn__icon_green");
      for(i=0; i< len; i++) icons[i].classList.add("cart-entry-btn__info-icon_green");
    }
  }

  function addAppInCart(e){
    e.preventDefault();
    var name = document.querySelector(".app-info .page-title").innerHTML,
        price = parseFloat(document.querySelector(".app-presentation__price").innerHTML, 10),
        id = document.querySelector(".inner-content__right-column").getAttribute("data-app-id"),
        data = new CartGood(id, name, price),
        myCart = new Cart();
    if( myCart.put(data)) refreshCartEntryBtn();  
  }

  function getDecimal(num, count){
    var result;
    if (count<1) return 0;
    num = Math.abs(num);
    result = num-Math.floor(num);
    for(var i=0;  i<count; i++) result*=10;
    return Math.floor(result);
  }
  
  function floatRound(num, count){
    var c = Math.pow(10,count);
    return Math.floor(num*c)/c;
  }

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
  
  function createClone(tempSelector) {
    var template = document.querySelector(tempSelector);
    return document.importNode(template.content, true);
  }

  function getFaceByGuid(guid){
    var guidData = {
          "93d91e8f-8321-4fe4-9177-b4baedc8e1bc": "new-bank.png",
          "0a3dd94d-ba19-4f79-b8e4-7c480c581f60": "standart-package.png",
          "6d28cb24-db73-49b1-b736-f93c6aba66cd": "catalog.png",
          "8213058c-ffba-4568-920a-2c6d581006b9": "cat.jpg",
          "a01996f2-f591-433d-ade8-eaae86c5c9fc": "cat.jpg",
          "0a3dd94d-ba19-4f79-b8e4-7c467adsf960": "cat.jpg",
          "5df818b6-1942-4959-b099-c042495ef805": "cat.jpg",
          "9116354f-48ae-4fd0-8656-39dfb0aa7272": "cat.jpg",
          "dddee02e-f620-48d5-b0da-e9cace1c103c": "cat.jpg",
          "d226f5eb-373d-47d0-9e7a-ff6782b829fc": "cat.jpg"
        };
    if (guidData[guid]) return ("img/" + guidData[guid]);
    else return "img/cat.jpg";
  }

  function showErrorMessage(container, message, saveInnerHTML){
    var clone = createClone(".error-message-template");
    clone.querySelector(".error-message").innerHTML = escapeHTML(message);
    if(!saveInnerHTML)container.innerHTML="";
    container.insertBefore(clone,container.firstChild);
  }
  
  function loadAppPackages(){
    var PACK_VISIBLE=3, PACK_COUNT =7, 
        selectedPack,
        xhr = new XMLHttpRequest();

    function parsePackages(packs){
      var len = packs.length,
          result = [];
      for(var i =0; i<len; i++){
        result.push(new Object);
        result[i].name = packs[i].title;
        result[i].date = new Date(packs[i].lastUpdate*1000);
        result[i].face = getFaceByGuid(packs[i].guid);
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
      packLink.style.backgroundImage= "".concat("url(", getFaceByGuid(package.guid),")");
      packLink.setAttribute("href", "#");
      packLink.setAttribute("data-app-id", package.id);
      packLink.addEventListener("click", function(e){
        e.preventDefault();
        inactiveMainMenuLinks();
        document.querySelector(".main-nav__link[data-destination='catalog'").classList.add("main-nav__link_active");
        showCatalog( e.target.getAttribute("data-app-id") );
      });

      packName.classList.add("app-packages__name");
      packName.innerHTML=escapeHTML(package.name);

      packDate.classList.add("pub-date");
      packDate.innerHTML=parseDate(package.date);

      packBody.classList.add("app-packages__item");
      packBody.appendChild(packLink);
      packBody.appendChild(packName);
      packBody.appendChild(packDate);
      parent.appendChild(packBody);
    }

    xhr.open("GET", "api/app_packages.json", true);    
    xhr.onload = function(e){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
        addPackages( parsePackages(JSON.parse(xhr.responseText)) , PACK_COUNT);
      }else /*сообщить пользователю об ошибке.*/;
    }
    xhr.send();
  }

  function loadAppInfo(appId){
    var xhr = new XMLHttpRequest(),
        appInfoData,
        container = document.querySelector(".inner-content__right-column"); 

    function getInfoDataById(id, data){
      var len = data.length, 
          i=0;
      while( (i<len) && (data[i].id!=id) ) {i++;}
      if (i<len) return data[i];
    }
  
    function createAppInfoNode(container, appData){
      var clone = createClone(".app-info-template"),
          featuresCount = appData.features.length,
          featuresList = clone.querySelector(".custom-ul1"), 
          buyBtn = clone.querySelector(".app-presentation_buy-btn"),
          featureItem;
      clone.querySelector(".page-title").innerHTML = escapeHTML(appData.title); 
      clone.querySelector(".app-presentation .pub-date").innerHTML = parseDate(new Date (appData.lastUpdate*1000) );
      clone.querySelector(".app-presentation__description").innerHTML = escapeHTML(appData.description).replace(/[\n\r]/g, '<br>');
      clone.querySelector(".app-presentation__requirements").innerHTML = escapeHTML(appData.requirements).replace(/[\n\r]/g, '<br>');
      clone.querySelector(".app-presentation__price").innerHTML = escapeHTML(appData.price);
      clone.querySelector(".app-presentation__face").style.backgroundImage= "".concat("url(", getFaceByGuid(appData.guid),")");
      featuresList.innerHTML = "";
      for(var i = 0; i<featuresCount; i++) {
        featureItem = document.createElement('li');
        featureItem.innerHTML= escapeHTML(appData.features[i]).replace(/[\n\r]/g, '<br>');
        featureItem.classList.add("custom-ul1__item");
        featuresList.appendChild(featureItem);
      }
      buyBtn.addEventListener("click", addAppInCart);
      container.innerHTML="";
      container.setAttribute("data-app-id", appData.id);
      container.appendChild(clone);
    }
    
    if(!appId){
      showErrorMessage(container, "Данные приложения не загружены"); 
      return;
    }
    xhr.open("GET", "api/app_info.json", true);    
    xhr.onload = function(e){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
        appInfoData = getInfoDataById(appId, JSON.parse(xhr.responseText) );
        appInfoData ?
          createAppInfoNode(container, appInfoData):
          showErrorMessage(container, "Данные приложения не загружены");
      }else {/*здесь обработчик ошибки*/};
    }
    xhr.send();
  }

  function loadAppCatalogs(appId){
    var xhr = new XMLHttpRequest(),
        appCatalogItems;

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
      var clone = createClone(".app-catalog__item-template"),
          link =clone.querySelector(".app-catalog__link");  
      link.setAttribute("title", catalogItemData.name);
      link.setAttribute("data-app-id", catalogItemData.id);
      if(catalogItemData.id== appId) link.classList.add("app-catalog__link_active");
      link.innerHTML = escapeHTML(catalogItemData.name);
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

    xhr.open("GET", "api/app_catalog_packages.json", true);    
    xhr.onload = function(e){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
        appCatalogItems = parseCatalogItems(JSON.parse(xhr.responseText));
        if(!appId && appCatalogItems[0].id) appId=appCatalogItems[0].id;/*default id gets from first element of catalog list*/
        fillAppCatalog();
        loadAppInfo(appId);
      }else {/*здесь обработчик ошибки*/};
    }
    xhr.send();
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

  function initCartWindow(){
    var parentContainer = document.querySelector(".modal-content"),
        clone = createClone(".cart-window-template"),
        cartBaseContainer = clone.querySelector(".cart-base"),
        tableClone = createClone(".cart-table-template"),
        tableRowCLone, btnDel,
        btnNext = clone.querySelector(".cart-link_on_payment"),
        btnClose = clone.querySelector(".btn-close-cart"),
        btnCompleteClose = clone.querySelector(".cart-complete__close-btn"),
        priceTotal =clone.querySelector(".price-plate__total"),
        priceCents =clone.querySelector(".price-plate__cents"),
        cartLinks = clone.querySelectorAll(".cart-link"), len=cartLinks.length,
        myCart = new Cart();

    function setCartNavBtns(active){
      var navButtons = parentContainer.querySelectorAll(".cart-nav__btn"),
          len = navButtons.length;
      for(var i = 0; i<len; i++ ) {
        navButtons[i].classList.remove("cart-nav__btn_active");
        navButtons[i].classList.remove("cart-nav__btn_done");
      }
      for(i=0; i<active; i++)navButtons[i].classList.add("cart-nav__btn_done") ;
      navButtons[active].classList.add("cart-nav__btn_active") ;  
    }

    function moveCartPages(e){
      var cartPages = parentContainer.querySelectorAll(".cart__content"),
          len = cartPages.length,
          linkedPage = parseInt (e.target.getAttribute("data-linked-page"),10);    
      e.preventDefault();
      if(e.target.parentNode.classList.contains("cart-nav__btn") 
        && (!e.target.parentNode.classList.contains("cart-nav__btn_done")) ) return;
      setCartNavBtns(linkedPage);
      for(var i=0; i<len; i++){
        for(var j=-3; j<=3; j++)
          cartPages[i].classList.remove("cart__content_pos_"+j);
        cartPages[i].classList.add("cart__content_pos_"+(i-linkedPage));
      }
    }    

    function emptyBtn(e){
      e.preventDefault();
    }

    function closeCart(e) {
      e.preventDefault();
      parentContainer.innerHTML = "";
      if(e.target.classList.contains("cart-complete__close-btn")) {
        refreshCartEntryBtn();
      }  
    }
    
    function deleteAppFromCart(e){
      e.preventDefault();
      var appId = parseInt(e.target.getAttribute("data-appId"),10)/*,
         tBody = document.querySelector(".price-table").querySelector("tbody"),
         tableRows = tBody.querySelectorAll(".price-table__row")*/;
      myCart.remove(appId);
//      tBody.removeChild(tableRows[index+1]);
      refreshCartEntryBtn();
      initCartWindow();
    }

    if(!myCart.isEmpty()) {
      var cartData;
      for(var i = 0; i<len; i++) cartLinks[i].addEventListener("click",(function(){return moveCartPages})());
      for(i = 0; i<myCart.count(); i++){
        tableRowClone=createClone(".price-table-row-template");
        btnDel = tableRowClone.querySelector(".btn-del");
        cartData = myCart.getData(i);
        tableRowClone.querySelector(".price-table__row-header").innerHTML = cartData.name;
        tableRowClone.querySelector(".price-table__data-price").innerHTML = cartData.price;
        tableRowClone.querySelector(".price-table__data-total").innerHTML = cartData.price;
        btnDel.setAttribute("data-appId", cartData.id );
        btnDel.addEventListener("click",(function(){return deleteAppFromCart})() );
        tableClone.querySelector("tbody").appendChild(tableRowClone);
      }
      cartBaseContainer.insertBefore(tableClone, cartBaseContainer.firstChild);
      priceTotal.innerHTML=Math.floor( myCart.calcPrice() );
      priceCents.innerHTML=getDecimal( myCart.calcPrice(), 2);
    } else {
      btnNext.classList.add('cart-btn_disabled');
      btnNext.addEventListener("click",emptyBtn);
      showErrorMessage(cartBaseContainer, "Вы не добавили ни одного приложения", true);
    }

    btnClose.addEventListener("click",(function(){ return closeCart})() );
    btnCompleteClose.addEventListener("click",(function(){ return closeCart})() );

    parentContainer.innerHTML="";
    parentContainer.appendChild(clone);    
  }

  function appShopStart(){
    document.querySelector(".main-nav__cart-btn").addEventListener("click", function(e){
      e.preventDefault();
      initCartWindow();
    });
    initMainNav();
    showMainPage();
    refreshCartEntryBtn();
  }
  
  appShopStart();
})();
