# Description
A Google Form uses the [JIRA REST API](https://docs.atlassian.com/jira/REST/latest/), via the associated spreadsheet, to create a new issue.

The script sends an email to the issue creator, providing the ticket reference, and link to the JIRA system.  There are lots of comments in the code, which should be enough to work from.

Any questions/issues, drop me a message or tweet [@jodygajic](https://twitter.com/jodygajic).

## Caveats
The script was made for an enterprise that uses Google apps; the Google form requires that the user is logged into the company domain (so email address is automatically captured).  Some modifications may be required for your use case!

# More Information
I've blogged about this script, and added some more context and a short how to here:
[Use a Google Form To Create JIRA Issues With The REST API](https://thedataplumber.net/use-a-google-form-to-create-jira-issues-with-the-rest-api-b7fe131de092)
