package com.aifitness.app.presentation.player;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.media3.common.MediaItem;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;
import com.aifitness.app.R;
import com.aifitness.app.domain.model.ScheduledExercise;
import dagger.hilt.android.AndroidEntryPoint;
import java.util.ArrayList;

@AndroidEntryPoint
public class WorkoutPlayerActivity extends AppCompatActivity {

    private WorkoutPlayerViewModel viewModel;
    private ExoPlayer exoPlayer;
    private PlayerView playerView;
    private TextView tvExerciseName;
    private TextView tvReps;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_workout_player);

        viewModel = new ViewModelProvider(this).get(WorkoutPlayerViewModel.class);

        playerView = findViewById(R.id.playerView);
        tvExerciseName = findViewById(R.id.tvExerciseName);
        tvReps = findViewById(R.id.tvReps);
        Button btnNext = findViewById(R.id.btnNext);
        Button btnPrev = findViewById(R.id.btnPrev);

        // Initialize ExoPlayer
        exoPlayer = new ExoPlayer.Builder(this).build();
        playerView.setPlayer(exoPlayer);

        // Mock Data (In real app, pass via Intent)
        ArrayList<ScheduledExercise> mockExercises = new ArrayList<>();
        mockExercises.add(new ScheduledExercise("Push Ups", 3, "10-12"));
        mockExercises.add(new ScheduledExercise("Squats", 4, "15"));
        mockExercises.add(new ScheduledExercise("Plank", 3, "60s"));

        viewModel.initializeWorkout(mockExercises);

        viewModel.getCurrentExercise().observe(this, this::updateUI);

        viewModel.getIsWorkoutComplete().observe(this, isComplete -> {
            if (isComplete) {
                Toast.makeText(this, "Workout Complete!", Toast.LENGTH_LONG).show();
                finish();
            }
        });

        btnNext.setOnClickListener(v -> viewModel.nextExercise());
        btnPrev.setOnClickListener(v -> viewModel.previousExercise());
    }

    private void updateUI(ScheduledExercise exercise) {
        if (exercise == null)
            return;
        tvExerciseName.setText(exercise.getExerciseName());
        tvReps.setText(exercise.getSets() + " Sets x " + exercise.getReps());

        // Placeholder video logic
        // MediaItem mediaItem =
        // MediaItem.fromUri("https://storage.googleapis.com/exoplayer-test-media-0/BigBuckBunny_320x180.mp4");
        // exoPlayer.setMediaItem(mediaItem);
        // exoPlayer.prepare();
        // exoPlayer.play();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (exoPlayer != null) {
            exoPlayer.release();
        }
    }
}
