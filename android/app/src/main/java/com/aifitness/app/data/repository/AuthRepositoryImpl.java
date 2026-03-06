package com.aifitness.app.data.repository;

import com.aifitness.app.data.remote.AuthApi;
import com.aifitness.app.data.remote.LoginRequest;
import com.aifitness.app.data.remote.RegisterRequest;
import com.aifitness.app.domain.model.User;
import com.aifitness.app.domain.repository.AuthRepository;
import io.reactivex.rxjava3.core.Single;
import javax.inject.Inject;

public class AuthRepositoryImpl implements AuthRepository {

    private final AuthApi authApi;

    @Inject
    public AuthRepositoryImpl(AuthApi authApi) {
        this.authApi = authApi;
    }

    @Override
    public Single<User> login(String email, String password) {
        return authApi.login(new LoginRequest(email, password));
    }

    @Override
    public Single<User> register(String email, String password, String fullName) {
        return authApi.register(new RegisterRequest(email, password, fullName));
    }
}
