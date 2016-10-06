/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

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
          url: 'http://172.17.0.1:8080/api/backend/todos/',
          dataType: 'json',
          type: 'GET',
          success: function(data){
              scope.todos = scope.todos.concat(data.map(function(d){
                return {
                  // note_id: d.id,
                  done: d.done,
                  title: d.note
                }
              }));
              scope.inform();
          }
        });
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
        console.log("subscribe");
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
        console.log("inform");
		//Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};

    app.TodoModel.prototype.appendToList = function(appendList) {
      console.log("Appending");
      console.log(this.todos);
      this.todos = this.todos.concat(appendList);
      console.log("done appending");
      console.log(this.todos);
    }

	app.TodoModel.prototype.addTodo = function (title) {
        console.log("addtodo");
		this.todos = this.todos.concat({
			id: Utils.uuid(),
			title: title,
			completed: false
		});

		this.inform();
        console.log("New todo");
        console.log(title);
        $.ajax({
          url: 'http://172.17.0.1:8080/api/backend/todos/',
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
          }
        });
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
        console.log("toggleAll");
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
        console.log("Toggle");
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
        console.log("destroy");
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
        console.log("save");
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
        console.log("clearCompleted");
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();
