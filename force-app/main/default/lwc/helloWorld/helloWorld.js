import { LightningElement } from 'lwc';

export default class HelloWorld extends LightningElement {
    greeting = 'World';
    changeHandler(event) {
        this.greeting = event.target.value;
    }
}
////"sfdcLoginUrl": "https://resilient-narwhal-j4pkhd-dev-ed.my.salesforce.com/", project
//"sfdcLoginUrl": "https://cunning-badger-6crpkt-dev-ed.my.salesforce.com/",