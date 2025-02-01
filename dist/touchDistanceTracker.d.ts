import { Observer, Point, Line, TouchMode, StorageConfig } from "./types";
export default class TouchDistanceTracker {
    private mode;
    private lastTouchPosition;
    private dpi;
    private totalDistance;
    private points;
    private lines;
    private observers;
    private storageConfig;
    constructor(config?: {
        mode?: TouchMode;
        dpi?: number;
        storageConfig?: StorageConfig;
    });
    private generateDefaultStorageKey;
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    private notifyObservers;
    private saveTotalDistance;
    private loadTotalDistance;
    removeStorage(): void;
    private calculateDistance;
    private convertToMM;
    private saveTouchLog;
    handleTouch(event: PointerEvent): void;
    reset(): void;
    getTotalDistance(): number;
    getPoints(): Point[];
    getLines(): Line[];
    getTouchLog(): {
        x: number;
        y: number;
        time_millis: number;
    }[];
}
