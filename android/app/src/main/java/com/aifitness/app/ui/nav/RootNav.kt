package com.aifitness.app.ui.nav

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Timeline
import com.aifitness.app.ui.screens.ActivityComposeScreen
import com.aifitness.app.ui.screens.NutritionComposeScreen
import com.aifitness.app.ui.screens.ProfileComposeScreen
import com.aifitness.app.ui.screens.WorkoutsComposeScreen

private data class BottomItem(
    val route: String,
    val label: String,
    val icon: ImageVector
)

@Composable
fun RootNav(
    darkMode: Boolean,
    onToggleDarkMode: (Boolean) -> Unit
) {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val route = backStackEntry?.destination?.route

    val items = listOf(
        BottomItem("activity", "Activity", Icons.Filled.Timeline),
        BottomItem("workouts", "Workouts", Icons.Filled.FitnessCenter),
        BottomItem("nutrition", "Nutrition", Icons.Filled.Restaurant),
        BottomItem("profile", "Profile", Icons.Filled.AccountCircle)
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = when (route) {
                            "workouts" -> "Workouts"
                            "nutrition" -> "Nutrition"
                            "profile" -> "Profile"
                            else -> "Activity"
                        },
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                actions = {
                    IconButton(onClick = { onToggleDarkMode(!darkMode) }) {
                        Icon(
                            imageVector = if (darkMode) Icons.Filled.DarkMode else Icons.Filled.LightMode,
                            contentDescription = "Toggle theme"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                items.forEach { item ->
                    val selected = route == item.route || (route == null && item.route == "activity")
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = "activity",
            modifier = Modifier.padding(padding)
        ) {
            composable("activity") { ActivityComposeScreen() }
            composable("workouts") { WorkoutsComposeScreen() }
            composable("nutrition") { NutritionComposeScreen() }
            composable("profile") { ProfileComposeScreen() }
        }
    }
}

