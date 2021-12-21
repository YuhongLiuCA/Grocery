public with sharing class ProductController {
    public ProductController() {

    }

    @AuraEnabled
    public static List<Product2> GetProducts() {

        List<Product2> allProducts = [SELECT name, ProductCode, Category__c, Image__c,Price__c, Description, Quantity__c FROM Product2];

        return allProducts;
    }
}
