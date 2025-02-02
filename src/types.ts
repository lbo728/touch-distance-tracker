/**
 * Represents the mode of operation for the touch tracking system.
 * - 'visualization': Enables visual feedback and observer notifications
 * - 'production': Standard operation mode without visualization
 */
export type TouchMode = "visualization" | "production";

/**
 * Configuration for local storage functionality.
 */
export interface StorageConfig {
  /** Key used to store the total distance in localStorage */
  storageKey?: string;
  /** Key used to store the touch event log in localStorage */
  touchLogKey?: string;
}

/**
 * Represents a 2D point with x and y coordinates.
 */
export interface Point {
  /** X-coordinate of the point */
  x: number;
  /** Y-coordinate of the point */
  y: number;
}

/**
 * Represents a line segment between two points with calculated distance.
 */
export interface Line {
  /** X-coordinate of the starting point */
  x1: number;
  /** Y-coordinate of the starting point */
  y1: number;
  /** X-coordinate of the ending point */
  x2: number;
  /** Y-coordinate of the ending point */
  y2: number;
  /** Distance between the two points in millimeters */
  distance: number;
}

/**
 * Observer interface for tracking touch events and distance calculations.
 * Implements the Observer pattern for updating UI components.
 */
export interface Observer {
  /**
   * Called when the points collection is updated
   * @param points - Array of recorded touch points
   */
  onPointsUpdated?(points: Point[]): void;

  /**
   * Called when the lines collection is updated
   * @param lines - Array of lines connecting touch points
   */
  onLinesUpdated?(lines: Line[]): void;

  /**
   * Called when the total distance value changes
   * @param totalDistance - Updated total distance in millimeters
   */
  onTotalDistanceUpdated?(totalDistance: number): void;
}
