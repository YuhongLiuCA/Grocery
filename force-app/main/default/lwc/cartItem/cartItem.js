import { api, LightningElement } from 'lwc';

export default class CartItem extends LightningElement {
    @api
    gcart;

    placeOrder(event) {
        this.dispatchEvent(new CustomEvent('placeorder', {
            detail: this.gcart,  
            bubbles: true
        }));
    }
}