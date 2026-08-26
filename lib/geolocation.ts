export const TARGET_LOCATION_ACCURACY_METERS = 25;
export const MAX_LOCATION_ACCURACY_METERS = 100;

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
  timeout = 20000,
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
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          !Number.isFinite(accuracy)
        ) {
          return;
        }

        positions.push(position);

        if (accuracy <= targetAccuracy) {
          finish(() => resolve(position));
        }
      },
      (error) => {
        if (
          error.code ===
            error.PERMISSION_DENIED ||
          positions.length === 0
        ) {
          finish(() => reject(error));
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: timeout + 5000,
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
