import { Observer, Point, Line, TouchMode, StorageConfig } from "./types";
/**
 * Class responsible for tracking touch distances and managing related data.
 * Supports two modes of operation: visualization and production.
 * Implements the Observer pattern for UI updates and persists data to localStorage.
 */
export default class TouchDistanceTracker {
    private mode;
    private lastTouchPosition;
    private dpi;
    private totalDistance;
    private points;
    private lines;
    private observers;
    private storageConfig;
    /**
     * Creates a new instance of TouchDistanceTracker.
     * @param config - Configuration options for the tracker
     * @param config.mode - Operation mode ('visualization' or 'production')
     * @param config.dpi - Screen DPI for pixel-to-mm conversion (default: 96)
     * @param config.storageConfig - Local storage configuration
     */
    constructor(config?: {
        mode?: TouchMode;
        dpi?: number;
        storageConfig?: StorageConfig;
    });
    /**
     * Generates a unique default storage key for localStorage.
     * @returns A unique storage key in the format 'totalDistance-XX'
     * @private
     */
    private generateDefaultStorageKey;
    /**
     * Adds an observer to receive updates about points, lines, and total distance.
     * @param observer - Observer implementing the Observer interface
     */
    addObserver(observer: Observer): void;
    /**
     * Removes an observer from the notification list.
     * @param observer - Observer to remove
     */
    removeObserver(observer: Observer): void;
    /**
     * Notifies all observers of updates to points, lines, and total distance.
     * Only triggers notifications in visualization mode.
     * @private
     */
    private notifyObservers;
    /**
     * Saves the current total distance to localStorage.
     * @private
     */
    private saveTotalDistance;
    /**
     * Loads the total distance from localStorage.
     * @private
     */
    private loadTotalDistance;
    /**
     * Removes all stored data from localStorage.
     */
    removeStorage(): void;
    /**
     * Calculates the Euclidean distance between two points.
     * @param x1 - X-coordinate of the first point
     * @param y1 - Y-coordinate of the first point
     * @param x2 - X-coordinate of the second point
     * @param y2 - Y-coordinate of the second point
     * @returns Distance between the points in pixels
     * @private
     */
    private calculateDistance;
    /**
     * Converts a distance from pixels to millimeters based on screen DPI.
     * @param distanceInPixels - Distance in pixels to convert
     * @returns Distance in millimeters
     * @private
     */
    private convertToMM;
    /**
     * Saves touch event data to localStorage.
     * @param touchData - Touch event data including coordinates and timestamp
     * @private
     */
    private saveTouchLog;
    /**
     * Handles a pointer event, calculating distances and updating state.
     * @param event - Pointer event from touch or mouse interaction
     */
    handleTouch(event: PointerEvent): void;
    /**
     * Resets all tracking data and storage to initial state.
     */
    reset(): void;
    /**
     * Gets the current total distance.
     * @returns Total distance in millimeters
     */
    getTotalDistance(): number;
    /**
     * Gets all recorded points.
     * @returns Array of points
     */
    getPoints(): Point[];
    /**
     * Gets all recorded lines.
     * @returns Array of lines
     */
    getLines(): Line[];
    /**
     * Gets the complete touch event log.
     * @returns Array of touch events with coordinates and timestamps
     */
    getTouchLog(): {
        x: number;
        y: number;
        time_millis: number;
    }[];
}
