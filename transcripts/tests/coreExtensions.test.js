const assert = require('assert');
const { testBotWithTranscript } = require('../helpers');

describe(`Core Extensions Tests using transcripts`, function () {
    this.timeout(5000);

    it('UserStateTest', testBotWithTranscript('CoreExtensionsTests/UserStateTest.chat', (conversationState, userState) => TestLogic(userState)));

    it('ConversationStateTest', testBotWithTranscript('CoreExtensionsTests/ConversationStateTest.chat', (conversationState, userState) => TestLogic(conversationState)));
});

function TestLogic(botState) {
    return async (context) => {
        var cmd = getCommand(context);
        const state = botState.get(context);
        switch (cmd.name) {
            case 'delete':
                delete state.value;
                await botState.write(context);
                break;
            case 'set':
                state.value = cmd.value;
                await botState.write(context);
                break;
            case 'read':
                await context.sendActivity(`value:${state.value || ''}`);
                break;
            default:
                await context.sendActivity('bot message')
                break;
        }
    }
}

function getCommand(context) {
    var message = context.activity.text.split(' ');
    if (message.length > 1) {
        return {
            name: message[0],
            value: message[1]
        };
    }

    return {
        name: message[0],
        value: null
    };
}