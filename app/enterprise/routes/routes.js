var tw = require ('../models/tweets');
var path = require ('path');

module.exports = function (app){
    
    app.get ('/api/key', function (req, res){
        
        if (req.query.keyword === undefined){
            res.sendFile ("code_2.html", { root : path.join (__dirname, '../../../public/error/')});
        }else{
            var query = tw.find().lean().where('tweet').regex(req.query.keyword).limit(2500);

            query.exec (function (err, conj){
                if (err)
                    res.send (err);
                res.json(conj);
            });
        }
    });
    
    app.get ('/api/tw/keydate', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        if (from.getDate() > to.getDate()){
            res.sendFile ("code_1.html", { root : path.join (__dirname, '../../../public/error/')});
        }
        
        if (req.query.keyword === undefined){
            res.sendFile ("code_2.html", { root : path.join (__dirname, '../../../public/error/')});
        }else{
            var query = tw.find().lean().where('tweet').regex(req.query.keyword).where('date').gt(from).lt(to).limit(6);
            
            query.exec (function (err, conj){
                if (err)
                    res.send (err);
                res.json (conj); 
            });
        }  
    });
    
    app.get('/api/count/keydate', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        if (from.getDate() > to.getDate()){
            res.sendFile ("code_1.html", { root : path.join (__dirname, '../../../public/error/')});
        }
        
        if (req.query.keyword === undefined){
            res.sendFile ("code_2.html", { root : path.join (__dirname, '../../../public/error/')});
        }else{
            var query = tw.find().lean().where('tweet').regex(req.query.keyword).where('date').gt(from).lt(to).count();
            
            query.exec (function (err, conj){
                if (err)
                    res.send (err);
                res.json ([{ "Num" : conj }]); 
            });
        }         
    });
    
    app.get ('/api/avg/date', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        var list = [];
        
        if (from.getTime() > to.getTime()){
            res.sendFile ("code_1.html", { root : path.join (__dirname, '../../../public/error/')});
        }
        
        var query = tw.find().lean().where('date').gt(from).lt(to);

        query.exec (function (err, conj){
            /* We're going to obtain polarity average per day.  */
            /* Calculate date range.  */
            var date = new Date(from);
            var minDate = new Date(from);
            var maxDate = new Date(from);

            /* Assign time to minDate.  */
            minDate.setHours(23);
            minDate.setMinutes(59);
            minDate.setSeconds(59);

            /* Assign time to maxDate */
            maxDate.setHours(0);
            maxDate.setMinutes(0);
            maxDate.setSeconds(0);

            /* Assign time to date */
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);

            /* Assign date */
            minDate.setDate(minDate.getDate() - 1);
            maxDate.setDate(maxDate.getDate() + 1);

            /* Calculate average per day.  */
            while (date.getDate() <= to.getDate()){
                /* Sum will contain average per day. */
                var sum = 0; 

                for (var i = 0; i < conj.length; i++){
                    /* Extract date from tweets.  */
                    var tdate = conj[i].date;

                    /* Compare date with the date range.  */
                    if (tdate < maxDate && tdate > minDate){
                        sum = sum + conj[i].polarity;
                    }
                }
                console.log(date);
                list.push ({ "date" : date.toString(), "sum" : sum });

                /* Increment the date range.  */
                minDate.setDate (minDate.getDate() + 1);
                maxDate.setDate (maxDate.getDate() + 1);
                date.setDate (date.getDate() + 1);
            }
            
            if (err)
                res.send(err);
            res.json (list);
                
        });       
    });
    
    app.get ('/api/keydate', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        var list = [];
        
        if (from.getTime() > to.getTime()){
            res.sendFile ("code_1.html", { root : path.join (__dirname, '../../../public/error/')});
        }
        
        if (req.query.keyword === undefined){
            res.sendFile ("code_2.html", { root : path.join (__dirname, '../../../public/error/')});
        }else{
            var query = tw.find().lean().where('tweet').regex (req.query.keyword).where('date').gt(from).lt(to);
            
            query.exec (function (err, conj){
                /* We're going to obtain polarity average per day.  */
                /* Calculate date range.  */
                var date = new Date(from);
                var minDate = new Date(from);
                var maxDate = new Date(from);
                
                /* Assign time to minDate.  */
                minDate.setHours(23);
                minDate.setMinutes(59);
                minDate.setSeconds(59);
                
                /* Assign time to maxDate */
                maxDate.setHours(0);
                maxDate.setMinutes(0);
                maxDate.setSeconds(0);
                
                /* Assign time to date */
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                
                /* Assign date */
                minDate.setDate(minDate.getDate() - 1);
                maxDate.setDate(maxDate.getDate() + 1);
                
                /* Calculate average per day.  */
                while (date.getDate() <= to.getDate()){
                    /* Sum will contain average per day. */
                    var sum = 0; 
                    
                    for (var i = 0; i < conj.length; i++){
                        /* Extract date from tweets.  */
                        var tdate = conj[i].date;
                        
                        /* Compare date with the date range.  */
                        if (tdate < maxDate && tdate > minDate){
                            sum = sum + conj[i].polarity;
                        }
                    }
                    console.log(minDate);
                    console.log(maxDate);
                    list.push ({ "date" : date.toString(), "sum" : sum });
                    
                    /* Increment the date range.  */
                    minDate.setDate (minDate.getDate() + 1);
                    maxDate.setDate (maxDate.getDate() + 1);
                    date.setDate (date.getDate() + 1);
                }
                
                if (err)
                    res.send(err);
                res.json (list);
                
            });
        }
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
    
    app.get('/api/:enterprise/key', function (req,res){
        if (req.query.keyword === undefined){
            res.sendFile ("code_2.html", { root : path.join (__dirname, '../../../public/error/')});
        }else{
            var query = tw.find().lean().where('theme').equals(req.params.enterprise).where('tweet').regex(req.query.keyword);

            query.exec (function (err, conj){
                if (err)
                    res.send(err);
                res.json (conj);
            });
        }
    });
    
    app.get('/api/:enterprise/keydate', function (req, res){
        var from = new Date (req.query.from);
        var to = new Date (req.query.to);
        
        var query = tw.find().lean().where('theme').equals(req.params.enterprise)
            .where('tweet').regex(req.query.keyword)
            .where('date').gt(from).lt(to);
        
        console.log (from);
        console.log (to);
        console.log (req.params.enterprise);
        
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