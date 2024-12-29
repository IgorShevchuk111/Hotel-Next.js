'use server';

import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isWithinInterval } from 'date-fns';

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

export async function createBooking(bookingData, bookedDates, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  if (!bookingData.startDate || !bookingData.endDate) {
    throw new Error('Start date and end date are required.');
  }

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const isOverlapping = bookedDates.some((date) =>
    isWithinInterval(date, {
      start: bookingData.startDate,
      end: bookingData.endDate,
    })
  );

  if (isOverlapping) {
    throw new Error('The new booking dates overlap with an existing booking.');
  }

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou');
}

export async function deleteBooking(bookingId) {
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
