import React from 'react';

import { FormProvider } from '../_components/(desktop)/context/sign-in-context';
import { FormStepper } from '../_components/(desktop)/form/form-stepper';

export default function LoginPage() {
  return (
    <FormProvider>
      <FormStepper />
    </FormProvider>
  );
}
