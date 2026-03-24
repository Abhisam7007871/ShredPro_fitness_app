package com.aifitness.app.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.aifitness.app.ui.nav.RootNav
import com.aifitness.app.ui.theme.AIFitnessTheme
import com.aifitness.app.ui.theme.ThemePreferences
import kotlinx.coroutines.launch

@Composable
fun AIFitnessApp() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val darkMode by ThemePreferences.darkModeFlow(context).collectAsState(initial = false)

    AIFitnessTheme(darkTheme = darkMode) {
        Surface(color = MaterialTheme.colorScheme.background) {
            Box(modifier = Modifier.fillMaxSize()) {
                RootNav(
                    darkMode = darkMode,
                    onToggleDarkMode = { enabled ->
                        scope.launch {
                            ThemePreferences.setDarkMode(context, enabled)
                        }
                    }
                )
            }
        }
    }
}

