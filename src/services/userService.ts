export interface UserAddress {
  phone: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const STORAGE_KEY = 'strong_cup_users';

export const userService = {
  // Simulate API call to get user by phone
  getUserByPhone: async (phone: string): Promise<UserAddress | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const usersJson = localStorage.getItem(STORAGE_KEY);
          if (usersJson) {
            const users: Record<string, UserAddress> = JSON.parse(usersJson);
            resolve(users[phone] || null);
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('Error reading user data:', error);
          resolve(null);
        }
      }, 500); // 500ms delay to simulate network request
    });
  },

  // Simulate API call to save/update user address
  saveUserAddress: async (userData: UserAddress): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const usersJson = localStorage.getItem(STORAGE_KEY);
          const users: Record<string, UserAddress> = usersJson ? JSON.parse(usersJson) : {};
          
          users[userData.phone] = userData;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
          resolve();
        } catch (error) {
          console.error('Error saving user data:', error);
          resolve();
        }
      }, 300);
    });
  }
};
