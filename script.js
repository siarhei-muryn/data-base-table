//import fetch from "cross-fetch";

class DataTable {

    constructor(pasteId, src) {
        this.data = undefined;
        this.sortedData = undefined;
        this.pasteId = pasteId;
        this.src = src;
        this.loaderStart();
        this.getData(this.src);
        this.sortChanger = true;
    }

    loaderStart() {
        let contentLoaderElement = document.createElement('div');
        contentLoaderElement.className = 'content-loader';
        contentLoaderElement.innerText = 'Loading...';
        contentLoaderElement.style.width = '100%';
        contentLoaderElement.style.height = '100%';
        contentLoaderElement.style.fontSize = '4rem';
        document.getElementById(this.pasteId).appendChild(contentLoaderElement);
    }

    loaderEnd() {
        document.getElementById(this.pasteId).innerHTML = '';
    }

    getData(src) {
        fetch(src)
            .then(async (response) => {
                const reader = response.body.getReader();
                //const contentLength = +response.headers.get('Content-Length');
                let receivedLength = 0;
                let chunks = [];
                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    receivedLength += value.length;
                }
                this.loaderEnd();
                let chunksAll = new Uint8Array(receivedLength);
                let position = 0;

                for (let chunk of chunks) {
                    chunksAll.set(chunk, position);
                    position += chunk.length;
                }

                let result = new TextDecoder('utf-8').decode(chunksAll);
                return JSON.parse(result);
            })
            .then(result => {
                this.data = result;
                this.sortedData = this.data;
                this.createTable();
            }).catch(reason => console.log(reason));
    }

    createTable() {
        let pasteElement = document.getElementById(this.pasteId);
        pasteElement.style.width = '100%';

        let tableElement = document.createElement('table');
        tableElement.style.border = '1px black solid';
        tableElement.style.borderCollapse = 'collapse';

        let tableHead = document.createElement('thead');
        tableHead.className = this.pasteId + '-head';

        let headColumns = 0;
        for (let key in this.sortedData[0]) {
            headColumns += 1;

            let headCell = document.createElement('th');
            headCell.className = this.pasteId + '-head-' + headColumns;
            headCell.style.border = '1px black solid';
            headCell.style.borderCollapse = 'collapse';

            let tempDiv = document.createElement('div');
            tempDiv.className = 'temp-div';
            tempDiv.style.display = 'flex';
            tempDiv.style.justifyContent = 'center';
            tempDiv.style.alignItems = 'center';

            let paragraph = document.createElement('p');
            paragraph.innerText = key.toUpperCase();
            tempDiv.appendChild(paragraph);

            let svgSort = document.createElement('img');
            svgSort.className = 'svg-sort';
            svgSort.src = 'img/svg/1200px-Sort_font_awesome.svg.png';
            svgSort.style.maxWidth = '10%';
            svgSort.style.maxHeight = '10%';


            svgSort.onclick = () => {
                this.dataSorting(this.sortChanger, key);
                this.sortChanger = !this.sortChanger;
            }


            tempDiv.appendChild(svgSort);

            headCell.appendChild(tempDiv);
            tableHead.appendChild(headCell);
        }
        tableElement.appendChild(tableHead);

        let tableBody = document.createElement('tbody');
        tableBody.className = this.pasteId + '-body';


        let bodyRows = 0;
        for (let item of this.sortedData) {
            bodyRows += 1;
            let tableRow = document.createElement('tr');
            tableRow.className = this.pasteId + '-body-' + 'row-' + bodyRows;

            let bodyColumns = 0;
            for (let key in item) {
                bodyColumns += 1;
                let tableColumn = document.createElement('td');
                tableColumn.className = this.pasteId + '-body-' + 'row-' + bodyRows + '-column-' + bodyColumns;
                let blockWidth = Math.floor(window.innerWidth / headColumns) - 5;
                tableColumn.style.maxWidth = blockWidth.toString() + 'px';
                tableColumn.style.minWidth = (blockWidth - 50).toString() + 'px';
                tableColumn.style.padding = '1rem';
                tableColumn.style.border = '1px black solid';
                tableColumn.style.borderCollapse = 'collapse';

                if (typeof item[key] === 'object') {
                    let keys = item[key];
                    let str = '';
                    for (let key in keys) {
                        str += keys[key] + ', ';
                    }
                    tableColumn.innerText = str;
                    tableRow.appendChild(tableColumn);
                } else {
                    tableColumn.innerText = item[key];
                    tableRow.appendChild(tableColumn);
                }
            }
            tableBody.appendChild(tableRow);
        }
        tableElement.appendChild(tableBody);
        pasteElement.appendChild(tableElement);
    }

    dataSorting(order, key) {

        let changer;
        if (order) {
            changer = 1;
        } else changer = -1;

        this.sortedData.sort((first, second) => {
            if (first[key] < second[key]) {
                return -1 * changer;
            } else if (first[key] > second[key]) {
                return 1 * changer;
            } else return 0;
        })
        document.getElementById(this.pasteId).innerHTML = '';
        this.createTable();
    }
}


let table = new DataTable('table-1', 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D');

//http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D
//http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D
/*

[
    {
        id: 101,
        firstName: 'Sue',
        lastName: 'Corson',
        email: 'DWhalley@in.gov',
        phone: '(612)211-6296',
        address: {
            streetAddress: '9792 Mattis Ct',
            city: 'Waukesha',
            state: 'WI',
            zip: '22178'
        },
        description: 'et lacus magna dolor...',
    }
]*/
