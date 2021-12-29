import { LightningElement, api, track} from 'lwc';

export default class ProductItem extends LightningElement {
    @api 
    gproduct;

    @track
    itemQuantity = 0;

    displayNotification = true;

    addProductItem(event) {
        if(this.itemQuantity < this.gproduct.StockQuantity__c)
            this.itemQuantity++;
    }

    reduceProductItem(event) {
        if(this.itemQuantity > 0)
            this.itemQuantity--;
    }

    handleQuantityChange(event) {
        let n = parseInt(event.target.value);
        if(n <= this.gproduct.StockQuantity__c && n >= 0) {
            this.itemQuantity = n;
        } 
    }

    addToCart(event) {
        if(this.itemQuantity < 1) {
            this.itemQuantity = 0;
            let component = this.template.querySelector("input");
            component.value = this.itemQuantity;
            return;
        }
        this.dispatchEvent(new CustomEvent('additem', {
            detail: {product: this.gproduct, quantity: this.itemQuantity},  
            bubbles: true
        }));
        let component = this.template.querySelector("input");
        let num = this.itemQuantity;
        this.itemQuantity = 0;
        component.value = this.itemQuantity;
        this.displayNotification = false;
        let textToDisplay = this.template.querySelector(".notificationText");
        console.log(textToDisplay);
        textToDisplay.value = "Here " + num + " " + this.gproduct.Name + " added into cart";
        
        
        setTimeout(() => {
            this.displayNotification = true;
        }, 10000);
        console.log("add submitted");
    }
}