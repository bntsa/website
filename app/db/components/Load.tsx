var rows: any[]
var headers: string[]
var ok: boolean

export const getRows = () => {
    return rows;
}

export const getHeaders = () => {
    return headers;
}

export const getok = () => {
    return ok;
}

export const Load = () => {
    var DELIMITER = ',';
    var NEWLINE = '\n';
    var qRegex = /^"|"$/g;
    var i = document.getElementById('file') as HTMLInputElement;
    var table = document.getElementById('table') as HTMLInputElement;
    let columns: string[] = []


    const defaultRank = ["rank", "ranking", "rating", "place"]
    const defaultAward = ["award", "prize"]
    const defaultName = ["name", "student", "student name", "contestant", "participant"]

    if (!i) {
        return;
    }

    i.addEventListener('change', function () {

        if (!!i.files && i.files.length > 0) {
            parseCSV(i.files[0]);
        }
    });

    const csvStringToArray = (data: any) => {
        const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi
        const result: string[][] = [[]]
        let matches
        while ((matches = re.exec(","+data))) {
            //console.log("matches", matches)
            if (matches[1].length && matches[1] !== ',') result.push([])
            result[result.length - 1].push(
                matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
            )
        }
        return result[0]
    }


    function parseCSV(file: any) {
        if (!file || !FileReader) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            if(e.target) toTable(e.target.result);
        };

        reader.readAsText(file);

    }

    const levenshteinDistance = (str1 = '', str2 = '') => {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        return track[str2.length][str1.length];
    };

    function sortBySimilarity(list: string[], by: string[]){
        var nl: any[][] = []
        list.forEach(e => {
            var min = 1e9
            by.forEach(b => {
                    min=Math.min(min,levenshteinDistance(e.toLowerCase(), b.toLowerCase()))
            })
            nl.push([min, e])
        })

        nl.sort()

        var final: string[] = []
        nl.forEach(e => {
            final.push(e[1])
        })
        return final
    }


    function toTable(text: any) {
        if (!text || !table) {
            return;
        }

        while (!!table.lastElementChild) {
            table.removeChild(table.lastElementChild);
            columns = []
        }

        rows = text.split(NEWLINE);
        headers = rows.shift().trim().split(DELIMITER);
        var htr = document.createElement('tr');
        ok=true

        rows.forEach(function (r: any) {
            r = r.trim();

            if (!r) {
                return;
            }

            //var cols = r.split(DELIMITER);
            var cols: string[] = csvStringToArray(r)

            if (cols.length === 0) {
                return;
            }

            if (cols.length != headers.length) {
                ok = false
            }
        })
        var warning = document.getElementById('warning');
        if(!ok){
            if(warning) warning.textContent = "Warning: the row length is inconsistent"
        }else{
            if(warning) warning.textContent = ""
        }

        headers.forEach(function (h: any) {
            var th = document.createElement('th');
            var ht = h.trim();

            if (!ht) {
                return;
            }

            th.textContent = ht.replace(qRegex, '');
            htr.appendChild(th);

            columns.push(th.textContent)

        });

        table.appendChild(htr);

        var rtr: any;




        rows.forEach(function (r: any) {
            r = r.trim();

            if (!r) {
                return;
            }

            //var cols = r.split(DELIMITER);
            var cols: string[] = csvStringToArray(r)

            if (cols.length === 0) {
                return;
            }

            rtr = document.createElement('tr');

            cols.forEach(function (c: any) {
                var td = document.createElement('td');
                var tc = c.trim();

                td.textContent = tc.replace(qRegex, '');
                rtr.appendChild(td);
            });

            table.appendChild(rtr);
        });


        var studentName = document.getElementById('student_name')

        if(studentName) {
            while (!!studentName.lastElementChild) {
                studentName.removeChild(studentName.lastElementChild);
            }

            let sortedCols = sortBySimilarity(columns, defaultName)


            sortedCols.forEach((col) => {
                studentName?.appendChild(document.createElement("option"))
                    .appendChild(document.createTextNode(col))
            })

        }

        var rank = document.getElementById('rank')

        if(rank) {
            while (!!rank.lastElementChild) {
                rank.removeChild(rank.lastElementChild);
            }

            let sortedCols = sortBySimilarity(columns, defaultRank)


            sortedCols.forEach((col) => {
                rank?.appendChild(document.createElement("option"))
                    .appendChild(document.createTextNode(col))
            })

            rank?.appendChild(document.createElement("option"))
                .appendChild(document.createTextNode("None"))
        }

        var award = document.getElementById('award')

        if(award) {
            while (!!award.lastElementChild) {
                award.removeChild(award.lastElementChild);
            }

            let sortedCols = sortBySimilarity(columns, defaultAward)


            sortedCols.forEach((col) => {
                award?.appendChild(document.createElement("option"))
                    .appendChild(document.createTextNode(col))
            })

            award?.appendChild(document.createElement("option"))
                .appendChild(document.createTextNode("None"))
        }


    }

    return(
        <div hidden>Loaded table</div>
    )
};

