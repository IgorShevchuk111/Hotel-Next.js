'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export async function updateGuest(formData) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  if (!/^[A-Za-z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please enter a valid national ID');

  const updateData = { nationalID, countryFlag, nationality };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function deleteReservation(bookingId) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');
  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');
  revalidatePath('/account/reservations');
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get('bookingId'));

  // Authentication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  // Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to update this booking');

  // Building update data
  const updatedFields = {
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
  };

  // Mutation
  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select()
    .single();

  // Error handling
  if (error) {
    throw new Error('Booking could not be updated');
  }

  // Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // Redirection
  redirect(`/account/reservations`);
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
