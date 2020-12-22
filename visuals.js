async function getRepos(){
    clear();
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

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var barChart = svg.selectAll("rect")
        .data(stargazersCountArr)
        .enter()
        .append("rect")
        .attr("height", barHeight - barPadding)
        .attr("x", 0)
        .attr("width", function (d) {
            return d;
        })
        // .attr("y", function(d) {
        //     return svgHeight - d;
        // })
        // .attr("height", function(d) {
        //     return d;
        // })
        // .attr("width", barWidth - barPadding)
        .attr("transform", function(d, i) {
            let translate = [0, barHeight * i];
            return "translate(" +  translate + ")";
        })
        .attr("fill", "yellow");

    var numberLabels = svg.selectAll("text")
        .data(stargazersCountValues)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("y", function(d, i) {
            return (barHeight) * i+12;
        })
        .attr("x", function(d) {
            return (d / maxValue * svgWidth-50);
        })
        .attr("fill", "black")

    var nameLabels = svg.selectAll("text")
        .data(nameArr)
        .enter()
        .append("text")
        .text(function(d){
            return d;
        })
        .attr("y", function(d, i){
            return (barHeight) * i+12;
        })
        .attr("x", function(d){
            return (d / maxValue);
        })
        .attr("fill", "black");
}

async function getIssues(){
    clear();
    const url = "https://api.github.com/search/issues?q=author:raisedadead repo:freecodecamp/freecodecamp type:issue"
    const response = await fetch(url)
    const result = await response.json()

    result.items.forEach(i=>{
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.title;
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })

}

async function getCommits(url = "https://api.github.com/search/commits?q=repo:freecodecamp/freecodecamp author-date:2020-03-01..2020-03-31"){
    clear();
    //const url = "https://api.github.com/search/commits?q=repo:freecodecamp/freecodecamp author-date:2020-03-01..2020-03-31"
    const headers = {
        "Accept" : "application/vnd.github.cloak-preview"
    }
    const response = await fetch(url,{
        "method" : "GET",
        "headers" : headers
    })

    const link = response.headers.get("link")
    const links = link.split(",")
    const urls = links.map(a=>{
        return{
            url : a.split(";")[0].replace("<", "").replace(">", ""),
            title : a.split(";")[1]
        }
    })

    const result = await response.json();

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
}

function clear(){
    while(divResult.firstChild)
        divResult.removeChild(divResult.firstChild)
}