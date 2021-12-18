import { LightningElement, wire, api, track  } from 'lwc';

export default class CartApp extends LightningElement {
    @track groceryProducts = [{name: "Apple",image:"https://images.unsplash.com/photo-1611574474484-ced6cb70a2cf?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4ODk3NQ&ixlib=rb-1.2.1&q=85",price:2.75,quantity:0,inc:"AppleInc",dec:"AppleDec",category:"NewArrival"},
    {name: "Pear",image:"https://images.unsplash.com/photo-1531746808781-ce4c1b3a5ff2?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4Nzg0Mw&ixlib=rb-1.2.1&q=85",price:1.75,quantity:0,inc:"PearInc",dec:"PearDec",category:"BestSeller"},
    {name: "Banana",image:"https://images.unsplash.com/photo-1623810836868-057b23aef3aa?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4Nzg3OA&ixlib=rb-1.2.1&q=85",price:0.99,quantity:0,inc:"BananaInc",dec:"BananaDec",category:"OnSale"},
    {name: "Orange",image:"https://images.unsplash.com/photo-1606050495266-ab4f2615cea5?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4NzkzMQ&ixlib=rb-1.2.1&q=85",price:1.09,quantity:0,inc:"OrangeInc",dec:"OrangeDec",category:"OnSale"},
    {name: "Grape",image:'https://images.unsplash.com/photo-1599819177626-b50f9dd21c9b?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHx8MTYzOTc4ODAxMg&ixlib=rb-1.2.1&q=85',price:3.99,quantity:0,inc:"GrapeInc",dec:"GrapeDec",category:""}
    ];
    @track cartItems;
    @track displayProduct = true;
}