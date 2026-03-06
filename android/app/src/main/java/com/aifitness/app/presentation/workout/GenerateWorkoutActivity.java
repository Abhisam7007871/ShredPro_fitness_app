package com.aifitness.app.presentation.workout;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.aifitness.app.R;
import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class GenerateWorkoutActivity extends AppCompatActivity {

    private WorkoutViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_generate_workout);

        viewModel = new ViewModelProvider(this).get(WorkoutViewModel.class);

        Spinner spGoal = findViewById(R.id.spGoal);
        EditText etDays = findViewById(R.id.etDays);
        Button btnGenerate = findViewById(R.id.btnGenerate);

        // Setup Goals Spinner
        String[] goals = { "HYPERTROPHY", "FAT_LOSS", "STRENGTH", "ENDURANCE" };
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, goals);
        spGoal.setAdapter(adapter);

        btnGenerate.setOnClickListener(v -> {
            String goal = spGoal.getSelectedItem().toString();
            String daysStr = etDays.getText().toString();

            if (daysStr.isEmpty()) {
                etDays.setError("Required");
                return;
            }

            int days = Integer.parseInt(daysStr);
            // TODO: Get actual User ID from Session/Prefs
            String dummyUserId = "user-123";

            viewModel.generatePlan(dummyUserId, goal, days);
        });

        viewModel.getGeneratedPlan().observe(this, plan -> {
            if (plan != null) {
                Toast.makeText(this, "Plan Generated: " + plan.getName(), Toast.LENGTH_LONG).show();
                finish(); // Go back to dashboard
            }
        });

        viewModel.getError().observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, "Error: " + error, Toast.LENGTH_SHORT).show();
            }
        });
    }
}
