public with sharing class ProductController {
    public ProductController() {

    }

    @AuraEnabled
    public static List<Product> GetProducts() {

        List<Product> allProducts = [SELECT name, ProductCode, Category__c, Image__c,Price__c, Description, Quantity__c FROM Product];

        return allProducts;
    }
}
