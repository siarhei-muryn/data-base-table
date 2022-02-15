//import fetch from "cross-fetch";

class DataTable {

    constructor(pasteId, src) {
        this.data = undefined;
        this.sortedData = undefined;
        this.searchedData = undefined;
        this.pasteId = pasteId;
        this.src = src;
        this.loaderStart();
        this.getData(this.src);
        this.sortChanger = true;
    }

    loaderStart() {
        let contentLoaderElement = document.createElement('div');
        {
            contentLoaderElement.className = 'content-loader';
            contentLoaderElement.innerText = 'Loading...';
            contentLoaderElement.style.width = '100%';
            contentLoaderElement.style.height = '100%';
            contentLoaderElement.style.fontSize = '4.5rem';
        }
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
                this.createTable(this.data);
            }).catch(reason => console.log(reason));
    }

    createTable(customData) {

        this.prepareToTable();

        this.createTableHead(customData);

        this.createTableBody(customData)
    }

    prepareToTable() {
        this.pasteElement = document.getElementById(this.pasteId);
        this.pasteElement.style.width = '100%';

        this.tableElement = document.createElement('table');
        this.tableElement.style.border = '1px black solid';
        this.tableElement.style.borderCollapse = 'collapse';

        this.tableHead = document.createElement('thead');
        this.tableHead.className = this.pasteId + '-head';
    }

    createTableHead(customData) {
        this.headColumns = 0;
        for (let key in customData[0]) {
            this.headColumns += 1;

            let headCell = document.createElement('th');
            {
                headCell.className = this.pasteId + '-head-' + this.headColumns;
            }

            let tempDiv = document.createElement('div');
            {
                tempDiv.className = 'temp-div';
                tempDiv.style.display = 'flex';
                tempDiv.style.justifyContent = 'center';
                tempDiv.style.alignItems = 'center';
            }

            let paragraph = document.createElement('p');
            paragraph.innerText = key.toUpperCase();
            tempDiv.appendChild(paragraph);

            let svgSort = document.createElement('img');
            {
                svgSort.className = 'svg-sort';
                svgSort.src = 'img/svg/1200px-Sort_font_awesome.svg.png';
                svgSort.style.maxWidth = '8%';
                svgSort.style.maxHeight = '8%';
            }
            tempDiv.appendChild(svgSort);


            svgSort.onclick = () => {
                this.dataSorting(this.sortChanger, key);
                this.sortChanger = !this.sortChanger;
            }

            let searchInput = document.createElement('input');
            {
                searchInput.className = this.pasteId + '-head-' + key;
                searchInput.style.maxWidth = '90%';
                searchInput.style.margin = '5%';
                searchInput.placeholder = 'search';
                searchInput.type = 'text';
            }

            searchInput.onchange = () => {
                let searchStr = searchInput.value;
                if (searchStr === '') {
                    this.tableBody.innerHTML = '';
                    this.createTableBody(this.sortedData);
                    return;
                }
                this.dataSearching(searchStr, key);
            }


            headCell.appendChild(tempDiv);
            headCell.appendChild(searchInput);
            this.tableHead.appendChild(headCell);
        }
        this.tableElement.appendChild(this.tableHead);
    }

    createTableBody(customData) {

        this.tableBody = document.createElement('tbody');
        this.tableBody.className = this.pasteId + '-body';


        let bodyRows = 0;
        for (let item of customData) {
            bodyRows += 1;
            let tableRow = document.createElement('tr');
            tableRow.className = this.pasteId + '-body-' + 'row-' + bodyRows;

            let bodyColumns = 0;
            for (let key in item) {
                bodyColumns += 1;
                let tableColumn = document.createElement('td');
                {
                    tableColumn.className = this.pasteId + '-body-' + 'row-' + bodyRows + '-column-' + bodyColumns;
                    let blockWidth = Math.floor(window.innerWidth / this.headColumns) - 5;
                    tableColumn.style.maxWidth = blockWidth.toString() + 'px';
                    tableColumn.style.minWidth = (blockWidth - 50).toString() + 'px';
                }

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
            this.tableBody.appendChild(tableRow);
        }
        this.tableElement.appendChild(this.tableBody);
        this.pasteElement.appendChild(this.tableElement);
    }

    dataSorting(order, key) {

        let changer;
        if (order) {
            changer = 1;
        } else changer = -1;

        this.sortedData = this.data;

        this.sortedData.sort((first, second) => {
            if (first[key] < second[key]) {
                return -1 * changer;
            } else if (first[key] > second[key]) {
                return 1 * changer;
            } else return 0;
        })
        this.tableBody.innerHTML = '';
        this.createTableBody(this.sortedData);
    }

    dataSearching(searchRequest, key) {
        this.searchedData = [];
        for (let item of this.data) {
            if (item[key].toString().toUpperCase().search(searchRequest.toUpperCase()) >= 0) {
                this.searchedData.push(item);
            }
        }
        this.tableBody.innerHTML = '';
        this.createTableBody(this.searchedData);
    }
}

let src = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
//let src = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
let table = new DataTable('table-1', src);

