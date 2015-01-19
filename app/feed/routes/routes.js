var feed = require ('../models/feed');

module.exports = function (app){
    app.get ('/api/feed/', function (req,res){
        feed.find(function (err, news){
            if (err)
                res.send (err);
            res.json (news);
        });
    });
    
    app.get ('/api/feed/title/:keyword', function (req, res){
        var query = feed.find().where('title').regex(req.params.keyword);
        
        query.exec (function (err, news){
            if (err)
                res.send (err);
            res.json (news);
        });
    });
    
    app.get ('/api/feed/desc/:keyword', function (req, res){
        var query = feed.find().where('description').regex(req.params.keyword);
        
        query.exec (function (err, news){
            if (err)
                res.send(err);
            res.json (news);
        });
    });
    
    app.get('/api/feed/descDate', function (req,res){
        var fromDate = new Date(req.query.from);
        var toDate = new Date(req.query.to);
        
        console.log (fromDate);
        console.log (toDate);
        
        var query = feed.find().where('description').regex(req.query.keyword).where('date').gt(fromDate).lt(toDate);
        
        query.exec (function (err, news){
            if (err)
                res.send (err);
            res.json (news);
        });
    });
    
    app.get('/api/feed/date', function (req,res){
        var fromDate = new Date(req.query.from);
        var toDate = new Date(req.query.to);
        
        console.log (fromDate);
        console.log (toDate);
        
        var query = feed.find().where('date').gt(fromDate).lt(toDate);
        
        query.exec (function (err, news){
            if (err)
                res.send (err);
            res.json (news);
        });
    });
}
