#Data table
___
####A data table with a simple way to sort and search for information.
___
![](view.gif)

This is a class that creates a table with the data obtained by reference and puts it inside the html markup using ID.

##Usage example
index.html
```
<div id="table-1"></div>
```
script.js
```
let src = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
let table = new DataTable('table-1', src);
```
___
##The main methods of the class

###getData(src)
>Using fetch, we get data and monitor the status of their loading. Until the data is received, the loader will be shown instead of the table.
###createTable(customData)
>After the data has been successfully received. Based on the JSON content, the table header and its body are formed. Along with this, sorting activation elements are created.
###dataSorting(order, key)
>Sort alphabetically and numerically. If the order argument is true, the sorting will be in ascending order. Next time it's the opposite.
###dataSearching(searchRequest, key)
>The usual search for information on a user-defined query.