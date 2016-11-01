/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

var backendIP = 'http://sindrus.net';


(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
        var scope = this;
		this.onChanges = [];
		this.key = key;
		this.todos = [];
        $.ajax({
          url: backendIP+'/api/backend/todos/',
          dataType: 'json',
          type: 'GET',
          success: function(data){
              scope.todos = scope.todos.concat(data.map(function(d){
                return {
                  todo_id: d.todo_id,
                  completed: d.done,
                  title: d.note
                }
              }));
		      scope.todos = scope.todos.map(function (todo) {
                return todo !== data ?
                todo :
                Utils.extend({}, todo, {completed: !todo.completed});
              });
              scope.inform();
          }
        });
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		//Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
        var scope = this;

        $.ajax({
          url: backendIP+'/api/backend/todos/',
          dataType: 'json',
          type: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          data: JSON.stringify({
              note: title,
              done: false
          }),
          success: function(data){
            console.log("Completed post");
            console.log(data);
            scope.todos = scope.todos.concat({
              todo_id: data.todo_id,
              title: data.note,
              completed: false
            });
		    scope.inform();
          }
        });
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});
        todoToToggle.completed =! todoToToggle.completed;

        $.ajax({
          url: backendIP+'/api/backend/todos/'+todoToToggle.todo_id,
          dataType: 'json',
          type: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          data: JSON.stringify({
              done: todoToToggle.completed,
              note: todoToToggle.title,
              todo_id: todoToToggle.todo_id
          }),
          success: function(data){
              console.log("Completed post");
              console.log(data);
          }
        });

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
        $.ajax({
          url: backendIP+'/api/backend/todos/'+todo.todo_id,
          type: 'DELETE',
        });

		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();
