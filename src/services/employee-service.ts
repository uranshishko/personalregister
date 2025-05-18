import { Mutex } from "async-mutex";
import { Employee } from "../models/employee";
import { Service } from "./interfaces/service";

/**
 * Service implementation for managing Employee entities.
 *
 * Uses an in-memory store (Map) and a mutex to ensure safe concurrent access.
 * Implements the generic Service interface for type safety and consistency.
 */
export class EmployeeService implements Service<Employee> {
  private employees = new Map<string, Employee>();
  private mutex = new Mutex();

  /**
   * Adds a new employee to the store if no employee with the same email exists.
   *
   * @param data The Employee object to add.
   * @returns A promise resolving to the added employee, or `null` if an employee with the same email already exists.
   */
  async add(data: Employee): Promise<Employee | null> {
    return this.mutex.runExclusive(() => {
      if ([...this.employees.values()].some((e) => e.email === data.email)) {
        return null;
      }

      this.employees.set(data.id, data);
      return data;
    });
  }

  /**
   * Removes an employee from the store by their ID.
   *
   * @param id The ID of the employee to remove.
   * @returns A promise resolving to `true` if the employee was found and removed, `false` otherwise.
   */
  async remove(id: string): Promise<boolean> {
    return this.mutex.runExclusive(() => this.employees.delete(id));
  }

  /**
   * Retrieves all employees currently in the store.
   *
   * @returns A promise resolving to an array of Employee objects.
   */
  async getAll(): Promise<Employee[]> {
    return this.mutex.runExclusive(() => Array.from(this.employees.values()));
  }
}
