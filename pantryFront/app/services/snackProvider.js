angular.module("pantryApp")
.service("snackProvider", function($http) {
  this._serverHost = "";
  // this.current_user = {};

  this.getAllSnacks = (callback) => {
    $http.get(this._serverHost + "/snacks")
      .success((data, status, headers, conf) =>{
        callback(null, data);
      })
      .error((data, status, headers, conf) =>{
        callback(data);
      });
  };

  this.submitSnack = (data, callback) => {
    $http.put(this._serverHost + "/snacks/submit.json", data)
      .success((data, status, headers, conf) =>{
        callback(null, data);
      })
      .error((data, status, headers, conf) =>{
        callback(data);
      });
  };

  this.getUsers = (callback) => {
    $http.get(this._serverHost + "/users")
      .success((data, status, headers, conf) =>{
        callback(null, data);
      })
      .error((data, status, headers, conf) =>{
        callback(data);
      });
  };
});
