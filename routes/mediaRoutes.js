var express       = require("express")
var router   =  express.Router()
const fs = require('fs');

router.post('/emailTemplate/:template',function(req, res) {
  res.render(`emailTemplate/${req.params.template}`, {
    data: req.body
  })
})
router.get('/images/:imageName', function(req, res) {
  var image = req.params['imageName'];
  name=image.split('.')[0];
  if (fs.existsSync("images/"+name+".jpg")) {
    fs.readFile('images/'+image, function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(data);
      }
    });
  }
  else if (fs.existsSync("images/"+name+".jpeg")) {
    fs.readFile('images/'+image, function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/jpeg'});
        res.end(data);
      }
    });
  }
  else if (fs.existsSync("images/"+name+".png")) {
    fs.readFile('images/'+image, function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(data);
      }
    });
  }
  else{
    fs.readFile('images/avatar.png', function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(data);
      }
    });
  }
});
router.get('/images/:directory/:imageName', function(req, res) {
  var directory = req.params['directory'];
  var image = req.params['imageName'];

  var name=image.split('.')[0];
  var ext=image.split('.')[1];
  if (fs.existsSync("images/"+directory+"/"+name+"."+ext)) {
    fs.readFile('images/'+directory+'/'+name+"."+ext, function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/'+ext});
        res.end(data);
      }
    });
  }
  else{
    fs.readFile('images/avatar.png', function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(data);
      }
    });
  }
}); 
router.get('/images/:directory/:subDirectory/:imageName', function(req, res) {
  var directory = req.params['directory'];
  var subDirectory = req.params['subDirectory'];
  var image = req.params['imageName'];

  var name=image.split('.')[0];
  if (fs.existsSync("images/"+directory+"/"+subDirectory+"/"+name+".jpg")) {
    fs.readFile('images/'+directory+"/"+subDirectory+'/'+name+".jpg", function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(data);
      }
    });
  }
  else if (fs.existsSync("images/"+directory+"/"+subDirectory+"/"+name+".jpeg")) {
    fs.readFile('images/'+directory+"/"+subDirectory+'/'+name+".jpeg", function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/jpeg'});
        res.end(data);
      }
    });
  }
  else if (fs.existsSync("images/"+directory+"/"+subDirectory+"/"+name+".png")) {
    fs.readFile('images/'+directory+"/"+subDirectory+'/'+name+".png", function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(data);
      }
    });
  }
  else{
    fs.readFile('images/avatar.png', function (err, data) {
      if(err){}
      else{
        res.writeHead(200,{'Content-type':'image/png'});
        res.end(data);
      }
    });
  }
});
module.exports = router;