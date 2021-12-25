import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";
import GetAccountList from "@salesforce/apex/AccountController.GetAccountList"; 

export default class CartApp extends LightningElement {
    @track groceryProducts = [];
    @track cartItems = [];
    @track displayProduct = true;
    @track cartRecord;
    @track currentAccount;
    addItem(event) {
        let n;
        if(this.cartItems) {
            n = this.cartItems.length;
        } else {
            n = 0;
        }
        let item = {
            id__c: n,
            Name: event.detail.product.Name,
            Price__c: event.detail.product.Price__c,
            Category__c: event.detail.product.Category__c,
            Description__c: event.detail.product.Description,
            Quantity__c: event.detail.quantity,
            Image__c: event.detail.product.Image__c,
            Product__c: event.detail.product.Id, 
            Cart__c: 0,
            ItemPrice: (event.detail.product.Price__c * event.detail.quantity).toFixed(2)
        };
        console.log(item);
        this.cartItems.push(item);
    }

    placeOrder(event) {}

    //When User delete on item from Cart
    handleDeleteItem(event) {
        let v = event.detail;
        for(let i = 0; i < this.cartItems.length; i++) {
            if(this.cartItems[i].id__c == v) {
                this.cartItems.splice(i,1);
                break;
            }
        }
    }

    hanldeQuantityChange(event) {
        let quantityChange = event.detail;
        for(let i = 0; i < quantityChange.length;i++) {
            this.cartItems[i].Quantity__c = quantityChange[i];
            this.cartItems[i].ItemPrice = (this.cartItems[i].Quantity__c * this.cartItems[i].Price__c).toFixed(2);
        }
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
        let index = this.findAccountIndex(this.accountList, e.detail.value);
        this.currentAccount = this.accountList[index];
        console.log("Account change");
        console.log(index);
        console.log(this.accountValue);
    }  

    findAccountIndex(accountList, name) {
        if(accountList.length < 1) return -1;
        for(let i = 0; i < accountList.length; i++) {
            if(accountList[i].Name === name) return i;
        }
    }


    
}