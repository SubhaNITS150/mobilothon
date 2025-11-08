abstract class AuthState {}

// Initial state, shown by SplashScreen
class AuthInitial extends AuthState {}

// User is successfully authenticated (token is valid)
class AuthAuthenticated extends AuthState {}

// User is not authenticated (no token or token expired)
class AuthUnauthenticated extends AuthState {}

// Show a loading spinner (e.g., during login)
class AuthLoading extends AuthState {}

// Show an error (e.g., wrong password)
class AuthFailure extends AuthState {
  final String message;
  AuthFailure({required this.message});
}