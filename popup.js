document.addEventListener("DOMContentLoaded", async () => {
    const mainele = document.getElementById("main");
    var curUrl;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        curUrl = tabs[0].url;
        var url = curUrl.substring(0, "https://www.npmjs.com/package/".length);
        if (url === "https://www.npmjs.com/package/") {
            const baseUrl = "https://api.npms.io/v2/search?q=";
            var request = new XMLHttpRequest();
            try {
                request.open("GET", baseUrl + curUrl.substring("https://www.npmjs.com/package/".length, 200), true);
                try {
                    request.send();
                } catch (error) {
                    throw "Oops! Some error occurred.\nCheck your internet connection and try again";
                }
                request.onload = function () {
                    document.getElementById("cur-package").innerHTML = curUrl.substring("https://www.npmjs.com/package/".length, 200);
                    var data = JSON.parse(request.response);
                    var packages = data.results;
                    if (packages === null || packages === undefined || packages.length === 1) {
                        document.getElementById("empty").style.display = "block";
                        return;
                    }
                    if (packages.length <= 5) {
                        for (var i = 1; i < packages.length; i++) {
                            document.getElementsByClassName("name")[i - 1].innerHTML = packages[i].package.name;
                            var cont = packages[i].package.description;
                            if (cont !== undefined) {
                                document.getElementsByClassName("content")[i - 1].innerHTML = packages[i].package.description;
                            } else {
                                document.getElementsByClassName("content")[i - 1].innerHTML = "*No description available*";
                            }
                            document.getElementById("a" + i).style.display = "block";
                            document.getElementById("a" + i).href = packages[i].package.links.npm;
                        }
                    } else {
                        for (var i = 1; i <= 5; i++) {
                            document.getElementsByClassName("name")[i - 1].innerHTML = packages[i].package.name;
                            var cont = packages[i].package.description;
                            if (cont !== undefined) {
                                document.getElementsByClassName("content")[i - 1].innerHTML = packages[i].package.description;
                            } else {
                                document.getElementsByClassName("content")[i - 1].innerHTML = "*No description available*";
                            }
                            document.getElementById("a" + i).style.display = "block";
                            document.getElementById("a" + i).href = packages[i].package.links.npm;
                        }
                    }
                };
            } catch (error) {
                mainele.innerHTML = error;
                console.log(error);
            }
        } else {
            mainele.innerHTML = "npm packages are not available for this site (cannot detect npmjs-package)";
        }
    });
});
