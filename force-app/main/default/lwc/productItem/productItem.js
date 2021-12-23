import { LightningElement, api, track} from 'lwc';

export default class ProductItem extends LightningElement {
    @api 
    gproduct;

    @track
    itemQuantity = 0;

    addProductItem(event) {
        if(this.itemQuantity < this.gproduct.Quantity__c)
            this.itemQuantity++;
    }

    reduceProductItem(event) {
        if(this.itemQuantity > 0)
            this.itemQuantity--;
    }

    handleQuantityChange(event) {
        let n = parseInt(event.target.value);
        if(n <= this.gproduct.Quantity__c && n >= 0) {
            this.itemQuantity = n;
        } 
    }

    addToCart(event) {
        this.dispatchEvent(new CustomEvent('additem', {
            detail: {product: this.gproduct, quantity: this.itemQuantity},  
            bubbles: true
        }));
        console.log("add submitted");
    }
}