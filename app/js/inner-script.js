(function(){
  function currentActiveApp(){
    return 3;// заглушечка
  }

  function getAppLinkByGuid(guid){
    var guidData = {
          "0a3dd94d-ba19-4f79-b8e4-7c480c581f60": "#",
          "93d91e8f-8321-4fe4-9177-b4baedc8e1bc": "new-bank.html",
          "0a3dd94d-ba19-4f79-b8e4-7c467adsf960": "#",
          "6df8546e-af6d-4561-b500-789ca67b7f08": "#",
          "dddee02e-f620-48d5-b0da-e9cace1c103c": "#",
          "31f138a7-47e8-4742-8f7c-7db9ddb5dbe0": "#",
          "a01996f2-f591-433d-ade8-eaae86c5c9fc": "#",
          "5df818b6-1942-4959-b099-c042495ef805": "#",
          "9ece372b-2047-4536-9626-cde533426028": "#",
          "e8e85ea9-84b0-4052-8792-a6e540f96ed2": "#",
          "9116354f-48ae-4fd0-8656-39dfb0aa7272": "#",
          "1d0d122c-8a7b-4bac-b208-7264bcdd093a": "#",
          "d226f5eb-373d-47d0-9e7a-ff6782b829fc": "#",
          "8213058c-ffba-4568-920a-2c6d581006b9": "#"
        };
    return guidData[guid];
  }

  function parseCatalogItems(items){
    var len = items.length,
        result = [];

    for(var i =0; i<len; i++){
      result.push(new Object);
      result[i].name = items[i].title;
      result[i].link = getAppLinkByGuid(items[i].guid);
    }
    return result;
  }

  function createAppCatalogItemNode(catalogItemData, parent, active){
    var template;
    active ? 
      template = document.querySelector(".app-catalog__item-template_active"):
      template = document.querySelector(".app-catalog__item-template");
    var clone = document.importNode(template.content, true),
        link =clone.querySelector(".app-catalog__link");  
    link.setAttribute("href", catalogItemData.link);
    link.setAttribute("title", catalogItemData.name);
    link.innerHTML = catalogItemData.name;
    parent.appendChild(clone);
  }

  function  fillAppCatalog(itemsData) {
    var l= itemsData.length,
        appCatalog = document.querySelector(".app-catalog__list");
    for(var i=0; i<l; i++)
      createAppCatalogItemNode(itemsData[i], appCatalog, i=== currentActiveApp()) ;    
  }

  function displayAppCatalogs(){
      var xhr = new XMLHttpRequest();  
      xhr.open("GET", "api/app_catalog_packages.json", true);    
      xhr.onload = function(e){
        console.log (xhr.responseText);
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
          fillAppCatalog( parseCatalogItems(JSON.parse(xhr.responseText)) );
        }else {/*здесь обработчик ошибки*/};
      }
      xhr.send();
    }

  displayAppCatalogs();
})();