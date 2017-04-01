(function(){ 
  var AppStore=angular.module("Appstore-directives",[]);
  AppStore.directive("appTableItem",function(){
    return {
      restrict: "A",
      templateUrl: "source/appTableRow.html"
    };
  });
  AppStore.directive("appItem",function(){
    return {
      restrict: "E",
      templateUrl: "source/appItem.html"
    };
  });
})();