export const TARGET_LOCATION_ACCURACY_METERS = 60;
export const MAX_LOCATION_ACCURACY_METERS = 2000;

export class LocationAccuracyError extends Error {
  accuracy: number | null;

  constructor(accuracy: number | null) {
    super(
      accuracy
        ? `Location accuracy is only about ${Math.round(accuracy)} meters.`
        : "A precise location could not be determined."
    );
    this.name = "LocationAccuracyError";
    this.accuracy = accuracy;
  }
}

type PreciseLocationOptions = {
  targetAccuracy?: number;
  maximumAccuracy?: number;
  timeout?: number;
};

export function getPreciseLocation({
  targetAccuracy = TARGET_LOCATION_ACCURACY_METERS,
  maximumAccuracy = MAX_LOCATION_ACCURACY_METERS,
  timeout = 10000,
}: PreciseLocationOptions = {}): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      reject(
        new Error(
          "Geolocation is not supported by this device."
        )
      );
      return;
    }

    const positions: GeolocationPosition[] = [];
    let settled = false;
    let watchId: number | null = null;
    let timerId: number | null = null;

    const finish = (
      callback: () => void
    ) => {
      if (settled) return;
      settled = true;

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      if (timerId !== null) {
        window.clearTimeout(timerId);
      }

      callback();
    };

    const considerPosition = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(accuracy)) return;
      positions.push(position);
      if (accuracy <= targetAccuracy) finish(() => resolve(position));
    };

    // A recent network/GPS fix often returns immediately on mobile. Keep
    // refining it with watchPosition until the requested accuracy is reached.
    navigator.geolocation.getCurrentPosition(
      considerPosition,
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 4000 }
    );

    timerId = window.setTimeout(() => {
      const bestPosition = positions
        .slice()
        .sort(
          (a, b) =>
            a.coords.accuracy -
            b.coords.accuracy
        )[0];

      const accuracy =
        bestPosition?.coords.accuracy ??
        null;

      if (
        bestPosition &&
        accuracy !== null &&
        accuracy <= maximumAccuracy
      ) {
        finish(() =>
          resolve(bestPosition)
        );
        return;
      }

      finish(() =>
        reject(
          new LocationAccuracyError(
            accuracy
          )
        )
      );
    }, timeout);

    watchId = navigator.geolocation.watchPosition(
      considerPosition,
      (error) => {
        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          finish(() => reject(error));
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout,
      }
    );
  });
}

export function formatLocationAccuracy(
  accuracy: number
) {
  return Math.max(
    1,
    Math.round(accuracy)
  );
}
