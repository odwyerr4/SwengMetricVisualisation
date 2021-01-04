async function getRepos(){
    clear();

    var spinner = document.getElementsByClassName("lds-spinner")[0];
    spinner.setAttribute("style", "display:block");

    const url = "https://api.github.com/search/repositories?q=stars:>100000";
    const response = await fetch(url);
    const result = await response.json();

    let stargazersCountArr = [];
    let stargazersCountValues = [];
    let nameArr = [];

    let svgWidth = 1000, svgHeight = 350, barPadding = 5;

    result.items.forEach(i=>{
        stargazersCountValues.push(i.stargazers_count);
        nameArr.push(i.name);
    });

    const maxValue = Math.max.apply(Math, stargazersCountValues);

    result.items.forEach(i=>{
        stargazersCountArr.push(i.stargazers_count / maxValue * svgWidth-55);
    });

    let barHeight = (svgHeight / stargazersCountArr.length);

    var data = d3.zip(nameArr, stargazersCountValues, stargazersCountArr);

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var stargazers = svg.selectAll("g.stargazers").data(data);

    var stargazersEnter = stargazers.enter().append("g");

   
    stargazersEnter
        .append("rect")
        .attr("height", barHeight - barPadding)
        .attr("x", 0)
        .attr("width", function (d) {
            return d[2];
        })
        .attr("transform", function(d, i) {
            let translate = [0, barHeight * i];
            return "translate(" +  translate + ")";
        })
        .attr("fill", "yellow");

    stargazersEnter
        .append("text")
        .text(function(d){
            return d[0];
        })
        .attr("y", function(d, i){
            return (barHeight) * i+12;
        })
        .attr("x", function(d){
            return (d[0] / maxValue);
        })
        .attr("fill", "black");

    stargazersEnter
        .append("text")
        .text(function(d) {
            return d[1];
        })
        .attr("y", function(d, i) {
            return (barHeight) * i+12;
        })
        .attr("x", function(d) {
            return (d[1] / maxValue * svgWidth-50);
        })
        .attr("fill", "black");

        spinner.setAttribute("style", "display:none");
}

function getCommits(){

    clear();

    //var inputForm = document.getElementById("commitForm");
    var ownerName = document.getElementById("ownerName").value;
    var repoName = document.getElementById("repoName").value;

    if(!ownerName || !repoName){
        return;
    }

    ownerName = ownerName.toLowerCase();
    repoName = repoName.toLowerCase();

    var spinner = document.getElementsByClassName("lds-spinner")[0];
    spinner.setAttribute("style", "display:block");

    const url = `https://api.github.com/repos/${ownerName}/${repoName}/commits`;
    // const url = "https://api.github.com/repos/freecodecamp/freecodecamp/commits";
    const headers = {
        "Accept" : "application/vnd.github.cloak-preview"
    };

    fetch(url, {
        "method" : "GET",
        "headers" : headers})
    .then(response => response.json())
    .then(function(result) {

        let uniqueAuthors = [];
        let commitByAuthorCount = [];

        result.forEach(i=>{
            let authorName = i.author.login;
            if (!uniqueAuthors.includes(authorName)) {
                uniqueAuthors.push(authorName);
            }
        });

        result.forEach(i=>{
            let authorNames = i.author.login;
            uniqueAuthors.forEach(j=>{
                if (authorNames == j) {
                    if (commitByAuthorCount[j]) {
                        commitByAuthorCount[j] = commitByAuthorCount[j] + 1;
                        commitByAuthorCount.push(j);
                    } else {
                        commitByAuthorCount[j] = 1;
                        commitByAuthorCount.push(j);
                    }
                }
            });
        });

    let authorCommitCount = [];
    let x = 0;

    for(i=0; i < uniqueAuthors.length+1; i++){
        for(j=0; j < commitByAuthorCount.length+1; j++){
            if(uniqueAuthors[i] = commitByAuthorCount[j]){
                x = x + 1;
                //authorCommitCount[i] = x;
                authorCommitCount.push(i.x);
            }
        }
    }

    var data = d3.zip(uniqueAuthors, commitByAuthorCount)

    var array1 = []; // better to define using [] instead of new Array();
    var array2 = [];

    for (var i = 0; i < commitByAuthorCount.length+1; i++) {
        var split = commitByAuthorCount[i].split(":");  // just split once
        array1.push(split[0]); // before the dot
        array2.push(split[1]); // after the dot
    }
    console.log("array1", array1);
    console.log("array2", array2);

    const maxValue = Math.max.apply(Math, commitByAuthorCount.value);

    let width = 1000; height = 350; barPadding = 5;

    let barHeight = (height / uniqueAuthors.length);

    const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

    var commits = svg.selectAll("g.commits").data(data);

    var commitsEnter = commits.enter().append("g");

    commitsEnter
        .append("rect")
        .attr("height", barHeight - barPadding)
        .attr("x", 0)
        .attr("width", function (d) {
            return d[1];
        })
        .attr("transform", function(d, i) {
            let translate = [0, barHeight * i];
            return "translate(" +  translate + ")";
        })
        .attr("fill", "yellow");

    commitsEnter
        .append("text")
        .text(function(d){
            return d[0];
        })
        .attr("y", function(d, i){
            return (barHeight) * i+12;
        })
        .attr("x", function(d){
            return (d[0] / maxValue);
        })
        .attr("fill", "black");

    commitsEnter
        .append("text")
        .text(function(d) {
            return d[1];
        })
        .attr("y", function(d, i) {
            return (barHeight) * i+12;
        })
        .attr("x", function(d) {
            return (d[1] / maxValue * svgWidth-50);
        })
        .attr("fill", "black");

    
    })
    .catch(function(error) {
        console.log(error);
        spinner.setAttribute("style", "display:none");
    })
}

function displayCommitForm(){
    clear();
    clearSVG();

    var inputForm = document.getElementById("commitForm");
    inputForm.setAttribute("style", "display:block");
}

function clear(){
    while(divResult.firstChild){
        divResult.removeChild(divResult.firstChild);
    }
}

function clearSVG(){
    d3.select("svg").remove();
}