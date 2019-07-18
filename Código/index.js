const app = require('./config/server');

require('./routes/routes')(app);

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});