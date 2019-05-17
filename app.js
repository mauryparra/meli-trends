var http = require('http');
var https = require('https');

var url = require('url');
var fs = require('fs');

const url_trends = 'https://api.mercadolibre.com/trends/{0}';
const url_trends_cat = 'https://api.mercadolibre.com/trends/{0}/{1}';

http.createServer( function (req, res) {
    var q = url.parse(req.url, true);

    switch (q.pathname) {
        case '/':
            loadIndex(req, res);
            break;
        case '/trends':
            loadTrends(req, res);
            break;
        case '/api/trends':
            apiGetTrends(req, res);
            break;
        default:
            loadFile(req, res);
            break;
    }
}).listen(8080);

function loadIndex(req, res) {
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
}

function loadTrends(req, res) {
    fs.readFile('./trends.html', function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })
}

function apiGetTrends(req, res) {

    var q = url.parse(req.url, true);
    var api_url = '';

    var trends = '';
    var html = '';

    if (q.query.category_id) {
        api_url = 'https://api.mercadolibre.com/trends/' + q.query.site_id + '/' + q.query.category_id;
    } else {
        api_url = 'https://api.mercadolibre.com/trends/' + q.query.site_id;
    }

    https.get(api_url, function(resp){
        var data = '';

        resp.on('data', function(chunk){
            data += chunk;
        });

        resp.on('end', function(){
            trends = JSON.parse(data);
            html = obtenerHTMLTrends(trends, q.query.fil, q.query.col, q.query.visualizacion)

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();

        });
    }).on('error', function(e){
        console.log("Ocurrio un error", e);
    });
}

function obtenerHTMLTrends(trends, fil, col, visualizacion) {
    var html = '';
    var trendIndex = 0;
    var colores = ['is-primary', 'is-success', 'is-info', 'is-warning', 'is-danger', 'is-dark', 'is-light'];

    if (trends == null) {
        return '<div class="notification is-warning"><p class="title">Sin Resultados</p></div>'
    }

    for (let i = 0; i < fil; i++) {
        html += '<div class="tile is-ancestor">';

        for (let j = 0; j < col; j++) {
            if (trendIndex < trends.length) {

                if (visualizacion === 'imagen') {
                    html += '<div class="tile is-parent">' +
                    '<article class="tile is-child box has-text-centered notification '+ colores[Math.floor(Math.random()*colores.length)] + '">' +
                    '<p class="title">' + trends[trendIndex].keyword + '</p>' +
                    '<figure class="image is-4by3"><img src="https://bulma.io/images/placeholders/640x480.png"></figure>' +
                    '<a href="' + trends[trendIndex].url + '" class="subtitle " target="_blank">Ver Items</a>' +
                    '</article>' +
                    '</div>';
                } else if (visualizacion === 'texto') {
                    html += '<div class="tile is-parent">' +
                    '<article class="tile is-child box has-text-centered notification '+ colores[Math.floor(Math.random()*colores.length)] + '">' +
                    '<p class="title">' + trends[trendIndex].keyword + '</p>' +
                    '<a href="' + trends[trendIndex].url + '" class="subtitle " target="_blank">Ver Items</a>' +
                    '</article>' +
                    '</div>';
                }


            }
            trendIndex++;
        }

        html += '</div>';
    }

    html += '</div>';
    return html;
}

function loadFile(req, res) {
    var q = url.parse(req.url, true);

    fs.readFile('.' + q.pathname, function (err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        res.writeHead(200);
        res.write(data);
        return res.end();
    })
}