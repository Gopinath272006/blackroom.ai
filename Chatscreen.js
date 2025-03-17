import React, { useState, useEffect } from "react";
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator, Image
} from "react-native";
import * as Clipboard from "expo-clipboard"; // Import Clipboard API
import * as ImagePicker from "expo-image-picker";

import { chatWithAI, generateImage } from "./api";  

export default function ChatScreen() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); // Store conversation history
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(""); // Loading animation
  const [currentResponse, setCurrentResponse] = useState(""); // Typing effect

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingText(prev => (prev === "..." ? "" : prev + "."));
      }, 500);
    } else {
      setLoadingText("");
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Function to copy AI response to clipboard
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  
  };

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const userImage = { image: result.assets[0].uri, sender: "user" };
      setMessages(prevMessages => [...prevMessages, userImage]); // Add user image message

      setLoading(true);
      try {
        const aiImageUrl = await generateImage(result.assets[0].uri);
        setMessages(prevMessages => [...prevMessages, { image: aiImageUrl, sender: "ai" }]);
      } catch (error) {
        console.error("Error fetching AI image:", error);
        setMessages(prevMessages => [...prevMessages, { text: "Error generating image.", sender: "ai" }]);
      }
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    const userMessage = { text: prompt, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]); // Add user message

    setPrompt("");
    setCurrentResponse("");

    try {
      const aiResponse = await chatWithAI(prompt);
      const safeAiResponse = aiResponse && typeof aiResponse === "string" ? aiResponse : "I couldn't process that.";

      let i = 0;
      const interval = setInterval(() => {
        setCurrentResponse(safeAiResponse.substring(0, i));
        i++;
        if (i > safeAiResponse.length) {
          clearInterval(interval);
          setMessages(prevMessages => [...prevMessages, { text: safeAiResponse, sender: "ai" }]);
          setCurrentResponse("");
        }
      }, 30);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prevMessages => [...prevMessages, { text: "Error fetching response. Try again.", sender: "ai" }]);
    }

    setLoading(false);
  };

  const newChat = () => {
    setMessages([]);
    setPrompt("");
    setCurrentResponse("");
  };

  return (
    <View style={styles.container}>
      <View>
        <Image style={{ width: 80, height: 55, marginLeft: 140 }} source={require("./assets/xeroai.png")} />
        <TouchableOpacity 
          style={styles.newChatButton} 
          onPress={newChat}
        >
          <Text style={styles.newChatText}>+ New Chat</Text>
        </TouchableOpacity>
      </View>
      <View>
      {messages.length === 0 && (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Let's Start Learners!</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.optionButton}>
              <Image source={require("./assets/gallery-icon.png")} style={styles.icon} />
              <Text style={styles.buttonText}>Create Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Image source={require("./assets/textsummarize.png")} style={styles.icon_1} />
              <Text style={styles.buttonText}>Summarize Text</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Image source={require("./assets/analyze.png")} style={styles.icon_1} />
              <Text style={styles.buttonText}>Analyze Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.buttonText}>More...</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      </View>

      <ScrollView 
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View 
            key={index} 
            style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.aiBubble]}
          >
            {msg.text && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.messageText, msg.sender === "ai" && styles.aiText]}>{msg.text}</Text>
               
              </View>
            )}
            {msg.image && <Image source={{ uri: msg.image }} style={styles.messageImage} />}
          </View>
        ))}

        {loading && (
          <View style={styles.aiBubble}>
            <Text style={styles.messageText}>Thinking...{loadingText}</Text>
          </View>
        )}

        {currentResponse && (
          <View style={styles.aiBubble}>
            <Text style={[styles.messageText, styles.aiText]}>{currentResponse}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          placeholderTextColor="#aaa"
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity 
          style={[styles.sendButton, loading && styles.disabledButton]} 
          onPress={sendMessage} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Image style={{ width: 20, height: 20 }} source={require("./assets/sendimage.png")} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={pickImage} 
        >
          <Image style={{ width: 24, height: 24 }} source={require("./assets/sendimage.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1E1E1E", width: "100%", height: "100%" },
  chatContainer: { flex: 1, width: "100%", paddingBottom: 20 },

  messageBubble: { 
    maxWidth: "80%", padding: 12, marginVertical: 5, borderRadius: 15, shadowColor: "#000", 
    shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 
  },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#333", },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#333", },

  messageText: { color: "#FFFAFA", fontSize: 16, lineHeight: 22 },
  aiText: { fontFamily: "poppins-regular", fontSize: 15, color: "#FFFAFA" }, // AI-style text
  
  messageImage: { width: 200, height: 200, borderRadius: 10, marginTop: 5 },

  inputContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  input: { 
    flex: 1, borderWidth: 1, borderRadius: 25, borderColor: "#696969", color: "white",
    paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, backgroundColor: "#333"
  },
  sendButton: { backgroundColor: "#555", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25 },
  imageButton: { backgroundColor: "#444", padding: 12, borderRadius: 25, marginLeft: 5 },
  disabledButton: { backgroundColor: "#555" },
  newChatButton: { position: "absolute", top: 10, right: -5, backgroundColor: "#444", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15 },
  newChatText: { color: "white", fontSize: 14, fontWeight: "bold" },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop:200,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 5,
    width: "90%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 45,
    height: 30,
    marginRight: 10,
  },
  icon_1: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },

});
