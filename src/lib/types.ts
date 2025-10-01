export interface Bot {
  id : string;
  name : string;
  uid : string;
  prompt : string;
  createdAt : string;
  updatedAt : string;
}

export interface Employee {
  id : string;
  name: string;
  department: string;
  floor: string;
  room : string;
  status: 'Available' | 'In Meeting' | 'Away'
}

export interface Visitor {
  id : string;
  name: string;
  appointment : string;
  expectedEmployee : string;
  phoneNumber ?: string;
}

export interface CallLog {
  id : string;
  botId : string;
  visitor : string;
  employee : string;
  department: string;
  arrivalTime: string;
  duration?: number;
  transcript?: string;
  status: 'completed' | 'missed' | 'in-progress';
}

export interface PreCallPayload {
  call_id?: string;
  from_number?: string;
  to_number: string;
  caller_number?: string;
  phone?: string;
  direction?: string;
}

export interface FunctionCallPayload {
  call_id: string;
  function_name: string;
  arguments: {
    employee_name: string;
  };
}

export interface PostCallPayload {
  call_id: string;
  transcript: string;
  duration: number;
  status: string;
  dynamic_variables?: Record<string, unknown>;
}