var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

var todos = [];
var todoNextId = 1;

app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos',function(req, res){
    res.json(todos);
});

app.get('/todos/:id',function(req, res){
   
    var todoId = parseInt(req.params.id);
    var matched = _.findWhere(todos, {id: todoId});
    
    if(matched){
        res.json(matched);
    }
    else
        res.status(404).send();
});

app.delete('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedItem = _.findWhere(todos, {id: todoId});
    
    if(!matchedItem){
        res.status(404).json({"error": "no todo item found with that id"});
    }
    else{
        todos = _.without(todos, matchedItem);
        res.json(matchedItem);
    }
});

app.post('/todos', function(req, res){
    var body = req.body;
    
    body = _.pick(body, 'description', 'completed');
    
    if( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
       return res.status(400).send();
    }
    
    body.description = body.description.trim();
        
    todos.push({
    id: todoNextId,
    description: body.description,
    completed: body.completed
});
    todoNextId++;
    res.json(todos);
});

app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedItem = _.findWhere(todos, {id: todoId});
    var body = req.body;
    body = _.pick(body, 'description', 'completed');
    var validAttributes = {};
    
    if(!matchedItem){
        return res.status(404).send();
    }
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }
    
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description;
    }else if(body.hasOwnProperty('description')){
       return res.status(400).send();
    }
    
    _.extend(matchedItem,validAttributes);
    res.json(matchedItem);
});

app.listen(PORT, function(){
    console.log('Express running on PORT: ' + PORT);
});