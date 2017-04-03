(function(){ 
  var AppStore = angular.module('AppStore',['Appstore-directives']);

  AppStore.factory('httpq', function($http, $q){
    return{
        get: function(){
            var deffered = $q.defer();
            $http.get.apply(null, arguments)
                .then(deffered.resolve)
                .catch(deffered.resolve);
                return deffered.promise;
       }
    }
  });

  AppStore.controller("appTable", function(httpq){
    var store = this;
    store.apps =[];
    httpq.get('api/products.json')
        .then(function(result){
            store.apps = result.data;
        })
        .catch(function(){
            console.log('error');
        });
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