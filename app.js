const express = require('express'),
axios         = require('axios'),
cheerio       = require('cheerio'),
app           = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/results', isQuery, (req, res) => {
    const data = [],
    query = req.query.search;
    axios.get('https://www.bing.com/search?q=' + query)
    .then(response => {
        const html = response.data,
        $ = cheerio.load(html);
        $('.b_algo', html).each(function() {
            const htext = $(this).find('h2').text(),
            hlink = $(this).find('a').attr('href'),
            desc = $(this).find('p').text();
            data.push({
                htext, 
                hlink,
                desc
            });
        })
        res.render('results', {data, query});
    })
})

function isQuery(req, res, next) {
    if (!req.query.search) {
        return res.redirect('/');
    }; next();
}

app.listen(process.env.PORT || 3500, process.env.IP, () => {
    console.log('server started');
})
