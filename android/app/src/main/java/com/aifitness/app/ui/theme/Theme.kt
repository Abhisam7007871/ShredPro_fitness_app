package com.aifitness.app.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = GreenPrimary,
    onPrimary = Color.White,
    secondary = Color(0xFF267AFF),
    onSecondary = Color.White,
    background = Background,
    onBackground = OnBackground,
    surface = Surface,
    onSurface = OnBackground,
    surfaceVariant = Surface2,
    onSurfaceVariant = OnBackground,
    outline = Border
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFF3B30),
    onPrimary = Color.Black,
    secondary = Color(0xFF007AFF),
    onSecondary = Color.Black,
    background = DarkBackground,
    onBackground = DarkOnBackground,
    surface = DarkSurface,
    onSurface = DarkOnBackground,
    surfaceVariant = DarkSurface2,
    onSurfaceVariant = DarkOnBackground,
    outline = Color(0x33FFFFFF)
)

@Composable
fun AIFitnessTheme(
    darkTheme: Boolean,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColors else LightColors,
        typography = Typography,
        content = content
    )
}

val ColorScheme.isLightTheme: Boolean
    @Composable
    @ReadOnlyComposable
    get() = this.background == Background

