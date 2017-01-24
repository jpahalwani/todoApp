var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: "buy groceries",
    completed: false
},
{
    id: 2,
    description: "watch television",
    completed: false
},
{
    id: 3,
    description: "repair phone",
    completed: true
}];

app.get('/', function(req, res){
    res.send('Todo API Root');
});

app.get('/todos',function(req, res){
    res.json(todos);
});

app.get('/todos/:id',function(req, res){
   
    var todoId = parseInt(req.params.id);
    var matched;
    for(i=0;i<todos.length;i++){
        if(todos[i].id === todoId){
            matched = todos[i];
        }
    }
    if(matched){
        res.json(matched);
    }
    else
        res.status(404).send();
});

app.listen(PORT, function(){
    console.log('Express running on PORT: ' + PORT);
});