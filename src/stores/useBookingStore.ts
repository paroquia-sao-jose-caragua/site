import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Appointment,
  AppointmentService,
  AvailableSlot,
  PastoralAgent,
} from "@/entities/appointment";

interface BookingState {
  currentStep: number;
  selectedService: AppointmentService | null;
  selectedAgent: PastoralAgent | null;
  selectedDate: string;
  selectedSlot: AvailableSlot | null;
  selectedTopic: string;
  requesterNotes: string;
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  requesterRelationship: string;
  communityId: string;
  patientName: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  referencePoint: string;
  isBedridden: boolean;
  canSwallowHost: boolean;
  isLucid: boolean;
  createdAppointment: Appointment | null;
  _hasHydrated: boolean;
}

interface BookingActions {
  setCurrentStep: (step: number) => void;
  setSelectedService: (service: AppointmentService | null) => void;
  setSelectedAgent: (agent: PastoralAgent | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSlot: (slot: AvailableSlot | null) => void;
  setSelectedTopic: (topic: string) => void;
  setRequesterNotes: (notes: string) => void;
  setRequesterName: (name: string) => void;
  setRequesterPhone: (phone: string) => void;
  setRequesterEmail: (email: string) => void;
  setRequesterRelationship: (rel: string) => void;
  setCommunityId: (id: string) => void;
  setPatientName: (name: string) => void;
  setCep: (cep: string) => void;
  setStreet: (street: string) => void;
  setNumber: (number: string) => void;
  setNeighborhood: (neighborhood: string) => void;
  setComplement: (complement: string) => void;
  setReferencePoint: (ref: string) => void;
  setIsBedridden: (val: boolean) => void;
  setCanSwallowHost: (val: boolean) => void;
  setIsLucid: (val: boolean) => void;
  setCreatedAppointment: (appointment: Appointment | null) => void;
  setHasHydrated: (state: boolean) => void;
  resetBooking: () => void;
}

const initialBookingState: Omit<BookingState, "_hasHydrated"> = {
  currentStep: 1,
  selectedService: null,
  selectedAgent: null,
  selectedDate: "",
  selectedSlot: null,
  selectedTopic: "",
  requesterNotes: "",
  requesterName: "",
  requesterPhone: "",
  requesterEmail: "",
  requesterRelationship: "",
  communityId: "",
  patientName: "",
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  complement: "",
  referencePoint: "",
  isBedridden: false,
  canSwallowHost: true,
  isLucid: true,
  createdAppointment: null,
};

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set) => ({
      ...initialBookingState,
      _hasHydrated: false,

      setCurrentStep: (currentStep) => set({ currentStep }),
      setSelectedService: (selectedService) => set({ selectedService }),
      setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
      setSelectedTopic: (selectedTopic) => set({ selectedTopic }),
      setRequesterNotes: (requesterNotes) => set({ requesterNotes }),
      setRequesterName: (requesterName) => set({ requesterName }),
      setRequesterPhone: (requesterPhone) => set({ requesterPhone }),
      setRequesterEmail: (requesterEmail) => set({ requesterEmail }),
      setRequesterRelationship: (requesterRelationship) =>
        set({ requesterRelationship }),
      setCommunityId: (communityId) => set({ communityId }),
      setPatientName: (patientName) => set({ patientName }),
      setCep: (cep) => set({ cep }),
      setStreet: (street) => set({ street }),
      setNumber: (number) => set({ number }),
      setNeighborhood: (neighborhood) => set({ neighborhood }),
      setComplement: (complement) => set({ complement }),
      setReferencePoint: (referencePoint) => set({ referencePoint }),
      setIsBedridden: (isBedridden) => set({ isBedridden }),
      setCanSwallowHost: (canSwallowHost) => set({ canSwallowHost }),
      setIsLucid: (isLucid) => set({ isLucid }),
      setCreatedAppointment: (createdAppointment) => set({ createdAppointment }),
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      resetBooking: () => set({ ...initialBookingState }),
    }),
    {
      name: "paroquia-agendamento-storage",
      partialize: ({ _hasHydrated, ...persisted }) => persisted,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
