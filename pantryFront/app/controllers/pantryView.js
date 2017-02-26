(function() {
  function pantryViewController ($scope, snackProvider) {
    $scope.selected_snack = { };
    $scope.debug = "none";
    $scope.current_user = {};
    $scope.currentUserSnacks = $scope.current_user ? $scope.current_user.snacks : [];

    $scope.page_load_error_snacks = null;
    $scope.finished_loading_snacks = false;
    $scope.page_load_error_users = null;
    $scope.finished_loading_users = false;
    $scope.page_submit_snack_error = null;
    $scope.submit_error = null;

    $scope.snacks = snackProvider.getAllSnacks(function(err, snacks){
      if (err) {
        $scope.page_load_error_snacks = err.message;
      }
      else {
        $scope.finished_loading_snacks = true;
        $scope.snacks = snacks;
      }
    });

    $scope.users = snackProvider.getUsers(function(err, users){
      if (err) {
        $scope.page_load_error_users = err.message;
      }
      else {
        $scope.finished_loading_users = true;
        $scope.users = users;
      }

    });

    $scope.takeSnack = function () {
      var snack = validateInput();
      if (snack && snack.count > 0) {
        snackProvider.submitSnack({"snack": snack, "user": $scope.current_user}, function (err, resp){
          if (err) {
            $scope.page_submit_snack_error = err.message;
            $scope.debug = "have err";
          }
          else {
            updateSnacks(resp.snack);
            updateUsers(resp.user);
            $scope.selected_snack = { };
          }
        });
      }
      else {
        $scope.page_submit_snack_error = "Snack not found in the pantry";
      }
    };

    function updateUsers(user) {
      var result = [];
      for (var i = 0; i < user.snacks.length; i++) {
        result.push(JSON.parse(user.snacks[i]));
      }
      for (var i = 0; i < $scope.users.length; i++) {
        if ($scope.users[i].id === user.id) {
          $scope.users[i].snacks = result;
        }
      }
    }

    function validateInput() {
      var result;
      if ($scope.current_user) {
        $scope.submit_error = "You have to select a user first";
        return false;
      }
      try {
        var result = JSON.parse($scope.selected_snack);
      } catch (e) {
        $scope.submit_error = "You have to select a snack first.";
        return false;
      }
      return result;
    }

    function updateSnacks(snack) {
      var snacks = $scope.snacks;
      for (var i = 0; i < snacks.length; i++) {
        if (snacks[i].id === snack.id) {
          snacks[i] = snack;
        }
      }
      $scope.snacks = snacks;
    }

  }
  pantryApp.controller('pantryViewController', ['$scope', 'snackProvider', pantryViewController]);
})();
