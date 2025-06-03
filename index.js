let browser;
const browserSync = require('browser-sync')

const server = () => {
  browser = browserSync.create()
  browser.init({
    server: {
      baseDir: './',
      index:'index.html'
    },
    open: false,

    middleware: function(req, res, next) {
        if (req.url.indexOf('.') === -1) {
            req.url = '/index.html';
        }
        next();
    }
  })
}

const init = () => {
  server()
}

init()