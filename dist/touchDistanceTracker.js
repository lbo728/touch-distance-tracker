/**
 * Class responsible for tracking touch distances and managing related data.
 * Supports two modes of operation: visualization and production.
 * Implements the Observer pattern for UI updates and persists data to localStorage.
 */
export default class TouchDistanceTracker {
    mode;
    lastTouchPosition = null;
    dpi;
    totalDistance = 0;
    points = [];
    lines = [];
    observers = [];
    storageConfig;
    /**
     * Creates a new instance of TouchDistanceTracker.
     * @param config - Configuration options for the tracker
     * @param config.mode - Operation mode ('visualization' or 'production')
     * @param config.dpi - Screen DPI for pixel-to-mm conversion (default: 96)
     * @param config.storageConfig - Local storage configuration
     */
    constructor(config = {}) {
        this.mode = config.mode || "production";
        this.dpi = config.dpi || 96;
        const defaultStorageKey = this.generateDefaultStorageKey();
        this.storageConfig = {
            storageKey: config.storageConfig?.storageKey || defaultStorageKey,
            touchLogKey: config.storageConfig?.touchLogKey || `${defaultStorageKey}-touch-log`,
        };
        this.loadTotalDistance();
    }
    /**
     * Generates a unique default storage key for localStorage.
     * @returns A unique storage key in the format 'totalDistance-XX'
     * @private
     */
    generateDefaultStorageKey() {
        let index = 1;
        while (localStorage.getItem(`totalDistance-${String(index).padStart(2, "0")}`)) {
            index++;
        }
        return `totalDistance-${String(index).padStart(2, "0")}`;
    }
    /**
     * Adds an observer to receive updates about points, lines, and total distance.
     * @param observer - Observer implementing the Observer interface
     */
    addObserver(observer) {
        this.observers.push(observer);
    }
    /**
     * Removes an observer from the notification list.
     * @param observer - Observer to remove
     */
    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }
    /**
     * Notifies all observers of updates to points, lines, and total distance.
     * Only triggers notifications in visualization mode.
     * @private
     */
    notifyObservers() {
        if (this.mode === "visualization") {
            this.observers.forEach((observer) => {
                if (observer.onPointsUpdated) {
                    observer.onPointsUpdated([...this.points]);
                }
                if (observer.onLinesUpdated) {
                    observer.onLinesUpdated([...this.lines]);
                }
                if (observer.onTotalDistanceUpdated) {
                    observer.onTotalDistanceUpdated(this.totalDistance);
                }
            });
        }
    }
    /**
     * Saves the current total distance to localStorage.
     * @private
     */
    saveTotalDistance() {
        if (this.storageConfig.storageKey) {
            localStorage.setItem(this.storageConfig.storageKey, this.totalDistance.toString());
        }
    }
    /**
     * Loads the total distance from localStorage.
     * @private
     */
    loadTotalDistance() {
        if (this.storageConfig.storageKey) {
            const savedDistance = localStorage.getItem(this.storageConfig.storageKey);
            if (savedDistance) {
                this.totalDistance = parseFloat(savedDistance);
            }
        }
    }
    /**
     * Removes all stored data from localStorage.
     */
    removeStorage() {
        if (this.storageConfig.storageKey) {
            localStorage.removeItem(this.storageConfig.storageKey);
        }
        if (this.storageConfig.touchLogKey) {
            localStorage.removeItem(this.storageConfig.touchLogKey);
        }
    }
    /**
     * Calculates the Euclidean distance between two points.
     * @param x1 - X-coordinate of the first point
     * @param y1 - Y-coordinate of the first point
     * @param x2 - X-coordinate of the second point
     * @param y2 - Y-coordinate of the second point
     * @returns Distance between the points in pixels
     * @private
     */
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    /**
     * Converts a distance from pixels to millimeters based on screen DPI.
     * @param distanceInPixels - Distance in pixels to convert
     * @returns Distance in millimeters
     * @private
     */
    convertToMM(distanceInPixels) {
        const mmPerPixel = 25.4 / this.dpi;
        return distanceInPixels * mmPerPixel;
    }
    /**
     * Saves touch event data to localStorage.
     * @param touchData - Touch event data including coordinates and timestamp
     * @private
     */
    saveTouchLog(touchData) {
        if (this.storageConfig.touchLogKey) {
            const existingLog = localStorage.getItem(this.storageConfig.touchLogKey);
            const log = existingLog ? JSON.parse(existingLog) : [];
            log.push(touchData);
            localStorage.setItem(this.storageConfig.touchLogKey, JSON.stringify(log));
        }
    }
    /**
     * Handles a pointer event, calculating distances and updating state.
     * @param event - Pointer event from touch or mouse interaction
     */
    handleTouch(event) {
        const x = event.clientX;
        const y = event.clientY;
        const time_millis = Date.now();
        const newPoint = { x, y };
        this.saveTouchLog({ x, y, time_millis });
        if (this.lastTouchPosition) {
            const distanceInPixels = this.calculateDistance(this.lastTouchPosition.x, this.lastTouchPosition.y, x, y);
            const distanceInMM = this.convertToMM(distanceInPixels);
            this.totalDistance += distanceInMM;
            const newLine = {
                x1: this.lastTouchPosition.x,
                y1: this.lastTouchPosition.y,
                x2: x,
                y2: y,
                distance: distanceInMM,
            };
            this.lines.push(newLine);
            this.saveTotalDistance();
        }
        this.points.push(newPoint);
        this.lastTouchPosition = newPoint;
        this.notifyObservers();
    }
    /**
     * Resets all tracking data and storage to initial state.
     */
    reset() {
        this.lastTouchPosition = null;
        this.totalDistance = 0;
        this.points = [];
        this.lines = [];
        this.saveTotalDistance();
        if (this.storageConfig.touchLogKey) {
            localStorage.removeItem(this.storageConfig.touchLogKey);
        }
        this.notifyObservers();
    }
    /**
     * Gets the current total distance.
     * @returns Total distance in millimeters
     */
    getTotalDistance() {
        return this.totalDistance;
    }
    /**
     * Gets all recorded points.
     * @returns Array of points
     */
    getPoints() {
        return [...this.points];
    }
    /**
     * Gets all recorded lines.
     * @returns Array of lines
     */
    getLines() {
        return [...this.lines];
    }
    /**
     * Gets the complete touch event log.
     * @returns Array of touch events with coordinates and timestamps
     */
    getTouchLog() {
        if (this.storageConfig.touchLogKey) {
            const log = localStorage.getItem(this.storageConfig.touchLogKey);
            return log ? JSON.parse(log) : [];
        }
        return [];
    }
}
