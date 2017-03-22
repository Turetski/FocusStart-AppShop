;var appShopCart = (function(){

var parentContainer = document.querySelector(".modal-content"),
    Cart=$$.sugarOop.cls(null, function(){
    this.__init__ = function() {
      var dataArr, len,
          cartGood,
          dataStr=localStorage.getItem("fs-appShop-cart");    
      this._data = [];
      try{
        dataArr=JSON.parse(dataStr);
      } catch(e){
        return alert("Ошибка синхронизации данных");
      } 
      if (!Array.isArray(dataArr)) return alert("Ошибка синхронизации данных");
      len = dataArr.length;
      for(var i = 0; i<len; i++) if (isCorrectData(dataArr[i])){
        cartGood = generateCorrectDataObj(dataArr[i]);
        this.put(cartGood);
      }
    }

    isCorrectData =function(data){
      return data.hasOwnProperty("id") && 
               data.hasOwnProperty("name") &&
                 data.hasOwnProperty("price") &&
                   $$.isNumeric(data.price) && $$.isNumeric(data.id);
    }

    generateCorrectDataObj = function(data){
      return new CartGood(data.id, $$.escapeHTML(data.name), data.price);
    }

    this.put = function(appData, needRefresh){
      var len = this._data.length,
          i=0;
      if (!isCorrectData(appData)) return false;
      while(i<len && appData.id != this._data[i].id)i++;
      if(i>=len) {
        this._data.push(generateCorrectDataObj(appData));
        if(needRefresh)this.refreshLocalStorage();
        return true;
      } 
      return false;
    }

    this.count = function(){return this._data.length}

    this.calcPrice = function(){
      var total = 0,
          len = this.count();
      for(var i =0; i<len;i++ ) total+= parseFloat(this._data[i].price, 10);
      return $$.floatRound(total,2);  
    }

    this.isEmpty = function(){
      if(this.count()===0) return true;
      else return false;
    }

    this.getData = function(num){ return this._data[num]}
    this.refreshLocalStorage = function(){
      try {
          localStorage.setItem("fs-appShop-cart", JSON.stringify(this._data));
        } catch(e){
          //обработать ошибку
        }  
    }
    this.remove = function(id){
      var i =0, len=this.count();
      while(i<len && this._data[i].id!=id) i++;
      if (i<len) {
        this._data.splice(i,1);
        this.refreshLocalStorage();
      }  
    }
    this.clear = function(){
      this._data = [];
      this.refreshLocalStorage();
    }
  });

  function CartGood(id, name, price){
    this.name = name;
    this.price = price;
    this.id = id;
  };

  function refreshEntryBtn(){
    var i,
        icons = document.querySelectorAll(".cart-entry-btn__info-icon"), len = icons.length,
        myCart = new Cart();
    document.querySelector(".cart-entry-btn__count").innerHTML= myCart.count();
    document.querySelector(".cart-entry-btn__sum").innerHTML= myCart.calcPrice();
    if(myCart.isEmpty()){
      document.querySelector(".cart-entry-btn__icon").classList.remove("cart-entry-btn__icon_green");
      for(i=0; i< len; i++) icons[i].classList.remove("cart-entry-btn__info-icon_green");
    } else {
    for(i=0; i< len; i++) 
      document.querySelector(".cart-entry-btn__icon").classList.add("cart-entry-btn__icon_green");
      for(i=0; i< len; i++) icons[i].classList.add("cart-entry-btn__info-icon_green");
    }
  };  

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

  function showCartPage(linkedPage){
      var cartPage = parentContainer.querySelectorAll(".cart__content")[linkedPage];
      document.querySelector(".cart").setAttribute("data-active-page", linkedPage);   
      setCartNavBtns(linkedPage);
      cartPage.classList.remove("cart__content_hidden");
      cartPage.classList.remove("cart__content_blocked");
      cartPage.classList.add("cart__content_show");
      if(linkedPage == 2) insertUserInfo();
    }   

  function hideCartPage(linkedPage){
    var cartPage = parentContainer.querySelectorAll(".cart__content")[linkedPage];    
    cartPage.classList.add("cart__content_hidden");
    cartPage.classList.remove("cart__content_show");
    cartPage.classList.remove("cart__content_blocked");
  }
  
  function changeCartPage(oldPage, newPage){
    hideCartPage(oldPage);
    showCartPage(newPage);
  }

  function blockCartPage(linkedPage){
    var cartPage = parentContainer.querySelectorAll(".cart__content")[linkedPage];    
    cartPage.classList.add("cart__content_blocked");
  }

  function emptyBtn(e){
    e.preventDefault();
  }

  function saveUserInfo(){
    var form = document.querySelector(".contacts-form"),
        userName = form.querySelector(".contacts-form__input[name='user-name']"),
        userLastName = form.querySelector(".contacts-form__input[name='user-last-name']"),
        userTel = form.querySelector(".contacts-form__input[name='user-tel']"),
        userEmail = form.querySelector(".contacts-form__input[name='user-mail']");
    try {
      localStorage.setItem("fs-appShop-user-name", userName.value);
      localStorage.setItem("fs-appShop-user-last-name", userLastName.value);
      localStorage.setItem("fs-appShop-user-tel", userTel.value);
      localStorage.setItem("fs-appShop-user-mail", userEmail.value);
    } catch(e){
      //обработать исключение
    }  
  }
  
  function insertUserInfo(){
    var form = document.querySelector(".contacts-form"),
        userName = form.querySelector(".contacts-form__input[name='user-name']"),
        userLastName = form.querySelector(".contacts-form__input[name='user-last-name']"),
        userTel = form.querySelector(".contacts-form__input[name='user-tel']"),
        userEmail = form.querySelector(".contacts-form__input[name='user-mail']");
    userName.value = localStorage.getItem("fs-appShop-user-name");
    userLastName.value = localStorage.getItem("fs-appShop-user-last-name");
    userTel.value = localStorage.getItem("fs-appShop-user-tel");
    userEmail.value = localStorage.getItem("fs-appShop-user-mail");     
  }

  function init(){
    var clone = $$.createClone(".cart-window-template"),
        cartBaseContainer = clone.querySelector(".cart-base"),
        tableClone = $$.createClone(".cart-table-template"),
        tableRowCLone, btnDel,
        btnClose = clone.querySelector(".btn-close-cart"),
        btnCompleteClose = clone.querySelector(".cart-complete__close-btn"),
        btnOnPayment = clone.querySelector(".cart-link_on_payment"),
        btnOnContacts = clone.querySelector(".cart-link_on_contacts"),
        btnOnBase = clone.querySelector(".cart-link_on_base"),
        btnOnComplete = clone.querySelector(".cart-link_on_complete"),
        priceTotal = clone.querySelector(".price-plate__total"),
        priceCents = clone.querySelector(".price-plate__cents"),
        cartLinks = clone.querySelectorAll(".cart-nav__btn-face"), len=cartLinks.length,
        myCart = new Cart();
    
    function closeCart(e) {
      e.preventDefault();
      parentContainer.innerHTML = "";
      if(e.target.classList.contains("cart-complete__close-btn")) {
        myCart.clear();
        refreshEntryBtn();
      }  
    }

    function deleteAppFromCart(e){
      e.preventDefault();
      var appId = parseInt(e.target.getAttribute("data-appId"),10);
      myCart.remove(appId);
      refreshEntryBtn();
      init();
    }

    if(!myCart.isEmpty()) {
      var cartData;
      for(var i = 0; i<myCart.count(); i++){
        tableRowClone=$$.createClone(".price-table-row-template");
        btnDel = tableRowClone.querySelector(".btn-del");
        cartData = myCart.getData(i);
        tableRowClone.querySelector(".price-table__row-header").innerHTML = cartData.name;
        tableRowClone.querySelector(".price-table__data-price").innerHTML = cartData.price;
        tableRowClone.querySelector(".price-table__data-total").innerHTML = cartData.price;
        btnDel.setAttribute("data-appId", cartData.id );
        btnDel.addEventListener("click",deleteAppFromCart );
        tableClone.querySelector("tbody").appendChild(tableRowClone);
      }
      cartBaseContainer.insertBefore(tableClone, cartBaseContainer.firstChild);
      priceTotal.innerHTML=Math.floor( myCart.calcPrice() );
      priceCents.innerHTML=$$.getDecimal( myCart.calcPrice(), 2);
    } else {
      btnOnPayment.classList.add('cart-btn_disabled');
      $$.showErrorMessage(cartBaseContainer, "Вы не добавили ни одного приложения", true);
    }

    btnClose.addEventListener("click",closeCart);
    btnCompleteClose.addEventListener("click",closeCart );
    
    btnOnBase.addEventListener("click",function(e){
      e.preventDefault();
      changeCartPage(1,0);
    });

    btnOnPayment.addEventListener("click",function(e){
      e.preventDefault();
      if (e.target.classList.contains("cart-btn_disabled")) return;
      changeCartPage(0,1);
    });
    
    btnOnContacts.addEventListener("click",function(e){
      e.preventDefault();
      blockCartPage(1);
      setTimeout(changeCartPage, $$.getRandomInt(2,7)*1000, 1, 2);
    });
    
    btnOnComplete.addEventListener("click",function(e){
      e.preventDefault();
      blockCartPage(2);
      saveUserInfo();
      setTimeout(changeCartPage, $$.getRandomInt(1,5)*1000, 2, 3);
    });

    for(i = 0; i<len; i++){ 
      cartLinks[i].addEventListener("click",function(newPage){
        return function(e){
          var oldPage = parseInt(document.querySelector(".cart").getAttribute("data-active-page"),10);
          e.preventDefault();
          if (newPage<oldPage) changeCartPage(oldPage, newPage); 
        }
      }(i) );  
    }
    parentContainer.innerHTML="";
    parentContainer.appendChild(clone); 

  }

  return {
    init: init,
    refreshEntryBtn: refreshEntryBtn,

    addApp: function(e){
      e.preventDefault();
      var name = document.querySelector(".app-info .page-title").innerHTML,
          price = parseFloat(document.querySelector(".app-presentation__price").innerHTML, 10),
          id = document.querySelector(".inner-content__right-column").getAttribute("data-app-id"),
          data = new CartGood(id, name, price),
          myCart = new Cart();
      if( myCart.put(data, true)) refreshEntryBtn();  
    }

  }
})();
