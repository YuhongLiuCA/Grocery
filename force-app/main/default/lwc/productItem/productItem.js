import { LightningElement, api, track} from 'lwc';

export default class ProductItem extends LightningElement {
    @api 
    gproduct;

    @track
    itemQuantity = 0;

    addProductItem(event) {
        if(this.itemQuantity < this.gproduct.quantity)
            this.itemQuantity++;
    }

    reduceProductItem(event) {
        if(this.itemQuantity > 0)
            this.itemQuantity--;
    }

    handleQuantityChange(event) {
        let n = parseInt(event.target.value);
        if(n <= this.gproduct.quantity && n >= 0) {
            this.itemQuantity = n;
        } 
    }

    addFruitItem(event) {
        let itemId = event.target.id;
        let index = itemId.indexOf("Inc");
        let itemName = itemId.substring(0,index);
        console.log("item="+itemName);
        this.dispatchEvent(new CustomEvent('additem', {
            detail: itemName,  
            bubbles: true
        }));
    }

    removeFruitItem(event) {
        let itemId = event.target.id;
        let index = itemId.indexOf("Dec");
        let itemName = itemId.substring(0,index);
        this.dispatchEvent(new CustomEvent('removeitem', {
            detail: itemName,  
            bubbles: true
        }));
    }
}