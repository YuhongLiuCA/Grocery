import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";
import GetAccountList from "@salesforce/apex/AccountController.GetAccountList"; 
import SaveCarts from "@salesforce/apex/CartController.SaveCarts"; 
import getCart from '@salesforce/apex/CartController.getCart';
import SaveItems from "@salesforce/apex/ItemController.SaveItems"; 

export default class CartApp extends LightningElement {
    @track groceryProducts = [];
    @track cartItems = [];
    @track displayProduct = true;
    @track cartRecord;
    @track currentAccount;
    @track accountList = [];
    @track optionList = [];
    accountValue = '';

    //Add item into cart handler
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

        //If item name already exists in Cart list, combine two items together
        for(let i = 0; i < this.cartItems.length; i++) {
            if(item.Name === this.cartItems[i].Name) {
                this.cartItems[i].Quantity__c += item.Quantity__c;
                return;
            }
        }

        //If item is new, add item into cart items
        this.cartItems.push(item);
    }

    //Place order click event handler
    placeOrder(event) {
        let itemQuantity = 0;
        let totalPrice = 0.0;

        //Calculate total prcie and total qunatity in the cart
        for(let i = 0; i < this.cartItems.length; i++) {
            itemQuantity += this.cartItems[i].Quantity__c;
            totalPrice += this.cartItems[i].Quantity__c * this.cartItems[i].Price__c;
        }

        //Set orderNumber, if have n items, then the order number is n+1
        let orderNumber = 1;
        if(this.currentAccount.Carts__r) {
            orderNumber = this.currentAccount.Carts__r.length + 1;
        }

        //Set new cart object and save it into database
        let newCart = {
            Account__c: this.currentAccount.Id,
            Order_Number__c: orderNumber,
            Quantity__c: itemQuantity,
            Total_price__c: totalPrice
        };        
        let carts=[];
        carts.push(newCart);
        SaveCarts({carts: carts}).then((result1 => {
            //Get new cart object Id after saving it
            getCart({order_num: orderNumber}).then((result) => {
                let id_cart = result[0].Id;
                
                let newItems =[];
                //Save all items in the cart field Cart__c as new cart Id
                for(let i = 0; i < this.cartItems.length; i++) {
                    this.cartItems[i].Cart__c = id_cart;
                    //Set new Item object
                    let newItem = {
                        id__c: this.cartItems[i].id__c,
                        Name: this.cartItems[i].Name,
                        ItemPrice__c: this.cartItems[i].Price__c,
                        Quantity__c: this.cartItems[i].Quantity__c,
                        Product__c: this.cartItems[i].Product__c, 
                        Cart__c: this.cartItems[i].Cart__c
                    };
                    //console.log(newItem);
                    newItems.push(newItem);
                }
                //Save new items into database
                SaveItems({newItems: newItems}).then(result2 => {
                    console.log(result2);
                }).catch(error => {console.log(error)});
            }).catch(error => {console.log(error);})
        })).catch(error => {
            console.log(error);
        });
    }

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

    //Event handle for user change item quantity in cart
    hanldeQuantityChange(event) {
        let quantityChange = event.detail;
        for(let i = 0; i < quantityChange.length;i++) {
            this.cartItems[i].Quantity__c = quantityChange[i];
            this.cartItems[i].ItemPrice = (this.cartItems[i].Quantity__c * this.cartItems[i].Price__c).toFixed(2);
        }
    }

    //When component connected, load Account and Product data from Database
    connectedCallback() {
        //console.log("Account start");
        GetAccountList().then(result => {
            this.accountList = result;
            this.currentAccount = this.accountList[0];
            console.log(result);
            let newOptions = [];
            for(let i = 0; i < result.length; i++) {             
                newOptions.push({label: result[i].Name, value: result[i].Name});                
            }
            this.optionList = newOptions;
            this.accountValue = result[0].Name;
            //console.log("Good");
            console.log(this.accountList);
        }).catch((error) => {
            console.log(error);
        });

        GetProducts()
          // Callback on a response
          .then((result) => {
            this.groceryProducts = result;
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });          
    }

    //Event handle for user change acoount
    handleAccountChange(e) {
        this.accountValue = e.detail.value;
        let index = this.findAccountIndex(this.accountList, e.detail.value);
        this.currentAccount = this.accountList[index];
        this.cartItems = [];
        console.log("Account change");
        console.log(index);
        console.log(this.accountValue);
        console.log(this.currentAccount.Id);
    }  

    //Find account index with name input
    findAccountIndex(accountList, name) {
        if(accountList.length < 1) return -1;
        for(let i = 0; i < accountList.length; i++) {
            if(accountList[i].Name === name) return i;
        }
    }    
}