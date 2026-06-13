package nexora_backend.insight.model;

import java.util.List;

public class ChatRequest {
    private List<ChatMessage> messages;  // conversation history
    private boolean speakResponse;       // user wants voice output

    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }

    public boolean isSpeakResponse() { return speakResponse; }
    public void setSpeakResponse(boolean speakResponse) { this.speakResponse = speakResponse; }
}