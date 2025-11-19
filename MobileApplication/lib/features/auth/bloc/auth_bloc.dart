// In lib/features/auth/bloc/auth_bloc.dart

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import 'dart:async'; // Make sure this is imported

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final _secureStorage = const FlutterSecureStorage();

  AuthBloc() : super(AuthInitial()) {
    
    // --- AppStarted Handler (print statement removed) ---
    on<AppStarted>((event, emit) async {
      print("AuthBloc: AppStarted event received.");
      await Future.delayed(const Duration(seconds: 2));
      
      // The print statement was here and is now removed.
      emit(AuthUnauthenticated());
    });

    // --- MODIFIED: LoginButtonPressed Handler ---
    on<LoginButtonPressed>((event, emit) async {
      print("AuthBloc: LoginButtonPressed received (forcing success).");
      
      // 1. Show a loading spinner
      emit(AuthLoading());
      
      // 2. Simulate a quick "login"
      await Future.delayed(const Duration(milliseconds: 500));
      
      // 3. Immediately emit Authenticated
      print("AuthBloc: Emitting AuthAuthenticated.");
      emit(AuthAuthenticated());
    });

    // --- Handler for RegisterButtonPressed (no change) ---
    on<RegisterButtonPressed>((event, emit) async {
      emit(AuthLoading());
      try {
        await Future.delayed(const Duration(seconds: 1));
        await _secureStorage.write(key: 'auth_token', value: 'fake_registration_token_456');
        emit(AuthAuthenticated());
      } catch (e) {
        emit(AuthFailure(message: "Registration Failed. This email may already be in use."));
      }
    });

    // --- Handler for LogoutButtonPressed (no change) ---
    on<LogoutButtonPressed>((event, emit) async {
      emit(AuthLoading());
      await _secureStorage.delete(key: 'auth_token');
      emit(AuthUnauthenticated());
    });
  }
}