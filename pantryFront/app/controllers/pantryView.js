angular.module("pantryApp")
.controller("pantryViewController", function($scope, snackProvider) {
  $scope.selected_snack = { };
  $scope.current_user = null;
  $scope.debug = "none";
  $scope.currentUserSnacks = $scope.current_user ? $scope.current_user.snacks : [];

  $scope.page_load_error_snacks = null;
  $scope.finished_loading_snacks = false;
  $scope.page_load_error_users = null;
  $scope.finished_loading_users = false;
  $scope.page_submit_snack_error = null;
  $scope.submit_error = null;

  $scope.snacks = snackProvider.getAllSnacks((err, snacks) =>{
    if (err) {
      $scope.page_load_error_snacks = err.message;
    }
    else {
      $scope.finished_loading_snacks = true;
      $scope.snacks = snacks;
    }
  });

  $scope.users = snackProvider.getUsers((err, users) =>{
    if (err) {
      $scope.page_load_error_users = err.message;
    }
    else {
      $scope.finished_loading_users = true;
      users.forEach((user) => {
        user.snacks.forEach((snack, i, result) => {
          result[i] = JSON.parse(snack)
          // snack = JSON.parse(snack);
        });
      });
      $scope.users = users;
    }
  });

  $scope.takeSnack = () => {
    let snack = validateInput();
    if (snack && snack.count > 0) {
      snackProvider.submitSnack({"snack": snack, "user": $scope.current_user}, (err, resp) =>{
        if (err) {
          $scope.page_submit_snack_error = err.message;
        }
        else {
          $scope.debug = resp.user;
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

  updateUsers = (user) => {
    // $scope.users.forEach((item) => {
    //   item = item.id === user.id ? JSON.parse(user) : item;
    // });
    // return;
    let result = [];
    for (let i = 0; i < user.snacks.length; i++) {
      result.push(JSON.parse(user.snacks[i]));
    }
    for (let i = 0; i < $scope.users.length; i++) {
      if ($scope.users[i].id === user.id) {
        $scope.users[i].snacks = result;
      }
    }
  }

  validateInput = () => {
    let result;
    if (!$scope.current_user) {
      $scope.submit_error = "You have to select a user first";
      return false;
    }
    try {
      result = JSON.parse($scope.selected_snack);
    } catch (e) {
      $scope.submit_error = "You have to select a snack first.";
      return false;
    }
    return result;
  }

  updateSnacks = (snack) => {
    let snacks = $scope.snacks;
    for (let i = 0; i < snacks.length; i++) {
      if (snacks[i].id === snack.id) {
        snacks[i] = snack;
      }
    }
    $scope.snacks = snacks;
  }

});
