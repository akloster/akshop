import * as React from 'react';
import {useState, useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import {useFetch} from './fetchhook';
import {debounce, elementExistsById, postRequest} from "./utils";
function CartApp(){
    const [rev, setRev] = useState(0);
    const { status, data} = useFetch("/shop/get_cart_json/", rev);
    
    /* Cart handling

        The general idea is that global functions for adding and removing
        products are added to the global window object.

        Those in turn increment the "rev" state (short for revision), triggering
        a refetch of the cart data.
        
        This technically wastes a request, but for the alternative would have taken
        more time to implement and would have looked a lot more complicated.

    */
        window["addProductToCart"] = function(id){
            console.log(`Adding ${id} to cart.`);
            postRequest("/shop/add_to_cart/", {id:id}).then(res => {
                setRev(rev+1);
            });
        }
        window["removeProductFromCart"] = function(id){
            console.log(`Removing ${id} from cart.`);
            postRequest("/shop/remove_from_cart/", {id:id}).then(res => {
                setRev(rev+1);
            });
        }
    let items = [];
    let itemCount = "";
    if (status=="fetched"){
        itemCount = "("+ data["cart"].length.toString() + ")";
        data["cart"].forEach((product)=>{
        items.push(<a className="dropdown-item" 
        href="#">
           <img src={product.small_image} width="32" height="32" ></img> {product.name}
          &nbsp; 
          <button className="btn btn-secondary btn-sm" type="button"
          onClick={(e)=>{
                window["removeProductFromCart"](product.id);
          }}>
              x</button>
          </a>
          )
        });
    }
    return  <div className="dropdown">
    <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        shopping cart {itemCount}
    </button>
    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {items}
    </div>
    </div>
}

export function installCartApp(){
    let id = "cart-container";
    if (elementExistsById(id)) {
            console.log("Installing Cart");
            let element : HTMLElement|null = document.getElementById(id);
            ReactDOM.render(<CartApp></CartApp>, element);
    }
}