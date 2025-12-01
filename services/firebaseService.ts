// This is a mock implementation of Firebase services.
// In a real application, you would use the Firebase SDK.

interface MockUser {
    uid: string;
    email: string | null;
}

// A simple mock for a user object returned by Firebase
const createMockUser = (email: string): MockUser => ({
  uid: `mock-uid-${email.replace('@','-').replace('.','-')}`, // More consistent mock UID
  email,
});

// --- Start of Fix ---
// Internal subscription system to correctly notify the app of auth changes.
let listeners: ((user: MockUser | null) => void)[] = [];

const notifyListeners = () => {
    const storedUser = localStorage.getItem('mockUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    listeners.forEach(callback => callback(user));
};
// --- End of Fix ---

export const signUpWithEmail = (email: string, password: string): Promise<{ user: MockUser }> => {
  return new Promise((resolve, reject) => {
    console.log(`Signing up with ${email} and ${password}`);
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email and password are required.'));
      } else if (password.length < 6) {
        reject(new Error('Password should be at least 6 characters.'));
      } else {
        // Simulate successful signup
        const user = createMockUser(email);
        localStorage.setItem('mockUser', JSON.stringify(user));
        notifyListeners(); // Notify the app of the change
        resolve({ user });
      }
    }, 1000);
  });
};

export const signInWithEmail = (email: string, password: string): Promise<{ user: MockUser }> => {
  return new Promise((resolve, reject) => {
    console.log(`Signing in with ${email} and ${password}`);
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email and password are required.'));
      } else if (email.includes('@')) {
         // Simulate successful signin
        const user = createMockUser(email);
        localStorage.setItem('mockUser', JSON.stringify(user));
        notifyListeners(); // Notify the app of the change
        resolve({ user });
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000);
  });
};

export const sendPasswordResetEmail = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log(`Sending password reset email to ${email}`);
    setTimeout(() => {
      if (!email || !email.includes('@')) {
        reject(new Error('Please enter a valid email address.'));
      } else {
        // In a real app, this would be an API call.
        // We just resolve to simulate a successful send.
        console.log(`Password reset for ${email} was successful.`);
        resolve();
      }
    }, 1500);
  });
};


export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        console.log('Signing out...');
        localStorage.removeItem('mockUser');
        notifyListeners(); // Notify the app of the change
        setTimeout(() => resolve(), 500);
    });
};

export const onAuthChange = (callback: (user: MockUser | null) => void): (() => void) => {
    console.log('Auth state listener attached.');
    
    // Add the callback to our list of listeners
    listeners.push(callback);
    
    // Immediately check the current state
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
        callback(JSON.parse(storedUser));
    } else {
        callback(null);
    }

    // Return an unsubscribe function
    return () => { 
        console.log('Auth state listener detached.'); 
        listeners = listeners.filter(l => l !== callback);
    };
};