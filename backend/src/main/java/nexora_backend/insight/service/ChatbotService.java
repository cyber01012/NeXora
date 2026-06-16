package nexora_backend.insight.service;

import nexora_backend.insight.model.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    @Value("${gemini.api.key.primary}")
    private String primaryKey;

    @Value("${gemini.api.key.secondary}")
    private String secondaryKey;

    @Value("${gemini.api.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String chat(List<ChatMessage> history, String userMessage) {
        String prompt = buildKarachiPrompt(history, userMessage);
        String response = callGemini(prompt, primaryKey);
        if (response == null)
            response = callGemini(prompt, secondaryKey);
        return response != null ? response.trim() : "Sorry, I'm having trouble connecting. Please try again.";
    }

    private String buildKarachiPrompt(List<ChatMessage> history, String userMessage) {
        StringBuilder sb = new StringBuilder();

        // System instruction
        sb.append("You are NeXora Civic Advisor — an AI assistant for Karachi, Pakistan citizens. ");
        sb.append("NeXora's dedicated support line for this project is 311. ");
        sb.append("You are an advisor only and cannot create reports or contact authorities directly. ");
        sb.append("Citizens can submit civic complaints through the NeXora Citizen Portal, while urgent situations can be reported through the NeXora helpline (311).\n\n");

        sb.append("YOUR EXPERTISE:\n");
        sb.append("- Disaster preparedness (floods, heatwaves, earthquakes, fires)\n");
        sb.append("- Civic issues (water shortage, garbage, traffic, power outages, gas supply)\n");
        sb.append("- Safety tips and prevention measures\n");
        sb.append("- Emergency procedures and helplines\n");
        sb.append("- Weather-related precautions\n\n");

        sb.append("RULES:\n");
        sb.append("1. ONLY answer questions about Karachi, Pakistan civic life and disasters.\n");
        sb.append("2. If asked about other cities/countries, politely redirect to Karachi context.\n");
        sb.append("3. Accept input in Roman Urdu, English, or mix of both.\n");
        sb.append("4. Reply in the SAME LANGUAGE the user used (Roman Urdu → Roman Urdu, English → English).\n");
        sb.append("5. Be practical, actionable, and concise (2-4 sentences max).\n");
        sb.append("6. Include emergency numbers when relevant: Police 15, Rescue 1122, Fire 16.\n");
        sb.append("7. NEVER give medical advice. Suggest seeing a doctor instead.\n");
        sb.append("8. You are an advisor only. Do not claim to create reports, dispatch help, or contact authorities.\n");
        sb.append("9. For civic complaints, suggest using the NeXora Citizen Portal.\n");
        sb.append("10. For urgent or critical situations, advise contacting the NeXora helpline at 311. Helpline staff can guide citizens and register reports when needed.\n\n");

        // Conversation history
        if (history != null && !history.isEmpty()) {
            sb.append("CONVERSATION HISTORY:\n");
            for (ChatMessage msg : history) {
                sb.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
            }
            sb.append("\n");
        }

        sb.append("USER: ").append(userMessage).append("\n");
        sb.append("ASSISTANT:");

        return sb.toString();
    }

    private String callGemini(String prompt, String apiKey) {
        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model + ":generateContent?key=" + apiKey;

            Map<String, Object> request = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", new Object[] { part });
            request.put("contents", new Object[] { content });

            // Safety settings to allow civic/emergency content
            List<Map<String, Object>> safetySettings = new ArrayList<>();
            Map<String, Object> safety = new HashMap<>();
            safety.put("category", "HARM_CATEGORY_DANGEROUS_CONTENT");
            safety.put("threshold", "BLOCK_ONLY_HIGH");
            safetySettings.add(safety);
            request.put("safetySettings", safetySettings);

            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            Map<String, Object> candidate = ((List<Map<String, Object>>) response.get("candidates")).get(0);
            Map<String, Object> responseContent = (Map<String, Object>) candidate.get("content");
            Map<String, Object> responsePart = ((List<Map<String, Object>>) responseContent.get("parts")).get(0);

            return (String) responsePart.get("text");

        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}