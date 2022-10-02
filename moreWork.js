const XML_PATH = '../moreWork.xml';
var htmlsource = '';

var workdivheader = 
"<div class=\"more-work-header-div\">" +
    " <p> - %TITLE% - </p>" +
"</div>";

var workdiv = 
"<div class=\"more-work-div\" onclick=\"window.location.href='%HTMLLINK%';\">" +
    "<table>" + 
        "<tr>" +
            "<td id=\"Row1\">" +
                "<img src=\"%IMAGE%\" alt = \"%TITLE% Banner Image\"></src></td>" +
            "<td id=\"Row2\">%DESCRIPTION%</td> " +
            "<td id=\"Row3\">%TEAMSIZE% %DURATION% %LANGUAGE% %ENGINE%</td> " + 
        "</tr>" + 
    "</table>" + 
"</div>";

function getXMLDocObject()
{
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if((this.readyState === 4) && (this.status === 200))
        {
            var xmlContent = this.responseText;
            var xmlDoc = parseXML(xmlContent);
            renderDoc(xmlDoc);
        }
    };
    xhttp.open('GET', XML_PATH, true);
    xhttp.send();
}

function parseXML(xmlContent)
{
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    return xmlDoc;
}

function renderDoc(xmlDoc)
{
    var moreWork = xmlDoc.querySelector('morework');
    var gameDevWork = moreWork.querySelector('gamedevwork');
    var programmingWork = moreWork.querySelector('programmingwork');
    var otherWork = moreWork.querySelector('otherwork');

    if(gameDevWork.children.length > 0)
    {
        htmlsource += generateHTML('Game Programming Projects', gameDevWork);
    }
    if(programmingWork.children.length > 0)
    {
        htmlsource += generateHTML('Other Programming Projects', programmingWork);
    }
    if(otherWork.children.length > 0)
    {
        htmlsource += generateHTML('Other non-programming Projects', otherWork);
    }


    document.getElementById('work-section').innerHTML = htmlsource;
}

function generateHTML(title, work)
{
    html = workdivheader.replace('%TITLE%', title);

        for(project of work.children)
        {
            var div = workdiv
                .replace('%TITLE%', project.querySelector('title').textContent)
                .replace('%HTMLLINK%', project.querySelector('link').textContent)
                .replace('%IMAGE%', project.querySelector('image').textContent)
                .replace('%DESCRIPTION%', project.querySelector('description').textContent + ' Click for more info!');
            
            var teamsize = project.querySelector('teamsize');
            div = div.replace('%TEAMSIZE%', teamsize ? 'Team Size: ' + teamsize.textContent + '<br>' : '');
            
            var duration = project.querySelector('duration');
            div = div.replace('%DURATION%', duration ? 'Duration: ' + duration.textContent + '<br>' : '');

            var languages = project.querySelectorAll('language');
            if(languages.length > 0)
            {
                if(languages.length > 1)
                {
                    var lanstr = '';
                    for(lan of languages)
                    {
                        lanstr += lan.textContent + ', ';
                    }
                    lanstr = lanstr.slice(0, lanstr.length - 2);
                    div = div.replace('%LANGUAGE%', 'Languages: ' + lanstr + '<br>');
                }
                else
                {
                    div = div.replace('%LANGUAGE%', 'Language: ' + languages[0].textContent + '<br>');
                }
            }
            else
            {
                div = div.replace('%LANGUAGE%', '')
            }

            var engines = project.querySelectorAll('engine');
            if(engines.length > 0)
            {
                if(engines.length > 1)
                {
                    var engstr = '';
                    for(eng of engines)
                    {
                        engstr += eng.textContent + ', ';
                    }
                    engstr = engstr.slice(0, engstr.length - 2);
                    div = div.replace('%ENGINE%', 'Engine: ' + engstr + '<br>');
                }
                else
                {
                    div = div.replace('%ENGINE%', 'Engine: ' + engines[0].textContent + '<br>');
                }
            }
            else
            {
                div = div.replace('%ENGINE%', '')
            }

            html += div;
        }
        return html;
}

getXMLDocObject();