// Centralized storage management utility
// This abstraction makes it easy to switch between localStorage, sessionStorage, or a different storage solution

interface StorageOptions {
  prefix?: string;
}

class StorageManager {
  private prefix: string;
  private storage: Storage;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || "bpsc_";
    this.storage = typeof window !== "undefined" ? window.localStorage : (null as any);
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get a value from storage
   * @param key - The key to retrieve
   * @returns The parsed value, or null if not found
   */
  get<T = any>(key: string): T | null {
    if (!this.storage) return null;
    try {
      const item = this.storage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Set a value in storage
   * @param key - The key to store
   * @param value - The value to store (will be JSON stringified)
   */
  set<T = any>(key: string, value: T): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  }

  /**
   * Remove a value from storage
   * @param key - The key to remove
   */
  remove(key: string): void {
    if (!this.storage) return;
    try {
      this.storage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  /**
   * Clear all storage with the current prefix
   */
  clear(): void {
    if (!this.storage) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key?.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => this.storage.removeItem(key));
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }

  /**
   * Check if a key exists
   * @param key - The key to check
   */
  has(key: string): boolean {
    if (!this.storage) return false;
    return this.storage.getItem(this.getKey(key)) !== null;
  }
}

// Create a singleton instance
export const storage = new StorageManager();

// ============================================================================
// Specific storage keys and helpers (domain-specific)
// ============================================================================

export interface TestResult {
  testId: string;
  answers: Record<string, number>;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  completedAt: string;
  duration: number; // in seconds
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

/**
 * Test Results Storage
 */
export const testResultsStorage = {
  getAll(): TestResult[] {
    return storage.get<TestResult[]>("results") || [];
  },

  get(testId: string): TestResult | null {
    const results = this.getAll();
    return results.find((r) => r.testId === testId) || null;
  },

  save(result: TestResult): void {
    const results = this.getAll();
    const existingIndex = results.findIndex((r) => r.testId === result.testId);

    if (existingIndex >= 0) {
      results[existingIndex] = result;
    } else {
      results.push(result);
    }

    storage.set("results", results);
  },

  delete(testId: string): void {
    const results = this.getAll();
    storage.set("results", results.filter((r) => r.testId !== testId));
  },

  clear(): void {
    storage.remove("results");
  },
};

/**
 * User/Auth Storage
 */
export const authStorage = {
  getUser(): User | null {
    return storage.get<User>("user");
  },

  saveUser(user: User): void {
    storage.set("user", user);
  },

  getToken(): string | null {
    return storage.get<string>("token");
  },

  saveToken(token: string): void {
    storage.set("token", token);
  },

  clearAuth(): void {
    storage.remove("user");
    storage.remove("token");
  },
};

/**
 * App Preferences Storage
 */
export const preferencesStorage = {
  getTheme(): "light" | "dark" {
    return storage.get<"light" | "dark">("theme") || "light";
  },

  setTheme(theme: "light" | "dark"): void {
    storage.set("theme", theme);
  },

  getNotifications(): boolean {
    return storage.get<boolean>("notifications") ?? true;
  },

  setNotifications(enabled: boolean): void {
    storage.set("notifications", enabled);
  },
};
