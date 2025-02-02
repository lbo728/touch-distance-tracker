class TouchDistanceTracker {
    mode;
    lastTouchPosition = null;
    dpi;
    totalDistance = 0;
    points = [];
    lines = [];
    observers = [];
    storageConfig;
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
    generateDefaultStorageKey() {
        let index = 1;
        while (localStorage.getItem(`totalDistance-${String(index).padStart(2, "0")}`)) {
            index++;
        }
        return `totalDistance-${String(index).padStart(2, "0")}`;
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }
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
    saveTotalDistance() {
        if (this.storageConfig.storageKey) {
            localStorage.setItem(this.storageConfig.storageKey, this.totalDistance.toString());
        }
    }
    loadTotalDistance() {
        if (this.storageConfig.storageKey) {
            const savedDistance = localStorage.getItem(this.storageConfig.storageKey);
            if (savedDistance) {
                this.totalDistance = parseFloat(savedDistance);
            }
        }
    }
    removeStorage() {
        if (this.storageConfig.storageKey) {
            localStorage.removeItem(this.storageConfig.storageKey);
        }
        if (this.storageConfig.touchLogKey) {
            localStorage.removeItem(this.storageConfig.touchLogKey);
        }
    }
    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    convertToMM(distanceInPixels) {
        const mmPerPixel = 25.4 / this.dpi;
        return distanceInPixels * mmPerPixel;
    }
    saveTouchLog(touchData) {
        if (this.storageConfig.touchLogKey) {
            const existingLog = localStorage.getItem(this.storageConfig.touchLogKey);
            const log = existingLog ? JSON.parse(existingLog) : [];
            log.push(touchData);
            localStorage.setItem(this.storageConfig.touchLogKey, JSON.stringify(log));
        }
    }
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
    getTotalDistance() {
        return this.totalDistance;
    }
    getPoints() {
        return [...this.points];
    }
    getLines() {
        return [...this.lines];
    }
    getTouchLog() {
        if (this.storageConfig.touchLogKey) {
            const log = localStorage.getItem(this.storageConfig.touchLogKey);
            return log ? JSON.parse(log) : [];
        }
        return [];
    }
}

export { TouchDistanceTracker, TouchDistanceTracker as default };
