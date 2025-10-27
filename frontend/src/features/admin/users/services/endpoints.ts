export const adminUserEndpoints = {
  getUsers: () => '/users',
  deleteUser: (id: string) => `/admin/users/${id}`,
};
