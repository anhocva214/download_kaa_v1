var express = require('express');
var fs = require('fs');
var axios = require('axios');
var conversion = require("phantom-html-to-pdf")();
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// function Html_To_Pdf(html_content) {
//   conversion({ html: html_content }, function (err, pdf) {
//     var output = fs.createWriteStream('./output.pdf')
//     try {
//       console.log("SUCCESS");
//       pdf.stream.pipe(output);
//       conversion.kill();

//     }
//     catch (e) {
//       console.log("ERROR")
//       conversion.kill();
//     }
//   });
// }


router.get('/download/law/detail/:id', function (req, res, next) {
  axios.default({
    url: 'https://kingattorney.net/Law/Detail/' + req.params.id,
    method: 'get'
  })
    .then(({ data }) => {
      var content = `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title> </head> <body> ${data.data.Text} </body> </html>`;
      // Html_To_Pdf(data.data.Text);
      conversion({ html: content, path: './' }, function (err, pdf) {
        try {
          console.log("SUCCESS");
          console.log(pdf.stream.path);
          res.sendFile(pdf.stream.path);
          setTimeout(() => {
            fs.unlinkSync(pdf.stream.path);
            console.log("File is deleted.");
          }, 5000);


        }
        catch (e) {
          console.log("ERROR")
          conversion.kill();
        }
      });
    })
    .catch(e => {
      console.log(e)
    })

  // res.render('index', { content: 'Express' });
});


module.exports = router;
