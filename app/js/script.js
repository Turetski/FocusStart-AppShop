(function(){ 
  var AppStore = angular.module('AppStore',['Appstore-directives']);
  function parseDate(myDate){
      return "".concat(myDate.getDate(), " ", parseMonth(myDate.getMonth()), " ", myDate.getFullYear() );
  };
  function parseMonth(m){
    var months ={
      '0': "января", '1': "февраля",
      '2': "марта", '3': "апреля",
      '4': "мая", '5': "июня",
      '6': "июля", '7': "августа",
      '8': "сентября", '9': "октября",
      '10': "ноября",'11': "декабря"
    };
    return  months[m];
  }
  var apps = [
    { name:"Учет сейфовых ячеек",
      date: new Date(1473379200*1000),
      description: "Аналитический учет сейфовых ячеек банка по подразделениям банка.",
      price: "4.99"
    },
    { name:"Учет сейфовых ячеек",
      date: new Date(1473292800*1000),
      description: "Аналитический учет сейфовых ячеек банка по подразделениям банка.",
      price: "4.87"
    },
    { name:"Учет сейфовых ячеек",
      date: new Date(1473206400*1000),
      description: "Аналитический учет сейфовых ячеек банка по подразделениям банка.",
      price: "4.82"
    },
    { name:"Учет сейфовых ячеек",
      date: new Date(1473120000*1000),
      description: "Аналитический учет сейфовых ячеек банка по подразделениям банка.",
      price: "4.75"
    },
    { name:"Учет сейфовых ячеек",
      date: new Date(1473033600*1000),
      description: "Аналитический учет сейфовых ячеек банка по подразделениям банка.",
      price: "4.70"
    }
  ];
  AppStore.controller("appTable", function(){
    this.apps = apps;
  });

  AppStore.controller("panelCtrl", function(){
  	this.tab = 1;
  	this.setPanel = function(setPanel){
      this.tab = setPanel;
  	};
  	this.isSelected = function(panel){
       return panel===this.tab;
  	};
  });
  AppStore.controller("innerContentCtrl", function(){
    this.selectedApp = 0;
    this.curApp = undefined;
    this.showApp = function(app){
      this.selectedApp = 1;
      this.curApp = app;
    };
    this.showTable = function(){
      this.selectedApp = 0;
    };
  });
  
})();