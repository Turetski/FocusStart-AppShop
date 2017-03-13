(function(){
var PACK_VISIBLE=3, PACK_COUNT =7, 
    PACKING_INTERVAL = 1200,
    selectedPack;


  function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomSlice(arr, num){
    var resultNums = [], result = []
      arrLength= arr.length,
      i=0, j=0, k=0;
    if(arrLength<=num) return arr;
    while(i<num){
      k = getRandomInt(0, arrLength-1);
      for(j=0; j<i; j++) if(resultNums[j]===k) break;
      if (j===i){
        resultNums[i]=k;
        i++;
      }  
    }
    for(i=0; i<num; i++) result[i]= arr[resultNums[i]];
    return result;
  }
   
  function parseMonth(m){
    switch (m) {
      case 1: return "января";
      case 2: return "февраля";
      case 3: return "марта";
      case 4: return "апреля";
      case 5: return "мая";
      case 6: return "июня";
      case 7: return "июля";
      case 8: return "августа";
      case 9: return "сентября";
      case 10: return "октября";
      case 11: return "ноября";
      case 12: return "декабря";
      default: return "?????";
    }
  }

  function parseDate(myDate){
      return "" + myDate.getDate() + " " + parseMonth(myDate.getMonth()) + " " + myDate.getFullYear()
  }

    
  function getPackages(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "api/app_packages.json", true);
    xhr.onreadystatechange = function(e){
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
      };
    }
    xhr.onload = function(){
      console.log("success!");
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

  function addPackages(packs, count) {
    var packsAdding = packs.slice(0, count),
        packageContainer = document.querySelector(".app-packages__content");
    count = packsAdding.length;
    fillPackageSlider(count);
    packages =[];
    selectedPack = ((count / 2) | 0) + count % 2;
    for(var i=0; i<count; i++){
      createPackageNode(packsAdding[i], packageContainer);
    }
    changePackageVisions();
  }

  function addPackagesCycle(){
    document.querySelector(".app-packages__content").innerHTML=""; 
    addPackages(getPackages(), PACK_COUNT);
    setTimeout(addPackagesCycle, PACKING_INTERVAL);
  }

  function changePackageVisions(){
    var packs = document.querySelectorAll(".app-packages__item"),
        points = document.querySelectorAll(".app-packages .slider__point"),
        first = true, k = 2;
    count = packs.length;

    if (selectedPack <= 1) {
      selectedPack = 1;
      hideSliderBtn("prev");
    } else showSliderBtn("prev");

    if(selectedPack >= packs.length) {
      selectedPack = packs.length;
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
//addPackages(getPackages(), PACK_COUNT);
document.querySelector(".app-packages .list-btn_prev").addEventListener("click" , movePacksLeft);
document.querySelector(".app-packages .list-btn_next").addEventListener("click" , movePacksRight);
getPackages();
})();