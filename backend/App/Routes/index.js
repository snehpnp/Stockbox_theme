module.exports = function (app) {
  
    app.use(require("./Company"))
    app.use(require("./Users"))
    app.use(require("./Theme"))
    
}