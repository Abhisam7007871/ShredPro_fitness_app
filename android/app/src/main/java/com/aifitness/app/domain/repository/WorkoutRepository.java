package com.aifitness.app.domain.repository;

import com.aifitness.app.domain.model.WorkoutPlan;
import io.reactivex.rxjava3.core.Single;
import java.util.List;

public interface WorkoutRepository {
    Single<WorkoutPlan> generatePlan(String userId, String goal, int days);

    Single<List<WorkoutPlan>> getUserPlans(String userId);
}
