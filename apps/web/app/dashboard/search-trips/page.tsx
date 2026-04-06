'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest, getToken } from '@/lib/api';
import { isWithinCdmxEdomex } from '@/lib/geo-coverage';
import { loadGoogleMapsPlaces } from '@/lib/google-maps';
import { AvailableTrip, Reservation } from '@/lib/reservations';
import { getTripStatusMeta } from '@/lib/status';

const RESERVATION_ACTIVE_STATUSES = new Set(['confirmed', 'paid', 'boarded', 'completed']);

function buildTripsUrl(referenceLat?: number | null, referenceLng?: number | null) {
  const params = new URLSearchParams();
  if (typeof referenceLat === 'number' && typeof referenceLng === 'number') {
    params.set('lat', referenceLat.toString());
    params.set('lng', referenceLng.toString());
  }

  const query = params.toString();
  return query ? `/trips/available?${query}` : '/trips/available';
}

function normalize(value: string | null | undefined) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function SearchTripsPage() {
  const [trips, setTrips] = useState<AvailableTrip[]>([]);
  const [reservedTripIds, setReservedTripIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [referenceLabel, setReferenceLabel] = useState<string>('Sin referencia de ubicacion');
  const [referencePoint, setReferencePoint] = useState<{ lat: number; lng: number } | null>(null);

  const [destinationFilter, setDestinationFilter] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('');

  const originRefInput = useRef<HTMLInputElement | null>(null);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const loadTrips = useCallback(async (lat?: number | null, lng?: number | null) => {
    const token = getToken();
    if (!token) {
      setError('No hay sesion activa.');
      setLoading(false);
      return;
    }

    try {
      const [availableTrips, myReservations] = await Promise.all([
        apiRequest<AvailableTrip[]>(buildTripsUrl(lat, lng), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        apiRequest<Reservation[]>('/reservations/my-reservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      const takenTripIds = new Set(
        myReservations.filter((reservation) => RESERVATION_ACTIVE_STATUSES.has(reservation.status)).map((reservation) => reservation.tripId)
      );

      setTrips(availableTrips);
      setReservedTripIds(takenTripIds);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron cargar los viajes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  useEffect(() => {
    const apiKey = mapsApiKey;
    if (!apiKey) return;

    let cancelled = false;

    async function setupOriginAutocomplete() {
      try {
        await loadGoogleMapsPlaces(apiKey as string);
        if (cancelled || !window.google?.maps?.places || !originRefInput.current) return;

        const googleMaps = window.google.maps;
        const bounds = new googleMaps.LatLngBounds(new googleMaps.LatLng(18.3, -100.9), new googleMaps.LatLng(20.35, -98.35));
        const ac = new googleMaps.places.Autocomplete(originRefInput.current, {
          fields: ['formatted_address', 'geometry'],
          componentRestrictions: { country: 'mx' },
          strictBounds: true,
          bounds,
          types: ['geocode']
        });

        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          const lat = place?.geometry?.location?.lat?.();
          const lng = place?.geometry?.location?.lng?.();

          if (typeof lat !== 'number' || typeof lng !== 'number') return;

          if (!isWithinCdmxEdomex(lat, lng)) {
            setError('La referencia seleccionada esta fuera de cobertura (CDMX y Estado de Mexico).');
            return;
          }

          setReferencePoint({ lat, lng });
          setReferenceLabel(place?.formatted_address || 'Origen seleccionado');
          setError(null);
          setLoading(true);
          void loadTrips(lat, lng);
        });
      } catch {
        // keep manual mode
      }
    }

    void setupOriginAutocomplete();

    return () => {
      cancelled = true;
    };
  }, [mapsApiKey, loadTrips]);

  async function useCurrentLocation() {
    setGeoLoading(true);
    setError(null);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 60000
        });
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (!isWithinCdmxEdomex(lat, lng)) {
        setError('Tu ubicacion actual esta fuera de cobertura (CDMX y Estado de Mexico).');
        return;
      }

      setReferencePoint({ lat, lng });
      setReferenceLabel('Ubicacion actual');
      setLoading(true);
      await loadTrips(lat, lng);
    } catch {
      setError('No se pudo obtener tu ubicacion actual. Revisa permisos del navegador.');
    } finally {
      setGeoLoading(false);
    }
  }

  const filteredTrips = useMemo(() => {
    const destinationNeedle = normalize(destinationFilter);
    const municipalityNeedle = normalize(municipalityFilter);

    return trips.filter((trip) => {
      const destination = normalize(trip.route?.destination);
      const origin = normalize(trip.route?.origin);
      const title = normalize(trip.route?.title);
      const departure = trip.departureTimeSnapshot;

      const destinationMatch = !destinationNeedle || destination.includes(destinationNeedle) || title.includes(destinationNeedle);
      const municipalityMatch = !municipalityNeedle || origin.includes(municipalityNeedle) || destination.includes(municipalityNeedle) || title.includes(municipalityNeedle);
      const scheduleMatch = !scheduleFilter || departure.startsWith(scheduleFilter);

      return destinationMatch && municipalityMatch && scheduleMatch;
    });
  }, [trips, destinationFilter, municipalityFilter, scheduleFilter]);

  if (loading) {
    return <p className="text-slate-700">Cargando viajes disponibles...</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Buscar viajes</h1>
          <p className="text-sm text-slate-600">Encuentra tu ruta por destino, municipio/zona y horario.</p>
          <p className="text-xs text-slate-500">Referencia activa: {referenceLabel}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/my-reservations" className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
            Mis reservas
          </Link>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              void loadTrips(referencePoint?.lat, referencePoint?.lng);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            Recargar
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          Destino
          <input
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Ej. Pantitlan, Indios Verdes, Centro"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Municipio o zona de salida
          <input
            value={municipalityFilter}
            onChange={(event) => setMunicipalityFilter(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Ej. Ecatepec, Tecamac, Acolman"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Horario de salida
          <input
            type="time"
            value={scheduleFilter}
            onChange={(event) => setScheduleFilter(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-700">
          Origen de referencia (CDMX/Edomex)
          <input ref={originRefInput} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Ej. Toreo, Naucalpan" />
        </label>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => void useCurrentLocation()} disabled={geoLoading} className="rounded-md border border-sky-300 px-3 py-2 text-sm text-sky-700 disabled:opacity-60">
          {geoLoading ? 'Ubicando...' : 'Usar mi ubicacion'}
        </button>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}

      {filteredTrips.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700">No hay viajes que coincidan con tus filtros.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTrips.map((trip) => {
            const statusMeta = getTripStatusMeta(trip.status);
            const alreadyTaken = reservedTripIds.has(trip.id);

            return (
              <article key={trip.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {trip.route?.title || `${trip.route?.origin || 'Ruta'} -> ${trip.route?.destination || ''}`}
                    </h2>
                    <p className="text-xs text-slate-500">Viaje # {trip.publicId ?? '-'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusMeta.className}`}>{statusMeta.label}</span>
                    {alreadyTaken && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Ya tomado</span>}
                    {typeof trip.nearbyDistanceKm === 'number' && (
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${trip.isNearUser ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'}`}>
                        {trip.isNearUser ? 'Cerca de ti' : `${trip.nearbyDistanceKm.toFixed(1)} km`}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700">Fecha: {new Date(trip.tripDate).toLocaleDateString()}</p>
                <p className="text-sm text-slate-700">Salida: {trip.departureTimeSnapshot}</p>
                <p className="text-sm text-slate-700">Llegada estimada: {trip.estimatedArrivalTimeSnapshot}</p>
                <p className="text-sm text-slate-700">Precio: ${trip.pricePerSeatSnapshot.toFixed(2)} MXN</p>
                <p className="text-sm text-slate-700">Asientos disponibles: {trip.remainingSeats}</p>
                {trip.route?.stopsText && <p className="text-sm text-slate-700">Referencia adicional: {trip.route.stopsText}</p>}

                <div className="mt-4">
                  {alreadyTaken ? (
                    <Link href="/dashboard/my-reservations" className="rounded-md border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700">
                      Ver mi reserva
                    </Link>
                  ) : (
                    <Link href={`/dashboard/trips/${trip.id}/reserve`} className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white">
                      Reservar viaje
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
