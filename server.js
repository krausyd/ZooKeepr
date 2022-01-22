const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//serve static content (images, css, js, ...)
app.use(express.static('public'));

//routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`


        __  _
    .-.'  \`; \`-._  __  _
   (_,         .-:'  \`; \`-._
 ,'o"(        (_,           )
(__,-'      ,'o"(            )>
   (       (__,-'            )
    \`-'._.--._(             )
       |||  |||\`-'._.--._.-'
                  |||  |||  

 API server started at port ${PORT}!`)
});