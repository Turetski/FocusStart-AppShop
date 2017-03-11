 /*<div class="app-packages__item">
            <a href="#"><img class="app-packages__face" src="img/standart-package.png" width="330" height="198" alt="Стандартный пакет"></a>
            <div class="app-packages__name">СТАНДАРТНЫЙ ПАКЕТ</div>
            <time class="pub-date" datetime="2012-04-08">08 апреля 2012</time>
          </div>
          <div class="app-packages__item">
            <a href="#"><img class="app-packages__face" src="img/new-bank.png" width="330" height="198" alt="Новый ЦФТ-банк"></a>
            <div class="app-packages__name">НОВЫЙ ЦФТ-БАНК</div>
            <time class="pub-date" datetime="2016-09-09">09 сентября 2016</time>
          </div>
          <div class="app-packages__item">
            <a href="#"><img class="app-packages__face" src="img/catalog.png" width="330" height="198" alt="Каталог"></a>
            <div class="app-packages__name">КАТАЛОГ РАЗРАБОТОК</div>
            <time class="pub-date" datetime="2015-03-03">03 марта 2015</time>
          </div>*/
  var PACK_VISIBLE=3, PACK_COUNT =7, 
      PACKING_INTERVAL = 1200,
      packages =[], selectedPack;



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

  function getNewPackage(){
    var i = getRandomInt(1,3);
    switch(i){
      case 1: return { 
        face: "standart-package.png",
        name: "Стандартный пакет",
        date: new Date(2012, 04, 08)   
        }
      case 2:return { 
        face: "new-bank.png",
        name: "Новый ЦФТ-банк",
        date: new Date(2016, 09, 09)   
        }
      case 3:return { 
        face: "catalog.png",
        name: "Каталог",
        date: new Date(2015, 03, 03)   
        }
    }
  }
  
  function getPackages(){
    return [getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage(), getNewPackage()];
  }

  function createPackage(package) {
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
    return packBody;
  }

  function addPackage(package) {
    var packageContainer = document.querySelector(".app-packages__content"); 
    packageContainer.appendChild(createPackage(package));
  }

  function addPackages(packs, count) {
    var packsAdding = packs.slice(0, count),
        points = document.querySelectorAll(".app-packages .slider__point");
    count = packsAdding.length;
    packages =[];
    selectedPack = ((count / 2) | 0) + count % 2;
    for(var i=0; i<count; i++){
      addPackage(packsAdding[i]);
      points[i].addEventListener("click", function(e){
        selectedPack = parseInt(e.target.innerHTML);
        changePackageVisions(); 
      });
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
        first=true, k=2;
    count = packs.length;
    if(selectedPack> packs.length) selectedPack = packs.length;
    if( (selectedPack === 1) || (selectedPack === count)) k= 3; 
    for(var i=0; i<count; i++){
      packs[i].classList.remove("app-packages__item_visible");
      packs[i].classList.remove("app-packages__item_first-visible");
      points[i].classList.remove("slider__point_active");
      if (Math.abs(selectedPack-1-i)<k) { 
        packs[i].classList.add("app-packages__item_visible");
        if(first) {
          packs[i].classList.add("app-packages__item_first-visible");
          first = false;
        }  
      }      
    }
    points[selectedPack-1].classList.add("slider__point_active");
  }

  function movePacksLeft(){
    if(selectedPack>1) selectedPack--;
    changePackageVisions();
  }

  function movePacksRight(){
    if(selectedPack<PACK_COUNT) selectedPack++;
    changePackageVisions();
  }

addPackages(getPackages(), PACK_COUNT);
console.log(selectedPack);

document.querySelector(".app-packages .list-btn_prev").addEventListener("click" , movePacksLeft);
document.querySelector(".app-packages .list-btn_next").addEventListener("click" , movePacksRight);

