/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray, $firebaseObject) {
	var url = 'https://todo-mvc-firebase-ex.firebaseio.com/todos';
	var fireRef = new Firebase(url);

    //LOAD DATA. This really should be done through a service, but it works.
    //1. Non persistent way
    $scope.todos = [
        {title: 'An example todo item', completed: false},
        {title: 'Another example one', completed: true}
    ];
    //2. Firebase manual way
	//$scope.todos = $firebaseArray(fireRef);

    //3. Firebase automatic way
    /*
    var obj = $firebaseObject(fireRef);
    obj.$bindTo($scope, 'todos');
    */

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		var total = 0;
		var remaining = 0;
		angular.forEach($scope.todos, function (todo) {
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
        //ADD A NEW ITEM TO THE LIST
        //1. Non persistent way
        $scope.todos.push({
            title: newTodo,
            completed: false
        });

        //2. Firebase way
        /*
        $scope.todos.$add({
			title: newTodo,
			completed: false
		});
		*/
        //3. Firebase automatic way
        /*Slightly different from non persistent way since $scope.todos is an object
        when we're doing it this way. But we simply change it non persistently and later
        the library automatically detects the change and then updates Firebase */
        /*
        $scope.todos[Date.now()] = {
            title: newTodo,
            completed: false
        };
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
            //SAVE THE NEW TITLE
            //1. Non persistent way
            /* Do nothing since the the variable "todo" has already been modified and will be noticed by angular's two way binding*/

			//2. Firebase way
			//$scope.todos.$save(todo);

            //3. Firebase Automatic Way
            /* Do nothing. The change will be automatically detected and saved */

		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todo.title = $scope.originalTodo.title;
		$scope.doneEditing(todo);
	};

	$scope.removeTodo = function (todo) {
        //REMOVE THE ITEM
        //1. Non persistent way
        $scope.todos.splice($scope.todos.indexOf(todo), 1);

        //2. Firebase way
		//$scope.todos.$remove(todo);

        //3. Firebase Automatic way
        /* Very similar to non persistent way except its an object, not an array */
        /*
        angular.forEach($scope.todos, function(thisTodo, key){
            if(todo === thisTodo){
                delete $scope.todos[key];
            }
        })
        */
	};

	$scope.clearCompletedTodos = function () {
		angular.forEach($scope.todos, function (todo) {
			if (todo && todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};

	$scope.markAll = function (allCompleted) {
		angular.forEach($scope.todos, function (todo) {
            if(!todo || typeof todo !== 'object') return;
			todo.completed = allCompleted;

            //SAVES CHANGED ITEM
            //1. Non persistent way
                /* Do nothing since we've already marked it completed */
            //2. Firebase way
            //$scope.todos.$save(todo);
            //3. Automatic way
                /* Also do nothing. Will be detected as changed and then saved */

		});
	};

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
