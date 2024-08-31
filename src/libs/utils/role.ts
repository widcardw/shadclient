function roleToVariant(role: 'owner' | 'admin' | 'member') {
  switch (role) {
    case 'owner':
      return 'owner'
    case 'admin':
      return 'admin'
    case 'member':
      return 'secondary'
    default:
      return 'outline'
  }
}

export { roleToVariant }
