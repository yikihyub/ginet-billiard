import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useStoreInfo } from '@/hooks/login/useStoreInfo';
import { StoreInfoFormProps } from '@/types/(login)/store-info';

export function StoreInfoForm({ onNext }: StoreInfoFormProps) {
  const {
    formData,
    errors,
    showError,
    handleInputChange,
    handleBusinessNumberChange,
    handlestoreNumberChange,
    handleSubmit,
  } = useStoreInfo(onNext);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">매장 기본 정보 입력</h1>
        <p className="mt-2 text-gray-600">매장 정보를 입력해주세요.</p>
      </div>

      {showError && (
        <Alert variant="destructive">
          <AlertDescription>
            모든 필수 항목을 올바르게 입력해주세요.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessNumber">
            사업자등록번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessNumber"
            name="businessNumber"
            placeholder="000-00-00000"
            value={formData.businessNumber}
            onChange={handleBusinessNumberChange}
            maxLength={12}
          />
          {errors.businessNumber && (
            <p className="text-sm text-red-500">{errors.businessNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeName">
            매장명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="storeName"
            name="storeName"
            placeholder="매장명을 입력해주세요"
            value={formData.storeName}
            onChange={handleInputChange}
          />
          {errors.storeName && (
            <p className="text-sm text-red-500">{errors.storeName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">
            대표자명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ownerName"
            name="ownerName"
            placeholder="대표자명을 입력해주세요"
            value={formData.ownerName}
            onChange={handleInputChange}
          />
          {errors.ownerName && (
            <p className="text-sm text-red-500">{errors.ownerName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="storeNumber">
            매장 전화번호 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="storeNumber"
            name="storeNumber"
            placeholder="02-000-0000 또는 010-0000-0000"
            value={formData.storeNumber}
            onChange={handlestoreNumberChange}
            maxLength={13}
          />
          {errors.storeNumber && (
            <p className="text-sm text-red-500">{errors.storeNumber}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="h-12 w-full">
          다음
        </Button>
      </div>
    </form>
  );
}
