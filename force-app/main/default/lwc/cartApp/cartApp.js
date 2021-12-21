import { LightningElement, wire, api, track  } from 'lwc';
import GetProducts from "@salesforce/apex/ProductController.GetProducts";

export default class CartApp extends LightningElement {
    @track groceryProducts = [
    {name: "Apple",image:"https://images.unsplash.com/photo-1611574474484-ced6cb70a2cf?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4ODk3NQ&ixlib=rb-1.2.1&q=85",price:2.75,quantity:1000,inc:"AppleInc",dec:"AppleDec",category:"NewArrival",description:"One pound apple"},
    {name: "Pear",image:"https://images.unsplash.com/photo-1531746808781-ce4c1b3a5ff2?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4Nzg0Mw&ixlib=rb-1.2.1&q=85",price:1.75,quantity:500,inc:"PearInc",dec:"PearDec",category:"BestSeller",description:"One pound pear"},
    {name: "Banana",image:"https://images.unsplash.com/photo-1623810836868-057b23aef3aa?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4Nzg3OA&ixlib=rb-1.2.1&q=85",price:0.99,quantity:600,inc:"BananaInc",dec:"BananaDec",category:"OnSale",description:"A bunch of bananas(4 pcs)"},
    {name: "Orange",image:"https://images.unsplash.com/photo-1606050495266-ab4f2615cea5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4NzkzMQ&ixlib=rb-1.2.1&q=85",price:1.09,quantity:200,inc:"OrangeInc",dec:"OrangeDec",category:"OnSale",description:"One bag with 4 oranges"},
    {name: "Grape",image:'https://images.unsplash.com/photo-1599819177626-b50f9dd21c9b?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4ODAxMg&ixlib=rb-1.2.1&q=85',price:3.99,quantity:700,inc:"GrapeInc",dec:"GrapeDec",category:"",description:"One pound grapes"}
    ];
    @track cartItems = [];
    @track displayProduct = true;
    addItem(event) {
        console.log("Add to cart");
        let n;
        if(this.cartItems) {
            n = this.cartItems.length;
        } else {
            n = 0;
        }
        let item = {
            id: n,
            name: event.detail.product.name,
            price: event.detail.product.price,
            category: event.detail.product.category,
            description: event.detail.product.description,
            quantity: event.detail.quantity
        };
        this.cartItems.push(item);
        console.log(this.cartItems);
        console.log(item);
    }

    @track products;

    retrieveProducts() {
        // Call the method
        console.log("product start");
        GetProducts()
          // Callback on a response
          .then((result) => {
            this.products = result;
            console.log("Success");
            console.log(this.products);
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });
      }

      getProductItems(event) {
        console.log("product start");
        GetProducts()
          // Callback on a response
          .then((result) => {
            this.products = result;
            console.log("Success");
            console.log(this.products);
          })
          // Callback if there's an error
          .catch((error) => {
            console.log(error);
          });
      }

    actions = [
        //{ label: 'Show details', name: 'show_details' },
        { label: 'Delete', name: 'delete' },
    ];
    cartColumns = [
        { label: 'Number', fieldName: 'id', editable: false },
        { label: 'Name', fieldName: 'name', type: 'text', editable: false },
        { label: 'Price', fieldName: 'price', type: 'currency', editable: false },
        { label: 'Quantity', fieldName: 'quantity', type: 'number', editable: true },
        { label: 'category', fieldName: 'Category', type: 'text', editable: false },
        { label: 'description', fieldName: 'description', type: 'text', editable: false },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actions },
        }
    ];
    
    rowOffset = 0;

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            //case 'show_details':
            //    this.showRowDetails(row);
            //    break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.cartItems = this.cartItems
                .slice(0, index)
                .concat(this.cartItems.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.cartItems.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }
}