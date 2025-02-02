import TouchDistanceTracker from "../src/touchDistanceTracker";

describe("Touch Distance Tracker", () => {
  let tracker: TouchDistanceTracker;

  beforeEach(() => {
    tracker = new TouchDistanceTracker({
      mode: "visualization",
      dpi: 96,
    });
  });

  test("Constructor initializes with default settings", () => {
    expect(tracker).toBeTruthy();
    expect(tracker.getTotalDistance()).toBe(0);
    expect(tracker.getPoints()).toHaveLength(0);
    expect(tracker.getLines()).toHaveLength(0);
  });

  test("Calculates distance accurately with touch events", () => {
    const mockEvent1 = {
      clientX: 0,
      clientY: 0,
      type: "pointerdown",
    } as unknown as PointerEvent;

    const mockEvent2 = {
      clientX: 100,
      clientY: 100,
      type: "pointermove",
    } as unknown as PointerEvent;

    tracker.handleTouch(mockEvent1);
    expect(tracker.getPoints()).toHaveLength(1);
    expect(tracker.getTotalDistance()).toBe(0);

    tracker.handleTouch(mockEvent2);
    expect(tracker.getPoints()).toHaveLength(2);
    expect(tracker.getLines()).toHaveLength(1);

    const expectedDistance = (Math.sqrt(100 * 100 + 100 * 100) * 25.4) / 96;
    expect(tracker.getTotalDistance()).toBeCloseTo(expectedDistance, 1);
  });

  test("Reset method clears all data", () => {
    const mockEvent = {
      clientX: 100,
      clientY: 100,
      type: "pointermove",
    } as unknown as PointerEvent;

    tracker.handleTouch({
      clientX: 0,
      clientY: 0,
      type: "pointerdown",
    } as unknown as PointerEvent);
    tracker.handleTouch(mockEvent);

    tracker.reset();

    expect(tracker.getTotalDistance()).toBe(0);
    expect(tracker.getPoints()).toHaveLength(0);
    expect(tracker.getLines()).toHaveLength(0);
  });

  test("Observer notifications", () => {
    const mockObserver = {
      onPointsUpdated: jest.fn(),
      onLinesUpdated: jest.fn(),
      onTotalDistanceUpdated: jest.fn(),
    };

    tracker.addObserver(mockObserver);

    tracker.handleTouch({
      clientX: 0,
      clientY: 0,
      type: "pointerdown",
    } as unknown as PointerEvent);
    tracker.handleTouch({
      clientX: 100,
      clientY: 100,
      type: "pointermove",
    } as unknown as PointerEvent);

    expect(mockObserver.onPointsUpdated).toHaveBeenCalled();
    expect(mockObserver.onLinesUpdated).toHaveBeenCalled();
    expect(mockObserver.onTotalDistanceUpdated).toHaveBeenCalled();

    tracker.removeObserver(mockObserver);
  });
});
