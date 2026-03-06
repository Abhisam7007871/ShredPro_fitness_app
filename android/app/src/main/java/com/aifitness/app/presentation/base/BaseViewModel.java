package com.aifitness.app.presentation.base;

import androidx.lifecycle.ViewModel;
import io.reactivex.rxjava3.disposables.CompositeDisposable;

public abstract class BaseViewModel extends ViewModel {
    protected final CompositeDisposable compositeDisposable = new CompositeDisposable();

    @Override
    protected void onCleared() {
        super.onCleared();
        compositeDisposable.clear();
    }
}
