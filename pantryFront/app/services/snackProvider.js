(function () {
  function snackProvider($http) {

    this._serverHost = "";
    // this.current_user = {};

    this.getAllSnacks = function (callback) {
      $http.get(this._serverHost + "/snacks.json")
        .success(function(data, status, headers, conf){
          callback(null, data);
        })
        .error(function(data, status, headers, conf){
          callback(data);
        });
    };

    this.submitSnack = function (data, callback) {
      $http.put(this._serverHost + "/snacks/submit.json", data)
        .success(function(data, status, headers, conf){
          callback(null, data);
        })
        .error(function(data, status, headers, conf){
          callback(data);
        });
    };

    this.getUsers = function (callback) {
      $http.get(this._serverHost + "/users.json")
        .success(function(data, status, headers, conf){
          callback(null, data);
        })
        .error(function(data, status, headers, conf){
          callback(data);
        });
    };

  }

  pantryApp.service("snackProvider", ["$http", snackProvider]);
})();
