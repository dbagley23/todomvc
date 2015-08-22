/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray) {
	var url = 'https://todo-mvc-firebase-ex.firebaseio.com/todos';
	var fireRef = new Firebase(url);

    //LOAD DATA. This really should be done through a service, but it works.
    //1. localStorage way
    if(localStorage.todos){
        $scope.todos = JSON.parse(localStorage.todos)
    } else{
        $scope.todos = [
            {title: 'An example todo item', completed: false},
            {title: 'Another example one', completed: true}
        ]
    }

    //2. Firebase way
	//$scope.todos = $firebaseArray(fireRef);


	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		var total = 0;
		var remaining = 0;
		$scope.todos.forEach(function (todo) {
			// Skip invalid entries so they don't break the entire app.
			if (!todo || !todo.title) {
				return;
			}

			total++;
			if (todo.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
        //ADD A NEW ITEM TO THE LIST AAAAAND TO SAVE IT PERSISTENTLY
        //1. localStorage Way
        $scope.todos.push({
            title: newTodo,
            completed: false
        });

        localStorage.todos = JSON.stringify($scope.todos);
        //2. Firebase way
        /*
        $scope.todos.$add({
			title: newTodo,
			completed: false
		});
		*/
		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		var title = todo.title.trim();
		if (title) {
            //SAVE THE NEW TITLE PERSISTENTLY (since we already changed it on the scope)
            //1. localStorage way
            localStorage.todos = JSON.stringify($scope.todos);
			//2. Firebase way
			//$scope.todos.$save(todo);

		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todo.title = $scope.originalTodo.title;
		$scope.doneEditing(todo);
	};

	$scope.removeTodo = function (todo) {
        //REMOVE THE ITEM FROM THE SCOPE LIST AAAAAND FROM THE PERSISTENT STORE
        //1. localStorage way
        $scope.todos.splice($scope.todos.indexOf(todo), 1);
        localStorage.todos = JSON.stringify($scope.todos);
        //2. Firebase way
		//$scope.todos.$remove(todo);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function (todo) {
			if (todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};

	$scope.markAll = function (allCompleted) {
		$scope.todos.forEach(function (todo) {
			todo.completed = allCompleted;
            //SAVES CHANGED ITEM PERSISTENTLY
            //1. localStorage way
            localStorage.todos = JSON.stringify($scope.todos);
            //2. Firebase way
            //$scope.todos.$save(todo);
		});
	};

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
