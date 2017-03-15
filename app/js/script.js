(function(){
  var PACK_VISIBLE=3, PACK_COUNT =7, 
      selectedPack;
   
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
    return guidData[guid];
  }

  function setupMainMenu(){
    /*document.querySelectorAll*/
  }

  function parsePackages(packs){
    var len = packs.length,
        result = [];

    for(var i =0; i<len; i++){
      result.push(new Object);
      result[i].name = packs[i].title;
      result[i].date = new Date(packs[i].lastUpdate*1000);
      result[i].face = getFaceByGuid(packs[i].guid);
      result[i].id = packs[i].id;
    }
    return result;
  }
    
  function displayAppPackages(){
    var xhr = new XMLHttpRequest();  
    xhr.open("GET", "api/app_packages.json", true);    
    xhr.onload = function(e){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && xhr.responseText) {
        addPackages( parsePackages(JSON.parse(xhr.responseText)) , PACK_COUNT);
      }else document.querySelector(".app-packages__load-data").classList.add("app-packages__load-data_error");
    }
    xhr.send();
  }

  function createPackageNode(package, parent) {
    var packBody = document.createElement('div'); 
    var packLink = document.createElement('a');
    var packImg = document.createElement('img');
    var packName = document.createElement('div');
    var packDate = document.createElement('div');

    packImg.classList.add("app-packages__face")
    packImg.setAttribute("src", "img/" + package.face);
    packImg.setAttribute("alt", package.name);
    packLink.setAttribute("href", "#");
    packLink.setAttribute("data-app-id", package.id);
    packLink.appendChild(packImg);

    packName.classList.add("app-packages__name");
    packName.innerHTML=package.name;

    packDate.classList.add("pub-date");
    packDate.innerHTML=parseDate(package.date);

    packBody.classList.add("app-packages__item");
    packBody.appendChild(packLink);
    packBody.appendChild(packName);
    packBody.appendChild(packDate);
    parent.appendChild(packBody);
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
        selectedPack = parseInt( e.target.getAttribute("data-num") );
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

  function addPackages(packs, count) {
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


  displayAppPackages();

})();