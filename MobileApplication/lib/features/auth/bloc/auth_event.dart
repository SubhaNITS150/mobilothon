// In lib/features/auth/bloc/auth_event.dart

abstract class AuthEvent {}

// Fired when the app starts
class AppStarted extends AuthEvent {}

// Fired when the user presses the login button
class LoginButtonPressed extends AuthEvent {
  final String email;
  final String password;
  LoginButtonPressed({required this.email, required this.password});
}

// Fired when the user registers
class RegisterButtonPressed extends AuthEvent {
  final String name; // Added field
  final String email;
  final String password;

  RegisterButtonPressed({
    required this.name,
    required this.email,
    required this.password,
  });
}

// Fired when the user logs out
class LogoutButtonPressed extends AuthEvent {}