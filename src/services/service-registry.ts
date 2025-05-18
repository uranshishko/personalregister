import { Service } from "./interfaces/service";

/**
 * Represents a constructor type that returns an instance implementing the Service<T> interface.
 *
 * @template T The type of the service.
 */
type ServiceConstructor<T> = new (...args: any[]) => Service<T>;

/**
 * A registry to manage application-wide service instances.
 *
 * Provides methods to register, retrieve, and unregister services,
 * ensuring type safety and singleton-like behavior.
 */
export class AppServiceRegistry {
  private services = new Map<Function, Service<any>>();

  /**
   * Registers a service instance in the registry.
   *
   * @template T The type of the service.
   * @param ctor The constructor of the service.
   * @param instance The instance of the service to register.
   * @throws {Error} If a service for the provided constructor is already registered.
   */
  register<T>(ctor: ServiceConstructor<T>, instance: Service<T>): void {
    if (this.services.has(ctor)) {
      throw new Error(`Service for ${ctor.name} is already registered.`);
    }
    this.services.set(ctor, instance);
  }

  /**
   * Retrieves a registered service instance.
   *
   * @template T The type of the service.
   * @param ctor The constructor of the service.
   * @returns The registered service instance.
   * @throws {Error} If no service is found for the given constructor.
   */
  get<T>(ctor: ServiceConstructor<T>): Service<T> {
    const service = this.services.get(ctor);
    if (!service) {
      throw new Error(`Service for ${ctor.name ?? "Unknown"} not found.`);
    }
    return service as Service<T>;
  }

  /**
   * Unregisters a service instance from the registry.
   *
   * @template T The type of the service.
   * @param ctor The constructor of the service to unregister.
   * @throws {Error} If no service is found for the given constructor.
   */
  unregister<T>(ctor: ServiceConstructor<T>): void {
    if (!this.services.delete(ctor)) {
      throw new Error(`Service for ${ctor.name ?? "Unknown"} not found.`);
    }
  }
}
