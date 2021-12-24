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
        //console.log("Add to cart");
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
            Cart__c: 0
        };
        this.cartItems.push(item);
        //console.log(this.cartItems);
        console.log(item);
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