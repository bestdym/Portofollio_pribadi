import { supabase } from '../lib/supabase';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const submitContactMessage = async (data: ContactMessage) => {
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        name: data.name,
        email: data.email,
        message: data.message,
      }
    ]);

  if (error) {
    console.error('Error submitting message:', error);
    throw new Error('Failed to send message. Please try again.');
  }

  return true;
};
