package com.aifitness.app.data.remote;

import com.aifitness.app.domain.model.WorkoutPlan;
import io.reactivex.rxjava3.core.Single;
import retrofit2.http.POST;
import retrofit2.http.GET;
import retrofit2.http.Query;
import retrofit2.http.Path;
import java.util.List;

public interface WorkoutApi {
    @POST("workouts/generate")
    Single<WorkoutPlan> generatePlan(
            @Query("userId") String userId,
            @Query("goal") String goal,
            @Query("days") int days);

    @GET("workouts/user/{userId}")
    Single<List<WorkoutPlan>> getUserPlans(@Path("userId") String userId);
}
