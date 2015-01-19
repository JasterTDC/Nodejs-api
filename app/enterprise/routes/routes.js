var tw = require ('../models/tweets');

module.exports = function (app){
    
    app.get ('/api/key/:tw', function (req, res){
        var query = tw.find().lean().where('tweet').regex(req.params.tw).limit(2500);
        
        query.exec (function (err, conj){
            if (err)
                res.send (err);
            res.json(conj);
        });
    });
    
    app.get ('/api/:enterprise', function (req, res){
        tw.find({
            theme : req.params.enterprise
        }, function (err, conj){
            if (err)
                res.send (err);
            res.json (conj);
        });
    });
    
    app.get('/api/:enterprise/key/:tw', function (req,res){
        var query = tw.find().lean().where('theme').equals(req.params.enterprise).where('tweet').regex(req.params.tw);
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json (conj);
        });
    });
    
    app.get('/api/:enterprise/keydate', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        var query = tw.find().lean().where('theme').equals(req.params.enterprise)
            .where('tweet').regex(req.query.keyword)
            .where('date').gt(from).lt(to);
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json (conj);
        });
    });
    
    app.get ('/api/:enterprise/keylang', function (req, res){
        var query = tw.find().lean()
            .where('theme').equals(req.params.enterprise)
            .where('tweet').regex(req.query.keyword)
            .where('lang').equals(req.query.lang);
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json (conj);
        });
    });
    
    app.get('/api/:enterprise/keydatelang', function (req,res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        var query = tw.find().lean().where('theme').equals(req.params.enterprise)
            .where ('tweet').regex(req.query.keyword)
            .where ('date').gt(from).lt(to)
            .where ('lang').equals(req.query.lang);
        
        console.log (req.query.lang);
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json (conj);
        });
    });
    
    app.get('/api/:enterprise/count', function (req, res){
        var query = tw.find().lean().where('theme').equals(req.params.enterprise).count();
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json([{"Num" : conj}]);
        });
    });
    
    app.get('/api/:enterprise/count/polarity', function (req,res){
        var pol = parseInt (req.query.polarity);
        var query = tw.find().lean()
            .where('theme').equals(req.params.enterprise)
            .where('polarity').equals (pol).count();
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json ([{ "Num" : conj }]);
        });
    });
    
    app.get('/api/:enterprise/count/datepol', function (req,res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        var pol = parseInt (req.query.polarity);
        var query = tw.find().lean()
            .where ('theme').equals(req.params.enterprise)
            .where ('polarity').equals(pol)
            .where ('date').gt(from).lt(to).count();
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json ([{ "Num" : conj }]);
        });
    });
    
    app.get('/api/:enterprise/count/date', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        var query = tw.find().lean()
            .where ('theme').equals(req.params.enterprise)
            .where ('date').gt(from).lt(to).count();
        
        query.exec (function (err, conj){
            if (err)
                res.send(err);
            res.json ([{ "Num" : conj }]);
        });
    });
};