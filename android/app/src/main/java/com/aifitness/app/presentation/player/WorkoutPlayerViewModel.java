package com.aifitness.app.presentation.player;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.aifitness.app.domain.model.ScheduledExercise;
import com.aifitness.app.presentation.base.BaseViewModel;
import dagger.hilt.android.lifecycle.HiltViewModel;
import java.util.List;
import javax.inject.Inject;

@HiltViewModel
public class WorkoutPlayerViewModel extends BaseViewModel {

    private final MutableLiveData<ScheduledExercise> currentExercise = new MutableLiveData<>();
    private final MutableLiveData<Integer> currentExerciseIndex = new MutableLiveData<>(0);
    private final MutableLiveData<Boolean> isWorkoutComplete = new MutableLiveData<>(false);
    private List<ScheduledExercise> workoutQueue;

    @Inject
    public WorkoutPlayerViewModel() {
    }

    public void initializeWorkout(List<ScheduledExercise> exercises) {
        this.workoutQueue = exercises;
        if (exercises != null && !exercises.isEmpty()) {
            currentExercise.setValue(exercises.get(0));
            currentExerciseIndex.setValue(0);
        }
    }

    public void nextExercise() {
        if (workoutQueue == null)
            return;

        int nextIndex = currentExerciseIndex.getValue() + 1;
        if (nextIndex < workoutQueue.size()) {
            currentExerciseIndex.setValue(nextIndex);
            currentExercise.setValue(workoutQueue.get(nextIndex));
        } else {
            isWorkoutComplete.setValue(true);
        }
    }

    public void previousExercise() {
        if (workoutQueue == null)
            return;

        int prevIndex = currentExerciseIndex.getValue() - 1;
        if (prevIndex >= 0) {
            currentExerciseIndex.setValue(prevIndex);
            currentExercise.setValue(workoutQueue.get(prevIndex));
        }
    }

    public LiveData<ScheduledExercise> getCurrentExercise() {
        return currentExercise;
    }

    public LiveData<Boolean> getIsWorkoutComplete() {
        return isWorkoutComplete;
    }
}
