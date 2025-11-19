// In lib/main.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// --- Import your BLoC files ---
import 'features/auth/bloc/auth_bloc.dart';
import 'features/auth/bloc/auth_event.dart';
import 'features/auth/bloc/auth_state.dart';

// --- Import your Screen files ---
// You will create these files in the next step
import 'features/auth/screens/splash_screen.dart';
import 'features/auth/screens/login_screen.dart'; // Will also handle registration
import 'features/auth/screens/onboarding_screen.dart';
import 'features/home/screens/home_screen.dart'; // Your Module 2 (Map) screen


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // This provides the AuthBloc to all widgets below it
    return BlocProvider(
      create: (context) => AuthBloc()..add(AppStarted()), // Create BLoC & start it
      child: MaterialApp(
        title: 'Smart Parking App',
        theme: ThemeData.dark(), // A base dark theme
        debugShowCheckedModeBanner: false,
        
        // Use a BlocBuilder to control what the user sees
        home: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, state) {
            // While BLoC is checking for a token
            if (state is AuthInitial) {
              return const SplashScreen();
            }
            // If token is found, go to Home
            if (state is AuthAuthenticated) {
              return const HomeScreen(); // Your main map screen
            }
            // If no token, go to Login/Onboarding
            if (state is AuthUnauthenticated) {
              // You could add logic here to only show onboarding once
              return const LoginScreen(); // Or OnboardingScreen()
            }
            // If logging in/registering
            if (state is AuthLoading) {
              // This state is usually handled inside LoginScreen,
              // but SplashScreen is a good fallback.
              return const SplashScreen();
            }
            
            // Fallback for any other state
            return const SplashScreen();
          },
        ),
      ),
    );
  }
}