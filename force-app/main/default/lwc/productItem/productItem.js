import { LightningElement, api} from 'lwc';

export default class ProductItem extends LightningElement {
    @api 
    gproduct = {name: "Pear",image:"https://en.wikipedia.org/wiki/Pear#/media/File:Assortment_of_pears.jpg",price:1.75,quantity:0,inc:"PearInc",dec:"PearDec",category:"BestSeller"};
}