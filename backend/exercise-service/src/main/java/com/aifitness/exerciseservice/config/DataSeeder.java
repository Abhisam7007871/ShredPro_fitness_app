package com.aifitness.exerciseservice.config;

import com.aifitness.exerciseservice.model.Exercise;
import com.aifitness.exerciseservice.repository.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initShredDatabase(ExerciseRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            List<Exercise> exercises = Arrays.asList(
                create("Ab Wheel Rollout", "Strength", "Intermediate", "TIME", 45, 
                       Arrays.asList("Abdominals", "Core", "Lower Back"), "Ab Wheel", "Ab Wheel", "Ab Wheel",
                       "A core exercise where you roll forward on a wheel to extend your torso."),

                create("Arnold Press", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Shoulders", "Triceps"), "Dumbbells", "Dumbbells", "Dumbbell",
                       "A variation of the shoulder press with a rotating wrist movement named after Arnold Schwarzenegger."),

                create("Bench Press", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Chest", "Triceps", "Shoulders"), "None", "Barbell & Bench", "Barbell",
                       "A fundamental compound lift for development of the upper body."),

                create("Bulgarian Split Squat", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes", "Legs"), "Chair/Bench", "Bench & Dumbbells", "Bench",
                       "A single-leg squat with the rear foot elevated on a bench."),

                create("Burpees", "HIIT", "Advanced", "TIME", 60, 
                       Arrays.asList("Full Body", "Cardio"), "None", "None", "None",
                       "A full body exercise used in strength training and as an aerobic exercise."),

                create("Cable Crunch", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Abdominals", "Core"), "Resistance Band", "Cable Machine", "Cable",
                       "A core exercise performed on a cable machine while kneeling."),

                create("Chest Fly", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Chest"), "Water Bottles", "Dumbbells/Machine", "Dumbbell",
                       "An isolation exercise that targets the chest muscles."),

                create("Cycling", "Cardio", "Intermediate", "TIME", 1800, 
                       Arrays.asList("Legs", "Cardio"), "Bicycle", "Stationary Bike", "None",
                       "An aerobic exercise involving pedaling a bicycle."),

                create("Deadlift", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Hamstrings", "Lower Back", "Glutes", "Traps"), "Water Jugs", "Barbell", "Barbell",
                       "A fundamental compound lift where you lift a loaded barbell off the ground."),

                create("Dips", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Triceps", "Chest", "Shoulders"), "Chair", "Parallel Bars", "Bars",
                       "A bodyweight exercise that targets the triceps and chest."),

                create("Elliptical", "Cardio", "Beginner", "TIME", 1200, 
                       Arrays.asList("Full Body", "Cardio"), "None", "Elliptical Machine", "Machine",
                       "A low-impact cardio exercise using an elliptical trainer."),

                create("Ez-Bar Curl", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Biceps"), "Water Bottles", "Ez-Bar", "Barbell",
                       "A bicep curl variant using a curved bar to reduce wrist strain."),

                create("Farmer Walk", "Strength", "Beginner", "TIME", 60, 
                       Arrays.asList("Forearms", "Core", "Full Body"), "Grocery Bags", "Heavy Dumbbells", "Dumbbell",
                       "Walking while holding heavy weights in each hand to improve grip and core strength."),

                create("Front Squat", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Quads", "Core", "Legs"), "Backpack", "Barbell", "Barbell",
                       "A squat variant where the barbell is held across the front of the shoulders."),

                create("Glute Bridge", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Glutes", "Hamstrings", "Core"), "None", "Plates/Barbell", "None",
                       "Lying on your back and lifting your hips toward the ceiling."),

                create("Goblet Squat", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes", "Core"), "Water Jug", "Kettlebell/Dumbbell", "Dumbbell",
                       "A squat performed while holding a weight against the chest."),

                create("Hammer Curl", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Biceps", "Forearms"), "Water Bottles", "Dumbbells", "Dumbbell",
                       "A bicep curl variant with a neutral grip (palms facing each other)."),

                create("High Knees", "Cardio", "Beginner", "TIME", 45, 
                       Arrays.asList("Legs", "Cardio", "Core"), "None", "None", "None",
                       "A cardio exercise where you run in place, lifting your knees as high as possible."),

                create("Incline Press", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Chest", "Shoulders", "Triceps"), "Resistance Band", "Incline Bench & Barbell", "Barbell",
                       "A chest press performed on an inclined bench to target the upper pectorals."),

                create("Iron Cross", "Mobility", "Elite", "TIME", 10, 
                       Arrays.asList("Shoulders", "Chest", "Core"), "None", "Gymnastic Rings", "Rings",
                       "A high-level gymnastics hold on rings."),

                create("Jump Rope", "Cardio", "Intermediate", "TIME", 300, 
                       Arrays.asList("Calves", "Cardio", "Full Body"), "Jump Rope", "Jump Rope", "Jump Rope",
                       "A classic cardio exercise using a skipping rope."),

                create("Jogging", "Cardio", "Beginner", "TIME", 1800, 
                       Arrays.asList("Legs", "Cardio"), "Running Shoes", "Treadmill", "None",
                       "A steady-paced running exercise for cardiovascular health."),

                create("Kettlebell Swing", "HIIT", "Intermediate", "TIME", 45, 
                       Arrays.asList("Glutes", "Hamstrings", "Core", "Cardio"), "Backpack", "Kettlebell", "Kettlebell",
                       "A powerful swing movement targeting the posterior chain."),

                create("Knee Raises", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Abdominals", "Core"), "None", "Captain's Chair", "None",
                       "A core exercise where you lift your knees toward your chest while hanging or supported."),

                create("Lat Pulldown", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Upper Back", "Biceps"), "Resistance Band", "Lat Machine", "Machine",
                       "A back exercise where you pull a bar down toward your upper chest."),

                create("Leg Press", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes", "Hamstrings"), "None", "Leg Press Machine", "Machine",
                       "A machine-based leg exercise where you push a weight plate with your legs."),

                create("Mountain Climbers", "HIIT", "Intermediate", "TIME", 45, 
                       Arrays.asList("Core", "Cardio", "Shoulders"), "None", "None", "None",
                       "Running in a plank position to build core strength and endurance."),

                create("Muscle-up", "Strength", "Elite", "REPS", 0, 
                       Arrays.asList("Back", "Shoulders", "Triceps", "Core"), "None", "Pull-up Bar/Rings", "Bar",
                       "An advanced calisthenics move combining a pull-up and a dip."),

                create("Nordic Curl", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Hamstrings"), "Bed Frame/Partner", "GHD Machine", "None",
                       "A high-intensity hamstring exercise involving lowering your torso from a kneeling position."),

                create("Overhead Press", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Shoulders", "Triceps", "Core"), "Broomstick/Bands", "Barbell", "Barbell",
                       "Pressing a weight directly overhead while standing."),

                create("Olympic Snatch", "Strength", "Elite", "REPS", 0, 
                       Arrays.asList("Full Body", "Shoulders", "Legs", "Back"), "None", "Barbell", "Barbell",
                       "A high-speed explosive lift where the barbell is moved from ground to overhead in one motion."),

                create("Pendulum Squat", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes"), "Wall Squat", "Pendulum Squat Machine", "Machine",
                       "A machine-based squat that follows a natural arc."),

                create("Pike Push-up", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Shoulders", "Triceps"), "None", "None", "None",
                       "A push-up performed in a pike/downward dog position."),

                create("Plank", "Mobility", "Beginner", "TIME", 60, 
                       Arrays.asList("Core", "Shoulders", "Abdominals"), "None", "None", "None",
                       "An isometric core exercise where you maintain a position similar to a push-up."),

                create("Pull-ups", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Back", "Biceps"), "Door Bar", "Pull-up Bar", "Bar",
                       "A vertical pulling exercise that builds upper body strength."),

                create("Push-ups", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Chest", "Triceps", "Shoulders"), "None", "None", "None",
                       "A fundamental bodyweight pushing exercise."),

                create("Quad Extensions", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Quads"), "None", "Leg Extension Machine", "Machine",
                       "An isolation exercise that targets the quadriceps."),

                create("Reverse Curl", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Forearms", "Biceps"), "Water Bottles", "Barbell", "Barbell",
                       "A curl performed with a pronated (overhand) grip."),

                create("Ring Pull-up", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Upper Back", "Biceps", "Core"), "Towel Over Door", "Gymnastic Rings", "Rings",
                       "A pull-up performed on unstable gymnastic rings."),

                create("Romanian Deadlift", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Hamstrings", "Glutes", "Lower Back"), "Backpack", "Barbell/Dumbbells", "Barbell",
                       "A deadlift variant focusing on the eccentric phase and the hamstrings."),

                create("Rowing", "Cardio", "Intermediate", "TIME", 600, 
                       Arrays.asList("Full Body", "Cardio", "Back"), "None", "Rowing Machine", "Machine",
                       "A full-body cardiovascular exercise using a rowing machine."),

                create("Sled Push", "HIIT", "Advanced", "TIME", 30, 
                       Arrays.asList("Legs", "Cardio", "Core"), "Partner Push", "Sled", "Sled",
                       "Pushing a weighted sled across a distance."),

                create("Squats", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes", "Hamstrings"), "None", "Barbell/Rack", "Barbell",
                       "The king of leg exercises, targeting the entire lower body."),

                create("Shoulder Press", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Shoulders", "Triceps"), "Water Jugs", "Dumbbells/Machine", "Dumbbell",
                       "Lifting weights directly above the shoulders."),

                create("Stair Climbing", "Cardio", "Intermediate", "TIME", 900, 
                       Arrays.asList("Legs", "Cardio", "Glutes"), "Stairs", "StairMaster", "Machine",
                       "A cardio exercise that simulates climbing stairs."),

                create("Sprint Intervals", "HIIT", "Advanced", "TIME", 30, 
                       Arrays.asList("Legs", "Cardio"), "Open Field", "Treadmill", "None",
                       "Short bursts of maximum effort running followed by rest."),

                create("Tricep Dips", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Triceps", "Chest"), "Chair", "Parallel Bars", "Bench",
                       "Lowering your body by bending your arms, targeting the back of the arm."),

                create("Treadmill", "Cardio", "Beginner", "TIME", 1800, 
                       Arrays.asList("Legs", "Cardio"), "Running Shoes", "Treadmill", "Machine",
                       "Running or walking on a motorized belt."),

                create("T-Bar Row", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Mid Back", "Biceps", "Traps"), "None", "T-Bar Row Machine", "Machine",
                       "A pulling exercise that targets the middle and upper back."),

                create("Upright Row", "Strength", "Intermediate", "REPS", 0, 
                       Arrays.asList("Traps", "Shoulders"), "Resistance Band", "Barbell/Ez-Bar", "Barbell",
                       "Pulling a weight up toward your chin with a narrow grip."),

                create("V-ups", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Abdominals", "Core"), "None", "None", "None",
                       "Simultaneously lifting your legs and torso to form a V-shape."),

                create("Walking Lunges", "Strength", "Beginner", "REPS", 0, 
                       Arrays.asList("Quads", "Glutes", "Legs"), "None", "Dumbbells", "None",
                       "Stepping forward into a lunge and alternating legs while moving."),

                create("Walking", "Cardio", "Beginner", "TIME", 3600, 
                       Arrays.asList("Legs", "Cardio"), "None", "None", "None",
                       "A low-intensity cardiovascular exercise."),

                create("X-Band Walk", "Mobility", "Beginner", "TIME", 60, 
                       Arrays.asList("Glutes", "Hips"), "Resistance Band", "Resistance Band", "Band",
                       "Walking sideways with a resistance band to activate the glutes."),

                create("Yoga Sun Salutation", "Mobility", "Intermediate", "TIME", 600, 
                       Arrays.asList("Full Body", "Flexibility"), "None", "Yoga Mat", "None",
                       "A sequence of yoga poses that flow together with the breath."),

                create("Zercher Squat", "Strength", "Advanced", "REPS", 0, 
                       Arrays.asList("Quads", "Core", "Upper Back"), "None", "Barbell", "Barbell",
                       "A squat where the barbell is held in the crooks of your elbows.")
            );

            repository.saveAll(exercises);
        };
    }

    private Exercise create(String name, String category, String diff, String type, int dur, 
                             List<String> muscles, String homeEq, String gymEq, String eqCat, String def) {
        Exercise e = new Exercise();
        e.setName(name);
        e.setCategory(category);
        e.setDifficultyLevel(diff);
        e.setExerciseType(type);
        e.setDefaultDuration(dur);
        e.setTargetMuscleGroups(muscles);
        e.setHomeEquipment(homeEq);
        e.setGymEquipment(gymEq);
        e.setEquipmentCategory(eqCat);
        e.setDefinition(def);
        
        // Assign premium category images
        if ("Strength".equalsIgnoreCase(category)) {
            e.setPreviewImageUrl("/exercises/strength.png");
        } else if ("Cardio".equalsIgnoreCase(category)) {
            e.setPreviewImageUrl("/exercises/cardio.png");
        }
        
        return e;
    }
}
