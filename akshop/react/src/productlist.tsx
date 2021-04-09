import * as React from 'react';
import {useState, useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import {useFetch} from './fetchhook';
import {debounce, elementExistsById} from "./utils";

function ProductListApp(){
    /* Component for product list
       The HTML for the list and the pagination data is generated by
       a Django view.

       Navigation UI is handled by this component.
    */
    const [page, setPage] = useState(1);
    const [terms, setTerms] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const params = new URLSearchParams()
    params.append("page", page.toString());
    params.append("terms", terms);
    params.append("sort", sortBy);
    /* 
       Requests will be issued when query parameters change.
       Component will update when the status of the request
       updates.
    */
    const { status, data} = useFetch("/shop/list/?"+params.toString());

    window["sortOrderName"] = function(){
        setSortBy("name");
    }
    window["sortOrderPrice"] = function(){
        setSortBy("price");
    }
    window["sortOrderId"] = function(){
        setSortBy("id");
    }
    var listElement = undefined;
    if (status=="fetched") {
        listElement = <div dangerouslySetInnerHTML={{__html:data["html"]}}></div>;
        var pagination = undefined;
        if (data["is_paginated"]) {
            let pageLinks = [];
            data["pages"].forEach((number)=>pageLinks.push(
                <li className="page-item">
                    <a className="page-link" href="#"
                        onClick={()=>setPage(number)}>
                        {number}
                    </a>

                </li>
            ))
            pagination = <nav aria-label="Product List Navigation">
                <ul className="pagination">
                {data["has_previous"] && <li className="page-item">
                    <a className="page-link" href="#"
                        onClick={()=>setPage(data["previous_page"])}>
                        Previous
                        </a>
                    </li>}
                {pageLinks}
                {data["has_next"] && <li className="page-item">
                    <a className="page-link" href="#"
                        onClick={()=>setPage(data["next_page"])}>
                        Next
                        </a>
                    </li>}
                </ul>
            </nav>
        }
    }
    return <div>
        <input className="form-control form-control-lg"
               type="text" placeholder="Search"
               onChange={debounce((e)=>setTerms(e.target.value), 300)}
               ></input>
        {listElement}
        {pagination}
        </div>
}

export function installProductListApp(){
    let id = "product-list-container";
    if (elementExistsById(id)) {
            console.log("Installing Product List");
            let element : HTMLElement|null = document.getElementById(id);
            ReactDOM.render(<ProductListApp></ProductListApp>, element);
    }
}