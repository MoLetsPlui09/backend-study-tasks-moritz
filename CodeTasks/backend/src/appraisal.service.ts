import {
  AppraisalAction,
  AppraisalData,
  AppraisalFormData,
  AppraisalState,
  Permissions,
  UserRole,
} from './interfaces';
import { StateMachine } from './state-machine';

const stateMachine = new StateMachine();

let currentState: AppraisalState = AppraisalState.TAKE_IN;
let formData: AppraisalFormData = {
  customerName: '',
  vehicleType: '',
  licensePlate: '',
  damages: {
    windshield: false,
    paint: false,
    rim: false,
    technical: false,
  },
};

function buildPermissions(role: UserRole): Permissions {
  // TODO Story 1: Implement permission logic according to the current state and role
  if(role == "CHECK_IN"){
    return {
      actions: {
        [AppraisalAction.RELEASE_APPRAISAL]: true,
        [AppraisalAction.CLOSE_APPRAISAL]: false,
        [AppraisalAction.APPROVE_APPRAISAL]: false,
        [AppraisalAction.DENY_APPRAISAL]: false,
      },
      fields: {
        customerName: true,
        vehicleType: true,
        licensePlate: true,
        damages: false,
        submitButton: false,
        rejectButton: false,
      },
    };
  }else if(role == "APPRAISER"){
    return {
      actions: {
        [AppraisalAction.RELEASE_APPRAISAL]: false,
        [AppraisalAction.CLOSE_APPRAISAL]: true,
        [AppraisalAction.APPROVE_APPRAISAL]: false,
        [AppraisalAction.DENY_APPRAISAL]: false,
      },
      fields: {
        customerName: false,
        vehicleType: false,
        licensePlate: false,
        damages: true,
        submitButton: false,
        rejectButton: false,
      },
    };
  }else if(role == "CHECKOUT"){
    return {
      actions: {
        [AppraisalAction.RELEASE_APPRAISAL]: false,
        [AppraisalAction.CLOSE_APPRAISAL]: false,
        [AppraisalAction.APPROVE_APPRAISAL]: true,
        [AppraisalAction.DENY_APPRAISAL]: true,
      },
      fields: {
        customerName: false,
        vehicleType: false,
        licensePlate: false,
        damages: false,
        submitButton: true,
        rejectButton: true,
      },
    };
  }
  return {
      actions: {
        [AppraisalAction.RELEASE_APPRAISAL]: false,
        [AppraisalAction.CLOSE_APPRAISAL]: false,
        [AppraisalAction.APPROVE_APPRAISAL]: false,
        [AppraisalAction.DENY_APPRAISAL]: false,
      },
      fields: {
        customerName: false,
        vehicleType: false,
        licensePlate: false,
        damages: false,
        submitButton: false,
        rejectButton: false,
      },
    };
}

export function getAppraisal(role: UserRole): AppraisalData {
  return {
    state: currentState,
    formData,
    permissions: buildPermissions(role),
  };
}

export function performAction(
  action: AppraisalAction,
  role: UserRole
): { success: boolean; message: string; data?: AppraisalData } {
  // TODO Story 1: Implement state transition execution
  if(action == "RELEASE_APPRAISAL" && role == "CHECK_IN"){
    currentState =AppraisalState.READY_FOR_APPRAISAL;
    return {
      success: true,
      message: 'READY_FOR_APPRAISAL',
    };
  }else if(action == "CLOSE_APPRAISAL" && role == "APPRAISER"){
    currentState =AppraisalState.APPRAISAL_CLOSED;
    return {
      success: true,
      message: 'APPRAISAL_CLOSED',
    }
  }else if(action == "APPROVE_APPRAISAL" && role == "CHECKOUT"){
    currentState =AppraisalState.APPRAISAL_APPROVED;
    return {
      success: true,
      message: 'APPRAISAL_APPROVED',
    }
  }else if(action == "DENY_APPRAISAL" && role == "CHECKOUT"){
    currentState =AppraisalState.APPRAISAL_DENIED;
    return {
      success: true,
      message: 'APPRAISAL_APPROVED',
    }
  }
  return {
    success: false,
    message: 'Not implemented',
  };
}

export function updateFormData(
  patch: Partial<AppraisalFormData>
): AppraisalFormData {
  formData = {
    ...formData,
    ...patch,
    damages: {
      ...formData.damages,
      ...(patch.damages ?? {}),
    },
  };
  return formData;
}

export function resetAppraisal(): void {
  currentState = AppraisalState.TAKE_IN;
  formData = {
    customerName: '',
    vehicleType: '',
    licensePlate: '',
    damages: {
      windshield: false,
      paint: false,
      rim: false,
      technical: false,
    },
  };
}
