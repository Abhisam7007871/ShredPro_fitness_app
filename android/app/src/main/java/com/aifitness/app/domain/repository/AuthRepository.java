package com.aifitness.app.domain.repository;

import com.aifitness.app.domain.model.User;
import io.reactivex.rxjava3.core.Single;

public interface AuthRepository {
    Single<User> login(String email, String password);

    Single<User> register(String email, String password, String fullName);
}
