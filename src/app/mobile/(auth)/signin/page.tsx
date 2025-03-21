import React from 'react';

import { FormProvider } from './_components/context/sign-in-context';
import { FormStepper } from './_components/form/form-stepper';

export default function LoginPage() {
  return (
    <FormProvider>
      <FormStepper />
    </FormProvider>
  );
}
