package com.aifitness.app.presentation.login;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.aifitness.app.domain.model.User;
import com.aifitness.app.domain.repository.AuthRepository;
import com.aifitness.app.presentation.base.BaseViewModel;
import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;
import javax.inject.Inject;

@HiltViewModel
public class LoginViewModel extends BaseViewModel {

    private final AuthRepository authRepository;
    private final MutableLiveData<User> user = new MutableLiveData<>();
    private final MutableLiveData<String> error = new MutableLiveData<>();
    private final MutableLiveData<Boolean> loading = new MutableLiveData<>(false);

    @Inject
    public LoginViewModel(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    public void login(String email, String password) {
        loading.setValue(true);
        compositeDisposable.add(authRepository.login(email, password)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(
                        result -> {
                            loading.setValue(false);
                            user.setValue(result);
                        },
                        throwable -> {
                            loading.setValue(false);
                            error.setValue(throwable.getMessage());
                        }));
    }

    public LiveData<User> getUser() {
        return user;
    }

    public LiveData<String> getError() {
        return error;
    }

    public LiveData<Boolean> getLoading() {
        return loading;
    }
}
