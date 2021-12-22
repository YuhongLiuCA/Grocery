public with sharing class AccountController {
    public AccountController() {

    }
    @AuraEnabled
    public static List<Account> GetAccountList(){
        try {
            //List<Account> allAccounts = [SELECT Name,(SELECT Name,Account__c,Quantity__c,Total_price__c FROM Cart__c) FROM Account WHERE Active__c = 'Yes'];
            List<Account> allAccounts = [SELECT Name,Active__c FROM Account WHERE Active__c = 'Yes'];
            return allAccounts;            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
