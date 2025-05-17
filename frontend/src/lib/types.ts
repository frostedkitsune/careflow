// type for prescription data by appointmentID
export interface PrescriptionData {
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    emergency_person: string;
    emergency_relation: string;
    emergency_number: string;
  };
  prescription: {
    id: number;
    observation: string;
    medication: string;
    advise: string;
    test: string;
  };
}

// fetched record data model
export interface RecordData {
  id: number;
  reason: string;
  record_data: string;
  doctor_id_id: number;
  patient_id_id: number;
}