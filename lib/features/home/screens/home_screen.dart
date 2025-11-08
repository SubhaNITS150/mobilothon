// In lib/features/home/screens/home_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Import your auth BLoC
import '../../auth/bloc/auth_bloc.dart';
import '../../auth/bloc/auth_event.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Parking Home'),
        actions: [
          // This logout button will work with your AuthBloc
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              // Send the Logout event to the AuthBloc
              // This will trigger the state change in main.dart
              // and navigate the user back to the LoginScreen.
              context.read<AuthBloc>().add(LogoutButtonPressed());
            },
          ),
        ],
      ),
      body: const Center(
        child: Text(
          'Welcome to the Home Screen!',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}