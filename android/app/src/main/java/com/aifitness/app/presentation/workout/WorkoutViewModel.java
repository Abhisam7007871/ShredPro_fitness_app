package com.aifitness.app.presentation.workout;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.aifitness.app.domain.model.WorkoutPlan;
import com.aifitness.app.domain.repository.WorkoutRepository;
import com.aifitness.app.presentation.base.BaseViewModel;
import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import java.util.List;
import javax.inject.Inject;

@HiltViewModel
public class WorkoutViewModel extends BaseViewModel {

    private final WorkoutRepository workoutRepository;
    private final MutableLiveData<WorkoutPlan> generatedPlan = new MutableLiveData<>();
    private final MutableLiveData<List<WorkoutPlan>> userPlans = new MutableLiveData<>();
    private final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);
    private final MutableLiveData<String> error = new MutableLiveData<>();

    @Inject
    public WorkoutViewModel(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    public void generatePlan(String userId, String goal, int days) {
        loading.setValue(true);
        compositeDisposable.add(workoutRepository.generatePlan(userId, goal, days)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        plan -> {
                            loading.setValue(false);
                            generatedPlan.setValue(plan);
                        },
                        throwable -> {
                            loading.setValue(false);
                            error.setValue(throwable.getMessage());
                        }));
    }

    public void fetchUserPlans(String userId) {
        loading.setValue(true);
        compositeDisposable.add(workoutRepository.getUserPlans(userId)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        plans -> {
                            loading.setValue(false);
                            userPlans.setValue(plans);
                        },
                        throwable -> {
                            loading.setValue(false);
                            error.setValue(throwable.getMessage());
                        }));
    }

    public LiveData<WorkoutPlan> getGeneratedPlan() {
        return generatedPlan;
    }

    public LiveData<List<WorkoutPlan>> getUserPlans() {
        return userPlans;
    }

    public LiveData<Boolean> getLoading() {
        return loading;
    }

    public LiveData<String> getError() {
        return error;
    }
}
