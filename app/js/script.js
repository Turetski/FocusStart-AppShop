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
          "3a180a5c-3806-48b9-b056-e0a29a0ced88": "catalog.png",
          "3969c852-7f57-4df9-a2fa-ded8f995085b": "cat.jpg",
          "39cb133e-1d80-4ff0-b0b3-544b7b237fea": "cat.jpg",
          "cbf1535c-9d00-4833-9b7b-b8de1384006d": "cat.jpg",
          "a8dbc0c2-56c1-441c-aef8-5b686c787da3": "cat.jpg",
          "a01ae8e2-e22e-42a1-8dc7-242b1f587350": "cat.jpg",
          "b84a54ce-f328-4501-9a66-54a08509f2e1": "cat.jpg",
          "5a363faa-b9d2-49a3-9f1c-9cb4841d67a6": "cat.jpg"
        };
    return guidData[guid];
  }

  function parsePackages(packs){
    var len = packs.length,
        result = [];

    for(var i =0; i<len; i++){
      result.push(new Object);
      result[i].name = packs[i].title;
      result[i].date = new Date(packs[i].lastUpdate*1000);
      result[i].face = getFaceByGuid(packs[i].guid);
    }
    return result;
  }
    
  function displayAppPackages(){
    var xhr = new XMLHttpRequest();  
    xhr.open("GET", "api/app_packages.json", true);    
    xhr.onload = function(e){
      console.log (xhr.responseText);
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