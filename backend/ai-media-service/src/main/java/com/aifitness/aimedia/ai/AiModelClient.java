package com.aifitness.aimedia.ai;

public interface AiModelClient {

    AiWorkoutRecommendationResponse generateWorkoutPlan(AiWorkoutPromptContext context);
}

