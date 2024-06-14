import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';

export interface IFormProps {
  register: UseFormRegister<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  reset: UseFormReset<FieldValues>;
  control: Control<FieldValues, any>;
  setValue: UseFormSetValue<FieldValues>;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
  trigger: UseFormTrigger<FieldValues>;
  errors: FieldErrors<FieldValues>;
}
