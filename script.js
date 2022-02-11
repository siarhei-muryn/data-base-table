//import fetch from "cross-fetch";

class DataTable {

    constructor(pasteId, src) {
        this.pasteId = pasteId;
        this.src = src;
        this.loaderStart();
        this.getData(this.src);
    }

    loaderStart() {
        let contentLoaderElement = document.createElement('div');
        contentLoaderElement.className = 'content-loader';
        contentLoaderElement.innerText = 'Loading';
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
        for (let key in this.data[0]) {
            headColumns += 1;
            let headCell = document.createElement('th');
            headCell.className = this.pasteId + '-head-' + headColumns;
            headCell.style.border = '1px black solid';
            headCell.style.borderCollapse = 'collapse';
            headCell.innerText = key.toUpperCase();
            tableHead.appendChild(headCell);
        }
        tableElement.appendChild(tableHead);

        let tableBody = document.createElement('tbody');
        tableBody.className = this.pasteId + '-body';


        let bodyRows = 0;
        for (let item of this.data) {
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
                tableColumn.style.padding = '1rem';
                tableColumn.style.border = '1px black solid';
                tableColumn.style.borderCollapse = 'collapse';
                tableColumn.innerText = item[key];
                tableRow.appendChild(tableColumn);
            }
            tableBody.appendChild(tableRow);
        }
        tableElement.appendChild(tableBody);
        pasteElement.appendChild(tableElement);
    }


}

let table = new DataTable('table-1', 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D');

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
