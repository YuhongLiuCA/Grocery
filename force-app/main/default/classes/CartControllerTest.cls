@isTest 
public class CartControllerTest {
    
    @testSetup 
    public static void SetupTests() {
        
              

     
    }
    @isTest 
    public static void TP_GetCart() {
        Test.startTest();

        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFlAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;

        List<Cart__c> result = CartController.getCart(1);
        System.assertEquals(1, result[0].Order_Number__c);
        Test.stopTest();
    }
    @isTest 
    public static void TN_GetCart() {
        Test.startTest();
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFlAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;
        List<Cart__c> result = CartController.getCart(100);
        System.assertEquals(0, result.size());
        Test.stopTest();
    }
}
