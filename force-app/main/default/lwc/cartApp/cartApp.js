import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";
import GetAccountList from "@salesforce/apex/AccountController.GetAccountList"; 

export default class CartApp extends LightningElement {
    @track groceryProducts = [];
    @track cartItems = [];
    @track displayProduct = true;
    addItem(event) {
        //console.log("Add to cart");
        let n;
        if(this.cartItems) {
            n = this.cartItems.length;
        } else {
            n = 0;
        }
        let item = {
            id: n,
            Name: event.detail.product.Name,
            Price__c: event.detail.product.Price__c,
            Category__c: event.detail.product.Category__c,
            Description: event.detail.product.Description,
            Quantity__c: event.detail.product.Quantity__c,
            volume: event.detail.quantity,
            Image__c: event.detail.product.Image__c
        };
        this.cartItems.push(item);
        //console.log(this.cartItems);
        console.log(item);
    }

    @track accountList = [];
    @track optionList = [];
    accountValue = '';
    connectedCallback() {
        console.log("Account start");
        GetAccountList().then(result => {
            this.accountList = result;
            //console.log(result);
            this.value = result.length;
            let newOptions = [];
            for(let i = 0; i < result.length; i++) {
                //console.log("Name="+result[i].Name);               
                newOptions.push({label: result[i].Name, value: result[i].Name});                
            }
            this.optionList = newOptions;
            //console.log("Good");
            //console.log(this.optionList);
        }).catch((error) => {
            console.log(error);
        });

        GetProducts()
          // Callback on a response
          .then((result) => {
            this.groceryProducts = result;
            //console.log("Success");
            //console.log(this.products);
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });
    }

    handleAccountChange(e) {
        this.accountValue = e.detail.value;
    }  
    
}