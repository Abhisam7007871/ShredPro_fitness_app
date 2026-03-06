package com.aifitness.app.data.remote;

import com.aifitness.app.domain.model.User;
import io.reactivex.rxjava3.core.Single;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface AuthApi {
    @POST("users/login")
    Single<User> login(@Body LoginRequest request);

    @POST("users/register")
    Single<User> register(@Body RegisterRequest request);
}
