async function getRepos(){

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
            for(j=0; j<uniqueAuthors.length; j++){
                if (authorNames == uniqueAuthors[j]) {
                    if (commitByAuthorCount[j]) {
                        commitByAuthorCount[j] = commitByAuthorCount[j] + 1;            
                    } else {
                        commitByAuthorCount[j] = 1;
                    }
                }
            }
        });

    var data = d3.zip(uniqueAuthors, commitByAuthorCount);

    const maxValue = Math.max.apply(Math, commitByAuthorCount.value);

    let width = 1000; height = 350; barPadding = 5;

    let barHeight = (height / uniqueAuthors.length);

    let scale = 0;

    for(i=0; i<commitByAuthorCount.length; i++){
        if(commitByAuthorCount[i]>scale){
            scale = commitByAuthorCount[i];
        }
    }

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
            return d[1] * (1000/scale);
        })
        .attr("transform", function(d, i) {
            let translate = [0, barHeight * i];
            return "translate(" +  translate + ")";
        })
        .attr("fill", "red");

    commitsEnter
        .append("text")
        .text(function(d){
            return d[0];
        })
        .attr("y", function(d, i){
            return (barHeight) * i+40;
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
            return (barHeight) * i+25;
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