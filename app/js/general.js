;var $$ = (function(){
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
      })
    }

  return {
    sugarOop: {
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
    },
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isNumeric: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    escapeHTML: escapeHTML,

    loadData: function(url){
      return new Promise (function(resolve, reject){
        xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);    
        xhr.onload = function(e){
          if(xhr.status !== 200) return reject("Не удалось загрузить данные с сервера");
          if (!xhr.responseText) return reject("Ответ от сервера пустой");
            try{
              resolve( JSON.parse(xhr.responseText));
            } catch(e){
              reject("Получены некорректные данные");
            }
        }
        xhr.onerror = function(e){return reject("LoadError")}
        xhr.send();
      })
    },
  
  	getDecimal: function(num, count){
  	  var result;
  	  if (count<1) return 0;
  	  num = Math.abs(num);
  	  result = num-Math.floor(num);
  	  for(var i=0;  i<count; i++) result*=10;
  	  return Math.floor(result);
  	},

    floatRound: function(num, count){
      var c = Math.pow(10,count);
      return Math.floor(num*c)/c;
    },

    
    parseDate: function(myDate){
      return "".concat(myDate.getDate(), " ", parseMonth(myDate.getMonth()), " ", myDate.getFullYear() );
    },

    getFaceByGuid: function(guid){
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
    },
  
    createClone: function(tempSelector) {
      var template = document.querySelector(tempSelector);
      return document.importNode(template.content, true);
    },

    showErrorMessage: function(container, message, saveInnerHTML){
      var clone = $$.createClone(".error-message-template");
      clone.querySelector(".error-message").innerHTML = escapeHTML(message);
      if(!saveInnerHTML)container.innerHTML="";
      container.insertBefore(clone,container.firstChild);
    }
  }
})();