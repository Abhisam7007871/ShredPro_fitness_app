package com.aifitness.dietservice.service;

import com.aifitness.dietservice.dto.UserDTO;
import com.aifitness.dietservice.model.DietPlan;
import com.aifitness.dietservice.repository.DietPlanRepository;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class DietService {

    private final DietPlanRepository dietPlanRepository;
    private final com.aifitness.dietservice.repository.DailyMacroLogRepository dailyLogRepository;
    private final RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://localhost:8081/api/v1/users/id/";

    @Autowired
    public DietService(DietPlanRepository dietPlanRepository,
                       com.aifitness.dietservice.repository.DailyMacroLogRepository dailyLogRepository) {
        this.dietPlanRepository = dietPlanRepository;
        this.dailyLogRepository = dailyLogRepository;
        this.restTemplate = new RestTemplate();
    }

    public DietPlan generateDietPlan(UUID userId, String goal) {
        UserDTO user;
        try {
            user = restTemplate.getForObject(USER_SERVICE_URL + userId.toString(), UserDTO.class);
            if (user == null) user = new UserDTO();
        } catch (Exception e) {
            user = new UserDTO();
        }
        
        String aiDietAdvice = callGpt52Api(user, goal);
        
        // 1. Calculate BMR (Mifflin-St Jeor) - safe defaults when user has not filled biometrics
        double weight = user.getCurrentWeight() != null ? user.getCurrentWeight() : 75.0;
        double height = user.getHeight() != null ? user.getHeight() : 175.0;
        int age = user.getAge() != null ? user.getAge() : 30;
        String gender = user.getGender() != null ? user.getGender() : "MALE";
        double bmr;
        if ("MALE".equalsIgnoreCase(gender)) {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        String activityLevel = user.getActivityLevel() != null ? user.getActivityLevel() : "SEDENTARY";
        double multiplier = switch (activityLevel) {
            case "SEDENTARY" -> 1.2;
            case "LIGHTLY_ACTIVE" -> 1.375;
            case "MODERATELY_ACTIVE" -> 1.55;
            case "VERY_ACTIVE" -> 1.725;
            case "SUPER_ACTIVE" -> 1.9;
            default -> 1.2;
        };
        double tdee = bmr * multiplier;

        int targetCalories = (int) tdee;
        if ("WEIGHT_LOSS".equalsIgnoreCase(goal)) {
            targetCalories -= 500;
        } else if ("MUSCLE_GAIN".equalsIgnoreCase(goal)) {
            targetCalories += 300;
        }

        DietPlan plan = new DietPlan();
        plan.setUserId(userId);
        plan.setGoal(goal);
        plan.setDailyCalorieTarget(targetCalories);
        plan.setAiAdvice(aiDietAdvice); // We should add this field to DietPlan
        
        return dietPlanRepository.save(plan);
    }

    private String callGpt52Api(UserDTO user, String goal) {
        String apiKey = System.getenv("EMERGENT_LLM_KEY");
        if (apiKey == null) apiKey = "sk-emergent-7Be775251E2B6774c7";

        OkHttpClient client = new OkHttpClient();
        
        String prompt = String.format(
            "Create a personalized meal plan for a %d-year-old %s (Weight: %.1fkg, Height: %.1fcm). " +
            "Goal: %s. Diet Preference: %s. Region/Localization: %s. " +
            "IMPORTANT ALGORITHM INSTRUCTIONS: If Region is 'IN' (India), you MUST provide localized Indian foods (like Paneer, Dal, Roti, Dosa). " +
            "If Diet Preference is 'VEG' or 'VEGAN', absolutely NO meat. " +
            "In your JSON response, for EVERY food item, you MUST include a 'type' tag which can ONLY be one of: 'VEG', 'NON_VEG', or 'VEGAN'.",
            user.getAge() != null ? user.getAge() : 30, 
            user.getGender() != null ? user.getGender() : "MALE", 
            user.getCurrentWeight() != null ? user.getCurrentWeight() : 75.0, 
            user.getHeight() != null ? user.getHeight() : 175.0, 
            user.getGoal() != null ? user.getGoal() : goal,
            user.getDietPreference() != null ? user.getDietPreference() : "NON_VEG",
            user.getCountry() != null ? user.getCountry() : "US"
        );

        String jsonPayload = String.format(
            "{\"messages\": [{\"role\": \"system\", \"content\": \"You are a world-class nutritionist.\"}, {\"role\": \"user\", \"content\": \"%s\"}], \"model\": \"gpt-5.2\"}",
            prompt.replace("\"", "\\\"")
        );

        RequestBody body = RequestBody.create(
            jsonPayload,
            MediaType.get("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
            .url("https://api.emergent.ai/v1/chat/completions")
            .addHeader("Authorization", "Bearer " + apiKey)
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) return "Error generating diet advice: " + response.message();
            return response.body().string();
        } catch (IOException e) {
            return "Connection error: " + e.getMessage();
        }
    }
    
    public List<DietPlan> getUserDietPlans(UUID userId) {
        return dietPlanRepository.findByUserId(userId);
    }

    public com.aifitness.dietservice.model.DailyMacroLog logMacros(UUID userId, com.aifitness.dietservice.model.DailyMacroLog log) {
        java.time.LocalDate today = java.time.LocalDate.now();
        com.aifitness.dietservice.model.DailyMacroLog existing = dailyLogRepository.findByUserIdAndDate(userId, today)
                .orElse(new com.aifitness.dietservice.model.DailyMacroLog());
        
        if (existing.getId() == null) {
            existing.setUserId(userId);
            existing.setDate(today);
        }

        existing.setCalories(existing.getCalories() + log.getCalories());
        existing.setProtein(existing.getProtein() + log.getProtein());
        existing.setCarbs(existing.getCarbs() + log.getCarbs());
        existing.setFat(existing.getFat() + log.getFat());
        existing.setFiber(existing.getFiber() + log.getFiber());

        return dailyLogRepository.save(existing);
    }

    public com.aifitness.dietservice.model.DailyMacroLog getDailyLog(UUID userId, String date) {
        java.time.LocalDate targetDate = date != null ? java.time.LocalDate.parse(date) : java.time.LocalDate.now();
        return dailyLogRepository.findByUserIdAndDate(userId, targetDate)
                .orElse(new com.aifitness.dietservice.model.DailyMacroLog());
    }
}
