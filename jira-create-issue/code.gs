//
// This script takes the user inputs from the Google Form, and will create a JIRA issue when the form is submitted via the REST API
// Takes user input info, and passes it into an event parameter "e"
//
function createIssue(e){
//
// Assign variables to the form data submitted by the requestor from the spreasheet associated with the Google form.
// NOTE: Update the [n] to the cell value in your spreadsheet.
//
  var requesterEmail = e.values[1];
  var summary = e.values[2];
  var description = e.values[3];
//
// The dueDate variable requires a formating update in order that JIRA accepts it
// Date format becomes YYYY-MM-DD, and is called later in the data posted to the API
// 
  var dueDate = e.values[4];
  var formattedDate = Utilities.formatDate(new Date(dueDate), "GMT", "yyyy-MM-dd");
//
// Contact names
//
  var businessSponsor = e.values[5];
  var technicalContact = e.values[6];  
  var docLinks = e.values[7];
//
// Assign variable to your instance JIRA API URL
//
  var url = "https://<YOUR_JIRA_INSTANCE>.atlassian.net/rest/api/latest/issue";
//
// The POST data for the JIRA API call
//
  var data = 
{
    "fields": {
       "project":{ 
          "key": "<PROJECT_KEY>"
       },
       "priority": {
          "name": "Minor"
       },
      "duedate": formattedDate,
      "summary": summary,
      "description": description,
//
// The following custom fields are for the various strings and are simple text fields in JIRA
// You can find all the custom fields by looking here: https://<YOUR_JIRA_INSTANCE>.atlassian.net/rest/api/latest/field/
//    
      "customfield_14902": businessSponsor,
      "customfield_16100": technicalContact,
      "customfield_10216": requesterEmail,
      "customfield_14308": docLinks,
//
// All tickets are categorised as Tasks, and are not changed by the form submission.
//
      "issuetype":{
          "name": "Task"
       }
   }
};
//
// Turn all the post data into a JSON string to be send to the API
//
  var payload = JSON.stringify(data);
//
// POST header information, including authorization information.  
// This API call is linked to an account in JIRA, and follows the Basic Authentication method ("username:password" are Base64 encoded)
//
  var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "authorization": "Basic <BASE64_ENCODED_USER:PASS>"
      };

//
// A final few options to complete the JSON string
//
  var options = 
      { 
        "content-type": "application/json",
        "method": "POST",
        "headers": headers,
        "payload": payload
      };  

//
// Make the HTTP call to the JIRA API
//
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
//
// Parse the JSON response to use the Issue Key returned by the API in the email
//
  var dataAll = JSON.parse(response.getContentText());
  var issueKey = dataAll.key
  Logger.log(dataAll)
//
// Assign variables for the email reposnse
//
  var myMailbox = "noreply@nodomain.com"
  var emailSubject = "Your request no. " + issueKey + " has been created";
  var emailBody = "Thank you for your ticket submission." + "\n\n" +
    "Your request has been created, your reference is " + issueKey + " which can be accessed via the following link to the JIRA system:" + "\n\n" +
      "https://<YOUR_JIRA_INSTANCE>.atlassian.net/browse/"+ issueKey + "\n\n" +
       "We will be in touch soon to discuss your ticket submission.  " +
//
// Send an email to the requestor
//
  MailApp.sendEmail(requesterEmail, emailSubject, emailBody, {
    name: "<MAILBOX_NAME>"
  })
// Assign Additional Watcher not just the requestor
  var options2 = options
  options2.payload = JSON.stringify("<MAILBOX_NAME>")
  var response = UrlFetchApp.fetch(url + issueKey + "/watchers", options2);
 }
