package com.aifitness.app.di;

import com.aifitness.app.data.remote.AuthApi;
import com.aifitness.app.data.remote.WorkoutApi;
import com.aifitness.app.data.repository.AuthRepositoryImpl;
import com.aifitness.app.data.repository.WorkoutRepositoryImpl;
import com.aifitness.app.domain.repository.AuthRepository;
import com.aifitness.app.domain.repository.WorkoutRepository;
import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import retrofit2.Retrofit;
import javax.inject.Singleton;

@Module
@InstallIn(SingletonComponent.class)
public class RepositoryModule {

    @Provides
    @Singleton
    public AuthApi provideAuthApi(Retrofit retrofit) {
        return retrofit.create(AuthApi.class);
    }

    @Provides
    @Singleton
    public AuthRepository provideAuthRepository(AuthApi authApi) {
        return new AuthRepositoryImpl(authApi);
    }

    @Provides
    @Singleton
    public WorkoutApi provideWorkoutApi(Retrofit retrofit) {
        return retrofit.create(WorkoutApi.class);
    }

    @Provides
    @Singleton
    public WorkoutRepository provideWorkoutRepository(WorkoutApi workoutApi) {
        return new WorkoutRepositoryImpl(workoutApi);
    }
}
