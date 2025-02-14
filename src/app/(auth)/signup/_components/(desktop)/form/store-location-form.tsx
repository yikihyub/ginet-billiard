import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import AddressSearch from '../search/address-search';

import { StoreLocationFormProps } from '@/types/(login)/store-location-info';

import { useStoreLocation } from '@/hooks/login/useStoreLocation';

import { PARKING_TYPES } from '@/constants/(login)/store-location-form/store-location-form';

export function StoreLocationForm({ onNext }: StoreLocationFormProps) {
  const {
    formData,
    errors,
    showError,
    handleAddressChange,
    handleInputChange,
    handleParkingTypeChange,
    handleSubmit,
  } = useStoreLocation(onNext);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">매장 위치 정보 입력</h1>
        <p className="mt-2 text-gray-600">
          매장의 위치와 주차 정보를 입력해주세요.
        </p>
      </div>

      {showError && (
        <Alert variant="destructive">
          <AlertDescription>필수 항목을 모두 입력해주세요.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">
            매장 주소 <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="address"
              name="address"
              placeholder="매장 주소를 입력해주세요"
              value={formData.address}
              onChange={handleInputChange}
              readOnly
            />
            {/* <AddressSearch onChange={handleAddressChange} /> */}
          </div>
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="directions">찾아오시는 길</Label>
          <Textarea
            id="directions"
            name="directions"
            placeholder="찾아오시는 길에 대한 설명을 입력해주세요"
            value={formData.directions}
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parkingType">
            주차장 형태 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.parkingType}
            onValueChange={handleParkingTypeChange}
          >
            <SelectTrigger id="parkingType">
              <SelectValue placeholder="주차장 형태를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {PARKING_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parkingType && (
            <p className="text-sm text-red-500">{errors.parkingType}</p>
          )}
        </div>

        {formData.parkingType && formData.parkingType !== 'none' && (
          <div className="space-y-2">
            <Label htmlFor="parkingCapacity">
              주차 가능 대수 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="parkingCapacity"
              name="parkingCapacity"
              type="number"
              min="1"
              placeholder="주차 가능 대수를 입력해주세요"
              value={formData.parkingCapacity}
              onChange={handleInputChange}
            />
            {errors.parkingCapacity && (
              <p className="text-sm text-red-500">{errors.parkingCapacity}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="parkingNote">주차 안내</Label>
          <Textarea
            id="parkingNote"
            name="parkingNote"
            placeholder="주차 관련 추가 안내사항을 입력해주세요"
            value={formData.parkingNote}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" className="h-12 w-full">
          이전
        </Button>
        <Button type="submit" className="h-12 w-full">
          다음
        </Button>
      </div>
    </form>
  );
}
