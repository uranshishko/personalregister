/**
 * Generic interface representing a service for managing entities of type T.
 *
 * @template T The type of data the service operates on.
 */
export interface Service<T> {
  /**
   * Adds a new item to the service.
   *
   * @param data The item to add.
   * @returns A promise resolving to the added item, or `null` if the operation failed.
   */
  add(data: T): Promise<T | null>;

  /**
   * Removes an item from the service by its unique identifier.
   *
   * @param id The ID of the item to remove.
   * @returns A promise resolving to `true` if the item was successfully removed, or `false` otherwise.
   */
  remove(id: string): Promise<boolean>;

  /**
   * Retrieves all items managed by the service.
   *
   * @returns A promise resolving to an array of items.
   */
  getAll(): Promise<T[]>;
}
