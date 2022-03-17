import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";
import GetAccountList from "@salesforce/apex/AccountController.GetAccountList"; 
import SaveCarts from "@salesforce/apex/CartController.SaveCarts"; 
import getCart from '@salesforce/apex/CartController.getCart';
import SaveItems from "@salesforce/apex/ItemController.SaveItems"; 
import My_Resource from '@salesforce/resourceUrl/myResource';
import SaveAccountList from '@salesforce/apex/AccountController.SaveAccountList';

export default class CartApp extends LightningElement {
    @track groceryProducts = [];
    @track cartItems = [];
    @track displayProduct = true;
    @track cartRecord ={
        Account__c: '',
        Order_Number__c: 0,
        Quantity__c: 0,
        Total_price__c: (0.0).toFixed(2)
    };
    @track currentAccount;
    @track accountList = [];
    @track optionList = [];
    accountValue = '';
    displayNotification = true;

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

        //Calculate new cart
        this.calculateCartQuantity();
    }

    calculateCartQuantity() {
        let itemQuantity = 0;
        let totalPrice = 0.0;

        //Calculate total prcie and total qunatity in the cart
        for(let i = 0; i < this.cartItems.length; i++) {
            itemQuantity += this.cartItems[i].Quantity__c;
            totalPrice += this.cartItems[i].Quantity__c * this.cartItems[i].Price__c;
        }
        this.cartRecord.Quantity__c = itemQuantity;
        this.cartRecord.Total_price__c = totalPrice.toFixed(2);  

        //Set orderNumber, if have n items, then the order number is n+1
        let orderNumber = 1;
        if(this.currentAccount.Carts__r) {
            orderNumber = this.currentAccount.Carts__r.length + 1;
        }
        this.cartRecord.Order_Number__c = orderNumber;
    }

    //Place order click event handler
    placeOrder(event) {

        //Calculate new cart
        this.calculateCartQuantity();    
        console.log("cart detail");
        console.log(JSON.stringify(event.detail)); 
     
        let carts=[];
        carts.push(this.cartRecord);
        let orderNumber = this.cartRecord.Order_Number__c;
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
                    newItems.push(newItem);
                }
                //Save new items into database
                SaveItems({newItems: newItems}).then(result2 => {
                    //Add notification text into the cart tab
                    this.displayNotification = false;
                    let textToDisplay = this.template.querySelector(".cartNotificationText");
                    textToDisplay.value = "Order placed, total " + this.cartRecord.Quantity__c + "items, total cost is $" + this.cartRecord.Total_price__c;
        
                    //The notification text dsiplay 10 seconds 
                    setTimeout(() => {
                        this.displayNotification = true;
                    }, 10000);
                    this.cartItems = [];
                    if(!this.currentAccount.Carts__r) {
                        this.currentAccount.Carts__r = [];
                    }
                    this.currentAccount.Carts__r.push(this.cartRecord);
                    let index = this.findAccountIndex(this.accountList, this.currentAccount.Name);
                    if(!this.accountList[index].Carts__r) {
                        this.accountList[index].Carts__r = [];
                    }
                    this.accountList[index].Carts__r.push(this.cartRecord);
                    this.calculateCartQuantity();
                }).catch(error => {
                    console.log(error);       
                });
            }).catch(error => {
                console.log(error);
            })
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
        //Calculate new cart
        this.calculateCartQuantity();
    }

    //Event handle for user change item quantity in cart
    hanldeQuantityChange(event) {
        let quantityChange = event.detail;
        for(let i = 0; i < quantityChange.length;i++) {
            this.cartItems[i].Quantity__c = quantityChange[i];
            this.cartItems[i].ItemPrice = (this.cartItems[i].Quantity__c * this.cartItems[i].Price__c).toFixed(2);
        }
        //Calculate new cart
        this.calculateCartQuantity();
    }

    //Handler for use click cart icon
    handleProductCartChange(event) {
        let component = event.target;
        this.template.querySelector('lightning-tabset').activeTabValue = "Cart";
    }

    //When component connected, load Account and Product data from Database
    connectedCallback() {
        GetAccountList().then(result => {
            this.accountList = result;
            this.currentAccount = this.accountList[0];
            let newOptions = [];
            for(let i = 0; i < result.length; i++) {             
                newOptions.push({label: result[i].Name, value: result[i].Name});                
            }
            this.optionList = newOptions;
            this.accountValue = result[0].Name;
            this.cartRecord.Account__c = this.currentAccount.Id;
        }).catch((error) => {
            console.log(error);
        });

        GetProducts()
          // Callback on a response
          .then((result) => {
            this.groceryProducts = [...result];
            for(let i=0; i < this.groceryProducts.length; i++) {
                this.groceryProducts[i].Image__c = My_Resource + this.groceryProducts[i].Image__c;
                //product.Image__c = Grape;
            }
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });          
    }

    //Constructor, set default account if no accounts
    constructor() {
        super();
        let newAccounts =[{Name: "John Smith", Active__c: "Yes"}, {Name: "Tom Cat", Active__c: "Yes"}];
        GetAccountList().then(result => {
            this.accountList = result;
            if(result.length === 0) {
                SaveAccountList({accounts: newAccounts});
                //Set timer to load accounts again after 300ms
                setTimeout(() => {
                    GetAccountList().then(result => {
                        this.accountList = result;
                        this.currentAccount = this.accountList[0];
                        let newOptions = [];
                        for(let i = 0; i < result.length; i++) {             
                            newOptions.push({label: result[i].Name, value: result[i].Name});                
                        }
                        this.optionList = newOptions;
                        this.accountValue = result[0].Name;
                        this.cartRecord.Account__c = this.currentAccount.Id;
                    }).catch((error) => {
                        console.log(error);
                    });
                }, 300);
            }
        }).catch(error => console.log(error));
    }

    //Event handle for user change acoount
    handleAccountChange(e) {
        this.accountValue = e.detail.value;
        let index = this.findAccountIndex(this.accountList, e.detail.value);
        this.currentAccount = this.accountList[index];
        this.cartItems = [];

        this.cartRecord.Account__c = this.currentAccount.Id;
        this.cartRecord.Quantity__c = 0;
        this.cartRecord.Total_price__c = (0.0).toFixed(2);  
        let orderNumber = 1;
        if(this.currentAccount.Carts__r) {
            orderNumber = this.currentAccount.Carts__r.length + 1;
        }
        this.cartRecord.Order_Number__c = orderNumber;
    }  

    //Find account index with name input
    findAccountIndex(accountList, name) {
        if(accountList.length < 1) return -1;
        for(let i = 0; i < accountList.length; i++) {
            if(accountList[i].Name === name) return i;
        }
    }    
}