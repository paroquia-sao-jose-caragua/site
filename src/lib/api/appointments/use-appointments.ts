import { useQuery, useMutation } from '@tanstack/react-query';
import { getAppointmentSettings } from './get-settings';
import { getAppointmentServices } from './get-services';
import { getPastoralAgents } from './get-agents';
import { getAvailableSlots } from './get-available-slots';
import { createAppointment } from './create-appointment';
import { trackAppointment, cancelAppointment } from './track-appointment';
import type { CreateAppointmentInput } from '@/entities/appointment';

export const useAppointmentSettings = () => {
  return useQuery({
    queryKey: ['appointment-settings'],
    queryFn: getAppointmentSettings,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAppointmentServices = () => {
  return useQuery({
    queryKey: ['appointment-services'],
    queryFn: getAppointmentServices,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const usePastoralAgents = (serviceId?: string) => {
  return useQuery({
    queryKey: ['pastoral-agents', serviceId],
    queryFn: () => getPastoralAgents(serviceId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAvailableSlots = (agentId?: string, date?: string, serviceId?: string) => {
  return useQuery({
    queryKey: ['available-slots', agentId, date, serviceId],
    queryFn: () => {
      if (!agentId || !date) return [];
      return getAvailableSlots({ agentId, date, serviceId });
    },
    enabled: Boolean(agentId && date),
  });
};

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => createAppointment(input),
  });
};

export const useTrackAppointment = (token?: string) => {
  return useQuery({
    queryKey: ['track-appointment', token],
    queryFn: () => {
      if (!token) return null;
      return trackAppointment(token);
    },
    enabled: Boolean(token),
  });
};

export const useCancelAppointment = () => {
  return useMutation({
    mutationFn: ({ token, reason }: { token: string; reason: string }) =>
      cancelAppointment(token, reason),
  });
};
