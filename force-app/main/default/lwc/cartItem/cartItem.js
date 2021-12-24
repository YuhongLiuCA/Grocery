import { api, LightningElement } from 'lwc';

export default class CartItem extends LightningElement {
    @api
    gcart=[];

    placeOrder(event) {
        this.dispatchEvent(new CustomEvent('placeorder', {
            detail: this.gcart,  
            bubbles: true
        }));
    }
    handleItemDelete(event) {
        let v = event.target.value;
        
        this.dispatchEvent(new CustomEvent('deleteitem', {
            detail: v,  
            bubbles: true
        }));
    }
}