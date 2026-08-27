enum Role { musician, conductor, unknown }

Role roleFromString(String? str) {
  switch (str) {
    case 'musician':
      return Role.musician;
    case 'conductor':
      return Role.conductor;
    default:
      return Role.unknown;
  }
}
