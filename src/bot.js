'use strict';

module.exports.setup = function(app) {
    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var config = require('config');
    var botConfig = config.get('bot');

    // Create a connector to handle the conversations
    var connector = new teams.TeamsChatConnector({
        // It is a bad idea to store secrets in config files. We try to read the settings from
        // the environment variables first, and fallback to the config file.
        // See node config module on how to create config files correctly per NODE environment
        appId: process.env.MICROSOFT_APP_ID || botConfig.microsoftAppId,
        appPassword: process.env.MICROSOFT_APP_PASSWORD || botConfig.microsoftAppPassword
    });

    // Simple AIP QnA Bot
    var bot = new builder.UniversalBot(connector, function(session) {
        // Message might contain @mentions which we would like to strip off in the response
        var text = teams.TeamsMessage.getTextWithoutMentions(session.message).toLowerCase();
        if (text.includes("hi") || text.includes("hello") || text.includes("hey")){
          session.send("Hey there! Ask me anything.")
        }
        else if (text.includes("azure information protection")) {
          session.send("Azure Information Protection (sometimes referred to as AIP) is a cloud-based solution that helps an organization to classify, label, and protect its documents and emails")
        }
        else if (text.includes("label")) {
          session.send("A label is a way for you to protect your documents at Contoso. The software may recommend a label to you based on the content in your document or email. You can also choose your own.")
        }
        else if (text.includes("label") && text.includes("contoso")){
          session.send("The default labels at Contoso are: Public, General, Confidential and Highly Confidential")
        }
        else if (text.includes("public")) {
          session.send("Business data that is specifically prepared and approved for public, external consumption.")
        }
        else if (text.includes("confidential")) {
          session.send("Sensitive business data that could cause damage to the business if shared with unauthorized people. Examples include bank account numbers, addresses, IP addresses, and sales account data.")
        }
        else if (text.includes("thank")) {
          session.send("Anytime. :)")
        }
        else if (text.includes("bye")) {
          session.send("Goodbye!")
        }
        else {
          session.send("Learn more about Azure Information Protection at https://azure.microsoft.com/en-us/services/information-protection/!")
        }
    });

    // Setup an endpoint on the router for the bot to listen.
    // NOTE: This endpoint cannot be changed and must be api/messages
    app.post('/api/messages', connector.listen());

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};
