package com.aifitness.app.data.repository;

import com.aifitness.app.data.remote.WorkoutApi;
import com.aifitness.app.domain.model.WorkoutPlan;
import com.aifitness.app.domain.repository.WorkoutRepository;
import io.reactivex.rxjava3.core.Single;
import java.util.List;
import javax.inject.Inject;

public class WorkoutRepositoryImpl implements WorkoutRepository {

    private final WorkoutApi workoutApi;

    @Inject
    public WorkoutRepositoryImpl(WorkoutApi workoutApi) {
        this.workoutApi = workoutApi;
    }

    @Override
    public Single<WorkoutPlan> generatePlan(String userId, String goal, int days) {
        return workoutApi.generatePlan(userId, goal, days);
    }

    @Override
    public Single<List<WorkoutPlan>> getUserPlans(String userId) {
        return workoutApi.getUserPlans(userId);
    }
}
