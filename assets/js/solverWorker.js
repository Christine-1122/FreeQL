importScripts("//pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js");

async function prepareTableauObjects(){
  await languagePluginLoader;
  let [,speciesCSVString, componentCSVString, setupCode] = await Promise.all([
    pyodide.loadPackage('numpy'),
    fetch("../solver/thermo.vdb").then(function(response){
      return response.text();
    }),
    fetch("../solver/comp.vdb").then(function(response){
      return response.text();
    }),
    fetch("../solver/TableauSolver.py").then(function(response){
      return response.text();
    })
  ]);
  pyodide.runPython(setupCode);
}

var pythonReady=prepareTableauObjects();

pythonReady.then(function(e){
  postMessage([1, null]);
});


onmessage = function(e) {
  pythonReady.then(function(){
    postMessage([2, pyodide.runPython("solutionFromWholeTableau("+e.data+")"), e.data]);
  });
}
