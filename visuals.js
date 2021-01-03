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

    // let barWidth = (svgWidth / stargazersCountArr.length);
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

// async function getIssues(){
//     clearSVG();
//     const url = "https://api.github.com/search/issues?q=author:raisedadead repo:freecodecamp/freecodecamp type:issue"
//     const response = await fetch(url)
//     const result = await response.json()

//     result.items.forEach(i=>{
//         const anchor = document.createElement("a")
//         anchor.href = i.html_url;
//         anchor.textContent = i.title;
//         divResult.appendChild(anchor)
//         divResult.appendChild(document.createElement("br"))
//     })

// }

function getCommits(){

    clear();

    var inputForm = document.getElementById("commitForm");
    var ownerName = document.getElementById("ownerName").value;
    var repoName = document.getElementById("repoName").value;

    if(!ownerName || !repoName){
        //to-do
        return;
    }

    var spinner = document.getElementsByClassName("lds-spinner")[0];
    spinner.setAttribute("style", "display:block");

    //const url = `https://api.github.com/search/commits?q=repo:${ownerName}/${repoName}`;
    const url = "https://api.github.com/search/commits?q=repo:freecodecamp/freecodecamp";
    const headers = {
        "Accept" : "application/vnd.github.cloak-preview"
    }
    fetch(url,{
        "method" : "GET",
        "headers" : headers
    }).then(function(response){
        
        const link = response.headers.get("link")
        const links = link.split(",")
        const urls = links.map(a=>{
            return{
                url : a.split(";")[0].replace("<", "").replace(">", ""),
                title : a.split(";")[1]
            }
        })

        const result = response.json();

        let uniqueAuthors = [];
        let commitByAuthorCount = [];

        result.items.forEach(i=>{
            const img = document.createElement("img")
            img.src = i.author.avatar_url;
            img.style.width = "32px"
            img.style.height = "32px"
            const anchor = document.createElement("a")
            anchor.href = i.html_url;
            anchor.textContent = i.commit.message.substr(0,120) + "...";
            divResult.appendChild(img)
            divResult.appendChild(anchor)
            divResult.appendChild(document.createElement("br"))

            //
            let authorName = i.authorName;
            if (!uniqueAuthors.includes(authorName)) {
                uniqueAuthors.push(authorName);
            }
        });

        result.items.forEach(i=>{
            let authorName = i.authorName;
            uniqueAuthors.forEach(j=>{
                if (authorName == uniqueAuthors[j]) {
                    if (commitByAuthorCount[j]) {
                        commitByAuthorCount[j] = commitByAuthorCount[j] + 1;
                    } else {
                        commitByAuthorCount[j] = 1;
                    }
                }
            });
        });

        urls.forEach(u=>{
            const btn = document.createElement("button")
            btn.textContent = u.title;
            btn.addEventListener("click", e=> getCommits(u.url))
            divResult.appendChild(btn);

        })

    }).then(function(response){
        console.log(response)
    })
    .catch(function(error){
        console.log(error)
    })

    spinner.setAttribute("style", "display:none");
}

function displayCommitForm(){
    clear();

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