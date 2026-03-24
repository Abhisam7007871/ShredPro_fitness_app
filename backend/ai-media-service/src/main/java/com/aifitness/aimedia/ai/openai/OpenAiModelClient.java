package com.aifitness.aimedia.ai.openai;

import com.aifitness.aimedia.ai.AiModelClient;
import com.aifitness.aimedia.ai.AiWorkoutPromptContext;
import com.aifitness.aimedia.ai.AiWorkoutRecommendationResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Component
public class OpenAiModelClient implements AiModelClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public OpenAiModelClient(
        WebClient.Builder webClientBuilder,
        ObjectMapper objectMapper,
        @Value("${ai.openai.api-key}") String apiKey,
        @Value("${ai.openai.model:gpt-4.5-mini}") String model
    ) {
        this.webClient = webClientBuilder
            .baseUrl("https://api.openai.com/v1")
            .build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Override
    public AiWorkoutRecommendationResponse generateWorkoutPlan(AiWorkoutPromptContext context) {
        String systemPrompt = buildSystemPrompt();
        String userPrompt = buildUserPrompt(context);

        Map<String, Object> requestBody = Map.of(
            "model", model,
            "temperature", 0.4,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
            )
        );

        String content;
        try {
            JsonNode response = webClient
                .post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    String message = "OpenAI API error: " + ex.getStatusCode();
                    return Mono.error(new RuntimeException(message, ex));
                })
                .block();

            if (response == null) {
                throw new RuntimeException("Empty response from OpenAI");
            }

            JsonNode choices = response.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("No choices returned from OpenAI");
            }

            content = choices.get(0).path("message").path("content").asText();
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to call OpenAI API", e);
        }

        AiWorkoutRecommendationResponse.Plan plan;
        try {
            JsonNode root = objectMapper.readTree(content);
            JsonNode planNode = root.path("plan").isMissingNode() ? root : root.path("plan");
            plan = objectMapper.treeToValue(planNode, AiWorkoutRecommendationResponse.Plan.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse OpenAI workout plan JSON", e);
        }

        AiWorkoutRecommendationResponse.ModelMetadata metadata =
            new AiWorkoutRecommendationResponse.ModelMetadata(
                model,
                Instant.now().toString(),
                0.4
            );

        return new AiWorkoutRecommendationResponse(plan, metadata);
    }

    private String buildSystemPrompt() {
        return """
            You are an elite strength and conditioning coach.
            You design safe, effective, periodized resistance-training programs for a wide range of athletes.
            Always respond with JSON only, no prose, no comments.
            JSON must conform to the schema:
            {
              "plan": {
                "name": string,
                "durationWeeks": number,
                "daysPerWeek": number,
                "weeks": [
                  {
                    "weekNumber": number,
                    "days": [
                      {
                        "dayNumber": number,
                        "label": string,
                        "exercises": [
                          {
                            "exerciseId": string,
                            "sets": number,
                            "reps": string,
                            "rpe": number | null,
                            "notes": string | null
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
            """;
    }

    private String buildUserPrompt(AiWorkoutPromptContext ctx) {
        StringBuilder sb = new StringBuilder();
        sb.append("Generate a periodized strength training plan for the following athlete.\\n");
        sb.append("User ID: ").append(ctx.userId()).append("\\n\\n");

        AiWorkoutPromptContext.Profile p = ctx.profile();
        sb.append("Profile: ");
        sb.append("age=").append(p.age()).append(", ");
        sb.append("sex=").append(p.sex()).append(", ");
        sb.append("heightCm=").append(p.heightCm()).append(", ");
        sb.append("weightKg=").append(p.weightKg()).append(", ");
        sb.append("trainingAgeYears=").append(p.trainingAgeYears()).append(", ");
        sb.append("experienceLevel=").append(p.experienceLevel()).append("\\n\\n");

        AiWorkoutPromptContext.Goals g = ctx.goals();
        sb.append("Goals: primary=").append(g.primary())
            .append(", secondary=").append(g.secondary()).append("\\n\\n");

        AiWorkoutPromptContext.Preferences pref = ctx.preferences();
        sb.append("Preferences: daysPerWeek=").append(pref.daysPerWeek())
            .append(", sessionLengthMinutes=").append(pref.sessionLengthMinutes())
            .append(", availableEquipment=").append(pref.availableEquipment())
            .append(", preferredSplit=").append(pref.preferredSplit())
            .append("\\n\\n");

        AiWorkoutPromptContext.Constraints c = ctx.constraints();
        sb.append("Constraints: injuriesOrConstraints=").append(c.injuriesOrConstraints())
            .append("\\n\\n");

        AiWorkoutPromptContext.HistorySummary h = ctx.historySummary();
        sb.append("HistorySummary: recentWorkoutsPerWeek=").append(h.recentWorkoutsPerWeek())
            .append(", avgRpe=").append(h.avgRpe())
            .append(", known1RM=").append(h.known1Rm())
            .append("\\n\\n");

        sb.append("Respect all constraints and equipment limits. ");
        sb.append("Return JSON only, conforming exactly to the schema in the system prompt. ");
        sb.append("Do not include any explanations or markdown.");

        return sb.toString();
    }
}

