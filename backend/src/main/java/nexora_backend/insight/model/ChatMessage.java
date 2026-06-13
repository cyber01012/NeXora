package nexora_backend.insight.model;

public class ChatMessage {
    private String role;      // "user" or "assistant"
    private String content;   // the message text
    private boolean spoken;   // whether user wants TTS output

    public ChatMessage() {}

    public ChatMessage(String role, String content, boolean spoken) {
        this.role = role;
        this.content = content;
        this.spoken = spoken;
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isSpoken() { return spoken; }
    public void setSpoken(boolean spoken) { this.spoken = spoken; }
}