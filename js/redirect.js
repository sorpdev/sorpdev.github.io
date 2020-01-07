const REDIRECT_DATA = {
  "/youtube, /yt": "https://www.youtube.com/channel/UCkxDSg55pwsr7PSAagbz4MA",
  "/github, /git": "https://github.com/sorp92",
  "/trakt": "https://trakt.tv/users/sorp",
  "/twitch": "https://www.twitch.tv/sorp"
};

var path = window.location.pathname;
var debug = false;

if(document.cookie === "DEBUG=true"){
  debug = true;
  console.log("Debug enabled");
}

//Remove / at the end
if (path.endsWith("/"))
  path = path.substr(0, path.length - 1);

function checkForRedirect(p) {
  var redirect;

  Object.keys(REDIRECT_DATA).forEach((trigger, index) => {

    if(debug) console.log("Comparing",p,"and",trigger," INDEX", index);

    if(trigger.includes(",")){

      if(debug) console.log("Doing alias check for",trigger," INDEX", index);

      var triggerSplit = trigger.split(",");

      triggerSplit.forEach((t) => {

        t = t.trim();

        if(debug) console.log("Alias comparing",p,"and",t);

        if(p === t) redirect = REDIRECT_DATA[index];

      });

    } else {
      if(p === trigger) redirect = REDIRECT_DATA[index];
    }

  });

  if(debug) console.log("redirect=",redirect);

  if(redirect !== undefined) return redirect;
  else return false;
  
}

function executeRedirect(path, noRedirectCallback, parameter) {
  var redirect = checkForRedirect(path);
  if (redirect) {
    window.location.href = redirect + (parameter ? parameter : "");
  } else {
    noRedirectCallback();
  }
}

function redirectToNotFound() {
  console.log("No redirect found for " + path);
  //Load 404 page
  window.location.href = "/not_found";
}

//Check normal
executeRedirect(path.toLowerCase(), () => {

  //Check for /.../...
  var pathSplit = path.split("/")
  if (pathSplit.length > 2) {

    var targetPath = "/" + pathSplit[1]; //Should result in /...
    var preParameter = pathSplit[0].length + pathSplit[1].length + 1;
    var parameter = path.substr(preParameter, path.length); //Should result in [/...]/...

    executeRedirect(targetPath.toLowerCase(), redirectToNotFound, parameter);

  } else {

    redirectToNotFound();

  }

});
