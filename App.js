import React from "react";
import {
  StyleSheet,
  Linking ,
  Button,
  View,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { DirectLine } from "botframework-directlinejs";
import env from "./env";

const directLine = new DirectLine({
  secret: env.DIRECT_LINE_SECRET
});

const botMessageToGiftedMessage = botMessage => ({
  ...botMessage,
  _id: botMessage.id,
  createdAt: botMessage.timestamp,
  user: {
    _id: 2,
    name: "React Native",
    avatar:
      "https://cdn.iconscout.com/public/images/icon/free/png-512/avatar-user-business-man-399587fe24739d5a-512x512.png"
  }
});

function giftedMessageToBotMessage(message) {
  return {
    from: { id: 1, name: "Chandima Ranaweera" },
    type: "message",
    text: message.text
  };
}

export default class App extends React.Component {
  state = {
    messages: []
  };

  constructor(props) {
    super(props);
    directLine.activity$.subscribe(botMessage => {
      const newMessage = botMessageToGiftedMessage(botMessage);
      this.setState({ messages: [newMessage, ...this.state.messages] });
    });
  }

  onSend = messages => {
    this.setState({ messages: [...messages, ...this.state.messages] });
    messages.forEach(message => {
      directLine
        .postActivity(giftedMessageToBotMessage(message))
        .subscribe(() => console.log("success"), () => console.log("failed"));
    });
  };

  render() {
    return (
      <View style={styles.container}>
      <Button
      title="Open Skype"
      onPress={() => {
        let url = 'https://join.skype.com/bot/30761d30-be33-4541-8b7d-d9a2c106abf9'
        Linking.canOpenURL(url).then(supported=> {
        if (!supported) {
          console.log('Can\'t handle url: ' + url);
        } else {
          return Linking.openURL(url);
        }
        }).catch(err => console.error('An error occurred', err));
      }}/>
        <GiftedChat
          user={{
            _id: 1
          }}
          messages={this.state.messages}
          onSend={this.onSend}
        />
        {Platform.OS !== "ios" && (
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={80}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});